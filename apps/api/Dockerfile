########################################
# Base Stage  (Common to all stages)
########################################
FROM node:20-alpine AS base

# System deps
RUN apk update && apk add --no-cache libc6-compat

# Setup pnpm environment (following official pnpm Docker guide)
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable pnpm via Corepack
RUN corepack enable

WORKDIR /app


########################################
# Builder Stage  (Prunes workspace)
########################################
FROM base AS builder

# Add turborepo CLI
RUN pnpm add -g turbo

# Copy the full monorepo into container
COPY . .

# Create a pruned version for the "api" workspace
RUN turbo prune api --docker


########################################
# Installer / Build Stage
########################################
FROM base AS installer

WORKDIR /app

# Accept DATABASE_URL as build argument (for Prisma generation)
ARG DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ENV DATABASE_URL=${DATABASE_URL}

# Copy only package.json + lockfiles produced by prune
COPY --from=builder /app/out/json/ .

# Install dependencies for the pruned workspace
RUN pnpm install

# Copy the full pruned workspace
COPY --from=builder /app/out/full/ .

# Set production environment
ENV NODE_ENV=production

# Update Prisma schema to include Alpine Linux binary target
RUN if [ -f packages/database/prisma/schema.prisma ]; then \
    sed -i '/^generator client {/a\  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]' packages/database/prisma/schema.prisma; \
    fi

# Generate Prisma client for Alpine Linux with correct binary target
RUN pnpm turbo db:generate

# Build the API + its internal dependencies (this compiles all TypeScript)
# Build with verbose output to see what's happening
RUN pnpm turbo build --force

# Ensure auth package was built - if dist doesn't exist, build it explicitly
# Note: TypeScript might output to dist/auth/src/ due to monorepo structure
RUN if [ ! -d packages/auth/dist ] || [ ! -f packages/auth/dist/index.js ]; then \
    echo "Building auth package explicitly..."; \
    cd packages/auth && pnpm build || (echo "Build failed for auth package" && exit 1); \
    fi

# Fix the dist structure - TypeScript might output to wrong location
# Check for files in various possible locations and move to correct place
RUN echo "=== Checking dist structure ===" && \
    find packages/auth -name "index.js" -type f 2>/dev/null | head -5 && \
    if [ -f packages/auth/dist/auth/src/index.js ]; then \
        echo "Found files in dist/auth/src/, moving to dist/"; \
        mkdir -p packages/auth/dist && \
        cp packages/auth/dist/auth/src/index.js packages/auth/dist/index.js && \
        cp packages/auth/dist/auth/src/index.d.ts packages/auth/dist/index.d.ts 2>/dev/null || true; \
        rm -rf packages/auth/dist/auth; \
    elif [ -f dist/auth/src/index.js ]; then \
        echo "Found files in dist/auth/src/ (from root), moving to packages/auth/dist/"; \
        mkdir -p packages/auth/dist && \
        cp dist/auth/src/index.js packages/auth/dist/index.js && \
        cp dist/auth/src/index.d.ts packages/auth/dist/index.d.ts 2>/dev/null || true; \
    fi && \
    if [ ! -f packages/auth/dist/index.js ]; then \
        echo "ERROR: packages/auth/dist/index.js not found after fix attempt"; \
        echo "Searching for all index.js files:"; \
        find . -path "*/auth/*index.js" -type f 2>/dev/null | head -10; \
        exit 1; \
    fi && \
    echo "=== Success: packages/auth/dist/index.js exists ===" && \
    ls -la packages/auth/dist/index.js

# Fix package.json exports to point to compiled files instead of source
# This is needed because some packages export source TypeScript files
RUN if [ -f packages/auth/package.json ] && [ -d packages/auth/dist ]; then \
    sed -i 's|"default": "./src/index.ts"|"default": "./dist/index.js"|g' packages/auth/package.json; \
    sed -i 's|"default": "./src/\*.ts"|"default": "./dist/\*.js"|g' packages/auth/package.json; \
    fi


########################################
# Runner Stage  (Production container)
########################################
FROM node:20-alpine AS runner

# Create a non-root user for security
RUN addgroup --system --gid 1001 nestjs \
    && adduser --system --uid 1001 nestjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the built app from the installer stage with proper ownership
# This includes all compiled code, node_modules, and Prisma generated files
COPY --from=installer --chown=nestjs:nestjs /app .

# Verify critical files exist after copy and check symlinks
# This runs as root before switching to nestjs user
RUN echo "=== Checking packages/auth/dist ===" && \
    ls -la packages/auth/dist/ 2>/dev/null || (echo "ERROR: packages/auth/dist/ not found" && exit 1) && \
    echo "=== Checking node_modules symlink ===" && \
    ls -la apps/api/node_modules/@repo/auth 2>/dev/null || (echo "ERROR: @repo/auth symlink not found" && exit 1) && \
    echo "=== Checking if dist exists via symlink ===" && \
    ls -la apps/api/node_modules/@repo/auth/dist/ 2>/dev/null || (echo "ERROR: dist not accessible via symlink" && exit 1) && \
    echo "=== Verifying index.js exists ===" && \
    test -f apps/api/node_modules/@repo/auth/dist/index.js || (echo "ERROR: index.js not found" && exit 1) && \
    echo "=== All checks passed ==="

USER nestjs

# Start API
CMD ["node", "apps/api/dist/main.js"]
