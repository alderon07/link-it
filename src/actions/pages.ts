"use server"

/**
 * Server Actions for pages
 */
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  createPage,
  updatePage,
  deletePage,
  checkSlugAvailability,
  generateSlug,
  PageNotFoundError,
  SlugTakenError,
  NotAuthorizedError,
} from "@/data/pages"

// ============================================
// Schemas
// ============================================

const CreatePageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  bio: z.string().max(500).optional(),
  description: z.string().max(1000).optional(),
  is_public: z.boolean().default(true),
})

const UpdatePageSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(3).max(30).regex(/^[a-z0-9-]+$/).optional(),
  bio: z.string().max(500).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  is_public: z.boolean().optional(),
  avatar_url: z.string().url().optional().nullable(),
  theme_id: z.number().optional().nullable(),
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
 * Create a new page
 */
export async function createPageAction(
  formData: FormData
): Promise<ActionResult<{ id: number; slug: string }>> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      bio: formData.get("bio") as string | null,
      description: formData.get("description") as string | null,
      is_public: formData.get("is_public") === "true",
    }

    const validated = CreatePageSchema.safeParse(rawData)
    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || "Validation failed"
      return { success: false, error: firstError }
    }

    const page = await createPage(userId, validated.data)

    revalidatePath("/admin/pages")

    return { success: true, data: { id: page.id, slug: page.slug } }
  } catch (error) {
    if (error instanceof SlugTakenError) {
      return { success: false, error: "This slug is already taken" }
    }
    console.error("Create page error:", error)
    return { success: false, error: "Failed to create page" }
  }
}

/**
 * Update a page
 */
export async function updatePageAction(
  formData: FormData
): Promise<ActionResult<{ id: number; slug: string }>> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    const id = parseInt(formData.get("id") as string, 10)
    if (isNaN(id)) {
      return { success: false, error: "Invalid page ID" }
    }

    const rawData = {
      id,
      name: formData.get("name") as string | undefined,
      slug: formData.get("slug") as string | undefined,
      bio: formData.get("bio") as string | null | undefined,
      description: formData.get("description") as string | null | undefined,
      is_public: formData.has("is_public")
        ? formData.get("is_public") === "true"
        : undefined,
    }

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(rawData).filter(([_, v]) => v !== undefined)
    )

    const validated = UpdatePageSchema.safeParse(cleanData)
    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors)[0]?.[0] || "Validation failed"
      return { success: false, error: firstError }
    }

    const page = await updatePage(userId, validated.data)

    revalidatePath("/admin/pages")
    revalidatePath(`/admin/pages/${id}`)
    if (page.slug) {
      revalidatePath(`/${page.slug}`)
    }

    return { success: true, data: { id: page.id, slug: page.slug } }
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return { success: false, error: "Page not found" }
    }
    if (error instanceof SlugTakenError) {
      return { success: false, error: "This slug is already taken" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Update page error:", error)
    return { success: false, error: "Failed to update page" }
  }
}

/**
 * Delete a page
 */
export async function deletePageAction(pageId: number): Promise<ActionResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Authentication required" }
  }

  try {
    await deletePage(userId, pageId)

    revalidatePath("/admin/pages")

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof PageNotFoundError) {
      return { success: false, error: "Page not found" }
    }
    if (error instanceof NotAuthorizedError) {
      return { success: false, error: "Not authorized" }
    }
    console.error("Delete page error:", error)
    return { success: false, error: "Failed to delete page" }
  }
}

/**
 * Check if a slug is available
 */
export async function checkSlugAction(
  slug: string,
  excludePageId?: number
): Promise<ActionResult<{ available: boolean }>> {
  try {
    const available = await checkSlugAvailability(slug, excludePageId)
    return { success: true, data: { available } }
  } catch (error) {
    console.error("Check slug error:", error)
    return { success: false, error: "Failed to check slug availability" }
  }
}

/**
 * Generate a unique slug from a name
 */
export async function generateSlugAction(
  name: string
): Promise<ActionResult<{ slug: string }>> {
  try {
    const slug = generateSlug(name)
    return { success: true, data: { slug } }
  } catch (error) {
    console.error("Generate slug error:", error)
    return { success: false, error: "Failed to generate slug" }
  }
}
