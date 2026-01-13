/**
 * Single page API routes
 * GET /api/v1/pages/:pageId - Get a page
 * PUT /api/v1/pages/:pageId - Update a page
 * DELETE /api/v1/pages/:pageId - Delete a page
 */
import { NextRequest } from "next/server"
import {
  successResponse,
  noContentResponse,
  ApiErrors,
  withErrorHandling,
  requireAuth,
  requireRateLimit,
  buildRateLimitId,
  RateLimitConfigs,
  validateBody,
  UpdatePageSchema,
} from "@/lib/api"
import {
  getPage,
  updatePage,
  deletePage,
  PageNotFoundError,
  SlugTakenError,
  NotAuthorizedError,
} from "@/data/pages"

type RouteParams = { params: Promise<{ pageId: string }> }

/**
 * GET /api/v1/pages/:pageId
 * Get a single page
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { pageId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "pages", "get"),
      RateLimitConfigs.lenient
    )

    const id = parseInt(pageId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid page ID")
    }

    try {
      const page = await getPage(id, userId)
      if (!page) {
        return ApiErrors.notFound("Page")
      }
      return successResponse(page)
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * PUT /api/v1/pages/:pageId
 * Update a page
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { pageId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "pages", "update"),
      RateLimitConfigs.strict
    )

    const id = parseInt(pageId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid page ID")
    }

    // Validate request body
    const body = await validateBody(request, UpdatePageSchema.omit({ id: true }))

    try {
      const page = await updatePage(userId, { ...body, id })
      return successResponse(page)
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Page")
      }
      if (error instanceof SlugTakenError) {
        return ApiErrors.conflict(error.message)
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * DELETE /api/v1/pages/:pageId
 * Delete a page (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { pageId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "pages", "delete"),
      RateLimitConfigs.strict
    )

    const id = parseInt(pageId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid page ID")
    }

    try {
      await deletePage(userId, id)
      return noContentResponse()
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
