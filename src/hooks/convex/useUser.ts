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
 * Hook to check if a username is available
 */
export function useUsernameAvailable(username: string) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.users?.queries?.isUsernameAvailable && username
      ? api.users.queries.isUsernameAvailable
      : "skip",
    username ? { username } : "skip"
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
