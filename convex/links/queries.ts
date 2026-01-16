import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Get a link by ID (authenticated, requires identity ownership)
 */
export const getLink = query({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this link",
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

    const link = await ctx.db.get(args.linkId);

    if (!link || link.deletionTime) {
      return null;
    }

    // Get the identity to verify ownership
    if (!link.identityId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated identity",
      });
    }
    const identity = await ctx.db.get(link.identityId);
    if (!identity || ("deletionTime" in identity && identity.deletionTime) || ("userId" in identity && identity.userId !== user._id)) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this link",
      });
    }

    return link;
  },
});

/**
 * Get all links for an identity (authenticated, requires identity ownership)
 */
export const getIdentityLinks = query({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view these links",
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

    // Verify identity ownership
    const identity = await ctx.db.get(args.identityId);
    if (!identity || identity.deletionTime || identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
      });
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_identity", (q) =>
        q.eq("identityId", args.identityId).eq("deletionTime", undefined)
      )
      .collect();

    // Sort by orderIndex
    return links.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  },
});

/**
 * Get link stats for an identity (authenticated, requires identity ownership)
 */
export const getIdentityLinkStats = query({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    const authIdentity = await ctx.auth.getUserIdentity();
    if (!authIdentity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view link stats",
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

    // Verify identity ownership
    const identity = await ctx.db.get(args.identityId);
    if (!identity || identity.deletionTime || identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
      });
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_identity", (q) =>
        q.eq("identityId", args.identityId).eq("deletionTime", undefined)
      )
      .collect();

    const activeLinks = links.filter((l) => l.isActive);
    const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);
    const topLinks = [...links]
      .sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))
      .slice(0, 5);

    return {
      totalLinks: links.length,
      activeLinks: activeLinks.length,
      totalClicks,
      topLinks,
    };
  },
});
