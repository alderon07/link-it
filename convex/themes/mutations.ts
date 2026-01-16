import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { now, sanitizeText, getOrCreateUser } from "../lib/utils";
import { validateLength, validateHexColor, CONSTRAINTS } from "../lib/validators";

/**
 * Create a custom theme
 */
export const createTheme = mutation({
  args: {
    name: v.string(),
    bgColor: v.string(),
    textColor: v.string(),
    accentColor: v.string(),
    buttonStyle: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    // Validate inputs
    validateLength(args.name, "Name", CONSTRAINTS.themeName);
    validateHexColor(args.bgColor, "Background color");
    validateHexColor(args.textColor, "Text color");
    validateHexColor(args.accentColor, "Accent color");

    // Create the theme
    const themeId = await ctx.db.insert("themes", {
      name: sanitizeText(args.name),
      bgColor: args.bgColor.toUpperCase(),
      textColor: args.textColor.toUpperCase(),
      accentColor: args.accentColor.toUpperCase(),
      buttonStyle: args.buttonStyle,
      fontFamily: args.fontFamily,
      userId: user._id,
      isCustom: true,
      updatedAt: now(),
    });

    return ctx.db.get(themeId);
  },
});

/**
 * Update a custom theme
 */
export const updateTheme = mutation({
  args: {
    themeId: v.id("themes"),
    name: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    textColor: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const theme = await ctx.db.get(args.themeId);

    if (!theme) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Theme not found",
      });
    }

    // Can't edit system themes
    if (!theme.isCustom) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Cannot edit system themes",
      });
    }

    // Verify ownership
    if (theme.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to edit this theme",
      });
    }

    // Validate inputs
    if (args.name !== undefined) {
      validateLength(args.name, "Name", CONSTRAINTS.themeName);
    }
    if (args.bgColor !== undefined) {
      validateHexColor(args.bgColor, "Background color");
    }
    if (args.textColor !== undefined) {
      validateHexColor(args.textColor, "Text color");
    }
    if (args.accentColor !== undefined) {
      validateHexColor(args.accentColor, "Accent color");
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.name !== undefined) updates.name = sanitizeText(args.name);
    if (args.bgColor !== undefined) updates.bgColor = args.bgColor.toUpperCase();
    if (args.textColor !== undefined) updates.textColor = args.textColor.toUpperCase();
    if (args.accentColor !== undefined) updates.accentColor = args.accentColor.toUpperCase();
    if (args.buttonStyle !== undefined) updates.buttonStyle = args.buttonStyle;
    if (args.fontFamily !== undefined) updates.fontFamily = args.fontFamily;

    await ctx.db.patch(args.themeId, updates);

    return ctx.db.get(args.themeId);
  },
});

/**
 * Delete a custom theme
 */
export const deleteTheme = mutation({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const theme = await ctx.db.get(args.themeId);

    if (!theme) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Theme not found",
      });
    }

    // Can't delete system themes
    if (!theme.isCustom) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Cannot delete system themes",
      });
    }

    // Verify ownership
    if (theme.userId !== user._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "You don't have permission to delete this theme",
      });
    }

    // Remove theme from any identities using it
    const identitiesUsingTheme = await ctx.db
      .query("identities")
      .filter((q) => q.eq(q.field("themeId"), args.themeId))
      .collect();

    for (const identity of identitiesUsingTheme) {
      await ctx.db.patch(identity._id, {
        themeId: undefined,
        updatedAt: now(),
      });
    }

    // Delete the theme
    await ctx.db.delete(args.themeId);

    return { success: true };
  },
});

/**
 * Duplicate a theme (system or custom)
 */
export const duplicateTheme = mutation({
  args: {
    themeId: v.id("themes"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get or create the user - this ensures the user exists even if webhook was missed
    const user = await getOrCreateUser(ctx);

    const theme = await ctx.db.get(args.themeId);

    if (!theme) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Theme not found",
      });
    }

    // Validate name
    validateLength(args.newName, "Name", CONSTRAINTS.themeName);

    // Create a copy as a custom theme
    const newThemeId = await ctx.db.insert("themes", {
      name: sanitizeText(args.newName),
      bgColor: theme.bgColor,
      textColor: theme.textColor,
      accentColor: theme.accentColor,
      buttonStyle: theme.buttonStyle,
      fontFamily: theme.fontFamily,
      userId: user._id,
      isCustom: true,
      updatedAt: now(),
    });

    return ctx.db.get(newThemeId);
  },
});
