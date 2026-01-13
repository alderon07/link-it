/**
 * Pages service layer
 * Handles business logic for pages
 */
import { nanoid } from "nanoid"
import * as pageDAL from "./pageDAL"
import type {
  Page,
  CreatePageInput,
  UpdatePageInput,
  PaginationInput,
  PaginatedResult,
} from "@/data/db"

/**
 * Service errors
 */
export class PageNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Page not found: ${identifier}`)
    this.name = "PageNotFoundError"
  }
}

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`Slug is already taken: ${slug}`)
    this.name = "SlugTakenError"
  }
}

export class NotAuthorizedError extends Error {
  constructor(message = "Not authorized to perform this action") {
    super(message)
    this.name = "NotAuthorizedError"
  }
}

/**
 * Get a page by ID with ownership verification
 */
export async function getPage(
  pageId: number,
  userId?: string
): Promise<Page | null> {
  const page = await pageDAL.getPageById(pageId)

  if (!page) return null

  // If userId is provided, verify ownership
  if (userId && page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  return page
}

/**
 * Get a page by slug (public access)
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return pageDAL.getPageBySlug(slug)
}

/**
 * Get a public page and increment view count
 */
export async function getPublicPage(slug: string): Promise<Page | null> {
  const page = await pageDAL.getPublicPageBySlug(slug)

  if (page) {
    // Increment view count asynchronously (fire-and-forget)
    pageDAL.incrementPageViews(page.id).catch(console.error)
  }

  return page
}

/**
 * Get all pages for a user
 */
export async function getUserPages(
  userId: string,
  pagination?: PaginationInput
): Promise<PaginatedResult<Page>> {
  return pageDAL.getPagesByUserId(userId, pagination)
}

/**
 * Create a new page
 */
export async function createPage(
  userId: string,
  data: Omit<CreatePageInput, "user_id">
): Promise<Page> {
  // Check if slug is available
  const slugAvailable = await pageDAL.isSlugAvailable(data.slug)
  if (!slugAvailable) {
    throw new SlugTakenError(data.slug)
  }

  return pageDAL.createPage({
    ...data,
    user_id: userId,
    is_public: data.is_public ?? true,
  })
}

/**
 * Update a page with ownership verification
 */
export async function updatePage(
  userId: string,
  data: UpdatePageInput
): Promise<Page> {
  // Verify ownership
  const page = await pageDAL.getPageById(data.id)
  if (!page) {
    throw new PageNotFoundError(data.id)
  }

  if (page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  // If slug is being changed, check availability
  if (data.slug && data.slug !== page.slug) {
    const slugAvailable = await pageDAL.isSlugAvailable(data.slug, data.id)
    if (!slugAvailable) {
      throw new SlugTakenError(data.slug)
    }
  }

  const updated = await pageDAL.updatePage(data)
  if (!updated) {
    throw new PageNotFoundError(data.id)
  }

  return updated
}

/**
 * Delete a page with ownership verification
 */
export async function deletePage(
  userId: string,
  pageId: number
): Promise<boolean> {
  // Verify ownership
  const page = await pageDAL.getPageById(pageId)
  if (!page) {
    throw new PageNotFoundError(pageId)
  }

  if (page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  return pageDAL.deletePage(pageId)
}

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20)

  // Add random suffix for uniqueness
  return `${base}-${nanoid(6)}`
}

/**
 * Check if a slug is available
 */
export async function checkSlugAvailability(
  slug: string,
  excludePageId?: number
): Promise<boolean> {
  return pageDAL.isSlugAvailable(slug, excludePageId)
}
