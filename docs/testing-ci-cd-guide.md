# Testing and CI/CD Guide

This guide covers the testing infrastructure and CI/CD pipeline for the Link-It application.

## Overview

| Component | Tool | Purpose |
|-----------|------|---------|
| Unit Tests | Vitest | Fast, TypeScript-native testing |
| Component Tests | Testing Library | React component testing |
| E2E Tests | Playwright | Browser automation |
| CI Pipeline | GitHub Actions | Automated PR checks |
| CD Pipeline | GitHub Actions | Automated deployment |
| Feature Flags | Environment Variables | Safe feature rollout |

## Quick Start

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run E2E tests (requires app running or will start dev server)
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run full CI check locally
pnpm ci
```

## Test Structure

```
├── __tests__/                    # Unit & integration tests
│   ├── setup.ts                  # Global test setup
│   ├── convex/                   # Convex function tests
│   │   ├── validators.test.ts    # Input validation tests
│   │   └── utils.test.ts         # Utility function tests
│   ├── lib/                      # Frontend library tests
│   └── components/               # React component tests
├── e2e/                          # Playwright E2E tests
│   └── smoke.spec.ts             # Basic smoke tests
├── vitest.config.mts             # Vitest configuration
└── playwright.config.ts          # Playwright configuration
```

## Writing Tests

### Unit Tests (Vitest)

Tests for pure functions and utilities:

```typescript
// __tests__/convex/validators.test.ts
import { describe, it, expect } from "vitest";
import { validateSlug } from "../../convex/lib/validators";

describe("validateSlug", () => {
  it("should pass for valid slug", () => {
    expect(() => validateSlug("my-slug")).not.toThrow();
  });

  it("should throw for invalid characters", () => {
    expect(() => validateSlug("My Slug!")).toThrow();
  });
});
```

### Component Tests (Testing Library)

Tests for React components:

```typescript
// __tests__/components/Button.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

Tests for user flows:

```typescript
// e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Link-It/i);
});

test("health check passes", async ({ request }) => {
  const response = await request.get("/api/v1/health");
  expect(response.ok()).toBeTruthy();
});
```

## Coverage Requirements

| File | Min Coverage |
|------|-------------|
| `convex/lib/validators.ts` | 80% |

Coverage reports are generated in the `coverage/` directory.

## CI/CD Pipeline

### Branch Strategy: Trunk-Based Development

```
main ─────●─────●─────●─────●─────●───→ production
          │     │     │     │
          └─────┴─────┴─────┴── short-lived feature branches
```

- **Single long-lived branch**: `main`
- **Short-lived feature branches**: Max 1-2 days
- **Every merge to `main`**: Auto-deploys to production
- **Feature flags**: For incomplete features

### PR Checks (ci.yml)

Every PR to `main` runs:

1. **Lint** - ESLint code quality checks
2. **Type Check** - TypeScript compilation
3. **Unit Tests** - Vitest test suite
4. **Build Check** - Next.js production build

All checks must pass before merging.

### Production Deploy (deploy.yml)

On merge to `main`:

1. **Run Tests** - Verify code quality
2. **Deploy Convex** - Update backend functions
3. **Build Docker Image** - Create production container
4. **Deploy to Server** - Update production environment
5. **Health Check** - Verify deployment success

## GitHub Configuration

For detailed step-by-step instructions on configuring GitHub, Convex, Clerk, and your production server, see the [Deployment Setup Guide](./deployment-setup-guide.md).

### Required Secrets

Add these in **Settings > Secrets and variables > Actions**:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL | Build, Deploy |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Build, Deploy |
| `CLERK_SECRET_KEY` | Clerk secret key | Deploy |
| `CONVEX_DEPLOY_KEY` | Convex CI/CD key | Deploy |
| `PROD_HOST` | Production server hostname | Deploy |
| `PROD_USER` | SSH username | Deploy |
| `PROD_SSH_KEY` | SSH private key | Deploy |
| `PROD_URL` | Production URL (e.g., https://example.com) | Health Check |
| `CODECOV_TOKEN` | Coverage reporting | Optional |

### Branch Protection

Configure in **Settings > Branches > Add rule** for `main`:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - `validate` (Lint & Type Check)
  - `test` (Unit Tests)
  - `build` (Build Check)
- [x] Require branches to be up to date before merging
- [x] Require conversation resolution before merging

### Environment Protection

Create a `production` environment in **Settings > Environments**:

- Optional: Required reviewers for manual approval
- Optional: Wait timer before deployment

## Feature Flags

Use feature flags to ship incomplete features safely:

```typescript
// src/lib/feature-flags.ts
import { isFeatureEnabled } from "@/lib/feature-flags";

// In component
if (isFeatureEnabled("ANALYTICS_V2")) {
  return <NewAnalytics />;
}
return <LegacyAnalytics />;
```

### Available Flags

| Flag | Environment Variable | Description |
|------|---------------------|-------------|
| `ANALYTICS_V2` | `NEXT_PUBLIC_FF_ANALYTICS_V2` | New analytics dashboard |
| `DARK_MODE_V2` | `NEXT_PUBLIC_FF_DARK_MODE_V2` | Improved dark mode |
| `NEW_EDITOR` | `NEXT_PUBLIC_FF_NEW_EDITOR` | New link editor |
| `ENHANCED_PROFILE` | `NEXT_PUBLIC_FF_ENHANCED_PROFILE` | Enhanced public profile |

Enable a flag by setting the env var to `true`:

```bash
NEXT_PUBLIC_FF_ANALYTICS_V2=true
```

## Local Development

### First-Time Setup

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### Running Tests

```bash
# Watch mode for TDD
pnpm test:watch

# Run specific test file
pnpm test __tests__/convex/validators.test.ts

# Run E2E with headed browser
pnpm test:e2e -- --headed

# Debug E2E test
pnpm test:e2e -- --debug
```

### Pre-Commit Checks

Run the full CI suite before pushing:

```bash
pnpm ci
```

This runs: `lint → typecheck → test`

## Troubleshooting

### Tests fail with ESM errors

Ensure you're using the `.mts` extension for `vitest.config.mts` and that `happy-dom` is configured as the test environment.

### E2E tests timeout

1. Increase timeout in `playwright.config.ts`
2. Ensure the dev server is running: `pnpm dev`
3. Check if the app is accessible at `http://localhost:3000`

### Coverage thresholds failing

Check coverage report in `coverage/index.html` to identify uncovered lines.

### CI build fails but local works

1. Check that all env vars are set in GitHub Secrets
2. Ensure `pnpm-lock.yaml` is committed
3. Run `pnpm ci` locally to reproduce

## Adding New Tests

### For Convex Functions

1. Create test file in `__tests__/convex/`
2. Import the function directly (no mocking needed for pure functions)
3. Test validation, error cases, and happy paths

### For React Components

1. Create test file in `__tests__/components/`
2. Use `@testing-library/react` for rendering
3. Test user interactions and accessibility

### For E2E Flows

1. Create test file in `e2e/`
2. Use `page.goto()` for navigation
3. Use `expect(locator)` for assertions
4. Keep tests focused and independent

## Deployment

### Manual Deployment

```bash
# Deploy Convex functions
npx convex deploy

# Build and deploy Docker
make build
make prod
```

### Rollback

If a deployment causes issues:

```bash
# SSH to production
ssh user@production-server

# Rollback to previous image
cd /opt/link-it
docker compose pull ghcr.io/your-org/link-it:previous-sha
docker compose up -d
```

For Convex rollback, use the Convex dashboard.

## Related Documentation

- [Deployment Setup Guide](./deployment-setup-guide.md) - External configuration (GitHub, Convex, Clerk, server)
- [Docker Deployment Guide](./docker-deployment-guide.md) - Container deployment
- [Architecture Index](./architecture/index.md) - Project overview
