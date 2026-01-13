/**
 * Data layer exports
 * Provides a clean API for accessing data across the application
 */

// Database
export * from "./db"

// Pages - with explicit naming for conflicts
export {
  // DAL
  getPageById,
  getPageBySlug,
  getPagesByUserId,
  createPageDAL,
  updatePageDAL,
  deletePageDAL,
  incrementPageViews,
  isSlugAvailable,
  getPublicPageBySlug,
  // Service
  getPage,
  getPageBySlugService,
  getPublicPage,
  getUserPages,
  createPage,
  updatePage,
  deletePage,
  generateSlug,
  checkSlugAvailability,
  PageNotFoundError,
  SlugTakenError,
  NotAuthorizedError as PageNotAuthorizedError,
} from "./pages"

// Links - with explicit naming for conflicts
export {
  // DAL
  getLinkById,
  getLinksByPageId,
  getActiveLinksByPageId,
  createLinkDAL,
  updateLinkDAL,
  deleteLinkDAL,
  reorderLinksDAL,
  incrementLinkClicks,
  // Service
  getLink,
  getPageLinks,
  getPublicPageLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  trackLinkClick,
  searchLinks,
  LinkNotFoundError,
  PageNotFoundError as LinkPageNotFoundError,
  NotAuthorizedError as LinkNotAuthorizedError,
} from "./links"
