#!/bin/bash

# ECR Login Script for AWS Ohio (us-east-2)
# Usage: ./scripts/ecr-login.sh

set -e

AWS_REGION="us-east-2"
ECR_REPOSITORY="silq-strapi"
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-""}

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: AWS_ACCOUNT_ID environment variable is required"
    echo "Please set it with: export AWS_ACCOUNT_ID=your-account-id"
    exit 1
fi

echo "Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "ECR login successful!"
echo "Repository URI: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
