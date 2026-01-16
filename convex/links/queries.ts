import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Get a link by ID (authenticated, requires page ownership)
 */
export const getLink = query({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this link",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
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

    // Get the page to verify ownership
    if (!link.pageId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated page",
      });
    }
    const page = await ctx.db.get(link.pageId);
    if (!page || ("deletionTime" in page && page.deletionTime) || ("userId" in page && page.userId !== user._id)) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this link",
      });
    }

    return link;
  },
});

/**
 * Get all links for a page (authenticated, requires page ownership)
 */
export const getPageLinks = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view these links",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Verify page ownership
    const page = await ctx.db.get(args.pageId);
    if (!page || page.deletionTime || page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_page", (q) =>
        q.eq("pageId", args.pageId).eq("deletionTime", undefined)
      )
      .collect();

    // Sort by orderIndex
    return links.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  },
});

/**
 * Get link stats for a page (authenticated, requires page ownership)
 */
export const getPageLinkStats = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view link stats",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Verify page ownership
    const page = await ctx.db.get(args.pageId);
    if (!page || page.deletionTime || page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_page", (q) =>
        q.eq("pageId", args.pageId).eq("deletionTime", undefined)
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
