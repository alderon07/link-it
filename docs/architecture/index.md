# Link-It Architecture

## Documentation

| Document | Use When |
|----------|----------|
| [Tech Stack](./tech-stack.md) | Understanding dependencies, integrations |
| [Codebase Structure](./codebase-structure.md) | Finding files, understanding directory layout |
| [Convex Patterns](./convex-patterns.md) | Writing queries, mutations, using Convex hooks |
| [Styling Guide](./styling.md) | Pixel art components, Tailwind utilities |
| [Authentication](./auth.md) | Clerk middleware, Convex JWT, webhooks |

## Terminology

| Term | Meaning |
|------|---------|
| **Identity** | A user's "link in bio" page (the shareable page) |
| **Link** | A single link item on an identity |
| **Theme** | Color scheme and styling for an identity |
| **Query** | Read-only Convex function (automatically reactive) |
| **Mutation** | Write Convex function (modifies data) |
| **Public Function** | Convex function without authentication |

## Common Tasks

### Adding a New Page

1. Create file in `src/app/` (App Router conventions)
2. Admin pages go in `src/app/(routes)/admin/`
3. Use `"use client"` with Convex hooks for data

### Adding a New Component

| Type | Location |
|------|----------|
| Shared UI | `src/components/ui/` |
| Pixel art styled | `src/components/pixel-art/` |
| Animated | `src/components/animations/` |
| Data-fetching | `src/components/convex/` |

### Working with Data

1. Define table in `convex/schema.ts` (with indexes)
2. Create queries in `convex/[resource]/queries.ts`
3. Create mutations in `convex/[resource]/mutations.ts`
4. Create hooks in `src/hooks/convex/use[Resource].ts`
5. Use hooks in components
