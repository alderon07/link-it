/**
 * Validation helpers for Convex functions
 */

import { ConvexError } from "convex/values";

// Validation constraints
export const CONSTRAINTS = {
  username: { min: 3, max: 30 },
  displayName: { max: 100 },
  pageName: { min: 1, max: 100 },
  slug: { min: 3, max: 30 },
  bio: { max: 500 },
  description: { max: 1000 },
  linkTitle: { min: 1, max: 100 },
  linkDescription: { max: 500 },
  themeName: { min: 1, max: 50 },
  seoTitle: { max: 100 },
  seoDescription: { max: 200 },
} as const;

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  field: string,
  constraints: { min?: number; max?: number }
): void {
  if (constraints.min !== undefined && value.length < constraints.min) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: `${field} must be at least ${constraints.min} characters`,
    });
  }
  if (constraints.max !== undefined && value.length > constraints.max) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: `${field} must be at most ${constraints.max} characters`,
    });
  }
}

/**
 * Validate a slug format
 */
export function validateSlug(slug: string): void {
  validateLength(slug, "Slug", CONSTRAINTS.slug);

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    });
  }

  if (slug.startsWith("-") || slug.endsWith("-")) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: "Slug cannot start or end with a hyphen",
    });
  }
}

/**
 * Validate a URL
 */
export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: "Invalid URL format",
    });
  }
}

/**
 * Validate a hex color
 */
export function validateHexColor(color: string, field: string): void {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: `${field} must be a valid hex color (e.g., #FFFFFF)`,
    });
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ConvexError({
      code: "VALIDATION_ERROR",
      message: "Invalid email format",
    });
  }
}
