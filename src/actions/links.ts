"use server"

/**
 * Server Actions for links
 */
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  trackLinkClick,
  LinkNotFoundError,
  PageNotFoundError,
  NotAuthorizedError,
} from "@/data/links"
import { getPageById } from "@/data/pages"

// ============================================
// Schemas
// ============================================

const CreateLinkSchema = z.object({
  page_id: z.number(),
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().url("Invalid URL"),
  description: z.string().max(500).optional(),
  is_active: z.boolean().default(true),
  order_index: z.number().int().min(0).optional(),
  visible_from: z.string().datetime().nullable().optional(),
  visible_until: z.string().datetime().nullable().optional(),
})

const UpdateLinkSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().max(500).optional().nullable(),
  is_active: z.boolean().optional(),
  visible_from: z.string().datetime().nullable().optional(),
  visible_until: z.string().datetime().nullable().optional(),
})

const ReorderLinksSchema = z.object({
  page_id: z.number(),
  links: z.array(
    z.object({
      id: z.number(),
      order_index: z.number().int().min(0),
    })
  ),
})

// ============================================
// Action Response Types
// ============================================

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ============================================
// Actions
// ============================================

/**
 * Create a new link
 */
export async function createLinkAction(
  formData: FormData
): Promise<ActionResult<{ id: number }>> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const pageId = parseInt(formData.get("page_id") as string, 10)
    if (isNaN(pageId)) {
      return { success: false, error: "Invalid page ID" }
    }

    const rawData = {
      page_id: pageId,
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      description: formData.get("description") as string | null,
      is_active: formData.get("is_active") !== "false",
    }

    const validated = CreateLinkSchema.safeParse(rawData)
    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || "Validation failed"
      return { success: false, error: firstError }
    }

    const link = await createLink(userId, validated.data)

    // Get page to know which public path to revalidate
    const page = await getPageById(pageId)

    revalidatePath(`/admin/pages/${pageId}/links`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: { id: link.id } }
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return { success: false, error: "Page not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Create link error:", error)
    return { success: false, error: "Failed to create link" }
  }
}

/**
 * Update a link
 */
export async function updateLinkAction(
  formData: FormData
): Promise<ActionResult<{ id: number }>> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const id = parseInt(formData.get("id") as string, 10)
    if (isNaN(id)) {
      return { success: false, error: "Invalid link ID" }
    }

    const rawData = {
      id,
      title: formData.get("title") as string | undefined,
      url: formData.get("url") as string | undefined,
      description: formData.get("description") as string | null | undefined,
      is_active: formData.has("is_active")
        ? formData.get("is_active") === "true"
        : undefined,
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([_, v]) => v !== undefined)
    )

    const validated = UpdateLinkSchema.safeParse(cleanData)
    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || "Validation failed"
      return { success: false, error: firstError }
    }

    const link = await updateLink(userId, validated.data)

    // Get page to know which paths to revalidate
    const page = await getPageById(link.page_id)

    revalidatePath(`/admin/pages/${link.page_id}/links`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: { id: link.id } }
  } catch (error) {
    if (error instanceof LinkNotFoundError) {
      return { success: false, error: "Link not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Update link error:", error)
    return { success: false, error: "Failed to update link" }
  }
}

/**
 * Delete a link
 */
export async function deleteLinkAction(
  linkId: number,
  pageId: number
): Promise<ActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    await deleteLink(userId, linkId)

    // Get page to know which paths to revalidate
    const page = await getPageById(pageId)

    revalidatePath(`/admin/pages/${pageId}/links`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof LinkNotFoundError) {
      return { success: false, error: "Link not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Delete link error:", error)
    return { success: false, error: "Failed to delete link" }
  }
}

/**
 * Reorder links
 */
export async function reorderLinksAction(
  pageId: number,
  links: Array<{ id: number; order_index: number }>
): Promise<ActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const validated = ReorderLinksSchema.safeParse({ page_id: pageId, links })
    if (!validated.success) {
      return { success: false, error: "Invalid data" }
    }

    await reorderLinks(userId, pageId, links)

    // Get page to know which paths to revalidate
    const page = await getPageById(pageId)

    revalidatePath(`/admin/pages/${pageId}/links`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return { success: false, error: "Page not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Reorder links error:", error)
    return { success: false, error: "Failed to reorder links" }
  }
}

/**
 * Track a link click (public action, no auth required)
 */
export async function trackLinkClickAction(linkId: number): Promise<void> {
  try {
    await trackLinkClick(linkId)
  } catch (error) {
    // Silently fail - tracking shouldn't break the user experience
    console.error("Track link click error:", error)
  }
}

/**
 * Toggle link active status
 */
export async function toggleLinkActiveAction(
  linkId: number,
  pageId: number,
  isActive: boolean
): Promise<ActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    await updateLink(userId, { id: linkId, is_active: isActive })

    // Get page to know which paths to revalidate
    const page = await getPageById(pageId)

    revalidatePath(`/admin/pages/${pageId}/links`)
    if (page?.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof LinkNotFoundError) {
      return { success: false, error: "Link not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Toggle link active error:", error)
    return { success: false, error: "Failed to update link" }
  }
}
