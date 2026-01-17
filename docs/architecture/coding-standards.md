# Link-It - Coding Standards and Best Practices

This document outlines the coding standards, conventions, and best practices used in the Link-It codebase. Following these guidelines ensures consistency and maintainability when refactoring, writing, and debugging code.

## TypeScript Guidelines

### Type Definitions

- Types are automatically generated from Convex schema (`convex/schema.ts`)
- Use `Id<"tableName">` for Convex document IDs
- Import types from `convex/_generated/api` for function types
- Prefer explicit typing over implicit (`any` is discouraged)

```typescript
// Good: Use Convex-generated types
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

type IdentityId = Id<"identities">
const identityId: IdentityId = args.identityId

// Good: Type inference from queries
const identity = useQuery(api.identities.queries.getIdentity, { identityId })
// identity is automatically typed based on the query return type
```

### Type Safety

- Leverage TypeScript's type system to prevent runtime errors
- Use discriminated unions for state management
- Convex automatically provides type safety for queries and mutations

```typescript
// Example of a discriminated union for component states
type ComponentState<T> = 
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

// Convex mutation result (automatic)
const result = await createIdentity({ name: "My Identity", slug: "my-identity" })
// result is automatically typed based on mutation return type
```

## React Component Guidelines

### Component Structure

- Use functional components with hooks
- Use client components (`"use client"`) for Convex-powered components
- Split large components into smaller, focused ones
- Co-locate related components in the same directory

```typescript
// Example client component with Convex
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function IdentityList() {
  const identities = useQuery(api.identities.queries.getUserIdentities)
  const createIdentity = useMutation(api.identities.mutations.createIdentity)

  if (identities === undefined) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {identities.map(identity => (
        <IdentityCard key={identity._id} identity={identity} />
      ))}
    </div>
  )
}
```

### Props

- Use destructuring for props
- Provide default values when appropriate
- Document complex props with JSDoc comments
- Use TypeScript for type safety

```typescript
interface IdentityCardProps {
  /** The identity to display */
  identity: Doc<"identities">
  /** Handler for click events */
  onClick?: () => void
}

export function IdentityCard({ 
  identity,
  onClick 
}: IdentityCardProps) {
  // Component implementation
}
```

### State Management

- Use appropriate hooks for state management:
  - `useState` for simple component state (form inputs, UI toggles)
  - `useQuery` for reactive data from Convex (automatic updates)
  - `useMutation` for data modifications
  - Custom hooks in `src/hooks/convex/` for complex data operations
- Keep state as local as possible
- Lift state up when needed by multiple components
- Convex queries automatically handle loading and error states

## Next.js Patterns

### Page Organization

- Use the App Router patterns for routing
- Use route groups `(routes)` for organization
- Keep route-specific components in the same directory as the page
- Implement error boundaries using `error.tsx` files
- Use `not-found.tsx` for 404 pages
- Use `loading.tsx` for loading states

### Data Fetching

- Use client components with Convex hooks for data fetching
- `useQuery` automatically handles loading states (returns `undefined` while loading)
- `useQuery` automatically handles error states (throws errors that can be caught)
- Use Suspense boundaries for better loading UX
- No need for `revalidatePath()` - Convex queries are automatically reactive

```typescript
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Suspense } from "react"

export function IdentitiesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <IdentityList />
    </Suspense>
  )
}

function IdentityList() {
  const identities = useQuery(api.identities.queries.getUserIdentities)
  // identities is undefined while loading, then the data, or throws on error
  return <div>{/* render identities */}</div>
}
```

## Convex Patterns

### Queries

- Queries are read-only functions that return data
- Automatically reactive - components re-render when data changes
- Can be public (no auth) or authenticated
- Use `ctx.auth.getUserIdentity()` for authentication

```typescript
// convex/identities/queries.ts
import { query } from "../_generated/server"
import { v } from "convex/values"

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

### Mutations

- Mutations modify data
- Always authenticated (except internal webhook functions)
- Use `ctx.auth.getUserIdentity()` for authentication
- Validate inputs with Zod schemas
- Return updated data or success indicators

```typescript
// convex/identities/mutations.ts
import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { z } from "zod"

const CreateIdentitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
})

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

    // Validate with Zod
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

### Public Functions

- Public functions don't require authentication
- Used for public-facing pages
- Still validate inputs and handle errors

```typescript
// convex/identities/public.ts
import { query } from "../_generated/server"
import { v } from "convex/values"

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

    // Return first public identity (or implement logic to select specific one)
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

### Using Convex in Components

- Import `useQuery` and `useMutation` from `convex/react`
- Import `api` from `@/convex/_generated/api`
- Handle loading states (query returns `undefined` while loading)
- Handle error states (queries throw errors)
- Use custom hooks from `src/hooks/convex/` for complex operations

```typescript
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUserIdentities, useIdentityMutations } from "@/hooks/convex"

export function IdentityManager() {
  // Using custom hook (recommended)
  const identities = useUserIdentities()
  const { createIdentity, updateIdentity, deleteIdentity } = useIdentityMutations()

  // Or using Convex hooks directly
  const identities2 = useQuery(api.identities.queries.getUserIdentities)
  const createIdentity2 = useMutation(api.identities.mutations.createIdentity)

  // Loading state
  if (identities === undefined) {
    return <LoadingSkeleton />
  }

  // Error handling (if query throws)
  // Use error boundaries or try-catch

  return (
    <div>
      {identities.map(identity => (
        <IdentityCard key={identity._id} identity={identity} />
      ))}
    </div>
  )
}
```

## CSS and Styling Guidelines

### Tailwind CSS v4 Usage

- Follow utility-first approach with Tailwind
- Use consistent spacing and sizing scales
- Extract common patterns to components
- Use CSS variables for theme colors

```tsx
// Example of good Tailwind usage
<div className="flex flex-col gap-4 p-4 pixel-shadow pixel-border bg-card">
  <h2 className="text-xl font-bold text-foreground">Section Title</h2>
  <p className="text-muted-foreground">Content goes here</p>
</div>
```

### Pixel Art Aesthetic

- Use pixel art variants for shadcn/ui components:
  - `variant="pixel"` for buttons
  - `variant="pixel"` for cards
  - `variant="retro"` for badges
- Use pixel art utilities from `globals.css`:
  - `.pixel-shadow` - Neobrutalism shadow with hover animation
  - `.pixel-border` - 2px solid border
  - `.pixel-glow` - Glow animation
  - `.pixel-bounce` - Bounce animation
  - `.pixel-shake` - Shake animation
  - `.scanlines` - CRT scanline effect

```tsx
// Pixel art button
<Button variant="pixel" size="lg">
  Click Me
</Button>

// Pixel art card
<Card variant="pixel-glow">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Responsive Design

- Design for mobile-first, then enhance for larger screens
- Use Tailwind's responsive prefixes consistently (sm, md, lg, etc.)
- Test all components across various viewport sizes

## Authentication with Clerk

### Middleware

- Use `clerkMiddleware` in `src/middleware.ts`
- Define public routes with `createRouteMatcher`
- Protect all other routes automatically

```typescript
const isPublicRoute = createRouteMatcher(['/login(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

### Convex Authentication

- Convex automatically receives Clerk JWT via `ConvexClientProvider`
- Use `ctx.auth.getUserIdentity()` in Convex functions
- Returns `null` if not authenticated
- JWT is verified automatically by Convex

```typescript
// In Convex query/mutation
const identity = await ctx.auth.getUserIdentity()
if (!identity) {
  throw new ConvexError("Not authenticated")
}

// identity.subject is the Clerk user ID
const user = await ctx.db
  .query("users")
  .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
  .first()
```

### Webhook Integration

- Clerk webhook handler in `convex/http.ts`
- Syncs user data when users are created/updated/deleted
- Uses internal mutations (only callable from HTTP routes)

```typescript
// convex/http.ts
import { httpRouter } from "convex/server"
import { httpAction } from "../_generated/server"
import { Webhook } from "svix"

const http = httpRouter()

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify webhook signature
    // Handle user.created, user.updated, user.deleted events
    // Call internal mutations to sync user data
  }),
})
```

## Data Validation

### Convex Validators

- Validate all inputs in Convex functions
- Use Zod schemas for validation
- Validate at function boundaries (queries and mutations)
- Use `sanitizeText()` for XSS prevention in text fields

```typescript
// convex/lib/validators.ts
import { z } from "zod"

export const CreateIdentitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  bio: z.string().max(500).optional(),
})

// In mutation
const validated = CreateIdentitySchema.safeParse(args)
if (!validated.success) {
  throw new ConvexError("Validation failed")
}
```

### Custom Hooks

- Create custom hooks in `src/hooks/convex/` for complex operations
- Wrap Convex queries/mutations with additional logic
- Provide loading and error states
- Export from `src/hooks/convex/index.ts`

```typescript
// src/hooks/convex/useIdentities.ts
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useUserIdentities() {
  return useQuery(api.identities.queries.getUserIdentities)
}

export function useIdentityMutations() {
  const createIdentity = useMutation(api.identities.mutations.createIdentity)
  const updateIdentity = useMutation(api.identities.mutations.updateIdentity)
  const deleteIdentity = useMutation(api.identities.mutations.deleteIdentity)

  return {
    createIdentity,
    updateIdentity,
    deleteIdentity,
  }
}
```

## Analytics with PostHog

### Client-Side Tracking

- Use `PostHogProvider` in root layout for automatic initialization
- Track events with `trackEvent()` from `@/lib/analytics`
- Identify users with `identifyUser()` on login
- Use type-safe event names from `@/lib/analytics/events`

```typescript
import { trackEvent } from "@/lib/analytics"

trackEvent("identity_created", {
  identity_id: identity._id,
  identity_slug: identity.slug,
})
```

### Server-Side Tracking

- Use `posthog-server.ts` for server-side tracking
- Track server-side events for operations that shouldn't be client-side
- Use for analytics that need server context

## Animations with Framer Motion

### Component Animations

- Use animation components from `src/components/animations/`
- Use variants from `src/lib/animations/variants.ts`
- Prefer reusable animation components over inline animations

```tsx
import { FadeIn, SlideUp, StaggerContainer } from "@/components/animations"

<StaggerContainer>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <FadeIn>
        <ItemCard item={item} />
      </FadeIn>
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Animation Variants

- Define reusable variants in `src/lib/animations/variants.ts`
- Use consistent animation timings and easings
- Keep animations subtle and performant

## Error Handling

### Convex Errors

- Use `ConvexError` for user-facing errors
- Errors in queries automatically propagate to components
- Use error boundaries to catch and display errors

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
  // Handle error
}
```

### Component Error Handling

- Use error boundaries for query errors
- Handle mutation errors with try-catch
- Display user-friendly error messages

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
      toast.error(error instanceof Error ? error.message : "Failed to create identity")
    }
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

## Performance Optimization

### Convex Queries

- Queries are automatically optimized by Convex
- Use indexes for efficient queries (defined in schema)
- Queries are cached and only re-run when dependencies change
- Real-time updates are efficient (only changed data is sent)

### Component Optimization

- Use React.memo for expensive components
- Use useMemo for expensive computations
- Use useCallback for stable function references
- Convex queries handle loading states efficiently

### Database Optimization

- Use indexes for frequently queried fields
- Filter queries efficiently using indexes
- Use pagination for large datasets (if needed)

## Accessibility (a11y)

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Include appropriate ARIA attributes
- Maintain sufficient color contrast
- Test with screen readers
- Ensure pixel art components are accessible

## Code Organization

### File Naming

- Use PascalCase for component files: `IdentityManager.tsx`
- Use kebab-case for utility files: `date-utils.ts`
- Use camelCase for hook files: `useIdentities.ts`
- Use `index.ts` files for clean exports

### Import Order

1. External libraries
2. Convex imports
3. Internal modules
4. Types
5. CSS/style imports

```typescript
// Example import order
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { useUserIdentities } from "@/hooks/convex"
import { trackEvent } from "@/lib/analytics"
import type { Doc } from "@/convex/_generated/dataModel"
import "./styles.css"
```

## Documentation

- Add JSDoc comments for complex functions and components
- Document Convex functions with clear descriptions
- Keep README and documentation up to date
- Document custom hooks and their usage
- Document authentication requirements

## Git Workflow

- Use descriptive commit messages
- Follow conventional commits pattern: `<type>(<scope>): <description>`
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`
- Keep pull requests focused on single changes
- Review code thoroughly before merging

## Pixel Art Design System

### Color Palette

- Use CSS variables for pixel art colors:
  - `--pixel-pink`
  - `--pixel-teal`
  - `--pixel-yellow`
  - `--pixel-mint`
  - `--pixel-coral`
  - `--pixel-purple`

### Components

- `PixelBorder` - 8-bit style borders with shadow variants
- `PixelIcon` - SVG pixel icons (star, heart, arrow, check, etc.)
- `PixelCorner` - Corner decorations
- `PixelDivider` - Horizontal dividers with patterns

### Utilities

- `.pixel-shadow` - Neobrutalism shadow
- `.pixel-border` - 2px solid border
- `.pixel-glow` - Glow animation
- `.scanlines` - CRT scanline effect

## Conclusion

Following these standards and best practices will ensure a consistent, maintainable, and high-quality codebase for the Link-It application. These guidelines should be referenced when writing new code, refactoring existing code, or debugging issues.

Key principles:
- Type safety with TypeScript and Convex-generated types
- Real-time reactivity with Convex queries
- Client-first architecture with Next.js 16
- Convex backend for all data operations
- Pixel art aesthetic with neobrutalism design
- Authentication and authorization with Clerk
- Analytics integration with PostHog
- Smooth animations with Framer Motion
