# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package files from all workspaces
COPY packages/types/package.json ./packages/types/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/emissions/package.json ./packages/emissions/package.json
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Enable corepack
RUN corepack enable

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/turbo.json ./turbo.json

# Copy source code
COPY packages ./packages
COPY apps/api ./apps/api

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Generate Prisma Client
RUN cd apps/api && npx prisma generate

# Build
RUN pnpm --filter @carbon-ledger/api build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Enable corepack
RUN corepack enable

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/src/prisma ./apps/api/src/prisma

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs && \
    chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]

