import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { now } from "../lib/utils";

/**
 * Get public links for a page (no authentication required)
 * Only returns active links within their visibility window
 */
export const getPublicPageLinks = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime || !page.isPublic) {
      return [];
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_page_active", (q) =>
        q.eq("pageId", args.pageId).eq("isActive", true).eq("deletionTime", undefined)
      )
      .collect();

    // Filter by visibility window
    const currentTime = now();
    const visibleLinks = links.filter((link) => {
      if (link.visibleFrom && link.visibleFrom > currentTime) {
        return false;
      }
      if (link.visibleUntil && link.visibleUntil < currentTime) {
        return false;
      }
      return true;
    });

    // Sort by orderIndex
    return visibleLinks.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  },
});

/**
 * Get public links by page slug (no authentication required)
 */
export const getPublicLinksBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!page || page.deletionTime || !page.isPublic) {
      return [];
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_page_active", (q) =>
        q.eq("pageId", page._id).eq("isActive", true).eq("deletionTime", undefined)
      )
      .collect();

    // Filter by visibility window
    const currentTime = now();
    const visibleLinks = links.filter((link) => {
      if (link.visibleFrom && link.visibleFrom > currentTime) {
        return false;
      }
      if (link.visibleUntil && link.visibleUntil < currentTime) {
        return false;
      }
      return true;
    });

    // Sort by orderIndex
    return visibleLinks.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  },
});

/**
 * Track a link click (no authentication required)
 */
export const trackClick = mutation({
  args: {
    linkId: v.id("links"),
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);

    if (!link || link.deletionTime || !link.pageId) {
      return { success: false };
    }

    // Get the page to verify it's public
    const page = await ctx.db.get(link.pageId);
    if (!page || ("deletionTime" in page && page.deletionTime) || !("isPublic" in page && page.isPublic)) {
      return { success: false };
    }

    // Increment click count
    await ctx.db.patch(args.linkId, {
      clickCount: (link.clickCount ?? 0) + 1,
      updatedAt: now(),
    });

    // Record detailed analytics
    await ctx.db.insert("linkClicks", {
      linkId: args.linkId,
      pageId: link.pageId,
      clickedAt: now(),
      visitorId: args.visitorId,
      userAgent: args.userAgent,
      referrer: args.referrer,
      country: args.country,
    });

    return { success: true };
  },
});

/**
 * Simple click increment (no analytics tracking)
 */
export const incrementClickCount = mutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);

    if (!link || link.deletionTime || !link.pageId) {
      return { success: false };
    }

    // Get the page to verify it's public
    const page = await ctx.db.get(link.pageId);
    if (!page || ("deletionTime" in page && page.deletionTime) || !("isPublic" in page && page.isPublic)) {
      return { success: false };
    }

    await ctx.db.patch(args.linkId, {
      clickCount: (link.clickCount ?? 0) + 1,
      updatedAt: now(),
    });

    return { success: true };
  },
});
