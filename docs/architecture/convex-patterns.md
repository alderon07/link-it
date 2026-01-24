# Convex Patterns

## Architecture Overview

```
Client Component → useQuery/useMutation → WebSocket → Convex Backend → Database
                                              ↓
                         Automatic real-time updates to all subscribers
```

## Queries (Read Data)

Queries are read-only, automatically reactive. Components re-render when data changes.

```typescript
// convex/identities/queries.ts
import { query } from "../_generated/server"
import { v } from "convex/values"

export const getUserIdentities = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first()

    if (!user) return []

    return await ctx.db
      .query("identities")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("deletionTime"), undefined))
      .collect()
  },
})
```

## Mutations (Write Data)

Mutations modify data. Always authenticated (except webhooks). Validate with Zod.

```typescript
// convex/identities/mutations.ts
import { mutation } from "../_generated/server"
import { v } from "convex/values"
import { z } from "zod"

const CreateIdentitySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
})

export const createIdentity = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Not authenticated")
    }

    const validated = CreateIdentitySchema.safeParse(args)
    if (!validated.success) {
      throw new ConvexError("Validation failed")
    }

    // ... create in database
    return await ctx.db.insert("identities", { /* ... */ })
  },
})
```

## Public Functions (No Auth)

For public-facing pages. No authentication required.

```typescript
// convex/identities/public.ts
export const getPublicIdentityByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()

    if (!user || user.deletionTime) return null

    return await ctx.db
      .query("identities")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.and(
        q.eq(q.field("isPublic"), true),
        q.eq(q.field("deletionTime"), undefined)
      ))
      .first()
  },
})
```

## Using in Components

```typescript
"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function IdentityList() {
  // Query returns undefined while loading, then data
  const identities = useQuery(api.identities.queries.getUserIdentities)
  const createIdentity = useMutation(api.identities.mutations.createIdentity)

  if (identities === undefined) return <LoadingSkeleton />

  const handleCreate = async () => {
    try {
      await createIdentity({ name: "New", slug: "new" })
      toast.success("Created!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed")
    }
  }

  return (
    <div>
      {identities.map(identity => (
        <IdentityCard key={identity._id} identity={identity} />
      ))}
    </div>
  )
}
```

## Custom Hooks

Wrap Convex operations in custom hooks at `src/hooks/convex/`:

```typescript
// src/hooks/convex/useIdentities.ts
export function useUserIdentities() {
  return useQuery(api.identities.queries.getUserIdentities)
}

export function useIdentityMutations() {
  return {
    createIdentity: useMutation(api.identities.mutations.createIdentity),
    updateIdentity: useMutation(api.identities.mutations.updateIdentity),
    deleteIdentity: useMutation(api.identities.mutations.deleteIdentity),
  }
}
```

## Type Safety

Types are auto-generated from `convex/schema.ts`:

```typescript
import { Id, Doc } from "@/convex/_generated/dataModel"

type IdentityId = Id<"identities">
type IdentityDoc = Doc<"identities">
```

## Error Handling

```typescript
// In Convex function
throw new ConvexError({ code: "NOT_FOUND", message: "User not found" })

// In component
try {
  await mutation(args)
} catch (error) {
  if (error instanceof ConvexError) {
    toast.error(error.message)
  }
}
```
