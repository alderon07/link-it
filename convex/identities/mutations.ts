import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, sanitizeText, getOrCreateUser } from "../lib/utils";
import { validateLength, validateSlug, CONSTRAINTS } from "../lib/validators";

/**
 * Create a new identity
 */
export const createIdentity = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    bio: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    themeId: v.optional(v.id("themes")),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    ogImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    // Validate inputs
    validateLength(args.name, "Name", CONSTRAINTS.pageName);
    validateSlug(args.slug);

    if (args.bio) {
      validateLength(args.bio, "Bio", CONSTRAINTS.bio);
    }
    if (args.description) {
      validateLength(args.description, "Description", CONSTRAINTS.description);
    }
    if (args.seoTitle) {
      validateLength(args.seoTitle, "SEO Title", CONSTRAINTS.seoTitle);
    }
    if (args.seoDescription) {
      validateLength(args.seoDescription, "SEO Description", CONSTRAINTS.seoDescription);
    }

    // Check slug availability
    const existingIdentity = await ctx.db
      .query("identities")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingIdentity && !existingIdentity.deletionTime) {
      throw new ConvexError({
        code: "CONFLICT",
        message: "This slug is already taken",
      });
    }

    // Create the identity
    const identityId = await ctx.db.insert("identities", {
      userId: user._id,
      name: sanitizeText(args.name),
      slug: args.slug.toLowerCase(),
      bio: args.bio ? sanitizeText(args.bio) : undefined,
      description: args.description ? sanitizeText(args.description) : undefined,
      avatarUrl: args.avatarUrl,
      isPublic: args.isPublic,
      viewCount: 0,
      themeId: args.themeId,
      seoTitle: args.seoTitle ? sanitizeText(args.seoTitle) : undefined,
      seoDescription: args.seoDescription ? sanitizeText(args.seoDescription) : undefined,
      ogImageUrl: args.ogImageUrl,
      updatedAt: now(),
    });

    // Update user progress if this is their first identity
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (userProgress && !userProgress.publishedIdentity && args.isPublic) {
      await ctx.db.patch(userProgress._id, {
        publishedIdentity: true,
        updatedAt: now(),
      });
    }

    return ctx.db.get(identityId);
  },
});

/**
 * Update an existing identity
 */
export const updateIdentity = mutation({
  args: {
    identityId: v.id("identities"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    bio: v.optional(v.string()),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    themeId: v.optional(v.id("themes")),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    ogImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    // Verify ownership
    if (identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to update this identity",
      });
    }

    // Validate inputs
    if (args.name !== undefined) {
      validateLength(args.name, "Name", CONSTRAINTS.pageName);
    }
    if (args.slug !== undefined) {
      validateSlug(args.slug);

      // Check slug availability (excluding current identity)
      const existingIdentity = await ctx.db
        .query("identities")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .first();

      if (existingIdentity && existingIdentity._id !== args.identityId && !existingIdentity.deletionTime) {
        throw new ConvexError({
          code: "CONFLICT",
          message: "This slug is already taken",
        });
      }
    }
    if (args.bio !== undefined) {
      validateLength(args.bio, "Bio", CONSTRAINTS.bio);
    }
    if (args.description !== undefined) {
      validateLength(args.description, "Description", CONSTRAINTS.description);
    }
    if (args.seoTitle !== undefined) {
      validateLength(args.seoTitle, "SEO Title", CONSTRAINTS.seoTitle);
    }
    if (args.seoDescription !== undefined) {
      validateLength(args.seoDescription, "SEO Description", CONSTRAINTS.seoDescription);
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.name !== undefined) updates.name = sanitizeText(args.name);
    if (args.slug !== undefined) updates.slug = args.slug.toLowerCase();
    if (args.bio !== undefined) updates.bio = sanitizeText(args.bio);
    if (args.description !== undefined) updates.description = sanitizeText(args.description);
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;
    if (args.themeId !== undefined) updates.themeId = args.themeId;
    if (args.seoTitle !== undefined) updates.seoTitle = sanitizeText(args.seoTitle);
    if (args.seoDescription !== undefined) updates.seoDescription = sanitizeText(args.seoDescription);
    if (args.ogImageUrl !== undefined) updates.ogImageUrl = args.ogImageUrl;

    await ctx.db.patch(args.identityId, updates);

    return ctx.db.get(args.identityId);
  },
});

/**
 * Delete an identity (soft delete)
 */
export const deleteIdentity = mutation({
  args: { identityId: v.id("identities") },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const identity = await ctx.db.get(args.identityId);

    if (!identity || identity.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Identity not found",
      });
    }

    // Verify ownership
    if (identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this identity",
      });
    }

    const deletionTime = now();

    // Soft delete the identity
    await ctx.db.patch(args.identityId, {
      deletionTime,
      updatedAt: deletionTime,
    });

    // Soft delete all links on the identity
    const identityLinks = await ctx.db
      .query("links")
      .withIndex("by_identity", (q) =>
        q.eq("identityId", args.identityId).eq("deletionTime", undefined)
      )
      .collect();

    for (const link of identityLinks) {
      await ctx.db.patch(link._id, {
        deletionTime,
        updatedAt: deletionTime,
      });
    }

    return { success: true };
  },
});
