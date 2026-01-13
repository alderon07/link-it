/**
 * Single link API routes
 * GET /api/v1/links/:linkId - Get a link
 * PUT /api/v1/links/:linkId - Update a link
 * DELETE /api/v1/links/:linkId - Delete a link
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
  UpdateLinkSchema,
} from "@/lib/api"
import {
  getLink,
  updateLink,
  deleteLink,
  LinkNotFoundError,
  NotAuthorizedError,
} from "@/data/links"

type RouteParams = { params: Promise<{ linkId: string }> }

/**
 * GET /api/v1/links/:linkId
 * Get a single link
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { linkId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "get"),
      RateLimitConfigs.lenient
    )

    const id = parseInt(linkId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid link ID")
    }

    try {
      const link = await getLink(id, userId)
      if (!link) {
        return ApiErrors.notFound("Link")
      }
      return successResponse(link)
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * PUT /api/v1/links/:linkId
 * Update a link
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { linkId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "update"),
      RateLimitConfigs.strict
    )

    const id = parseInt(linkId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid link ID")
    }

    // Validate request body
    const body = await validateBody(request, UpdateLinkSchema.omit({ id: true }))

    try {
      const link = await updateLink(userId, { ...body, id })
      return successResponse(link)
    } catch (error) {
      if (error instanceof LinkNotFoundError) {
        return ApiErrors.notFound("Link")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * DELETE /api/v1/links/:linkId
 * Delete a link (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { linkId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "delete"),
      RateLimitConfigs.strict
    )

    const id = parseInt(linkId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid link ID")
    }

    try {
      await deleteLink(userId, id)
      return noContentResponse()
    } catch (error) {
      if (error instanceof LinkNotFoundError) {
        return ApiErrors.notFound("Link")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}
