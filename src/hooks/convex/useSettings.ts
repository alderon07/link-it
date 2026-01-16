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
 * Hook to get user settings
 */
export function useUserSettings() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.settings?.queries?.getUserSettings
      ? api.settings.queries.getUserSettings
      : "skip"
  );
}

/**
 * Hook to get user progress
 */
export function useUserProgress() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.settings?.queries?.getUserProgress
      ? api.settings.queries.getUserProgress
      : "skip"
  );
}

/**
 * Hook to get combined user data (user, settings, progress)
 */
export function useUserData() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.settings?.queries?.getUserData
      ? api.settings.queries.getUserData
      : "skip"
  );
}

/**
 * Hook for settings mutations
 */
export function useSettingsMutations() {
  const isAvailable = useConvexAvailable();

  const updateSettingsMutation = useMutation(
    isAvailable && api?.settings?.mutations?.updateSettings
      ? api.settings.mutations.updateSettings
      : ("skip" as any)
  );
  const updateProgressMutation = useMutation(
    isAvailable && api?.settings?.mutations?.updateProgress
      ? api.settings.mutations.updateProgress
      : ("skip" as any)
  );
  const completeIntroMutation = useMutation(
    isAvailable && api?.settings?.mutations?.completeIntro
      ? api.settings.mutations.completeIntro
      : ("skip" as any)
  );

  // Return no-op functions if Convex isn't available
  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      updateSettings: noOp,
      updateProgress: noOp,
      completeIntro: noOp,
    };
  }

  return {
    updateSettings: updateSettingsMutation,
    updateProgress: updateProgressMutation,
    completeIntro: completeIntroMutation,
  };
}
