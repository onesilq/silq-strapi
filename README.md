# Strapi Kubernetes Deployment

A production-ready deployment of Strapi CMS on Kubernetes using Minikube, Helm, and Docker.

## 🚀 Quick Start

```bash
# Run the interactive deployment
./scripts/quick-start.sh

# Access your Strapi admin
kubectl port-forward svc/strapi 1337:1337
open http://localhost:1337/admin
```

## 📁 Project Structure

```
my-strapi-project/
├── 📄 README.md                           # This file
├── 📄 KUBERNETES_DEPLOYMENT_GUIDE.md      # Comprehensive deployment guide
├── 📄 ARCHITECTURE_DIAGRAMS.md            # Mermaid architecture diagrams
├── 📄 LEARNING_RESOURCES.md              # Curated learning resources
├── 🐳 Dockerfile                         # Container image definition
├── 📦 helm/strapi/                       # Helm chart directory
└── 📁 scripts/                           # Deployment automation
```

## 🏗️ Architecture

This deployment creates a cloud-native Strapi CMS with:

- **Strapi Application**: Headless CMS running in Kubernetes pods
- **PostgreSQL Database**: Persistent data storage with Bitnami Helm chart
- **NGINX Ingress**: External access and load balancing
- **Persistent Volumes**: Data persistence for uploads and database
- **Helm Charts**: Package management for Kubernetes applications

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|-------------|---------|
| **Container Runtime** | Docker | Application containerization |
| **Orchestration** | Kubernetes | Container orchestration and management |
| **Local Cluster** | Minikube | Local Kubernetes development environment |
| **Package Manager** | Helm | Kubernetes application packaging |
| **Database** | PostgreSQL | Relational database for Strapi |
| **Web Server** | NGINX Ingress | External access and routing |
| **CMS** | Strapi v5.23.1 | Headless content management system |
| **Language** | Node.js 18 | Runtime environment |

## 📋 Prerequisites

```bash
# Install required software
brew install --cask docker
brew install minikube kubectl helm

# System requirements: 4GB+ RAM, 2+ CPU cores, 20GB+ storage
```

## 🚀 Deployment Options

### Option 1: Interactive Deployment (Recommended)

```bash
./scripts/quick-start.sh
```

### Option 2: Direct Deployment

```bash
# Standalone deployment (recommended)
./scripts/deploy-standalone.sh

# Helm deployment with dependencies
./scripts/deploy-to-minikube.sh
```

## 🌐 Access Your Application

```bash
# Port forward for local access
kubectl port-forward svc/strapi 1337:1337

# Access Strapi admin
open http://localhost:1337/admin
```

## 📊 Monitoring

```bash
# Check deployment status
kubectl get pods,svc,ingress

# View logs
kubectl logs -l app=strapi

# Check Helm releases
helm list
```

## 🧹 Cleanup

```bash
# Clean up deployment
./scripts/cleanup.sh

# Reset Minikube
minikube delete
minikube start
```

## 📚 Documentation

- **[KUBERNETES_DEPLOYMENT_GUIDE.md](./KUBERNETES_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[ARCHITECTURE_DIAGRAMS.md](./ARCHITECTURE_DIAGRAMS.md)** - Mermaid diagrams
- **[LEARNING_RESOURCES.md](./LEARNING_RESOURCES.md)** - Learning resources

## 🔗 Useful Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Helm Documentation](https://helm.sh/docs/)
- [Strapi Documentation](https://docs.strapi.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Happy Deploying! 🚀**