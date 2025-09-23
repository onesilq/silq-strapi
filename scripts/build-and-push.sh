#!/bin/bash

# Build and push Docker image for Strapi
# Usage: ./scripts/build-and-push.sh [tag]

set -e

# Get the tag from command line or use 'latest'
TAG=${1:-latest}
IMAGE_NAME="my-strapi-project"

echo "Building Docker image: ${IMAGE_NAME}:${TAG}"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${TAG} .

echo "Docker image built successfully: ${IMAGE_NAME}:${TAG}"

# Optional: Push to registry (uncomment if you have a registry)
# echo "Pushing to registry..."
# docker push ${IMAGE_NAME}:${TAG}

echo "Build complete!"
