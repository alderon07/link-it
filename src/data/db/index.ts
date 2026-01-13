/**
 * Database module exports
 */

// Database client
export { getDb, resetDb, dummyDatabaseClient } from "./client"
export type { DatabaseClient } from "./client"

// Schemas and types
export {
  // User
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  // Page
  PageSchema,
  CreatePageSchema,
  UpdatePageSchema,
  // Link
  LinkSchema,
  CreateLinkSchema,
  UpdateLinkSchema,
  // Theme
  ThemeSchema,
  CreateThemeSchema,
  // Tag
  TagSchema,
  // Pagination
  PaginationSchema,
  SortOrderSchema,
} from "./schema"

export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  Page,
  CreatePageInput,
  UpdatePageInput,
  Link,
  CreateLinkInput,
  UpdateLinkInput,
  Theme,
  CreateThemeInput,
  Tag,
  PaginationInput,
  SortOrder,
  PaginatedResult,
} from "./schema"
