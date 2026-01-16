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
 * Hook to get all identities for the current user
 */
export function useUserIdentities() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.queries?.getUserIdentities
      ? api.identities.queries.getUserIdentities
      : "skip"
  );
}

/**
 * Hook to get a specific identity
 */
export function useIdentity(identityId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.queries?.getIdentity && identityId
      ? api.identities.queries.getIdentity
      : "skip",
    identityId ? { identityId } : "skip"
  );
}

/**
 * Hook to get an identity with its theme
 */
export function useIdentityWithTheme(identityId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.queries?.getIdentityWithTheme && identityId
      ? api.identities.queries.getIdentityWithTheme
      : "skip",
    identityId ? { identityId } : "skip"
  );
}

/**
 * Hook to check if a slug is available
 */
export function useSlugAvailable(slug: string, excludeIdentityId?: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.queries?.isSlugAvailable && slug
      ? api.identities.queries.isSlugAvailable
      : "skip",
    slug ? { slug, excludeIdentityId } : "skip"
  );
}

/**
 * Hook to get public identity by slug
 */
export function usePublicIdentity(slug: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.public?.getPublicIdentity && slug
      ? api.identities.public.getPublicIdentity
      : "skip",
    slug ? { slug } : "skip"
  );
}

/**
 * Hook to get public identity by username
 */
export function usePublicIdentityByUsername(username: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.public?.getPublicIdentityByUsername && username
      ? api.identities.public.getPublicIdentityByUsername
      : "skip",
    username ? { username } : "skip"
  );
}

/**
 * Hook to get all links across all user identities (for All Links page)
 */
export function useAllUserLinks() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.identities?.queries?.getAllUserLinks
      ? api.identities.queries.getAllUserLinks
      : "skip"
  );
}

/**
 * Hook for identity mutations
 */
export function useIdentityMutations() {
  const isAvailable = useConvexAvailable();

  const createIdentityMutation = useMutation(
    isAvailable && api?.identities?.mutations?.createIdentity
      ? api.identities.mutations.createIdentity
      : ("skip" as any)
  );
  const updateIdentityMutation = useMutation(
    isAvailable && api?.identities?.mutations?.updateIdentity
      ? api.identities.mutations.updateIdentity
      : ("skip" as any)
  );
  const deleteIdentityMutation = useMutation(
    isAvailable && api?.identities?.mutations?.deleteIdentity
      ? api.identities.mutations.deleteIdentity
      : ("skip" as any)
  );
  const incrementViewCountMutation = useMutation(
    isAvailable && api?.identities?.public?.incrementViewCount
      ? api.identities.public.incrementViewCount
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      createIdentity: noOp,
      updateIdentity: noOp,
      deleteIdentity: noOp,
      incrementViewCount: noOp,
    };
  }

  return {
    createIdentity: createIdentityMutation,
    updateIdentity: updateIdentityMutation,
    deleteIdentity: deleteIdentityMutation,
    incrementViewCount: incrementViewCountMutation,
  };
}
