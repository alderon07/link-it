/**
 * Pages module exports
 */

// DAL - Direct database operations
export {
  getPageById,
  getPageBySlug,
  getPagesByUserId,
  createPage as createPageDAL,
  updatePage as updatePageDAL,
  deletePage as deletePageDAL,
  incrementPageViews,
  isSlugAvailable,
  getPublicPageBySlug,
} from "./pageDAL"

// Service - Business logic
export {
  getPage,
  getPageBySlug as getPageBySlugService,
  getPublicPage,
  getUserPages,
  createPage,
  updatePage,
  deletePage,
  generateSlug,
  checkSlugAvailability,
  PageNotFoundError,
  SlugTakenError,
  NotAuthorizedError,
} from "./pageService"
