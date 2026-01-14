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

/**
 * Hook to get links for a page (authenticated)
 */
export function usePageLinks(pageId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.links?.queries?.getPageLinks && pageId
      ? api.links.queries.getPageLinks
      : "skip",
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get a specific link
 */
export function useLink(linkId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.links?.queries?.getLink && linkId
      ? api.links.queries.getLink
      : "skip",
    linkId ? { linkId } : "skip"
  );
}

/**
 * Hook to get link stats for a page
 */
export function usePageLinkStats(pageId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.links?.queries?.getPageLinkStats && pageId
      ? api.links.queries.getPageLinkStats
      : "skip",
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get public links for a page
 */
export function usePublicPageLinks(pageId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.links?.public?.getPublicPageLinks && pageId
      ? api.links.public.getPublicPageLinks
      : "skip",
    pageId ? { pageId } : "skip"
  );
}

/**
 * Hook to get public links by slug
 */
export function usePublicLinksBySlug(slug: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.links?.public?.getPublicLinksBySlug && slug
      ? api.links.public.getPublicLinksBySlug
      : "skip",
    slug ? { slug } : "skip"
  );
}

/**
 * Hook for link mutations
 */
export function useLinkMutations() {
  const isAvailable = useConvexAvailable();

  const createLinkMutation = useMutation(
    isAvailable && api?.links?.mutations?.createLink
      ? api.links.mutations.createLink
      : ("skip" as any)
  );
  const updateLinkMutation = useMutation(
    isAvailable && api?.links?.mutations?.updateLink
      ? api.links.mutations.updateLink
      : ("skip" as any)
  );
  const deleteLinkMutation = useMutation(
    isAvailable && api?.links?.mutations?.deleteLink
      ? api.links.mutations.deleteLink
      : ("skip" as any)
  );
  const reorderLinksMutation = useMutation(
    isAvailable && api?.links?.mutations?.reorderLinks
      ? api.links.mutations.reorderLinks
      : ("skip" as any)
  );
  const trackClickMutation = useMutation(
    isAvailable && api?.links?.public?.trackClick
      ? api.links.public.trackClick
      : ("skip" as any)
  );
  const incrementClickCountMutation = useMutation(
    isAvailable && api?.links?.public?.incrementClickCount
      ? api.links.public.incrementClickCount
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      createLink: noOp,
      updateLink: noOp,
      deleteLink: noOp,
      reorderLinks: noOp,
      trackClick: noOp,
      incrementClickCount: noOp,
    };
  }

  return {
    createLink: createLinkMutation,
    updateLink: updateLinkMutation,
    deleteLink: deleteLinkMutation,
    reorderLinks: reorderLinksMutation,
    trackClick: trackClickMutation,
    incrementClickCount: incrementClickCountMutation,
  };
}
