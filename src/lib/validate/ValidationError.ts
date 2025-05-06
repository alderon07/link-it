/**
 * Custom error class for validation errors
 */
import { z } from 'zod';

export class ValidationError extends Error {
  errors: z.ZodError;
  
  constructor(errors: z.ZodError) {
    super('Validation error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
} 