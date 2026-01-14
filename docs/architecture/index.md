# Link-It - Architecture Documentation

This index provides navigation to all architecture documentation for the Link-It project. These documents are designed to help AI agents understand, refactor, write, and debug code recursively within the codebase.

## Available Documentation

1. [**Codebase Structure**](./codebase-structure.md) - Overview of the project's directory structure and key components
2. [**Data Flow**](./data-flow.md) - Documentation of how data flows through the application and component interactions
3. [**Coding Standards**](./coding-standards.md) - Coding conventions and best practices for maintaining and extending the codebase

## Quick Reference

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Validation**: Zod for type-safe schema validation
- **Analytics**: PostHog
- **Animations**: Framer Motion
- **Toasts**: Sonner
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

### Key Directories

- `src/app` - Next.js application pages and API routes
- `src/components` - Reusable React components (UI, pixel-art, animations, admin)
- `src/data` - Three-tier data access layer (DAL, Service, Schema)
- `src/lib` - Utility libraries (API helpers, analytics, animations, validation)
- `src/actions` - Server actions for form handling
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions
- `src/hooks` - Custom React hooks
- `src/middleware.ts` - Clerk authentication middleware

### Common Tasks

#### Adding a New Page

1. Create a new file in `src/app/` following Next.js app router conventions
2. If it's an admin page, place it in `src/app/(routes)/admin/`
3. If needed, create page-specific components in `src/components/`
4. Connect to data sources using the data access layer (`src/data/`)
5. Use server actions (`src/actions/`) for form submissions

#### Adding a New Component

1. Create component in `src/components/ui/` for shared UI components
2. Use `src/components/pixel-art/` for pixel art styled components
3. Use `src/components/animations/` for animated components
4. Follow the established patterns and coding standards
5. Use TypeScript for type safety

#### Working with Data

1. Use the three-tier architecture:
   - **DAL** (`*DAL.ts`): Direct database operations
   - **Service** (`*Service.ts`): Business logic with ownership verification
   - **Schema** (`src/data/db/schema.ts`): Zod schemas for validation
2. Add new data access functions for new features
3. Create Zod schemas in `src/data/db/schema.ts`
4. Use the service layer for business logic (ownership checks, validation)

#### Adding API Routes

1. Create routes in `src/app/api/v1/` following REST conventions
2. Use `requireAuth()` from `@/lib/api/auth` for authentication
3. Use `successResponse()` and `errorResponse()` from `@/lib/api/response`
4. Apply rate limiting using `rateLimit()` from `@/lib/api/rate-limit`
5. Validate inputs using Zod schemas and `validateBody()` from `@/lib/api/validation`

## How to Use This Documentation

- Start with the [Codebase Structure](./codebase-structure.md) to understand the overall organization
- Use the [Data Flow](./data-flow.md) document to understand how components interact
- Reference the [Coding Standards](./coding-standards.md) when writing or refactoring code

These documents provide a comprehensive understanding of the codebase and will be invaluable for AI-assisted development, refactoring, and debugging. 