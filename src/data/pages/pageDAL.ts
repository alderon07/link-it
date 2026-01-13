/**
 * Pages data access layer
 * Handles direct database operations for pages
 */
import { getDb } from "@/data/db"
import type {
  Page,
  CreatePageInput,
  UpdatePageInput,
  PaginationInput,
  PaginatedResult,
} from "@/data/db"

/**
 * Get a page by ID
 */
export async function getPageById(id: number): Promise<Page | null> {
  const db = getDb()
  return db.pages.findById(id)
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = getDb()
  return db.pages.findBySlug(slug)
}

/**
 * Get all pages for a user with pagination
 */
export async function getPagesByUserId(
  userId: string,
  pagination?: PaginationInput
): Promise<PaginatedResult<Page>> {
  const db = getDb()
  return db.pages.findByUserId(userId, pagination)
}

/**
 * Create a new page
 */
export async function createPage(data: CreatePageInput): Promise<Page> {
  const db = getDb()
  return db.pages.create(data)
}

/**
 * Update a page
 */
export async function updatePage(data: UpdatePageInput): Promise<Page | null> {
  const db = getDb()
  return db.pages.update(data)
}

/**
 * Soft delete a page
 */
export async function deletePage(id: number): Promise<boolean> {
  const db = getDb()
  return db.pages.delete(id)
}

/**
 * Increment the view count for a page
 */
export async function incrementPageViews(id: number): Promise<void> {
  const db = getDb()
  return db.pages.incrementViewCount(id)
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: number): Promise<boolean> {
  const db = getDb()
  return db.pages.isSlugAvailable(slug, excludeId)
}

/**
 * Get a public page by slug (only if is_public is true)
 */
export async function getPublicPageBySlug(slug: string): Promise<Page | null> {
  const page = await getPageBySlug(slug)
  if (!page || !page.is_public) return null
  return page
}
