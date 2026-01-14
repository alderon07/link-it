"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

/**
 * Hook to get all pages for the current user
 */
export function useUserPages() {
  return useQuery(api.pages.queries.getUserPages);
}

/**
 * Hook to get a specific page
 */
export function usePage(pageId: Id<"pages"> | undefined) {
  return useQuery(
    api.pages.queries.getPage,
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get a page with its theme
 */
export function usePageWithTheme(pageId: Id<"pages"> | undefined) {
  return useQuery(
    api.pages.queries.getPageWithTheme,
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to check if a slug is available
 */
export function useSlugAvailable(
  slug: string,
  excludePageId?: Id<"pages">
) {
  return useQuery(api.pages.queries.isSlugAvailable, {
    slug,
    excludePageId,
  });
}

/**
 * Hook to get public page by slug
 */
export function usePublicPage(slug: string) {
  return useQuery(api.pages.public.getPublicPage, { slug });
}

/**
 * Hook to get public page by username
 */
export function usePublicPageByUsername(username: string) {
  return useQuery(api.pages.public.getPublicPageByUsername, { username });
}

/**
 * Hook for page mutations
 */
export function usePageMutations() {
  const createPage = useMutation(api.pages.mutations.createPage);
  const updatePage = useMutation(api.pages.mutations.updatePage);
  const deletePage = useMutation(api.pages.mutations.deletePage);
  const incrementViewCount = useMutation(api.pages.public.incrementViewCount);

  return {
    createPage,
    updatePage,
    deletePage,
    incrementViewCount,
  };
}
