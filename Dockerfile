# Stage 1 - build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2 - production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Copy deps from builder (includes sequelize-cli) for migrations; production still runs compiled dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Required for sequelize-cli in production (config + migrations + rc)
COPY .sequelizerc ./
COPY src/migrations ./src/migrations
COPY src/config/sequelize.config.js ./src/config/sequelize.config.js
# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "dist/server.js"]
