import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Get a page by ID (authenticated, requires ownership)
 */
export const getPage = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
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

    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime) {
      return null;
    }

    // Verify ownership
    if (page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    return page;
  },
});

/**
 * Get all pages for the current user
 */
export const getUserPages = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return [];
    }

    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    return pages;
  },
});

/**
 * Check if a slug is available
 */
export const isSlugAvailable = query({
  args: {
    slug: v.string(),
    excludePageId: v.optional(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!existingPage) {
      return true;
    }

    // If the existing page is the one we're excluding (for updates), it's available
    if (args.excludePageId && existingPage._id === args.excludePageId) {
      return true;
    }

    // If the existing page is soft-deleted, the slug is available
    if (existingPage.deletionTime) {
      return true;
    }

    return false;
  },
});

/**
 * Get page with theme information
 */
export const getPageWithTheme = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
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

    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime) {
      return null;
    }

    // Verify ownership
    if (page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    // Get theme if it exists
    let theme = null;
    if (page.themeId) {
      theme = await ctx.db.get(page.themeId);
    }

    return {
      ...page,
      theme,
    };
  },
});
