/**
 * Generate JSONL seed files for all Convex tables
 * Run with: node scripts/generate-seed-data.js
 */

const fs = require("fs");
const path = require("path");

const SEED_DIR = path.join(__dirname, "..", "seed-data");

// Ensure seed-data directory exists
if (!fs.existsSync(SEED_DIR)) {
  fs.mkdirSync(SEED_DIR, { recursive: true });
}

// Helper to write JSONL file
function writeJsonl(filename, data) {
  const filepath = path.join(SEED_DIR, filename);
  const content = data.map((item) => JSON.stringify(item)).join("\n");
  fs.writeFileSync(filepath, content + "\n");
  console.log(`Created ${filename} with ${data.length} records`);
}

// Generate timestamp
const now = Date.now();
const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════
// USERS - Demo users
// ═══════════════════════════════════════════════════════════════
const users = [
  {
    clerkUserId: "user_demo_alex",
    email: "alex@example.com",
    username: "alexj",
    displayName: "Alex Johnson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    updatedAt: now,
  },
  {
    clerkUserId: "user_demo_sarah",
    email: "sarah@example.com",
    username: "sarahc",
    displayName: "Sarah Chen",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    updatedAt: now,
  },
  {
    clerkUserId: "user_demo_mike",
    email: "mike@example.com",
    username: "miker",
    displayName: "Mike Rodriguez",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    updatedAt: now,
  },
];

writeJsonl("users.jsonl", users);

// ═══════════════════════════════════════════════════════════════
// THEMES - System themes
// ═══════════════════════════════════════════════════════════════
const themes = [
  { name: "Midnight Dark", bgColor: "#0f0f1a", textColor: "#f5f5f5", accentColor: "#a855f7", isCustom: false, updatedAt: now },
  { name: "Ocean Blue", bgColor: "#1e3a5f", textColor: "#ffffff", accentColor: "#3b82f6", isCustom: false, updatedAt: now },
  { name: "Forest Green", bgColor: "#1a2e1a", textColor: "#f0fff0", accentColor: "#22c55e", isCustom: false, updatedAt: now },
  { name: "Sunset Coral", bgColor: "#2d1f1f", textColor: "#fff5f5", accentColor: "#f87171", isCustom: false, updatedAt: now },
  { name: "Neon Cyber", bgColor: "#0a0e1a", textColor: "#00ff00", accentColor: "#ff00ff", isCustom: false, updatedAt: now },
  { name: "Minimal Light", bgColor: "#fafafa", textColor: "#1a1a1a", accentColor: "#0ea5e9", isCustom: false, updatedAt: now },
  { name: "Warm Sunset", bgColor: "#fef3c7", textColor: "#78350f", accentColor: "#f59e0b", isCustom: false, updatedAt: now },
];

writeJsonl("themes.jsonl", themes);

// ═══════════════════════════════════════════════════════════════
// PAGES - User pages/identities
// ═══════════════════════════════════════════════════════════════
const pages = [
  // Alex's pages (0-2)
  { name: "Personal", slug: "alexj-personal", bio: "Welcome to my personal corner of the internet!", isPublic: true, viewCount: 1247, updatedAt: now, seoTitle: "Alex Johnson - Personal Links", seoDescription: "Connect with Alex Johnson" },
  { name: "Work Portfolio", slug: "alexj-work", bio: "Professional services and portfolio", isPublic: true, viewCount: 856, updatedAt: now },
  { name: "Gaming", slug: "alexj-gaming", bio: "My gaming profiles and streams", isPublic: true, viewCount: 432, updatedAt: now },
  // Sarah's pages (3-4)
  { name: "Tech Blog", slug: "sarahc-tech", bio: "Tech insights and tutorials", isPublic: true, viewCount: 2103, updatedAt: now },
  { name: "Personal", slug: "sarahc-personal", bio: "My personal links and social media", isPublic: true, viewCount: 1567, updatedAt: now },
  // Mike's pages (5-7)
  { name: "Music", slug: "miker-music", bio: "My music, tracks, and performances", isPublic: true, viewCount: 3421, updatedAt: now },
  { name: "Store", slug: "miker-store", bio: "Merch and exclusive content", isPublic: true, viewCount: 987, updatedAt: now },
  { name: "Private", slug: "miker-private", bio: "Private resources", isPublic: false, viewCount: 0, updatedAt: now },
];

writeJsonl("pages.jsonl", pages);

// ═══════════════════════════════════════════════════════════════
// LINKS - Links for each page
// ═══════════════════════════════════════════════════════════════
const links = [
  // Alex Personal (page 0)
  { title: "Social Media", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0, updatedAt: now },
  { title: "Twitter / X", url: "https://twitter.com/alexj", type: "link", description: "Follow me for tech updates", icon: "twitter", isActive: true, orderIndex: 1, clickCount: 534, updatedAt: now },
  { title: "Instagram", url: "https://instagram.com/alexj", type: "link", description: "Photos and stories", icon: "instagram", isActive: true, orderIndex: 2, clickCount: 423, updatedAt: now },
  { title: "LinkedIn", url: "https://linkedin.com/in/alexj", type: "link", description: "Professional network", icon: "linkedin", isActive: true, orderIndex: 3, clickCount: 312, updatedAt: now },
  { title: "", url: "", type: "divider", isActive: true, orderIndex: 4, clickCount: 0, updatedAt: now },
  { title: "Content", url: "", type: "header", isActive: true, orderIndex: 5, clickCount: 0, updatedAt: now },
  { title: "YouTube Channel", url: "https://youtube.com/@alexj", type: "link", description: "Tutorials and vlogs", icon: "youtube", isActive: true, orderIndex: 6, clickCount: 867, updatedAt: now },
  { title: "Blog", url: "https://alexj.dev/blog", type: "link", description: "Thoughts on tech", icon: "pen", isActive: true, orderIndex: 7, clickCount: 234, updatedAt: now },
  { title: "GitHub", url: "https://github.com/alexj", type: "link", description: "Open source projects", icon: "github", isActive: true, orderIndex: 8, clickCount: 456, updatedAt: now },

  // Alex Work (page 1)
  { title: "Services", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0, updatedAt: now },
  { title: "Portfolio", url: "https://alexj.dev", type: "link", description: "View my work", icon: "briefcase", isActive: true, orderIndex: 1, clickCount: 567, updatedAt: now },
  { title: "Book a Call", url: "https://calendly.com/alexj", type: "link", description: "Schedule a consultation", icon: "calendar", isActive: true, orderIndex: 2, clickCount: 234, updatedAt: now },
  { title: "Email Me", url: "mailto:alex@alexj.dev", type: "link", description: "Get in touch", icon: "mail", isActive: true, orderIndex: 3, clickCount: 189, updatedAt: now },

  // Alex Gaming (page 2)
  { title: "Twitch", url: "https://twitch.tv/alexj", type: "link", description: "Watch me stream", icon: "twitch", isActive: true, orderIndex: 0, clickCount: 345, updatedAt: now },
  { title: "Discord Server", url: "https://discord.gg/alexj", type: "link", description: "Join the community", icon: "message-circle", isActive: true, orderIndex: 1, clickCount: 234, updatedAt: now },
  { title: "Steam", url: "https://steamcommunity.com/id/alexj", type: "link", description: "Add me on Steam", icon: "gamepad-2", isActive: true, orderIndex: 2, clickCount: 123, updatedAt: now },

  // Sarah Tech (page 3)
  { title: "Latest Articles", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0, updatedAt: now },
  { title: "Tech Blog", url: "https://sarahchen.tech", type: "link", description: "Read my latest posts", icon: "file-text", isActive: true, orderIndex: 1, clickCount: 1234, updatedAt: now },
  { title: "Newsletter", url: "https://sarahchen.tech/newsletter", type: "link", description: "Weekly tech insights", icon: "mail", isActive: true, orderIndex: 2, clickCount: 567, updatedAt: now },
  { title: "Code", url: "", type: "header", isActive: true, orderIndex: 3, clickCount: 0, updatedAt: now },
  { title: "GitHub", url: "https://github.com/sarahchen", type: "link", description: "Open source projects", icon: "github", isActive: true, orderIndex: 4, clickCount: 890, updatedAt: now },
  { title: "CodePen", url: "https://codepen.io/sarahchen", type: "link", description: "CSS experiments", icon: "code", isActive: true, orderIndex: 5, clickCount: 345, updatedAt: now },

  // Sarah Personal (page 4)
  { title: "Twitter / X", url: "https://twitter.com/sarahchen", type: "link", description: "Tech thoughts", icon: "twitter", isActive: true, orderIndex: 0, clickCount: 678, updatedAt: now },
  { title: "Instagram", url: "https://instagram.com/sarahchen", type: "link", description: "Life moments", icon: "instagram", isActive: true, orderIndex: 1, clickCount: 456, updatedAt: now },
  { title: "LinkedIn", url: "https://linkedin.com/in/sarahchen", type: "link", description: "Professional profile", icon: "linkedin", isActive: true, orderIndex: 2, clickCount: 345, updatedAt: now },

  // Mike Music (page 5)
  { title: "Listen", url: "", type: "header", isActive: true, orderIndex: 0, clickCount: 0, updatedAt: now },
  { title: "Spotify", url: "https://open.spotify.com/artist/mike", type: "link", description: "Stream my music", icon: "music", isActive: true, orderIndex: 1, clickCount: 2345, updatedAt: now },
  { title: "Apple Music", url: "https://music.apple.com/artist/mike", type: "link", description: "Listen on Apple Music", icon: "music-2", isActive: true, orderIndex: 2, clickCount: 1234, updatedAt: now },
  { title: "SoundCloud", url: "https://soundcloud.com/mike", type: "link", description: "Exclusive tracks", icon: "cloud", isActive: true, orderIndex: 3, clickCount: 876, updatedAt: now },
  { title: "Watch", url: "", type: "header", isActive: true, orderIndex: 4, clickCount: 0, updatedAt: now },
  { title: "YouTube", url: "https://youtube.com/@mikemusic", type: "link", description: "Music videos", icon: "youtube", isActive: true, orderIndex: 5, clickCount: 1567, updatedAt: now },
  { title: "TikTok", url: "https://tiktok.com/@mikemusic", type: "link", description: "Short clips", icon: "video", isActive: true, orderIndex: 6, clickCount: 2134, updatedAt: now },

  // Mike Store (page 6)
  { title: "Merch Store", url: "https://mikemusic.store", type: "link", description: "Official merchandise", icon: "shopping-bag", isActive: true, orderIndex: 0, clickCount: 456, updatedAt: now },
  { title: "Patreon", url: "https://patreon.com/mikemusic", type: "link", description: "Exclusive content", icon: "heart", isActive: true, orderIndex: 1, clickCount: 234, updatedAt: now },
  { title: "Concert Tickets", url: "https://tickets.mikemusic.com", type: "link", description: "Upcoming shows", icon: "ticket", isActive: true, orderIndex: 2, clickCount: 567, updatedAt: now },

  // Mike Private (page 7)
  { title: "Admin Dashboard", url: "https://admin.mikemusic.com", type: "link", description: "Management portal", icon: "lock", isActive: true, orderIndex: 0, clickCount: 45, updatedAt: now },
  { title: "Analytics", url: "https://analytics.mikemusic.com", type: "link", description: "Performance metrics", icon: "bar-chart", isActive: true, orderIndex: 1, clickCount: 34, updatedAt: now },
];

writeJsonl("links.jsonl", links);

// ═══════════════════════════════════════════════════════════════
// TAGS - User tags for organizing links
// ═══════════════════════════════════════════════════════════════
const tags = [
  // Alex's tags (0-3)
  { name: "Social", color: "#ec4899", updatedAt: now },
  { name: "Work", color: "#3b82f6", updatedAt: now },
  { name: "Content", color: "#22c55e", updatedAt: now },
  { name: "Gaming", color: "#8b5cf6", updatedAt: now },
  // Sarah's tags (4-6)
  { name: "Tech", color: "#0ea5e9", updatedAt: now },
  { name: "Social", color: "#ec4899", updatedAt: now },
  { name: "Code", color: "#10b981", updatedAt: now },
  // Mike's tags (7-9)
  { name: "Music", color: "#f59e0b", updatedAt: now },
  { name: "Business", color: "#6366f1", updatedAt: now },
  { name: "Social", color: "#ec4899", updatedAt: now },
];

writeJsonl("tags.jsonl", tags);

// ═══════════════════════════════════════════════════════════════
// PAGE_VIEWS - Analytics data
// ═══════════════════════════════════════════════════════════════
const referrers = ["https://google.com", "https://twitter.com", "https://linkedin.com", "direct", "https://facebook.com", "https://instagram.com"];
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile",
];
const countries = ["US", "UK", "CA", "DE", "FR", "AU", "JP", "BR", "IN", "MX"];
const cities = ["New York", "London", "Toronto", "Berlin", "Paris", "Sydney", "Tokyo", "São Paulo", "Mumbai", "Mexico City"];

const pageViews = [];
pages.forEach((page, pageIndex) => {
  const viewCount = 50 + Math.floor(Math.random() * 150);
  for (let i = 0; i < viewCount; i++) {
    const viewedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const countryIndex = Math.floor(Math.random() * countries.length);
    pageViews.push({
      viewedAt,
      visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      country: countries[countryIndex],
      city: cities[countryIndex],
    });
  }
});

writeJsonl("pageViews.jsonl", pageViews);

// ═══════════════════════════════════════════════════════════════
// LINK_CLICKS - Analytics data
// ═══════════════════════════════════════════════════════════════
const linkClicks = [];
links.forEach((link) => {
  if (link.type !== "link" || !link.clickCount) return;

  const clickCount = Math.min(link.clickCount, 50 + Math.floor(Math.random() * 50));
  for (let i = 0; i < clickCount; i++) {
    const clickedAt = thirtyDaysAgo + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const countryIndex = Math.floor(Math.random() * countries.length);
    linkClicks.push({
      clickedAt,
      visitorId: `visitor-${Math.random().toString(36).substring(2, 10)}`,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      country: countries[countryIndex],
    });
  }
});

writeJsonl("linkClicks.jsonl", linkClicks);

// ═══════════════════════════════════════════════════════════════
// USER_SETTINGS - User preferences
// ═══════════════════════════════════════════════════════════════
const userSettings = [
  { darkMode: true, emailNotifications: true, updatedAt: now },
  { darkMode: false, emailNotifications: true, updatedAt: now },
  { darkMode: true, emailNotifications: false, updatedAt: now },
];

writeJsonl("userSettings.jsonl", userSettings);

// ═══════════════════════════════════════════════════════════════
// USER_PROGRESS - Onboarding tracking
// ═══════════════════════════════════════════════════════════════
const userProgress = [
  { completedIntro: true, addedFirstLink: true, publishedPage: true, updatedAt: now },
  { completedIntro: true, addedFirstLink: true, publishedPage: true, updatedAt: now },
  { completedIntro: true, addedFirstLink: true, publishedPage: true, updatedAt: now },
];

writeJsonl("userProgress.jsonl", userProgress);

// ═══════════════════════════════════════════════════════════════
// PAGE_COLLABORATORS - Page access
// ═══════════════════════════════════════════════════════════════
const pageCollaborators = [];
// Owner entries for each page
for (let i = 0; i < pages.length; i++) {
  pageCollaborators.push({
    role: "owner",
    invitedAt: now - 30 * 24 * 60 * 60 * 1000,
    acceptedAt: now - 30 * 24 * 60 * 60 * 1000,
  });
}
// Add some cross-collaborators
pageCollaborators.push(
  { role: "editor", invitedAt: now - 7 * 24 * 60 * 60 * 1000, acceptedAt: now - 6 * 24 * 60 * 60 * 1000 },
  { role: "viewer", invitedAt: now - 5 * 24 * 60 * 60 * 1000, acceptedAt: now - 5 * 24 * 60 * 60 * 1000 }
);

writeJsonl("pageCollaborators.jsonl", pageCollaborators);

// ═══════════════════════════════════════════════════════════════
// LINK_TAGS - Many-to-many link-tag associations
// Note: These need linkId and tagId after import
// ═══════════════════════════════════════════════════════════════
const linkTags = [];
// We'll create placeholder entries - these will need to be linked after import
for (let i = 0; i < 20; i++) {
  linkTags.push({});
}

writeJsonl("linkTags.jsonl", linkTags);

// ═══════════════════════════════════════════════════════════════
// AUDIT_LOGS - Activity tracking
// ═══════════════════════════════════════════════════════════════
const auditActions = [
  "user.login", "user.logout", "page.create", "page.update", "page.delete",
  "link.create", "link.update", "link.delete", "link.reorder",
  "theme.apply", "settings.update", "collaborator.invite", "collaborator.accept"
];

const auditLogs = [];
for (let userIdx = 0; userIdx < 3; userIdx++) {
  const logCount = 15 + Math.floor(Math.random() * 10);
  for (let i = 0; i < logCount; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000);
    const action = auditActions[Math.floor(Math.random() * auditActions.length)];
    let entityType = action.split(".")[0];
    if (entityType === "collaborator") entityType = "page";

    auditLogs.push({
      action,
      entityType,
      entityId: `entity-${Math.random().toString(36).substring(2, 8)}`,
      metadata: {
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      },
      timestamp,
    });
  }
}

writeJsonl("auditLogs.jsonl", auditLogs);

console.log("\n✅ All seed files generated in seed-data/");
console.log("\nTo import all tables, run:");
console.log("  npx convex import --table <tablename> seed-data/<tablename>.jsonl --append");
console.log("\nOr use the seed mutation which handles foreign key relationships.");
