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

## Architecture

- [Overview & Quick Reference](./docs/architecture/index.md)
- [Tech Stack](./docs/architecture/tech-stack.md)
- [Codebase Structure](./docs/architecture/codebase-structure.md)
- [Coding Standards](./docs/architecture/coding-standards.md)
- [Data Flow](./docs/architecture/data-flow.md)

## Project-Specific Context

- Screenshots: `/mnt/c/Users/naqih/Pictures/Screenshots`
- UI Components: shadcn/ui with `variant="pixel"` for pixel art style
- Backend: All data via Convex (no REST APIs)
- Auth: Clerk → Convex JWT integration
