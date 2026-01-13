/**
 * Links module exports
 */

// DAL - Direct database operations
export {
  getLinkById,
  getLinksByPageId,
  getActiveLinksByPageId,
  createLink as createLinkDAL,
  updateLink as updateLinkDAL,
  deleteLink as deleteLinkDAL,
  reorderLinks as reorderLinksDAL,
  incrementLinkClicks,
} from "./linkDAL"

// Service - Business logic
export {
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
  PageNotFoundError,
  NotAuthorizedError,
} from "./linkService"
