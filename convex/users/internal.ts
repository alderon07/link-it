import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import { now, generateUsername } from "../lib/utils";

/**
 * Internal: Create a user from Clerk webhook data
 * This is called by the HTTP endpoint when handling Clerk webhooks
 */
export const createFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingUser) {
      // If user exists but was soft-deleted, restore them
      if (existingUser.deletionTime) {
        await ctx.db.patch(existingUser._id, {
          email: args.email,
          username: args.username || existingUser.username,
          displayName: [args.firstName, args.lastName].filter(Boolean).join(" ") || existingUser.displayName,
          avatarUrl: args.imageUrl || existingUser.avatarUrl,
          deletionTime: undefined,
          updatedAt: now(),
        });
        return existingUser._id;
      }
      return existingUser._id;
    }

    // Generate a unique username if not provided
    let username = args.username;
    if (!username) {
      username = generateUsername(args.firstName, args.lastName);

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

        username = generateUsername(args.firstName, args.lastName);
        attempts++;
      }
    }

    // Create the user
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      username,
      displayName: [args.firstName, args.lastName].filter(Boolean).join(" ") || undefined,
      avatarUrl: args.imageUrl,
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
      publishedPage: false,
      updatedAt: now(),
    });

    return userId;
  },
});

/**
 * Internal: Update a user from Clerk webhook data
 */
export const updateFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user || user.deletionTime) {
      // User doesn't exist or is deleted - they should be created via webhook
      // This shouldn't happen in normal flow
      return null;
    }

    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.email) {
      updates.email = args.email;
    }

    if (args.firstName !== undefined || args.lastName !== undefined) {
      const displayName = [args.firstName, args.lastName].filter(Boolean).join(" ");
      if (displayName) {
        updates.displayName = displayName;
      }
    }

    if (args.imageUrl !== undefined) {
      updates.avatarUrl = args.imageUrl;
    }

    // Don't update username from Clerk - users manage that themselves

    await ctx.db.patch(user._id, updates);
    return user._id;
  },
});

/**
 * Internal: Soft delete a user from Clerk webhook
 */
export const deleteFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user || user.deletionTime) {
      return { success: false, reason: "User not found or already deleted" };
    }

    const deletionTime = now();

    // Soft delete the user
    await ctx.db.patch(user._id, {
      deletionTime,
      updatedAt: deletionTime,
    });

    // Soft delete all user's pages and their links
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

/**
 * Internal: Get user by Clerk ID (for HTTP handlers)
 */
export const getByClerkId = internalQuery({
  args: {
    clerkUserId: v.string(),
  },
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
