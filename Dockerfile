# ---------- Stage 1: Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx vite build

# ---------- Stage 2: Production ----------
FROM node:22-alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/api ./api

# Full npm ci (NOT --production) so tsx (devDependency) is available
RUN npm ci

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npx", "tsx", "server.ts"]
