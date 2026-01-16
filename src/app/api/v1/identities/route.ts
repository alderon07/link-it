/**
 * Identities API routes
 * GET /api/v1/identities - List user's identities
 * POST /api/v1/identities - Create a new identity
 */
import { NextRequest } from "next/server"
import {
  successResponse,
  ApiErrors,
  withErrorHandling,
  requireAuth,
  requireRateLimit,
  buildRateLimitId,
  RateLimitConfigs,
  validateBody,
  CreatePageSchema,
  PaginationSchema,
  parseSearchParams,
} from "@/lib/api"
import { getUserPages, createPage, SlugTakenError } from "@/data/pages"

/**
 * GET /api/v1/identities
 * List all identities for the authenticated user
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    // Require authentication
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "identities", "list"),
      RateLimitConfigs.lenient
    )

    // Parse pagination params
    const pagination = await parseSearchParams(
      request.nextUrl.searchParams,
      PaginationSchema
    )

    // Get user's identities
    const result = await getUserPages(userId, pagination)

    return successResponse(result.data, result.meta)
  })
}

/**
 * POST /api/v1/identities
 * Create a new identity
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Require authentication
    const userId = await requireAuth()

    // Rate limit - stricter for mutations
    await requireRateLimit(
      buildRateLimitId("user", userId, "identities", "create"),
      RateLimitConfigs.strict
    )

    // Validate request body
    const data = await validateBody(request, CreatePageSchema)

    try {
      // Create the identity
      const identity = await createPage(userId, data)
      return successResponse(identity, undefined)
    } catch (error) {
      if (error instanceof SlugTakenError) {
        return ApiErrors.conflict(error.message)
      }
      throw error
    }
  })
}
