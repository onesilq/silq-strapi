# Strapi Deployment with Minikube, Helm, and Kubernetes

This guide will help you deploy your Strapi project to Minikube using Helm charts and Kubernetes.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Docker** - For building container images
2. **Minikube** - Local Kubernetes cluster
3. **kubectl** - Kubernetes command-line tool
4. **Helm** - Package manager for Kubernetes
5. **Node.js** (18.x) - For building the Strapi application

### Installation Commands

```bash
# Install Minikube (macOS with Homebrew)
brew install minikube

# Install kubectl
brew install kubectl

# Install Helm
brew install helm

# Start Minikube
minikube start
```

## Project Structure

```
my-strapi-project/
├── Dockerfile                 # Container image definition
├── .dockerignore             # Docker ignore file
├── helm/                     # Helm chart directory
│   └── strapi/
│       ├── Chart.yaml        # Chart metadata
│       ├── values.yaml       # Default values
│       ├── requirements.yaml # Chart dependencies
│       └── templates/        # Kubernetes templates
│           ├── _helpers.tpl  # Template helpers
│           ├── deployment.yaml
│           ├── service.yaml
│           ├── ingress.yaml
│           ├── serviceaccount.yaml
│           ├── pvc.yaml
│           └── hpa.yaml
├── scripts/                  # Deployment scripts
│   ├── build-and-push.sh     # Build Docker image
│   ├── deploy-to-minikube.sh # Deploy to Minikube
│   └── cleanup.sh            # Cleanup deployment
└── DEPLOYMENT.md            # This file
```

## Quick Start

### 1. Build and Deploy

Run the deployment script:

```bash
./scripts/deploy-to-minikube.sh
```

This script will:
- Start Minikube if not running
- Enable ingress addon
- Build the Docker image
- Load the image into Minikube
- Install PostgreSQL using Helm
- Deploy Strapi using the custom Helm chart
- Configure ingress and hosts file

### 2. Access Your Application

After deployment, you can access:

- **Strapi Admin Panel**: http://strapi.local/admin
- **Strapi API**: http://strapi.local/api
- **Health Check**: http://strapi.local/_health

### 3. Create Admin User

1. Visit http://strapi.local/admin
2. Fill out the admin registration form
3. Start managing your content!

## Manual Deployment Steps

If you prefer to run the commands manually:

### 1. Build Docker Image

```bash
# Build the image
docker build -t my-strapi-project:latest .

# Load into Minikube
minikube image load my-strapi-project:latest
```

### 2. Add Helm Repositories

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 3. Install PostgreSQL

```bash
helm upgrade --install postgresql bitnami/postgresql \
  --set auth.postgresPassword=postgres \
  --set auth.username=strapi \
  --set auth.password=strapi \
  --set auth.database=strapi \
  --set primary.persistence.size=8Gi
```

### 4. Deploy Strapi

```bash
helm upgrade --install strapi ./helm/strapi \
  --set image.repository=my-strapi-project \
  --set image.tag=latest \
  --set postgresql.enabled=false \
  --set database.host=postgresql \
  --set database.port=5432 \
  --set database.name=strapi \
  --set database.username=strapi \
  --set database.password=strapi
```

### 5. Configure Ingress

```bash
# Get Minikube IP
minikube ip

# Add to /etc/hosts (replace with actual IP)
echo "192.168.49.2 strapi.local" | sudo tee -a /etc/hosts
```

## Configuration

### Environment Variables

The Helm chart supports the following environment variables in `values.yaml`:

```yaml
env:
  NODE_ENV: "production"
  HOST: "0.0.0.0"
  PORT: "1337"
  APP_KEYS: "toBeModified1,toBeModified2"
  API_TOKEN_SALT: "toBeModified"
  ADMIN_JWT_SECRET: "toBeModified"
  TRANSFER_TOKEN_SALT: "toBeModified"
  JWT_SECRET: "toBeModified"
```

### Database Configuration

```yaml
database:
  type: "postgres"
  host: "postgresql"
  port: 5432
  name: "strapi"
  username: "strapi"
  password: "strapi"
  ssl: false
```

### Resource Limits

```yaml
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
```

## Monitoring and Troubleshooting

### Check Deployment Status

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# Check Helm releases
helm list
```

### View Logs

```bash
# Strapi logs
kubectl logs -l app.kubernetes.io/name=strapi

# PostgreSQL logs
kubectl logs -l app.kubernetes.io/name=postgresql
```

### Debug Issues

```bash
# Describe pod for events
kubectl describe pod <pod-name>

# Check ingress controller
kubectl get pods -n ingress-nginx

# Test connectivity
kubectl port-forward svc/strapi 1337:1337
```

## Scaling

### Horizontal Pod Autoscaling

Enable autoscaling in `values.yaml`:

```yaml
autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

### Manual Scaling

```bash
# Scale to 3 replicas
kubectl scale deployment strapi --replicas=3
```

## Cleanup

### Remove Deployment

```bash
# Run cleanup script
./scripts/cleanup.sh

# Or manually
helm uninstall strapi
helm uninstall postgresql
```

### Reset Minikube

```bash
minikube delete
minikube start
```

## Production Considerations

For production deployments, consider:

1. **Security**: Update all default passwords and secrets
2. **SSL/TLS**: Configure proper certificates
3. **Backup**: Set up database backups
4. **Monitoring**: Add monitoring and logging
5. **Resource Limits**: Adjust based on your needs
6. **Network Policies**: Implement network security
7. **Secrets Management**: Use Kubernetes secrets or external secret management

## Troubleshooting Common Issues

### Issue: Cannot access strapi.local

**Solution**: Check if the ingress controller is running and the hosts file is updated.

```bash
kubectl get pods -n ingress-nginx
kubectl get ingress
cat /etc/hosts | grep strapi
```

### Issue: Database connection failed

**Solution**: Verify PostgreSQL is running and check connection details.

```bash
kubectl get pods -l app.kubernetes.io/name=postgresql
kubectl logs -l app.kubernetes.io/name=postgresql
```

### Issue: Strapi pod keeps restarting

**Solution**: Check logs and verify environment variables.

```bash
kubectl logs -l app.kubernetes.io/name=strapi
kubectl describe pod <strapi-pod-name>
```

## Support

For issues related to:
- **Strapi**: Check [Strapi Documentation](https://docs.strapi.io)
- **Kubernetes**: Check [Kubernetes Documentation](https://kubernetes.io/docs/)
- **Helm**: Check [Helm Documentation](https://helm.sh/docs/)
- **Minikube**: Check [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
