# Use Node.js LTS version
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Start the app
CMD ["npm", "start", "--", "--host", "0.0.0.0"]