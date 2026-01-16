import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { now } from "./lib/utils";

/**
 * System themes to seed
 */
const SYSTEM_THEMES = [
  {
    name: "Midnight Dark",
    bgColor: "#0f0f1a",
    textColor: "#f5f5f5",
    accentColor: "#a855f7",
  },
  {
    name: "Ocean Blue",
    bgColor: "#1e3a5f",
    textColor: "#ffffff",
    accentColor: "#3b82f6",
  },
  {
    name: "Forest Green",
    bgColor: "#1a2e1a",
    textColor: "#f0fff0",
    accentColor: "#22c55e",
  },
  {
    name: "Sunset Coral",
    bgColor: "#2d1f1f",
    textColor: "#fff5f5",
    accentColor: "#f87171",
  },
  {
    name: "Neon Cyber",
    bgColor: "#0a0e1a",
    textColor: "#00ff00",
    accentColor: "#ff00ff",
  },
];

/**
 * Seed system themes (idempotent - won't duplicate)
 */
export const seedSystemThemes = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if system themes already exist
    const existingThemes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    if (existingThemes.length > 0) {
      console.log(`System themes already exist (${existingThemes.length} found)`);
      return existingThemes.map((t) => t._id);
    }

    const themeIds: Id<"themes">[] = [];
    const timestamp = now();

    for (const theme of SYSTEM_THEMES) {
      const id = await ctx.db.insert("themes", {
        ...theme,
        isCustom: false,
        userId: undefined,
        updatedAt: timestamp,
      });
      themeIds.push(id);
      console.log(`Created theme: ${theme.name}`);
    }

    return themeIds;
  },
});

/**
 * Seed test data for a specific user (identities, links, analytics)
 */
export const seedTestDataForUser = internalMutation({
  args: {
    userId: v.id("users"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = now();

    // Get system themes for identity associations
    const systemThemes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    // Check if user already has identities
    const existingIdentities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId).eq("deletionTime", undefined)
      )
      .collect();

    if (existingIdentities.length >= 3) {
      console.log(`User ${args.username} already has ${existingIdentities.length} identities`);
      return { identities: existingIdentities.map((p) => p._id), links: [], identityViews: [], linkClicks: [] };
    }

    // Create test identities
    const identities = [
      {
        name: "Personal",
        slug: `${args.username}-personal`,
        bio: "Welcome to my personal corner of the internet! Here you'll find links to my social media, portfolio, and creative projects.",
        isPublic: true,
        viewCount: 247,
        themeId: systemThemes[0]?._id,
      },
      {
        name: "Business",
        slug: `${args.username}-business`,
        bio: "Professional services and business inquiries. Let's connect and explore collaboration opportunities.",
        isPublic: true,
        viewCount: 156,
        themeId: systemThemes[1]?._id,
      },
      {
        name: "Private",
        slug: `${args.username}-private`,
        bio: "My private collection of resources and bookmarks.",
        isPublic: false,
        viewCount: 0,
        themeId: systemThemes[2]?._id,
      },
    ];

    const identityIds: Id<"identities">[] = [];
    for (const identity of identities) {
      // Check if slug exists
      const existing = await ctx.db
        .query("identities")
        .withIndex("by_slug", (q) => q.eq("slug", identity.slug))
        .first();

      if (existing && !existing.deletionTime) {
        console.log(`Identity with slug ${identity.slug} already exists, skipping`);
        identityIds.push(existing._id);
        continue;
      }

      const id = await ctx.db.insert("identities", {
        userId: args.userId,
        name: identity.name,
        slug: identity.slug,
        bio: identity.bio,
        isPublic: identity.isPublic,
        viewCount: identity.viewCount,
        themeId: identity.themeId,
        updatedAt: timestamp,
      });
      identityIds.push(id);
      console.log(`Created identity: ${identity.name} (${identity.slug})`);
    }

    // Create links for each identity
    const linksData: Array<{
      identityId: Id<"identities">;
      title: string;
      url: string;
      type: "link" | "header" | "divider";
      description?: string;
      icon?: string;
      isActive: boolean;
      orderIndex: number;
      clickCount: number;
    }> = [];

    // Personal identity links
    if (identityIds[0]) {
      linksData.push(
        { identityId: identityIds[0], title: "Social Media", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[0], title: "Twitter / X", url: "https://twitter.com/example", type: "link", description: "Follow me for tech updates", icon: "twitter", isActive: true, orderIndex: 1, clickCount: 189 },
        { identityId: identityIds[0], title: "Instagram", url: "https://instagram.com/example", type: "link", description: "Photos and stories", icon: "instagram", isActive: true, orderIndex: 2, clickCount: 156 },
        { identityId: identityIds[0], title: "LinkedIn", url: "https://linkedin.com/in/example", type: "link", description: "Professional network", icon: "linkedin", isActive: true, orderIndex: 3, clickCount: 98 },
        { identityId: identityIds[0], title: "GitHub", url: "https://github.com/example", type: "link", description: "Open source projects", icon: "github", isActive: true, orderIndex: 4, clickCount: 234 },
        { identityId: identityIds[0], title: "", url: "", type: "divider", isActive: true, orderIndex: 5, clickCount: 0 },
        { identityId: identityIds[0], title: "Content", url: "", type: "header", isActive: true, orderIndex: 6, clickCount: 0 },
        { identityId: identityIds[0], title: "YouTube Channel", url: "https://youtube.com/@example", type: "link", description: "Tutorials and vlogs", icon: "youtube", isActive: true, orderIndex: 7, clickCount: 312 },
        { identityId: identityIds[0], title: "Blog", url: "https://blog.example.com", type: "link", description: "Thoughts and writings", icon: "pen", isActive: true, orderIndex: 8, clickCount: 145 },
        { identityId: identityIds[0], title: "Portfolio", url: "https://portfolio.example.com", type: "link", description: "My best work", icon: "briefcase", isActive: false, orderIndex: 9, clickCount: 67 }
      );
    }

    // Business identity links
    if (identityIds[1]) {
      linksData.push(
        { identityId: identityIds[1], title: "Services", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[1], title: "Company Website", url: "https://company.example.com", type: "link", description: "Learn about our services", icon: "globe", isActive: true, orderIndex: 1, clickCount: 178 },
        { identityId: identityIds[1], title: "Book a Consultation", url: "https://calendly.com/example", type: "link", description: "Schedule a free call", icon: "calendar", isActive: true, orderIndex: 2, clickCount: 89 },
        { identityId: identityIds[1], title: "Contact", url: "", type: "header", isActive: true, orderIndex: 3, clickCount: 0 },
        { identityId: identityIds[1], title: "Email Us", url: "mailto:hello@example.com", type: "link", description: "Get in touch", icon: "mail", isActive: true, orderIndex: 4, clickCount: 56 },
        { identityId: identityIds[1], title: "Store", url: "https://store.example.com", type: "link", description: "Shop our products", icon: "shopping-cart", isActive: true, orderIndex: 5, clickCount: 134 }
      );
    }

    // Private identity links
    if (identityIds[2]) {
      linksData.push(
        { identityId: identityIds[2], title: "Resources", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[2], title: "Private Dashboard", url: "https://dashboard.example.com", type: "link", description: "Admin access", icon: "lock", isActive: true, orderIndex: 1, clickCount: 23 },
        { identityId: identityIds[2], title: "Notes", url: "https://notes.example.com", type: "link", description: "Personal notes", icon: "file-text", isActive: true, orderIndex: 2, clickCount: 45 },
        { identityId: identityIds[2], title: "Bookmarks", url: "https://bookmarks.example.com", type: "link", description: "Saved links", icon: "bookmark", isActive: true, orderIndex: 3, clickCount: 12 }
      );
    }

    // Insert links
    const linkIds: Id<"links">[] = [];
    for (const linkData of linksData) {
      const id = await ctx.db.insert("links", {
        ...linkData,
        updatedAt: timestamp,
      });
      linkIds.push(id);
    }
    console.log(`Created ${linkIds.length} links`);

    // Generate analytics data (last 30 days)
    const identityViewIds: Id<"identityViews">[] = [];
    const linkClickIds: Id<"linkClicks">[] = [];
    const thirtyDaysAgo = timestamp - 30 * 24 * 60 * 60 * 1000;

    // Generate identity views for public identities
    const referrers = ["https://google.com", "https://twitter.com", "https://linkedin.com", "direct", "https://facebook.com"];
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148",
      "Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile",
    ];
    const countries = ["US", "UK", "CA", "DE", "FR", "AU", "JP", "BR"];

    for (let i = 0; i < 2; i++) {
      const identityId = identityIds[i];
      if (!identityId) continue;

      // Generate 50-150 identity views
      const viewCount = 50 + Math.floor(Math.random() * 100);
      for (let j = 0; j < viewCount; j++) {
        const viewedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        const id = await ctx.db.insert("identityViews", {
          identityId,
          viewedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
        });
        identityViewIds.push(id);
      }
    }
    console.log(`Created ${identityViewIds.length} identity views`);

    // Generate link clicks for links with clickCount > 0
    const linksWithClicks = linksData.filter((l) => l.clickCount > 0 && l.type === "link");
    let linkIndex = 0;
    for (const linkData of linksWithClicks) {
      const linkId = linkIds[linksData.indexOf(linkData)];
      if (!linkId) continue;

      // Generate clicks (proportional to clickCount but scaled down for demo)
      const clickCount = Math.min(linkData.clickCount, 30 + Math.floor(Math.random() * 20));
      for (let j = 0; j < clickCount; j++) {
        const clickedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        const id = await ctx.db.insert("linkClicks", {
          linkId,
          identityId: linkData.identityId,
          clickedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
        });
        linkClickIds.push(id);
      }
      linkIndex++;
    }
    console.log(`Created ${linkClickIds.length} link clicks`);

    // Create user settings if they don't exist
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingSettings) {
      await ctx.db.insert("userSettings", {
        userId: args.userId,
        darkMode: false,
        emailNotifications: true,
        defaultIdentityId: identityIds[0],
        updatedAt: timestamp,
      });
      console.log("Created user settings");
    }

    // Create user progress if it doesn't exist
    const existingProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingProgress) {
      await ctx.db.insert("userProgress", {
        userId: args.userId,
        completedIntro: true,
        addedFirstLink: true,
        publishedIdentity: true,
        updatedAt: timestamp,
      });
      console.log("Created user progress");
    }

    return {
      identities: identityIds,
      links: linkIds,
      identityViews: identityViewIds,
      linkClicks: linkClickIds,
    };
  },
});

/**
 * Public mutation to seed data for the current logged-in user
 * Call this from the UI or Convex dashboard
 */
export const seedMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to seed data");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new Error("User not found");
    }

    // First seed system themes
    const existingThemes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    if (existingThemes.length === 0) {
      const timestamp = now();
      for (const theme of SYSTEM_THEMES) {
        await ctx.db.insert("themes", {
          ...theme,
          isCustom: false,
          userId: undefined,
          updatedAt: timestamp,
        });
        console.log(`Created theme: ${theme.name}`);
      }
    }

    // Now seed user data
    const timestamp = now();

    // Get system themes for identity associations
    const systemThemes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    // Check if user already has identities
    const existingIdentities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    if (existingIdentities.length >= 3) {
      return {
        message: `User already has ${existingIdentities.length} identities. Seed skipped.`,
        identitiesCreated: 0,
        linksCreated: 0,
      };
    }

    // Create test identities
    const identities = [
      {
        name: "Personal",
        slug: `${user.username}-personal`,
        bio: "Welcome to my personal corner of the internet! Here you'll find links to my social media, portfolio, and creative projects.",
        isPublic: true,
        viewCount: 247,
        themeId: systemThemes[0]?._id,
      },
      {
        name: "Business",
        slug: `${user.username}-business`,
        bio: "Professional services and business inquiries. Let's connect and explore collaboration opportunities.",
        isPublic: true,
        viewCount: 156,
        themeId: systemThemes[1]?._id,
      },
      {
        name: "Private",
        slug: `${user.username}-private`,
        bio: "My private collection of resources and bookmarks.",
        isPublic: false,
        viewCount: 0,
        themeId: systemThemes[2]?._id,
      },
    ];

    const identityIds: Id<"identities">[] = [];
    for (const identity of identities) {
      // Check if slug exists
      const existing = await ctx.db
        .query("identities")
        .withIndex("by_slug", (q) => q.eq("slug", identity.slug))
        .first();

      if (existing && !existing.deletionTime) {
        identityIds.push(existing._id);
        continue;
      }

      const id = await ctx.db.insert("identities", {
        userId: user._id,
        name: identity.name,
        slug: identity.slug,
        bio: identity.bio,
        isPublic: identity.isPublic,
        viewCount: identity.viewCount,
        themeId: identity.themeId,
        updatedAt: timestamp,
      });
      identityIds.push(id);
    }

    // Create links for each identity (same structure as internal mutation)
    const linksData: Array<{
      identityId: Id<"identities">;
      title: string;
      url: string;
      type: "link" | "header" | "divider";
      description?: string;
      icon?: string;
      isActive: boolean;
      orderIndex: number;
      clickCount: number;
    }> = [];

    // Personal identity links
    if (identityIds[0]) {
      linksData.push(
        { identityId: identityIds[0], title: "Social Media", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[0], title: "Twitter / X", url: "https://twitter.com/example", type: "link", description: "Follow me for tech updates", icon: "twitter", isActive: true, orderIndex: 1, clickCount: 189 },
        { identityId: identityIds[0], title: "Instagram", url: "https://instagram.com/example", type: "link", description: "Photos and stories", icon: "instagram", isActive: true, orderIndex: 2, clickCount: 156 },
        { identityId: identityIds[0], title: "LinkedIn", url: "https://linkedin.com/in/example", type: "link", description: "Professional network", icon: "linkedin", isActive: true, orderIndex: 3, clickCount: 98 },
        { identityId: identityIds[0], title: "GitHub", url: "https://github.com/example", type: "link", description: "Open source projects", icon: "github", isActive: true, orderIndex: 4, clickCount: 234 },
        { identityId: identityIds[0], title: "", url: "", type: "divider", isActive: true, orderIndex: 5, clickCount: 0 },
        { identityId: identityIds[0], title: "Content", url: "", type: "header", isActive: true, orderIndex: 6, clickCount: 0 },
        { identityId: identityIds[0], title: "YouTube Channel", url: "https://youtube.com/@example", type: "link", description: "Tutorials and vlogs", icon: "youtube", isActive: true, orderIndex: 7, clickCount: 312 },
        { identityId: identityIds[0], title: "Blog", url: "https://blog.example.com", type: "link", description: "Thoughts and writings", icon: "pen", isActive: true, orderIndex: 8, clickCount: 145 },
        { identityId: identityIds[0], title: "Portfolio", url: "https://portfolio.example.com", type: "link", description: "My best work", icon: "briefcase", isActive: false, orderIndex: 9, clickCount: 67 }
      );
    }

    // Business identity links
    if (identityIds[1]) {
      linksData.push(
        { identityId: identityIds[1], title: "Services", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[1], title: "Company Website", url: "https://company.example.com", type: "link", description: "Learn about our services", icon: "globe", isActive: true, orderIndex: 1, clickCount: 178 },
        { identityId: identityIds[1], title: "Book a Consultation", url: "https://calendly.com/example", type: "link", description: "Schedule a free call", icon: "calendar", isActive: true, orderIndex: 2, clickCount: 89 },
        { identityId: identityIds[1], title: "Contact", url: "", type: "header", isActive: true, orderIndex: 3, clickCount: 0 },
        { identityId: identityIds[1], title: "Email Us", url: "mailto:hello@example.com", type: "link", description: "Get in touch", icon: "mail", isActive: true, orderIndex: 4, clickCount: 56 },
        { identityId: identityIds[1], title: "Store", url: "https://store.example.com", type: "link", description: "Shop our products", icon: "shopping-cart", isActive: true, orderIndex: 5, clickCount: 134 }
      );
    }

    // Private identity links
    if (identityIds[2]) {
      linksData.push(
        { identityId: identityIds[2], title: "Resources", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0 },
        { identityId: identityIds[2], title: "Private Dashboard", url: "https://dashboard.example.com", type: "link", description: "Admin access", icon: "lock", isActive: true, orderIndex: 1, clickCount: 23 },
        { identityId: identityIds[2], title: "Notes", url: "https://notes.example.com", type: "link", description: "Personal notes", icon: "file-text", isActive: true, orderIndex: 2, clickCount: 45 },
        { identityId: identityIds[2], title: "Bookmarks", url: "https://bookmarks.example.com", type: "link", description: "Saved links", icon: "bookmark", isActive: true, orderIndex: 3, clickCount: 12 }
      );
    }

    // Insert links
    const linkIds: Id<"links">[] = [];
    for (const linkData of linksData) {
      const id = await ctx.db.insert("links", {
        ...linkData,
        updatedAt: timestamp,
      });
      linkIds.push(id);
    }

    // Generate analytics data (last 30 days)
    const thirtyDaysAgo = timestamp - 30 * 24 * 60 * 60 * 1000;
    const referrers = ["https://google.com", "https://twitter.com", "https://linkedin.com", "direct", "https://facebook.com"];
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148",
      "Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile",
    ];
    const countries = ["US", "UK", "CA", "DE", "FR", "AU", "JP", "BR"];

    // Generate identity views for public identities
    for (let i = 0; i < 2; i++) {
      const identityId = identityIds[i];
      if (!identityId) continue;

      const viewCount = 50 + Math.floor(Math.random() * 100);
      for (let j = 0; j < viewCount; j++) {
        const viewedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        await ctx.db.insert("identityViews", {
          identityId,
          viewedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
        });
      }
    }

    // Generate link clicks
    const linksWithClicks = linksData.filter((l) => l.clickCount > 0 && l.type === "link");
    for (const linkData of linksWithClicks) {
      const linkId = linkIds[linksData.indexOf(linkData)];
      if (!linkId) continue;

      const clickCount = Math.min(linkData.clickCount, 30 + Math.floor(Math.random() * 20));
      for (let j = 0; j < clickCount; j++) {
        const clickedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        await ctx.db.insert("linkClicks", {
          linkId,
          identityId: linkData.identityId,
          clickedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[Math.floor(Math.random() * countries.length)],
        });
      }
    }

    // Create user settings if they don't exist
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!existingSettings) {
      await ctx.db.insert("userSettings", {
        userId: user._id,
        darkMode: false,
        emailNotifications: true,
        defaultIdentityId: identityIds[0],
        updatedAt: timestamp,
      });
    }

    // Create user progress if it doesn't exist
    const existingProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!existingProgress) {
      await ctx.db.insert("userProgress", {
        userId: user._id,
        completedIntro: true,
        addedFirstLink: true,
        publishedIdentity: true,
        updatedAt: timestamp,
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // TAGS - Create tags for organizing links
    // ═══════════════════════════════════════════════════════════════
    const existingTags = await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const tagIds: Id<"tags">[] = [];
    if (existingTags.length === 0) {
      const tagsData = [
        { name: "Social", color: "#ec4899" }, // pink
        { name: "Work", color: "#3b82f6" }, // blue
        { name: "Content", color: "#22c55e" }, // green
        { name: "Personal", color: "#f59e0b" }, // amber
        { name: "Important", color: "#ef4444" }, // red
      ];

      for (const tag of tagsData) {
        const id = await ctx.db.insert("tags", {
          userId: user._id,
          name: tag.name,
          color: tag.color,
          updatedAt: timestamp,
        });
        tagIds.push(id);
      }
      console.log(`Created ${tagIds.length} tags`);
    } else {
      tagIds.push(...existingTags.map((t) => t._id));
    }

    // ═══════════════════════════════════════════════════════════════
    // LINK_TAGS - Associate tags with links
    // ═══════════════════════════════════════════════════════════════
    // Only create linkTags if we have tags and links
    let linkTagsCreated = 0;
    if (tagIds.length > 0 && linkIds.length > 0) {
      // Check if any linkTags exist for these links
      const existingLinkTags = await ctx.db
        .query("linkTags")
        .withIndex("by_link", (q) => q.eq("linkId", linkIds[0]))
        .collect();

      if (existingLinkTags.length === 0) {
        // Map link titles to appropriate tags
        const linkTagMapping: { [key: string]: number[] } = {
          "Twitter / X": [0], // Social
          "Instagram": [0], // Social
          "LinkedIn": [0, 1], // Social, Work
          "GitHub": [1, 2], // Work, Content
          "YouTube Channel": [2], // Content
          "Blog": [2, 3], // Content, Personal
          "Portfolio": [1, 2], // Work, Content
          "Company Website": [1], // Work
          "Book a Consultation": [1, 4], // Work, Important
          "Email Us": [1], // Work
          "Store": [1], // Work
          "Private Dashboard": [4], // Important
          "Notes": [3], // Personal
          "Bookmarks": [3], // Personal
        };

        // Get all actual links from DB to match by title
        for (let i = 0; i < linkIds.length; i++) {
          const linkData = linksData[i];
          if (!linkData || linkData.type !== "link") continue;

          const tagIndices = linkTagMapping[linkData.title];
          if (tagIndices) {
            for (const tagIndex of tagIndices) {
              if (tagIds[tagIndex]) {
                await ctx.db.insert("linkTags", {
                  linkId: linkIds[i],
                  tagId: tagIds[tagIndex],
                });
                linkTagsCreated++;
              }
            }
          }
        }
        console.log(`Created ${linkTagsCreated} link-tag associations`);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // PAGE_COLLABORATORS - Self as owner (for demo purposes)
    // ═══════════════════════════════════════════════════════════════
    let collaboratorsCreated = 0;
    for (const identityId of identityIds) {
      const existingCollaborator = await ctx.db
        .query("identityCollaborators")
        .withIndex("by_identity", (q) => q.eq("identityId", identityId))
        .first();

      if (!existingCollaborator) {
        await ctx.db.insert("identityCollaborators", {
          identityId,
          userId: user._id,
          role: "owner",
          invitedAt: timestamp,
          acceptedAt: timestamp,
        });
        collaboratorsCreated++;
      }
    }
    if (collaboratorsCreated > 0) {
      console.log(`Created ${collaboratorsCreated} identity collaborators`);
    }

    // ═══════════════════════════════════════════════════════════════
    // AUDIT_LOGS - Create sample audit logs for user actions
    // ═══════════════════════════════════════════════════════════════
    const existingLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    let auditLogsCreated = 0;
    if (!existingLogs) {
      const auditActions = [
        { action: "user.login", entityType: "user", entityId: user._id, daysAgo: 0 },
        { action: "identity.create", entityType: "identity", entityId: identityIds[0] || user._id, daysAgo: 7 },
        { action: "identity.create", entityType: "identity", entityId: identityIds[1] || user._id, daysAgo: 6 },
        { action: "identity.create", entityType: "identity", entityId: identityIds[2] || user._id, daysAgo: 5 },
        { action: "link.create", entityType: "link", entityId: linkIds[0] || user._id, daysAgo: 5 },
        { action: "link.create", entityType: "link", entityId: linkIds[1] || user._id, daysAgo: 5 },
        { action: "identity.update", entityType: "identity", entityId: identityIds[0] || user._id, daysAgo: 4 },
        { action: "theme.apply", entityType: "identity", entityId: identityIds[0] || user._id, daysAgo: 3 },
        { action: "link.update", entityType: "link", entityId: linkIds[2] || user._id, daysAgo: 2 },
        { action: "identity.publish", entityType: "identity", entityId: identityIds[0] || user._id, daysAgo: 1 },
        { action: "settings.update", entityType: "settings", entityId: user._id, daysAgo: 1 },
        { action: "user.login", entityType: "user", entityId: user._id, daysAgo: 0 },
      ];

      for (const log of auditActions) {
        const logTimestamp = timestamp - log.daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000);
        await ctx.db.insert("auditLogs", {
          userId: user._id,
          action: log.action,
          entityType: log.entityType,
          entityId: log.entityId.toString(),
          metadata: {
            ip: "192.168.1." + Math.floor(Math.random() * 255),
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
          },
          timestamp: logTimestamp,
        });
        auditLogsCreated++;
      }
      console.log(`Created ${auditLogsCreated} audit logs`);
    }

    // ═══════════════════════════════════════════════════════════════
    // CUSTOM THEMES - Create a custom theme for the user
    // ═══════════════════════════════════════════════════════════════
    const existingCustomThemes = await ctx.db
      .query("themes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let customThemesCreated = 0;
    if (existingCustomThemes.length === 0) {
      const customThemes = [
        {
          name: "My Custom Theme",
          bgColor: "#1a1a2e",
          textColor: "#eaeaea",
          accentColor: "#e94560",
          buttonStyle: "rounded",
          fontFamily: "Inter",
        },
        {
          name: "Light Minimal",
          bgColor: "#fafafa",
          textColor: "#1a1a1a",
          accentColor: "#0ea5e9",
          buttonStyle: "pill",
          fontFamily: "System",
        },
      ];

      for (const theme of customThemes) {
        await ctx.db.insert("themes", {
          name: theme.name,
          bgColor: theme.bgColor,
          textColor: theme.textColor,
          accentColor: theme.accentColor,
          buttonStyle: theme.buttonStyle,
          fontFamily: theme.fontFamily,
          userId: user._id,
          isCustom: true,
          updatedAt: timestamp,
        });
        customThemesCreated++;
      }
      console.log(`Created ${customThemesCreated} custom themes`);
    }

    return {
      message: "Seed completed successfully!",
      identitiesCreated: identityIds.length,
      linksCreated: linkIds.length,
      tagsCreated: tagIds.length,
      linkTagsCreated,
      collaboratorsCreated,
      auditLogsCreated,
      customThemesCreated,
    };
  },
});

/**
 * Clear all seed data for current user (for testing)
 */
export const clearMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to clear data");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new Error("User not found");
    }

    // Get all user identities
    const userIdentities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) => q.eq("userId", user._id).eq("deletionTime", undefined))
      .collect();

    let deletedIdentities = 0;
    let deletedLinks = 0;
    let deletedIdentityViews = 0;
    let deletedLinkClicks = 0;
    let deletedTags = 0;
    let deletedLinkTags = 0;
    let deletedCollaborators = 0;
    let deletedAuditLogs = 0;
    let deletedCustomThemes = 0;

    for (const identity of userIdentities) {
      // Delete identity views
      const identityViews = await ctx.db
        .query("identityViews")
        .withIndex("by_identity", (q) => q.eq("identityId", identity._id))
        .collect();
      for (const view of identityViews) {
        await ctx.db.delete(view._id);
        deletedIdentityViews++;
      }

      // Delete link clicks for this identity
      const linkClicks = await ctx.db
        .query("linkClicks")
        .withIndex("by_identity", (q) => q.eq("identityId", identity._id))
        .collect();
      for (const click of linkClicks) {
        await ctx.db.delete(click._id);
        deletedLinkClicks++;
      }

      // Delete links and their tags
      const links = await ctx.db
        .query("links")
        .withIndex("by_identity", (q) => q.eq("identityId", identity._id).eq("deletionTime", undefined))
        .collect();
      for (const link of links) {
        // Delete link tags
        const linkTags = await ctx.db
          .query("linkTags")
          .withIndex("by_link", (q) => q.eq("linkId", link._id))
          .collect();
        for (const lt of linkTags) {
          await ctx.db.delete(lt._id);
          deletedLinkTags++;
        }
        await ctx.db.delete(link._id);
        deletedLinks++;
      }

      // Delete identity collaborators
      const collaborators = await ctx.db
        .query("identityCollaborators")
        .withIndex("by_identity", (q) => q.eq("identityId", identity._id))
        .collect();
      for (const collab of collaborators) {
        await ctx.db.delete(collab._id);
        deletedCollaborators++;
      }

      // Delete identity
      await ctx.db.delete(identity._id);
      deletedIdentities++;
    }

    // Delete user tags
    const tags = await ctx.db
      .query("tags")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const tag of tags) {
      // Delete any remaining linkTags for this tag
      const linkTags = await ctx.db
        .query("linkTags")
        .withIndex("by_tag", (q) => q.eq("tagId", tag._id))
        .collect();
      for (const lt of linkTags) {
        await ctx.db.delete(lt._id);
        deletedLinkTags++;
      }
      await ctx.db.delete(tag._id);
      deletedTags++;
    }

    // Delete audit logs
    const auditLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const log of auditLogs) {
      await ctx.db.delete(log._id);
      deletedAuditLogs++;
    }

    // Delete custom themes
    const customThemes = await ctx.db
      .query("themes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const theme of customThemes) {
      await ctx.db.delete(theme._id);
      deletedCustomThemes++;
    }

    // Delete user settings
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (settings) {
      await ctx.db.delete(settings._id);
    }

    // Delete user progress
    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (progress) {
      await ctx.db.delete(progress._id);
    }

    return {
      message: "Data cleared successfully!",
      deletedIdentities,
      deletedLinks,
      deletedIdentityViews,
      deletedLinkClicks,
      deletedTags,
      deletedLinkTags,
      deletedCollaborators,
      deletedAuditLogs,
      deletedCustomThemes,
    };
  },
});
