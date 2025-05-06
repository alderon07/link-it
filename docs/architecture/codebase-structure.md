# LinkIt - Codebase Architecture Documentation

This document provides an overview of the LinkIt architecture, designed to help AI agents understand, refactor, write, or debug code within this project.

## Project Overview

LinkIt appears to be a link sharing application (similar to Linktree) where users can create a profile with multiple links to share. The application is built with Next.js, React, TypeScript, and TailwindCSS.

## Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **Language**: TypeScript
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
│   │   └── Navbar.tsx       # Navigation component
│   ├── data/                # Data layer
│   │   ├── billing/         # Billing-related data
│   │   └── posts/           # Post-related data
│   ├── lib/                 # Utility libraries and shared code
│   ├── server/              # Server-side code
│   │   ├── api/             # API endpoints
│   │   │   └── trpc/        # tRPC API configuration
│   │   └── routers/         # API route handlers
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
   - `Navbar.tsx`: Navigation component

### Backend / API

The application appears to use tRPC for type-safe API routes:
- `src/server/api/trpc/`: tRPC API configuration
- `src/server/routers/`: API route handlers

### Data Management

- `src/data/`: Data access layer (likely contains data fetching logic)
- `db.json`: JSON Server mock database file for development

## Application Flow

1. Users can view their profile page with links (`src/app/page.tsx`)
2. Admin users can manage their links through the admin dashboard (`src/app/admin/page.tsx`)
3. The application likely uses tRPC for API communication between frontend and backend

## Common Patterns

1. **Next.js App Router**: The project uses Next.js app router with the file-based routing system
2. **Component Structure**: UI components are organized in the `components/ui` directory
3. **API Organization**: API routes appear to be organized through tRPC
4. **Styling**: TailwindCSS is used for styling with utility classes

## Development Guidelines

1. **Adding New Components**:
   - Place reusable UI components in `src/components/ui/`
   - Page-specific components should be co-located with their pages

2. **Adding New Pages**:
   - Create new files in `src/app/` directory according to Next.js app router conventions
   - For admin pages, add to `src/app/admin/`

3. **API Modifications**:
   - Add or modify API routes in `src/server/routers/`
   - Update types as needed in `src/types/`

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
- API routes in `server/`
- Data access in `data/`

This architecture allows for easy maintenance and extension of the application's features. 