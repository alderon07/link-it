/**
 * Analytics module exports
 */

// Events
export {
  AnalyticsEvents,
  type AnalyticsEventName,
  type AnalyticsEventPayload,
  type PageViewEvent,
  type LinkClickEvent,
  type PageCreatedEvent,
  type PageUpdatedEvent,
  type PageDeletedEvent,
  type LinkCreatedEvent,
  type LinkUpdatedEvent,
  type LinkDeletedEvent,
  type LinksReorderedEvent,
  type ThemeChangedEvent,
  type FeatureUsedEvent,
  type ErrorOccurredEvent,
} from "./events"

// Client-side
export {
  initPostHog,
  getPostHog,
  identifyUser,
  resetUser,
  setUserProperties,
  trackEvent,
  trackPageView,
  isFeatureEnabled,
  getFeatureFlag,
  setGroup,
  posthog,
} from "./posthog-client"

// Server-side
export {
  getServerPostHog,
  shutdownPostHog,
  trackServerEvent,
  trackServerPageView,
  identifyServerUser,
  aliasServerUser,
  isServerFeatureEnabled,
  getServerFeatureFlags,
} from "./posthog-server"
