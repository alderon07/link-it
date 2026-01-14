import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now } from "../lib/utils";

/**
 * Update user settings
 */
export const updateSettings = mutation({
  args: {
    darkMode: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    defaultPageId: v.optional(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update settings",
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

    // If setting a default page, verify ownership
    if (args.defaultPageId) {
      const page = await ctx.db.get(args.defaultPageId);
      if (!page || page.deletionTime || page.userId !== user._id) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You can only set your own pages as default",
        });
      }
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!settings) {
      // Create settings if they don't exist
      return ctx.db.insert("userSettings", {
        userId: user._id,
        darkMode: args.darkMode ?? false,
        emailNotifications: args.emailNotifications ?? true,
        defaultPageId: args.defaultPageId,
        updatedAt: now(),
      });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.darkMode !== undefined) updates.darkMode = args.darkMode;
    if (args.emailNotifications !== undefined) updates.emailNotifications = args.emailNotifications;
    if (args.defaultPageId !== undefined) updates.defaultPageId = args.defaultPageId;

    await ctx.db.patch(settings._id, updates);

    return ctx.db.get(settings._id);
  },
});

/**
 * Update user progress
 */
export const updateProgress = mutation({
  args: {
    completedIntro: v.optional(v.boolean()),
    addedFirstLink: v.optional(v.boolean()),
    publishedPage: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update progress",
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

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!progress) {
      // Create progress if it doesn't exist
      return ctx.db.insert("userProgress", {
        userId: user._id,
        completedIntro: args.completedIntro ?? false,
        addedFirstLink: args.addedFirstLink ?? false,
        publishedPage: args.publishedPage ?? false,
        updatedAt: now(),
      });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.completedIntro !== undefined) updates.completedIntro = args.completedIntro;
    if (args.addedFirstLink !== undefined) updates.addedFirstLink = args.addedFirstLink;
    if (args.publishedPage !== undefined) updates.publishedPage = args.publishedPage;

    await ctx.db.patch(progress._id, updates);

    return ctx.db.get(progress._id);
  },
});

/**
 * Mark intro as completed
 */
export const completeIntro = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
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

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!progress) {
      return ctx.db.insert("userProgress", {
        userId: user._id,
        completedIntro: true,
        addedFirstLink: false,
        publishedPage: false,
        updatedAt: now(),
      });
    }

    await ctx.db.patch(progress._id, {
      completedIntro: true,
      updatedAt: now(),
    });

    return ctx.db.get(progress._id);
  },
});
