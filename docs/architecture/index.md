# LinkIt - Architecture Documentation

This index provides navigation to all architecture documentation for the LinkIt project. These documents are designed to help AI agents understand, refactor, write, and debug code recursively within the codebase.

## Available Documentation

1. [**Codebase Structure**](./codebase-structure.md) - Overview of the project's directory structure and key components
2. [**Data Flow**](./data-flow.md) - Documentation of how data flows through the application and component interactions
3. [**Coding Standards**](./coding-standards.md) - Coding conventions and best practices for maintaining and extending the codebase

## Quick Reference

### Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Language**: TypeScript
- **API**: tRPC (Type-safe API)
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **Data Serialization**: SuperJSON
- **Development**: ESLint, Prettier, json-server

### Key Directories

- `src/app` - Next.js application pages
- `src/components` - Reusable React components
- `src/data` - Data access layer
- `src/server` - Server-side code and API endpoints
  - `src/server/api/trpc` - tRPC configuration
  - `src/server/api/routers` - tRPC routers
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions
  - `src/utils/trpc.tsx` - tRPC client setup

### tRPC Configuration

The project uses tRPC for type-safe API communication:

1. **Server Configuration**:
   - `src/server/api/trpc/trpc.ts` - Core tRPC setup
   - `src/server/api/root.ts` - Root router
   - `src/server/api/routers/*.ts` - API routers for specific features

2. **Client Configuration**:
   - `src/utils/trpc.tsx` - tRPC client setup
   - `src/app/api/trpc/[trpc]/route.ts` - API handler for Next.js

3. **Usage in Components**:
   - Queries: `const { data, isLoading } = trpc.namespace.procedure.useQuery()`
   - Mutations: `const mutation = trpc.namespace.procedure.useMutation()`

### Common Tasks

#### Adding a New Page

1. Create a new file in `src/app/` following Next.js app router conventions
2. If needed, create page-specific components
3. Connect to data sources as needed using tRPC queries

#### Adding a New Component

1. Create component in `src/components/ui/` for shared UI components
2. Follow the established patterns and coding standards
3. Use TypeScript for type safety

#### Adding a New API Endpoint

1. Define a new procedure in an existing router (e.g., `src/server/api/routers/links.ts`)
2. Or create a new router file and add it to the root router in `src/server/api/root.ts`
3. Use Zod schemas for input validation
4. Update corresponding types in `src/types/`

## How to Use This Documentation

- Start with the [Codebase Structure](./codebase-structure.md) to understand the overall organization
- Use the [Data Flow](./data-flow.md) document to understand how components interact
- Reference the [Coding Standards](./coding-standards.md) when writing or refactoring code

These documents provide a comprehensive understanding of the codebase and will be invaluable for AI-assisted development, refactoring, and debugging. 