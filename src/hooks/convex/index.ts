// Convex availability check
export { useConvexAvailable } from "@/components/providers/ConvexClientProvider";

// User hooks
export { useCurrentUser, useUserByUsername, useUserByClerkId, useUsernameAvailable, useUserMutations, useSyncUser } from "./useUser";

// Identity hooks
export {
  useUserIdentities,
  useIdentity,
  useIdentityWithTheme,
  useSlugAvailable,
  usePublicIdentity,
  usePublicIdentityByUsername,
  useIdentityMutations,
  useAllUserLinks,
} from "./useIdentities";

// Link hooks
export {
  useIdentityLinks,
  useLink,
  useIdentityLinkStats,
  usePublicIdentityLinks,
  usePublicLinksBySlug,
  useLinkMutations,
} from "./useLinks";

// Theme hooks
export {
  useTheme,
  useSystemThemes,
  useUserThemes,
  useAllThemes,
  useCanEditTheme,
  useThemeMutations,
} from "./useThemes";

// Analytics hooks
export {
  useDashboardStats,
  useIdentityAnalytics,
  useGlobalAnalytics,
  useRecentActivity,
  useSeedMutations,
} from "./useAnalytics";

// Settings hooks
export {
  useUserSettings,
  useUserProgress,
  useUserData,
  useSettingsMutations,
} from "./useSettings";
