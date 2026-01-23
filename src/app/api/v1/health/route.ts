/**
 * Health check endpoint
 * GET /api/v1/health
 *
 * Returns basic health info without external service calls
 * (Convex/Clerk calls would create false negatives)
 */

// Track server start time for uptime calculation
const startTime = Date.now()

export async function GET() {
  return Response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    buildSha: process.env.BUILD_SHA || "dev",
    uptime: Math.floor((Date.now() - startTime) / 1000),
  })
}
