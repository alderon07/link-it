import { auth, currentUser } from "@clerk/nextjs/server"
import { ApiErrors } from "./response"

/**
 * Authentication error that can be thrown and caught by error handler
 */
export class AuthError extends Error {
  response: ReturnType<typeof ApiErrors.unauthorized | typeof ApiErrors.forbidden>

  constructor(
    response: ReturnType<typeof ApiErrors.unauthorized | typeof ApiErrors.forbidden>
  ) {
    super("Authentication error")
    this.response = response
  }
}

/**
 * Require authentication for an API route.
 * Throws AuthError if user is not authenticated.
 *
 * @example
 * ```ts
 * export async function GET() {
 *   const userId = await requireAuth()
 *   // userId is guaranteed to be a string here
 * }
 * ```
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw new AuthError(ApiErrors.unauthorized())
  }

  return userId
}

/**
 * Get the current user's ID if authenticated, or null if not.
 * Does not throw - useful for routes that work with or without auth.
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

/**
 * Get the full current user object.
 * Throws if not authenticated.
 */
export async function requireUser() {
  const user = await currentUser()

  if (!user) {
    throw new AuthError(ApiErrors.unauthorized())
  }

  return user
}

/**
 * Check if the current user owns a resource.
 * Throws AuthError if not.
 *
 * @example
 * ```ts
 * const page = await getPageById(pageId)
 * await requireOwnership(page?.userId)
 * ```
 */
export async function requireOwnership(resourceOwnerId: string | null | undefined): Promise<string> {
  const userId = await requireAuth()

  if (!resourceOwnerId || resourceOwnerId !== userId) {
    throw new AuthError(
      ApiErrors.forbidden("You do not have access to this resource")
    )
  }

  return userId
}

/**
 * Type-safe wrapper for checking page ownership.
 * Returns the userId and page if ownership is verified.
 */
export async function requirePageOwnership<T extends { user_id?: string | null }>(
  page: T | null
): Promise<{ userId: string; page: T }> {
  if (!page) {
    throw new AuthError(ApiErrors.notFound("Page"))
  }

  const userId = await requireOwnership(page.user_id)

  return { userId, page }
}

/**
 * Type-safe wrapper for checking link ownership via page.
 */
export async function requireLinkOwnership<
  T extends { page_id?: number | null },
  P extends { user_id?: string | null }
>(
  link: T | null,
  getPageById: (id: number) => Promise<P | null>
): Promise<{ userId: string; link: T; page: P }> {
  if (!link) {
    throw new AuthError(ApiErrors.notFound("Link"))
  }

  if (!link.page_id) {
    throw new AuthError(ApiErrors.forbidden("Link is not associated with a page"))
  }

  const page = await getPageById(link.page_id)
  const { userId } = await requirePageOwnership(page)

  return { userId, link, page: page as P }
}

/**
 * Decorator-style function to wrap API handlers with auth requirement.
 *
 * @example
 * ```ts
 * export const GET = withAuth(async (userId) => {
 *   // userId is guaranteed to be valid
 *   return successResponse({ userId })
 * })
 * ```
 */
export function withAuth<T>(
  handler: (userId: string) => Promise<T>
): () => Promise<T> {
  return async () => {
    const userId = await requireAuth()
    return handler(userId)
  }
}
