# LinkIt - Data Flow and Component Interactions

This document provides a detailed overview of how data flows through the LinkIt application, which is essential for refactoring, writing, and debugging code.

## Data Flow Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Client UI  │ ◄──► │  Server API │ ◄──► │  Data Store │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Component Hierarchy

```
Layout (src/app/layout.tsx)
├── Navbar (src/components/Navbar.tsx)
└── Page Components
    ├── Home Page (src/app/page.tsx)
    │   └── LinksList (src/components/LinksList.tsx)
    │       └── LinkButton (src/components/ui/LinkButton.tsx)
    └── Admin Page (src/app/admin/page.tsx)
```

## tRPC Data Flow

tRPC provides type-safe API communication between the client and server:

```
Client Component                            Server
┌───────────────────┐                      ┌───────────────────┐
│                   │                      │                   │
│  trpc.procedure   │  HTTP Request        │  Router/Procedure │
│  .useQuery()      │ ─────────────────►  │  Handler          │
│  .useMutation()   │                      │                   │
│                   │  HTTP Response       │                   │
│                   │ ◄─────────────────  │                   │
└───────────────────┘                      └───────────────────┘
```

### tRPC Client Usage

1. **Queries** - For fetching data:
   ```typescript
   // Example from LinksList.tsx
   const { data: links, isLoading, error } = trpc.links.getAll.useQuery();
   ```

2. **Mutations** - For changing data:
   ```typescript
   // Example from admin/page.tsx
   const addLinkMutation = trpc.links.create.useMutation({
     onSuccess: () => {
       setNewLink({ title: '', url: '' });
       utils.links.getAll.invalidate();
     },
   });
   
   // Using the mutation
   addLinkMutation.mutate(newLink);
   ```

3. **Utils** - For invalidating queries:
   ```typescript
   const utils = trpc.useUtils();
   
   // Invalidate cache to refresh data
   utils.links.getAll.invalidate();
   ```

### tRPC Server Implementation

1. **Procedures** - Defined in routers:
   ```typescript
   // Example from links router
   export const linksRouter = router({
     getAll: publicProcedure.query(() => {
       return dummyLinks;
     }),
     
     create: protectedProcedure
       .input(z.object({
         title: z.string().min(1).max(100),
         url: z.string().url(),
       }))
       .mutation(({ input }) => {
         // Create and return a new link
       }),
   });
   ```

2. **Input Validation** - Using Zod schemas:
   ```typescript
   .input(z.object({
     title: z.string().min(1).max(100),
     url: z.string().url(),
   }))
   ```

3. **Context** - For shared resources:
   ```typescript
   export const createTRPCContext = async () => {
     return {
       // Resources like database connections
     };
   };
   ```

## Data Flow Patterns

### 1. Profile & Links Display Flow (Home Page)

```
LinksList (src/components/LinksList.tsx)
  │
  ├── Calls trpc.links.getAll.useQuery()
  │   │
  │   └── Makes HTTP request to /api/trpc/links.getAll
  │       │
  │       └── Server processes in links router getAll procedure
  │           │
  │           └── Returns link data
  │
  └── Renders LinkButton components for each link
```

The LinksList component fetches links data using tRPC, displays a loading state while fetching, and renders LinkButton components once data is available.

### 2. Admin Dashboard Flow

```
Admin Page (src/app/admin/page.tsx)
  │
  ├── Fetches links with trpc.links.getAll.useQuery()
  │
  ├── Creates links with trpc.links.create.useMutation()
  │
  ├── Updates links with trpc.links.update.useMutation()
  │
  └── Deletes links with trpc.links.delete.useMutation()
```

The admin dashboard provides a complete CRUD interface for managing links, using tRPC mutations for create, update, and delete operations.

## State Management

The application leverages multiple approaches to state management:

1. **Server State** - Managed through TanStack Query (via tRPC)
   - Handles data fetching, caching, and synchronization
   - Provides loading, error, and success states
   - Automatic background refetching

2. **Local Component State** - Managed through React's useState hook
   - Form inputs and UI state
   - Temporary data before submission
   
3. **Global State** - No dedicated global state is used yet, as TanStack Query and tRPC handle most state needs

## Data Entities

### Profile
- username
- bio
- avatar

### Link
- id
- title
- url

## Key Data Interactions

1. **Fetching Links**: The application loads links using tRPC query
   ```typescript
   const { data: links } = trpc.links.getAll.useQuery();
   ```

2. **Creating Links**: The admin page creates links using tRPC mutation
   ```typescript
   addLinkMutation.mutate({ title, url });
   ```

3. **Updating Links**: The admin page updates links using tRPC mutation
   ```typescript
   updateLinkMutation.mutate({ id, title, url });
   ```

4. **Deleting Links**: The admin page deletes links using tRPC mutation
   ```typescript
   deleteLinkMutation.mutate({ id });
   ```

## Error Handling

1. **Client-Side Error Handling**:
   - Query errors are captured in the error state from useQuery
   - UI displays appropriate error messages
   - Mutation errors are handled in the onError callback

2. **Server-Side Error Handling**:
   - tRPC procedures use try/catch blocks for error handling
   - Errors are passed back to the client with appropriate status codes
   - Zod validation provides automatic input validation

## Performance Considerations

1. **Query Caching**:
   - TanStack Query automatically caches query results
   - Prevents unnecessary re-fetching
   - Enables optimistic UI updates

2. **Optimistic Updates**:
   - Mutation responses update cache immediately
   - Provides better user experience

3. **Query Invalidation**:
   - After mutations, related queries are invalidated
   - Ensures data consistency between API calls

## Development and Debugging Guidelines

1. **Component Testing**:
   - Verify query and mutation hooks with mock data
   - Test loading, error, and success states

2. **API Debugging**:
   - Use browser developer tools to inspect network requests
   - Verify payload matches expected schema
   - Check that error handling properly passes errors to the client

3. **Data Flow Debugging**:
   - Use React DevTools to inspect component state
   - Use TanStack Query DevTools to monitor query status (if enabled)
   - Add debugging logs in tRPC procedures for server-side issues

## Expansion Guidelines

When adding new features:

1. **New Data Entities**:
   - Add type definitions in `src/types/`
   - Create a new tRPC router in `src/server/api/routers/`
   - Add the router to the root router in `src/server/api/root.ts`

2. **New API Features**:
   - Add new procedures to existing routers
   - Use Zod for input validation
   - Implement proper error handling

3. **New UI Components**:
   - Connect to data using tRPC hooks
   - Handle loading, error, and empty states
   - Implement proper optimistic updates for mutations 