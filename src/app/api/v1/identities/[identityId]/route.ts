/**
 * Single identity API routes
 * GET /api/v1/identities/:identityId - Get an identity
 * PUT /api/v1/identities/:identityId - Update an identity
 * DELETE /api/v1/identities/:identityId - Delete an identity
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

type RouteParams = { params: Promise<{ identityId: string }> }

/**
 * GET /api/v1/identities/:identityId
 * Get a single identity
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { identityId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "identities", "get"),
      RateLimitConfigs.lenient
    )

    const id = parseInt(identityId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid identity ID")
    }

    try {
      const identity = await getPage(id, userId)
      if (!identity) {
        return ApiErrors.notFound("Identity")
      }
      return successResponse(identity)
    } catch (error) {
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}

/**
 * PUT /api/v1/identities/:identityId
 * Update an identity
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { identityId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "identities", "update"),
      RateLimitConfigs.strict
    )

    const id = parseInt(identityId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid identity ID")
    }

    // Validate request body
    const body = await validateBody(request, UpdatePageSchema.omit({ id: true }))

    try {
      const identity = await updatePage(userId, { ...body, id })
      return successResponse(identity)
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Identity")
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
 * DELETE /api/v1/identities/:identityId
 * Delete an identity (soft delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { identityId } = await params
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "identities", "delete"),
      RateLimitConfigs.strict
    )

    const id = parseInt(identityId, 10)
    if (isNaN(id)) {
      return ApiErrors.badRequest("Invalid identity ID")
    }

    try {
      await deletePage(userId, id)
      return noContentResponse()
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Identity")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden()
      }
      throw error
    }
  })
}
