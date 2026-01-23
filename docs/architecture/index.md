# Link-It Architecture

Entry point for architecture documentation.

## Documentation

| Document | Use When |
|----------|----------|
| [Tech Stack](./tech-stack.md) | Understanding dependencies, integrations |
| [Codebase Structure](./codebase-structure.md) | Finding files, understanding directory layout |
| [Coding Standards](./coding-standards.md) | Writing/refactoring code, following conventions |
| [Data Flow](./data-flow.md) | Understanding component interactions, debugging |
| [Testing & CI/CD](../testing-ci-cd-guide.md) | Writing tests, understanding pipelines |
| [Deployment](../deployment-setup-guide.md) | Deploying, environment configuration |

## Terminology

| Term | Meaning |
|------|---------|
| **Identity** | A user's "link in bio" page (the shareable page) |
| **Link** | A single link item on an identity |
| **Theme** | Color scheme and styling for an identity |
| **Query** | Read-only Convex function (automatically reactive) |
| **Mutation** | Write Convex function (modifies data) |
| **Public Function** | Convex function without authentication |

## Quick Commands

```bash
pnpm dev:convex              # Dev server (Next.js + Convex)
pnpm lint && pnpm typecheck  # Check code
pnpm test                    # Unit tests
pnpm test:e2e                # E2E tests
```

## Common Tasks

### Adding a New Page

1. Create file in `src/app/` (App Router conventions)
2. Admin pages → `src/app/(routes)/admin/`
3. Use `"use client"` with Convex hooks for data

### Adding a New Component

1. Shared UI → `src/components/ui/`
2. Pixel art styled → `src/components/pixel-art/`
3. Animated → `src/components/animations/`
4. Data-fetching → `src/components/convex/`

### Working with Data

1. Define table in `convex/schema.ts` (with indexes)
2. Create queries in `convex/[resource]/queries.ts`
3. Create mutations in `convex/[resource]/mutations.ts`
4. Create hooks in `src/hooks/convex/use[Resource].ts`
5. Use hooks in components

### Docker Deployment

```bash
./scripts/check-env.sh all --env-file .env.prod  # Validate env
make build                                        # Build image
make staging                                      # Deploy staging
make prod                                         # Deploy production
```

See [Docker Deployment Guide](../docker-deployment-guide.md) for details.
