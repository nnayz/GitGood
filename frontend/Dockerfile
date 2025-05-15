# Use Node.js as the base image
FROM node:23.10.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# COpy frontend code
COPY . .

RUN npm run build

# Expose port 5173 to the outside world
EXPOSE 4173

# Command to run the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

