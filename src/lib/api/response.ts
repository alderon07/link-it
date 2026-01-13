import { NextResponse } from "next/server"

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

/**
 * Error codes for consistent error handling
 */
export const ErrorCodes = {
  // Client errors (4xx)
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  BAD_REQUEST: "BAD_REQUEST",

  // Server errors (5xx)
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  DATABASE_ERROR: "DATABASE_ERROR",
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

/**
 * Create a successful response (200 OK)
 */
export function successResponse<T>(
  data: T,
  meta?: ApiResponse["meta"]
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  }

  if (meta) {
    response.meta = meta
  }

  return NextResponse.json(response, { status: 200 })
}

/**
 * Create a resource created response (201 Created)
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  )
}

/**
 * Create a no content response (204 No Content)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Create an error response
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse<never>> {
  const error: ApiResponse["error"] = {
    code,
    message,
  }

  if (details !== undefined) {
    error.details = details
  }

  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

/**
 * Common error response helpers
 */
export const ApiErrors = {
  badRequest: (message: string, details?: unknown) =>
    errorResponse(ErrorCodes.BAD_REQUEST, message, 400, details),

  unauthorized: (message = "Authentication required") =>
    errorResponse(ErrorCodes.UNAUTHORIZED, message, 401),

  forbidden: (message = "You do not have permission to access this resource") =>
    errorResponse(ErrorCodes.FORBIDDEN, message, 403),

  notFound: (resource = "Resource") =>
    errorResponse(ErrorCodes.NOT_FOUND, `${resource} not found`, 404),

  conflict: (message: string) =>
    errorResponse(ErrorCodes.CONFLICT, message, 409),

  rateLimited: (retryAfter?: number) => {
    const response = errorResponse(
      ErrorCodes.RATE_LIMITED,
      "Too many requests. Please try again later.",
      429
    )
    if (retryAfter) {
      response.headers.set("Retry-After", String(retryAfter))
    }
    return response
  },

  validationError: (message: string, details?: unknown) =>
    errorResponse(ErrorCodes.VALIDATION_ERROR, message, 400, details),

  internalError: (message = "An unexpected error occurred") =>
    errorResponse(ErrorCodes.INTERNAL_ERROR, message, 500),

  serviceUnavailable: (message = "Service temporarily unavailable") =>
    errorResponse(ErrorCodes.SERVICE_UNAVAILABLE, message, 503),
}

/**
 * Type guard for checking if a response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<never> & { error: NonNullable<ApiResponse["error"]> } {
  return !response.success && !!response.error
}

/**
 * Wrapper for async route handlers with error handling
 */
export function withErrorHandling<T extends NextResponse>(
  handler: () => Promise<T>
): Promise<T | NextResponse<ApiResponse<never>>> {
  return handler().catch((error) => {
    console.error("API Error:", error)

    // Check if it's an ApiError response (thrown intentionally)
    if (error?.response instanceof NextResponse) {
      return error.response
    }

    return ApiErrors.internalError()
  })
}
