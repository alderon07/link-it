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
 * Hook to get dashboard stats for the current user
 */
export function useDashboardStats() {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.analytics?.queries?.getDashboardStats
      ? api.analytics.queries.getDashboardStats
      : "skip"
  );
}

/**
 * Hook to get analytics for a specific page
 */
export function usePageAnalytics(pageId: string | undefined, days?: number) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.analytics?.queries?.getPageAnalytics && pageId
      ? api.analytics.queries.getPageAnalytics
      : "skip",
    pageId ? { pageId, days } : "skip"
  );
}

/**
 * Hook to get global analytics across all pages
 */
export function useGlobalAnalytics(days?: number) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.analytics?.queries?.getGlobalAnalytics
      ? api.analytics.queries.getGlobalAnalytics
      : "skip",
    { days }
  );
}

/**
 * Hook to get recent activity
 */
export function useRecentActivity(limit?: number) {
  const isAvailable = useConvexAvailable();
  return useQuery(
    isAvailable && api?.analytics?.queries?.getRecentActivity
      ? api.analytics.queries.getRecentActivity
      : "skip",
    { limit }
  );
}

/**
 * Hook for seed mutations (for development/testing)
 */
export function useSeedMutations() {
  const isAvailable = useConvexAvailable();

  const seedMyDataMutation = useMutation(
    isAvailable && api?.seed?.seedMyData
      ? api.seed.seedMyData
      : ("skip" as any)
  );
  const clearMyDataMutation = useMutation(
    isAvailable && api?.seed?.clearMyData
      ? api.seed.clearMyData
      : ("skip" as any)
  );

  if (!isAvailable) {
    const noOp = async () => {
      console.warn("Convex not configured - mutation skipped");
    };
    return {
      seedMyData: noOp,
      clearMyData: noOp,
    };
  }

  return {
    seedMyData: seedMyDataMutation,
    clearMyData: clearMyDataMutation,
  };
}
