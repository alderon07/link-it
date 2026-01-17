# Convex Setup Guide

This guide covers the Convex database setup and configuration. The Convex integration is complete and all data operations use Convex for real-time reactivity.

## Prerequisites

- Convex package installed (already done)
- Clerk authentication configured (already done)

## Step 1: Initialize Convex Project

Run the Convex development server to initialize your project:

```bash
npx convex dev
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new Convex project
3. Generate the `_generated/` folder with types
4. Start the Convex dev server

## Step 2: Add Environment Variables

After initializing, add the following to your `.env.local`:

```env
# Convex URL from dashboard (shown after running npx convex dev)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk JWT issuer domain (from Clerk dashboard)
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
```

## Step 3: Configure Clerk JWT Template

**Why is this required?**

Clerk and Convex are separate services. When a user signs in via Clerk, Convex has no way to know who they are. The JWT template creates a signed token that Clerk passes to Convex, allowing Convex to verify the user's identity. Without this, `ctx.auth.getUserIdentity()` returns `null` and users can't be created in Convex.

**Setup:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → **Configure** → **JWT Templates**
2. Click **New template** → Select **Convex**
3. **Keep the name as "convex"** (must match `applicationID` in `auth.config.ts`)
4. Copy the **Issuer URL** (e.g., `https://your-app-00.clerk.accounts.dev`)
5. Click **Save**

**Set the environment variable in both places:**

1. `.env.local`:
   ```
   CLERK_JWT_ISSUER_DOMAIN=https://your-app-00.clerk.accounts.dev
   ```

2. Convex Dashboard → Settings → Environment Variables:
   - Add `CLERK_JWT_ISSUER_DOMAIN` with the same issuer URL

## Step 4: Update Clerk Webhook

Update your Clerk webhook to point to the Convex HTTP endpoint:

1. Go to Clerk Dashboard → **Webhooks**
2. Update (or create) webhook URL:
   ```
   https://<your-convex-deployment>.convex.site/clerk-webhook
   ```
3. Ensure these events are enabled:
   - `user.created`
   - `user.updated`
   - `user.deleted`

## Step 5: Seed System Themes (Optional)

If you want default themes, run this in the Convex dashboard or create a seed script:

```typescript
// In Convex dashboard → Functions → Run a mutation
// Or create convex/seed.ts

const systemThemes = [
  { name: "Default", bgColor: "#FFFFFF", textColor: "#000000", accentColor: "#FF6B6B", isCustom: false },
  { name: "Dark", bgColor: "#1A1A2E", textColor: "#EAEAEA", accentColor: "#00D9FF", isCustom: false },
  { name: "Ocean", bgColor: "#E3F2FD", textColor: "#1565C0", accentColor: "#FF4081", isCustom: false },
  { name: "Forest", bgColor: "#E8F5E9", textColor: "#2E7D32", accentColor: "#FFC107", isCustom: false },
  { name: "Sunset", bgColor: "#FFF3E0", textColor: "#E65100", accentColor: "#7C4DFF", isCustom: false },
];
```

## Step 6: Using Convex Components

All components now use Convex for data operations:

```tsx
// Import Convex-powered components
import { IdentityManager, PublicIdentityComponent, IdentityLinksManager } from "@/components/convex";

// Or use custom hooks
import { useUserIdentities, useIdentityMutations } from "@/hooks/convex";
```

## Step 7: Run the Development Server

Start both Next.js and Convex in parallel:

```bash
pnpm dev
```

Or run them separately:

```bash
# Terminal 1
pnpm dev:convex

# Terminal 2
pnpm dev:next
```

## Verification Checklist

- [ ] `npx convex dev` runs without errors
- [ ] `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- [ ] `CLERK_JWT_ISSUER_DOMAIN` is set in `.env.local`
- [ ] Clerk JWT template "convex" is configured
- [ ] Clerk webhook points to Convex HTTP endpoint
- [ ] App loads without errors
- [ ] User can sign in and data syncs to Convex
- [ ] Identities/links can be created and update in real-time

## Troubleshooting

### "No CONVEX_DEPLOYMENT set"
Run `npx convex dev` to initialize and authenticate.

### "Missing NEXT_PUBLIC_CONVEX_URL"
Add the URL from Convex dashboard to `.env.local`.

### Auth errors in Convex / Users not created
- Ensure JWT template named "convex" exists in Clerk Dashboard
- Ensure `CLERK_JWT_ISSUER_DOMAIN` is set in both `.env.local` AND Convex Dashboard
- The issuer URL must match your Clerk Frontend API URL exactly

### Webhook not creating users
Check Clerk webhook logs and ensure the endpoint URL is correct.

## File Structure Reference

```
convex/
├── _generated/           # Auto-generated (after npx convex dev)
├── schema.ts             # Database schema
├── auth.config.ts        # Clerk auth config
├── http.ts               # Webhook handler
├── lib/                  # Utilities
│   ├── utils.ts          # Helpers
│   └── validators.ts     # Validation logic
├── users/                # User queries/mutations
│   ├── queries.ts
│   ├── mutations.ts
│   └── internal.ts       # Webhook-only functions
├── identities/           # Identity (page) queries/mutations
│   ├── queries.ts
│   ├── mutations.ts
│   └── public.ts         # Public queries
├── links/                # Link queries/mutations
│   ├── queries.ts
│   ├── mutations.ts
│   └── public.ts         # Public queries
├── themes/               # Theme queries/mutations
│   ├── queries.ts
│   └── mutations.ts
├── analytics/            # Analytics queries
│   └── queries.ts
├── settings/             # Settings queries/mutations
│   ├── queries.ts
│   └── mutations.ts
├── seed.ts               # Database seeding
└── seedAll.ts            # Full database seeding

src/
├── hooks/convex/         # React hooks for Convex
│   ├── useUser.ts
│   ├── useIdentities.ts
│   ├── useLinks.ts
│   ├── useThemes.ts
│   ├── useAnalytics.ts
│   ├── useSettings.ts
│   └── index.ts
├── components/convex/    # Convex-powered components
│   ├── IdentityManager.tsx
│   ├── IdentityLinksManager.tsx
│   ├── IdentityThemeManager.tsx
│   ├── PublicIdentityComponent.tsx
│   └── index.ts
└── components/providers/
    └── ConvexClientProvider.tsx
```
