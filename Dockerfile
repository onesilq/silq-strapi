# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy source code
COPY --chown=strapi:nodejs . .

# Build the application
RUN yarn build

# Change ownership of the app directory
RUN chown -R strapi:nodejs /app

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1337/_health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start"]
