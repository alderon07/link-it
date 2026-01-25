# Codebase Structure

## Directory Layout

```
link-it/
├── convex/                        # Convex backend
│   ├── _generated/                # Auto-generated (don't edit)
│   ├── [resource]/                # Per-resource folders
│   │   ├── queries.ts             # Authenticated queries
│   │   ├── mutations.ts           # CRUD mutations
│   │   └── public.ts              # Public queries (no auth)
│   ├── lib/                       # Utilities, validators
│   ├── schema.ts                  # Database schema
│   └── http.ts                    # HTTP routes (webhooks)
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (routes)/admin/        # Protected admin routes
│   │   ├── [username]/            # Public profile pages
│   │   ├── login/                 # Clerk auth
│   │   └── page.tsx               # Landing page
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── pixel-art/             # Pixel art components
│   │   ├── animations/            # Framer Motion components
│   │   ├── convex/                # Convex-powered components
│   │   └── providers/             # Context providers
│   │
│   ├── hooks/convex/              # Custom Convex hooks
│   │   ├── useIdentities.ts
│   │   ├── useLinks.ts
│   │   ├── useThemes.ts
│   │   └── index.ts               # Barrel export
│   │
│   ├── lib/
│   │   ├── analytics/             # PostHog integration
│   │   └── animations/            # Framer Motion variants
│   │
│   └── proxy.ts                   # Clerk auth proxy
│
└── docs/architecture/             # This documentation
```

## Key Files

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Database tables and indexes |
| `src/proxy.ts` | Route protection |
| `src/app/layout.tsx` | Root layout with providers |
| `src/components/providers/ConvexClientProvider.tsx` | Convex + Clerk JWT |

## Resource Naming

| Resource | Convex Path | Hooks |
|----------|-------------|-------|
| Users | `convex/users/` | `useCurrentUser` |
| Identities | `convex/identities/` | `useUserIdentities`, `useIdentity` |
| Links | `convex/links/` | `useIdentityLinks`, `useLinkMutations` |
| Themes | `convex/themes/` | `useTheme`, `useAllThemes` |
| Analytics | `convex/analytics/` | `useDashboardStats` |
