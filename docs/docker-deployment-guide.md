# Docker Deployment Guide

This guide covers Docker containerization for the Link-It application, supporting development, staging, and production environments.

## Architecture Overview

**What gets containerized:**
- Next.js application (frontend + API routes)

**What stays as cloud services:**
- Convex (real-time database)
- Clerk (authentication)
- PostHog (analytics)

Only the Next.js app needs containerization since Convex, Clerk, and PostHog are all cloud-hosted services.

## Prerequisites

- Docker and Docker Compose installed
- Make (usually pre-installed on Linux/macOS, available via WSL on Windows)
- Environment files configured (see [Environment Setup](#environment-setup))
- Convex project initialized (`npx convex dev`)
- Clerk application configured

## Quick Start

### Using Make (Recommended)

```bash
# See all available commands
make help

# Development
make dev           # Start dev environment (with hot-reload)

# Staging
make staging       # Start staging (port 3001, with env validation + smoke test)

# Production
make prod          # Start production (port 3000, with env validation + smoke test)

# Build
make build         # Build production image with build metadata

# Operations
make logs          # Follow container logs
make down          # Stop all containers
make clean         # Remove containers and volumes
```

### Manual Docker Compose

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml -p linkit-staging --env-file .env.staging up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml -p linkit-prod --env-file .env.prod up -d
```

## Environment Setup

### Environment Files

| File | Purpose | Template |
|------|---------|----------|
| `.env` | Local development | `.env.example` |
| `.env.staging` | Staging deployment | `.env.staging.example` |
| `.env.prod` | Production deployment | `.env.prod.example` |

### Environment Validation

The `scripts/check-env.sh` script validates environment variables before deployment:

```bash
# Check all variables (uses .env by default)
./scripts/check-env.sh all

# Check only build-time variables
./scripts/check-env.sh build

# Check staging environment
./scripts/check-env.sh all --env-file .env.staging

# CI mode (only show errors)
./scripts/check-env.sh all --quiet
```

**Exit codes:**
- `0` - All checks passed
- `1` - Missing required variable
- `2` - Invalid format

### Validation Rules

| Variable | Required | Format |
|----------|----------|--------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | `https://*.convex.cloud` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Must start with `pk_` |
| `CLERK_SECRET_KEY` | Yes (runtime) | Must start with `sk_` |
| `NEXT_PUBLIC_POSTHOG_KEY` | No* | If set, `POSTHOG_HOST` required |
| `NEXT_PUBLIC_POSTHOG_HOST` | No* | If set, `POSTHOG_KEY` required |

*PostHog variables are paired - both must be set for PostHog to work.

## File Structure

```
├── Dockerfile              # Production multi-stage build
├── Dockerfile.dev          # Development with hot-reload
├── docker-compose.yml      # Base config (service, healthcheck, security)
├── docker-compose.dev.yml  # Development overrides
├── docker-compose.staging.yml  # Staging overrides (port 3001)
├── docker-compose.prod.yml # Production overrides (port 3000)
├── docker-compose.override.yml  # Local customizations (gitignored)
├── Makefile                # Docker operations
├── scripts/
│   └── check-env.sh        # Environment validation
├── .env.example            # Development env template
├── .env.staging.example    # Staging env template
├── .env.prod.example       # Production env template
└── .dockerignore           # Build context exclusions
```

## Multi-Environment Deployment

### Environment Differences

| Aspect | Staging | Production |
|--------|---------|------------|
| Port | 3001 | 3000 |
| Memory limit | 256MB | 512MB |
| CPU limit | 0.25 | 0.5 |
| Restart policy | None (fail fast) | `unless-stopped` |
| `NODE_ENV` | production | production |
| `APP_ENV` | staging | production |

### Project Isolation

Each environment uses a separate Docker Compose project name to avoid conflicts:
- Development: `link-it` (default)
- Staging: `linkit-staging`
- Production: `linkit-prod`

```bash
# View containers by project
docker ps --filter "name=linkit-staging"
docker ps --filter "name=linkit-prod"
```

### Local Overrides

Create `docker-compose.override.yml` for local customizations (gitignored):

```yaml
# Example: different port, debug flags
services:
  link-it:
    ports:
      - "3002:3000"  # My local port preference
    environment:
      - DEBUG=true
```

## Build Metadata

Production builds include metadata for traceability:

### Build Command

```bash
make build  # Automatically includes git SHA and timestamp
```

Or manually:
```bash
docker compose build \
  --build-arg BUILD_SHA=$(git rev-parse --short HEAD) \
  --build-arg BUILD_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

### Verify Build Metadata

```bash
# Via health endpoint
curl http://localhost:3000/api/v1/health
# Returns: {"status":"healthy","buildSha":"abc1234","uptime":120,...}

# Via Docker labels
docker inspect link-it | jq '.[0].Config.Labels'
```

## Health Checks

### Health Endpoint

`GET /api/v1/health` returns:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "buildSha": "abc1234",
  "uptime": 3600
}
```

The endpoint intentionally doesn't call Convex/Clerk to avoid false negatives.

### Smoke Test

The Makefile runs a smoke test after starting staging/production:

```bash
# Manual smoke test
make smoke-test PORT=3000

# Customized timeout
for i in {1..10}; do
  curl -fsS http://localhost:3000/api/v1/health && break
  sleep 3
done
```

## Available Make Targets

| Target | Description |
|--------|-------------|
| `help` | Show all targets |
| `dev` | Start development environment |
| `staging` | Start staging (with validation + smoke test) |
| `prod` | Start production (with validation + smoke test) |
| `build` | Build image with metadata |
| `check-env` | Validate all environment variables |
| `check-env-build` | Validate build-time vars only |
| `check-env-staging` | Validate staging environment |
| `check-env-prod` | Validate production environment |
| `smoke-test` | Health check (use `PORT=3001`) |
| `down` | Stop all containers |
| `logs` | Follow logs (default env) |
| `logs-staging` | Follow staging logs |
| `logs-prod` | Follow production logs |
| `shell` | Shell into container |
| `ps` | Show running containers |
| `clean` | Remove containers and volumes |
| `clean-all` | Remove images, containers, volumes |

## Docker Configuration Details

### Production Dockerfile

The production Dockerfile uses a multi-stage build:

| Stage | Purpose |
|-------|---------|
| `base` | Node.js 20 slim + pnpm via Corepack |
| `deps` | Install production dependencies |
| `builder` | Build the Next.js application |
| `runner` | Minimal runtime with standalone output |

**Key features:**
- `node:20-slim` base (Debian) - avoids Alpine + sharp/native-dep issues
- Corepack for deterministic pnpm version
- BuildKit cache mounts for fast rebuilds
- `--frozen-lockfile` to fail fast on lockfile drift
- Non-root user (`nextjs:nodejs`) for security
- Standalone output for minimal image size
- Build metadata (SHA, timestamp) in labels

### Security Hardening (Production)

The production `docker-compose.yml` includes:

```yaml
read_only: true          # Read-only filesystem
tmpfs:
  - /tmp                 # Writable temp directory
cap_drop:
  - ALL                  # Drop all capabilities
security_opt:
  - no-new-privileges    # Prevent privilege escalation
```

### WSL/Windows File Watching

Development compose includes polling fixes for WSL:

```yaml
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

## Deployment Workflow

### 1. Deploy Convex Functions

```bash
npx convex deploy
```

### 2. Validate Environment

```bash
./scripts/check-env.sh all --env-file .env.prod
```

### 3. Build and Push Image

```bash
# Build with metadata
make build

# Tag and push
docker tag link-it-link-it:latest your-registry/link-it:latest
docker push your-registry/link-it:latest
```

### 4. Deploy

```bash
# Using make
make prod

# Or manually
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  -p linkit-prod --env-file .env.prod up -d
```

### 5. Verify

```bash
make smoke-test PORT=3000
# Or
curl http://localhost:3000/api/v1/health
```

## Deployment Platforms

This Docker setup works with:

| Platform | Notes |
|----------|-------|
| AWS ECS/Fargate | Use task definition with the image |
| Google Cloud Run | Deploy directly from container registry |
| Azure Container Apps | Supports compose files |
| DigitalOcean App Platform | Docker-based deployment |
| Railway | Auto-detects Dockerfile |
| Render | Docker deployment supported |
| Fly.io | Use `fly launch` with Dockerfile |
| Kubernetes | Create deployment manifests from the image |
| Any VPS | Install Docker and run compose |

## Verification Checklist

### Development
- [ ] `make dev` starts without errors
- [ ] Hot-reload works when editing files in `src/`
- [ ] Convex dev server connects from host
- [ ] App loads at `http://localhost:3000`

### Staging
- [ ] `make staging` passes env validation
- [ ] Container starts on port 3001
- [ ] Smoke test passes
- [ ] App accessible at `http://localhost:3001`

### Production
- [ ] `make prod` passes env validation
- [ ] Container starts on port 3000
- [ ] Smoke test passes
- [ ] Health check shows correct `buildSha`
- [ ] Container runs as non-root: `docker compose exec link-it whoami` → `nextjs`
- [ ] Clerk authentication works
- [ ] Convex real-time updates work

## Troubleshooting

### Environment validation fails

```bash
# Check specific environment
./scripts/check-env.sh all --env-file .env.prod

# Common issues:
# - NEXT_PUBLIC_CONVEX_URL not matching https://*.convex.cloud
# - Clerk keys not starting with pk_/sk_
# - Only one PostHog variable set (need both or neither)
```

### "sharp" or native module errors
- Ensure you're using `node:20-slim` (Debian), not Alpine
- The standalone build should include the correct sharp binary

### Hot-reload not working in development
- Check that `CHOKIDAR_USEPOLLING=true` and `WATCHPACK_POLLING=true` are set
- Ensure volumes are mounted correctly in `docker-compose.dev.yml`
- On WSL, files must be in the Linux filesystem (not `/mnt/c/`)

### Build fails with "frozen lockfile" error
- Run `pnpm install` locally to update `pnpm-lock.yaml`
- Commit the updated lockfile

### Container exits immediately
- Check logs: `make logs` or `docker compose logs`
- Ensure all required environment variables are set
- Verify the `.env` file exists and is readable

### Health check failing
- Ensure port 3000 is exposed
- Check that `/api/v1/health` endpoint is accessible
- Increase `start_period` if the app needs more time to start

### Permission denied errors
- The container runs as non-root user `nextjs` (UID 1001)
- Ensure mounted volumes have correct permissions
- For development, the named `node_modules` volume handles this

### Staging and production port conflicts
- Staging uses port 3001, production uses 3000
- Check with `docker ps` or `make ps`
- Use project names: `docker compose -p linkit-staging down`

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate environment
        run: |
          echo "NEXT_PUBLIC_CONVEX_URL=${{ secrets.NEXT_PUBLIC_CONVEX_URL }}" > .env.ci
          echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}" >> .env.ci
          echo "CLERK_SECRET_KEY=${{ secrets.CLERK_SECRET_KEY }}" >> .env.ci
          ./scripts/check-env.sh all --env-file .env.ci --quiet

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          build-args: |
            NEXT_PUBLIC_CONVEX_URL=${{ secrets.NEXT_PUBLIC_CONVEX_URL }}
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
            BUILD_SHA=${{ github.sha }}
            BUILD_TIMESTAMP=${{ github.event.head_commit.timestamp }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
