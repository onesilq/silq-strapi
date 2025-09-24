# Architecture Diagrams

This file contains Mermaid diagrams for the Strapi Kubernetes deployment. You can render these diagrams using Mermaid-compatible tools like GitHub, GitLab, or online Mermaid editors.

## System Architecture

```mermaid
graph TB
    subgraph "External Access"
        U[User] --> I[NGINX Ingress]
    end
    
    subgraph "Kubernetes Cluster (Minikube)"
        I --> S[Strapi Service]
        S --> D[Strapi Deployment]
        D --> P1[Strapi Pod]
        
        subgraph "Database Layer"
            DB[PostgreSQL Service]
            DB --> DBP[PostgreSQL StatefulSet]
            DBP --> DBV[(PostgreSQL Volume)]
        end
        
        subgraph "Storage Layer"
            PV1[(Strapi Uploads PVC)]
            PV2[(Strapi Data PVC)]
        end
        
        P1 --> DB
        P1 --> PV1
        P1 --> PV2
    end
    
    subgraph "External Services"
        R[Docker Registry]
        H[Bitnami Helm Repo]
    end
    
    D --> R
    DBP --> R
```

## Deployment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Script
    participant D as Docker
    participant M as Minikube
    participant K as Kubernetes
    participant H as Helm
    participant DB as PostgreSQL
    
    U->>S: Run deployment script
    S->>D: Build Docker image
    D-->>S: Image built
    S->>M: Load image to Minikube
    S->>H: Install PostgreSQL
    H->>K: Deploy PostgreSQL
    K->>DB: Start PostgreSQL pod
    DB-->>K: PostgreSQL ready
    S->>H: Install Strapi
    H->>K: Deploy Strapi
    K->>K: Start Strapi pod
    K-->>S: Strapi ready
    S->>U: Deployment complete
```

## Data Flow

```mermaid
graph LR
    subgraph "Client Layer"
        C[Web Browser]
        A[Admin Panel]
        API[API Client]
    end
    
    subgraph "Kubernetes Cluster"
        subgraph "Ingress Layer"
            I[NGINX Ingress]
        end
        
        subgraph "Application Layer"
            S[Strapi Service]
            SP[Strapi Pods]
        end
        
        subgraph "Data Layer"
            DB[PostgreSQL]
            FS[File System]
        end
    end
    
    C --> I
    A --> I
    API --> I
    I --> S
    S --> SP
    SP --> DB
    SP --> FS
```

## Network Topology

```mermaid
graph TB
    subgraph "External Network"
        I[Internet]
    end
    
    subgraph "Minikube Network"
        subgraph "Ingress Namespace"
            IC[Ingress Controller]
        end
        
        subgraph "Default Namespace"
            subgraph "Strapi Components"
                SS[Strapi Service]
                SD[Strapi Deployment]
                SP[Strapi Pods]
            end
            
            subgraph "Database Components"
                DS[PostgreSQL Service]
                DD[PostgreSQL Deployment]
                DP[PostgreSQL Pod]
            end
        end
    end
    
    I --> IC
    IC --> SS
    SS --> SD
    SD --> SP
    SP --> DS
    DS --> DD
    DD --> DP
```

## Container Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Building: Docker Build
    Building --> Built: Image Created
    Built --> Loading: Load to Minikube
    Loading --> Pending: Pod Created
    Pending --> Running: Container Started
    Running --> Healthy: Health Check Pass
    Running --> Unhealthy: Health Check Fail
    Unhealthy --> Restarting: Pod Restart
    Restarting --> Running: Container Restarted
    Healthy --> [*]: Deployment Complete
```

## Scaling Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[NGINX Ingress]
    end
    
    subgraph "Application Tier (Current: 1 Pod)"
        LB --> S1[Strapi Pod 1]
        LB --> S2[Strapi Pod 2]
        LB --> S3[Strapi Pod 3]
        LB --> SN[Strapi Pod N]
    end
    
    subgraph "Database Tier"
        S1 --> DB[(PostgreSQL StatefulSet)]
        S2 --> DB
        S3 --> DB
        SN --> DB
    end
    
    subgraph "Storage Tier"
        S1 --> PV1[(Strapi Uploads PVC)]
        S2 --> PV1
        S3 --> PV1
        SN --> PV1
        
        S1 --> PV2[(Strapi Data PVC)]
        S2 --> PV2
        S3 --> PV2
        SN --> PV2
        
        DB --> PV3[(PostgreSQL PVC)]
    end
    
    subgraph "Monitoring (Future)"
        M1[Prometheus]
        M2[Grafana]
        M3[Logs]
    end
    
    S1 --> M1
    S2 --> M1
    S3 --> M1
    SN --> M1
```

## Security Architecture

```mermaid
graph TB
    subgraph "External Security"
        FW[Firewall]
        SSL[SSL/TLS]
    end
    
    subgraph "Kubernetes Security"
        subgraph "Network Policies"
            NP[Network Policy]
        end
        
        subgraph "Pod Security"
            PS[Pod Security Context]
            SC[Security Context]
        end
        
        subgraph "RBAC"
            SA[Service Account]
            RB[Role Binding]
            R[Role]
        end
    end
    
    subgraph "Application Security"
        subgraph "Strapi Security"
            AUTH[Authentication]
            AUTHZ[Authorization]
            JWT[JWT Tokens]
        end
        
        subgraph "Database Security"
            DB_AUTH[Database Auth]
            DB_SSL[SSL Connection]
        end
    end
    
    FW --> NP
    SSL --> NP
    NP --> PS
    PS --> SC
    SC --> SA
    SA --> RB
    RB --> R
    R --> AUTH
    AUTH --> AUTHZ
    AUTHZ --> JWT
    JWT --> DB_AUTH
    DB_AUTH --> DB_SSL
```

## Monitoring and Observability

```mermaid
graph TB
    subgraph "Application Layer"
        SP[Strapi Pods]
        DB[PostgreSQL Pod]
    end
    
    subgraph "Metrics Collection"
        M1[Application Metrics]
        M2[System Metrics]
        M3[Database Metrics]
    end
    
    subgraph "Logging"
        L1[Application Logs]
        L2[System Logs]
        L3[Audit Logs]
    end
    
    subgraph "Monitoring Stack"
        P[Prometheus]
        G[Grafana]
        A[AlertManager]
    end
    
    subgraph "Logging Stack"
        EL[Elasticsearch]
        K[Kibana]
        F[Fluentd]
    end
    
    SP --> M1
    SP --> L1
    DB --> M3
    DB --> L2
    
    M1 --> P
    M2 --> P
    M3 --> P
    P --> G
    P --> A
    
    L1 --> F
    L2 --> F
    L3 --> F
    F --> EL
    EL --> K
```

## Backup and Recovery

```mermaid
graph TB
    subgraph "Data Sources"
        DB[(PostgreSQL)]
        FS[(File System)]
        K8S[Kubernetes State]
    end
    
    subgraph "Backup Process"
        B1[Database Backup]
        B2[Volume Snapshot]
        B3[Config Backup]
    end
    
    subgraph "Storage"
        S1[Local Storage]
        S2[Cloud Storage]
        S3[Object Storage]
    end
    
    subgraph "Recovery Process"
        R1[Database Restore]
        R2[Volume Restore]
        R3[Config Restore]
    end
    
    DB --> B1
    FS --> B2
    K8S --> B3
    
    B1 --> S1
    B2 --> S2
    B3 --> S3
    
    S1 --> R1
    S2 --> R2
    S3 --> R3
```

## CI/CD Pipeline

```mermaid
graph LR
    subgraph "Source Control"
        G[Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        T[Tests]
        B[Build]
        S[Security Scan]
        D[Deploy]
    end
    
    subgraph "Environments"
        DEV[Development]
        STAG[Staging]
        PROD[Production]
    end
    
    subgraph "Deployment"
        K8S[Kubernetes]
        H[Helm]
        R[Registry]
    end
    
    G --> T
    T --> B
    B --> S
    S --> D
    
    D --> DEV
    DEV --> STAG
    STAG --> PROD
    
    DEV --> K8S
    STAG --> K8S
    PROD --> K8S
    
    K8S --> H
    H --> R
```


## How to Use These Diagrams

### Online Tools
1. **Mermaid Live Editor**: https://mermaid.live/
2. **GitHub/GitLab**: These platforms render Mermaid diagrams automatically
3. **VS Code**: Install the Mermaid extension

### Local Tools
1. **Mermaid CLI**: `npm install -g @mermaid-js/mermaid-cli`
2. **Pandoc**: Convert to various formats
3. **Draw.io**: Import Mermaid diagrams

### Integration
- Copy the Mermaid code into your documentation
- Use in README files for GitHub repositories
- Include in technical documentation
- Create presentations with diagram tools
