# syntax=docker/dockerfile:1

# ============================================
# Production Dockerfile for Link-It
# Multi-stage build with node:20-slim
# ============================================

# ----------------------------------------
# Stage 1: Base - Common Node.js + pnpm setup
# ----------------------------------------
FROM node:20-slim AS base

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# ----------------------------------------
# Stage 2: Dependencies - Install production deps
# ----------------------------------------
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ----------------------------------------
# Stage 3: Builder - Build the application
# ----------------------------------------
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (NEXT_PUBLIC_* are baked into the build)
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST

# Build metadata arguments
ARG BUILD_SHA=dev
ARG BUILD_TIMESTAMP

ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST

# Build the application
RUN pnpm build

# ----------------------------------------
# Stage 4: Runner - Production runtime
# ----------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

# Build metadata arguments (re-declare to use in labels)
ARG BUILD_SHA=dev
ARG BUILD_TIMESTAMP

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Pass build metadata to runtime
ENV BUILD_SHA=$BUILD_SHA

# OCI image labels for debugging and traceability
LABEL org.opencontainers.image.title="Link-It"
LABEL org.opencontainers.image.description="Link-It application"
LABEL org.opencontainers.image.revision=$BUILD_SHA
LABEL org.opencontainers.image.created=$BUILD_TIMESTAMP

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
