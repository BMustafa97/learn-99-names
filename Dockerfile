# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/
COPY docs/ ./docs/
COPY README.md ./

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port 3000
EXPOSE 3000

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]
