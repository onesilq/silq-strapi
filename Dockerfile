# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies including PostgreSQL client
RUN yarn install --frozen-lockfile && \
    yarn add pg

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Start the application
CMD ["yarn", "start"]
