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
- **Validation**: Zod for type-safe schema validation
- **Development**: ESLint, Prettier, json-server

### Key Directories

- `src/app` - Next.js application pages
- `src/components` - Reusable React components
- `src/data` - Data access layer with Zod validation
- `src/types` - TypeScript type definitions
- `src/utils` - Utility functions

### Common Tasks

#### Adding a New Page

1. Create a new file in `src/app/` following Next.js app router conventions
2. If needed, create page-specific components
3. Connect to data sources using the data access layer

#### Adding a New Component

1. Create component in `src/components/ui/` for shared UI components
2. Follow the established patterns and coding standards
3. Use TypeScript for type safety

#### Working with Data

1. Use the functions provided in the data access layer (`src/data/`)
2. Add new data access functions for new features
3. Create Zod schemas for validation
4. Use safeParse for validation and error handling

## How to Use This Documentation

- Start with the [Codebase Structure](./codebase-structure.md) to understand the overall organization
- Use the [Data Flow](./data-flow.md) document to understand how components interact
- Reference the [Coding Standards](./coding-standards.md) when writing or refactoring code

These documents provide a comprehensive understanding of the codebase and will be invaluable for AI-assisted development, refactoring, and debugging. 