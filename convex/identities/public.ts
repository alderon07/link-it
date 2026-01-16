import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { now } from "../lib/utils";

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
 * Increment view count for a public identity
 */
export const incrementViewCount = mutation({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime || !identity.isPublic) {
      return { success: false };
    }

    await ctx.db.patch(args.identityId, {
      viewCount: identity.viewCount + 1,
      updatedAt: now(),
    });

    return { success: true };
  },
});

/**
 * Record an identity view for analytics (future use)
 */
export const recordIdentityView = mutation({
  args: {
    identityId: v.id("identities"),
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime || !identity.isPublic) {
      return { success: false };
    }

    // Increment view count
    await ctx.db.patch(args.identityId, {
      viewCount: identity.viewCount + 1,
      updatedAt: now(),
    });

    // Record detailed analytics
    await ctx.db.insert("identityViews", {
      identityId: args.identityId,
      viewedAt: now(),
      visitorId: args.visitorId,
      userAgent: args.userAgent,
      referrer: args.referrer,
      country: args.country,
      city: args.city,
    });

    return { success: true };
  },
});
