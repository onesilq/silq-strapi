#!/bin/bash

# Cleanup simple Strapi deployment from Minikube
# Usage: ./scripts/cleanup-simple.sh

set -e

echo "Cleaning up simple Strapi deployment..."

# Remove Strapi namespace (this will delete all resources)
echo "Removing Strapi namespace..."
kubectl delete namespace strapi --ignore-not-found=true

# Remove PostgreSQL Helm release
echo "Removing PostgreSQL Helm release..."
helm uninstall postgresql --ignore-not-found=true

# Remove from /etc/hosts
echo "Removing strapi.local from /etc/hosts..."
sudo sed -i '' '/strapi.local/d' /etc/hosts || true

echo "Cleanup complete!"
echo ""
echo "To completely reset Minikube:"
echo "  minikube delete"
echo "  minikube start"
