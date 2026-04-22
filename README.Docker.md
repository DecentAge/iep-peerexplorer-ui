# Docker Setup for Infinity Economics Peer Explorer

This document explains how to use Docker to build and run the Infinity Economics Peer Explorer application.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine (optional, for development mode)

## Available Scripts

The following npm scripts are available for working with Docker:

```bash
# Build the Docker image
npm run docker:build

# Run the Docker container
npm run docker:run

# Build and run in development mode
npm run docker:dev

# Clean Docker resources (stop container, remove container and image)
npm run docker:clean
```

Alternatively, you can use the `docker-build.sh` script directly:

```bash
# Show help
./build-docker.sh --help

# Build Docker image
./build-docker.sh --build

# Run Docker container
./build-docker.sh --run

# Build and run in development mode
./build-docker.sh --build --run --dev

# Clean Docker resources
./build-docker.sh --clean

# Push Docker image to registry (needs configuration)
./build-docker.sh --push
```

## Docker Compose

For development purposes, you can use Docker Compose:

```bash
# Start the application with Docker Compose
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the application
docker-compose down
```

## Configuration

### Development vs Production

The Docker build supports both development and production configurations:

- Development mode includes source maps and is not optimized for production
- Production mode includes optimizations like minification and ahead-of-time compilation

### Environment Variables

You can customize the environment variables in the Docker container by modifying the `docker-compose.yml` file or by passing them directly to the `docker run` command.

## Customization

### Nginx Configuration

The application is served using Nginx. You can customize the Nginx configuration by modifying the `nginx.conf` file.

### Registry Push

To push the Docker image to a registry, edit the `push_image` function in the `docker-build.sh` script to configure your registry URL.

## Troubleshooting

### Port Conflicts

If you encounter port conflicts (port 4200 is already in use), you can modify the port mapping in the `docker-compose.yml` file or in the `docker run` command in the `docker-build.sh` script.

### Permission Issues

If you encounter permission issues with the `docker-build.sh` script, make it executable:

```bash
chmod +x build-docker.sh
```
