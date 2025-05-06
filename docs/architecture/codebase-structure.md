# LinkIt - Codebase Architecture Documentation

This document provides an overview of the LinkIt architecture, designed to help AI agents understand, refactor, write, or debug code within this project.

## Project Overview

LinkIt appears to be a link sharing application (similar to Linktree) where users can create a profile with multiple links to share. The application is built with Next.js, React, TypeScript, and TailwindCSS.

## Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Validation**: Zod for schema validation
- **Development Tools**: ESLint, Prettier
- **API Mocking**: json-server (for development)

## Directory Structure

```
linkIt/
├── docs/                    # Documentation
│   └── architecture/        # Architecture documentation
├── public/                  # Static assets 
├── src/                     # Source code
│   ├── app/                 # Next.js app router pages
│   │   ├── admin/           # Admin dashboard pages 
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Home page component
│   ├── components/          # Reusable React components
│   │   ├── ui/              # UI components
│   │   │   └── LinkButton.tsx  # Button component for links
│   │   ├── LinksList.tsx    # Component to display links
│   │   └── Navbar.tsx       # Navigation component
│   ├── data/                # Data layer
│   │   └── links.ts         # Links data access functions
│   ├── lib/                 # Utility libraries and shared code
│   │   └── validate.ts      # Validation schemas and utilities using Zod
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore configuration
├── .prettierignore         # Prettier ignore configuration
├── .prettierrc.js          # Prettier configuration
├── db.json                 # JSON Server mock database
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Components

### Frontend

1. **Page Components** (`src/app/`):
   - `page.tsx`: Main home page that displays user profile and links
   - `admin/page.tsx`: Admin dashboard for managing links
   - `admin/settings/`: User settings pages

2. **UI Components** (`src/components/`):
   - `ui/LinkButton.tsx`: Button component used for displaying links
   - `LinksList.tsx`: Component that fetches and displays links
   - `Navbar.tsx`: Navigation component

### Data Management

- `src/data/links.ts`: Data access layer with functions for CRUD operations
- `src/lib/validate.ts`: Validation schemas and utilities using Zod
  - Defines Zod schemas for all data entities
  - Exports types derived from schemas
  - Provides custom ValidationError class for error handling
- `db.json`: JSON Server mock database file for development

## Application Flow

1. Users can view their profile page with links (`src/app/page.tsx`)
2. Admin users can manage their links through the admin dashboard (`src/app/admin/page.tsx`)
3. The data layer validates inputs using Zod schemas from `src/lib/validate.ts`
4. Components handle validation errors using the ValidationError class

## Common Patterns

1. **Next.js App Router**: The project uses Next.js app router with the file-based routing system
2. **Component Structure**: UI components are organized in the `components/ui` directory
3. **Data Access**: Data functions in the `data/` directory provide a layer between components and data storage
4. **Validation**: Zod schemas in `lib/validate.ts` define data shapes and provide validation
5. **Styling**: TailwindCSS is used for styling with utility classes

## Development Guidelines

1. **Adding New Components**:
   - Place reusable UI components in `src/components/ui/`
   - Page-specific components should be co-located with their pages

2. **Adding New Pages**:
   - Create new files in `src/app/` directory according to Next.js app router conventions
   - For admin pages, add to `src/app/admin/`

3. **Data Modifications**:
   - Define new Zod schemas in `src/lib/validate.ts`
   - Add data types by using `z.infer<typeof YourSchema>`
   - Add or modify data functions in `src/data/` directory
   - Use validation schemas from `lib/validate.ts` in your data functions

4. **Style Modifications**:
   - Use TailwindCSS utility classes for styling
   - Global styles are in `src/app/globals.css`

## Testing and Debugging

The codebase appears to be set up with a development environment using:
- `npm run dev` or `pnpm dev`: Starts the development server
- `json-server`: Provides mock API endpoints during development

## Conclusions

LinkIt is a relatively straightforward Next.js application with a clear separation of concerns:
- UI components in `components/`
- Pages in `app/`
- Data validation in `lib/validate.ts`
- Data access in `data/`

This architecture allows for easy maintenance and extension of the application's features while ensuring data integrity through validation. 