"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

/**
 * Hook to get a specific theme
 */
export function useTheme(themeId: Id<"themes"> | undefined) {
  return useQuery(
    api.themes.queries.getTheme,
    themeId ? { themeId } : "skip"
  );
}

/**
 * Hook to get all system themes
 */
export function useSystemThemes() {
  return useQuery(api.themes.queries.getSystemThemes);
}

/**
 * Hook to get user's custom themes
 */
export function useUserThemes() {
  return useQuery(api.themes.queries.getUserThemes);
}

/**
 * Hook to get all available themes (system + user custom)
 */
export function useAllThemes() {
  return useQuery(api.themes.queries.getAllAvailableThemes);
}

/**
 * Hook for theme mutations
 */
export function useThemeMutations() {
  const createTheme = useMutation(api.themes.mutations.createTheme);
  const updateTheme = useMutation(api.themes.mutations.updateTheme);
  const deleteTheme = useMutation(api.themes.mutations.deleteTheme);
  const duplicateTheme = useMutation(api.themes.mutations.duplicateTheme);

  return {
    createTheme,
    updateTheme,
    deleteTheme,
    duplicateTheme,
  };
}
