import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get the current authenticated user
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    return user;
  },
});

/**
 * Get a user by their Clerk ID
 */
export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    return user;
  },
});

/**
 * Get a user by their username
 */
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user || user.deletionTime) {
      return null;
    }

    return user;
  },
});

/**
 * Check if a username is available
 */
export const isUsernameAvailable = query({
  args: {
    username: v.string(),
    excludeUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!existingUser) {
      return true;
    }

    // If the existing user is the one we're excluding (for updates), it's available
    if (args.excludeUserId && existingUser._id === args.excludeUserId) {
      return true;
    }

    // If the existing user is soft-deleted, the username is available
    if (existingUser.deletionTime) {
      return true;
    }

    return false;
  },
});
