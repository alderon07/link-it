/**
 * Pages API routes
 * GET /api/v1/pages - List user's pages
 * POST /api/v1/pages - Create a new page
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
 * GET /api/v1/pages
 * List all pages for the authenticated user
 */
export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    // Require authentication
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "pages", "list"),
      RateLimitConfigs.lenient
    )

    // Parse pagination params
    const pagination = await parseSearchParams(
      request.nextUrl.searchParams,
      PaginationSchema
    )

    // Get user's pages
    const result = await getUserPages(userId, pagination)

    return successResponse(result.data, result.meta)
  })
}

/**
 * POST /api/v1/pages
 * Create a new page
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Require authentication
    const userId = await requireAuth()

    // Rate limit - stricter for mutations
    await requireRateLimit(
      buildRateLimitId("user", userId, "pages", "create"),
      RateLimitConfigs.strict
    )

    // Validate request body
    const data = await validateBody(request, CreatePageSchema)

    try {
      // Create the page
      const page = await createPage(userId, data)
      return successResponse(page, undefined)
    } catch (error) {
      if (error instanceof SlugTakenError) {
        return ApiErrors.conflict(error.message)
      }
      throw error
    }
  })
}
