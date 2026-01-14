import { query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/**
 * Get a theme by ID
 */
export const getTheme = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.themeId);
  },
});

/**
 * Get all system themes (pre-made themes available to all users)
 */
export const getSystemThemes = query({
  args: {},
  handler: async (ctx) => {
    const themes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    return themes;
  },
});

/**
 * Get custom themes for the current user
 */
export const getUserThemes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return [];
    }

    const themes = await ctx.db
      .query("themes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return themes;
  },
});

/**
 * Get all themes available to the current user (system + custom)
 */
export const getAllAvailableThemes = query({
  args: {},
  handler: async (ctx) => {
    // Get system themes (available to everyone)
    const systemThemes = await ctx.db
      .query("themes")
      .withIndex("by_system", (q) => q.eq("isCustom", false))
      .collect();

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return systemThemes;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return systemThemes;
    }

    // Get user's custom themes
    const customThemes = await ctx.db
      .query("themes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return [...systemThemes, ...customThemes];
  },
});

/**
 * Check if user owns a theme
 */
export const canEditTheme = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      return false;
    }

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      return false;
    }

    // Can't edit system themes
    if (!theme.isCustom) {
      return false;
    }

    // Can only edit own themes
    return theme.userId === user._id;
  },
});
