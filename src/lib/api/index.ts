// API Helpers
// Utilities for building secure, validated API routes

// Response helpers
export {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  ApiErrors,
  ErrorCodes,
  isErrorResponse,
  withErrorHandling,
} from "./response"
export type { ApiResponse, ErrorCode } from "./response"

// Authentication helpers
export {
  requireAuth,
  getAuthUserId,
  requireUser,
  requireOwnership,
  requirePageOwnership,
  requireLinkOwnership,
  withAuth,
  AuthError,
} from "./auth"

// Validation helpers
export {
  sanitizeText,
  sanitizeHtml,
  validateRequest,
  validateBody,
  parseSearchParams,
  SafeUrlSchema,
  SlugSchema,
  UsernameSchema,
  EmailSchema,
  IdSchema,
  StringIdSchema,
  PaginationSchema,
  SortOrderSchema,
  CreatePageSchema,
  UpdatePageSchema,
  CreateLinkSchema,
  UpdateLinkSchema,
  ReorderLinksSchema,
  ValidationError,
} from "./validation"
export type {
  CreatePageInput,
  UpdatePageInput,
  CreateLinkInput,
  UpdateLinkInput,
  ReorderLinksInput,
  PaginationInput,
} from "./validation"

// Rate limiting helpers
export {
  checkRateLimit,
  requireRateLimit,
  buildRateLimitId,
  resetRateLimit,
  getRateLimitStatus,
  RateLimitConfigs,
  RateLimitError,
} from "./rate-limit"

// Security helpers
export {
  getClientIp,
  getUserAgent,
  verifyOrigin,
  isBot,
  getRequestMetadata,
  isSafeRedirectUrl,
  maskSensitiveData,
  securityHeaders,
} from "./security"
