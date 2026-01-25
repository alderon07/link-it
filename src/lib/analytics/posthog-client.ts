/**
 * PostHog client-side initialization and helpers
 */
import posthog from "posthog-js"
import type { AnalyticsEventName, AnalyticsEventPayload } from "./events"

// Application identifier for multi-app PostHog projects
const APP_NAME = "link-it"

// ============================================
// Initialization
// ============================================

let isInitialized = false

/**
 * Initialize PostHog on the client side
 * Should be called once in the app root
 */
export function initPostHog(): void {
  if (typeof window === "undefined") return
  if (isInitialized) return

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

  if (!apiKey) {
    console.warn("PostHog API key not configured")
    return
  }

  posthog.init(apiKey, {
    api_host: "/ingest", // Proxy through our domain to avoid ad blockers
    ui_host: apiHost, // Keep UI links pointing to PostHog
    capture_pageview: false, // We handle this manually for more control
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false, // Disable autocapture for cleaner data
    disable_session_recording: process.env.NODE_ENV === "development",
    capture_performance: false, // Disable Web Vitals capture
    loaded: (ph) => {
      // Enable debug mode in development
      if (process.env.NODE_ENV === "development") {
        ph.debug()
      }
    },
  })

  isInitialized = true
}

/**
 * Get the PostHog instance
 */
export function getPostHog(): typeof posthog | null {
  if (typeof window === "undefined") return null
  if (!isInitialized) return null
  return posthog
}

// ============================================
// User Identification
// ============================================

/**
 * Identify a user after authentication
 */
export function identifyUser(
  userId: string,
  properties?: {
    email?: string
    name?: string
    username?: string
    avatar_url?: string
    [key: string]: unknown
  }
): void {
  const ph = getPostHog()
  if (!ph) return

  ph.identify(userId, properties)
}

/**
 * Reset user identification (on logout)
 */
export function resetUser(): void {
  const ph = getPostHog()
  if (!ph) return

  ph.reset()
}

/**
 * Set user properties without identifying
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  const ph = getPostHog()
  if (!ph) return

  ph.people.set(properties)
}

// ============================================
// Event Tracking
// ============================================

/**
 * Track an analytics event
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: AnalyticsEventPayload | Record<string, unknown>
): void {
  const ph = getPostHog()
  if (!ph) return

  ph.capture(eventName, {
    ...properties,
    app: APP_NAME,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track a page view
 */
export function trackPageView(properties?: {
  page_id?: number
  page_slug?: string
  page_name?: string
  referrer?: string
  [key: string]: unknown
}): void {
  const ph = getPostHog()
  if (!ph) return

  ph.capture("$pageview", {
    ...properties,
    app: APP_NAME,
    $current_url: window.location.href,
    $referrer: properties?.referrer || document.referrer,
  })
}

// ============================================
// Feature Flags (if using PostHog feature flags)
// ============================================

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flagName: string): boolean {
  const ph = getPostHog()
  if (!ph) return false

  return ph.isFeatureEnabled(flagName) ?? false
}

/**
 * Get feature flag payload
 */
export function getFeatureFlag(flagName: string): string | boolean | undefined {
  const ph = getPostHog()
  if (!ph) return undefined

  return ph.getFeatureFlag(flagName)
}

// ============================================
// Groups (for organization/team tracking)
// ============================================

/**
 * Associate user with a group
 */
export function setGroup(groupType: string, groupKey: string, groupProperties?: Record<string, unknown>): void {
  const ph = getPostHog()
  if (!ph) return

  ph.group(groupType, groupKey, groupProperties)
}

// Export posthog instance for direct access if needed
export { posthog }
