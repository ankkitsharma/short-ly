########################################
# Base Stage  (Common to all stages)
########################################
FROM node:18-alpine AS base

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
# Use a dummy value if not provided - Prisma generation doesn't need a real DB connection
ARG DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ENV DATABASE_URL=${DATABASE_URL}

# Copy only package.json + lockfiles produced by prune
COPY --from=builder /app/out/json/ .

# Install dependencies for the pruned workspace
RUN pnpm install

# Copy the full pruned workspace
COPY --from=builder /app/out/full/ .

# Build the API + its internal dependencies
RUN pnpm turbo build


########################################
# Runner Stage  (Production container)
########################################
FROM node:18-alpine AS runner

# Create a non-root user for security
RUN addgroup --system --gid 1001 nestjs \
    && adduser --system --uid 1001 nestjs

WORKDIR /app
USER nestjs

# Copy the built app from the installer stage
COPY --from=installer /app .

# Start API
CMD ["node", "apps/api/dist/main.js"]
