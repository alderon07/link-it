import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, sanitizeText, getOrCreateUser } from "../lib/utils";
import { validateLength, validateUrl, CONSTRAINTS } from "../lib/validators";

/**
 * Create a new link
 */
export const createLink = mutation({
  args: {
    identityId: v.id("identities"),
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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    // Verify identity ownership
    const identity = await ctx.db.get(args.identityId);
    if (!identity || identity.deletionTime || identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
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

    // Get the max order index for this identity
    const identityLinks = await ctx.db
      .query("links")
      .withIndex("by_identity", (q) =>
        q.eq("identityId", args.identityId).eq("deletionTime", undefined)
      )
      .collect();

    const maxOrder = identityLinks.length > 0
      ? Math.max(...identityLinks.map((l) => l.orderIndex ?? 0))
      : -1;

    // Create the link
    const linkId = await ctx.db.insert("links", {
      identityId: args.identityId,
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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const link = await ctx.db.get(args.linkId);
    if (!link || link.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    // Verify identity ownership
    if (!link.identityId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated identity",
      });
    }
    const identity = await ctx.db.get(link.identityId);
    if (!identity || ("deletionTime" in identity && identity.deletionTime) || ("userId" in identity && identity.userId !== user._id)) {
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
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const link = await ctx.db.get(args.linkId);
    if (!link || link.deletionTime) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link not found",
      });
    }

    // Verify identity ownership
    if (!link.identityId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Link has no associated identity",
      });
    }
    const identity = await ctx.db.get(link.identityId);
    if (!identity || ("deletionTime" in identity && identity.deletionTime) || ("userId" in identity && identity.userId !== user._id)) {
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
 * Reorder links on an identity
 */
export const reorderLinks = mutation({
  args: {
    identityId: v.id("identities"),
    linkIds: v.array(v.id("links")),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    // Verify identity ownership
    const identity = await ctx.db.get(args.identityId);
    if (!identity || identity.deletionTime || identity.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have access to this identity",
      });
    }

    // Update order index for each link
    const timestamp = now();
    for (let i = 0; i < args.linkIds.length; i++) {
      const link = await ctx.db.get(args.linkIds[i]);

      // Verify link belongs to this identity
      if (!link || link.deletionTime || link.identityId !== args.identityId) {
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
