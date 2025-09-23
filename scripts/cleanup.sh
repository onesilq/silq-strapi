#!/bin/bash

# Cleanup Strapi deployment from Minikube
# Usage: ./scripts/cleanup.sh

set -e

echo "Cleaning up Strapi deployment..."

# Remove Strapi Helm release
echo "Removing Strapi Helm release..."
helm uninstall strapi || true

# Remove PostgreSQL Helm release
echo "Removing PostgreSQL Helm release..."
helm uninstall postgresql || true

# Remove from /etc/hosts
echo "Removing strapi.local from /etc/hosts..."
sudo sed -i '' '/strapi.local/d' /etc/hosts || true

echo "Cleanup complete!"
echo ""
echo "To completely reset Minikube:"
echo "  minikube delete"
echo "  minikube start"
