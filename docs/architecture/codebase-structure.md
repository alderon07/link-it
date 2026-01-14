# Link-It - Codebase Architecture Documentation

This document provides an overview of the Link-It architecture, designed to help AI agents understand, refactor, write, or debug code within this project.

## Project Overview

Link-It is a "link in bio" application (similar to Linktree) where users can create personalized pages with collections of links. The application features a modern pixel art aesthetic with neobrutalism accents. Users can create multiple pages (identities), customize themes, manage links, and view analytics. The application is built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Validation**: Zod for schema validation
- **Analytics**: PostHog
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Development Tools**: ESLint, Prettier

## Directory Structure

```
link-it/
├── docs/                          # Documentation
│   └── architecture/              # Architecture documentation
├── plans/                         # Implementation plans
├── public/                        # Static assets
├── src/                           # Source code
│   ├── actions/                   # Server actions
│   │   ├── index.ts
│   │   ├── links.ts              # Link CRUD actions
│   │   └── pages.ts              # Page CRUD actions
│   ├── app/                       # Next.js app router
│   │   ├── (routes)/              # Route groups
│   │   │   └── admin/            # Protected admin routes
│   │   │       ├── analytics/    # Analytics dashboard
│   │   │       ├── links/        # Global links management
│   │   │       ├── pages/        # Page management
│   │   │       │   └── [pageId]/
│   │   │       │       ├── links/    # Page-specific links
│   │   │       │       └── themes/   # Theme customization
│   │   │       ├── layout.tsx    # Admin layout with sidebar
│   │   │       └── page.tsx     # Admin dashboard
│   │   ├── [username]/           # Public user profile pages
│   │   ├── api/                  # API routes
│   │   │   ├── v1/               # API v1 endpoints
│   │   │   │   ├── health/       # Health check
│   │   │   │   ├── pages/        # Page CRUD API
│   │   │   │   ├── links/        # Link CRUD API
│   │   │   │   └── webhooks/     # Webhook handlers
│   │   │   │       └── clerk/    # Clerk webhook
│   │   ├── login/                # Clerk authentication
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── not-found.tsx         # 404 page
│   ├── components/               # React components
│   │   ├── animations/          # Framer Motion components
│   │   ├── pixel-art/           # Pixel art styled components
│   │   ├── providers/           # Context providers
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── analytics-dashboard.tsx
│   │   ├── global-links-manager.tsx
│   │   ├── home.tsx
│   │   ├── page-links-manager.tsx
│   │   ├── page-manager.tsx
│   │   ├── page-theme-editor.tsx
│   │   ├── page-theme-gallery.tsx
│   │   ├── page-theme-manager.tsx
│   │   ├── public-page-component.tsx
│   │   └── ReactScan.tsx
│   ├── data/                     # Data access layer
│   │   ├── db/                   # Database abstraction
│   │   │   ├── client.ts         # DatabaseClient interface + DummyDatabaseClient
│   │   │   ├── schema.ts         # Zod schemas (User, Page, Link, Theme)
│   │   │   └── index.ts
│   │   ├── links/                # Link data layer
│   │   │   ├── linkDAL.ts        # Direct database operations
│   │   │   ├── linkService.ts    # Business logic (ownership, reordering)
│   │   │   └── index.ts
│   │   ├── pages/                # Page data layer
│   │   │   ├── pageDAL.ts        # Direct database operations
│   │   │   ├── pageService.ts    # Business logic (ownership, slug uniqueness)
│   │   │   └── index.ts
│   │   ├── users/                # User data layer
│   │   │   ├── userDAL.ts
│   │   │   ├── userService.ts
│   │   │   └── index.ts
│   │   ├── index.ts              # Combined exports
│   │   └── dummy.json            # Mock data
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   │   ├── analytics/           # PostHog integration
│   │   │   ├── events.ts        # Type-safe event definitions
│   │   │   ├── posthog-client.ts
│   │   │   ├── posthog-server.ts
│   │   │   └── index.ts
│   │   ├── animations/          # Framer Motion variants
│   │   │   └── variants.ts
│   │   ├── api/                 # API utilities
│   │   │   ├── auth.ts          # requireAuth, requireOwnership
│   │   │   ├── rate-limit.ts    # Rate limiting
│   │   │   ├── response.ts      # successResponse, errorResponse
│   │   │   ├── security.ts      # Security utilities
│   │   │   ├── validation.ts    # Zod validation helpers
│   │   │   └── index.ts
│   │   ├── auth.ts              # Legacy auth utilities
│   │   ├── errors.ts            # Error classes
│   │   ├── gallery-themes.ts    # Theme gallery data
│   │   ├── logger.ts            # Logging utilities
│   │   ├── mock-pages.ts        # Mock page data
│   │   ├── utils.ts             # General utilities
│   │   └── validate/            # Validation utilities
│   ├── middleware.ts            # Clerk authentication middleware
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore configuration
├── .prettierignore              # Prettier ignore configuration
├── .prettierrc.js               # Prettier configuration
├── CLAUDE.md                    # Claude-specific documentation
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Key Components

### Frontend

1. **Page Components** (`src/app/`):
   - `page.tsx`: Public landing page
   - `[username]/page.tsx`: Public user profile page (increments view count)
   - `login/[[...login]]/page.tsx`: Clerk authentication page
   - `(routes)/admin/page.tsx`: Admin dashboard
   - `(routes)/admin/pages/page.tsx`: Page management
   - `(routes)/admin/pages/[pageId]/links/page.tsx`: Link management for a page
   - `(routes)/admin/pages/[pageId]/themes/page.tsx`: Theme customization
   - `(routes)/admin/analytics/page.tsx`: Analytics dashboard

2. **UI Components** (`src/components/`):
   - `ui/`: shadcn/ui components with pixel variants (Button, Card, Badge, etc.)
   - `pixel-art/`: Custom pixel art components (PixelBorder, PixelIcon, PixelCorner, PixelDivider)
   - `animations/`: Framer Motion components (PageTransition, FadeIn, SlideUp, StaggerContainer, etc.)
   - `admin-*.tsx`: Admin-specific components
   - `public-page-component.tsx`: Public page display component

3. **API Routes** (`src/app/api/v1/`):
   - `health/route.ts`: Health check endpoint
   - `pages/route.ts`: GET (list), POST (create)
   - `pages/[pageId]/route.ts`: GET, PUT, DELETE
   - `pages/[pageId]/links/route.ts`: GET, POST for page links
   - `links/route.ts`: POST /reorder
   - `links/[linkId]/route.ts`: GET, PUT, DELETE
   - `webhooks/clerk/route.ts`: Clerk webhook handler

### Data Management

The application uses a three-tier data architecture:

1. **Database Client** (`src/data/db/client.ts`):
   - `DatabaseClient` interface for database abstraction
   - `DummyDatabaseClient` implementation using mock data
   - Designed to swap to Neon PostgreSQL via interface

2. **Data Access Layer (DAL)** (`src/data/*/*DAL.ts`):
   - Direct CRUD operations through `getDb()`
   - No business logic, just data operations
   - Examples: `pageDAL.ts`, `linkDAL.ts`, `userDAL.ts`

3. **Service Layer** (`src/data/*/*Service.ts`):
   - Business logic with ownership verification
   - Slug uniqueness checks
   - Link reordering logic
   - Examples: `pageService.ts`, `linkService.ts`, `userService.ts`

4. **Schemas** (`src/data/db/schema.ts`):
   - Zod schemas for User, Page, Link, Theme
   - Type inference from schemas
   - Validation schemas for create/update operations

### Server Actions (`src/actions/`)

- `pages.ts`: `createPageAction`, `updatePageAction`, `deletePageAction`
- `links.ts`: `createLinkAction`, `updateLinkAction`, `deleteLinkAction`, `reorderLinksAction`

### API Utilities (`src/lib/api/`)

- `auth.ts`: `requireAuth()`, `requireOwnership()`, `requirePageOwnership()`
- `response.ts`: `successResponse()`, `errorResponse()`, `ApiErrors`
- `validation.ts`: Zod schemas, `sanitizeText()`, `validateBody()`
- `rate-limit.ts`: In-memory rate limiter with configs
- `security.ts`: `getClientIp()`, `verifyOrigin()`, `isSafeRedirectUrl()`

### Analytics (`src/lib/analytics/`)

- `events.ts`: Type-safe event definitions
- `posthog-client.ts`: Client-side initialization, `trackEvent()`, `identifyUser()`
- `posthog-server.ts`: Server-side client for API routes
- `PostHogProvider` in layout for automatic page tracking

## Application Flow

1. **Public Flow**:
   - Users visit `/[username]` to view a public profile page
   - View count is incremented automatically
   - Links are displayed with click tracking

2. **Authentication Flow**:
   - Users visit `/login` for Clerk authentication
   - Middleware (`src/middleware.ts`) protects all routes except `/` and `/login`
   - Clerk webhook (`/api/webhooks/clerk`) syncs user data

3. **Admin Flow**:
   - Authenticated users access `/admin/*` routes
   - Admin sidebar layout provides navigation
   - Users can manage pages, links, themes, and view analytics

4. **Data Flow**:
   - Components call server actions or API routes
   - Server actions/API routes use service layer
   - Service layer uses DAL for database operations
   - All inputs validated with Zod schemas

## Common Patterns

1. **Next.js App Router**: File-based routing with route groups `(routes)`
2. **Three-Tier Data Architecture**: DAL → Service → Component/API
3. **Authentication**: Clerk middleware + `requireAuth()` in API routes
4. **Validation**: Zod schemas with XSS prevention via `sanitizeText()`
5. **Styling**: Tailwind CSS v4 with pixel art utilities and shadcn/ui components
6. **Animations**: Framer Motion with reusable variants
7. **Error Handling**: Standardized API responses with error codes
8. **Rate Limiting**: In-memory rate limiter with different configs

## Development Guidelines

1. **Adding New Components**:
   - Place reusable UI components in `src/components/ui/`
   - Pixel art components in `src/components/pixel-art/`
   - Animation components in `src/components/animations/`
   - Page-specific components co-located with pages

2. **Adding New Pages**:
   - Create files in `src/app/` following Next.js app router conventions
   - Admin pages go in `src/app/(routes)/admin/`
   - Use server components when possible

3. **Data Modifications**:
   - Define Zod schemas in `src/data/db/schema.ts`
   - Add DAL functions in `src/data/*/*DAL.ts`
   - Add service functions in `src/data/*/*Service.ts`
   - Use service layer for business logic

4. **API Routes**:
   - Create routes in `src/app/api/v1/`
   - Use `requireAuth()` for authentication
   - Use `successResponse()` and `errorResponse()` for responses
   - Apply rate limiting and input validation

5. **Server Actions**:
   - Create actions in `src/actions/`
   - Use service layer for data operations
   - Handle errors and return appropriate responses

6. **Style Modifications**:
   - Use Tailwind CSS utility classes
   - Pixel art utilities in `globals.css` (`.pixel-shadow`, `.pixel-border`, etc.)
   - shadcn/ui components with pixel variants

## Testing and Debugging

The codebase is set up with:
- `pnpm dev`: Starts the development server
- `pnpm build`: Production build
- `pnpm lint`: Run ESLint
- `pnpm scan`: Dev server with React Scan for performance analysis

Currently uses mock data from `src/dummy.json` via `DummyDatabaseClient`. Designed to swap to real database via `DatabaseClient` interface.

## Security Features

- **Headers**: Security headers configured in `next.config.mjs`
- **Rate Limiting**: In-memory rate limiter with configs (default, strict, lenient, analytics)
- **Input Validation**: Zod schemas with XSS prevention via `sanitizeText()`
- **Webhook Verification**: Svix signature verification for Clerk webhooks
- **Authentication**: Clerk middleware protecting routes
- **Ownership Verification**: Service layer checks resource ownership

## Conclusion

Link-It uses a modern, well-structured architecture with:
- Clear separation of concerns (DAL, Service, API/Components)
- Type-safe validation with Zod
- Authentication and authorization with Clerk
- Pixel art aesthetic with neobrutalism design
- Analytics integration with PostHog
- Smooth animations with Framer Motion

This architecture allows for easy maintenance, extension, and debugging while ensuring data integrity, security, and a great user experience.
