import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, sanitizeText } from "../lib/utils";
import { validateLength, validateUrl, CONSTRAINTS } from "../lib/validators";

/**
 * Create a new link
 */
export const createLink = mutation({
  args: {
    pageId: v.id("pages"),
    title: v.string(),
    url: v.string(),
    type: v.optional(v.union(v.literal("link"), v.literal("header"), v.literal("divider"))),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    orderIndex: v.optional(v.number()),
    visibleFrom: v.optional(v.number()),
    visibleUntil: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a link",
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

    // Verify page ownership
    const page = await ctx.db.get(args.pageId);
    if (!page || page.deletionTime || page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    // Validate inputs
    validateLength(args.title, "Title", CONSTRAINTS.linkTitle);

    const linkType = args.type || "link";
    if (linkType === "link") {
      validateUrl(args.url);
    }

    if (args.description) {
      validateLength(args.description, "Description", CONSTRAINTS.linkDescription);
    }

    // Get the max order index for this page
    const pageLinks = await ctx.db
      .query("links")
      .withIndex("by_page", (q) =>
        q.eq("pageId", args.pageId).eq("deletionTime", undefined)
      )
      .collect();

    const maxOrder = pageLinks.length > 0
      ? Math.max(...pageLinks.map((l) => l.orderIndex ?? 0))
      : -1;

    // Create the link
    const linkId = await ctx.db.insert("links", {
      pageId: args.pageId,
      title: sanitizeText(args.title),
      url: args.url,
      type: linkType,
      description: args.description ? sanitizeText(args.description) : undefined,
      icon: args.icon,
      isActive: args.isActive ?? true,
      orderIndex: args.orderIndex ?? maxOrder + 1,
      clickCount: 0,
      visibleFrom: args.visibleFrom,
      visibleUntil: args.visibleUntil,
      updatedAt: now(),
    });

    // Update user progress if this is their first link
    const userProgress = await ctx.db
      .query("userProgress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (userProgress && !userProgress.addedFirstLink) {
      await ctx.db.patch(userProgress._id, {
        addedFirstLink: true,
        updatedAt: now(),
      });
    }

    return ctx.db.get(linkId);
  },
});

/**
 * Update an existing link
 */
export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.optional(v.union(v.literal("link"), v.literal("header"), v.literal("divider"))),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    orderIndex: v.optional(v.number()),
    visibleFrom: v.optional(v.number()),
    visibleUntil: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update a link",
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

    const link = await ctx.db.get(args.linkId);
    if (!link || link.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    // Verify page ownership
    if (!link.pageId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated page",
      });
    }
    const page = await ctx.db.get(link.pageId);
    if (!page || ("deletionTime" in page && page.deletionTime) || ("userId" in page && page.userId !== user._id)) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this link",
      });
    }

    // Validate inputs
    if (args.title !== undefined) {
      validateLength(args.title, "Title", CONSTRAINTS.linkTitle);
    }

    const linkType = args.type ?? link.type;
    if (linkType === "link" && args.url !== undefined) {
      validateUrl(args.url);
    }

    if (args.description !== undefined) {
      validateLength(args.description, "Description", CONSTRAINTS.linkDescription);
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.title !== undefined) updates.title = sanitizeText(args.title);
    if (args.url !== undefined) updates.url = args.url;
    if (args.type !== undefined) updates.type = args.type;
    if (args.description !== undefined) updates.description = sanitizeText(args.description);
    if (args.icon !== undefined) updates.icon = args.icon;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.orderIndex !== undefined) updates.orderIndex = args.orderIndex;
    if (args.visibleFrom !== undefined) updates.visibleFrom = args.visibleFrom;
    if (args.visibleUntil !== undefined) updates.visibleUntil = args.visibleUntil;

    await ctx.db.patch(args.linkId, updates);

    return ctx.db.get(args.linkId);
  },
});

/**
 * Delete a link (soft delete)
 */
export const deleteLink = mutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to delete a link",
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

    const link = await ctx.db.get(args.linkId);
    if (!link || link.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    // Verify page ownership
    if (!link.pageId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated page",
      });
    }
    const page = await ctx.db.get(link.pageId);
    if (!page || ("deletionTime" in page && page.deletionTime) || ("userId" in page && page.userId !== user._id)) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this link",
      });
    }

    const deletionTime = now();

    await ctx.db.patch(args.linkId, {
      deletionTime,
      updatedAt: deletionTime,
    });

    return { success: true };
  },
});

/**
 * Reorder links on a page
 */
export const reorderLinks = mutation({
  args: {
    pageId: v.id("pages"),
    linkIds: v.array(v.id("links")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to reorder links",
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

    // Verify page ownership
    const page = await ctx.db.get(args.pageId);
    if (!page || page.deletionTime || page.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this page",
      });
    }

    // Update order index for each link
    const timestamp = now();
    for (let i = 0; i < args.linkIds.length; i++) {
      const link = await ctx.db.get(args.linkIds[i]);

      // Verify link belongs to this page
      if (!link || link.deletionTime || link.pageId !== args.pageId) {
        continue;
      }

      await ctx.db.patch(args.linkIds[i], {
        orderIndex: i,
        updatedAt: timestamp,
      });
    }

    return { success: true };
  },
});
