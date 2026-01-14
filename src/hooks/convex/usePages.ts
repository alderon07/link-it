"use client";

import { useQuery, useMutation } from "convex/react";
import { useConvexAvailable } from "@/components/providers/ConvexClientProvider";

// Conditionally import to avoid errors when Convex isn't configured
let api: any = null;
try {
  api = require("../../../convex/_generated/api").api;
} catch {
  // Convex not initialized yet
}

// Re-export Id type for convenience
export type { Id } from "../../../convex/_generated/dataModel";

/**
 * Hook to get all pages for the current user
 */
export function useUserPages() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.queries?.getUserPages
      ? api.pages.queries.getUserPages
      : "skip"
  );
}

/**
 * Hook to get a specific page
 */
export function usePage(pageId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.queries?.getPage && pageId
      ? api.pages.queries.getPage
      : "skip",
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get a page with its theme
 */
export function usePageWithTheme(pageId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.queries?.getPageWithTheme && pageId
      ? api.pages.queries.getPageWithTheme
      : "skip",
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to check if a slug is available
 */
export function useSlugAvailable(slug: string, excludePageId?: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.queries?.isSlugAvailable && slug
      ? api.pages.queries.isSlugAvailable
      : "skip",
    slug ? { slug, excludePageId } : "skip"
  );
}

/**
 * Hook to get public page by slug
 */
export function usePublicPage(slug: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.public?.getPublicPage && slug
      ? api.pages.public.getPublicPage
      : "skip",
    slug ? { slug } : "skip"
  );
}

/**
 * Hook to get public page by username
 */
export function usePublicPageByUsername(username: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.pages?.public?.getPublicPageByUsername && username
      ? api.pages.public.getPublicPageByUsername
      : "skip",
    username ? { username } : "skip"
  );
}

/**
 * Hook for page mutations
 */
export function usePageMutations() {
  const isAvailable = useConvexAvailable();

  const createPageMutation = useMutation(
    isAvailable && api?.pages?.mutations?.createPage
      ? api.pages.mutations.createPage
      : ("skip" as any)
  );
  const updatePageMutation = useMutation(
    isAvailable && api?.pages?.mutations?.updatePage
      ? api.pages.mutations.updatePage
      : ("skip" as any)
  );
  const deletePageMutation = useMutation(
    isAvailable && api?.pages?.mutations?.deletePage
      ? api.pages.mutations.deletePage
      : ("skip" as any)
  );
  const incrementViewCountMutation = useMutation(
    isAvailable && api?.pages?.public?.incrementViewCount
      ? api.pages.public.incrementViewCount
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      createPage: noOp,
      updatePage: noOp,
      deletePage: noOp,
      incrementViewCount: noOp,
    };
  }

  return {
    createPage: createPageMutation,
    updatePage: updatePageMutation,
    deletePage: deletePageMutation,
    incrementViewCount: incrementViewCountMutation,
  };
}
