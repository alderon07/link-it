/**
 * Server Actions exports
 */

// Page actions
export {
  createPageAction,
  updatePageAction,
  deletePageAction,
  checkSlugAction,
  generateSlugAction,
} from "./pages"

// Link actions
export {
  createLinkAction,
  updateLinkAction,
  deleteLinkAction,
  reorderLinksAction,
  trackLinkClickAction,
  toggleLinkActiveAction,
} from "./links"

// Types
export type { ActionResult } from "./pages"
