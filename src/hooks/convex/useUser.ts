"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Hook to get the current user
 */
export function useCurrentUser() {
  return useQuery(api.users.queries.getCurrentUser);
}

/**
 * Hook to get user by username
 */
export function useUserByUsername(username: string) {
  return useQuery(api.users.queries.getUserByUsername, { username });
}

/**
 * Hook to check if a username is available
 */
export function useUsernameAvailable(username: string) {
  return useQuery(api.users.queries.isUsernameAvailable, { username });
}

/**
 * Hook for user mutations
 */
export function useUserMutations() {
  const updateUser = useMutation(api.users.mutations.updateUser);
  const updateUsername = useMutation(api.users.mutations.updateUsername);
  const deleteUser = useMutation(api.users.mutations.deleteUser);

  return {
    updateUser,
    updateUsername,
    deleteUser,
  };
}
