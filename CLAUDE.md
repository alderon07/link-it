# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Link-It is a "link in bio" application built with Next.js 16, featuring a modern pixel art aesthetic with neobrutalism accents. Users can create personalized pages with collections of links. It uses Clerk for authentication, shadcn/ui components, PostHog for analytics, and Framer Motion for animations.

## Commands

```bash
pnpm dev          # Start Next.js + Convex dev servers in parallel
pnpm dev:next     # Start Next.js only
pnpm dev:convex   # Start Convex only
pnpm build        # Deploy Convex + Production build
pnpm lint         # Run ESLint
pnpm scan         # Dev server with React Scan for performance analysis
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Convex (reactive, real-time)
- **Auth**: Clerk (with Convex integration)
- **UI**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Animations**: Framer Motion
- **Validation**: Zod (client) + Convex validators (server)
- **Analytics**: PostHog
- **Toasts**: Sonner
- **Icons**: Lucide React

## Architecture

### Convex Backend (`convex/`)

Real-time database with type-safe queries and mutations:

```
convex/
├── _generated/           # Auto-generated types (don't edit)
├── schema.ts             # Table definitions with indexes
├── auth.config.ts        # Clerk JWT configuration
├── http.ts               # HTTP routes (Clerk webhooks)
│
├── lib/
│   ├── utils.ts          # Helpers (sanitization, slug generation)
│   └── validators.ts     # Validation constraints
│
├── users/
│   ├── queries.ts        # getCurrentUser, getUserByClerkId
│   ├── mutations.ts      # updateUser, updateUsername, deleteUser
│   └── internal.ts       # createFromClerk (webhook only)
│
├── pages/
│   ├── queries.ts        # getPage, getUserPages, isSlugAvailable
│   ├── mutations.ts      # createPage, updatePage, deletePage
│   └── public.ts         # getPublicPage, incrementViewCount
│
├── links/
│   ├── queries.ts        # getLink, getPageLinks
│   ├── mutations.ts      # createLink, updateLink, deleteLink, reorderLinks
│   └── public.ts         # getPublicPageLinks, trackClick
│
├── themes/
│   ├── queries.ts        # getTheme, getSystemThemes, getUserThemes
│   └── mutations.ts      # createTheme, updateTheme, deleteTheme
│
└── settings/
    ├── queries.ts        # getUserSettings, getUserProgress
    └── mutations.ts      # updateSettings, updateProgress
```

### React Hooks (`src/hooks/convex/`)

Custom hooks for Convex integration:

```
src/hooks/convex/
├── useUser.ts            # useCurrentUser, useUserMutations
├── usePages.ts           # useUserPages, usePage, usePublicPage, usePageMutations
├── useLinks.ts           # usePageLinks, usePublicPageLinks, useLinkMutations
├── useThemes.ts          # useAllThemes, useThemeMutations
└── index.ts              # Combined exports
```

Usage in components:
```tsx
import { useUserPages, usePageMutations } from "@/hooks/convex";

function MyComponent() {
  const pages = useUserPages();
  const { createPage, updatePage, deletePage } = usePageMutations();
  // Real-time updates automatically!
}
```

### Convex Components (`src/components/convex/`)

Migrated components using Convex hooks:
- `PageManager` - Identity management with real-time updates
- `PublicPageComponent` - Public page display with live view counts
- `PageLinksManager` - Link management with optimistic updates

### Legacy Data Layer (`src/data/`) - DEPRECATED

The old mock data layer is kept for reference but should not be used:
- Use Convex queries/mutations instead of `getDb()`
- Use `src/hooks/convex` hooks instead of direct API calls

### API Layer (`src/lib/api/`)

```
src/lib/api/
├── response.ts    # successResponse, errorResponse, ApiErrors, withErrorHandling
├── auth.ts        # requireAuth, requireOwnership, requirePageOwnership
├── validation.ts  # Zod schemas, sanitizeText, validateBody
├── rate-limit.ts  # In-memory rate limiter with configs
├── security.ts    # getClientIp, verifyOrigin, isSafeRedirectUrl
└── index.ts       # Combined exports
```

### API Routes (`src/app/api/v1/`)

```
/api/v1/
├── health/route.ts              # Health check
├── pages/
│   ├── route.ts                 # GET (list), POST (create)
│   └── [pageId]/
│       ├── route.ts             # GET, PUT, DELETE
│       └── links/route.ts       # GET, POST for page links
├── links/
│   ├── route.ts                 # POST /reorder
│   └── [linkId]/route.ts        # GET, PUT, DELETE
└── webhooks/clerk/route.ts      # Clerk webhook handler
```

### Server Actions (`src/actions/`)

```
src/actions/
├── pages.ts       # createPageAction, updatePageAction, deletePageAction
├── links.ts       # createLinkAction, updateLinkAction, deleteLinkAction, reorderLinksAction
└── index.ts       # Combined exports
```

### Analytics (`src/lib/analytics/`)

```
src/lib/analytics/
├── events.ts          # Type-safe event definitions
├── posthog-client.ts  # Client-side initialization, trackEvent, identifyUser
├── posthog-server.ts  # Server-side client for API routes
└── index.ts           # Combined exports
```

Use `PostHogProvider` in layout for automatic page tracking and user identification.

### Pixel Art Components (`src/components/pixel-art/`)

Custom components with pixel art styling:
- `PixelBorder` - 8-bit style borders with shadow variants
- `PixelIcon` - SVG pixel icons (star, heart, arrow, check, etc.)
- `PixelCorner` - Corner decorations
- `PixelDivider` - Horizontal dividers with patterns

### Animation Components (`src/components/animations/`)

Framer Motion components:
- `PageTransition`, `FadeIn`, `SlideUp`, `ScaleIn` - Page/element transitions
- `StaggerContainer`, `StaggerItem` - Staggered animations
- `PixelConfetti` - Success celebration effect
- `CountUp` - Animated number counter

Reusable variants in `src/lib/animations/variants.ts`.

### UI Components

shadcn/ui components with pixel variants:
- `Button` - pixel, pixel-secondary, pixel-outline, pixel-destructive, pixel-success
- `Card` - pixel, pixel-interactive, pixel-flat, pixel-glow
- `Badge` - retro variant

CSS utilities in `globals.css`:
- `.pixel-shadow` - Neobrutalism shadow with hover animation
- `.pixel-border` - 2px solid border
- `.scanlines` - CRT scanline effect
- `.pixel-glow`, `.pixel-bounce`, `.pixel-shake` - Animations

### Route Structure

- `/` - Public landing page
- `/[username]` - Public user profile page (increments view count)
- `/login` - Clerk authentication (catch-all route)
- `/admin/*` - Protected admin routes with sidebar layout
  - `/admin/pages` - Manage identities
  - `/admin/pages/[pageId]/links` - Manage links for a page
  - `/admin/pages/[pageId]/themes` - Theme customization
  - `/admin/analytics` - Analytics dashboard

### Authentication

Clerk handles auth via middleware (`src/middleware.ts`). Public routes are `/` and `/login`. All other routes are protected.

**Convex Authentication:**
- `ConvexClientProvider` wraps the app with Clerk auth integration
- Convex queries/mutations automatically get auth context via `ctx.auth.getUserIdentity()`
- Clerk webhooks sync user data to Convex via `convex/http.ts`

**API routes** (legacy): Use `requireAuth()` from `@/lib/api/auth` which returns the Clerk user ID.

### Security

- **Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy (configured in `next.config.mjs`)
- **Rate Limiting**: In-memory rate limiter with configs (default, strict, lenient, analytics)
- **Input Validation**: Zod schemas with XSS prevention via `sanitizeText()`
- **Webhook Verification**: Svix signature verification for Clerk webhooks

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=

# Convex
NEXT_PUBLIC_CONVEX_URL=           # From Convex dashboard
CONVEX_DEPLOY_KEY=                # For production deployments

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
CLERK_JWT_ISSUER_DOMAIN=          # For Convex auth (e.g., https://your-app.clerk.accounts.dev)

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Commit Convention

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`

## Path Aliases

- `@/*` maps to `./src/*`
- `@/public/*` maps to `./public/*`
