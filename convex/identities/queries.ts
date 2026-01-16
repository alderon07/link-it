import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Get an identity by ID (authenticated, requires ownership)
 */
export const getIdentity = query({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this identity",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", authIdentity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime) {
      return null;
    }

    // Verify ownership
    if (identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
      });
    }

    return identity;
  },
});

/**
 * Get all identities for the current user
 */
export const getUserIdentities = query({
  args: {},
  handler: async (ctx) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", authIdentity.subject))
      .first();

    if (!user || user.deletionTime) {
      return [];
    }

    const identities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    return identities;
  },
});

/**
 * Check if a slug is available
 */
export const isSlugAvailable = query({
  args: {
    slug: v.string(),
    excludeIdentityId: v.optional(v.id("identities")),
  },
  handler: async (ctx, args) => {
    const existingIdentity = await ctx.db
      .query("identities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!existingIdentity) {
      return true;
    }

    // If the existing identity is the one we're excluding (for updates), it's available
    if (args.excludeIdentityId && existingIdentity._id === args.excludeIdentityId) {
      return true;
    }

    // If the existing identity is soft-deleted, the slug is available
    if (existingIdentity.deletionTime) {
      return true;
    }

    return false;
  },
});

/**
 * Get all links across all user identities (for All Links page)
 */
export const getAllUserLinks = query({
  args: {},
  handler: async (ctx) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      return { links: [], stats: { total: 0, active: 0, totalClicks: 0 } };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", authIdentity.subject))
      .first();

    if (!user || user.deletionTime) {
      return { links: [], stats: { total: 0, active: 0, totalClicks: 0 } };
    }

    // Get all user identities
    const identities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    const identityMap = new Map(identities.map((p) => [p._id.toString(), p]));

    // Collect all links from all identities
    const allLinks: Array<{
      _id: string;
      identityId: string;
      identityName: string;
      identitySlug: string;
      title: string;
      url: string | undefined;
      type: "link" | "header" | "divider" | undefined;
      description: string | undefined;
      icon: string | undefined;
      isActive: boolean | undefined;
      orderIndex: number | undefined;
      clickCount: number | undefined;
      updatedAt: number | undefined;
    }> = [];

    let totalClicks = 0;
    let activeCount = 0;

    for (const identity of identities) {
      const links = await ctx.db
        .query("links")
        .withIndex("by_identity", (q) =>
          q.eq("identityId", identity._id).eq("deletionTime", undefined)
        )
        .collect();

      for (const link of links) {
        allLinks.push({
          _id: link._id,
          identityId: identity._id,
          identityName: identity.name,
          identitySlug: identity.slug,
          title: link.title,
          url: link.url,
          type: link.type,
          description: link.description,
          icon: link.icon,
          isActive: link.isActive,
          orderIndex: link.orderIndex,
          clickCount: link.clickCount,
          updatedAt: link.updatedAt,
        });

        if (link.isActive) activeCount++;
        totalClicks += link.clickCount ?? 0;
      }
    }

    // Sort by most recently updated
    allLinks.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

    return {
      links: allLinks,
      stats: {
        total: allLinks.length,
        active: activeCount,
        totalClicks,
      },
    };
  },
});

/**
 * Get identity with theme information
 */
export const getIdentityWithTheme = query({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this identity",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", authIdentity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime) {
      return null;
    }

    // Verify ownership
    if (identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
      });
    }

    // Get theme if it exists
    let theme = null;
    if (identity.themeId) {
      theme = await ctx.db.get(identity.themeId);
    }

    return {
      ...identity,
      theme,
    };
  },
});
