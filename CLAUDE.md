# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Link-It is a "link in bio" application built with Next.js 16, featuring a modern pixel art aesthetic with neobrutalism accents. Users can create personalized pages with collections of links. It uses Clerk for authentication, shadcn/ui components, PostHog for analytics, and Framer Motion for animations.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm scan         # Dev server with React Scan for performance analysis
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Clerk
- **UI**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Animations**: Framer Motion
- **Validation**: Zod
- **Analytics**: PostHog
- **Toasts**: Sonner
- **Icons**: Lucide React

## Architecture

### Data Layer (`src/data/`)

Three-tier architecture with database abstraction:

```
src/data/
├── db/
│   ├── client.ts     # DatabaseClient interface + DummyDatabaseClient
│   ├── schema.ts     # Zod schemas for User, Page, Link, Theme
│   └── index.ts      # Exports
├── pages/
│   ├── pageDAL.ts    # Direct database operations
│   ├── pageService.ts # Business logic (ownership, slug uniqueness)
│   └── index.ts
├── links/
│   ├── linkDAL.ts    # Direct database operations
│   ├── linkService.ts # Business logic (ownership, reordering)
│   └── index.ts
└── index.ts          # Combined exports
```

- **DAL**: Direct CRUD operations through `getDb()`
- **Service**: Business logic with ownership verification
- Currently uses mock data from `src/dummy.json`
- Designed to swap to Neon PostgreSQL via `DatabaseClient` interface

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
  - `/admin/pages` - Manage pages
  - `/admin/pages/[pageId]/links` - Manage links for a page
  - `/admin/pages/[pageId]/themes` - Theme customization
  - `/admin/analytics` - Analytics dashboard

### Authentication

Clerk handles auth via middleware (`src/middleware.ts`). Public routes are `/` and `/login`. All other routes are protected.

API routes use `requireAuth()` from `@/lib/api/auth` which returns the Clerk user ID.

### Security

- **Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy (configured in `next.config.mjs`)
- **Rate Limiting**: In-memory rate limiter with configs (default, strict, lenient, analytics)
- **Input Validation**: Zod schemas with XSS prevention via `sanitizeText()`
- **Webhook Verification**: Svix signature verification for Clerk webhooks

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Database (future)
DATABASE_URL=
```

## Commit Convention

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `ci`

## Path Aliases

- `@/*` maps to `./src/*`
- `@/public/*` maps to `./public/*`
