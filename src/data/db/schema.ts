/**
 * Database schemas using Zod
 * These schemas represent the structure of data in the database
 */
import { z } from "zod"

// ============================================
// User Schema
// ============================================

export const UserSchema = z.object({
  id: z.number(),
  clerk_user_id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  display_name: z.string().max(100).nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
})

export const UpdateUserSchema = UserSchema.partial().required({ id: true })

export type User = z.infer<typeof UserSchema>
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

// ============================================
// Page Schema
// ============================================

export const PageSchema = z.object({
  id: z.number(),
  user_id: z.string(), // clerk_user_id
  name: z.string().min(1).max(100),
  slug: z.string().min(3).max(30),
  description: z.string().max(1000).nullable(),
  bio: z.string().max(500).nullable(),
  avatar_url: z.string().url().nullable(),
  theme_id: z.number().nullable(),
  is_public: z.boolean(),
  view_count: z.number().default(0),
  seo_title: z.string().max(100).nullable(),
  seo_description: z.string().max(200).nullable(),
  og_image_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
})

export const CreatePageSchema = PageSchema.omit({
  id: true,
  view_count: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).partial({
  description: true,
  bio: true,
  avatar_url: true,
  theme_id: true,
  seo_title: true,
  seo_description: true,
  og_image_url: true,
})

export const UpdatePageSchema = PageSchema.partial().required({ id: true })

export type Page = z.infer<typeof PageSchema>
export type CreatePageInput = z.infer<typeof CreatePageSchema>
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>

// ============================================
// Link Schema
// ============================================

export const LinkSchema = z.object({
  id: z.number(),
  page_id: z.number(),
  title: z.string().min(1).max(100),
  url: z.string().url(),
  type: z.enum(["link", "header", "divider"]).default("link"),
  description: z.string().max(500).nullable(),
  is_active: z.boolean().default(true),
  order_index: z.number().int().min(0),
  click_count: z.number().default(0),
  visible_from: z.string().datetime().nullable(),
  visible_until: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
})

export const CreateLinkSchema = LinkSchema.omit({
  id: true,
  click_count: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).partial({
  description: true,
  type: true,
  is_active: true,
  order_index: true,
  visible_from: true,
  visible_until: true,
})

export const UpdateLinkSchema = LinkSchema.partial().required({ id: true })

export type Link = z.infer<typeof LinkSchema>
export type CreateLinkInput = z.infer<typeof CreateLinkSchema>
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>

// ============================================
// Theme Schema
// ============================================

export const ThemeSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(50),
  bg_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  is_custom: z.boolean().default(false),
  user_id: z.string().nullable(), // null for system themes
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export const CreateThemeSchema = ThemeSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type Theme = z.infer<typeof ThemeSchema>
export type CreateThemeInput = z.infer<typeof CreateThemeSchema>

// ============================================
// Tag Schema
// ============================================

export const TagSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(30),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
})

export type Tag = z.infer<typeof TagSchema>

// ============================================
// Pagination & Query Types
// ============================================

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const SortOrderSchema = z.enum(["asc", "desc"]).default("desc")

export type PaginationInput = z.infer<typeof PaginationSchema>
export type SortOrder = z.infer<typeof SortOrderSchema>

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}
