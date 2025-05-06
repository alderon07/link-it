/**
 * Validation schemas for authentication using Zod
 */
import { z } from 'zod';

/**
 * Auth schemas
 */
export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Type definitions derived from schemas
 */
export type LoginInput = z.infer<typeof LoginSchema>; 