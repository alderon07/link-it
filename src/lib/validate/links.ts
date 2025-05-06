/**
 * Validation schemas for links using Zod
 */
import { z } from 'zod';

/**
 * Link schemas
 */
export const LinkSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const CreateLinkSchema = LinkSchema.omit({ id: true, createdAt: true, updatedAt: true });

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
