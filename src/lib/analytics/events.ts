/**
 * Analytics event definitions
 * Type-safe event names and payloads
 */

// ============================================
// Event Names
// ============================================

export const AnalyticsEvents = {
  // Page events
  PAGE_VIEW: "page_view",
  PAGE_CREATED: "page_created",
  PAGE_UPDATED: "page_updated",
  PAGE_DELETED: "page_deleted",

  // Link events
  LINK_CLICK: "link_click",
  LINK_CREATED: "link_created",
  LINK_UPDATED: "link_updated",
  LINK_DELETED: "link_deleted",
  LINKS_REORDERED: "links_reordered",

  // User events
  USER_SIGNED_UP: "user_signed_up",
  USER_SIGNED_IN: "user_signed_in",
  USER_SIGNED_OUT: "user_signed_out",

  // Theme events
  THEME_CHANGED: "theme_changed",

  // General
  FEATURE_USED: "feature_used",
  ERROR_OCCURRED: "error_occurred",
} as const

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]

// ============================================
// Event Payloads
// ============================================

export interface PageViewEvent {
  page_id: number
  page_slug: string
  page_name?: string
  referrer?: string
  is_public: boolean
}

export interface LinkClickEvent {
  link_id: number
  page_id: number
  page_slug: string
  link_url: string
  link_title: string
  link_position: number
}

export interface PageCreatedEvent {
  page_id: number
  page_slug: string
  page_name: string
  is_public: boolean
}

export interface PageUpdatedEvent {
  page_id: number
  page_slug: string
  fields_updated: string[]
}

export interface PageDeletedEvent {
  page_id: number
  page_slug: string
}

export interface LinkCreatedEvent {
  link_id: number
  page_id: number
  link_title: string
  link_url: string
}

export interface LinkUpdatedEvent {
  link_id: number
  page_id: number
  fields_updated: string[]
}

export interface LinkDeletedEvent {
  link_id: number
  page_id: number
}

export interface LinksReorderedEvent {
  page_id: number
  link_count: number
}

export interface ThemeChangedEvent {
  page_id: number
  theme_id: number
  theme_name: string
}

export interface FeatureUsedEvent {
  feature_name: string
  context?: string
}

export interface ErrorOccurredEvent {
  error_type: string
  error_message: string
  error_context?: string
}

// Union type for all event payloads
export type AnalyticsEventPayload =
  | PageViewEvent
  | LinkClickEvent
  | PageCreatedEvent
  | PageUpdatedEvent
  | PageDeletedEvent
  | LinkCreatedEvent
  | LinkUpdatedEvent
  | LinkDeletedEvent
  | LinksReorderedEvent
  | ThemeChangedEvent
  | FeatureUsedEvent
  | ErrorOccurredEvent
