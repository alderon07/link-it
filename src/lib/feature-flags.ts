/**
 * Feature Flags System for Trunk-Based Development
 *
 * Use feature flags to ship incomplete features safely.
 * All flags are controlled via environment variables.
 *
 * Usage:
 *   import { isFeatureEnabled, FEATURE_FLAGS } from '@/lib/feature-flags';
 *
 *   if (isFeatureEnabled('ANALYTICS_V2')) {
 *     return <AnalyticsV2 />;
 *   }
 *   return <AnalyticsLegacy />;
 */

/**
 * Feature flag definitions
 *
 * Each flag is controlled by a NEXT_PUBLIC_FF_* environment variable.
 * Set to 'true' to enable, anything else to disable.
 */
export const FEATURE_FLAGS = {
  /**
   * New analytics dashboard with improved visualizations
   * Enable: NEXT_PUBLIC_FF_ANALYTICS_V2=true
   */
  ANALYTICS_V2: process.env.NEXT_PUBLIC_FF_ANALYTICS_V2 === "true",

  /**
   * Dark mode v2 with system preference detection
   * Enable: NEXT_PUBLIC_FF_DARK_MODE_V2=true
   */
  DARK_MODE_V2: process.env.NEXT_PUBLIC_FF_DARK_MODE_V2 === "true",

  /**
   * New link editor with drag-and-drop
   * Enable: NEXT_PUBLIC_FF_NEW_EDITOR=true
   */
  NEW_EDITOR: process.env.NEXT_PUBLIC_FF_NEW_EDITOR === "true",

  /**
   * Enhanced public profile with social preview
   * Enable: NEXT_PUBLIC_FF_ENHANCED_PROFILE=true
   */
  ENHANCED_PROFILE: process.env.NEXT_PUBLIC_FF_ENHANCED_PROFILE === "true",
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature flag is enabled
 *
 * @param flag - The feature flag to check
 * @returns true if the feature is enabled
 *
 * @example
 * if (isFeatureEnabled('ANALYTICS_V2')) {
 *   // New feature code
 * }
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Get all enabled feature flags (useful for debugging)
 *
 * @returns Array of enabled feature flag names
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return (Object.keys(FEATURE_FLAGS) as FeatureFlag[]).filter(
    (flag) => FEATURE_FLAGS[flag]
  );
}

/**
 * React hook for feature flags (for client components)
 *
 * Note: This is a simple implementation. For more complex scenarios,
 * consider using a feature flag service like LaunchDarkly or Statsig.
 *
 * @param flag - The feature flag to check
 * @returns true if the feature is enabled
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  // For SSR consistency, we just return the static value
  // If you need dynamic updates, integrate with a feature flag service
  return FEATURE_FLAGS[flag];
}
