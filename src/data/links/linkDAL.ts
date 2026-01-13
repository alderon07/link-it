/**
 * Links data access layer
 * Handles direct database operations for links
 */
import { getDb } from "@/data/db"
import type { Link, CreateLinkInput, UpdateLinkInput } from "@/data/db"

/**
 * Get a link by ID
 */
export async function getLinkById(id: number): Promise<Link | null> {
  const db = getDb()
  return db.links.findById(id)
}

/**
 * Get all links for a page
 */
export async function getLinksByPageId(pageId: number): Promise<Link[]> {
  const db = getDb()
  return db.links.findByPageId(pageId)
}

/**
 * Get active links for a page (respecting visibility windows)
 */
export async function getActiveLinksByPageId(pageId: number): Promise<Link[]> {
  const db = getDb()
  return db.links.findActiveByPageId(pageId)
}

/**
 * Create a new link
 */
export async function createLink(data: CreateLinkInput): Promise<Link> {
  const db = getDb()
  return db.links.create(data)
}

/**
 * Update a link
 */
export async function updateLink(data: UpdateLinkInput): Promise<Link | null> {
  const db = getDb()
  return db.links.update(data)
}

/**
 * Soft delete a link
 */
export async function deleteLink(id: number): Promise<boolean> {
  const db = getDb()
  return db.links.delete(id)
}

/**
 * Reorder links
 */
export async function reorderLinks(
  links: Array<{ id: number; order_index: number }>
): Promise<void> {
  const db = getDb()
  return db.links.reorder(links)
}

/**
 * Increment click count for a link
 */
export async function incrementLinkClicks(id: number): Promise<void> {
  const db = getDb()
  return db.links.incrementClickCount(id)
}
