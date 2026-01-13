"use client"

/**
 * PostHog Provider for React
 * Initializes PostHog and provides analytics context
 */
import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  initPostHog,
  identifyUser,
  resetUser,
  trackPageView,
} from "@/lib/analytics/posthog-client"

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user, isLoaded, isSignedIn } = useUser()
  const prevUserId = useRef<string | null>(null)

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog()
  }, [])

  // Handle user identification
  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      // Only identify if user changed
      if (prevUserId.current !== user.id) {
        identifyUser(user.id, {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || undefined,
          username: user.username || undefined,
          avatar_url: user.imageUrl,
          created_at: user.createdAt?.toISOString(),
        })
        prevUserId.current = user.id
      }
    } else if (prevUserId.current) {
      // User signed out
      resetUser()
      prevUserId.current = null
    }
  }, [isLoaded, isSignedIn, user])

  // Track page views on route change
  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    trackPageView({
      path: pathname,
      url,
    })
  }, [pathname, searchParams])

  return <>{children}</>
}

// Re-export analytics functions for convenience
export {
  trackEvent,
  trackPageView,
  identifyUser,
  resetUser,
  isFeatureEnabled,
  getFeatureFlag,
} from "@/lib/analytics/posthog-client"
