## Status: ✅ COMPLETED

The Convex database migration has been completed. All data operations now use Convex for real-time reactivity.

---

## Overview

This document describes the completed migration from mock data to a fully-featured Convex database with real-time capabilities, type-safe queries/mutations, and Clerk authentication integration.

**Completed Migration:**
- ✅ Convex schema defined with all tables (users, identities, links, themes, etc.)
- ✅ All queries and mutations implemented
- ✅ Public functions for public-facing pages
- ✅ Clerk webhook integration for user sync
- ✅ Custom React hooks for Convex operations
- ✅ All components migrated to use Convex
- ✅ Real-time updates working across all clients

**Current State:** Convex reactive database with real-time subscriptions
**Previous State:** Mock data in src/dummy.json with DatabaseClient abstraction

 ---
 Architecture Map (Current System)

 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                              FRONTEND (Next.js 16)                          │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
 │  │  Public Pages   │  │  Admin Pages    │  │  Components                 │  │
 │  │  /[username]    │  │  /admin/*       │  │  - IdentityManager.tsx      │  │
 │  │                 │  │                 │  │  - analytics-dashboard.tsx  │  │
 │  │  Real-time:     │  │  Authenticated  │  │  - PublicIdentityComponent  │  │
 │  │  - View counts  │  │  via Clerk      │  │  - IdentityLinksManager     │  │
 │  └────────┬────────┘  └────────┬────────┘  └──────────────┬──────────────┘  │
 │           │                    │                          │                 │
 │           └────────────────────┼──────────────────────────┘                 │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                       SERVER ACTIONS / API                                  │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  src/actions/               │    src/app/api/v1/                      │  │
 │  │  (removed - using Convex)   │    (removed - using Convex)            │  │
 │  │  - links.ts                 │    - links/route.ts                     │  │
 │  │  (FormData + Zod)           │    - webhooks/clerk/route.ts            │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                          SERVICE LAYER                                      │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  (removed - using Convex)       │  (removed - using Convex)            │  │
 │  │  - Slug uniqueness              │  - Reorder validation               │  │
 │  │  - Business logic errors        │  - Click tracking                   │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 ├────────────────────────────────┼────────────────────────────────────────────┤
 │                        DATA ACCESS LAYER                                    │
 │  ┌─────────────────────────────┼─────────────────────────────────────────┐  │
 │  │  src/data/db/client.ts      │  DatabaseClient Interface               │  │
 │  │  (removed - using Convex)   │  (removed - using Convex)              │  │
 │  │  └── themes.findAll()       │  └── Soft delete support                │  │
 │  └─────────────────────────────┼─────────────────────────────────────────┘  │
 │                                │                                            │
 │                                ▼                                            │
 │  ┌──────────────────────────────────────────────────────────────────────┐   │
 │  │                    src/dummy.json (Mock Data)                        │   │
 │  │  users[], identities[], links[], themes[], identityViews[], linkClicks[] │   │
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
 │  │   ├── queries.ts     → getUserByClerkId, getCurrentUser                 │
 │  │   └── mutations.ts   → createUser, updateUser, deleteUser                │
 │  │                                                                          │
 │  ├── pages/                                                                 │
 │  │   ├── queries.ts     → getIdentity, getUserIdentities, isSlugAvailable  │
 │  │   ├── mutations.ts   → createIdentity, updateIdentity, deleteIdentity  │
 │  │   └── public.ts      → getPublicIdentityByUsername (no auth)            │
 │  │                                                                          │
 │  ├── links/                                                                 │
 │  │   ├── queries.ts     → getIdentityLinks, getLink                         │
 │  │   ├── mutations.ts   → createLink, updateLink, reorderLinks              │
 │  │   └── public.ts      → trackClick (no auth)                              │
 │  │                                                                          │
 │  ├── themes/            → System + custom themes                            │
 │  ├── analytics/         → Identity views, link clicks (future)            │
 │  ├── http.ts            → Clerk webhook handler                             │
 │  └── crons.ts           → Scheduled analytics aggregation                   │
 │                                                                             │
 ├─────────────────────────────────────────────────────────────────────────────┤
 │                         CONVEX DATABASE                                     │
 │  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │
 │  │  users  │  │  identities │  │  links  │  │ themes  │  │ Future tables   │   │
 │  │         │──│             │──│         │  │         │  │ - identityViews │   │
 │  │         │  │             │──│         │  │         │  │ - linkClicks    │   │
 │  └─────────┘  └─────────────┘  └─────────┘  └─────────┘  │ - collaborators │   │
 │      │             │                │                     │ - auditLogs     │   │
 │      └─────────────┴────────────────┴─────────────────────┴─────────────────┘   │
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
   │    USER     │         │  IDENTITY   │         │    LINK     │
   ├─────────────┤         ├─────────────┤         ├─────────────┤
   │ _id         │◄───┐    │ _id         │◄───┐    │ _id         │
   │ clerkUserId │    │    │ userId ─────┼────┘    │ identityId ─────┼────┐
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
         │            │    │   THEME     │    │    exactly one Identity│
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
   │  │ IDENTITY_VIEWS  │  │ LINK_CLICKS     │  │ COLLABORATORS   │
   │  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
   └─►      │ identityId      │  │ linkId          │  │ identityId      │
      │ viewedAt        │  │ identityId      │  │ userId          │
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
   // IDENTITIES - User's "link in bio" pages
   // ═══════════════════════════════════════════════════════════════
   identities: defineTable({
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
     identityId: v.optional(v.id("identities")),
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
     .index("by_identity", ["identityId", "deletionTime", "orderIndex"])
     .index("by_identity_active", ["identityId", "isActive", "deletionTime"]),

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
   // IDENTITY_COLLABORATORS - Shared identity access (Future)
   // ═══════════════════════════════════════════════════════════════
   identityCollaborators: defineTable({
     identityId: v.id("identities"),
     userId: v.id("users"),
     role: v.union(
       v.literal("owner"),
       v.literal("editor"),
       v.literal("viewer")
     ),
     invitedAt: v.number(),
     acceptedAt: v.optional(v.number()),
   })
     .index("by_identity", ["identityId"])
     .index("by_user", ["userId"]),

   // ═══════════════════════════════════════════════════════════════
   // IDENTITY_VIEWS - Analytics (Future - supplement PostHog)
   // ═══════════════════════════════════════════════════════════════
   identityViews: defineTable({
     identityId: v.id("identities"),
     viewedAt: v.number(),
     visitorId: v.optional(v.string()),
     userAgent: v.optional(v.string()),
     referrer: v.optional(v.string()),
     country: v.optional(v.string()),
     city: v.optional(v.string()),
   })
     .index("by_identity", ["identityId", "viewedAt"]),

   // ═══════════════════════════════════════════════════════════════
   // LINK_CLICKS - Analytics (Future - supplement PostHog)
   // ═══════════════════════════════════════════════════════════════
   linkClicks: defineTable({
     linkId: v.id("links"),
     identityId: v.id("identities"),
     clickedAt: v.number(),
     visitorId: v.optional(v.string()),
     userAgent: v.optional(v.string()),
     referrer: v.optional(v.string()),
     country: v.optional(v.string()),
   })
     .index("by_link", ["linkId", "clickedAt"])
     .index("by_identity", ["identityId", "clickedAt"]),

   // ═══════════════════════════════════════════════════════════════
   // USER_SETTINGS - Preferences
   // ═══════════════════════════════════════════════════════════════
   userSettings: defineTable({
     userId: v.id("users"),
     darkMode: v.boolean(),
     emailNotifications: v.boolean(),
     defaultIdentityId: v.optional(v.id("identities")),
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
     publishedIdentity: v.boolean(),
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
 ├── identities/
 │   ├── queries.ts                 # getIdentity, getUserIdentities, isSlugAvailable
 │   ├── mutations.ts               # createIdentity, updateIdentity, deleteIdentity
 │   └── public.ts                  # getPublicIdentityByUsername, recordIdentityView
 │
 ├── links/
 │   ├── queries.ts                 # getLink, getIdentityLinks
 │   ├── mutations.ts               # createLink, updateLink, deleteLink, reorderLinks
 │   └── public.ts                  # getPublicIdentityLinks, trackLinkClick
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

✅ Completed:
1. ✅ Implement users/ functions
2. ✅ Implement identities/ functions (previously pages/)
3. ✅ Implement links/ functions
4. ✅ Implement themes/ functions
5. ✅ Test all CRUD operations

Phase 3: Component Migration

✅ Completed:
1. ✅ Create React hooks layer (src/hooks/convex/)
2. ✅ Migrate IdentityManager (previously PageManager) to useQuery/useMutation
3. ✅ Migrate PublicIdentityComponent (previously PublicPageComponent)
4. ✅ Migrate IdentityLinksManager (previously PageLinksManager)
5. ✅ Migrate AnalyticsDashboard
6. ✅ Real-time updates working (no optimistic updates needed - Convex handles it)

Phase 4: Cleanup

✅ Completed:
1. ✅ Removed src/data/ folder (no longer exists)
2. ✅ src/dummy.json still exists but not used (can be removed)
3. ✅ Old API routes removed (only health check remains)
4. ✅ No server actions - all data operations use Convex

Phase 5: Documentation

✅ Completed:
1. ✅ Architecture documentation updated (docs/architecture/)
2. ✅ Coding standards updated with Convex patterns
3. ✅ Data flow documentation updated
4. ✅ All Convex functions documented in code

 ---
 Key Files to Modify
 ┌──────────────────────────────────────────┬─────────────────────────────────┐
 │                   File                   │             Change              │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/app/layout.tsx                       │ Add ConvexProviderWithClerk     │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/convex/IdentityManager.tsx │ ✅ Uses Convex hooks           │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/convex/PublicIdentityComponent.tsx │ ✅ Uses Convex public queries │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/convex/IdentityLinksManager.tsx │ ✅ Uses Convex mutations │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ src/components/analytics-dashboard.tsx   │ Connect to Convex analytics     │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ package.json                             │ Add convex dependency           │
 ├──────────────────────────────────────────┼─────────────────────────────────┤
 │ .env.local                               │ Add NEXT_PUBLIC_CONVEX_URL      │
 └──────────────────────────────────────────┴─────────────────────────────────┘
 ---
 Verification Steps

✅ All verification steps completed:

1. ✅ Run npx convex dev - Convex dashboard accessible
2. ✅ Create a test user via Clerk webhook
3. ✅ Create an identity via admin UI - appears in Convex dashboard
4. ✅ Add links to identity - real-time updates work
5. ✅ View public identity page - view count increments live
6. ✅ Click link - click count updates
7. ✅ Check multiple browser tabs - real-time sync works
8. ✅ Run pnpm build - no TypeScript errors

 ---
 Future Features (Already Scaffolded)

 - Collaborators: identityCollaborators table ready
 - Link Scheduling: visibleFrom/visibleUntil fields ready
 - Tags: tags and linkTags tables ready
 - Custom Domains: customDomain field ready
 - Analytics: identityViews and linkClicks tables ready
 - Audit Logs: auditLogs table ready

 ---
 Notes

 - ✅ Architecture documentation updated in docs/architecture/
 - PostHog remains for behavioral analytics (Convex handles operational data)
 - Soft deletes via deletionTime field (same pattern as current)
 - All timestamps use Unix milliseconds (Convex standard)
