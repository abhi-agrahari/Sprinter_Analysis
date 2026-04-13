# Use Node 20 as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install expo-cli globally
RUN npm install -g expo-cli

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose ports for Expo (19000, 19001, 19002, 19006 for web)
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

# Start the expo dev server for web by default
CMD ["npx", "expo", "start", "--web", "--non-interactive"]
