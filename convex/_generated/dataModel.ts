/* eslint-disable */
/**
 * Stub file for Convex data model types
 * This file will be overwritten when you run `npx convex dev`
 *
 * To initialize Convex, run: npx convex dev
 */

// Placeholder Id type - replaced by actual generated code when Convex is initialized
export type Id<T extends string> = string & { __tableName: T };

// Placeholder document types
export type Doc<T extends string> = {
  _id: Id<T>;
  _creationTime: number;
} & Record<string, any>;

export type DataModel = Record<string, any>;
