#!/bin/bash

# Quick start script for Strapi deployment
# This script provides an interactive way to deploy Strapi

set -e

echo "🚀 Strapi Kubernetes Deployment Quick Start"
echo "============================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"

# Check if Minikube is available
if ! command -v minikube &> /dev/null; then
    echo "❌ Minikube is not installed. Please install Minikube first."
    exit 1
fi
echo "✅ Minikube is available"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi
echo "✅ kubectl is available"

# Check if Helm is available
if ! command -v helm &> /dev/null; then
    echo "❌ Helm is not installed. Please install Helm first."
    exit 1
fi
echo "✅ Helm is available"

echo ""
echo "All prerequisites are met! 🎉"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Deploy Strapi to Minikube (Helm chart with dependencies)"
echo "2) Deploy Strapi to Minikube (Simple - no Helm dependencies)"
echo "3) Deploy Strapi to Minikube (Standalone Helm - no dependencies)"
echo "4) Build Docker image only"
echo "5) Clean up existing deployment"
echo "6) Clean up simple deployment"
echo "7) Check deployment status"
echo "8) Exit"
echo ""

read -p "Enter your choice (1-8): " choice

case $choice in
    1)
        echo "🚀 Starting Helm deployment with dependencies..."
        ./scripts/deploy-to-minikube.sh
        ;;
    2)
        echo "🚀 Starting simple deployment (no Helm)..."
        ./scripts/deploy-simple.sh
        ;;
    3)
        echo "🚀 Starting standalone Helm deployment..."
        ./scripts/deploy-standalone.sh
        ;;
    4)
        echo "🔨 Building Docker image..."
        ./scripts/build-and-push.sh
        ;;
    5)
        echo "🧹 Cleaning up Helm deployment..."
        ./scripts/cleanup.sh
        ;;
    6)
        echo "🧹 Cleaning up simple deployment..."
        ./scripts/cleanup-simple.sh
        ;;
    7)
        echo "📊 Checking deployment status..."
        echo ""
        echo "Pods:"
        kubectl get pods --all-namespaces
        echo ""
        echo "Services:"
        kubectl get services --all-namespaces
        echo ""
        echo "Ingress:"
        kubectl get ingress --all-namespaces
        echo ""
        echo "Helm releases:"
        helm list --all-namespaces
        ;;
    8)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Operation completed!"
