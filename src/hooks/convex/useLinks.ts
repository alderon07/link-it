"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

/**
 * Hook to get links for a page (authenticated)
 */
export function usePageLinks(pageId: Id<"pages"> | undefined) {
  return useQuery(
    api.links.queries.getPageLinks,
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get a specific link
 */
export function useLink(linkId: Id<"links"> | undefined) {
  return useQuery(
    api.links.queries.getLink,
    linkId ? { linkId } : "skip"
  );
}

/**
 * Hook to get link stats for a page
 */
export function usePageLinkStats(pageId: Id<"pages"> | undefined) {
  return useQuery(
    api.links.queries.getPageLinkStats,
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get public links for a page
 */
export function usePublicPageLinks(pageId: Id<"pages"> | undefined) {
  return useQuery(
    api.links.public.getPublicPageLinks,
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get public links by slug
 */
export function usePublicLinksBySlug(slug: string) {
  return useQuery(api.links.public.getPublicLinksBySlug, { slug });
}

/**
 * Hook for link mutations
 */
export function useLinkMutations() {
  const createLink = useMutation(api.links.mutations.createLink);
  const updateLink = useMutation(api.links.mutations.updateLink);
  const deleteLink = useMutation(api.links.mutations.deleteLink);
  const reorderLinks = useMutation(api.links.mutations.reorderLinks);
  const trackClick = useMutation(api.links.public.trackClick);
  const incrementClickCount = useMutation(api.links.public.incrementClickCount);

  return {
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    trackClick,
    incrementClickCount,
  };
}
