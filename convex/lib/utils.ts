/**
 * Utility functions for Convex backend
 */

import { MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";

/**
 * Get or create the current user from their Clerk identity.
 * This ensures users are properly synced to Convex even if the webhook was missed.
 * Use this in mutations that require an authenticated user.
 */
export async function getOrCreateUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  // Check if user already exists
  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
    .first();

  if (existingUser && !existingUser.deletionTime) {
    return existingUser;
  }

  // If user exists but was soft-deleted, restore them
  if (existingUser && existingUser.deletionTime) {
    await ctx.db.patch(existingUser._id, {
      email: identity.email || existingUser.email,
      displayName: identity.name || existingUser.displayName,
      avatarUrl: identity.pictureUrl || existingUser.avatarUrl,
      deletionTime: undefined,
      updatedAt: now(),
    });
    const restored = await ctx.db.get(existingUser._id);
    if (!restored) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Failed to restore user",
      });
    }
    return restored;
  }

  // Generate a unique username
  const nameParts = identity.name?.split(" ") || [];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  let username = generateUsername(firstName, lastName);

  // Ensure username is unique
  let attempts = 0;
  while (attempts < 10) {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username!))
      .first();

    if (!existing || existing.deletionTime) {
      break;
    }

    username = generateUsername(firstName, lastName);
    attempts++;
  }

  // Create the user
  const userId = await ctx.db.insert("users", {
    clerkUserId: identity.subject,
    email: identity.email || "",
    username,
    displayName: identity.name || undefined,
    avatarUrl: identity.pictureUrl || undefined,
    updatedAt: now(),
  });

  // Create default user settings
  await ctx.db.insert("userSettings", {
    userId,
    darkMode: false,
    emailNotifications: true,
    updatedAt: now(),
  });

  // Create user progress tracking
  await ctx.db.insert("userProgress", {
    userId,
    completedIntro: false,
    addedFirstLink: false,
    publishedIdentity: false,
    updatedAt: now(),
  });

  const newUser = await ctx.db.get(userId);
  if (!newUser) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: "Failed to create user",
    });
  }
  return newUser;
}

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
