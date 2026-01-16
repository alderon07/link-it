import { mutation } from "./_generated/server";

/**
 * Clear ALL data from ALL tables - use with extreme caution!
 * This is destructive and cannot be undone.
 */
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, number> = {};

    // Delete in dependency order (children first)
    // Include both old and new table names for migration
    const tables = [
      "auditLogs",
      "linkClicks",
      "identityViews",
      "pageViews", // Old table
      "linkTags",
      "links",
      "identityCollaborators",
      "pageCollaborators", // Old table
      "identities",
      "pages", // Old table
      "userProgress",
      "userSettings",
      "tags",
      "themes",
      "users",
    ] as const;

    for (const table of tables) {
      let deleted = 0;
      try {
        // Get all documents from the table
        const docs = await ctx.db.query(table as any).collect();
        for (const doc of docs) {
          await ctx.db.delete(doc._id);
          deleted++;
        }
        results[table] = deleted;
        console.log(`Deleted ${deleted} documents from ${table}`);
      } catch (error) {
        console.error(`Error clearing ${table}:`, error);
        results[table] = 0;
      }
    }

    return {
      message: "All data cleared!",
      results,
    };
  },
});
