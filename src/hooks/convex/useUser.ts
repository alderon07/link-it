"use client";

import { useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { useConvexAvailable } from "@/components/providers/ConvexClientProvider";

// Conditionally import to avoid errors when Convex isn't configured
let api: any = null;
try {
  api = require("../../../convex/_generated/api").api;
} catch {
  // Convex not initialized yet
}

/**
 * Hook to get the current user
 */
export function useCurrentUser() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.users?.queries?.getCurrentUser
      ? api.users.queries.getCurrentUser
      : "skip"
  );
}

/**
 * Hook that ensures the current authenticated user exists in Convex.
 * This should be used on authenticated pages to sync the user from Clerk to Convex.
 * It will automatically create the user in Convex if they don't exist.
 * 
 * Uses useConvexAuth to wait for the auth token to be synchronized with Convex
 * before attempting to create the user.
 */
export function useSyncUser() {
  const isAvailable = useConvexAvailable();
  // Use Convex's auth hook to ensure the token is synchronized
  const { isAuthenticated, isLoading } = useConvexAuth();
  const hasSyncedRef = useRef(false);

  const getOrCreateCurrentUser = useMutation(
    isAvailable && api?.users?.mutations?.getOrCreateCurrentUser
      ? api.users.mutations.getOrCreateCurrentUser
      : ("skip" as any)
  );

  const syncUser = useCallback(async () => {
    // Wait until Convex auth is ready and user is authenticated
    if (!isAvailable || !isAuthenticated || isLoading || hasSyncedRef.current) {
      return;
    }

    try {
      await getOrCreateCurrentUser({});
      hasSyncedRef.current = true;
    } catch (error) {
      console.error("Failed to sync user to Convex:", error);
    }
  }, [isAvailable, isAuthenticated, isLoading, getOrCreateCurrentUser]);

  useEffect(() => {
    // Only sync when Convex auth is fully loaded and user is authenticated
    if (!isLoading && isAuthenticated && isAvailable && !hasSyncedRef.current) {
      syncUser();
    }
  }, [isLoading, isAuthenticated, isAvailable, syncUser]);

  // Reset the sync flag when user signs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      hasSyncedRef.current = false;
    }
  }, [isAuthenticated, isLoading]);

  return { syncUser };
}

/**
 * Hook to get user by username
 */
export function useUserByUsername(username: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.users?.queries?.getUserByUsername && username
      ? api.users.queries.getUserByUsername
      : "skip",
    username ? { username } : "skip"
  );
}

/**
 * Hook to get user by Clerk ID
 */
export function useUserByClerkId(clerkUserId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.users?.queries?.getUserByClerkId && clerkUserId
      ? api.users.queries.getUserByClerkId
      : "skip",
    clerkUserId ? { clerkUserId } : "skip"
  );
}

/**
 * Hook to check if a username is available
 * @param username - The username to check
 * @param excludeUserId - Optional user ID to exclude from the check (useful for updates)
 */
export function useUsernameAvailable(username: string, excludeUserId?: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.users?.queries?.isUsernameAvailable && username
      ? api.users.queries.isUsernameAvailable
      : "skip",
    username ? { username, excludeUserId } : "skip"
  );
}

/**
 * Hook for user mutations
 */
export function useUserMutations() {
  const isAvailable = useConvexAvailable();

  const updateUserMutation = useMutation(
    isAvailable && api?.users?.mutations?.updateUser
      ? api.users.mutations.updateUser
      : ("skip" as any)
  );
  const updateUsernameMutation = useMutation(
    isAvailable && api?.users?.mutations?.updateUsername
      ? api.users.mutations.updateUsername
      : ("skip" as any)
  );
  const deleteUserMutation = useMutation(
    isAvailable && api?.users?.mutations?.deleteUser
      ? api.users.mutations.deleteUser
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      updateUser: noOp,
      updateUsername: noOp,
      deleteUser: noOp,
    };
  }

  return {
    updateUser: updateUserMutation,
    updateUsername: updateUsernameMutation,
    deleteUser: deleteUserMutation,
  };
}
