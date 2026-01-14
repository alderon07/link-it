import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { now } from "../lib/utils";

/**
 * Get a public page by slug (no authentication required)
 */
export const getPublicPage = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!page || page.deletionTime || !page.isPublic) {
      return null;
    }

    // Get the user info
    const user = await ctx.db.get(page.userId);
    if (!user || user.deletionTime) {
      return null;
    }

    // Get the theme if it exists
    let theme = null;
    if (page.themeId) {
      theme = await ctx.db.get(page.themeId);
    }

    return {
      ...page,
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
 * Get a public page by username (no authentication required)
 * This looks up the user's default or first public page
 */
export const getPublicPageByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    // Get user settings to find default page
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let page = null;

    // Try to get the default page first
    if (settings?.defaultPageId) {
      page = await ctx.db.get(settings.defaultPageId);
      if (page && (page.deletionTime || !page.isPublic)) {
        page = null;
      }
    }

    // If no default page, get the first public page
    if (!page) {
      const userPages = await ctx.db
        .query("pages")
        .withIndex("by_user", (q) =>
          q.eq("userId", user._id).eq("deletionTime", undefined)
        )
        .collect();

      page = userPages.find((p) => p.isPublic) || null;
    }

    if (!page) {
      return null;
    }

    // Get the theme if it exists
    let theme = null;
    if (page.themeId) {
      theme = await ctx.db.get(page.themeId);
    }

    return {
      ...page,
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
 * Increment view count for a public page
 */
export const incrementViewCount = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime || !page.isPublic) {
      return { success: false };
    }

    await ctx.db.patch(args.pageId, {
      viewCount: page.viewCount + 1,
      updatedAt: now(),
    });

    return { success: true };
  },
});

/**
 * Record a page view for analytics (future use)
 */
export const recordPageView = mutation({
  args: {
    pageId: v.id("pages"),
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime || !page.isPublic) {
      return { success: false };
    }

    // Increment view count
    await ctx.db.patch(args.pageId, {
      viewCount: page.viewCount + 1,
      updatedAt: now(),
    });

    // Record detailed analytics
    await ctx.db.insert("pageViews", {
      pageId: args.pageId,
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
