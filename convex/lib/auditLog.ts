/**
 * Audit logging helper for tracking user actions
 */

import { MutationCtx, internalMutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

/**
 * Audit log action types
 */
export const AUDIT_ACTIONS = {
  // Identity actions
  IDENTITY_CREATE: "identity.create",
  IDENTITY_UPDATE: "identity.update",
  IDENTITY_DELETE: "identity.delete",
  // Link actions
  LINK_CREATE: "link.create",
  LINK_UPDATE: "link.update",
  LINK_DELETE: "link.delete",
  LINK_REORDER: "link.reorder",
  // User actions
  USER_UPDATE: "user.update",
  USER_SETTINGS_UPDATE: "user.settings.update",
  // Theme actions
  THEME_CREATE: "theme.create",
  THEME_UPDATE: "theme.update",
  THEME_DELETE: "theme.delete",
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

/**
 * Entity types for audit logs
 */
export const ENTITY_TYPES = {
  IDENTITY: "identity",
  LINK: "link",
  USER: "user",
  THEME: "theme",
  SETTINGS: "settings",
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

/**
 * Log an audit event
 *
 * @param ctx - Mutation context
 * @param userId - ID of the user performing the action
 * @param action - Action being performed
 * @param entityType - Type of entity being acted upon
 * @param entityId - ID of the entity being acted upon
 * @param metadata - Additional metadata about the action
 */
export async function logAudit(
  ctx: MutationCtx,
  userId: Id<"users">,
  action: AuditAction,
  entityType: EntityType,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<Id<"auditLogs">> {
  return await ctx.db.insert("auditLogs", {
    userId,
    action,
    entityType,
    entityId,
    metadata,
    timestamp: Date.now(),
  });
}

/**
 * Create an audit log entry for create operations
 */
export async function logCreate(
  ctx: MutationCtx,
  userId: Id<"users">,
  entityType: EntityType,
  entityId: string,
  data?: Record<string, unknown>
): Promise<Id<"auditLogs">> {
  const actionMap: Record<EntityType, AuditAction> = {
    [ENTITY_TYPES.IDENTITY]: AUDIT_ACTIONS.IDENTITY_CREATE,
    [ENTITY_TYPES.LINK]: AUDIT_ACTIONS.LINK_CREATE,
    [ENTITY_TYPES.USER]: AUDIT_ACTIONS.USER_UPDATE,
    [ENTITY_TYPES.THEME]: AUDIT_ACTIONS.THEME_CREATE,
    [ENTITY_TYPES.SETTINGS]: AUDIT_ACTIONS.USER_SETTINGS_UPDATE,
  };

  return logAudit(ctx, userId, actionMap[entityType], entityType, entityId, data);
}

/**
 * Create an audit log entry for update operations
 */
export async function logUpdate(
  ctx: MutationCtx,
  userId: Id<"users">,
  entityType: EntityType,
  entityId: string,
  changedFields?: string[]
): Promise<Id<"auditLogs">> {
  const actionMap: Record<EntityType, AuditAction> = {
    [ENTITY_TYPES.IDENTITY]: AUDIT_ACTIONS.IDENTITY_UPDATE,
    [ENTITY_TYPES.LINK]: AUDIT_ACTIONS.LINK_UPDATE,
    [ENTITY_TYPES.USER]: AUDIT_ACTIONS.USER_UPDATE,
    [ENTITY_TYPES.THEME]: AUDIT_ACTIONS.THEME_UPDATE,
    [ENTITY_TYPES.SETTINGS]: AUDIT_ACTIONS.USER_SETTINGS_UPDATE,
  };

  return logAudit(ctx, userId, actionMap[entityType], entityType, entityId, {
    changedFields,
  });
}

/**
 * Create an audit log entry for delete operations
 */
export async function logDelete(
  ctx: MutationCtx,
  userId: Id<"users">,
  entityType: EntityType,
  entityId: string
): Promise<Id<"auditLogs">> {
  const actionMap: Record<EntityType, AuditAction> = {
    [ENTITY_TYPES.IDENTITY]: AUDIT_ACTIONS.IDENTITY_DELETE,
    [ENTITY_TYPES.LINK]: AUDIT_ACTIONS.LINK_DELETE,
    [ENTITY_TYPES.USER]: AUDIT_ACTIONS.USER_UPDATE,
    [ENTITY_TYPES.THEME]: AUDIT_ACTIONS.THEME_DELETE,
    [ENTITY_TYPES.SETTINGS]: AUDIT_ACTIONS.USER_SETTINGS_UPDATE,
  };

  return logAudit(ctx, userId, actionMap[entityType], entityType, entityId);
}

/**
 * Clean up old audit logs to prevent unbounded growth
 *
 * This is an internal mutation - only callable from server code (e.g., cron jobs).
 * Default retention is 90 days.
 *
 * To schedule this, add to convex/crons.ts:
 * ```
 * crons.daily("cleanup audit logs", { hourUTC: 3, minuteUTC: 0 }, internal.lib.auditLog.cleanupOldLogs);
 * ```
 */
export const cleanupOldLogs = internalMutation({
  args: {
    retentionDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const retentionDays = args.retentionDays ?? 90;
    const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

    // Get old logs in batches to avoid memory issues
    const BATCH_SIZE = 100;
    let deletedCount = 0;
    let hasMore = true;

    while (hasMore) {
      const oldLogs = await ctx.db
        .query("auditLogs")
        .filter((q) => q.lt(q.field("timestamp"), cutoffTime))
        .take(BATCH_SIZE);

      if (oldLogs.length === 0) {
        hasMore = false;
        break;
      }

      for (const log of oldLogs) {
        await ctx.db.delete(log._id);
        deletedCount++;
      }

      // If we got fewer than BATCH_SIZE, we're done
      if (oldLogs.length < BATCH_SIZE) {
        hasMore = false;
      }
    }

    return {
      success: true,
      deletedCount,
      retentionDays,
      cutoffDate: new Date(cutoffTime).toISOString(),
    };
  },
});
