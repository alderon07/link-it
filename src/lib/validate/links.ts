/**
 * Validation schemas for links using Zod
 */
import { z } from 'zod';

/**
 * Link schemas
 */
export const LinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
});

export const CreateLinkSchema = LinkSchema.omit({ id: true });

export const UpdateLinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
});

// Helper function to get ID schema
export const IdSchema = z.string();

/**
 * Type definitions derived from schemas
 */
export type Link = z.infer<typeof LinkSchema>;
export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
