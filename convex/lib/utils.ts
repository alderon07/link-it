/**
 * Utility functions for Convex backend
 */

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a hex color is valid
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Generate a random username based on Clerk data
 */
export function generateUsername(
  firstName?: string | null,
  lastName?: string | null,
  fallback: string = "user"
): string {
  const base = firstName || lastName || fallback;
  const slug = generateSlug(base);
  const random = Math.random().toString(36).substring(2, 6);
  return `${slug}-${random}`;
}

/**
 * Get current timestamp in milliseconds
 */
export function now(): number {
  return Date.now();
}
