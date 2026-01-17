# Link-It - Codebase Architecture Documentation

This document provides an overview of the Link-It architecture, designed to help AI agents understand, refactor, write, or debug code within this project.

## Project Overview

Link-It is a "link in bio" application (similar to Linktree) where users can create personalized pages with collections of links. The application features a modern pixel art aesthetic with neobrutalism accents. Users can create multiple identities (pages), customize themes, manage links, and view analytics. The application is built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Convex for real-time data management.

## Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Language**: TypeScript
- **Backend**: Convex (real-time database with reactive queries)
- **Authentication**: Clerk (integrated with Convex via JWT)
- **Validation**: Zod for schema validation
- **Analytics**: PostHog
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Development Tools**: ESLint, Prettier

## Directory Structure

```
link-it/
├── convex/                        # Convex backend functions
│   ├── _generated/                # Auto-generated types (don't edit)
│   ├── analytics/                 # Analytics queries
│   │   └── queries.ts
│   ├── identities/               # Identity (page) operations
│   │   ├── queries.ts            # Authenticated queries
│   │   ├── mutations.ts          # CRUD mutations
│   │   └── public.ts             # Public queries (no auth)
│   ├── links/                    # Link operations
│   │   ├── queries.ts            # Authenticated queries
│   │   ├── mutations.ts          # CRUD mutations
│   │   └── public.ts             # Public queries (no auth)
│   ├── themes/                   # Theme operations
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── users/                    # User operations
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── internal.ts           # Webhook-only functions
│   ├── settings/                 # User settings
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── lib/                      # Convex utilities
│   │   ├── utils.ts              # Helpers (slug generation, etc.)
│   │   └── validators.ts         # Validation logic
│   ├── schema.ts                 # Database schema definition
│   ├── auth.config.ts            # Clerk JWT configuration
│   ├── http.ts                   # HTTP routes (Clerk webhook)
│   ├── seed.ts                   # Database seeding
│   └── seedAll.ts                # Full database seeding
├── docs/                         # Documentation
│   └── architecture/             # Architecture documentation
├── plans/                        # Implementation plans
├── public/                       # Static assets
├── src/                          # Source code
│   ├── app/                      # Next.js app router
│   │   ├── (routes)/             # Route groups
│   │   │   └── admin/            # Protected admin routes
│   │   │       ├── analytics/    # Analytics dashboard
│   │   │       ├── identities/   # Identity management
│   │   │       │   └── [identityId]/
│   │   │       │       ├── links/    # Identity-specific links
│   │   │       │       └── themes/  # Theme customization
│   │   │       ├── links/        # Global links management
│   │   │       ├── layout.tsx    # Admin layout with sidebar
│   │   │       └── page.tsx     # Admin dashboard
│   │   ├── [username]/           # Public user profile pages
│   │   ├── api/                  # API routes
│   │   │   └── v1/               # API v1 endpoints
│   │   │       └── health/       # Health check
│   │   ├── login/                # Clerk authentication
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout (with ConvexProvider)
│   │   ├── page.tsx              # Landing page
│   │   └── not-found.tsx        # 404 page
│   ├── components/               # React components
│   │   ├── animations/           # Framer Motion components
│   │   ├── pixel-art/            # Pixel art styled components
│   │   ├── providers/            # Context providers
│   │   │   ├── ConvexClientProvider.tsx
│   │   │   └── PostHogProvider.tsx
│   │   ├── convex/               # Convex-powered components
│   │   │   ├── IdentityManager.tsx
│   │   │   ├── IdentityLinksManager.tsx
│   │   │   ├── IdentityThemeManager.tsx
│   │   │   ├── IdentityThemeGallery.tsx
│   │   │   ├── IdentityThemeEditor.tsx
│   │   │   ├── PublicIdentityComponent.tsx
│   │   │   └── index.ts
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-sidebar.tsx
│   │   ├── analytics-dashboard.tsx
│   │   ├── global-links-manager.tsx
│   │   ├── home.tsx
│   │   ├── page-header.tsx
│   │   ├── public-identity-page.tsx
│   │   └── ReactScan.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── convex/               # Convex hooks
│   │   │   ├── useUser.ts
│   │   │   ├── useIdentities.ts
│   │   │   ├── useLinks.ts
│   │   │   ├── useThemes.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useSettings.ts
│   │   │   └── index.ts
│   │   └── use-mobile.ts
│   ├── lib/                      # Utility libraries
│   │   ├── analytics/            # PostHog integration
│   │   │   ├── events.ts         # Type-safe event definitions
│   │   │   ├── posthog-client.ts
│   │   │   ├── posthog-server.ts
│   │   │   └── index.ts
│   │   ├── animations/            # Framer Motion variants
│   │   │   └── variants.ts
│   │   ├── auth.ts               # Legacy auth utilities
│   │   ├── errors.ts             # Error classes
│   │   ├── gallery-themes.ts     # Theme gallery data
│   │   ├── logger.ts             # Logging utilities
│   │   ├── utils.ts              # General utilities
│   │   └── validate/             # Validation utilities
│   ├── middleware.ts             # Clerk authentication middleware
│   └── utils/                    # Utility functions
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore configuration
├── .prettierignore               # Prettier ignore configuration
├── .prettierrc.js                # Prettier configuration
├── CLAUDE.md                     # Claude-specific documentation
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.mjs            # PostCSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Components

### Frontend

1. **Page Components** (`src/app/`):
   - `page.tsx`: Public landing page
   - `[username]/page.tsx`: Public user profile page (uses Convex public queries)
   - `login/[[...login]]/page.tsx`: Clerk authentication page
   - `(routes)/admin/page.tsx`: Admin dashboard
   - `(routes)/admin/identities/page.tsx`: Identity management
   - `(routes)/admin/identities/[identityId]/links/page.tsx`: Link management for an identity
   - `(routes)/admin/identities/[identityId]/themes/page.tsx`: Theme customization
   - `(routes)/admin/analytics/page.tsx`: Analytics dashboard
   - `(routes)/admin/links/page.tsx`: Global links management

2. **UI Components** (`src/components/`):
   - `ui/`: shadcn/ui components with pixel variants (Button, Card, Badge, etc.)
   - `pixel-art/`: Custom pixel art components (PixelBorder, PixelIcon, PixelCorner, PixelDivider)
   - `animations/`: Framer Motion components (PageTransition, FadeIn, SlideUp, StaggerContainer, etc.)
   - `convex/`: Convex-powered components using `useQuery` and `useMutation`
   - `admin-*.tsx`: Admin-specific components
   - `public-identity-page.tsx`: Public identity display component

3. **API Routes** (`src/app/api/v1/`):
   - `health/route.ts`: Health check endpoint (minimal API routes, most data via Convex)

### Backend (Convex)

The application uses Convex for all data operations with real-time reactivity:

1. **Schema** (`convex/schema.ts`):
   - Defines all database tables: `users`, `identities`, `links`, `themes`, `tags`, `linkTags`, `identityCollaborators`, `identityViews`, `linkClicks`, `userSettings`, `userProgress`, `auditLogs`
   - Uses Convex's type-safe schema definitions
   - Indexes for efficient queries

2. **Queries** (`convex/*/queries.ts`):
   - Read-only operations that return data
   - Can be public (no auth) or authenticated
   - Automatically reactive - components re-render when data changes
   - Examples: `getUserIdentities`, `getIdentity`, `getIdentityLinks`, `getPublicIdentityByUsername`

3. **Mutations** (`convex/*/mutations.ts`):
   - Write operations that modify data
   - Always authenticated (except internal webhook functions)
   - Examples: `createIdentity`, `updateIdentity`, `deleteIdentity`, `createLink`, `reorderLinks`

4. **Public Functions** (`convex/*/public.ts`):
   - Public queries that don't require authentication
   - Used for public-facing pages
   - Examples: `getPublicIdentityByUsername`, `getPublicIdentityLinks`, `recordIdentityView`, `trackLinkClick`

5. **Internal Functions** (`convex/*/internal.ts`):
   - Functions only callable from HTTP routes (webhooks)
   - Used for Clerk webhook integration
   - Example: `createUserFromClerk` in `users/internal.ts`

### React Hooks (`src/hooks/convex/`)

Custom hooks that wrap Convex queries and mutations:

- `useUser.ts`: User-related hooks (`useCurrentUser`, `useUserByUsername`, etc.)
- `useIdentities.ts`: Identity hooks (`useUserIdentities`, `useIdentity`, `useSlugAvailable`, etc.)
- `useLinks.ts`: Link hooks (`useIdentityLinks`, `useLink`, `useLinkMutations`, etc.)
- `useThemes.ts`: Theme hooks (`useTheme`, `useSystemThemes`, `useAllThemes`, etc.)
- `useAnalytics.ts`: Analytics hooks (`useDashboardStats`, `useIdentityAnalytics`, etc.)
- `useSettings.ts`: Settings hooks (`useUserSettings`, `useUserProgress`, etc.)

### Convex Components (`src/components/convex/`)

Components that use Convex hooks for real-time data:

- `IdentityManager.tsx`: Manage identities (create, edit, delete)
- `IdentityLinksManager.tsx`: Manage links for an identity
- `IdentityThemeManager.tsx`: Theme management interface
- `IdentityThemeGallery.tsx`: Browse and apply themes
- `IdentityThemeEditor.tsx`: Custom theme editor
- `PublicIdentityComponent.tsx`: Display public identity page

## Application Flow

1. **Public Flow**:
   - Users visit `/[username]` to view a public identity page
   - Component uses `useQuery(api.identities.public.getPublicIdentityByUsername)`
   - View count is incremented via `useMutation(api.identities.public.recordIdentityView)`
   - Links are displayed with real-time click tracking

2. **Authentication Flow**:
   - Users visit `/login` for Clerk authentication
   - Middleware (`src/middleware.ts`) protects all routes except `/` and `/login`
   - Clerk webhook (`convex/http.ts`) syncs user data to Convex
   - ConvexProvider in layout passes Clerk JWT to Convex

3. **Admin Flow**:
   - Authenticated users access `/admin/*` routes
   - Admin sidebar layout provides navigation
   - Components use Convex hooks for real-time data
   - Users can manage identities, links, themes, and view analytics
   - All changes are reactive - updates appear instantly across tabs

4. **Data Flow**:
   - Components use `useQuery()` for reading data (reactive)
   - Components use `useMutation()` for writing data
   - Convex handles all database operations
   - Real-time subscriptions automatically update UI when data changes
   - All inputs validated with Zod schemas in Convex validators

## Common Patterns

1. **Next.js App Router**: File-based routing with route groups `(routes)`
2. **Convex Real-Time Architecture**: `useQuery` → Convex Query → Reactive Updates
3. **Authentication**: Clerk middleware + Convex JWT verification
4. **Validation**: Zod schemas in Convex validators
5. **Styling**: Tailwind CSS v4 with pixel art utilities and shadcn/ui components
6. **Animations**: Framer Motion with reusable variants
7. **Error Handling**: ConvexError with standardized error codes
8. **Real-Time Updates**: Automatic UI updates via Convex subscriptions

## Development Guidelines

1. **Adding New Components**:
   - Place reusable UI components in `src/components/ui/`
   - Pixel art components in `src/components/pixel-art/`
   - Animation components in `src/components/animations/`
   - Convex-powered components in `src/components/convex/`
   - Page-specific components co-located with pages

2. **Adding New Pages**:
   - Create files in `src/app/` following Next.js app router conventions
   - Admin pages go in `src/app/(routes)/admin/`
   - Use client components with Convex hooks for data fetching

3. **Adding New Data Operations**:
   - Add queries in `convex/[resource]/queries.ts`
   - Add mutations in `convex/[resource]/mutations.ts`
   - Add public functions in `convex/[resource]/public.ts` if needed
   - Create custom hooks in `src/hooks/convex/use[Resource].ts`
   - Use hooks in components for type-safe, reactive data

4. **Adding New Tables**:
   - Define table in `convex/schema.ts`
   - Add indexes for efficient queries
   - Create queries/mutations in appropriate folder
   - Update types are auto-generated from schema

5. **Style Modifications**:
   - Use Tailwind CSS utility classes
   - Pixel art utilities in `globals.css` (`.pixel-shadow`, `.pixel-border`, etc.)
   - shadcn/ui components with pixel variants

## Testing and Debugging

The codebase is set up with:
- `pnpm dev`: Starts Next.js development server
- `pnpm dev:convex`: Starts both Next.js and Convex dev servers
- `pnpm convex:dev`: Starts only Convex dev server
- `pnpm build`: Production build
- `pnpm lint`: Run ESLint
- `pnpm scan`: Dev server with React Scan for performance analysis

Uses Convex for all data operations with real-time reactivity. Data is stored in Convex cloud database.

## Security Features

- **Authentication**: Clerk middleware protecting routes + Convex JWT verification
- **Authorization**: Convex queries/mutations verify user ownership
- **Input Validation**: Zod schemas in Convex validators
- **Webhook Verification**: Svix signature verification for Clerk webhooks in `convex/http.ts`
- **Real-Time Security**: Convex automatically handles auth token validation

## Key Terminology

- **Identity**: A user's "link in bio" page (previously called "page")
- **Link**: A single link item on an identity
- **Theme**: Color scheme and styling for an identity
- **Query**: Read-only Convex function that returns data (reactive)
- **Mutation**: Write Convex function that modifies data
- **Public Function**: Convex function that doesn't require authentication

## Conclusion

Link-It uses a modern, real-time architecture with:
- Convex for reactive data management
- Type-safe queries and mutations
- Automatic real-time UI updates
- Authentication and authorization with Clerk
- Pixel art aesthetic with neobrutalism design
- Analytics integration with PostHog
- Smooth animations with Framer Motion

This architecture provides instant updates across all clients, type safety throughout the stack, and a great developer experience with minimal boilerplate.
