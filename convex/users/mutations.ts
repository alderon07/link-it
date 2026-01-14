import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now } from "../lib/utils";
import { validateLength, CONSTRAINTS } from "../lib/validators";

/**
 * Update the current user's profile
 */
export const updateUser = mutation({
  args: {
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update your profile",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Validate display name if provided
    if (args.displayName !== undefined) {
      validateLength(args.displayName, "Display name", CONSTRAINTS.displayName);
    }

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: now(),
    });

    return ctx.db.get(user._id);
  },
});

/**
 * Update user's username (requires unique check)
 */
export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update your username",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Validate username
    validateLength(args.username, "Username", CONSTRAINTS.username);

    // Check username format
    if (!/^[a-z0-9_-]+$/.test(args.username)) {
      throw new ConvexError({
        code: "VALIDATION_ERROR",
        message:
          "Username can only contain lowercase letters, numbers, underscores, and hyphens",
      });
    }

    // Check if username is already taken
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser && existingUser._id !== user._id && !existingUser.deletionTime) {
      throw new ConvexError({
        code: "CONFLICT",
        message: "Username is already taken",
      });
    }

    await ctx.db.patch(user._id, {
      username: args.username,
      updatedAt: now(),
    });

    return ctx.db.get(user._id);
  },
});

/**
 * Soft delete the current user's account
 */
export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete your account",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user || user.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const deletionTime = now();

    // Soft delete the user
    await ctx.db.patch(user._id, {
      deletionTime,
      updatedAt: deletionTime,
    });

    // Soft delete all user's pages
    const userPages = await ctx.db
      .query("pages")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    for (const page of userPages) {
      await ctx.db.patch(page._id, {
        deletionTime,
        updatedAt: deletionTime,
      });

      // Soft delete all links on each page
      const pageLinks = await ctx.db
        .query("links")
        .withIndex("by_page", (q) =>
          q.eq("pageId", page._id).eq("deletionTime", undefined)
        )
        .collect();

      for (const link of pageLinks) {
        await ctx.db.patch(link._id, {
          deletionTime,
          updatedAt: deletionTime,
        });
      }
    }

    return { success: true };
  },
});
