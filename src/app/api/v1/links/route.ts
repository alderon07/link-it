/**
 * Links API routes
 * POST /api/v1/links/reorder - Reorder links
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
  ReorderLinksSchema,
} from "@/lib/api"
import {
  reorderLinks,
  PageNotFoundError,
  NotAuthorizedError,
} from "@/data/links"
import { z } from "zod"

// Schema for bulk reorder request
const BulkReorderSchema = z.object({
  page_id: z.number().int().positive(),
  links: ReorderLinksSchema.shape.links,
})

/**
 * POST /api/v1/links/reorder
 * Reorder links for a page
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const userId = await requireAuth()

    // Rate limit
    await requireRateLimit(
      buildRateLimitId("user", userId, "links", "reorder"),
      RateLimitConfigs.strict
    )

    // Validate request body
    const { page_id, links } = await validateBody(request, BulkReorderSchema)

    try {
      await reorderLinks(userId, page_id, links)
      return successResponse({ success: true })
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        return ApiErrors.notFound("Page")
      }
      if (error instanceof NotAuthorizedError) {
        return ApiErrors.forbidden(error.message)
      }
      throw error
    }
  })
}
