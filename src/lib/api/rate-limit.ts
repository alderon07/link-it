import { ApiErrors } from "./response"

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum requests allowed in the window */
  maxRequests: number
}

/**
 * Rate limit result
 */
interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Remaining requests in the current window */
  remaining: number
  /** Timestamp when the window resets */
  resetAt: number
  /** Total requests made in current window */
  current: number
}

/**
 * Rate limit entry stored in memory
 */
interface RateLimitEntry {
  count: number
  resetAt: number
}

/**
 * Pre-configured rate limit configurations
 */
export const RateLimitConfigs = {
  /** Default: 60 requests per minute */
  default: { windowMs: 60_000, maxRequests: 60 },
  /** Strict: 10 requests per minute (for mutations) */
  strict: { windowMs: 60_000, maxRequests: 10 },
  /** Very strict: 5 requests per minute (for sensitive operations) */
  veryStrict: { windowMs: 60_000, maxRequests: 5 },
  /** Lenient: 100 requests per minute (for read operations) */
  lenient: { windowMs: 60_000, maxRequests: 100 },
  /** Analytics: 100 requests per second (for high-volume tracking) */
  analytics: { windowMs: 1_000, maxRequests: 100 },
  /** Auth: 5 requests per minute (for login attempts) */
  auth: { windowMs: 60_000, maxRequests: 5 },
} as const

/**
 * In-memory rate limit store.
 * In production, replace with Redis or similar.
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Clean up expired entries periodically
 */
const CLEANUP_INTERVAL = 60_000 // 1 minute
let lastCleanup = Date.now()

function cleanupExpiredEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
  lastCleanup = now
}

/**
 * Check rate limit for an identifier.
 *
 * @param identifier - Unique identifier (e.g., "userId:endpoint" or "ip:endpoint")
 * @param config - Rate limit configuration
 * @returns Rate limit result
 *
 * @example
 * ```ts
 * const { allowed, remaining } = await checkRateLimit(`user:${userId}:pages`, RateLimitConfigs.strict)
 * if (!allowed) {
 *   return ApiErrors.rateLimited()
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimitConfigs.default
): Promise<RateLimitResult> {
  // Periodic cleanup
  cleanupExpiredEntries()

  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  // No entry or expired window - create new entry
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    rateLimitStore.set(identifier, newEntry)

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
      current: 1,
    }
  }

  // Window still active - check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      current: entry.count,
    }
  }

  // Increment count
  entry.count++

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    current: entry.count,
  }
}

/**
 * Rate limit error that can be thrown and caught by error handler
 */
export class RateLimitError extends Error {
  response: ReturnType<typeof ApiErrors.rateLimited>
  retryAfter: number

  constructor(resetAt: number) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds.`)
    this.retryAfter = retryAfter
    this.response = ApiErrors.rateLimited(retryAfter)
  }
}

/**
 * Check rate limit and throw if exceeded.
 *
 * @example
 * ```ts
 * await requireRateLimit(`user:${userId}:pages`, RateLimitConfigs.strict)
 * // continues if not rate limited
 * ```
 */
export async function requireRateLimit(
  identifier: string,
  config: RateLimitConfig = RateLimitConfigs.default
): Promise<RateLimitResult> {
  const result = await checkRateLimit(identifier, config)

  if (!result.allowed) {
    throw new RateLimitError(result.resetAt)
  }

  return result
}

/**
 * Build a rate limit identifier from components.
 *
 * @example
 * ```ts
 * const identifier = buildRateLimitId("user", userId, "pages", "create")
 * // Returns: "user:abc123:pages:create"
 * ```
 */
export function buildRateLimitId(...parts: (string | number)[]): string {
  return parts.map(String).join(":")
}

/**
 * Reset rate limit for an identifier (useful for testing)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = RateLimitConfigs.default
): RateLimitResult | null {
  const entry = rateLimitStore.get(identifier)

  if (!entry || Date.now() > entry.resetAt) {
    return null
  }

  return {
    allowed: entry.count < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
    current: entry.count,
  }
}
