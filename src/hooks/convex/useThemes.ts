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
 * Hook to get a specific theme
 */
export function useTheme(themeId: string | undefined) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.themes?.queries?.getTheme && themeId
      ? api.themes.queries.getTheme
      : "skip",
    themeId ? { themeId } : "skip"
  );
}

/**
 * Hook to get all system themes
 */
export function useSystemThemes() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.themes?.queries?.getSystemThemes
      ? api.themes.queries.getSystemThemes
      : "skip"
  );
}

/**
 * Hook to get user's custom themes
 */
export function useUserThemes() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.themes?.queries?.getUserThemes
      ? api.themes.queries.getUserThemes
      : "skip"
  );
}

/**
 * Hook to get all available themes (system + user custom)
 */
export function useAllThemes() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.themes?.queries?.getAllAvailableThemes
      ? api.themes.queries.getAllAvailableThemes
      : "skip"
  );
}

/**
 * Hook for theme mutations
 */
export function useThemeMutations() {
  const isAvailable = useConvexAvailable();

  const createThemeMutation = useMutation(
    isAvailable && api?.themes?.mutations?.createTheme
      ? api.themes.mutations.createTheme
      : ("skip" as any)
  );
  const updateThemeMutation = useMutation(
    isAvailable && api?.themes?.mutations?.updateTheme
      ? api.themes.mutations.updateTheme
      : ("skip" as any)
  );
  const deleteThemeMutation = useMutation(
    isAvailable && api?.themes?.mutations?.deleteTheme
      ? api.themes.mutations.deleteTheme
      : ("skip" as any)
  );
  const duplicateThemeMutation = useMutation(
    isAvailable && api?.themes?.mutations?.duplicateTheme
      ? api.themes.mutations.duplicateTheme
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      createTheme: noOp,
      updateTheme: noOp,
      deleteTheme: noOp,
      duplicateTheme: noOp,
    };
  }

  return {
    createTheme: createThemeMutation,
    updateTheme: updateThemeMutation,
    deleteTheme: deleteThemeMutation,
    duplicateTheme: duplicateThemeMutation,
  };
}
