import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/v1(.*)',
  '/settings(.*)',
  '/dashboard(.*)',
]);

// Public routes that never require authentication
const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/',
  '/api/webhooks(.*)', // Clerk webhooks
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // If it's a protected route, require auth
  if (isProtectedRoute(req)) {
    await auth.protect();
    return;
  }

  // If it's explicitly public, allow access
  if (isPublicRoute(req)) {
    return;
  }

  // For root-level paths that look like usernames (not starting with known prefixes),
  // allow public access for public identity pages
  // Usernames are alphanumeric with optional hyphens/underscores
  const isUsernamePath = /^\/[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(pathname);
  if (isUsernamePath) {
    return; // Allow public access to username pages
  }

  // Everything else requires authentication
  await auth.protect();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
