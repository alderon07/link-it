import { query } from "../_generated/server";
import { ConvexError } from "convex/values";

/**
 * Get user settings
 */
export const getUserSettings = query({
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

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return settings;
  },
});

/**
 * Get user progress
 */
export const getUserProgress = query({
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

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    return progress;
  },
});

/**
 * Get combined user data (user, settings, progress)
 */
export const getUserData = query({
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

    const [settings, progress] = await Promise.all([
      ctx.db
        .query("userSettings")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first(),
      ctx.db
        .query("userProgress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first(),
    ]);

    return {
      user,
      settings,
      progress,
    };
  },
});
