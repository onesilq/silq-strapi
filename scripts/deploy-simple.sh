#!/bin/bash

# Simple deployment script for Strapi to Minikube
# This script avoids Helm dependencies issues

set -e

echo "Starting simple Strapi deployment to Minikube..."

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

# Create Kubernetes manifests directly (avoiding Helm dependencies)
echo "Creating Kubernetes manifests..."

# Create namespace
kubectl create namespace strapi --dry-run=client -o yaml | kubectl apply -f -

# Create ConfigMap for environment variables
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: strapi-config
  namespace: strapi
data:
  NODE_ENV: "production"
  HOST: "0.0.0.0"
  PORT: "1337"
  DATABASE_CLIENT: "postgres"
  DATABASE_HOST: "postgresql-postgresql.default.svc.cluster.local"
  DATABASE_PORT: "5432"
  DATABASE_NAME: "strapi"
  DATABASE_USERNAME: "strapi"
  DATABASE_SSL: "false"
EOF

# Create Secret for sensitive data
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: strapi-secrets
  namespace: strapi
type: Opaque
stringData:
  APP_KEYS: "toBeModified1,toBeModified2"
  API_TOKEN_SALT: "toBeModified"
  ADMIN_JWT_SECRET: "toBeModified"
  TRANSFER_TOKEN_SALT: "toBeModified"
  JWT_SECRET: "toBeModified"
  DATABASE_PASSWORD: "strapi"
EOF

# Create PersistentVolumeClaim for uploads
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: strapi-uploads
  namespace: strapi
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: strapi-data
  namespace: strapi
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
EOF

# Create Deployment
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strapi
  namespace: strapi
  labels:
    app: strapi
spec:
  replicas: 1
  selector:
    matchLabels:
      app: strapi
  template:
    metadata:
      labels:
        app: strapi
    spec:
      containers:
      - name: strapi
        image: my-strapi-project:latest
        ports:
        - containerPort: 1337
        envFrom:
        - configMapRef:
            name: strapi-config
        - secretRef:
            name: strapi-secrets
        resources:
          limits:
            cpu: 500m
            memory: 512Mi
          requests:
            cpu: 250m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /_health
            port: 1337
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /_health
            port: 1337
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: uploads
          mountPath: /app/public/uploads
        - name: data
          mountPath: /app/.tmp
      volumes:
      - name: uploads
        persistentVolumeClaim:
          claimName: strapi-uploads
      - name: data
        persistentVolumeClaim:
          claimName: strapi-data
EOF

# Create Service
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: strapi
  namespace: strapi
spec:
  selector:
    app: strapi
  ports:
    - port: 1337
      targetPort: 1337
      protocol: TCP
  type: ClusterIP
EOF

# Create Ingress
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: strapi
  namespace: strapi
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: strapi.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: strapi
            port:
              number: 1337
EOF

# Wait for Strapi to be ready
echo "Waiting for Strapi to be ready..."
kubectl wait --for=condition=ready pod -l app=strapi -n strapi --timeout=300s

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
echo "  kubectl get pods -n strapi"
echo "  kubectl get services -n strapi"
echo "  kubectl get ingress -n strapi"
echo ""
echo "To view logs:"
echo "  kubectl logs -l app=strapi -n strapi"
