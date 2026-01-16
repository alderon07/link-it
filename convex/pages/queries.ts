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
 * Get all links across all user pages (for All Links page)
 */
export const getAllUserLinks = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { links: [], stats: { total: 0, active: 0, totalClicks: 0 } };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return { links: [], stats: { total: 0, active: 0, totalClicks: 0 } };
    }

    // Get all user pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    const pageMap = new Map(pages.map((p) => [p._id.toString(), p]));

    // Collect all links from all pages
    const allLinks: Array<{
      _id: string;
      pageId: string;
      pageName: string;
      pageSlug: string;
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

    for (const page of pages) {
      const links = await ctx.db
        .query("links")
        .withIndex("by_page", (q) =>
          q.eq("pageId", page._id).eq("deletionTime", undefined)
        )
        .collect();

      for (const link of links) {
        allLinks.push({
          _id: link._id,
          pageId: page._id,
          pageName: page.name,
          pageSlug: page.slug,
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
