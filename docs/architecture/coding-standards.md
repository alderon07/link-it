# Link-It - Coding Standards and Best Practices

This document outlines the coding standards, conventions, and best practices used in the Link-It codebase. Following these guidelines ensures consistency and maintainability when refactoring, writing, and debugging code.

## TypeScript Guidelines

### Type Definitions

- Place shared types in the `src/types/` directory
- Use interfaces for object shapes and types for unions or primitives
- Prefer explicit typing over implicit (`any` is discouraged)
- Derive types from Zod schemas using `z.infer<typeof Schema>`

```typescript
// Good: Derive types from Zod schemas
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
})

export type User = z.infer<typeof UserSchema>

// Better: With readonly for immutable properties
interface User {
  readonly id: number
  email: string
}
```

### Type Safety

- Leverage TypeScript's type system to prevent runtime errors
- Use discriminated unions for state management
- Implement proper error handling with typed errors

```typescript
// Example of a discriminated union for API states
type ApiState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

// Server action result type
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
```

## React Component Guidelines

### Component Structure

- Use functional components with hooks
- Prefer server components when possible (Next.js 16)
- Split large components into smaller, focused ones
- Co-locate related components in the same directory

```typescript
// Example server component
export default async function Page() {
  const pages = await getUserPages(userId)
  return <PageList pages={pages} />
}

// Example client component
"use client"
export function PageList({ pages }: { pages: Page[] }) {
  return (
    <div>
      {pages.map(page => <PageCard key={page.id} page={page} />)}
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
interface ButtonProps {
  /** The variant style of the button */
  variant?: 'default' | 'pixel' | 'pixel-secondary' | 'pixel-outline'
  /** Handler for click events */
  onClick?: () => void
  children: React.ReactNode
}

export function Button({ 
  variant = 'default',
  onClick,
  children 
}: ButtonProps) {
  // Component implementation
}
```

### State Management

- Use appropriate hooks for state management:
  - `useState` for simple component state
  - `useReducer` for complex state logic
  - Server components for data fetching (no client state needed)
- Keep state as local as possible
- Lift state up when needed by multiple components
- Use server actions for mutations

## Next.js Patterns

### Page Organization

- Use the App Router patterns for routing
- Use route groups `(routes)` for organization
- Keep route-specific components in the same directory as the page
- Implement error boundaries using `error.tsx` files
- Use `not-found.tsx` for 404 pages

### Data Fetching

- Use server components when possible for data fetching
- Use server actions for form submissions and mutations
- Implement proper loading states with `loading.tsx`
- Use `revalidatePath()` after mutations to refresh data
- Consider using React Suspense for loading states

### Server Actions

- Mark with `"use server"` directive
- Validate authentication using `auth()` from Clerk
- Validate inputs with Zod schemas
- Call service layer functions (not DAL directly)
- Use `revalidatePath()` to refresh cached data
- Return `ActionResult<T>` type for consistent error handling

```typescript
"use server"

export async function createPageAction(
  formData: FormData
): Promise<ActionResult<{ id: number; slug: string }>> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  const validated = CreatePageSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: "Validation failed" }
  }

  const page = await createPage(userId, validated.data)
  revalidatePath("/admin/pages")
  
  return { success: true, data: { id: page.id, slug: page.slug } }
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

### API Routes

- Use `requireAuth()` from `@/lib/api/auth` for authentication
- Returns Clerk user ID or throws `AuthError`
- Use `requireOwnership()` to verify resource ownership

```typescript
export async function GET() {
  const userId = await requireAuth() // Throws if not authenticated
  // userId is guaranteed to be a string here
}
```

### Server Components and Actions

- Use `auth()` from `@clerk/nextjs/server` for server components
- Returns `{ userId }` or `null`
- Check authentication before data operations

```typescript
const { userId } = await auth()
if (!userId) {
  redirect('/login')
}
```

## API and Data Handling

### API Routes

- Create routes in `src/app/api/v1/[resource]/route.ts`
- Use `requireAuth()` for authentication
- Apply rate limiting with `rateLimit()` from `@/lib/api/rate-limit`
- Validate inputs with `validateBody()` from `@/lib/api/validation`
- Return `successResponse()` or `errorResponse()` from `@/lib/api/response`
- Use `withErrorHandling()` wrapper for automatic error handling

```typescript
export async function POST(request: NextRequest) {
  const userId = await requireAuth()
  await rateLimit(userId, "default")
  
  const body = await validateBody(CreatePageSchema, request)
  const page = await createPage(userId, body)
  
  return successResponse(page)
}
```

### Data Validation

- Validate all user inputs with Zod schemas
- Use `sanitizeText()` from `@/lib/api/validation` for XSS prevention
- Validate at API boundaries (routes and actions)
- Use service layer for business rule validation

```typescript
// In API route or server action
const validated = CreatePageSchema.safeParse(rawData)
if (!validated.success) {
  return { success: false, error: "Validation failed" }
}

// Or use validateBody helper
const body = await validateBody(CreatePageSchema, request)
```

### Three-Tier Data Architecture

1. **Database Client** (`src/data/db/client.ts`):
   - Interface for database abstraction
   - Currently `DummyDatabaseClient`, designed to swap to real DB

2. **Data Access Layer (DAL)** (`src/data/*/*DAL.ts`):
   - Direct CRUD operations
   - No business logic
   - Call via `getDb()` helper

3. **Service Layer** (`src/data/*/*Service.ts`):
   - Business logic (ownership, validation)
   - Call from API routes and server actions
   - Never call DAL directly from components

```typescript
// ✅ Good: Component → Action → Service → DAL
const result = await createPageAction(formData)

// ❌ Bad: Component → DAL (bypasses service layer)
const page = await pageDAL.createPage(data)
```

## Analytics with PostHog

### Client-Side Tracking

- Use `PostHogProvider` in root layout for automatic initialization
- Track events with `trackEvent()` from `@/lib/analytics`
- Identify users with `identifyUser()` on login
- Use type-safe event names from `@/lib/analytics/events`

```typescript
import { trackEvent } from "@/lib/analytics"

trackEvent("page_created", {
  page_id: page.id,
  page_slug: page.slug,
})
```

### Server-Side Tracking

- Use `posthog-server.ts` for API route tracking
- Track server-side events for API operations
- Use for analytics that shouldn't be client-side

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

## Testing Guidelines

### Component Testing

- Test components in isolation
- Test different states: initial, loading, success, error
- Test user interactions and state changes
- Test pixel art variants render correctly

### Integration Testing

- Test key user flows end-to-end
- Ensure components work together correctly
- Test edge cases and error scenarios
- Test authentication and authorization flows

## Performance Optimization

### Code Splitting

- Use dynamic imports for large components
- Lazy load routes and components when appropriate
- Optimize bundle size by monitoring imports

### Rendering Optimization

- Use server components for data fetching
- Use `revalidatePath()` strategically after mutations
- Implement virtualization for long lists
- Optimize images using Next.js Image component

### Database Optimization

- Use service layer for efficient queries
- Implement pagination for large datasets
- Use indexes for frequently queried fields

## Accessibility (a11y)

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Include appropriate ARIA attributes
- Maintain sufficient color contrast
- Test with screen readers
- Ensure pixel art components are accessible

## Code Organization

### File Naming

- Use PascalCase for component files: `PageManager.tsx`
- Use kebab-case for utility files: `date-utils.ts`
- Use camelCase for function files: `pageService.ts`
- Use `index.ts` files for clean exports

### Import Order

1. External libraries
2. Internal modules
3. Types
4. CSS/style imports

```typescript
// Example import order
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { createPage } from "@/data/pages"
import { trackEvent } from "@/lib/analytics"

import type { Page } from "@/data/db"

import "./styles.css"
```

## Error Handling

### Server Actions

- Return `ActionResult<T>` type
- Handle errors gracefully
- Provide user-friendly error messages

```typescript
try {
  const page = await createPage(userId, data)
  return { success: true, data: page }
} catch (error) {
  if (error instanceof SlugTakenError) {
    return { success: false, error: "Slug is already taken" }
  }
  return { success: false, error: "Failed to create page" }
}
```

### API Routes

- Use `withErrorHandling()` wrapper
- Return standardized error responses
- Log errors appropriately

```typescript
export const POST = withErrorHandling(async (request) => {
  // Handler code
  return successResponse(data)
})
```

### Service Layer

- Throw custom error classes
- Let errors bubble up to be caught by actions/API routes

```typescript
export class PageNotFoundError extends Error { }
export class SlugTakenError extends Error { }
export class NotAuthorizedError extends Error { }
```

## Documentation

- Add JSDoc comments for complex functions and components
- Document state management approaches
- Keep README and documentation up to date
- Document API endpoints and their usage
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
- Type safety with TypeScript and Zod
- Server-first architecture with Next.js 16
- Three-tier data architecture (DAL → Service → API/Component)
- Pixel art aesthetic with neobrutalism design
- Authentication and authorization with Clerk
- Analytics integration with PostHog
- Smooth animations with Framer Motion
