# Tech Stack

Single source of truth for Link-It's technology choices.

## Core

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js | 16 | App Router, SSR |
| UI | React | 19 | Components |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | v4 | Utility-first CSS |
| Components | shadcn/ui | new-york | Base components with pixel variants |
| Backend | Convex | 1.31+ | Real-time database, serverless functions |
| Auth | Clerk | 7.x | Authentication, user management |

## Supporting Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| Validation | Zod | Schema validation (forms, API inputs) |
| Analytics | PostHog | Product analytics, feature flags |
| Animations | Framer Motion | Component animations |
| Toasts | Sonner | Toast notifications |
| Icons | Lucide React | Icon library |
| Webhooks | Svix | Clerk webhook verification |

## Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| React Scan | Performance profiling |

## Key Integrations

### Convex + Clerk

Clerk handles authentication, Convex verifies JWT tokens:

```
User → Clerk Auth → JWT Token → ConvexProvider → Convex Backend
                                    ↓
                         ctx.auth.getUserIdentity()
```

### Convex Architecture

- **Queries**: Read-only, automatically reactive
- **Mutations**: Write operations, always authenticated
- **Public Functions**: No auth required (public pages)
- **HTTP Routes**: Webhook handlers (Clerk sync)

## Package Manager

**pnpm** - All commands use pnpm (not npm/yarn).
