# CI/CD and Testing Plan for Link-It

## Branching Strategy: Trunk-Based Development

**Core Principles:**
- Single long-lived branch: `main` (the trunk)
- Short-lived feature branches (< 1-2 days)
- Frequent integration (at least daily)
- Feature flags for incomplete features
- Deploy from `main` only

```
main ─────●─────●─────●─────●─────●─────●─────●───→ production
          │     │     │     │     │     │
          │     │     │     │     │     └── feature/z (merged same day)
          │     │     │     │     └── fix/bug-123
          │     │     │     └── feature/y (1 day)
          │     │     └── feature/x
          │     └── chore/update-deps
          └── feature/w
```

**Branch Naming Convention:**
- `feature/<name>` - New features
- `fix/<issue-id>` - Bug fixes
- `chore/<name>` - Maintenance tasks
- `hotfix/<name>` - Urgent production fixes

---

## Current State

| Aspect | Status |
|--------|--------|
| Testing framework | None |
| Unit tests | None |
| Integration tests | None |
| E2E tests | None |
| CI/CD pipeline | None |
| Docker | Configured (dev/staging/prod) |
| Deployment docs | Exists |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Actions                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Every PR to main:                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Lint   │→ │  Type   │→ │  Unit   │→ │  Build  │            │
│  │         │  │  Check  │  │  Tests  │  │  Check  │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                     │                                           │
│                     ▼                                           │
│           ┌─────────────────┐                                   │
│           │  Preview Deploy │  (optional: Vercel/Railway)       │
│           │  + E2E Tests    │                                   │
│           └─────────────────┘                                   │
│                                                                 │
│  Merge to main:                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  Build  │→ │ Convex  │→ │   Deploy    │→ │  Smoke Test   │  │
│  │  Image  │  │ Deploy  │  │  Production │  │               │  │
│  └─────────┘  └─────────┘  └─────────────┘  └───────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Trunk-Based Development Rules

### 1. Branch Lifecycle
- Feature branches live for **maximum 1-2 days**
- If a feature takes longer, break it into smaller PRs
- Use feature flags for incomplete features

### 2. PR Requirements
- Every PR requires:
  - Passing CI (lint, typecheck, tests, build)
  - At least 1 approval (optional for small fixes)
  - No merge conflicts with main
- Squash merge to keep history clean

### 3. Feature Flags
For features that span multiple PRs:

```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  NEW_ANALYTICS_DASHBOARD: process.env.NEXT_PUBLIC_FF_ANALYTICS === 'true',
  DARK_MODE_V2: process.env.NEXT_PUBLIC_FF_DARK_MODE_V2 === 'true',
} as const;

// Usage
if (FEATURE_FLAGS.NEW_ANALYTICS_DASHBOARD) {
  return <NewAnalyticsDashboard />;
}
return <LegacyAnalytics />;
```

### 4. Deployment Strategy
- Every merge to `main` triggers production deploy
- Automatic rollback on health check failure
- No staging environment (preview deploys on PRs instead)

---

## Phase 1: Testing Framework Setup

### 1.1 Install Dependencies

```bash
pnpm add -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/dom jsdom @playwright/test happy-dom
```

### 1.2 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}', 'convex/**/*.ts'],
      exclude: ['**/*.d.ts', '**/node_modules/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 1.3 Test Structure

```
├── __tests__/
│   ├── setup.ts                  # Global test setup
│   ├── convex/
│   │   ├── validators.test.ts    # Validator functions
│   │   ├── utils.test.ts         # Utility functions
│   │   └── auditLog.test.ts      # Audit logging
│   ├── lib/
│   │   └── rate-limit.test.ts    # (if re-added)
│   └── components/
│       └── PublicIdentity.test.tsx
├── e2e/
│   ├── auth.spec.ts              # Auth flows
│   ├── identity.spec.ts          # CRUD operations
│   └── public-page.spec.ts       # Public page viewing
├── vitest.config.ts
└── playwright.config.ts
```

### 1.4 Priority Test Coverage

| File | Priority | Why |
|------|----------|-----|
| `convex/lib/validators.ts` | Critical | Security validation |
| `convex/lib/utils.ts` | High | Core business logic |
| `convex/lib/auditLog.ts` | Medium | Compliance |
| `src/lib/analytics/*` | Low | Non-critical |

---

## Phase 2: CI Pipeline

### 2.1 Main CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    name: Build Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build Next.js
        run: pnpm build
        env:
          NEXT_PUBLIC_CONVEX_URL: ${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
```

### 2.2 Production Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production  # Requires approval if configured

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      # Deploy Convex functions first
      - name: Deploy Convex
        run: npx convex deploy --cmd-url-env-var-name CONVEX_URL
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}

      # Build and push Docker image
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:${{ github.sha }}
            ghcr.io/${{ github.repository }}:latest
          build-args: |
            NEXT_PUBLIC_CONVEX_URL=${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
            BUILD_SHA=${{ github.sha }}
            BUILD_TIMESTAMP=${{ github.event.head_commit.timestamp }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Deploy to production server
      - name: Deploy to Production
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/link-it
            docker compose pull
            docker compose up -d --remove-orphans

      # Verify deployment
      - name: Smoke Test
        env:
          PROD_URL: ${{ secrets.PROD_URL }}
        run: |
          sleep 10
          for i in {1..6}; do
            if curl -fsS "${PROD_URL}/api/v1/health"; then
              echo "Health check passed"
              exit 0
            fi
            echo "Attempt $i failed, retrying..."
            sleep 5
          done
          echo "Health check failed after 6 attempts"
          exit 1
```

### 2.3 PR Preview Deploys (Optional)

For preview environments on each PR (useful for design review):

```yaml
# .github/workflows/preview.yml
name: Preview Deploy

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Option 1: Vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

      # Option 2: Railway
      # - uses: railwayapp/railway-github-action@v1
      #   with:
      #     railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Phase 3: E2E Testing with Playwright

### 3.1 Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3.2 Basic E2E Smoke Test

```typescript
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Link-It/);
  });

  test('health endpoint returns healthy', async ({ request }) => {
    const response = await request.get('/api/v1/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('healthy');
  });

  test('public profile page loads', async ({ page }) => {
    // Assuming a test user exists
    await page.goto('/testuser');
    // Should either show profile or 404, not error
    const status = await page.evaluate(() =>
      !document.body.textContent?.includes('Application error')
    );
    expect(status).toBeTruthy();
  });
});
```

---

## Phase 4: GitHub Repository Configuration

### 4.1 Branch Protection Rules

Go to **Settings > Branches > Add rule** for `main`:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Required checks: `validate`, `test`, `build`
- [x] Require branches to be up to date before merging
- [x] Require conversation resolution before merging
- [ ] Require signed commits (optional)
- [x] Do not allow bypassing the above settings

### 4.2 Required Secrets

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex production URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CONVEX_DEPLOY_KEY` | Convex deployment key |
| `PROD_HOST` | Production server hostname |
| `PROD_USER` | SSH username |
| `PROD_SSH_KEY` | SSH private key |
| `CODECOV_TOKEN` | Coverage reporting (optional) |

### 4.3 Environments

Create these environments in **Settings > Environments**:

| Environment | Protection Rules |
|-------------|------------------|
| `production` | Required reviewers (optional), Wait timer (optional) |

---

## Phase 5: Feature Flags Implementation

### 5.1 Simple Feature Flag System

```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  // Format: FEATURE_NAME: boolean | () => boolean
  ANALYTICS_V2: process.env.NEXT_PUBLIC_FF_ANALYTICS_V2 === 'true',
  DARK_MODE_V2: process.env.NEXT_PUBLIC_FF_DARK_MODE_V2 === 'true',
  NEW_EDITOR: process.env.NEXT_PUBLIC_FF_NEW_EDITOR === 'true',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}
```

### 5.2 Usage in Components

```tsx
import { isFeatureEnabled } from '@/lib/feature-flags';

export function Dashboard() {
  if (isFeatureEnabled('ANALYTICS_V2')) {
    return <AnalyticsV2 />;
  }
  return <AnalyticsLegacy />;
}
```

---

## Implementation Checklist

### Week 1: Testing Foundation
- [ ] Install testing dependencies
- [ ] Create `vitest.config.ts`
- [ ] Create `__tests__/setup.ts`
- [ ] Write tests for `convex/lib/validators.ts`
- [ ] Write tests for `convex/lib/utils.ts`
- [ ] Add test scripts to `package.json`
- [ ] Achieve 80%+ coverage on validators

### Week 2: CI Pipeline
- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure branch protection on `main`
- [ ] Set up GitHub secrets
- [ ] Test CI on a feature branch PR
- [ ] Add status badges to README

### Week 3: Deployment Pipeline
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Set up Convex production project
- [ ] Configure production environment
- [ ] Test full deploy cycle
- [ ] Document rollback procedure

### Week 4: E2E & Polish
- [ ] Set up Playwright
- [ ] Create smoke test suite
- [ ] Add E2E to CI (optional for PRs)
- [ ] Create feature flag system
- [ ] Document the full workflow

---

## Package.json Scripts (Final)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "ci": "pnpm lint && pnpm typecheck && pnpm test"
  }
}
```

---

## Rollback Procedure

If a deployment causes issues:

### Automatic (Health Check Failure)
The deployment workflow will fail at the smoke test step, leaving the previous version running.

### Manual Rollback

```bash
# SSH to production server
ssh user@production-server

# Roll back to previous image
cd /opt/link-it
docker compose pull ghcr.io/your-org/link-it:previous-sha
docker compose up -d

# Or use Docker rollback
docker service rollback link-it  # If using Swarm
```

### Convex Rollback
Convex maintains deployment history. Use the Convex dashboard to rollback functions.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| CI pipeline duration | < 5 minutes |
| Deployment duration | < 3 minutes |
| Test coverage (validators) | > 80% |
| Mean time to recovery | < 10 minutes |
| Failed deployments caught by CI | > 95% |
