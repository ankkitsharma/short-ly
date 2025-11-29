FROM node:20-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm environment (following official pnpm Docker guide)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm via Corepack
RUN corepack enable

# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
# Add turborepo CLI
RUN pnpm add -g turbo
COPY . .
# Add lockfile and package.json's of isolated subworkspace
RUN turbo prune web --docker

# ---
FROM base AS builder
# Accept DATABASE_URL as build argument (for Prisma during Next.js build)
# Use a dummy value if not provided - Prisma generation doesn't need a real DB connection
ARG DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ENV DATABASE_URL=${DATABASE_URL}

# Accept NEXT_PUBLIC_SERVER_URL as build argument (needed at build time for Next.js)
ARG NEXT_PUBLIC_SERVER_URL=https://shortly.ankitsh.cc/api
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install
# Build the project
COPY --from=prepare /app/out/full/ .

# Set production environment
ENV NODE_ENV=production

# Update Prisma schema to include Alpine Linux binary target
RUN if [ -f packages/database/prisma/schema.prisma ]; then \
    sed -i '/^generator client {/a\  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]' packages/database/prisma/schema.prisma; \
    fi

# Generate Prisma client for Alpine Linux with correct binary target
RUN pnpm turbo db:generate

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build

# ---
FROM base AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy Prisma generated client and query engine
# Next.js standalone output should include this, but ensure it's available
COPY --from=builder --chown=nextjs:nodejs /app/packages/database/generated ./packages/database/generated

CMD node apps/web/server.js