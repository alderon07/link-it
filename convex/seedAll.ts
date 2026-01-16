import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const now = Date.now();
const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════
// SEED DATA DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const USERS_DATA = [
  {
    clerkUserId: "user_demo_alex",
    email: "alex@example.com",
    username: "alexj",
    displayName: "Alex Johnson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  },
  {
    clerkUserId: "user_demo_sarah",
    email: "sarah@example.com",
    username: "sarahc",
    displayName: "Sarah Chen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    clerkUserId: "user_demo_mike",
    email: "mike@example.com",
    username: "miker",
    displayName: "Mike Rodriguez",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
];

const THEMES_DATA = [
  { name: "Midnight Dark", bgColor: "#0f0f1a", textColor: "#f5f5f5", accentColor: "#a855f7", isCustom: false },
  { name: "Ocean Blue", bgColor: "#1e3a5f", textColor: "#ffffff", accentColor: "#3b82f6", isCustom: false },
  { name: "Forest Green", bgColor: "#1a2e1a", textColor: "#f0fff0", accentColor: "#22c55e", isCustom: false },
  { name: "Sunset Coral", bgColor: "#2d1f1f", textColor: "#fff5f5", accentColor: "#f87171", isCustom: false },
  { name: "Neon Cyber", bgColor: "#0a0e1a", textColor: "#00ff00", accentColor: "#ff00ff", isCustom: false },
  { name: "Minimal Light", bgColor: "#fafafa", textColor: "#1a1a1a", accentColor: "#0ea5e9", isCustom: false },
  { name: "Warm Sunset", bgColor: "#fef3c7", textColor: "#78350f", accentColor: "#f59e0b", isCustom: false },
];

// Identities with userIndex for linking
const IDENTITIES_DATA = [
  // Alex's identities (user 0)
  { userIndex: 0, themeIndex: 0, name: "Personal", slug: "alexj-personal", bio: "Welcome to my personal corner of the internet!", isPublic: true, viewCount: 1247, seoTitle: "Alex Johnson - Personal Links" },
  { userIndex: 0, themeIndex: 1, name: "Work Portfolio", slug: "alexj-work", bio: "Professional services and portfolio", isPublic: true, viewCount: 856 },
  { userIndex: 0, themeIndex: 4, name: "Gaming", slug: "alexj-gaming", bio: "My gaming profiles and streams", isPublic: true, viewCount: 432 },
  // Sarah's identities (user 1)
  { userIndex: 1, themeIndex: 2, name: "Tech Blog", slug: "sarahc-tech", bio: "Tech insights and tutorials", isPublic: true, viewCount: 2103 },
  { userIndex: 1, themeIndex: 5, name: "Personal", slug: "sarahc-personal", bio: "My personal links and social media", isPublic: true, viewCount: 1567 },
  // Mike's identities (user 2)
  { userIndex: 2, themeIndex: 3, name: "Music", slug: "miker-music", bio: "My music, tracks, and performances", isPublic: true, viewCount: 3421 },
  { userIndex: 2, themeIndex: 6, name: "Store", slug: "miker-store", bio: "Merch and exclusive content", isPublic: true, viewCount: 987 },
  { userIndex: 2, themeIndex: 0, name: "Private", slug: "miker-private", bio: "Private resources", isPublic: false, viewCount: 0 },
];

// Links with identityIndex for linking
const LINKS_DATA = [
  // Alex Personal (identity 0)
  { identityIndex: 0, title: "Social Media", url: "", type: "header" as const, isActive: true, orderIndex: 0, clickCount: 0 },
  { identityIndex: 0, title: "Twitter / X", url: "https://twitter.com/alexj", type: "link" as const, description: "Follow me for tech updates", icon: "twitter", isActive: true, orderIndex: 1, clickCount: 534 },
  { identityIndex: 0, title: "Instagram", url: "https://instagram.com/alexj", type: "link" as const, description: "Photos and stories", icon: "instagram", isActive: true, orderIndex: 2, clickCount: 423 },
  { identityIndex: 0, title: "LinkedIn", url: "https://linkedin.com/in/alexj", type: "link" as const, description: "Professional network", icon: "linkedin", isActive: true, orderIndex: 3, clickCount: 312 },
  { identityIndex: 0, title: "", url: "", type: "divider" as const, isActive: true, orderIndex: 4, clickCount: 0 },
  { identityIndex: 0, title: "Content", url: "", type: "header" as const, isActive: true, orderIndex: 5, clickCount: 0 },
  { identityIndex: 0, title: "YouTube Channel", url: "https://youtube.com/@alexj", type: "link" as const, description: "Tutorials and vlogs", icon: "youtube", isActive: true, orderIndex: 6, clickCount: 867 },
  { identityIndex: 0, title: "Blog", url: "https://alexj.dev/blog", type: "link" as const, description: "Thoughts on tech", icon: "pen", isActive: true, orderIndex: 7, clickCount: 234 },
  { identityIndex: 0, title: "GitHub", url: "https://github.com/alexj", type: "link" as const, description: "Open source projects", icon: "github", isActive: true, orderIndex: 8, clickCount: 456 },

  // Alex Work (identity 1)
  { identityIndex: 1, title: "Services", url: "", type: "header" as const, isActive: true, orderIndex: 0, clickCount: 0 },
  { identityIndex: 1, title: "Portfolio", url: "https://alexj.dev", type: "link" as const, description: "View my work", icon: "briefcase", isActive: true, orderIndex: 1, clickCount: 567 },
  { identityIndex: 1, title: "Book a Call", url: "https://calendly.com/alexj", type: "link" as const, description: "Schedule a consultation", icon: "calendar", isActive: true, orderIndex: 2, clickCount: 234 },
  { identityIndex: 1, title: "Email Me", url: "mailto:alex@alexj.dev", type: "link" as const, description: "Get in touch", icon: "mail", isActive: true, orderIndex: 3, clickCount: 189 },

  // Alex Gaming (identity 2)
  { identityIndex: 2, title: "Twitch", url: "https://twitch.tv/alexj", type: "link" as const, description: "Watch me stream", icon: "twitch", isActive: true, orderIndex: 0, clickCount: 345 },
  { identityIndex: 2, title: "Discord Server", url: "https://discord.gg/alexj", type: "link" as const, description: "Join the community", icon: "message-circle", isActive: true, orderIndex: 1, clickCount: 234 },
  { identityIndex: 2, title: "Steam", url: "https://steamcommunity.com/id/alexj", type: "link" as const, description: "Add me on Steam", icon: "gamepad-2", isActive: true, orderIndex: 2, clickCount: 123 },

  // Sarah Tech (identity 3)
  { identityIndex: 3, title: "Latest Articles", url: "", type: "header" as const, isActive: true, orderIndex: 0, clickCount: 0 },
  { identityIndex: 3, title: "Tech Blog", url: "https://sarahchen.tech", type: "link" as const, description: "Read my latest posts", icon: "file-text", isActive: true, orderIndex: 1, clickCount: 1234 },
  { identityIndex: 3, title: "Newsletter", url: "https://sarahchen.tech/newsletter", type: "link" as const, description: "Weekly tech insights", icon: "mail", isActive: true, orderIndex: 2, clickCount: 567 },
  { identityIndex: 3, title: "Code", url: "", type: "header" as const, isActive: true, orderIndex: 3, clickCount: 0 },
  { identityIndex: 3, title: "GitHub", url: "https://github.com/sarahchen", type: "link" as const, description: "Open source projects", icon: "github", isActive: true, orderIndex: 4, clickCount: 890 },
  { identityIndex: 3, title: "CodePen", url: "https://codepen.io/sarahchen", type: "link" as const, description: "CSS experiments", icon: "code", isActive: true, orderIndex: 5, clickCount: 345 },

  // Sarah Personal (identity 4)
  { identityIndex: 4, title: "Twitter / X", url: "https://twitter.com/sarahchen", type: "link" as const, description: "Tech thoughts", icon: "twitter", isActive: true, orderIndex: 0, clickCount: 678 },
  { identityIndex: 4, title: "Instagram", url: "https://instagram.com/sarahchen", type: "link" as const, description: "Life moments", icon: "instagram", isActive: true, orderIndex: 1, clickCount: 456 },
  { identityIndex: 4, title: "LinkedIn", url: "https://linkedin.com/in/sarahchen", type: "link" as const, description: "Professional profile", icon: "linkedin", isActive: true, orderIndex: 2, clickCount: 345 },

  // Mike Music (identity 5)
  { identityIndex: 5, title: "Listen", url: "", type: "header" as const, isActive: true, orderIndex: 0, clickCount: 0 },
  { identityIndex: 5, title: "Spotify", url: "https://open.spotify.com/artist/mike", type: "link" as const, description: "Stream my music", icon: "music", isActive: true, orderIndex: 1, clickCount: 2345 },
  { identityIndex: 5, title: "Apple Music", url: "https://music.apple.com/artist/mike", type: "link" as const, description: "Listen on Apple Music", icon: "music-2", isActive: true, orderIndex: 2, clickCount: 1234 },
  { identityIndex: 5, title: "SoundCloud", url: "https://soundcloud.com/mike", type: "link" as const, description: "Exclusive tracks", icon: "cloud", isActive: true, orderIndex: 3, clickCount: 876 },
  { identityIndex: 5, title: "Watch", url: "", type: "header" as const, isActive: true, orderIndex: 4, clickCount: 0 },
  { identityIndex: 5, title: "YouTube", url: "https://youtube.com/@mikemusic", type: "link" as const, description: "Music videos", icon: "youtube", isActive: true, orderIndex: 5, clickCount: 1567 },
  { identityIndex: 5, title: "TikTok", url: "https://tiktok.com/@mikemusic", type: "link" as const, description: "Short clips", icon: "video", isActive: true, orderIndex: 6, clickCount: 2134 },

  // Mike Store (identity 6)
  { identityIndex: 6, title: "Merch Store", url: "https://mikemusic.store", type: "link" as const, description: "Official merchandise", icon: "shopping-bag", isActive: true, orderIndex: 0, clickCount: 456 },
  { identityIndex: 6, title: "Patreon", url: "https://patreon.com/mikemusic", type: "link" as const, description: "Exclusive content", icon: "heart", isActive: true, orderIndex: 1, clickCount: 234 },
  { identityIndex: 6, title: "Concert Tickets", url: "https://tickets.mikemusic.com", type: "link" as const, description: "Upcoming shows", icon: "ticket", isActive: true, orderIndex: 2, clickCount: 567 },

  // Mike Private (identity 7)
  { identityIndex: 7, title: "Admin Dashboard", url: "https://admin.mikemusic.com", type: "link" as const, description: "Management portal", icon: "lock", isActive: true, orderIndex: 0, clickCount: 45 },
  { identityIndex: 7, title: "Analytics", url: "https://analytics.mikemusic.com", type: "link" as const, description: "Performance metrics", icon: "bar-chart", isActive: true, orderIndex: 1, clickCount: 34 },
];

// Tags with userIndex
const TAGS_DATA = [
  // Alex's tags (user 0)
  { userIndex: 0, name: "Social", color: "#ec4899" },
  { userIndex: 0, name: "Work", color: "#3b82f6" },
  { userIndex: 0, name: "Content", color: "#22c55e" },
  { userIndex: 0, name: "Gaming", color: "#8b5cf6" },
  // Sarah's tags (user 1)
  { userIndex: 1, name: "Tech", color: "#0ea5e9" },
  { userIndex: 1, name: "Social", color: "#ec4899" },
  { userIndex: 1, name: "Code", color: "#10b981" },
  // Mike's tags (user 2)
  { userIndex: 2, name: "Music", color: "#f59e0b" },
  { userIndex: 2, name: "Business", color: "#6366f1" },
  { userIndex: 2, name: "Social", color: "#ec4899" },
];

// Link-Tag associations (linkIndex -> tagIndex)
const LINK_TAGS_DATA = [
  // Alex's links
  { linkIndex: 1, tagIndex: 0 }, // Twitter -> Social
  { linkIndex: 2, tagIndex: 0 }, // Instagram -> Social
  { linkIndex: 3, tagIndex: 1 }, // LinkedIn -> Work
  { linkIndex: 6, tagIndex: 2 }, // YouTube -> Content
  { linkIndex: 7, tagIndex: 2 }, // Blog -> Content
  { linkIndex: 8, tagIndex: 1 }, // GitHub -> Work
  { linkIndex: 10, tagIndex: 1 }, // Portfolio -> Work
  { linkIndex: 13, tagIndex: 3 }, // Twitch -> Gaming
  { linkIndex: 14, tagIndex: 3 }, // Discord -> Gaming
  // Sarah's links
  { linkIndex: 18, tagIndex: 4 }, // Tech Blog -> Tech
  { linkIndex: 21, tagIndex: 6 }, // GitHub -> Code
  { linkIndex: 23, tagIndex: 5 }, // Twitter -> Social
  { linkIndex: 24, tagIndex: 5 }, // Instagram -> Social
  // Mike's links
  { linkIndex: 27, tagIndex: 7 }, // Spotify -> Music
  { linkIndex: 28, tagIndex: 7 }, // Apple Music -> Music
  { linkIndex: 32, tagIndex: 7 }, // YouTube -> Music
  { linkIndex: 34, tagIndex: 8 }, // Merch Store -> Business
  { linkIndex: 36, tagIndex: 8 }, // Concert Tickets -> Business
];

// Analytics helpers
const referrers = ["https://google.com", "https://twitter.com", "https://linkedin.com", "direct", "https://facebook.com", "https://instagram.com"];
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile",
];
const countries = ["US", "UK", "CA", "DE", "FR", "AU", "JP", "BR", "IN", "MX"];
const cities = ["New York", "London", "Toronto", "Berlin", "Paris", "Sydney", "Tokyo", "São Paulo", "Mumbai", "Mexico City"];

/**
 * Seed all tables with demo data
 * This is idempotent - it checks for existing data before inserting
 */
export const seedAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const timestamp = Date.now();
    const results: Record<string, number> = {};

    // ═══════════════════════════════════════════════════════════════
    // 1. USERS
    // ═══════════════════════════════════════════════════════════════
    const userIds: Id<"users">[] = [];
    for (const userData of USERS_DATA) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", userData.clerkUserId))
        .first();

      if (existing) {
        userIds.push(existing._id);
      } else {
        const id = await ctx.db.insert("users", {
          ...userData,
          updatedAt: timestamp,
        });
        userIds.push(id);
      }
    }
    results.users = userIds.length;

    // ═══════════════════════════════════════════════════════════════
    // 2. THEMES
    // ═══════════════════════════════════════════════════════════════
    const themeIds: Id<"themes">[] = [];
    for (const themeData of THEMES_DATA) {
      const existing = await ctx.db
        .query("themes")
        .filter((q) => q.eq(q.field("name"), themeData.name))
        .first();

      if (existing) {
        themeIds.push(existing._id);
      } else {
        const id = await ctx.db.insert("themes", {
          ...themeData,
          updatedAt: timestamp,
        });
        themeIds.push(id);
      }
    }
    results.themes = themeIds.length;

    // ═══════════════════════════════════════════════════════════════
    // 3. IDENTITIES
    // ═══════════════════════════════════════════════════════════════
    const identityIds: Id<"identities">[] = [];
    for (const pageData of IDENTITIES_DATA) {
      const existing = await ctx.db
        .query("identities")
        .withIndex("by_slug", (q) => q.eq("slug", pageData.slug))
        .first();

      if (existing && !existing.deletionTime) {
        identityIds.push(existing._id);
      } else {
        const { userIndex, themeIndex, ...rest } = pageData;
        const id = await ctx.db.insert("identities", {
          ...rest,
          userId: userIds[userIndex],
          themeId: themeIds[themeIndex],
          updatedAt: timestamp,
        });
        identityIds.push(id);
      }
    }
    results.identities = identityIds.length;

    // ═══════════════════════════════════════════════════════════════
    // 4. LINKS
    // ═══════════════════════════════════════════════════════════════
    const linkIds: Id<"links">[] = [];
    for (const linkData of LINKS_DATA) {
      const { identityIndex, ...rest } = linkData;
      const identityId = identityIds[identityIndex];

      // Check if link already exists by title and identityId
      const existing = await ctx.db
        .query("links")
        .withIndex("by_identity", (q) => q.eq("identityId", identityId).eq("deletionTime", undefined))
        .filter((q) => q.eq(q.field("title"), rest.title))
        .first();

      if (existing) {
        linkIds.push(existing._id);
      } else {
        const id = await ctx.db.insert("links", {
          ...rest,
          identityId,
          updatedAt: timestamp,
        });
        linkIds.push(id);
      }
    }
    results.links = linkIds.length;

    // ═══════════════════════════════════════════════════════════════
    // 5. TAGS
    // ═══════════════════════════════════════════════════════════════
    const tagIds: Id<"tags">[] = [];
    for (const tagData of TAGS_DATA) {
      const { userIndex, ...rest } = tagData;
      const userId = userIds[userIndex];

      const existing = await ctx.db
        .query("tags")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("name"), rest.name))
        .first();

      if (existing) {
        tagIds.push(existing._id);
      } else {
        const id = await ctx.db.insert("tags", {
          ...rest,
          userId,
          updatedAt: timestamp,
        });
        tagIds.push(id);
      }
    }
    results.tags = tagIds.length;

    // ═══════════════════════════════════════════════════════════════
    // 6. LINK_TAGS
    // ═══════════════════════════════════════════════════════════════
    let linkTagsCreated = 0;
    for (const { linkIndex, tagIndex } of LINK_TAGS_DATA) {
      const linkId = linkIds[linkIndex];
      const tagId = tagIds[tagIndex];

      if (!linkId || !tagId) continue;

      const existing = await ctx.db
        .query("linkTags")
        .withIndex("by_link", (q) => q.eq("linkId", linkId))
        .filter((q) => q.eq(q.field("tagId"), tagId))
        .first();

      if (!existing) {
        await ctx.db.insert("linkTags", { linkId, tagId });
        linkTagsCreated++;
      }
    }
    results.linkTags = linkTagsCreated;

    // ═══════════════════════════════════════════════════════════════
    // 7. IDENTITY_VIEWS (generate random analytics)
    // ═══════════════════════════════════════════════════════════════
    let identityViewsCreated = 0;
    for (let i = 0; i < identityIds.length; i++) {
      const identityId = identityIds[i];
      const identity = IDENTITIES_DATA[i];
      if (!identity.isPublic) continue;

      // Check if we already have views for this page
      const existingViews = await ctx.db
        .query("identityViews")
        .withIndex("by_identity", (q) => q.eq("identityId", identityId))
        .first();

      if (existingViews) continue;

      // Generate 50-150 views
      const viewCount = 50 + Math.floor(Math.random() * 100);
      for (let j = 0; j < viewCount; j++) {
        const viewedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        const countryIdx = Math.floor(Math.random() * countries.length);
        await ctx.db.insert("identityViews", {
          identityId,
          viewedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[countryIdx],
          city: cities[countryIdx],
        });
        identityViewsCreated++;
      }
    }
    results.identityViews = identityViewsCreated;

    // ═══════════════════════════════════════════════════════════════
    // 8. LINK_CLICKS (generate random analytics)
    // ═══════════════════════════════════════════════════════════════
    let linkClicksCreated = 0;
    for (let i = 0; i < LINKS_DATA.length; i++) {
      const linkData = LINKS_DATA[i];
      if (linkData.type !== "link" || !linkData.clickCount) continue;

      const linkId = linkIds[i];
      const identityId = identityIds[linkData.identityIndex];

      // Check if we already have clicks for this link
      const existingClicks = await ctx.db
        .query("linkClicks")
        .withIndex("by_link", (q) => q.eq("linkId", linkId))
        .first();

      if (existingClicks) continue;

      // Generate clicks (scaled down for demo)
      const clickCount = Math.min(linkData.clickCount, 30 + Math.floor(Math.random() * 30));
      for (let j = 0; j < clickCount; j++) {
        const clickedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
        const countryIdx = Math.floor(Math.random() * countries.length);
        await ctx.db.insert("linkClicks", {
          linkId,
          identityId,
          clickedAt,
          visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          country: countries[countryIdx],
        });
        linkClicksCreated++;
      }
    }
    results.linkClicks = linkClicksCreated;

    // ═══════════════════════════════════════════════════════════════
    // 9. USER_SETTINGS
    // ═══════════════════════════════════════════════════════════════
    let settingsCreated = 0;
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const existing = await ctx.db
        .query("userSettings")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (!existing) {
        // Find user's first identity for default
        const userIdentities = IDENTITIES_DATA.filter((p) => p.userIndex === i);
        const firstIdentityIndex = IDENTITIES_DATA.indexOf(userIdentities[0]);

        await ctx.db.insert("userSettings", {
          userId,
          darkMode: i % 2 === 0,
          emailNotifications: true,
          defaultIdentityId: firstIdentityIndex >= 0 ? identityIds[firstIdentityIndex] : undefined,
          updatedAt: timestamp,
        });
        settingsCreated++;
      }
    }
    results.userSettings = settingsCreated;

    // ═══════════════════════════════════════════════════════════════
    // 10. USER_PROGRESS
    // ═══════════════════════════════════════════════════════════════
    let progressCreated = 0;
    for (const userId of userIds) {
      const existing = await ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (!existing) {
        await ctx.db.insert("userProgress", {
          userId,
          completedIntro: true,
          addedFirstLink: true,
          publishedIdentity: true,
          updatedAt: timestamp,
        });
        progressCreated++;
      }
    }
    results.userProgress = progressCreated;

    // ═══════════════════════════════════════════════════════════════
    // 11. IDENTITY_COLLABORATORS
    // ═══════════════════════════════════════════════════════════════
    let collaboratorsCreated = 0;
    for (let i = 0; i < IDENTITIES_DATA.length; i++) {
      const identityId = identityIds[i];
      const userId = userIds[IDENTITIES_DATA[i].userIndex];

      const existing = await ctx.db
        .query("identityCollaborators")
        .withIndex("by_identity", (q) => q.eq("identityId", identityId))
        .first();

      if (!existing) {
        await ctx.db.insert("identityCollaborators", {
          identityId,
          userId,
          role: "owner",
          invitedAt: timestamp - 30 * 24 * 60 * 60 * 1000,
          acceptedAt: timestamp - 30 * 24 * 60 * 60 * 1000,
        });
        collaboratorsCreated++;
      }
    }

    // Add cross-collaborators
    if (collaboratorsCreated > 0) {
      // Sarah can edit Alex's personal identity
      await ctx.db.insert("identityCollaborators", {
        identityId: identityIds[0],
        userId: userIds[1],
        role: "editor",
        invitedAt: timestamp - 7 * 24 * 60 * 60 * 1000,
        acceptedAt: timestamp - 6 * 24 * 60 * 60 * 1000,
      });
      // Alex can view Sarah's tech identity
      await ctx.db.insert("identityCollaborators", {
        identityId: identityIds[3],
        userId: userIds[0],
        role: "viewer",
        invitedAt: timestamp - 5 * 24 * 60 * 60 * 1000,
        acceptedAt: timestamp - 5 * 24 * 60 * 60 * 1000,
      });
      collaboratorsCreated += 2;
    }
    results.identityCollaborators = collaboratorsCreated;

    // ═══════════════════════════════════════════════════════════════
    // 12. AUDIT_LOGS
    // ═══════════════════════════════════════════════════════════════
    const auditActions = ["user.login", "identity.create", "identity.update", "link.create", "link.update", "theme.apply", "settings.update"];
    let auditLogsCreated = 0;

    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];

      // Check if user already has audit logs
      const existing = await ctx.db
        .query("auditLogs")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();

      if (existing) continue;

      // Generate 10-20 audit logs per user
      const logCount = 10 + Math.floor(Math.random() * 10);
      for (let j = 0; j < logCount; j++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const logTimestamp = timestamp - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000);
        const action = auditActions[Math.floor(Math.random() * auditActions.length)];
        const entityType = action.split(".")[0];

        await ctx.db.insert("auditLogs", {
          userId,
          action,
          entityType,
          entityId: `entity-${Math.random().toString(36).substring(2, 8)}`,
          metadata: {
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          },
          timestamp: logTimestamp,
        });
        auditLogsCreated++;
      }
    }
    results.auditLogs = auditLogsCreated;

    return {
      message: "All seed data created successfully!",
      results,
    };
  },
});

/**
 * Clear all demo data (use with caution!)
 */
export const clearAllDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, number> = {};

    // Find demo users
    const demoUserIds = [];
    for (const userData of USERS_DATA) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", userData.clerkUserId))
        .first();
      if (user) demoUserIds.push(user._id);
    }

    // Delete in reverse dependency order
    let deleted = 0;

    // Audit logs
    for (const userId of demoUserIds) {
      const logs = await ctx.db.query("auditLogs").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
      for (const log of logs) { await ctx.db.delete(log._id); deleted++; }
    }
    results.auditLogs = deleted;

    // Get all identities for these users
    const identityIds: Id<"identities">[] = [];
    for (const userId of demoUserIds) {
      const pages = await ctx.db.query("identities").withIndex("by_user", (q) => q.eq("userId", userId).eq("deletionTime", undefined)).collect();
      identityIds.push(...pages.map(p => p._id));
    }

    // Page collaborators
    deleted = 0;
    for (const identityId of identityIds) {
      const collabs = await ctx.db.query("identityCollaborators").withIndex("by_identity", (q) => q.eq("identityId", identityId)).collect();
      for (const c of collabs) { await ctx.db.delete(c._id); deleted++; }
    }
    results.identityCollaborators = deleted;

    // Link clicks and page views
    deleted = 0;
    for (const identityId of identityIds) {
      const clicks = await ctx.db.query("linkClicks").withIndex("by_identity", (q) => q.eq("identityId", identityId)).collect();
      for (const c of clicks) { await ctx.db.delete(c._id); deleted++; }
    }
    results.linkClicks = deleted;

    deleted = 0;
    for (const identityId of identityIds) {
      const views = await ctx.db.query("identityViews").withIndex("by_identity", (q) => q.eq("identityId", identityId)).collect();
      for (const v of views) { await ctx.db.delete(v._id); deleted++; }
    }
    results.identityViews = deleted;

    // Links and link tags
    deleted = 0;
    for (const identityId of identityIds) {
      const links = await ctx.db.query("links").withIndex("by_identity", (q) => q.eq("identityId", identityId).eq("deletionTime", undefined)).collect();
      for (const link of links) {
        const linkTags = await ctx.db.query("linkTags").withIndex("by_link", (q) => q.eq("linkId", link._id)).collect();
        for (const lt of linkTags) { await ctx.db.delete(lt._id); }
        await ctx.db.delete(link._id);
        deleted++;
      }
    }
    results.links = deleted;

    // Tags
    deleted = 0;
    for (const userId of demoUserIds) {
      const tags = await ctx.db.query("tags").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
      for (const tag of tags) { await ctx.db.delete(tag._id); deleted++; }
    }
    results.tags = deleted;

    // Identities
    deleted = 0;
    for (const identityId of identityIds) {
      await ctx.db.delete(identityId);
      deleted++;
    }
    results.identities = deleted;

    // User settings and progress
    deleted = 0;
    for (const userId of demoUserIds) {
      const settings = await ctx.db.query("userSettings").withIndex("by_user", (q) => q.eq("userId", userId)).first();
      if (settings) { await ctx.db.delete(settings._id); deleted++; }
    }
    results.userSettings = deleted;

    deleted = 0;
    for (const userId of demoUserIds) {
      const progress = await ctx.db.query("userProgress").withIndex("by_user", (q) => q.eq("userId", userId)).first();
      if (progress) { await ctx.db.delete(progress._id); deleted++; }
    }
    results.userProgress = deleted;

    // Users (last)
    deleted = 0;
    for (const userId of demoUserIds) {
      await ctx.db.delete(userId);
      deleted++;
    }
    results.users = deleted;

    return {
      message: "All demo data cleared!",
      results,
    };
  },
});
