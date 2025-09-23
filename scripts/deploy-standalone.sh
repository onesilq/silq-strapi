#!/bin/bash

# Standalone deployment script for Strapi to Minikube
# This script avoids all Helm dependency issues

set -e

echo "Starting standalone Strapi deployment to Minikube..."

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

# Create a simple Helm chart without dependencies
echo "Creating standalone Helm chart..."
mkdir -p /tmp/strapi-standalone/templates

# Create Chart.yaml
cat <<EOF > /tmp/strapi-standalone/Chart.yaml
apiVersion: v2
name: strapi-standalone
description: A standalone Helm chart for Strapi CMS
type: application
version: 0.1.0
appVersion: "5.23.1"
EOF

# Create values.yaml
cat <<EOF > /tmp/strapi-standalone/values.yaml
image:
  repository: my-strapi-project
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 1337

ingress:
  enabled: true
  className: "nginx"
  hosts:
    - host: strapi.local
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

persistence:
  enabled: true
  size: 10Gi
EOF

# Create deployment template
cat <<EOF > /tmp/strapi-standalone/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strapi
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
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - containerPort: 1337
        env:
        - name: NODE_ENV
          value: "production"
        - name: HOST
          value: "0.0.0.0"
        - name: PORT
          value: "1337"
        - name: APP_KEYS
          value: "toBeModified1,toBeModified2"
        - name: API_TOKEN_SALT
          value: "toBeModified"
        - name: ADMIN_JWT_SECRET
          value: "toBeModified"
        - name: TRANSFER_TOKEN_SALT
          value: "toBeModified"
        - name: JWT_SECRET
          value: "toBeModified"
        - name: DATABASE_CLIENT
          value: "postgres"
        - name: DATABASE_HOST
          value: "postgresql.default.svc.cluster.local"
        - name: DATABASE_PORT
          value: "5432"
        - name: DATABASE_NAME
          value: "strapi"
        - name: DATABASE_USERNAME
          value: "strapi"
        - name: DATABASE_PASSWORD
          value: "strapi"
        - name: DATABASE_SSL
          value: "false"
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
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
        {{- if .Values.persistence.enabled }}
        volumeMounts:
        - name: uploads
          mountPath: /app/public/uploads
        - name: data
          mountPath: /app/.tmp
        {{- end }}
      {{- if .Values.persistence.enabled }}
      volumes:
      - name: uploads
        persistentVolumeClaim:
          claimName: strapi-uploads
      - name: data
        persistentVolumeClaim:
          claimName: strapi-data
      {{- end }}
EOF

# Create service template
cat <<EOF > /tmp/strapi-standalone/templates/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: strapi
  labels:
    app: strapi
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: 1337
      protocol: TCP
  selector:
    app: strapi
EOF

# Create ingress template
cat <<EOF > /tmp/strapi-standalone/templates/ingress.yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: strapi
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: {{ .Values.ingress.className }}
  rules:
  {{- range .Values.ingress.hosts }}
  - host: {{ .host | quote }}
    http:
      paths:
      {{- range .paths }}
      - path: {{ .path }}
        pathType: {{ .pathType }}
        backend:
          service:
            name: strapi
            port:
              number: {{ $.Values.service.port }}
      {{- end }}
  {{- end }}
{{- end }}
EOF

# Create PVC template
cat <<EOF > /tmp/strapi-standalone/templates/pvc.yaml
{{- if .Values.persistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: strapi-uploads
  labels:
    app: strapi
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: strapi-data
  labels:
    app: strapi
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
{{- end }}
EOF

# Install Strapi using the standalone chart
echo "Installing Strapi using standalone chart..."
helm upgrade --install strapi /tmp/strapi-standalone

# Wait for Strapi to be ready
echo "Waiting for Strapi to be ready..."
kubectl wait --for=condition=ready pod -l app=strapi --timeout=300s

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"

# Update /etc/hosts (requires sudo)
echo "Updating /etc/hosts..."
echo "$MINIKUBE_IP strapi.local" | sudo tee -a /etc/hosts

# Clean up temporary chart
rm -rf /tmp/strapi-standalone

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
echo "  kubectl logs -l app=strapi"
