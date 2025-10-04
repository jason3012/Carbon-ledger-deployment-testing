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
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/src/trpc ./apps/api/src/trpc

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
COPY apps/web ./apps/web
COPY apps/api/src/trpc ./apps/api/src/trpc

# Set build environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build
RUN pnpm --filter @carbon-ledger/web build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]

