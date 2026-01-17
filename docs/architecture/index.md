# Link-It - Architecture Documentation

This index provides navigation to all architecture documentation for the Link-It project. These documents are designed to help AI agents understand, refactor, write, and debug code recursively within the codebase.

## Available Documentation

1. [**Codebase Structure**](./codebase-structure.md) - Overview of the project's directory structure and key components
2. [**Data Flow**](./data-flow.md) - Documentation of how data flows through the application with Convex real-time architecture
3. [**Coding Standards**](./coding-standards.md) - Coding conventions and best practices for maintaining and extending the codebase

## Quick Reference

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Language**: TypeScript
- **Backend**: Convex (real-time database with reactive queries)
- **Authentication**: Clerk (integrated with Convex via JWT)
- **Validation**: Zod for type-safe schema validation
- **Analytics**: PostHog
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

### Key Directories

- `convex/` - Convex backend functions (queries, mutations, schema)
- `src/app` - Next.js application pages and routes
- `src/components` - React components (UI, pixel-art, animations, convex-powered)
- `src/hooks/convex` - Custom React hooks for Convex operations
- `src/lib` - Utility libraries (analytics, animations, validation)
- `src/middleware.ts` - Clerk authentication middleware

### Common Tasks

#### Adding a New Page

1. Create a new file in `src/app/` following Next.js app router conventions
2. If it's an admin page, place it in `src/app/(routes)/admin/`
3. Use client components (`"use client"`) with Convex hooks for data
4. If needed, create page-specific components in `src/components/`

#### Adding a New Component

1. Create component in `src/components/ui/` for shared UI components
2. Use `src/components/pixel-art/` for pixel art styled components
3. Use `src/components/animations/` for animated components
4. Use `src/components/convex/` for Convex-powered components
5. Follow the established patterns and coding standards
6. Use TypeScript for type safety

#### Working with Data

1. **Add a new table**: Define in `convex/schema.ts` with indexes
2. **Add queries**: Create in `convex/[resource]/queries.ts`
3. **Add mutations**: Create in `convex/[resource]/mutations.ts`
4. **Add public functions**: Create in `convex/[resource]/public.ts` if needed
5. **Create custom hooks**: Add to `src/hooks/convex/use[Resource].ts`
6. **Use in components**: Import hooks and use `useQuery`/`useMutation`

#### Adding Convex Functions

1. Create queries in `convex/[resource]/queries.ts` for read operations
2. Create mutations in `convex/[resource]/mutations.ts` for write operations
3. Create public functions in `convex/[resource]/public.ts` for public access
4. Use `ctx.auth.getUserIdentity()` for authentication
5. Validate inputs with Zod schemas
6. Use indexes for efficient queries (defined in schema)

#### Adding Custom Hooks

1. Create hook file in `src/hooks/convex/use[Resource].ts`
2. Wrap Convex queries/mutations with additional logic
3. Export from `src/hooks/convex/index.ts`
4. Use in components for type-safe, reactive data

## How to Use This Documentation

- Start with the [Codebase Structure](./codebase-structure.md) to understand the overall organization
- Use the [Data Flow](./data-flow.md) document to understand how Convex real-time architecture works
- Reference the [Coding Standards](./coding-standards.md) when writing or refactoring code

These documents provide a comprehensive understanding of the codebase and will be invaluable for AI-assisted development, refactoring, and debugging.

## Key Concepts

### Convex Real-Time Architecture

- **Queries**: Read-only functions that return data (automatically reactive)
- **Mutations**: Write functions that modify data (always authenticated)
- **Public Functions**: Queries that don't require authentication
- **Real-Time Updates**: Components automatically re-render when data changes

### Terminology

- **Identity**: A user's "link in bio" page (previously called "page")
- **Link**: A single link item on an identity
- **Theme**: Color scheme and styling for an identity
- **Query**: Read-only Convex function that returns data (reactive)
- **Mutation**: Write Convex function that modifies data

### Authentication Flow

1. User authenticates with Clerk
2. Clerk JWT is passed to Convex via `ConvexClientProvider`
3. Convex functions use `ctx.auth.getUserIdentity()` to verify authentication
4. User data is synced via Clerk webhook to Convex

### Data Flow Pattern

```
Component → useQuery/useMutation → Convex Function → Database
                ↓
         Real-time updates
                ↓
         Component re-renders
```
