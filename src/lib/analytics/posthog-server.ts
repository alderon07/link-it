/**
 * PostHog server-side client for API routes and server components
 */
import { PostHog } from "posthog-node"
import type { AnalyticsEventName, AnalyticsEventPayload } from "./events"

// ============================================
// Server-side PostHog Client
// ============================================

let serverPostHog: PostHog | null = null

/**
 * Get the server-side PostHog client
 */
export function getServerPostHog(): PostHog | null {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

  if (!apiKey) {
    return null
  }

  if (!serverPostHog) {
    serverPostHog = new PostHog(apiKey, {
      host: apiHost,
      flushAt: 1, // Send events immediately in serverless environment
      flushInterval: 0,
    })
  }

  return serverPostHog
}

/**
 * Shutdown PostHog (call in serverless function cleanup)
 */
export async function shutdownPostHog(): Promise<void> {
  if (serverPostHog) {
    await serverPostHog.shutdown()
    serverPostHog = null
  }
}

// ============================================
// Server-side Event Tracking
// ============================================

/**
 * Track an event from the server
 */
export function trackServerEvent(
  distinctId: string,
  eventName: AnalyticsEventName,
  properties?: AnalyticsEventPayload | Record<string, unknown>
): void {
  const ph = getServerPostHog()
  if (!ph) return

  ph.capture({
    distinctId,
    event: eventName,
    properties: {
      ...properties,
      $lib: "posthog-node",
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Track a page view from the server (for SSR pages)
 */
export function trackServerPageView(
  distinctId: string,
  properties: {
    page_id?: number
    page_slug?: string
    page_name?: string
    url: string
    referrer?: string
    [key: string]: unknown
  }
): void {
  const ph = getServerPostHog()
  if (!ph) return

  ph.capture({
    distinctId,
    event: "$pageview",
    properties: {
      ...properties,
      $current_url: properties.url,
      $referrer: properties.referrer,
      $lib: "posthog-node",
    },
  })
}

/**
 * Identify a user from the server
 */
export function identifyServerUser(
  distinctId: string,
  properties?: {
    email?: string
    name?: string
    username?: string
    [key: string]: unknown
  }
): void {
  const ph = getServerPostHog()
  if (!ph) return

  ph.identify({
    distinctId,
    properties,
  })
}

/**
 * Create an alias for a user (for linking anonymous to identified)
 */
export function aliasServerUser(
  distinctId: string,
  alias: string
): void {
  const ph = getServerPostHog()
  if (!ph) return

  ph.alias({
    distinctId,
    alias,
  })
}

// ============================================
// Feature Flags (Server-side)
// ============================================

/**
 * Check if a feature flag is enabled for a user
 */
export async function isServerFeatureEnabled(
  distinctId: string,
  flagName: string
): Promise<boolean> {
  const ph = getServerPostHog()
  if (!ph) return false

  return await ph.isFeatureEnabled(flagName, distinctId) ?? false
}

/**
 * Get all feature flags for a user
 */
export async function getServerFeatureFlags(
  distinctId: string
): Promise<Record<string, boolean | string>> {
  const ph = getServerPostHog()
  if (!ph) return {}

  const flags = await ph.getAllFlags(distinctId)
  return flags as Record<string, boolean | string>
}
