FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist ./dist

# Expose port
EXPOSE 8000

# Set environment
ENV PORT=8000
ENV NODE_ENV=production

# Start server
CMD ["node", "dist/server/index.js"]
