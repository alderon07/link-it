import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, getOrCreateUser } from "../lib/utils";

/**
 * Update user settings
 */
export const updateSettings = mutation({
  args: {
    darkMode: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    defaultIdentityId: v.optional(v.id("identities")),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    // If setting a default identity, verify ownership
    if (args.defaultIdentityId) {
      const identity = await ctx.db.get(args.defaultIdentityId);
      if (!identity || identity.deletionTime || identity.userId !== user._id) {
        throw new ConvexError({
          code: "FORBIDDEN",
          message: "You can only set your own identities as default",
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
        defaultIdentityId: args.defaultIdentityId,
        updatedAt: now(),
      });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.darkMode !== undefined) updates.darkMode = args.darkMode;
    if (args.emailNotifications !== undefined) updates.emailNotifications = args.emailNotifications;
    if (args.defaultIdentityId !== undefined) updates.defaultIdentityId = args.defaultIdentityId;

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
    publishedIdentity: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

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
        publishedIdentity: args.publishedIdentity ?? false,
        updatedAt: now(),
      });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.completedIntro !== undefined) updates.completedIntro = args.completedIntro;
    if (args.addedFirstLink !== undefined) updates.addedFirstLink = args.addedFirstLink;
    if (args.publishedIdentity !== undefined) updates.publishedIdentity = args.publishedIdentity;

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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!progress) {
      return ctx.db.insert("userProgress", {
        userId: user._id,
        completedIntro: true,
        addedFirstLink: false,
        publishedIdentity: false,
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
