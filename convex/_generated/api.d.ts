/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics_queries from "../analytics/queries.js";
import type * as http from "../http.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_validators from "../lib/validators.js";
import type * as links_mutations from "../links/mutations.js";
import type * as links_public from "../links/public.js";
import type * as links_queries from "../links/queries.js";
import type * as pages_mutations from "../pages/mutations.js";
import type * as pages_public from "../pages/public.js";
import type * as pages_queries from "../pages/queries.js";
import type * as seed from "../seed.js";
import type * as seedAll from "../seedAll.js";
import type * as settings_mutations from "../settings/mutations.js";
import type * as settings_queries from "../settings/queries.js";
import type * as themes_mutations from "../themes/mutations.js";
import type * as themes_queries from "../themes/queries.js";
import type * as users_internal from "../users/internal.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "analytics/queries": typeof analytics_queries;
  http: typeof http;
  "lib/utils": typeof lib_utils;
  "lib/validators": typeof lib_validators;
  "links/mutations": typeof links_mutations;
  "links/public": typeof links_public;
  "links/queries": typeof links_queries;
  "pages/mutations": typeof pages_mutations;
  "pages/public": typeof pages_public;
  "pages/queries": typeof pages_queries;
  seed: typeof seed;
  seedAll: typeof seedAll;
  "settings/mutations": typeof settings_mutations;
  "settings/queries": typeof settings_queries;
  "themes/mutations": typeof themes_mutations;
  "themes/queries": typeof themes_queries;
  "users/internal": typeof users_internal;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
