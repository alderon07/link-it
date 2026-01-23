# Link-It - Data Flow and Component Interactions

This document provides a detailed overview of how data flows through the Link-It application, which is essential for refactoring, writing, and debugging code.

## Data Flow Overview

The application uses Convex for all data operations with real-time reactivity:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Client UI  │ ◄──► │   Convex    │ ◄──► │   Convex    │
│  (React)    │      │   Hooks     │      │  Backend    │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
      │                    │                    │
      │                    │                    │
      │  useQuery()        │  WebSocket         │  Queries
      │  useMutation()     │  (Real-time)       │  Mutations
      │                    │                    │
      └────────────────────┴────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Convex Cloud  │
            │   Database    │
            └───────────────┘
```

## Convex Architecture

### 1. Schema (`convex/schema.ts`)

Defines all database tables with type-safe schemas:
- `users`: User accounts (synced from Clerk)
- `identities`: User's "link in bio" pages
- `links`: Individual links on identities
- `themes`: Color themes (system + custom)
- `tags`, `linkTags`: Link categorization (future)
- `identityCollaborators`: Shared access (future)
- `identityViews`, `linkClicks`: Analytics data
- `userSettings`, `userProgress`: User preferences
- `auditLogs`: Change tracking (future)

### 2. Queries (`convex/*/queries.ts`)

Read-only functions that return data:
- Automatically reactive - components re-render when data changes
- Can be authenticated or public
- Use indexes for efficient queries

### 3. Mutations (`convex/*/mutations.ts`)

Write operations that modify data:
- Always authenticated (except internal webhook functions)
- Validate inputs with Zod schemas
- Return updated data or success indicators

### 4. Public Functions (`convex/*/public.ts`)

Public queries that don't require authentication:
- Used for public-facing pages
- Still validate inputs and handle errors

## Data Access Patterns

### Pattern 1: Reading Data (Queries)

```
Client Component
  │
  ├── Calls useQuery(api.identities.queries.getUserIdentities)
  │   │
  │   ├── Convex hook establishes WebSocket connection
  │   ├── Sends query request to Convex backend
  │   │
  │   └── Convex Backend
  │       │
  │       ├── Verifies authentication (if required)
  │       ├── Executes query function
  │       ├── Queries database using indexes
  │       │
  │       └── Returns data via WebSocket
  │           │
  │           └── Component automatically re-renders with new data
  │
  └── Real-time updates: Component re-renders when data changes
```

**Example: Fetching User Identities**

```typescript
// Client Component
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function IdentityList() {
  const identities = useQuery(api.identities.queries.getUserIdentities)
  
  // identities is undefined while loading
  if (identities === undefined) {
    return <LoadingSkeleton />
  }
  
  // identities is the data array
  return (
    <div>
      {identities.map(identity => (
        <IdentityCard key={identity._id} identity={identity} />
      ))}
    </div>
  )
}

// Convex Query (convex/identities/queries.ts)
export const getUserIdentities = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first()

    if (!user) {
      return []
    }

    return await ctx.db
      .query("identities")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect()
  },
})
```

### Pattern 2: Writing Data (Mutations)

```
Client Component
  │
  ├── Calls useMutation(api.identities.mutations.createIdentity)
  │   │
  │   ├── User submits form/triggers action
  │   │
  │   └── Convex Backend
  │       │
  │       ├── Verifies authentication
  │       ├── Validates input with Zod schema
  │       ├── Executes business logic
  │       ├── Modifies database
  │       │
  │       └── Returns result
  │           │
  │           └── All active queries automatically re-run
  │               │
  │               └── Components re-render with updated data
```

**Example: Creating an Identity**

```typescript
// Client Component
"use client"

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

export function CreateIdentityForm() {
  const createIdentity = useMutation(api.identities.mutations.createIdentity)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await createIdentity({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
      })
      toast.success("Identity created!")
      e.currentTarget.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create")
    }
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}

// Convex Mutation (convex/identities/mutations.ts)
export const createIdentity = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    // Validate
    const validated = CreateIdentitySchema.safeParse(args)
    if (!validated.success) {
      throw new ConvexError("Validation failed")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first()

    if (!user) {
      throw new ConvexError("User not found")
    }

    // Check slug availability
    const existing = await ctx.db
      .query("identities")
      .withIndex("by_slug", (q) => q.eq("slug", validated.data.slug))
      .first()

    if (existing) {
      throw new ConvexError("Slug already taken")
    }

    // Create identity
    const identityId = await ctx.db.insert("identities", {
      userId: user._id,
      name: validated.data.name,
      slug: validated.data.slug,
      isPublic: false,
      viewCount: 0,
      updatedAt: Date.now(),
    })

    return identityId
  },
})
```

### Pattern 3: Public Queries (No Authentication)

```
Public Page Component
  │
  ├── Calls useQuery(api.identities.public.getPublicIdentityByUsername)
  │   │
  │   └── Convex Backend
  │       │
  │       ├── No authentication required
  │       ├── Executes query function
  │       ├── Queries database
  │       │
  │       └── Returns public data
  │           │
  │           └── Component renders public identity page
```

**Example: Public Identity Page**

```typescript
// Client Component (src/app/[username]/page.tsx)
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function PublicPage({ username }: { username: string }) {
  const identity = useQuery(api.identities.public.getPublicIdentityByUsername, { username })
  const links = useQuery(
    api.links.public.getPublicIdentityLinks,
    identity?._id ? { identityId: identity._id } : "skip"
  )
  const recordView = useMutation(api.identities.public.recordIdentityView)

  if (identity === undefined) {
    return <LoadingSkeleton />
  }

  if (identity === null) {
    return <NotFound />
  }

  // Record view on mount
  useEffect(() => {
    recordView({ identityId: identity._id })
  }, [identity._id, recordView])

  return <PublicIdentityPage identity={identity} links={links ?? []} />
}

// Convex Public Query (convex/identities/public.ts)
export const getPublicIdentityByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()

    if (!user || user.deletionTime) {
      return null
    }

    const identity = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => 
        q.and(
          q.eq(q.field("isPublic"), true),
          q.eq(q.field("deletionTime"), undefined)
        )
      )
      .first()

    return identity
  },
})
```

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)
├── ClerkProvider
├── ConvexClientProvider (passes Clerk JWT to Convex)
├── PostHogProvider
├── SidebarProvider
└── Page Components
    ├── Landing Page (src/app/page.tsx)
    │   └── Home Component
    ├── Public Profile (src/app/[username]/page.tsx)
    │   └── PublicIdentityPage
    │       ├── useQuery(api.identities.public.getPublicIdentityByUsername)
    │       ├── useQuery(api.links.public.getPublicIdentityLinks)
    │       └── useMutation(api.identities.public.recordIdentityView)
    └── Admin Routes (src/app/(routes)/admin/*)
        ├── AdminLayout (with Sidebar)
        ├── Admin Dashboard
        │   ├── useQuery(api.identities.queries.getUserIdentities)
        │   └── useQuery(api.analytics.queries.getDashboardStats)
        ├── Identity Manager
        │   ├── useQuery(api.identities.queries.getUserIdentities)
        │   ├── useMutation(api.identities.mutations.createIdentity)
        │   ├── useMutation(api.identities.mutations.updateIdentity)
        │   └── useMutation(api.identities.mutations.deleteIdentity)
        ├── Links Manager
        │   ├── useQuery(api.links.queries.getIdentityLinks)
        │   ├── useMutation(api.links.mutations.createLink)
        │   ├── useMutation(api.links.mutations.updateLink)
        │   ├── useMutation(api.links.mutations.deleteLink)
        │   └── useMutation(api.links.mutations.reorderLinks)
        ├── Theme Manager
        │   ├── useQuery(api.themes.queries.getAllThemes)
        │   └── useMutation(api.identities.mutations.updateIdentity)
        └── Analytics Dashboard
            ├── useQuery(api.analytics.queries.getGlobalAnalytics)
            └── useQuery(api.analytics.queries.getIdentityAnalytics)
```

## Data Flow Patterns

### 1. Public Identity Page Flow

```
User visits /[username]
  │
  ├── Component calls useQuery(api.identities.public.getPublicIdentityByUsername)
  │   │
  │   └── Convex Query
  │       │
  │       ├── Finds user by username
  │       ├── Finds first public identity
  │       │
  │       └── Returns identity data
  │           │
  │           └── Component renders identity
  │               │
  │               ├── Component calls useQuery(api.links.public.getPublicIdentityLinks)
  │               │   │
  │               │   └── Convex Query
  │               │       │
  │               │       ├── Finds active links for identity
  │               │       │
  │               │       └── Returns links array
  │               │           │
  │               │           └── Component renders links
  │               │
  │               └── Component calls useMutation(api.identities.public.recordIdentityView)
  │                   │
  │                   └── Convex Mutation
  │                       │
  │                       ├── Increments viewCount
  │                       │
  │                       └── All queries re-run automatically
  │                           │
  │                           └── View count updates in real-time
```

### 2. Admin Dashboard Flow

```
Authenticated user visits /admin
  │
  ├── Middleware verifies authentication
  │
  ├── Component calls useQuery(api.identities.queries.getUserIdentities)
  │   │
  │   └── Convex Query
  │       │
  │       ├── Verifies authentication
  │       ├── Finds user by Clerk ID
  │       ├── Queries identities for user
  │       │
  │       └── Returns identities array
  │           │
  │           └── Component renders identity list
  │
  ├── Component calls useQuery(api.analytics.queries.getDashboardStats)
  │   │
  │   └── Convex Query
  │       │
  │       ├── Aggregates stats from identities and links
  │       │
  │       └── Returns dashboard stats
  │           │
  │           └── Component renders stats cards
  │
  └── Real-time updates: When identities/links change, components automatically re-render
```

### 3. Creating an Identity Flow

```
User clicks "Create Identity" button
  │
  ├── Form submission triggers handleSubmit
  │
  ├── Component calls useMutation(api.identities.mutations.createIdentity)
  │   │
  │   └── Convex Mutation
  │       │
  │       ├── Verifies authentication
  │       ├── Validates input (name, slug)
  │       ├── Checks slug availability
  │       ├── Creates identity in database
  │       │
  │       └── Returns new identity ID
  │           │
  │           └── All active queries automatically re-run
  │               │
  │               ├── getUserIdentities query re-runs
  │               │   │
  │               │   └── Component re-renders with new identity
  │               │
  │               └── getDashboardStats query re-runs
  │                   │
  │                   └── Stats update automatically
```

## Authentication Flow

### Clerk Integration

```
User Request
  │
  ├── Middleware (src/middleware.ts)
  │   │
  │   ├── Checks if route is public (/ or /login)
  │   │
  │   └── If protected: auth.protect()
  │       │
  │       └── Clerk verifies JWT
  │
  ├── ConvexClientProvider (src/app/layout.tsx)
  │   │
  │   └── Passes Clerk JWT to Convex
  │       │
  │       └── Convex verifies JWT automatically
  │
  └── Convex Functions
      │
      └── ctx.auth.getUserIdentity()
          │
          └── Returns authenticated user or null
```

### Webhook Flow (User Sync)

```
Clerk User Event (user.created, user.updated, user.deleted)
  │
  ├── Webhook: convex/http.ts → /clerk-webhook
  │   │
  │   ├── Verifies Svix signature
  │   │
  │   └── Handles event
  │       │
  │       ├── user.created → calls users.internal.createUserFromClerk
  │       ├── user.updated → calls users.mutations.updateUser
  │       └── user.deleted → calls users.mutations.deleteUser
  │           │
  │           └── Updates Convex database
  │               │
  │               └── All queries automatically update
```

## Validation Flow

### Input Validation

```
User Input
  │
  └── Convex Mutation
      │
      ├── Zod schema validation
      │   │
      │   ├── safeParse() - Returns success/error
      │   │
      │   └── If invalid: Throw ConvexError
      │
      ├── Business logic validation
      │   │
      │   ├── Check slug availability
      │   ├── Verify ownership
      │   │
      │   └── If invalid: Throw ConvexError
      │
      └── If valid: Proceed with mutation
```

## Error Handling

### Convex Errors

```typescript
// In Convex function
if (!user) {
  throw new ConvexError({
    code: "NOT_FOUND",
    message: "User not found",
  })
}

// In component
try {
  const data = useQuery(api.identities.queries.getIdentity, { identityId })
} catch (error) {
  // Handle error (use error boundary or try-catch)
  if (error instanceof ConvexError) {
    console.error(error.message)
  }
}
```

### Component Error Handling

```typescript
"use client"

import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"

export function CreateIdentityForm() {
  const createIdentity = useMutation(api.identities.mutations.createIdentity)

  const handleSubmit = async (data: FormData) => {
    try {
      await createIdentity({
        name: data.get("name") as string,
        slug: data.get("slug") as string,
      })
      toast.success("Identity created!")
    } catch (error) {
      if (error instanceof ConvexError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to create identity")
      }
    }
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

## Real-Time Updates

### Automatic Reactivity

```
User A creates an identity
  │
  ├── Mutation executes in Convex
  │
  ├── Database is updated
  │
  └── All active queries automatically re-run
      │
      ├── User A's browser: Components re-render with new identity
      │
      └── User B's browser (if viewing same data): Components re-render
          │
          └── Real-time sync across all clients
```

### Query Dependencies

```
Component uses multiple queries
  │
  ├── useQuery(api.identities.queries.getIdentity, { identityId })
  │
  └── useQuery(api.links.queries.getIdentityLinks, { identityId })
      │
      └── Both queries automatically update when identity or links change
```

## Performance Considerations

1. **Automatic Caching**: Convex queries are cached and only re-run when dependencies change
2. **Efficient Updates**: Only changed data is sent over WebSocket
3. **Index Usage**: Queries use indexes for fast database lookups
4. **Real-Time Efficiency**: WebSocket connections are efficient and persistent
5. **Loading States**: Queries return `undefined` while loading (no separate loading state needed)

## Development and Debugging Guidelines

1. **Tracing Data Flow**:
   - Start from component → Convex hook → Convex function → Database
   - Check authentication at Convex function level
   - Verify validation in mutation handlers

2. **Error Debugging**:
   - Check Convex function errors (ownership, validation)
   - Check authentication errors (Clerk JWT)
   - Use Convex dashboard to view function logs

3. **Testing Data Operations**:
   - Use Convex dashboard to test queries/mutations
   - Check real-time updates in multiple browser tabs
   - Verify indexes are being used efficiently

For adding new features, see [Common Tasks](./index.md#common-tasks).
