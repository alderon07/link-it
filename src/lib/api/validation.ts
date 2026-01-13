import { z } from "zod"
import { ApiErrors } from "./response"

/**
 * Validation error that can be thrown and caught by error handler
 */
export class ValidationError extends Error {
  response: ReturnType<typeof ApiErrors.validationError>

  constructor(message: string, details?: unknown) {
    super(message)
    this.response = ApiErrors.validationError(message, details)
  }
}

// ============================================
// Text Sanitization
// ============================================

/**
 * Basic HTML entity encoding for XSS prevention
 * Escapes: & < > " ' /
 */
function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return str.replace(/[&<>"'/]/g, (char) => escapeMap[char])
}

/**
 * Strip all HTML tags from a string
 */
function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, "")
}

/**
 * Sanitize text input to prevent XSS attacks.
 * Strips all HTML tags.
 */
export function sanitizeText(input: string): string {
  return stripHtmlTags(input).trim()
}

/**
 * Sanitize HTML while escaping potentially dangerous content.
 * For API inputs, we strip tags - use client-side DOMPurify for rich HTML.
 */
export function sanitizeHtml(input: string): string {
  // For server-side API validation, strip all tags for safety
  // Client components can use DOMPurify for rich text rendering
  return stripHtmlTags(input).trim()
}

// ============================================
// Common Zod Schemas
// ============================================

/**
 * Safe URL schema that validates and prevents javascript: URLs
 */
export const SafeUrlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url)
        return ["http:", "https:"].includes(parsed.protocol)
      } catch {
        return false
      }
    },
    "Only HTTP and HTTPS URLs are allowed"
  )
  .refine(
    (url) => !url.toLowerCase().includes("javascript:"),
    "JavaScript URLs are not allowed"
  )

/**
 * Slug schema for URL-friendly identifiers
 */
export const SlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(30, "Slug cannot exceed 30 characters")
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/,
    "Slug can only contain lowercase letters, numbers, and hyphens (no leading/trailing hyphens)"
  )
  .refine(
    (slug) =>
      ![
        "admin",
        "api",
        "login",
        "signup",
        "settings",
        "profile",
        "dashboard",
        "help",
        "about",
        "terms",
        "privacy",
        "static",
        "_next",
      ].includes(slug),
    "This slug is reserved"
  )

/**
 * Username schema (alias for SlugSchema with different error messages)
 */
export const UsernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username cannot exceed 20 characters")
  .regex(
    /^[a-z0-9][a-z0-9_]*[a-z0-9]$|^[a-z0-9]$/,
    "Username can only contain lowercase letters, numbers, and underscores"
  )
  .refine(
    (username) =>
      !["admin", "api", "system", "support", "help", "info"].includes(username),
    "This username is reserved"
  )

/**
 * Email schema with validation
 */
export const EmailSchema = z.string().email("Invalid email address").max(255)

/**
 * Positive integer ID schema
 */
export const IdSchema = z
  .number()
  .int("ID must be an integer")
  .positive("ID must be positive")

/**
 * String ID schema (for UUIDs or string-based IDs)
 */
export const StringIdSchema = z.string().min(1, "ID is required").max(100)

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/**
 * Sort order schema
 */
export const SortOrderSchema = z.enum(["asc", "desc"]).default("desc")

// ============================================
// Page Schemas
// ============================================

export const CreatePageSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .transform(sanitizeText),
  slug: SlugSchema,
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .transform((v) => (v ? sanitizeText(v) : undefined)),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .transform((v) => (v ? sanitizeText(v) : undefined)),
  is_public: z.boolean().default(true),
  avatar_url: SafeUrlSchema.optional().nullable(),
})

export const UpdatePageSchema = CreatePageSchema.partial().extend({
  id: z.union([IdSchema, StringIdSchema]),
})

// ============================================
// Link Schemas
// ============================================

export const CreateLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters")
    .transform(sanitizeText),
  url: SafeUrlSchema,
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .transform((v) => (v ? sanitizeText(v) : undefined)),
  page_id: IdSchema.optional(),
  is_active: z.boolean().default(true),
  order_index: z.number().int().min(0).optional(),
  visible_from: z.string().datetime().nullable().optional(),
  visible_until: z.string().datetime().nullable().optional(),
})

export const UpdateLinkSchema = CreateLinkSchema.partial().extend({
  id: IdSchema,
})

export const ReorderLinksSchema = z.object({
  links: z.array(
    z.object({
      id: IdSchema,
      order_index: z.number().int().min(0),
    })
  ),
})

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate data against a schema and throw ValidationError on failure.
 *
 * @example
 * ```ts
 * const data = await validateRequest(CreatePageSchema, body)
 * // data is typed and validated
 * ```
 */
export async function validateRequest<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw new ValidationError(
      "Validation failed",
      result.error.flatten()
    )
  }

  return result.data
}

/**
 * Parse and validate search params
 */
export function parseSearchParams(
  searchParams: URLSearchParams,
  schema: z.ZodSchema
) {
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return validateRequest(schema, params)
}

/**
 * Validate request body from a Request object
 */
export async function validateBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json()
    return validateRequest(schema, body)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError("Invalid JSON body")
  }
}

// Type exports for convenience
export type CreatePageInput = z.infer<typeof CreatePageSchema>
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>
export type CreateLinkInput = z.infer<typeof CreateLinkSchema>
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>
export type ReorderLinksInput = z.infer<typeof ReorderLinksSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
