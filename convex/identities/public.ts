import { query, mutation, internalMutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { now, getOrCreateUser } from "../lib/utils";

/**
 * Get a public identity by slug (no authentication required)
 */
export const getPublicIdentity = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.db
      .query("identities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!identity || identity.deletionTime || !identity.isPublic) {
      return null;
    }

    // Get the user info
    const user = await ctx.db.get(identity.userId);
    if (!user || user.deletionTime) {
      return null;
    }

    // Get the theme if it exists
    let theme = null;
    if (identity.themeId) {
      theme = await ctx.db.get(identity.themeId);
    }

    // Use denormalized viewCount for O(1) performance at scale
    // The counter is maintained by recordIdentityView mutation
    return {
      ...identity,
      user: {
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      theme,
    };
  },
});

/**
 * Get a public identity by username (no authentication required)
 * This looks up the user's default or first public identity
 */
export const getPublicIdentityByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    // Get user settings to find default identity
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let identity = null;

    // Try to get the default identity first
    if (settings?.defaultIdentityId) {
      identity = await ctx.db.get(settings.defaultIdentityId);
      if (identity && (identity.deletionTime || !identity.isPublic)) {
        identity = null;
      }
    }

    // If no default identity, get the first public identity
    if (!identity) {
      const userIdentities = await ctx.db
        .query("identities")
        .withIndex("by_user", (q) =>
          q.eq("userId", user._id).eq("deletionTime", undefined)
        )
        .collect();

      identity = userIdentities.find((p) => p.isPublic) || null;
    }

    if (!identity) {
      return null;
    }

    // Get the theme if it exists
    let theme = null;
    if (identity.themeId) {
      theme = await ctx.db.get(identity.themeId);
    }

    return {
      ...identity,
      user: {
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      theme,
    };
  },
});

/**
 * Record an identity view for analytics
 * 
 * Security measures:
 * - Requires a visitorId for deduplication
 * - Only counts one view per visitor per hour per identity
 * - Validates identity exists and is public
 * - Validates visitorId format
 */
export const recordIdentityView = mutation({
  args: {
    identityId: v.id("identities"),
    visitorId: v.string(), // Required for deduplication
  },
  handler: async (ctx, args) => {
    // Validate visitorId format (must be non-empty and reasonable length)
    if (!args.visitorId || args.visitorId.length < 10 || args.visitorId.length > 100) {
      return { success: false, reason: "invalid_visitor_id" };
    }

    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime || !identity.isPublic) {
      return { success: false, reason: "invalid_identity" };
    }

    // Deduplication: Check if this visitor has ANY view for this identity in the last hour
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const oneHourAgo = now() - ONE_HOUR_MS;

    // Use the compound index for efficient lookup
    const recentViews = await ctx.db
      .query("identityViews")
      .withIndex("by_identity_visitor", (q) =>
        q.eq("identityId", args.identityId).eq("visitorId", args.visitorId)
      )
      .collect();

    // Check if any view is within the last hour
    const hasRecentView = recentViews.some((view) => view.viewedAt >= oneHourAgo);

    // If visitor already viewed within the hour, don't count again
    if (hasRecentView) {
      return { success: false, reason: "duplicate_view" };
    }

    // Increment the denormalized counter (O(1) for reads at scale)
    await ctx.db.patch(args.identityId, {
      viewCount: (identity.viewCount ?? 0) + 1,
      updatedAt: now(),
    });

    // Record the view for deduplication and analytics
    await ctx.db.insert("identityViews", {
      identityId: args.identityId,
      viewedAt: now(),
      visitorId: args.visitorId,
    });

    return { success: true };
  },
});

/**
 * Reconcile view count for an identity
 *
 * This syncs the denormalized viewCount with the actual identityViews records.
 * Use this if the counter ever drifts from reality (e.g., after data migration,
 * seeding, or if records are manually deleted).
 *
 * This is an O(n) operation so use sparingly at scale.
 * Requires authentication and ownership verification.
 */
export const reconcileViewCount = mutation({
  args: {
    identityId: v.id("identities"),
  },
  handler: async (ctx, args) => {
    // Require authentication and verify ownership
    const user = await getOrCreateUser(ctx);

    const identity = await ctx.db.get(args.identityId);
    if (!identity) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    // Verify ownership
    if (identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to reconcile this identity",
      });
    }

    // Count actual view records
    const views = await ctx.db
      .query("identityViews")
      .withIndex("by_identity", (q) => q.eq("identityId", args.identityId))
      .collect();

    const actualCount = views.length;
    const previousCount = identity.viewCount ?? 0;

    // Update the denormalized counter
    await ctx.db.patch(args.identityId, {
      viewCount: actualCount,
      updatedAt: now(),
    });

    return {
      success: true,
      previousCount,
      actualCount,
      corrected: previousCount !== actualCount,
    };
  },
});

/**
 * Reconcile view counts for ALL identities
 *
 * WARNING: This is expensive at scale. Only use for maintenance/migration.
 * Consider running during low-traffic periods.
 *
 * This is an internal mutation - only callable from server code (e.g., cron jobs).
 */
export const reconcileAllViewCounts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identities = await ctx.db.query("identities").collect();

    let correctedCount = 0;

    for (const identity of identities) {
      const views = await ctx.db
        .query("identityViews")
        .withIndex("by_identity", (q) => q.eq("identityId", identity._id))
        .collect();

      const actualCount = views.length;
      const previousCount = identity.viewCount ?? 0;

      if (previousCount !== actualCount) {
        await ctx.db.patch(identity._id, {
          viewCount: actualCount,
          updatedAt: now(),
        });
        correctedCount++;
      }
    }

    return {
      success: true,
      totalIdentities: identities.length,
      correctedCount,
    };
  },
});
