/**
 * Validation schemas for links using Zod
 */
import { z } from 'zod';

/**
 * Link schemas
 */
export const LinkSchema = z.object({
  id: z.number(),
  page_id: z.number(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
  type: z.string().default('link'),
  is_active: z.boolean().default(true),
  order_index: z.number().default(0),
  visible_from: z.string().nullable().default(null),
  visible_until: z.string().nullable().default(null),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const CreateLinkSchema = LinkSchema.omit({ id: true, createdAt: true, updatedAt: true, type: true, is_active: true, order_index: true, visible_from: true, visible_until: true });

export const UpdateLinkSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters").optional(),
  url: z.string().url("Please enter a valid URL").optional(),
  description: z.string().optional(),
});

// Helper function to get ID schema
export const IdSchema = z.number();

/**
 * Type definitions derived from schemas
 */
export type Link = z.infer<typeof LinkSchema>;
export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
