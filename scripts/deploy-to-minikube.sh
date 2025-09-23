#!/bin/bash

# Deploy Strapi to Minikube using Helm
# Usage: ./scripts/deploy-to-minikube.sh

set -e

echo "Starting Strapi deployment to Minikube..."

# Check if minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo "Starting Minikube..."
    minikube start
fi

# Enable ingress addon
echo "Enabling ingress addon..."
minikube addons enable ingress

# Build and load Docker image into Minikube
echo "Building Docker image..."
docker build -t my-strapi-project:latest .

echo "Loading image into Minikube..."
minikube image load my-strapi-project:latest

# Add Bitnami Helm repository
echo "Adding Bitnami Helm repository..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install PostgreSQL
echo "Installing PostgreSQL..."
helm upgrade --install postgresql bitnami/postgresql \
  --set auth.postgresPassword=postgres \
  --set auth.username=strapi \
  --set auth.password=strapi \
  --set auth.database=strapi \
  --set primary.persistence.size=8Gi

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=postgresql --timeout=300s

# Clean and build Helm dependencies
echo "Cleaning and building Helm dependencies..."
cd helm/strapi
rm -f Chart.lock
rm -rf charts/
helm dependency build
cd ../..

# Install Strapi
echo "Installing Strapi..."
helm upgrade --install strapi ./helm/strapi \
  --set image.repository=my-strapi-project \
  --set image.tag=latest \
  --set postgresql.enabled=false \
  --set database.host=postgresql \
  --set database.port=5432 \
  --set database.name=strapi \
  --set database.username=strapi \
  --set database.password=strapi

# Wait for Strapi to be ready
echo "Waiting for Strapi to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=strapi --timeout=300s

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"

# Update /etc/hosts (requires sudo)
echo "Updating /etc/hosts..."
echo "$MINIKUBE_IP strapi.local" | sudo tee -a /etc/hosts

echo "Deployment complete!"
echo "Access Strapi at: http://strapi.local"
echo "Admin panel: http://strapi.local/admin"
echo ""
echo "To check status:"
echo "  kubectl get pods"
echo "  kubectl get services"
echo "  kubectl get ingress"
echo ""
echo "To view logs:"
echo "  kubectl logs -l app.kubernetes.io/name=strapi"
