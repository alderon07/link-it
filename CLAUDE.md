# Link-It

A "link in bio" application with pixel art aesthetic, built with Next.js 16, Convex, and Clerk.

## Commands

```bash
pnpm dev:convex      # Start dev (Next.js + Convex)
pnpm lint            # ESLint
pnpm typecheck       # TypeScript check
pnpm test            # Vitest unit tests
pnpm test:e2e        # Playwright E2E tests
```

## Key Patterns

- **UI**: shadcn/ui with `variant="pixel"` for pixel art style
- **Backend**: All data via Convex (no REST APIs)
- **Auth**: Clerk → Convex JWT integration

## Documentation

See [Architecture Index](./docs/architecture/index.md) for detailed guides.
