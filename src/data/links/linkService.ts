/**
 * Links service layer
 * Handles business logic for links
 */
import * as linkDAL from "./linkDAL"
import * as pageDAL from "@/data/pages/pageDAL"
import type { Link, CreateLinkInput, UpdateLinkInput } from "@/data/db"

/**
 * Service errors
 */
export class LinkNotFoundError extends Error {
  constructor(id: number) {
    super(`Link not found: ${id}`)
    this.name = "LinkNotFoundError"
  }
}

export class PageNotFoundError extends Error {
  constructor(id: number) {
    super(`Page not found: ${id}`)
    this.name = "PageNotFoundError"
  }
}

export class NotAuthorizedError extends Error {
  constructor(message = "Not authorized to perform this action") {
    super(message)
    this.name = "NotAuthorizedError"
  }
}

/**
 * Get a link by ID with ownership verification
 */
export async function getLink(id: number, userId?: string): Promise<Link | null> {
  const link = await linkDAL.getLinkById(id)
  if (!link) return null

  // If userId provided, verify ownership through page
  if (userId) {
    const page = await pageDAL.getPageById(link.page_id)
    if (!page || page.user_id !== userId) {
      throw new NotAuthorizedError()
    }
  }

  return link
}

/**
 * Get all links for a page with ownership verification
 */
export async function getPageLinks(
  pageId: number,
  userId: string
): Promise<Link[]> {
  // Verify page ownership
  const page = await pageDAL.getPageById(pageId)
  if (!page) {
    throw new PageNotFoundError(pageId)
  }
  if (page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  return linkDAL.getLinksByPageId(pageId)
}

/**
 * Get active links for a public page (no auth required)
 */
export async function getPublicPageLinks(pageId: number): Promise<Link[]> {
  return linkDAL.getActiveLinksByPageId(pageId)
}

/**
 * Create a new link with ownership verification
 */
export async function createLink(
  userId: string,
  data: CreateLinkInput
): Promise<Link> {
  // Verify page ownership
  const page = await pageDAL.getPageById(data.page_id)
  if (!page) {
    throw new PageNotFoundError(data.page_id)
  }
  if (page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  return linkDAL.createLink(data)
}

/**
 * Update a link with ownership verification
 */
export async function updateLink(
  userId: string,
  data: UpdateLinkInput
): Promise<Link> {
  // Get link and verify ownership through page
  const link = await linkDAL.getLinkById(data.id)
  if (!link) {
    throw new LinkNotFoundError(data.id)
  }

  const page = await pageDAL.getPageById(link.page_id)
  if (!page || page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  const updated = await linkDAL.updateLink(data)
  if (!updated) {
    throw new LinkNotFoundError(data.id)
  }

  return updated
}

/**
 * Delete a link with ownership verification
 */
export async function deleteLink(userId: string, linkId: number): Promise<boolean> {
  // Get link and verify ownership through page
  const link = await linkDAL.getLinkById(linkId)
  if (!link) {
    throw new LinkNotFoundError(linkId)
  }

  const page = await pageDAL.getPageById(link.page_id)
  if (!page || page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  return linkDAL.deleteLink(linkId)
}

/**
 * Reorder links with ownership verification
 */
export async function reorderLinks(
  userId: string,
  pageId: number,
  links: Array<{ id: number; order_index: number }>
): Promise<void> {
  // Verify page ownership
  const page = await pageDAL.getPageById(pageId)
  if (!page) {
    throw new PageNotFoundError(pageId)
  }
  if (page.user_id !== userId) {
    throw new NotAuthorizedError()
  }

  // Verify all links belong to this page
  const pageLinks = await linkDAL.getLinksByPageId(pageId)
  const pageLinkIds = new Set(pageLinks.map((l) => l.id))

  for (const link of links) {
    if (!pageLinkIds.has(link.id)) {
      throw new NotAuthorizedError(`Link ${link.id} does not belong to this page`)
    }
  }

  return linkDAL.reorderLinks(links)
}

/**
 * Track a link click (no auth required, for public pages)
 */
export async function trackLinkClick(linkId: number): Promise<void> {
  return linkDAL.incrementLinkClicks(linkId)
}

/**
 * Search links within a user's pages
 */
export async function searchLinks(
  userId: string,
  query: string
): Promise<Link[]> {
  // Get all user's pages
  const { data: userPages } = await pageDAL.getPagesByUserId(userId, { page: 1, limit: 100 })

  // Get links from all pages
  const allLinks: Link[] = []
  for (const page of userPages) {
    const pageLinks = await linkDAL.getLinksByPageId(page.id)
    allLinks.push(...pageLinks)
  }

  if (!query) return allLinks

  // Filter by search query
  const lowerQuery = query.toLowerCase()
  return allLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(lowerQuery) ||
      link.url.toLowerCase().includes(lowerQuery) ||
      (link.description && link.description.toLowerCase().includes(lowerQuery))
  )
}
