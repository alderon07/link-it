import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════════
  // USERS - Core user accounts (synced from Clerk)
  // ═══════════════════════════════════════════════════════════════
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    deletionTime: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // ═══════════════════════════════════════════════════════════════
  // PAGES - User's "link in bio" pages (Identities)
  // ═══════════════════════════════════════════════════════════════
  pages: defineTable({
    userId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    bio: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    themeId: v.optional(v.id("themes")),
    isPublic: v.boolean(),
    viewCount: v.number(),

    // SEO
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    ogImageUrl: v.optional(v.string()),

    // Future: Custom domains
    customDomain: v.optional(v.string()),
    customDomainVerified: v.optional(v.boolean()),

    deletionTime: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId", "deletionTime"])
    .index("by_slug", ["slug"])
    .index("by_custom_domain", ["customDomain"]),

  // ═══════════════════════════════════════════════════════════════
  // LINKS - Individual links on a page
  // ═══════════════════════════════════════════════════════════════
  links: defineTable({
    pageId: v.id("pages"),
    title: v.string(),
    url: v.string(),
    type: v.union(
      v.literal("link"),
      v.literal("header"),
      v.literal("divider")
    ),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    isActive: v.boolean(),
    orderIndex: v.number(),
    clickCount: v.number(),

    // Scheduling
    visibleFrom: v.optional(v.number()),
    visibleUntil: v.optional(v.number()),

    deletionTime: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_page", ["pageId", "deletionTime", "orderIndex"])
    .index("by_page_active", ["pageId", "isActive", "deletionTime"]),

  // ═══════════════════════════════════════════════════════════════
  // THEMES - Color themes (system + custom)
  // ═══════════════════════════════════════════════════════════════
  themes: defineTable({
    name: v.string(),
    bgColor: v.string(),
    textColor: v.string(),
    accentColor: v.string(),
    buttonStyle: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    isCustom: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_system", ["isCustom"]),

  // ═══════════════════════════════════════════════════════════════
  // TAGS - Link categorization (Future)
  // ═══════════════════════════════════════════════════════════════
  tags: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.string(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ═══════════════════════════════════════════════════════════════
  // LINK_TAGS - Many-to-many junction (Future)
  // ═══════════════════════════════════════════════════════════════
  linkTags: defineTable({
    linkId: v.id("links"),
    tagId: v.id("tags"),
  })
    .index("by_link", ["linkId"])
    .index("by_tag", ["tagId"]),

  // ═══════════════════════════════════════════════════════════════
  // PAGE_COLLABORATORS - Shared page access (Future)
  // ═══════════════════════════════════════════════════════════════
  pageCollaborators: defineTable({
    pageId: v.id("pages"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    invitedAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_page", ["pageId"])
    .index("by_user", ["userId"]),

  // ═══════════════════════════════════════════════════════════════
  // PAGE_VIEWS - Analytics (Future - supplement PostHog)
  // ═══════════════════════════════════════════════════════════════
  pageViews: defineTable({
    pageId: v.id("pages"),
    viewedAt: v.number(),
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
  }).index("by_page", ["pageId", "viewedAt"]),

  // ═══════════════════════════════════════════════════════════════
  // LINK_CLICKS - Analytics (Future - supplement PostHog)
  // ═══════════════════════════════════════════════════════════════
  linkClicks: defineTable({
    linkId: v.id("links"),
    pageId: v.id("pages"),
    clickedAt: v.number(),
    visitorId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
  })
    .index("by_link", ["linkId", "clickedAt"])
    .index("by_page", ["pageId", "clickedAt"]),

  // ═══════════════════════════════════════════════════════════════
  // USER_SETTINGS - Preferences
  // ═══════════════════════════════════════════════════════════════
  userSettings: defineTable({
    userId: v.id("users"),
    darkMode: v.boolean(),
    emailNotifications: v.boolean(),
    defaultPageId: v.optional(v.id("pages")),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ═══════════════════════════════════════════════════════════════
  // USER_PROGRESS - Onboarding tracking
  // ═══════════════════════════════════════════════════════════════
  userProgress: defineTable({
    userId: v.id("users"),
    completedIntro: v.boolean(),
    addedFirstLink: v.boolean(),
    publishedPage: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // ═══════════════════════════════════════════════════════════════
  // AUDIT_LOGS - Change tracking (Future)
  // ═══════════════════════════════════════════════════════════════
  auditLogs: defineTable({
    userId: v.id("users"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId", "timestamp"])
    .index("by_entity", ["entityType", "entityId"]),
});
