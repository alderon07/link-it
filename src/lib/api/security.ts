import { NextRequest } from "next/server"
import { headers } from "next/headers"

/**
 * Get the client's IP address from the request.
 * Handles common proxy headers.
 */
export function getClientIp(request: NextRequest): string {
  // Check x-forwarded-for first (common for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, first is the client
    const ips = forwarded.split(",").map((ip) => ip.trim())
    const clientIp = ips[0]
    if (clientIp && isValidIp(clientIp)) {
      return clientIp
    }
  }

  // Check x-real-ip (common for nginx)
  const realIp = request.headers.get("x-real-ip")
  if (realIp && isValidIp(realIp)) {
    return realIp
  }

  // Check cf-connecting-ip (Cloudflare)
  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp && isValidIp(cfIp)) {
    return cfIp
  }

  // Check true-client-ip (Akamai, Cloudflare Enterprise)
  const trueClientIp = request.headers.get("true-client-ip")
  if (trueClientIp && isValidIp(trueClientIp)) {
    return trueClientIp
  }

  // Fallback - return unknown (don't trust connection.remoteAddress in serverless)
  return "unknown"
}

/**
 * Basic IP validation
 */
function isValidIp(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(ip)) {
    const parts = ip.split(".").map(Number)
    return parts.every((part) => part >= 0 && part <= 255)
  }

  // IPv6 (simplified check)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
  return ipv6Regex.test(ip)
}

/**
 * Verify that the request origin matches allowed hosts.
 * Use for CSRF protection on API routes.
 */
export function verifyOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")

  // No origin header - might be same-origin or non-browser request
  if (!origin) {
    // Check referer as fallback
    const referer = request.headers.get("referer")
    if (!referer) {
      // No origin or referer - allow for API clients
      // But be cautious - this allows direct API access
      return true
    }

    try {
      const refererUrl = new URL(referer)
      return refererUrl.host === host
    } catch {
      return false
    }
  }

  try {
    const originUrl = new URL(origin)
    const allowedHosts = getAllowedHosts()

    return allowedHosts.some(
      (allowedHost) =>
        originUrl.host === allowedHost ||
        originUrl.host.endsWith(`.${allowedHost}`)
    )
  } catch {
    return false
  }
}

/**
 * Get list of allowed hosts for origin verification
 */
function getAllowedHosts(): string[] {
  const hosts: string[] = []

  // Always allow localhost in development
  if (process.env.NODE_ENV === "development") {
    hosts.push("localhost:3000", "localhost")
  }

  // Add configured app URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try {
      const url = new URL(appUrl)
      hosts.push(url.host)
    } catch {
      // Invalid URL in env
    }
  }

  // Add Vercel preview URLs
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    hosts.push(vercelUrl)
  }

  return hosts
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent") || "unknown"
}

/**
 * Check if request is from a bot/crawler
 */
export function isBot(request: NextRequest): boolean {
  const ua = getUserAgent(request).toLowerCase()
  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "curl",
    "wget",
    "python",
    "java",
    "php",
    "ruby",
  ]
  return botPatterns.some((pattern) => ua.includes(pattern))
}

/**
 * Get request metadata for logging/analytics
 */
export function getRequestMetadata(request: NextRequest): {
  ip: string
  userAgent: string
  referer: string | null
  isBot: boolean
  country: string | null
  city: string | null
} {
  return {
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
    referer: request.headers.get("referer"),
    isBot: isBot(request),
    // Vercel provides geo headers
    country: request.headers.get("x-vercel-ip-country"),
    city: request.headers.get("x-vercel-ip-city"),
  }
}

/**
 * Security headers to add to responses
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

/**
 * Check if a URL is safe (not pointing to internal resources)
 */
export function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url)

    // Only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false
    }

    // Block localhost/internal IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = parsed.hostname.toLowerCase()
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.16.") ||
        hostname === "0.0.0.0"
      ) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(
  data: Record<string, unknown>,
  sensitiveKeys = ["password", "token", "secret", "key", "authorization"]
): Record<string, unknown> {
  const masked: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
      masked[key] = "[REDACTED]"
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskSensitiveData(
        value as Record<string, unknown>,
        sensitiveKeys
      )
    } else {
      masked[key] = value
    }
  }

  return masked
}
