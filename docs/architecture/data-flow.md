# LinkIt - Data Flow and Component Interactions

This document provides a detailed overview of how data flows through the LinkIt application, which is essential for refactoring, writing, and debugging code.

## Data Flow Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Client UI  │ ◄──► │  Data Layer │ ◄──► │  Data Store │
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

## Data Access Layer with Zod Validation

The application uses a data access layer with Zod for schema validation:

```
Component (e.g., LinksList)
  │
  ├── Calls data access function (e.g., getAllLinks())
  │   │
  │   └── Data function validates inputs with Zod
  │       │
  │       └── If valid, returns data
  │       └── If invalid, throws ValidationError
  │
  └── Renders UI based on data or displays validation errors
```

### Zod Schemas

The data layer uses Zod for type definitions and validation:

```typescript
// Define Zod schemas for validation
export const LinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
});

// Derive TypeScript types from schemas
export type Link = z.infer<typeof LinkSchema>;
```

### Data Access Functions

The data access layer in `src/data/links.ts` validates inputs using Zod schemas:

1. **Reading Data**:
   ```typescript
   // Example: Get all links
   const links = await getAllLinks();
   
   // Example: Get specific link with validation
   const link = await getLinkById(id); // Validates id
   ```

2. **Writing Data with Validation**:
   ```typescript
   // Example: Create a link with validation
   const validationResult = CreateLinkSchema.safeParse(data);
   if (!validationResult.success) {
     throw new ValidationError(validationResult.error);
   }
   
   // Proceed with creation if valid
   const newLink = { 
     id: String(links.length + 1),
     title: validationResult.data.title,
     url: validationResult.data.url,
   };
   ```

### Validation Error Handling

Components handle validation errors using dedicated error states:

```typescript
// In component
const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

// In try/catch block
try {
  // Call data function
} catch (err) {
  if (err instanceof ValidationError) {
    // Handle validation errors
    setValidationErrors(err.errors.flatten().fieldErrors);
  } else {
    // Handle other errors
    setError(err instanceof Error ? err : new Error('Error message'));
  }
}
```

## Data Flow Patterns

### 1. Profile & Links Display Flow (Home Page)

```
LinksList (src/components/LinksList.tsx)
  │
  ├── Calls getAllLinks() from data layer
  │   │
  │   └── Data layer fetches link data (currently mocked)
  │       │
  │       └── Returns link data
  │
  └── Renders LinkButton components for each link
```

The LinksList component fetches links data using the data access layer, displays a loading state while fetching, and renders LinkButton components once data is available.

### 2. Admin Dashboard Flow

```
Admin Page (src/app/admin/page.tsx)
  │
  ├── Fetches links with getAllLinks()
  │
  ├── Creates links with createLink()
  │   │
  │   └── Validates input with CreateLinkSchema
  │
  ├── Updates links with updateLink()
  │   │
  │   └── Validates input with UpdateLinkSchema
  │
  └── Deletes links with deleteLink()
      │
      └── Validates id parameter
```

The admin dashboard provides a complete CRUD interface for managing links, using data access functions for create, read, update, and delete operations, with validation at each step.

## State Management

The application leverages React's built-in state management for managing UI state:

1. **Remote Data Fetching** - Using useEffect and useState
   ```typescript
   const [links, setLinks] = useState<Link[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);
   const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

   useEffect(() => {
     async function fetchLinks() {
       try {
         setIsLoading(true);
         setValidationErrors({});
         const data = await getAllLinks();
         setLinks(data);
       } catch (err) {
         if (err instanceof ValidationError) {
           setValidationErrors(err.errors.flatten().fieldErrors);
         } else {
           setError(err instanceof Error ? err : new Error('Failed to load links'));
         }
       } finally {
         setIsLoading(false);
       }
     }

     fetchLinks();
   }, []);
   ```

2. **Form State** - Using useState for form inputs
   ```typescript
   const [newLink, setNewLink] = useState({ title: '', url: '' });
   ```

3. **UI State** - Managing UI state like editing mode
   ```typescript
   const [editingLink, setEditingLink] = useState<Link | null>(null);
   ```

## Data Entities

### Profile
- username
- bio
- avatar

### Link (defined using Zod schema)
- id: string
- title: string (min 1 char, max 100 chars)
- url: string (valid URL format)

## Key Data Interactions

1. **Fetching Links**: The application loads links using data access layer
   ```typescript
   const data = await getAllLinks();
   ```

2. **Creating Links**: The admin page creates links with validation
   ```typescript
   const createdLink = await createLink({ title, url });
   // Validates title and URL format
   ```

3. **Updating Links**: The admin page updates links with validation
   ```typescript
   const updatedLink = await updateLink({ id, title, url });
   // Validates id, title, and URL format
   ```

4. **Deleting Links**: The admin page deletes links with validation
   ```typescript
   const deletedLink = await deleteLink(id);
   // Validates id format
   ```

## Error Handling

1. **Validation Errors**:
   - Custom ValidationError class extends Error
   - Contains Zod error details
   - Components display field-specific error messages

2. **Client-Side Error Handling**:
   - Try/catch blocks around async operations
   - Error states stored in component state
   - UI displays appropriate error messages

3. **Graceful Degradation**:
   - Loading states during data operations
   - Error states for failed operations
   - Disabled buttons during operations

## Performance Considerations

1. **Local State Management**:
   - Optimistic UI updates for better user experience
   - Local state updates before server confirmation

2. **Efficient Rendering**:
   - Conditional rendering based on state
   - Loading skeletons for better user experience

3. **Image Optimization**:
   - Next.js Image component for optimized image loading

## Development and Debugging Guidelines

1. **Component Testing**:
   - Verify component state with sample data
   - Test loading, error, and validation error states

2. **Data Flow Debugging**:
   - Use console.log in data access functions to trace data flow
   - Check validation results with console.log
   - Verify state updates after data operations

3. **Validation Debugging**:
   - Check Zod schema definitions for correctness
   - Verify error messages in validation errors
   - Test edge cases for validation

## Expansion Guidelines

When adding new features:

1. **New Data Entities**:
   - Define Zod schemas for new entities
   - Derive TypeScript types using z.infer<>
   - Implement CRUD operations with validation

2. **New Data Operations**:
   - Add new functions to existing data modules
   - Add appropriate Zod schemas
   - Implement validation using safeParse
   - Handle validation errors consistently

3. **New UI Components**:
   - Connect to data using the data access layer
   - Handle loading, error, and validation error states
   - Implement local state for optimistic updates 