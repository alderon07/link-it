import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";

/**
 * Get dashboard stats for the current user
 */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    // Get all user pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    // Get all links across all pages
    let totalLinks = 0;
    let totalActiveLinks = 0;
    let totalClicks = 0;

    const pageIds = pages.map((p) => p._id);
    for (const pageId of pageIds) {
      const links = await ctx.db
        .query("links")
        .withIndex("by_page", (q) =>
          q.eq("pageId", pageId).eq("deletionTime", undefined)
        )
        .collect();

      totalLinks += links.length;
      totalActiveLinks += links.filter((l) => l.isActive).length;
      totalClicks += links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);
    }

    // Calculate total views
    const totalViews = pages.reduce((sum, p) => sum + p.viewCount, 0);

    // Get views and clicks this month
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    let viewsThisMonth = 0;
    let clicksThisMonth = 0;

    for (const pageId of pageIds) {
      const recentViews = await ctx.db
        .query("pageViews")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("viewedAt", thirtyDaysAgo))
        .collect();
      viewsThisMonth += recentViews.length;

      const recentClicks = await ctx.db
        .query("linkClicks")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("clickedAt", thirtyDaysAgo))
        .collect();
      clicksThisMonth += recentClicks.length;
    }

    // Get top pages by view count
    const topPages = [...pages]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);

    // Calculate engagement rate (clicks / views)
    const engagementRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    return {
      totalPages: pages.length,
      totalLinks,
      totalActiveLinks,
      totalViews,
      totalClicks,
      viewsThisMonth,
      clicksThisMonth,
      engagementRate: Math.round(engagementRate * 10) / 10,
      topPages,
    };
  },
});

/**
 * Get analytics for a specific page
 */
export const getPageAnalytics = query({
  args: {
    pageId: v.id("pages"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view analytics",
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

    const now = Date.now();
    const days = args.days ?? 30;
    const startTime = now - days * 24 * 60 * 60 * 1000;

    // Get page views
    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId).gte("viewedAt", startTime))
      .collect();

    // Get link clicks
    const linkClicks = await ctx.db
      .query("linkClicks")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId).gte("clickedAt", startTime))
      .collect();

    // Group views by date
    const viewsByDate = new Map<string, number>();
    for (const view of pageViews) {
      const date = new Date(view.viewedAt).toISOString().split("T")[0];
      viewsByDate.set(date, (viewsByDate.get(date) ?? 0) + 1);
    }

    // Generate all dates in range and fill with view counts
    const viewsOverTime: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      viewsOverTime.push({
        date,
        count: viewsByDate.get(date) ?? 0,
      });
    }

    // Get clicks by link
    const links = await ctx.db
      .query("links")
      .withIndex("by_page", (q) =>
        q.eq("pageId", args.pageId).eq("deletionTime", undefined)
      )
      .collect();

    const clicksByLink: { linkId: Id<"links">; title: string; clicks: number }[] = [];
    for (const link of links) {
      if (link.type !== "link") continue;
      const clicks = linkClicks.filter((c) => c.linkId === link._id).length;
      clicksByLink.push({
        linkId: link._id,
        title: link.title,
        clicks,
      });
    }
    clicksByLink.sort((a, b) => b.clicks - a.clicks);

    // Referrer breakdown
    const referrerCounts = new Map<string, number>();
    for (const view of pageViews) {
      const referrer = view.referrer || "direct";
      referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);
    }
    const referrerBreakdown = Array.from(referrerCounts.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown (from user agent)
    const deviceCounts = new Map<string, number>();
    for (const view of pageViews) {
      let device = "Unknown";
      const ua = view.userAgent?.toLowerCase() ?? "";
      if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
        device = "Mobile";
      } else if (ua.includes("tablet") || ua.includes("ipad")) {
        device = "Tablet";
      } else if (ua.includes("windows") || ua.includes("mac") || ua.includes("linux")) {
        device = "Desktop";
      }
      deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);
    }
    const deviceBreakdown = Array.from(deviceCounts.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Country breakdown
    const countryCounts = new Map<string, number>();
    for (const view of pageViews) {
      const country = view.country || "Unknown";
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    }
    const countryBreakdown = Array.from(countryCounts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalViews: pageViews.length,
      totalClicks: linkClicks.length,
      viewsOverTime,
      clicksByLink,
      referrerBreakdown,
      deviceBreakdown,
      countryBreakdown,
    };
  },
});

/**
 * Get global analytics across all user pages
 */
export const getGlobalAnalytics = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    const now = Date.now();
    const days = args.days ?? 30;
    const startTime = now - days * 24 * 60 * 60 * 1000;

    // Get all user pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    const pageIds = pages.map((p) => p._id);
    const pageMap = new Map(pages.map((p) => [p._id.toString(), p]));

    // Collect all views and clicks
    const allViews: Doc<"pageViews">[] = [];
    const allClicks: Doc<"linkClicks">[] = [];
    const allLinks: Doc<"links">[] = [];

    for (const pageId of pageIds) {
      const views = await ctx.db
        .query("pageViews")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("viewedAt", startTime))
        .collect();
      allViews.push(...views);

      const clicks = await ctx.db
        .query("linkClicks")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("clickedAt", startTime))
        .collect();
      allClicks.push(...clicks);

      const links = await ctx.db
        .query("links")
        .withIndex("by_page", (q) =>
          q.eq("pageId", pageId).eq("deletionTime", undefined)
        )
        .collect();
      allLinks.push(...links);
    }

    // Group views by date
    const viewsByDate = new Map<string, number>();
    for (const view of allViews) {
      const date = new Date(view.viewedAt).toISOString().split("T")[0];
      viewsByDate.set(date, (viewsByDate.get(date) ?? 0) + 1);
    }

    // Generate all dates in range
    const viewsOverTime: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      viewsOverTime.push({
        date,
        count: viewsByDate.get(date) ?? 0,
      });
    }

    // Group clicks by date
    const clicksByDate = new Map<string, number>();
    for (const click of allClicks) {
      const date = new Date(click.clickedAt).toISOString().split("T")[0];
      clicksByDate.set(date, (clicksByDate.get(date) ?? 0) + 1);
    }

    const clicksOverTime: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      clicksOverTime.push({
        date,
        count: clicksByDate.get(date) ?? 0,
      });
    }

    // Top links by clicks (recent)
    const linkClickCounts = new Map<string, number>();
    for (const click of allClicks) {
      const key = click.linkId.toString();
      linkClickCounts.set(key, (linkClickCounts.get(key) ?? 0) + 1);
    }

    const linkMap = new Map(allLinks.map((l) => [l._id.toString(), l]));
    const topLinks = Array.from(linkClickCounts.entries())
      .map(([linkId, clicks]) => {
        const link = linkMap.get(linkId);
        if (!link || !link.pageId) return null;
        const page = pageMap.get(link.pageId.toString());
        return {
          link,
          page,
          clicks,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Traffic sources (referrers)
    const sourceCounts = new Map<string, number>();
    for (const view of allViews) {
      let source = "Direct";
      const referrer = view.referrer || "";

      if (referrer.includes("google")) source = "Google";
      else if (referrer.includes("twitter") || referrer.includes("x.com")) source = "Twitter/X";
      else if (referrer.includes("linkedin")) source = "LinkedIn";
      else if (referrer.includes("facebook")) source = "Facebook";
      else if (referrer.includes("instagram")) source = "Instagram";
      else if (referrer.includes("youtube")) source = "YouTube";
      else if (referrer && referrer !== "direct") source = "Other";

      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    }
    const trafficSources = Array.from(sourceCounts.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Top pages by views (recent)
    const pageViewCounts = new Map<string, number>();
    for (const view of allViews) {
      const key = view.pageId.toString();
      pageViewCounts.set(key, (pageViewCounts.get(key) ?? 0) + 1);
    }

    const topPages = Array.from(pageViewCounts.entries())
      .map(([pageId, views]) => {
        const page = pageMap.get(pageId);
        return page ? { page, views } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      totalViews: allViews.length,
      totalClicks: allClicks.length,
      viewsOverTime,
      clicksOverTime,
      topLinks,
      trafficSources,
      topPages,
    };
  },
});

/**
 * Get recent activity for the current user
 */
export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

    const limit = args.limit ?? 20;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get all user pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    const pageMap = new Map(pages.map((p) => [p._id.toString(), p]));
    const pageIds = pages.map((p) => p._id);

    // Collect recent views and clicks
    type Activity = {
      type: "view" | "click";
      timestamp: number;
      pageId: Id<"pages">;
      pageName: string;
      linkTitle?: string;
    };

    const activities: Activity[] = [];

    for (const pageId of pageIds) {
      const page = pageMap.get(pageId.toString());
      if (!page) continue;

      // Get recent views
      const views = await ctx.db
        .query("pageViews")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("viewedAt", sevenDaysAgo))
        .collect();

      for (const view of views) {
        activities.push({
          type: "view",
          timestamp: view.viewedAt,
          pageId,
          pageName: page.name,
        });
      }

      // Get recent clicks
      const clicks = await ctx.db
        .query("linkClicks")
        .withIndex("by_page", (q) => q.eq("pageId", pageId).gte("clickedAt", sevenDaysAgo))
        .collect();

      for (const click of clicks) {
        const link = await ctx.db.get(click.linkId);
        activities.push({
          type: "click",
          timestamp: click.clickedAt,
          pageId,
          pageName: page.name,
          linkTitle: link?.title,
        });
      }
    }

    // Sort by timestamp descending and limit
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },
});
