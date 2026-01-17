# Convex Integration Plan

## Status: ✅ COMPLETED

All frontend components have been connected to Convex. The integration is complete and all data operations use Convex for real-time reactivity.

---

## Overview
This document describes the completed integration of all frontend components with Convex for real data, replacing mock data throughout the app.

**Completed:**
- ✅ All components migrated to use Convex hooks
- ✅ Custom hooks created for all data operations
- ✅ Real-time updates working across all components
- ✅ Analytics dashboard connected to Convex
- ✅ Public pages using Convex public queries

---

## Phase 1: Seed Database with Test Data

### 1.1 Create Seed Script
Create `/convex/seed.ts` with internal mutation to populate:

**System Themes (5 themes)**
```
- Midnight Dark: #0f0f1a, #f5f5f5, #a855f7
- Ocean Blue: #1e3a5f, #ffffff, #3b82f6
- Forest Green: #1a2e1a, #f0fff0, #22c55e
- Sunset Coral: #2d1f1f, #fff5f5, #f87171
- Neon Cyber: #0a0e1a, #00ff00, #ff00ff
```

**Test User (created via Clerk webhook)**
- Will use current logged-in user

**Test Identities (3 identities per user)**
```
Identity 1: "Personal" (slug: {username}-personal)
  - 8 links (social media, portfolio, etc.)
  - 150 views, public

Identity 2: "Business" (slug: {username}-business)
  - 5 links (company, services, contact)
  - 89 views, public

Identity 3: "Private" (slug: {username}-private)
  - 3 links
  - 0 views, private
```

**Test Links per Identity**
```
Links include:
- Social: Twitter, Instagram, LinkedIn, GitHub
- Content: YouTube, Blog, Portfolio
- Business: Website, Contact, Store
- Headers and dividers for organization
- Varying click counts: 10-300
```

**Test Analytics Data**
```
identityViews: 50-200 per identity (last 30 days)
linkClicks: 5-50 per link (last 30 days)
```

---

## Phase 2: Missing Convex Functions

### 2.1 Analytics Queries (`/convex/analytics/queries.ts`)

```typescript
// Get dashboard stats for current user
getDashboardStats(): {
  totalIdentities: number
  totalLinks: number
  totalViews: number
  totalClicks: number
  viewsThisMonth: number
  clicksThisMonth: number
  topIdentities: Identity[]
  recentActivity: Activity[]
}

// Get analytics for a specific identity
getIdentityAnalytics(identityId): {
  viewsOverTime: { date: string, count: number }[]
  clicksByLink: { linkId: Id, title: string, clicks: number }[]
  referrerBreakdown: { referrer: string, count: number }[]
  deviceBreakdown: { device: string, count: number }[]
}

// Get global analytics across all identities
getGlobalAnalytics(): {
  viewsOverTime: { date: string, count: number }[]
  topLinks: { link: Link, identity: Identity, clicks: number }[]
  trafficSources: { source: string, count: number }[]
}
```

### 2.2 Settings Mutations (`/convex/settings/mutations.ts`)

```typescript
// Update user settings
updateSettings(args: {
  darkMode?: boolean
  emailNotifications?: boolean
  defaultIdentityId?: Id<"identities">
})

// Update user progress
updateProgress(args: {
  completedIntro?: boolean
  addedFirstLink?: boolean
  publishedIdentity?: boolean
})
```

### 2.3 Aggregate Queries (`/convex/identities/queries.ts`)

```typescript
// Get all links across all user identities (for All Links page)
getAllUserLinks(): {
  links: (Link & { identityName: string, identitySlug: string })[]
  stats: { total: number, active: number, totalClicks: number }
}
```

---

## Phase 3: Frontend Component Integration

### 3.1 Dashboard (`/src/components/admin-dashboard.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getUserIdentities()` - Get user's identities
- `getDashboardStats()` - Get aggregated stats
- Calculate: totalIdentities, totalLinks, totalViews, avgEngagement

**Implementation:**
```tsx
// Using custom hooks
const identities = useUserIdentities()
const stats = useDashboardStats()
```

### 3.2 Analytics Dashboard (`/src/components/analytics-dashboard.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getGlobalAnalytics()` - Views over time, traffic sources
- `getIdentityAnalytics(identityId)` - Per-identity breakdown
- `identityViews` and `linkClicks` tables

**Implementation:**
```tsx
// Using custom hooks
const analytics = useGlobalAnalytics()
const identityAnalytics = useIdentityAnalytics(identityId)
```

### 3.3 Identities Manager (`/src/components/convex/IdentityManager.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getUserIdentities()` - List identities
- `createIdentity()` - Create new identity
- `updateIdentity()` - Edit identity
- `deleteIdentity()` - Delete identity

**Implementation:**
```tsx
// Using custom hooks
const identities = useUserIdentities()
const { createIdentity, updateIdentity, deleteIdentity } = useIdentityMutations()
```

### 3.4 Global Links Manager (`/src/components/global-links-manager.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getAllUserLinks()` - Get links across all identities
- `createLink()` - Add link
- `updateLink()` - Edit link
- `deleteLink()` - Remove link

**Implementation:**
```tsx
// Using custom hook
const { links, stats } = useAllUserLinks()
```

### 3.5 Identity Links Manager (`/src/components/convex/IdentityLinksManager.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getIdentityLinks(identityId)` - Get identity's links
- `createLink()` - Add link
- `updateLink()` - Edit link
- `deleteLink()` - Remove link
- `reorderLinks()` - Drag and drop

**Implementation:**
```tsx
// Using custom hooks
const links = useIdentityLinks(identityId)
const { createLink, updateLink, deleteLink, reorderLinks } = useLinkMutations()
```

### 3.6 Theme Gallery (`/src/components/convex/IdentityThemeGallery.tsx`)

**Status:** ✅ Completed

**Connected to:**
- `getAllThemes()` - System + custom themes
- `updateIdentity({ themeId })` - Apply theme

**Implementation:**
```tsx
// Using custom hooks
const themes = useAllThemes()
const { updateIdentity } = useIdentityMutations()
```

---

## Phase 4: Implementation Order

### Step 1: Create Seed Script
1. Create `/convex/seed.ts`
2. Add `seedDatabase` internal mutation
3. Add `seedThemes` function for system themes
4. Run seed to populate database

### Step 2: Add Missing Analytics Functions
✅ Completed:
1. ✅ Create `/convex/analytics/queries.ts`
2. ✅ Implement `getDashboardStats`
3. ✅ Implement `getIdentityAnalytics`
4. ✅ Implement `getGlobalAnalytics`

### Step 3: Add Aggregate Query
✅ Completed:
1. ✅ Add `getAllUserLinks` to identities queries
2. ✅ Test with existing hooks

### Step 4: Connect Dashboard
✅ Completed:
1. ✅ Update `AdminDashboard` to use Convex
2. ✅ Add loading states
3. ✅ Test real-time updates

### Step 5: Connect Identity Manager
✅ Completed:
1. ✅ Update `IdentityManager` to use Convex
2. ✅ Wire up CRUD operations
3. ✅ Real-time updates working

### Step 6: Connect Links Manager
✅ Completed:
1. ✅ Update `GlobalLinksManager`
2. ✅ Update `IdentityLinksManager`
3. ✅ Wire up reorder functionality

### Step 7: Connect Analytics
✅ Completed:
1. ✅ Update `AnalyticsDashboard`
2. ✅ Add date range filtering
3. ✅ Add real charts

### Step 8: Connect Themes
✅ Completed:
1. ✅ Update `IdentityThemeGallery`
2. ✅ Wire up theme application

---

## Phase 5: Files to Create/Modify

### New Files
```
/convex/seed.ts                    - Database seeding
/convex/analytics/queries.ts       - Analytics queries
/convex/settings/mutations.ts      - Settings updates
```

### Modified Files
✅ All completed:
```
/src/components/admin-dashboard.tsx
/src/components/analytics-dashboard.tsx
/src/components/convex/IdentityManager.tsx
/src/components/global-links-manager.tsx
/src/components/convex/IdentityLinksManager.tsx
/src/components/convex/IdentityThemeGallery.tsx
/src/components/convex/IdentityThemeEditor.tsx
```

### Files to Eventually Remove
```
/src/lib/mock-pages.ts            - After full migration
```

---

## Verification Checklist

✅ All items completed:

- [x] Seed script creates system themes (`convex/seed.ts`)
- [x] Seed script creates test identities for current user
- [x] Seed script creates test links
- [x] Seed script creates analytics data
- [x] Dashboard shows real stats (`useDashboardStats`)
- [x] Identity manager CRUD works (`IdentityManager`)
- [x] Links manager CRUD works (`IdentityLinksManager`)
- [x] Analytics charts show real data (`AnalyticsDashboard`)
- [x] Theme gallery loads from Convex (`IdentityThemeGallery`)
- [x] Real-time updates work across tabs
- [x] No TypeScript errors
- [x] Build passes
