/**
 * Database client abstraction
 * Allows swapping between dummy data and real database (Neon PostgreSQL)
 */
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  Page,
  CreatePageInput,
  UpdatePageInput,
  Link,
  CreateLinkInput,
  UpdateLinkInput,
  Theme,
  CreateThemeInput,
  PaginatedResult,
  PaginationInput,
} from "./schema"

// ============================================
// Database Client Interface
// ============================================

export interface DatabaseClient {
  // User operations
  users: {
    findById(id: number): Promise<User | null>
    findByClerkId(clerkId: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findByUsername(username: string): Promise<User | null>
    create(data: CreateUserInput): Promise<User>
    update(data: UpdateUserInput): Promise<User | null>
    delete(id: number): Promise<boolean>
  }

  // Page operations
  pages: {
    findById(id: number): Promise<Page | null>
    findBySlug(slug: string): Promise<Page | null>
    findByUserId(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<Page>>
    create(data: CreatePageInput): Promise<Page>
    update(data: UpdatePageInput): Promise<Page | null>
    delete(id: number): Promise<boolean>
    incrementViewCount(id: number): Promise<void>
    isSlugAvailable(slug: string, excludeId?: number): Promise<boolean>
  }

  // Link operations
  links: {
    findById(id: number): Promise<Link | null>
    findByPageId(pageId: number): Promise<Link[]>
    findActiveByPageId(pageId: number): Promise<Link[]>
    create(data: CreateLinkInput): Promise<Link>
    update(data: UpdateLinkInput): Promise<Link | null>
    delete(id: number): Promise<boolean>
    reorder(links: Array<{ id: number; order_index: number }>): Promise<void>
    incrementClickCount(id: number): Promise<void>
  }

  // Theme operations
  themes: {
    findById(id: number): Promise<Theme | null>
    findAll(): Promise<Theme[]>
    findByUserId(userId: string): Promise<Theme[]>
    create(data: CreateThemeInput): Promise<Theme>
    delete(id: number): Promise<boolean>
  }
}

// ============================================
// Dummy Database Implementation
// ============================================

import dummyData from "@/dummy.json"

// In-memory data stores (copies from dummy.json)
const users: User[] = [...(dummyData.users as unknown as User[])]
const pages: Page[] = [...(dummyData.pages as unknown as Page[])]
const links: Link[] = [...(dummyData.links as unknown as Link[])]
const themes: Theme[] = [...(dummyData.themes as unknown as Theme[])]

// ID counters for new records
let nextUserId = Math.max(...users.map((u) => u.id)) + 1
let nextPageId = Math.max(...pages.map((p) => p.id)) + 1
let nextLinkId = Math.max(...links.map((l) => l.id)) + 1
let nextThemeId = Math.max(...themes.map((t) => t.id)) + 1

// Helper to simulate network delay
const delay = (ms: number = 50) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to get current timestamp
const now = () => new Date().toISOString()

export const dummyDatabaseClient: DatabaseClient = {
  // ============================================
  // User Operations
  // ============================================
  users: {
    async findById(id) {
      await delay()
      return users.find((u) => u.id === id && !u.deleted_at) || null
    },

    async findByClerkId(clerkId) {
      await delay()
      return users.find((u) => u.clerk_user_id === clerkId && !u.deleted_at) || null
    },

    async findByEmail(email) {
      await delay()
      return users.find((u) => u.email === email && !u.deleted_at) || null
    },

    async findByUsername(username) {
      await delay()
      return users.find((u) => u.username === username && !u.deleted_at) || null
    },

    async create(data) {
      await delay()
      const user: User = {
        id: nextUserId++,
        ...data,
        display_name: data.display_name || null,
        avatar_url: data.avatar_url || null,
        created_at: now(),
        updated_at: now(),
        deleted_at: null,
      }
      users.push(user)
      return user
    },

    async update(data) {
      await delay()
      const index = users.findIndex((u) => u.id === data.id && !u.deleted_at)
      if (index === -1) return null

      users[index] = {
        ...users[index],
        ...data,
        updated_at: now(),
      }
      return users[index]
    },

    async delete(id) {
      await delay()
      const index = users.findIndex((u) => u.id === id && !u.deleted_at)
      if (index === -1) return false

      users[index].deleted_at = now()
      return true
    },
  },

  // ============================================
  // Page Operations
  // ============================================
  pages: {
    async findById(id) {
      await delay()
      return pages.find((p) => p.id === id && !p.deleted_at) || null
    },

    async findBySlug(slug) {
      await delay()
      return pages.find((p) => p.slug === slug && !p.deleted_at) || null
    },

    async findByUserId(userId, pagination = { page: 1, limit: 20 }) {
      await delay()
      const userPages = pages.filter((p) => p.user_id === userId && !p.deleted_at)
      const total = userPages.length
      const start = (pagination.page - 1) * pagination.limit
      const data = userPages.slice(start, start + pagination.limit)

      return {
        data,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit),
          hasMore: start + pagination.limit < total,
        },
      }
    },

    async create(data) {
      await delay()
      const page: Page = {
        id: nextPageId++,
        user_id: data.user_id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        theme_id: data.theme_id || null,
        is_public: data.is_public,
        view_count: 0,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        og_image_url: data.og_image_url || null,
        created_at: now(),
        updated_at: now(),
        deleted_at: null,
      }
      pages.push(page)
      return page
    },

    async update(data) {
      await delay()
      const index = pages.findIndex((p) => p.id === data.id && !p.deleted_at)
      if (index === -1) return null

      pages[index] = {
        ...pages[index],
        ...data,
        updated_at: now(),
      }
      return pages[index]
    },

    async delete(id) {
      await delay()
      const index = pages.findIndex((p) => p.id === id && !p.deleted_at)
      if (index === -1) return false

      pages[index].deleted_at = now()
      return true
    },

    async incrementViewCount(id) {
      await delay()
      const page = pages.find((p) => p.id === id && !p.deleted_at)
      if (page) {
        page.view_count++
      }
    },

    async isSlugAvailable(slug, excludeId) {
      await delay()
      const existing = pages.find(
        (p) => p.slug === slug && !p.deleted_at && p.id !== excludeId
      )
      return !existing
    },
  },

  // ============================================
  // Link Operations
  // ============================================
  links: {
    async findById(id) {
      await delay()
      return links.find((l) => l.id === id && !l.deleted_at) || null
    },

    async findByPageId(pageId) {
      await delay()
      return links
        .filter((l) => l.page_id === pageId && !l.deleted_at)
        .sort((a, b) => a.order_index - b.order_index)
    },

    async findActiveByPageId(pageId) {
      await delay()
      const currentTime = new Date()
      return links
        .filter((l) => {
          if (l.page_id !== pageId || l.deleted_at || !l.is_active) return false

          // Check visibility window
          if (l.visible_from && new Date(l.visible_from) > currentTime) return false
          if (l.visible_until && new Date(l.visible_until) < currentTime) return false

          return true
        })
        .sort((a, b) => a.order_index - b.order_index)
    },

    async create(data) {
      await delay()
      const pageLinks = links.filter((l) => l.page_id === data.page_id && !l.deleted_at)
      const maxOrder = pageLinks.length > 0 ? Math.max(...pageLinks.map((l) => l.order_index)) : -1

      const link: Link = {
        id: nextLinkId++,
        page_id: data.page_id,
        title: data.title,
        url: data.url,
        type: data.type || "link",
        description: data.description || null,
        is_active: data.is_active ?? true,
        order_index: data.order_index ?? maxOrder + 1,
        click_count: 0,
        visible_from: data.visible_from || null,
        visible_until: data.visible_until || null,
        created_at: now(),
        updated_at: now(),
        deleted_at: null,
      }
      links.push(link)
      return link
    },

    async update(data) {
      await delay()
      const index = links.findIndex((l) => l.id === data.id && !l.deleted_at)
      if (index === -1) return null

      links[index] = {
        ...links[index],
        ...data,
        updated_at: now(),
      }
      return links[index]
    },

    async delete(id) {
      await delay()
      const index = links.findIndex((l) => l.id === id && !l.deleted_at)
      if (index === -1) return false

      links[index].deleted_at = now()
      return true
    },

    async reorder(linkUpdates) {
      await delay()
      for (const update of linkUpdates) {
        const link = links.find((l) => l.id === update.id && !l.deleted_at)
        if (link) {
          link.order_index = update.order_index
          link.updated_at = now()
        }
      }
    },

    async incrementClickCount(id) {
      await delay()
      const link = links.find((l) => l.id === id && !l.deleted_at)
      if (link) {
        link.click_count++
      }
    },
  },

  // ============================================
  // Theme Operations
  // ============================================
  themes: {
    async findById(id) {
      await delay()
      return themes.find((t) => t.id === id) || null
    },

    async findAll() {
      await delay()
      return themes.filter((t) => !t.is_custom)
    },

    async findByUserId(userId) {
      await delay()
      return themes.filter((t) => t.user_id === userId)
    },

    async create(data) {
      await delay()
      const theme: Theme = {
        id: nextThemeId++,
        ...data,
        created_at: now(),
        updated_at: now(),
      }
      themes.push(theme)
      return theme
    },

    async delete(id) {
      await delay()
      const index = themes.findIndex((t) => t.id === id && t.is_custom)
      if (index === -1) return false

      themes.splice(index, 1)
      return true
    },
  },
}

// ============================================
// Database Client Singleton
// ============================================

// In the future, this can be swapped with a real database client (e.g., Neon)
// by checking environment variables or configuration

let dbClient: DatabaseClient | null = null

export function getDb(): DatabaseClient {
  if (!dbClient) {
    // For now, always use dummy database
    // TODO: Replace with Neon client when DATABASE_URL is set
    // if (process.env.DATABASE_URL) {
    //   dbClient = createNeonClient(process.env.DATABASE_URL)
    // } else {
    //   dbClient = dummyDatabaseClient
    // }
    dbClient = dummyDatabaseClient
  }
  return dbClient
}

// Export for testing
export function resetDb() {
  dbClient = null
}
