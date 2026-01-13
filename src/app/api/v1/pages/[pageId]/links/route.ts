/**
 * Page links API routes
 * GET /api/v1/pages/:pageId/links - Get links for a page
 * POST /api/v1/pages/:pageId/links - Create a link on a page
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
  CreateLinkSchema,
} from "@/lib/api"
import {
  getPageLinks,
  createLink,
  PageNotFoundError,
  NotAuthorizedError,
} from "@/data/links"

type RouteParams = { params: Promise<{ pageId: string }> }

/**
 * GET /api/v1/pages/:pageId/links
 * Get all links for a page
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { pageId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "list"),
      RateLimitConfigs.lenient
    )

    const id = parseInt(pageId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid page ID")
    }

    try {
      const links = await getPageLinks(id, userId)
      return successResponse(links)
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Page")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * POST /api/v1/pages/:pageId/links
 * Create a new link on a page
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { pageId } = await params
    const userId = await requireAuth()

    // Rate limit - stricter for mutations
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "create"),
      RateLimitConfigs.strict
    )

    const id = parseInt(pageId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid page ID")
    }

    // Validate request body (without page_id since it comes from URL)
    const body = await validateBody(request, CreateLinkSchema.omit({ page_id: true }))

    try {
      const link = await createLink(userId, { ...body, page_id: id })
      return successResponse(link)
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Page")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}
