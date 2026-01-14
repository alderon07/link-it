# Link-It - Data Flow and Component Interactions

This document provides a detailed overview of how data flows through the Link-It application, which is essential for refactoring, writing, and debugging code.

## Data Flow Overview

The application uses a three-tier architecture with multiple data access patterns:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Client UI  │ ◄──► │ Server      │ ◄──► │  Service    │ ◄──► │  Database   │
│             │      │ Actions/API │      │  Layer      │      │  Client     │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

## Three-Tier Data Architecture

### 1. Database Client Layer (`src/data/db/client.ts`)

The `DatabaseClient` interface provides database abstraction:
- Currently implemented as `DummyDatabaseClient` using mock data
- Designed to swap to Neon PostgreSQL via interface
- Provides CRUD operations for Users, Pages, Links, and Themes

### 2. Data Access Layer (DAL) (`src/data/*/*DAL.ts`)

Direct database operations through `getDb()`:
- No business logic, just data operations
- Examples: `pageDAL.ts`, `linkDAL.ts`, `userDAL.ts`
- Functions like `getPageById()`, `createPage()`, `updatePage()`, `deletePage()`

### 3. Service Layer (`src/data/*/*Service.ts`)

Business logic with ownership verification:
- Ownership checks
- Slug uniqueness validation
- Link reordering logic
- Examples: `pageService.ts`, `linkService.ts`, `userService.ts`
- Functions like `createPage()`, `updatePage()`, `getPage()` with ownership checks

## Data Access Patterns

The application supports two main data access patterns:

### Pattern 1: Server Actions (Form Submissions)

```
Client Component
  │
  ├── Calls Server Action (src/actions/*.ts)
  │   │
  │   ├── Validates authentication (Clerk)
  │   ├── Validates input with Zod schema
  │   │
  │   └── Calls Service Layer
  │       │
  │       ├── Verifies ownership
  │       ├── Validates business rules
  │       │
  │       └── Calls DAL
  │           │
  │           └── Database Client
  │
  └── Revalidates path and returns result
```

**Example: Creating a Page**

```typescript
// Client Component
const result = await createPageAction(formData)

// Server Action (src/actions/pages.ts)
export async function createPageAction(formData: FormData) {
  const { userId } = await auth() // Clerk authentication
  const validated = CreatePageSchema.safeParse(rawData) // Zod validation
  const page = await createPage(userId, validated.data) // Service layer
  revalidatePath("/admin/pages")
  return { success: true, data: { id: page.id, slug: page.slug } }
}

// Service Layer (src/data/pages/pageService.ts)
export async function createPage(userId: string, input: CreatePageInput) {
  await checkSlugAvailability(input.slug) // Business logic
  return await pageDAL.createPage({ ...input, user_id: userId }) // DAL
}
```

### Pattern 2: API Routes (REST Endpoints)

```
Client Component / External Client
  │
  ├── Calls API Route (src/app/api/v1/*/route.ts)
  │   │
  │   ├── requireAuth() - Clerk authentication
  │   ├── rateLimit() - Rate limiting
  │   ├── validateBody() - Zod validation + XSS prevention
  │   │
  │   └── Calls Service Layer
  │       │
  │       ├── Verifies ownership
  │       ├── Validates business rules
  │       │
  │       └── Calls DAL
  │           │
  │           └── Database Client
  │
  └── Returns successResponse() or errorResponse()
```

**Example: Getting Pages via API**

```typescript
// API Route (src/app/api/v1/pages/route.ts)
export async function GET(request: NextRequest) {
  const userId = await requireAuth() // Authentication
  await rateLimit(userId, "default") // Rate limiting
  const pages = await getUserPages(userId) // Service layer
  return successResponse(pages)
}

// Service Layer (src/data/pages/pageService.ts)
export async function getUserPages(userId: string) {
  return await pageDAL.getPagesByUserId(userId) // DAL
}
```

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)
├── ClerkProvider
├── PostHogProvider
├── SidebarProvider
└── Page Components
    ├── Landing Page (src/app/page.tsx)
    │   └── Home Component
    ├── Public Profile (src/app/[username]/page.tsx)
    │   └── PublicPageComponent
    │       └── LinksList
    │           └── LinkButton
    └── Admin Routes (src/app/(routes)/admin/*)
        ├── AdminLayout (with Sidebar)
        ├── Admin Dashboard
        ├── Page Manager
        ├── Links Manager
        ├── Theme Manager
        └── Analytics Dashboard
```

## Data Flow Patterns

### 1. Public Profile Page Flow

```
User visits /[username]
  │
  ├── Server Component fetches page by slug
  │   │
  │   └── Calls Service Layer
  │       │
  │       ├── getPublicPageBySlug(slug)
  │       │   │
  │       │   └── DAL: findBySlug()
  │       │
  │       └── incrementViewCount(pageId)
  │           │
  │           └── DAL: incrementViewCount()
  │
  └── Renders PublicPageComponent with links
      │
      └── Fetches links via Service Layer
          │
          └── getPublicPageLinks(pageId)
              │
              └── DAL: findActiveByPageId()
```

### 2. Admin Dashboard Flow

```
Authenticated user visits /admin
  │
  ├── Middleware verifies authentication
  │
  ├── Server Component fetches user pages
  │   │
  │   └── Calls Service Layer
  │       │
  │       └── getUserPages(userId)
  │           │
  │           └── DAL: findByUserId()
  │
  └── Renders AdminDashboard
      │
      ├── Page Manager Component
      │   ├── createPageAction() - Server Action
      │   ├── updatePageAction() - Server Action
      │   └── deletePageAction() - Server Action
      │
      ├── Links Manager Component
      │   ├── createLinkAction() - Server Action
      │   ├── updateLinkAction() - Server Action
      │   ├── deleteLinkAction() - Server Action
      │   └── reorderLinksAction() - Server Action
      │
      └── Analytics Dashboard
          └── Fetches analytics via PostHog
```

### 3. API Route Flow (External Access)

```
External client calls /api/v1/pages
  │
  ├── requireAuth() - Verifies Clerk JWT
  ├── rateLimit() - Checks rate limits
  │
  └── Handler function
      │
      ├── validateBody() - Validates and sanitizes input
      │
      └── Calls Service Layer
          │
          ├── Verifies ownership
          ├── Validates business rules
          │
          └── Calls DAL
              │
              └── Database Client
                  │
                  └── Returns data
                      │
                      └── successResponse() or errorResponse()
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
  ├── API Routes
  │   │
  │   └── requireAuth() from @/lib/api/auth
  │       │
  │       └── Returns Clerk user ID
  │
  └── Server Actions
      │
      └── auth() from @clerk/nextjs/server
          │
          └── Returns { userId } or null
```

### Webhook Flow (User Sync)

```
Clerk User Event (user.created, user.updated, user.deleted)
  │
  ├── Webhook: /api/webhooks/clerk
  │   │
  │   ├── Verifies Svix signature
  │   │
  │   └── Handles event
  │       │
  │       ├── user.created → createUser()
  │       ├── user.updated → updateUser()
  │       └── user.deleted → deleteUser()
  │           │
  │           └── Service Layer → DAL → Database
```

## Validation Flow

### Input Validation

```
User Input
  │
  ├── Client-side validation (optional, for UX)
  │
  └── Server-side validation
      │
      ├── Server Actions
      │   │
      │   └── Zod schema validation
      │       │
      │       ├── safeParse() - Returns success/error
      │       │
      │       └── If invalid: Return error to client
      │
      └── API Routes
          │
          └── validateBody() from @/lib/api/validation
              │
              ├── Zod schema validation
              ├── sanitizeText() - XSS prevention
              │
              └── If invalid: Return errorResponse()
```

### Business Logic Validation

```
Service Layer Function
  │
  ├── Ownership Verification
  │   │
  │   └── Checks if userId matches resource owner
  │       │
  │       └── Throws NotAuthorizedError if not
  │
  ├── Business Rules
  │   │
  │   ├── Slug uniqueness (for pages)
  │   ├── Link ordering (for links)
  │   └── Theme validation
  │
  └── Calls DAL if all validations pass
```

## Error Handling

### Server Actions

```typescript
// Action returns ActionResult<T>
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// Example usage
const result = await createPageAction(formData)
if (!result.success) {
  // Display error: result.error
}
```

### API Routes

```typescript
// Standardized error responses
try {
  const data = await serviceFunction()
  return successResponse(data)
} catch (error) {
  if (error instanceof AuthError) {
    return error.response // Already a NextResponse
  }
  if (error instanceof NotAuthorizedError) {
    return ApiErrors.forbidden(error.message)
  }
  return ApiErrors.internalError()
}
```

### Service Layer Errors

```typescript
// Custom error classes
export class PageNotFoundError extends Error { }
export class SlugTakenError extends Error { }
export class NotAuthorizedError extends Error { }

// Thrown by service layer, caught by actions/API routes
```

## State Management

### Server Components

- Data fetched directly in server components
- No client-side state needed for initial render
- Revalidation via `revalidatePath()` after mutations

### Client Components

- `useState` for form inputs and UI state
- `useEffect` for data fetching (when needed)
- Optimistic updates for better UX

### Analytics State

- PostHog tracks events automatically via `PostHogProvider`
- Custom events via `trackEvent()` from `@/lib/analytics`
- User identification via `identifyUser()` on login

## Data Entities

### User
- `id`: number
- `clerk_user_id`: string (Clerk user ID)
- `email`: string
- `username`: string
- `display_name`: string | null
- `avatar_url`: string | null
- `created_at`: string (ISO datetime)
- `updated_at`: string (ISO datetime)
- `deleted_at`: string | null

### Page
- `id`: number
- `user_id`: string (Clerk user ID)
- `name`: string
- `slug`: string (unique)
- `description`: string | null
- `bio`: string | null
- `avatar_url`: string | null
- `theme_id`: number | null
- `is_public`: boolean
- `view_count`: number
- `created_at`: string
- `updated_at`: string
- `deleted_at`: string | null

### Link
- `id`: number
- `page_id`: number
- `title`: string
- `url`: string
- `description`: string | null
- `is_active`: boolean
- `order_index`: number
- `click_count`: number
- `visible_from`: string | null
- `visible_until`: string | null
- `created_at`: string
- `updated_at`: string
- `deleted_at`: string | null

### Theme
- `id`: number
- `user_id`: string | null (null for system themes)
- `name`: string
- `colors`: object (theme configuration)
- `is_system`: boolean
- `created_at`: string
- `updated_at`: string

## Key Data Interactions

### 1. Creating a Page

```typescript
// Client → Server Action → Service → DAL → Database
const result = await createPageAction(formData)
// Validates: authentication, input schema, slug availability
// Creates: page record
// Returns: { success: true, data: { id, slug } }
```

### 2. Updating a Page

```typescript
// Client → Server Action → Service → DAL → Database
const result = await updatePageAction(formData)
// Validates: authentication, ownership, input schema, slug availability
// Updates: page record
// Revalidates: /admin/pages
```

### 3. Creating a Link

```typescript
// Client → Server Action → Service → DAL → Database
const result = await createLinkAction(formData)
// Validates: authentication, page ownership, input schema
// Creates: link record
// Revalidates: page path
```

### 4. Reordering Links

```typescript
// Client → Server Action → Service → DAL → Database
const result = await reorderLinksAction(formData)
// Validates: authentication, page ownership, all links belong to page
// Updates: order_index for multiple links (transaction)
```

### 5. Viewing Public Page

```typescript
// Server Component → Service → DAL → Database
const page = await getPublicPageBySlug(slug)
await incrementViewCount(page.id)
// Fetches: page and active links
// Increments: view_count atomically
```

## Performance Considerations

1. **Server Components**: Data fetched on server, no client-side loading
2. **Revalidation**: `revalidatePath()` after mutations for fresh data
3. **Optimistic Updates**: Client-side state updates before server confirmation
4. **Rate Limiting**: Prevents abuse of API endpoints
5. **Caching**: Next.js automatic caching for static routes

## Development and Debugging Guidelines

1. **Tracing Data Flow**:
   - Start from component → action/API → service → DAL → database
   - Check authentication at each layer
   - Verify validation at input boundaries

2. **Error Debugging**:
   - Check service layer errors (ownership, business rules)
   - Check validation errors (Zod schemas)
   - Check authentication errors (Clerk)

3. **Testing Data Operations**:
   - Test with mock data (DummyDatabaseClient)
   - Verify ownership checks
   - Test edge cases (duplicate slugs, invalid IDs)

## Expansion Guidelines

When adding new features:

1. **New Data Entities**:
   - Add Zod schema in `src/data/db/schema.ts`
   - Create DAL functions in `src/data/[entity]/[entity]DAL.ts`
   - Create service functions in `src/data/[entity]/[entity]Service.ts`
   - Add to DatabaseClient interface

2. **New API Endpoints**:
   - Create route in `src/app/api/v1/[resource]/route.ts`
   - Use `requireAuth()`, `rateLimit()`, `validateBody()`
   - Call service layer functions
   - Return `successResponse()` or `errorResponse()`

3. **New Server Actions**:
   - Create action in `src/actions/[resource].ts`
   - Validate authentication and input
   - Call service layer functions
   - Use `revalidatePath()` after mutations

4. **New UI Components**:
   - Use server components when possible
   - Call server actions for mutations
   - Use client components for interactivity
   - Handle loading and error states
