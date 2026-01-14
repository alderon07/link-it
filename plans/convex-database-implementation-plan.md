 Overview

 Migrate Link-It from mock data to a fully-featured Convex database with real-time capabilities, type-safe
 queries/mutations, and Clerk authentication integration.

 Current State: Mock data in src/dummy.json with DatabaseClient abstraction
 Target State: Convex reactive database with real-time subscriptions

 ---
 Architecture Map (Current System)

 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                              FRONTEND (Next.js 16)                          │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
 │  │  Public Pages   │  │  Admin Pages    │  │  Components                 │  │
 │  │  /[username]    │  │  /admin/*       │  │  - page-manager.tsx         │  │
 │  │                 │  │                 │  │  - analytics-dashboard.tsx  │  │
 │  │  Real-time:     │  │  Authenticated  │  │  - public-page-component    │  │
 │  │  - View counts  │  │  via Clerk      │  │  - page-links-manager       │  │
 │  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
 │           │                    │                          │                 │
 │           └────────────────────┼──────────────────────────┘                 │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                       SERVER ACTIONS / API                                  │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  src/actions/               │    src/app/api/v1/                      │  │
 │  │  - pages.ts                 │    - pages/route.ts                     │  │
 │  │  - links.ts                 │    - links/route.ts                     │  │
 │  │  (FormData + Zod)           │    - webhooks/clerk/route.ts            │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                          SERVICE LAYER                                      │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  src/data/pages/pageService.ts  │  src/data/links/linkService.ts      │  │
 │  │  - Ownership verification       │  - Ownership through page           │  │
 │  │  - Slug uniqueness              │  - Reorder validation               │  │
 │  │  - Business logic errors        │  - Click tracking                   │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                        DATA ACCESS LAYER                                    │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  src/data/db/client.ts      │  DatabaseClient Interface               │  │
 │  │  ├── users.findById()       │  ├── pages.findBySlug()                 │  │
 │  │  ├── pages.create()         │  ├── links.reorder()                    │  │
 │  │  └── themes.findAll()       │  └── Soft delete support                │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 │                                ▼                                            │
 │  ┌──────────────────────────────────────────────────────────────────────┐   │
 │  │                    src/dummy.json (Mock Data)                        │   │
 │  │  users[], pages[], links[], themes[], pageViews[], linkClicks[]      │   │
 │  └──────────────────────────────────────────────────────────────────────┘   │
 └─────────────────────────────────────────────────────────────────────────────┘

                               EXTERNAL SERVICES
 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │     Clerk       │  │    PostHog      │  │   Vercel        │
 │  Authentication │  │   Analytics     │  │   Hosting       │
 └─────────────────┘  └─────────────────┘  └─────────────────┘

 ---
 Architecture Map (Target with Convex)

 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                              FRONTEND (Next.js 16)                          │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
 │  │  Public Pages   │  │  Admin Pages    │  │  Components                 │  │
 │  │  /[username]    │  │  /admin/*       │  │  useQuery() → Real-time     │  │
 │  │                 │  │                 │  │  useMutation() → Optimistic │  │
 │  │  Live updates!  │  │  Authenticated  │  │                             │  │
 │  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
 │           │                    │                          │                 │
 │           └────────────────────┼──────────────────────────┘                 │
 │                                │                                            │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │              ConvexProviderWithClerk (Layout)                         │  │
 │  │              - Real-time WebSocket connection                         │  │
 │  │              - Automatic auth token passing                           │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 └────────────────────────────────┼────────────────────────────────────────────┘
                                  │
                                  ▼ WebSocket + HTTP
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                           CONVEX BACKEND                                    │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │  convex/                                                                    │
 │  ├── schema.ts          → Type-safe table definitions                       │
 │  ├── auth.config.ts     → Clerk JWT verification                            │
 │  │                                                                          │
 │  ├── users/                                                                 │
 │  │   ├── queries.ts     → getUserByClerkId, getUserPages                    │
 │  │   └── mutations.ts   → createUser, updateUser, deleteUser                │
 │  │                                                                          │
 │  ├── pages/                                                                 │
 │  │   ├── queries.ts     → getPage, getUserPages, isSlugAvailable            │
 │  │   ├── mutations.ts   → createPage, updatePage, deletePage                │
 │  │   └── public.ts      → getPublicPage (no auth)                           │
 │  │                                                                          │
 │  ├── links/                                                                 │
 │  │   ├── queries.ts     → getPageLinks, getLink                             │
 │  │   ├── mutations.ts   → createLink, updateLink, reorderLinks              │
 │  │   └── public.ts      → trackClick (no auth)                              │
 │  │                                                                          │
 │  ├── themes/            → System + custom themes                            │
 │  ├── analytics/         → Page views, link clicks (future)                  │
 │  ├── http.ts            → Clerk webhook handler                             │
 │  └── crons.ts           → Scheduled analytics aggregation                   │
 │                                                                             │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │                         CONVEX DATABASE                                     │
 │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │
 │  │  users  │  │  pages  │  │  links  │  │ themes  │  │ Future tables   │   │
 │  │         │──│         │──│         │  │         │  │ - pageViews     │   │
 │  │         │  │         │──│         │  │         │  │ - linkClicks    │   │
 │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │ - collaborators │   │
 │      │             │            │                     │ - auditLogs     │   │
 │      └─────────────┴────────────┴─────────────────────┴─────────────────┘   │
 └─────────────────────────────────────────────────────────────────────────────┘

                               EXTERNAL SERVICES
 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │     Clerk       │  │    PostHog      │  │   Vercel        │
 │  Auth + JWT     │──│   Analytics     │  │   Hosting       │
 │  Webhooks ──────┼──│   (parallel)    │  │                 │
 └─────────────────┘  └─────────────────┘  └─────────────────┘

 ---
 Entity Relationship Diagram

 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                           ENTITY RELATIONSHIPS                               │
 └──────────────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
   │    USER     │         │    PAGE     │         │    LINK     │
   ├─────────────┤         ├─────────────┤         ├─────────────┤
   │ _id         │◄───┐    │ _id         │◄───┐    │ _id         │
   │ clerkUserId │    │    │ userId ─────┼────┘    │ pageId ─────┼────┐
   │ email       │    │    │ name        │         │ title       │    │
   │ username    │    │    │ slug (uniq) │         │ url         │    │
   │ displayName │    │    │ bio         │         │ type        │    │
   │ avatarUrl   │    │    │ themeId ────┼────┐    │ description │    │
   │ deletionTime│    │    │ isPublic    │    │    │ isActive    │    │
   │ updatedAt   │    │    │ viewCount   │    │    │ orderIndex  │    │
   └─────────────┘    │    │ seoTitle    │    │    │ clickCount  │    │
         │            │    │ deletionTime│    │    │ visibleFrom │    │
         │            │    │ updatedAt   │    │    │ visibleUntil│    │
         │            │    └─────────────┘    │    │ deletionTime│    │
         │            │          │            │    │ updatedAt   │    │
         │     1:many │          │ many:1     │    └─────────────┘    │
         │            │          │            │          │            │
         │            │          │            │          │ 1:many     │
         │            │          │            │          │            │
         │            │          ▼            │          ▼            │
         │            │    ┌─────────────┐    │    Links belong to    │
         │            │    │   THEME     │    │    exactly one Page   │
         │            │    ├─────────────┤    │                       │
         │            │    │ _id         │◄───┘                       │
         │            └────┤ userId      │  (null = system theme)     │
         │                 │ name        │                            │
         │   1:many        │ bgColor     │                            │
         │   (custom       │ textColor   │                            │
         │    themes)      │ accentColor │                            │
         │                 │ isCustom    │                            │
         └────────────────►│ updatedAt   │                            │
                           └─────────────┘                            │
                                                                      │
   ┌──────────────────────────────────────────────────────────────────┘
   │
   │  FUTURE TABLES
   │
   │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │  │ PAGE_VIEWS      │  │ LINK_CLICKS     │  │ COLLABORATORS   │
   │  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
   └─►│ pageId          │  │ linkId          │  │ pageId          │
      │ viewedAt        │  │ pageId          │  │ userId          │
      │ visitorId       │  │ clickedAt       │  │ role            │
      │ userAgent       │  │ visitorId       │  │ invitedAt       │
      │ referrer        │  │ userAgent       │  │ acceptedAt      │
      │ country/city    │  │ referrer        │  └─────────────────┘
      └─────────────────┘  └─────────────────┘

   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ TAGS            │  │ LINK_TAGS       │  │ AUDIT_LOGS      │
   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
   │ _id             │◄─┤ tagId           │  │ userId          │
   │ userId          │  │ linkId          │  │ action          │
   │ name            │  └─────────────────┘  │ entityType      │
   │ color           │    (many:many)        │ entityId        │
   └─────────────────┘                       │ metadata        │
                                             │ timestamp       │
                                             └─────────────────┘

 ---
 Convex Schema Design

 // convex/schema.ts
 import { defineSchema, defineTable } from "convex/server";
 import { v } from "convex/values";

 export default defineSchema({
   // ═══════════════════════════════════════════════════════════════
   // USERS - Core user accounts (synced from Clerk)
   // ═══════════════════════════════════════════════════════════════
   users: defineTable({
     clerkUserId: v.string(),           // Clerk's user ID (subject)
     email: v.string(),
     username: v.string(),              // Unique, URL-safe
     displayName: v.optional(v.string()),
     avatarUrl: v.optional(v.string()),
     deletionTime: v.optional(v.number()), // Soft delete timestamp
     updatedAt: v.number(),
   })
     .index("by_clerk_id", ["clerkUserId"])
     .index("by_email", ["email"])
     .index("by_username", ["username"]),

   // ═══════════════════════════════════════════════════════════════
   // PAGES - User's "link in bio" pages (Identities)
   // ═══════════════════════════════════════════════════════════════
   pages: defineTable({
     userId: v.id("users"),             // Owner
     name: v.string(),                  // Display name
     slug: v.string(),                  // URL path (unique globally)
     bio: v.optional(v.string()),       // Short bio (max 500)
     description: v.optional(v.string()), // Longer description (max 1000)
     avatarUrl: v.optional(v.string()),
     themeId: v.optional(v.id("themes")),
     isPublic: v.boolean(),
     viewCount: v.number(),             // Total views

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
     icon: v.optional(v.string()),      // Icon identifier
     isActive: v.boolean(),
     orderIndex: v.number(),            // Sort order
     clickCount: v.number(),            // Total clicks

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
     bgColor: v.string(),               // Hex color
     textColor: v.string(),
     accentColor: v.string(),
     buttonStyle: v.optional(v.string()), // Future: rounded, sharp, pill
     fontFamily: v.optional(v.string()),  // Future: custom fonts
     userId: v.optional(v.id("users")),   // null = system theme
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
   })
     .index("by_user", ["userId"]),

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
   })
     .index("by_page", ["pageId", "viewedAt"]),

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
   })
     .index("by_user", ["userId"]),

   // ═══════════════════════════════════════════════════════════════
   // USER_PROGRESS - Onboarding tracking
   // ═══════════════════════════════════════════════════════════════
   userProgress: defineTable({
     userId: v.id("users"),
     completedIntro: v.boolean(),
     addedFirstLink: v.boolean(),
     publishedPage: v.boolean(),
     updatedAt: v.number(),
   })
     .index("by_user", ["userId"]),

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

 ---
 File Structure

 convex/
 ├── _generated/                    # Auto-generated (don't edit)
 ├── schema.ts                      # Schema definition (above)
 ├── auth.config.ts                 # Clerk JWT configuration
 │
 ├── lib/
 │   ├── utils.ts                   # Helpers (sanitization, slug generation)
 │   └── validators.ts              # Shared validation logic
 │
 ├── users/
 │   ├── queries.ts                 # getUserByClerkId, getCurrentUser
 │   ├── mutations.ts               # updateUser
 │   └── internal.ts                # createFromClerk (webhook only)
 │
 ├── pages/
 │   ├── queries.ts                 # getPage, getUserPages, isSlugAvailable
 │   ├── mutations.ts               # createPage, updatePage, deletePage
 │   └── public.ts                  # getPublicPage, incrementViewCount
 │
 ├── links/
 │   ├── queries.ts                 # getLink, getPageLinks
 │   ├── mutations.ts               # createLink, updateLink, deleteLink, reorderLinks
 │   └── public.ts                  # getPublicPageLinks, trackClick
 │
 ├── themes/
 │   ├── queries.ts                 # getTheme, getSystemThemes, getUserThemes
 │   └── mutations.ts               # createTheme, updateTheme, deleteTheme
 │
 ├── settings/
 │   ├── queries.ts                 # getUserSettings, getUserProgress
 │   └── mutations.ts               # updateSettings, updateProgress
 │
 ├── http.ts                        # HTTP routes (Clerk webhook)
 └── crons.ts                       # Scheduled jobs (future analytics)

 ---
 Implementation Phases

 Phase 1: Setup & Infrastructure

 1. Install Convex: pnpm add convex
 2. Initialize: npx convex init
 3. Create schema.ts
 4. Configure Clerk JWT template
 5. Create auth.config.ts
 6. Update layout.tsx with ConvexProviderWithClerk
 7. Set up http.ts for Clerk webhooks

 Phase 2: Core Queries & Mutations

 1. Implement users/ functions
 2. Implement pages/ functions
 3. Implement links/ functions
 4. Implement themes/ functions
 5. Test all CRUD operations

 Phase 3: Component Migration

 1. Create React hooks layer (src/hooks/convex/)
 2. Migrate PageManager to useQuery/useMutation
 3. Migrate PublicPageComponent
 4. Migrate PageLinksManager
 5. Migrate AnalyticsDashboard
 6. Add optimistic updates

 Phase 4: Cleanup

 1. Remove src/data/ folder
 2. Remove src/dummy.json
 3. Update/remove old API routes
 4. Update server actions to use Convex

 Phase 5: Documentation

 1. Create docs/convex-architecture.md
 2. Update CLAUDE.md with new patterns
 3. Document all Convex functions

 ---
 Key Files to Modify
 ┌──────────────────────────────────────────┬─────────────────────────────────┐
 │                   File                   │             Change              │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/app/layout.tsx                       │ Add ConvexProviderWithClerk     │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/page-manager.tsx          │ Replace mock data with useQuery │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/public-page-component.tsx │ Use Convex public queries       │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/page-links-manager.tsx    │ Use Convex mutations            │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/analytics-dashboard.tsx   │ Connect to Convex analytics     │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ package.json                             │ Add convex dependency           │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ .env.local                               │ Add NEXT_PUBLIC_CONVEX_URL      │
 └──────────────────────────────────────────┴─────────────────────────────────┘
 ---
 Verification Steps

 1. Run npx convex dev - Convex dashboard accessible
 2. Create a test user via Clerk webhook
 3. Create a page via admin UI - appears in Convex dashboard
 4. Add links to page - real-time updates work
 5. View public page - view count increments live
 6. Click link - click count updates
 7. Check multiple browser tabs - real-time sync works
 8. Run pnpm build - no TypeScript errors

 ---
 Future Features (Already Scaffolded)

 - Collaborators: pageCollaborators table ready
 - Link Scheduling: visibleFrom/visibleUntil fields ready
 - Tags: tags and linkTags tables ready
 - Custom Domains: customDomain field ready
 - Analytics: pageViews and linkClicks tables ready
 - Audit Logs: auditLogs table ready

 ---
 Notes

 - Will create docs/convex-architecture.md during implementation
 - PostHog remains for behavioral analytics (Convex handles operational data)
 - Soft deletes via deletionTime field (same pattern as current)
 - All timestamps use Unix milliseconds (Convex standard)
