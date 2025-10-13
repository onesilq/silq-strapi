# Silq Strapi - ECR Docker Image

This repository contains a Strapi application configured to build and deploy Docker images to AWS ECR in the Ohio region (us-east-2).

## Purpose

This repository serves a single purpose: **Build a Docker image of Strapi and publish it to the ECR repository on AWS Ohio**.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Docker installed
- AWS Account ID set as environment variable

## Setup

1. Set your AWS Account ID:
   ```bash
   export AWS_ACCOUNT_ID=your-account-id
   ```

2. Ensure AWS CLI is configured:
   ```bash
   aws configure
   ```

## Usage

### Local Build and Push

1. Login to ECR:
   ```bash
   ./scripts/ecr-login.sh
   ```

2. Build and push to ECR:
   ```bash
   ./scripts/ecr-build-and-push.sh [tag]
   ```

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/ecr-deploy.yml`) that automatically builds and pushes Docker images to ECR when code is pushed to the main/master branch.

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## ECR Repository

- **Region:** us-east-1 (N. Virginia) (for Prod)
- **Region:** us-east-2 (Ohio) (for staging)
- **Repository Name:** silq-strapi
- **Image URI:** `{AWS_ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/silq-strapi`

## Docker Image Features

- Based on Node.js 18 Alpine
- Non-root user for security
- Health check endpoint
- Production optimizations
- Signal handling with dumb-init

## Environment Variables

The Docker image expects these environment variables:

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=1337`

## Health Check

The container includes a health check that verifies the application is responding on port 1337.