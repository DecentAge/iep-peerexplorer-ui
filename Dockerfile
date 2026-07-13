# Stage 1: Build the Angular application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and zip utility
RUN apk add --no-cache zip && npm ci
RUN npm install -g @angular/cli


# Copy the rest of the application code
COPY . .

# Build the application with production configuration
RUN npm run build

# Create build directory and zip the build output
RUN mkdir -p /build \
    && cd /app/dist/iep-peerexplorer-ui \
    && zip -r /build/iep-peerexplorer-ui.zip .

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS deploy

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/iep-peerexplorer-ui /usr/share/nginx/html
COPY --from=build /build/iep-peerexplorer-ui.zip /build/iep-peerexplorer-ui.zip
# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Runtime env injection: envsubst fills NETWORK_ENVIRONMENT into env.config.js at container start
COPY env.config.js.template /etc/nginx/templates/env.config.js.template
COPY 30-nginx-iep-startup-script.sh /docker-entrypoint.d/30-nginx-iep-startup-script.sh
RUN chmod +x /docker-entrypoint.d/30-nginx-iep-startup-script.sh

# Expose port 80
EXPOSE 80

# When the container starts, nginx will start automatically
CMD ["nginx", "-g", "daemon off;"]
