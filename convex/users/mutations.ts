import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, getOrCreateUser } from "../lib/utils";
import { validateLength, CONSTRAINTS } from "../lib/validators";

/**
 * Get or create the current user from their Clerk identity.
 * This ensures users are properly synced to Convex even if the webhook was missed.
 * This mutation is exposed so it can be called directly from the frontend to sync the user.
 */
export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    return await getOrCreateUser(ctx);
  },
});

/**
 * Update the current user's profile
 */
export const updateUser = mutation({
  args: {
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const deletionTime = now();

    // Soft delete the user
    await ctx.db.patch(user._id, {
      deletionTime,
      updatedAt: deletionTime,
    });

    // Soft delete all user's identities
    const userIdentities = await ctx.db
      .query("identities")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id).eq("deletionTime", undefined)
      )
      .collect();

    for (const identity of userIdentities) {
      await ctx.db.patch(identity._id, {
        deletionTime,
        updatedAt: deletionTime,
      });

      // Soft delete all links on each identity
      const identityLinks = await ctx.db
        .query("links")
        .withIndex("by_identity", (q) =>
          q.eq("identityId", identity._id).eq("deletionTime", undefined)
        )
        .collect();

      for (const link of identityLinks) {
        await ctx.db.patch(link._id, {
          deletionTime,
          updatedAt: deletionTime,
        });
      }
    }

    return { success: true };
  },
});
