FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Create data directory
RUN mkdir -p data

# Build TypeScript code
RUN npm run build

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"] 