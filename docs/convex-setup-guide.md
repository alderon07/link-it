# Convex Setup Guide

This guide covers the remaining steps to complete the Convex database integration.

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

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **JWT Templates**
3. Click **New template**
4. Select **Convex** template (or create a blank one)
5. Configure:
   - **Name**: `convex`
   - **Issuer**: Your Clerk issuer domain
6. Save the template

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

## Step 6: Switch to Convex Components

Replace the old mock-data components with the new Convex-powered ones:

```tsx
// Old import (uses mock data)
import { PageManager } from "@/components/page-manager";
import { PublicPageComponent } from "@/components/public-page-component";
import { PageLinksManager } from "@/components/page-links-manager";

// New import (uses Convex)
import { PageManager, PublicPageComponent, PageLinksManager } from "@/components/convex";
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
- [ ] Pages/links can be created and update in real-time

## Troubleshooting

### "No CONVEX_DEPLOYMENT set"
Run `npx convex dev` to initialize and authenticate.

### "Missing NEXT_PUBLIC_CONVEX_URL"
Add the URL from Convex dashboard to `.env.local`.

### Auth errors in Convex
Ensure `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk instance and JWT template is named "convex".

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
├── users/                # User queries/mutations
├── pages/                # Page queries/mutations
├── links/                # Link queries/mutations
├── themes/               # Theme queries/mutations
└── settings/             # Settings queries/mutations

src/
├── hooks/convex/         # React hooks for Convex
├── components/convex/    # Convex-powered components
└── components/providers/ConvexClientProvider.tsx
```
