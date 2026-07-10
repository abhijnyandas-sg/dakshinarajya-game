FROM node:20-alpine

WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json tsconfig.json ./

# Copy shared library
COPY shared ./shared

# Copy server and client packages
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install all dependencies (npm workspaces will handle the links)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the shared library first
WORKDIR /app/shared
RUN npm run build

# Build the React client
WORKDIR /app/client
RUN npm run build

# Build the NestJS server
WORKDIR /app/server
RUN npm run build

# Set the start directory
WORKDIR /app/server

# Expose the server port
EXPOSE 3001

# Start the server
CMD ["npm", "run", "start:prod"]
