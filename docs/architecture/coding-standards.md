# LinkIt - Coding Standards and Best Practices

This document outlines the coding standards, conventions, and best practices used in the LinkIt codebase. Following these guidelines ensures consistency and maintainability when refactoring, writing, and debugging code.

## TypeScript Guidelines

### Type Definitions

- Place shared types in the `src/types/` directory
- Use interfaces for object shapes and types for unions or primitives
- Prefer explicit typing over implicit (`any` is discouraged)

```typescript
// Good
interface User {
  id: string;
  username: string;
  email: string;
}

// Better: With readonly for immutable properties
interface User {
  readonly id: string;
  username: string;
  email: string;
}
```

### Type Safety

- Leverage TypeScript's type system to prevent runtime errors
- Use discriminated unions for state management
- Implement proper error handling with typed errors

```typescript
// Example of a discriminated union for API states
type ApiState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## React Component Guidelines

### Component Structure

- Use functional components with hooks
- Split large components into smaller, focused ones
- Co-locate related components in the same directory

```typescript
// Example component structure
export function LinkButton({ href, children, className }: LinkButtonProps) {
  // Component logic here
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
```

### Props

- Use destructuring for props
- Provide default values when appropriate
- Document complex props with JSDoc comments

```typescript
interface ButtonProps {
  /** The variant style of the button */
  variant?: 'primary' | 'secondary' | 'outline-solid';
  /** Handler for click events */
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary',
  onClick,
  children 
}: ButtonProps) {
  // Component implementation
}
```

### State Management

- Use appropriate hooks for state management:
  - `useState` for simple component state
  - `useReducer` for complex state logic
  - `useContext` for shared state

- Keep state as local as possible
- Lift state up when needed by multiple components

## Next.js Patterns

### Page Organization

- Use the App Router patterns for routing
- Keep route-specific components in the same directory as the page
- Implement error boundaries using error.tsx files

### Data Fetching

- Use server components when possible for data fetching
- Implement proper loading states and error handling
- Consider using React Suspense for loading states

## CSS and Styling Guidelines

### TailwindCSS Usage

- Follow utility-first approach with Tailwind
- Use consistent spacing and sizing scales
- Extract common patterns to components

```tsx
// Example of good Tailwind usage
<div className="flex flex-col gap-4 p-4 rounded-lg bg-white shadow-xs">
  <h2 className="text-xl font-bold text-gray-900">Section Title</h2>
  <p className="text-gray-700">Content goes here</p>
</div>
```

### Responsive Design

- Design for mobile-first, then enhance for larger screens
- Use Tailwind's responsive prefixes consistently (sm, md, lg, etc.)
- Test all components across various viewport sizes

## API and Data Handling

### API Calls

- Use tRPC for type-safe API communication
- Handle loading, success, and error states properly
- Implement proper error handling and user feedback

### Data Validation

- Validate all user inputs
- Sanitize data before displaying or storing it
- Use Zod or similar libraries for schema validation

## Testing Guidelines

### Component Testing

- Test components in isolation
- Test different states: initial, loading, success, error
- Test user interactions and state changes

### Integration Testing

- Test key user flows end-to-end
- Ensure components work together correctly
- Test edge cases and error scenarios

## Performance Optimization

### Code Splitting

- Use dynamic imports for large components
- Lazy load routes and components when appropriate
- Optimize bundle size by monitoring imports

### Rendering Optimization

- Use memoization for expensive computations
- Implement virtualization for long lists
- Optimize images using Next.js Image component

## Accessibility (a11y)

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Include appropriate ARIA attributes
- Maintain sufficient color contrast
- Test with screen readers

## Code Organization

### File Naming

- Use PascalCase for component files: `LinkButton.tsx`
- Use kebab-case for utility files: `date-utils.ts`
- Use index.ts files for clean exports

### Import Order

1. External libraries
2. Internal modules
3. Types
4. CSS/style imports

```typescript
// Example import order
import { useState } from 'react';
import { formatDate } from 'date-fns';

import { Button } from '@/components/ui/Button';
import { fetchData } from '@/lib/api';

import type { User } from '@/types';

import './styles.css';
```

## Error Handling

- Implement proper error boundaries
- Log errors appropriately
- Provide user-friendly error messages
- Handle network errors gracefully

## Documentation

- Add JSDoc comments for complex functions and components
- Document state management approaches
- Keep README and documentation up to date
- Document API endpoints and their usage

## Git Workflow

- Use descriptive commit messages
- Follow conventional commits pattern when possible
- Keep pull requests focused on single changes
- Review code thoroughly before merging

## Conclusion

Following these standards and best practices will ensure a consistent, maintainable, and high-quality codebase for the LinkIt application. These guidelines should be referenced when writing new code, refactoring existing code, or debugging issues. 