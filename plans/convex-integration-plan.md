# Convex Integration Plan

## Overview
Connect all frontend components to Convex for real data, replacing mock data throughout the app.

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

**Test Pages (3 identities per user)**
```
Page 1: "Personal" (slug: {username}-personal)
  - 8 links (social media, portfolio, etc.)
  - 150 views, public

Page 2: "Business" (slug: {username}-business)
  - 5 links (company, services, contact)
  - 89 views, public

Page 3: "Private" (slug: {username}-private)
  - 3 links
  - 0 views, private
```

**Test Links per Page**
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
pageViews: 50-200 per page (last 30 days)
linkClicks: 5-50 per link (last 30 days)
```

---

## Phase 2: Missing Convex Functions

### 2.1 Analytics Queries (`/convex/analytics/queries.ts`)

```typescript
// Get dashboard stats for current user
getDashboardStats(): {
  totalPages: number
  totalLinks: number
  totalViews: number
  totalClicks: number
  viewsThisMonth: number
  clicksThisMonth: number
  topPages: Page[]
  recentActivity: Activity[]
}

// Get analytics for a specific page
getPageAnalytics(pageId): {
  viewsOverTime: { date: string, count: number }[]
  clicksByLink: { linkId: Id, title: string, clicks: number }[]
  referrerBreakdown: { referrer: string, count: number }[]
  deviceBreakdown: { device: string, count: number }[]
}

// Get global analytics across all pages
getGlobalAnalytics(): {
  viewsOverTime: { date: string, count: number }[]
  topLinks: { link: Link, page: Page, clicks: number }[]
  trafficSources: { source: string, count: number }[]
}
```

### 2.2 Settings Mutations (`/convex/settings/mutations.ts`)

```typescript
// Update user settings
updateSettings(args: {
  darkMode?: boolean
  emailNotifications?: boolean
  defaultPageId?: Id<"pages">
})

// Update user progress
updateProgress(args: {
  completedIntro?: boolean
  addedFirstLink?: boolean
  publishedPage?: boolean
})
```

### 2.3 Aggregate Queries (`/convex/pages/queries.ts`)

```typescript
// Get all links across all user pages (for All Links page)
getAllUserLinks(): {
  links: (Link & { pageName: string, pageSlug: string })[]
  stats: { total: number, active: number, totalClicks: number }
}
```

---

## Phase 3: Frontend Component Integration

### 3.1 Dashboard (`/src/components/admin-dashboard.tsx`)

**Current State:** Uses `mockPages` with hardcoded stats

**Connect to:**
- `getUserPages()` - Get user's pages
- `getDashboardStats()` - Get aggregated stats
- Calculate: totalPages, totalLinks, totalViews, avgEngagement

**Changes:**
```tsx
// Before
const stats = mockPages.reduce(...)

// After
const pages = useQuery(api.pages.queries.getUserPages)
const stats = useQuery(api.analytics.queries.getDashboardStats)
```

### 3.2 Analytics Dashboard (`/src/components/analytics-dashboard.tsx`)

**Current State:** Hardcoded mock metrics

**Connect to:**
- `getGlobalAnalytics()` - Views over time, traffic sources
- `getPageAnalytics(pageId)` - Per-page breakdown
- `pageViews` and `linkClicks` tables

**Changes:**
```tsx
// Get real analytics data
const analytics = useQuery(api.analytics.queries.getGlobalAnalytics)
const pageAnalytics = useQuery(api.analytics.queries.getPageAnalytics, { pageId })
```

### 3.3 Identities/Pages Manager (`/src/components/page-manager.tsx`)

**Current State:** Uses local state with mockPages

**Connect to:**
- `getUserPages()` - List pages
- `createPage()` - Create new page
- `updatePage()` - Edit page
- `deletePage()` - Delete page

**Changes:**
```tsx
// Before
const [pages, setPages] = useState(mockPages)

// After
const pages = useQuery(api.pages.queries.getUserPages)
const createPage = useMutation(api.pages.mutations.createPage)
const updatePage = useMutation(api.pages.mutations.updatePage)
const deletePage = useMutation(api.pages.mutations.deletePage)
```

### 3.4 Global Links Manager (`/src/components/global-links-manager.tsx`)

**Current State:** Inline mock links array

**Connect to:**
- `getAllUserLinks()` - Get links across all pages
- `createLink()` - Add link
- `updateLink()` - Edit link
- `deleteLink()` - Remove link

**Changes:**
```tsx
// Before
const mockLinks = [...]

// After
const { links, stats } = useQuery(api.pages.queries.getAllUserLinks)
```

### 3.5 Page Links Manager (`/src/components/page-links-manager.tsx`)

**Current State:** Mock links for specific page

**Connect to:**
- `getPageLinks(pageId)` - Get page's links
- `createLink()` - Add link
- `updateLink()` - Edit link
- `deleteLink()` - Remove link
- `reorderLinks()` - Drag and drop

**Changes:**
```tsx
const links = useQuery(api.links.queries.getPageLinks, { pageId })
const createLink = useMutation(api.links.mutations.createLink)
const reorderLinks = useMutation(api.links.mutations.reorderLinks)
```

### 3.6 Theme Gallery (`/src/components/page-theme-gallery.tsx`)

**Current State:** Mock themes

**Connect to:**
- `getAllAvailableThemes()` - System + custom themes
- `updatePage({ themeId })` - Apply theme

---

## Phase 4: Implementation Order

### Step 1: Create Seed Script
1. Create `/convex/seed.ts`
2. Add `seedDatabase` internal mutation
3. Add `seedThemes` function for system themes
4. Run seed to populate database

### Step 2: Add Missing Analytics Functions
1. Create `/convex/analytics/queries.ts`
2. Implement `getDashboardStats`
3. Implement `getPageAnalytics`
4. Implement `getGlobalAnalytics`

### Step 3: Add Aggregate Query
1. Add `getAllUserLinks` to pages queries
2. Test with existing hooks

### Step 4: Connect Dashboard
1. Update `AdminDashboard` to use Convex
2. Add loading states
3. Test real-time updates

### Step 5: Connect Page Manager
1. Update `PageManager` to use Convex
2. Wire up CRUD operations
3. Add optimistic updates

### Step 6: Connect Links Manager
1. Update `GlobalLinksManager`
2. Update `PageLinksManager`
3. Wire up reorder functionality

### Step 7: Connect Analytics
1. Update `AnalyticsDashboard`
2. Add date range filtering
3. Add real charts

### Step 8: Connect Themes
1. Update `PageThemeGallery`
2. Wire up theme application

---

## Phase 5: Files to Create/Modify

### New Files
```
/convex/seed.ts                    - Database seeding
/convex/analytics/queries.ts       - Analytics queries
/convex/settings/mutations.ts      - Settings updates
```

### Modified Files
```
/src/components/admin-dashboard.tsx
/src/components/analytics-dashboard.tsx
/src/components/page-manager.tsx
/src/components/global-links-manager.tsx
/src/components/page-links-manager.tsx
/src/components/page-theme-gallery.tsx
/src/components/page-theme-editor.tsx
```

### Files to Eventually Remove
```
/src/lib/mock-pages.ts            - After full migration
```

---

## Verification Checklist

- [ ] Seed script creates system themes
- [ ] Seed script creates test pages for current user
- [ ] Seed script creates test links
- [ ] Seed script creates analytics data
- [ ] Dashboard shows real stats
- [ ] Page manager CRUD works
- [ ] Links manager CRUD works
- [ ] Analytics charts show real data
- [ ] Theme gallery loads from Convex
- [ ] Real-time updates work across tabs
- [ ] No TypeScript errors
- [ ] Build passes
