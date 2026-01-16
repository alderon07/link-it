// Convex availability check
export { useConvexAvailable } from "@/components/providers/ConvexClientProvider";

// User hooks
export { useCurrentUser, useUserByUsername, useUserByClerkId, useUsernameAvailable, useUserMutations } from "./useUser";

// Page hooks
export {
  useUserPages,
  usePage,
  usePageWithTheme,
  useSlugAvailable,
  usePublicPage,
  usePublicPageByUsername,
  usePageMutations,
  useAllUserLinks,
} from "./usePages";

// Link hooks
export {
  usePageLinks,
  useLink,
  usePageLinkStats,
  usePublicPageLinks,
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
  usePageAnalytics,
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
