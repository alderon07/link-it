import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, sanitizeText } from "../lib/utils";
import { validateLength, validateSlug, CONSTRAINTS } from "../lib/validators";

/**
 * Create a new page
 */
export const createPage = mutation({
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a page",
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
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingPage && !existingPage.deletionTime) {
      throw new ConvexError({
        code: "CONFLICT",
        message: "This slug is already taken",
      });
    }

    // Create the page
    const pageId = await ctx.db.insert("pages", {
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

    // Update user progress if this is their first page
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (userProgress && !userProgress.publishedPage && args.isPublic) {
      await ctx.db.patch(userProgress._id, {
        publishedPage: true,
        updatedAt: now(),
      });
    }

    return ctx.db.get(pageId);
  },
});

/**
 * Update an existing page
 */
export const updatePage = mutation({
  args: {
    pageId: v.id("pages"),
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update a page",
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

    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Page not found",
      });
    }

    // Verify ownership
    if (page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to update this page",
      });
    }

    // Validate inputs
    if (args.name !== undefined) {
      validateLength(args.name, "Name", CONSTRAINTS.pageName);
    }
    if (args.slug !== undefined) {
      validateSlug(args.slug);

      // Check slug availability (excluding current page)
      const existingPage = await ctx.db
        .query("pages")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
        .first();

      if (existingPage && existingPage._id !== args.pageId && !existingPage.deletionTime) {
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

    await ctx.db.patch(args.pageId, updates);

    return ctx.db.get(args.pageId);
  },
});

/**
 * Delete a page (soft delete)
 */
export const deletePage = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete a page",
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

    const page = await ctx.db.get(args.pageId);

    if (!page || page.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Page not found",
      });
    }

    // Verify ownership
    if (page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this page",
      });
    }

    const deletionTime = now();

    // Soft delete the page
    await ctx.db.patch(args.pageId, {
      deletionTime,
      updatedAt: deletionTime,
    });

    // Soft delete all links on the page
    const pageLinks = await ctx.db
      .query("links")
      .withIndex("by_page", (q) =>
        q.eq("pageId", args.pageId).eq("deletionTime", undefined)
      )
      .collect();

    for (const link of pageLinks) {
      await ctx.db.patch(link._id, {
        deletionTime,
        updatedAt: deletionTime,
      });
    }

    return { success: true };
  },
});
