#!/bin/bash

# Build and push Docker image to ECR
# Usage: ./scripts/ecr-build-and-push.sh [tag]

set -e

AWS_REGION="us-east-1"
ECR_REPOSITORY="silq-strapi"
TAG=${1:-latest}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-""}

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: AWS_ACCOUNT_ID environment variable is required"
    echo "Please set it with: export AWS_ACCOUNT_ID=your-account-id"
    exit 1
fi

ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"

echo "Building Docker image: $ECR_URI:$TAG"

# Build the Docker image
docker build -t $ECR_URI:$TAG .

echo "Docker image built successfully: $ECR_URI:$TAG"

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Push the image
echo "Pushing to ECR..."
docker push $ECR_URI:$TAG

echo "Image pushed successfully to ECR!"
echo "Image URI: $ECR_URI:$TAG"
