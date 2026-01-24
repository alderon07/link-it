# Authentication

## Overview

```
User → Clerk Auth → JWT Token → ConvexProvider → Convex Backend
                                      ↓
                          ctx.auth.getUserIdentity()
```

## Clerk Middleware

Located at `src/middleware.ts`. Protects all routes except public ones.

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/login(.*)", "/", "/[username]"])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
```

## Convex Authentication

JWT is passed via `ConvexClientProvider` in root layout. Convex verifies automatically.

### In Queries/Mutations

```typescript
const identity = await ctx.auth.getUserIdentity()
if (!identity) {
  throw new ConvexError("Not authenticated")
}

// identity.subject is the Clerk user ID
const user = await ctx.db
  .query("users")
  .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
  .first()
```

## Webhook Integration

Clerk webhooks sync user data to Convex. Handler at `convex/http.ts`.

```typescript
// convex/http.ts
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify Svix signature
    // Handle: user.created, user.updated, user.deleted
    // Call internal mutations to sync user data
  }),
})
```

### Internal Mutations

Webhook-only functions in `convex/users/internal.ts`:

```typescript
// Only callable from HTTP routes, not from client
export const createUserFromClerk = internalMutation({
  args: { clerkUserId: v.string(), email: v.string(), username: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", { ...args })
  },
})
```

## Route Protection Summary

| Route Pattern | Protection |
|---------------|------------|
| `/` | Public |
| `/login/*` | Public |
| `/[username]` | Public |
| `/admin/*` | Requires auth |
| `/(routes)/*` | Requires auth |
