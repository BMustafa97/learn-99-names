# Docker Setup & Deployment Guide

Complete guide for containerizing and deploying the Arabic Recognition App using Docker.

## 🐳 Docker Overview

This application can be containerized using Docker for consistent deployment across different environments. The Docker setup includes:

- **Dockerfile**: Container configuration
- **docker-compose.yml**: Multi-container orchestration
- **.dockerignore**: Optimized build context
- **Health checks**: Application monitoring
- **Security**: Non-root user execution

## 📋 Prerequisites

### Docker Installation
- **Docker Desktop**: For Windows/macOS
- **Docker Engine**: For Linux servers
- **Docker Compose**: Included with Docker Desktop

### System Requirements
- **RAM**: 2GB+ available
- **Storage**: 1GB+ free space
- **Network**: Internet connection for image downloads

### Verify Installation
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone https://github.com/your-username/arabic-recognition-app.git
cd arabic-recognition-app

# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
open http://localhost:3000
```

### Option 2: Docker Commands
```bash
# Build the image
docker build -t arabic-recognition-app .

# Run the container
docker run -d \
  --name arabic-recognition-app \
  -p 3000:3000 \
  arabic-recognition-app

# View logs
docker logs -f arabic-recognition-app
```

## 🔧 Configuration Options

### Environment Variables
```bash
# Production environment
NODE_ENV=production

# Custom port (if needed)
PORT=3000

# Custom host
HOST=0.0.0.0
```

### Port Mapping
```bash
# Map to different host port
docker run -p 8080:3000 arabic-recognition-app

# Access via http://localhost:8080
```

### Volume Mounting (Future Use)
```bash
# Mount custom content (if implementing user data persistence)
docker run -v /host/data:/app/data arabic-recognition-app
```

## 📁 Docker Files Explained

### Dockerfile
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Application setup
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy source and set permissions
COPY src/ ./src/
COPY docs/ ./docs/
COPY README.md ./
RUN chown -R appuser:nodejs /app
USER appuser

# Health monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Runtime
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  arabic-recognition-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🛠️ Development Workflow

### Local Development with Docker
```bash
# Development with live reload (bind mount)
docker run -d \
  --name arabic-recognition-dev \
  -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  arabic-recognition-app \
  npm run dev
```

### Building for Production
```bash
# Build optimized image
docker build -t arabic-recognition-app:latest .

# Tag for registry
docker tag arabic-recognition-app:latest your-registry/arabic-recognition-app:v1.0.0

# Push to registry
docker push your-registry/arabic-recognition-app:v1.0.0
```

## 🔒 Security Best Practices

### Container Security
- **Non-root user**: Application runs as unprivileged user
- **Minimal base image**: Alpine Linux for smaller attack surface
- **Health checks**: Monitor application availability
- **Read-only filesystem**: No write access to container filesystem

### Network Security
```bash
# Create custom network
docker network create --driver bridge arabic-app-network

# Run with custom network
docker run --network arabic-app-network arabic-recognition-app
```

### Secrets Management
```bash
# Use Docker secrets for sensitive data
echo "secret-value" | docker secret create app-secret -

# Mount secret in container
docker service create \
  --secret app-secret \
  arabic-recognition-app
```

## 📊 Monitoring & Logging

### Container Logs
```bash
# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f arabic-recognition-app

# Export logs
docker-compose logs > app-logs.txt
```

### Health Monitoring
```bash
# Check health status
docker-compose ps

# Inspect health check details
docker inspect --format='{{.State.Health}}' arabic-recognition-app
```

### Resource Monitoring
```bash
# Monitor resource usage
docker stats arabic-recognition-app

# Set resource limits
docker run --memory=512m --cpus=1.0 arabic-recognition-app
```

## 🚀 Production Deployment

### Cloud Platforms

#### AWS ECS
```bash
# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster production-cluster \
  --service-name arabic-recognition-app \
  --task-definition arabic-recognition-app:1
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/arabic-recognition-app
gcloud run deploy --image gcr.io/PROJECT-ID/arabic-recognition-app --platform managed
```

#### Azure Container Instances
```bash
# Deploy to Azure
az container create \
  --resource-group myResourceGroup \
  --name arabic-recognition-app \
  --image your-registry/arabic-recognition-app:latest \
  --cpu 1 --memory 1
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arabic-recognition-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: arabic-recognition-app
  template:
    metadata:
      labels:
        app: arabic-recognition-app
    spec:
      containers:
      - name: app
        image: arabic-recognition-app:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 🔄 Maintenance & Updates

### Container Lifecycle
```bash
# Update application
docker-compose pull
docker-compose up -d

# Rolling update
docker-compose up -d --no-deps arabic-recognition-app

# Backup before update
docker commit arabic-recognition-app arabic-recognition-app:backup
```

### Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Complete cleanup
docker system prune -a
```

## 🛠️ Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs arabic-recognition-app

# Inspect container
docker inspect arabic-recognition-app

# Test image
docker run -it arabic-recognition-app sh
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Use different port
docker-compose up -d --scale arabic-recognition-app=0
docker-compose up -d
```

#### Performance Issues
```bash
# Monitor resources
docker stats

# Check health
docker-compose exec arabic-recognition-app wget -O- http://localhost:3000/

# Restart service
docker-compose restart arabic-recognition-app
```

### Debug Mode
```bash
# Run in debug mode
docker run -it --rm \
  -p 3000:3000 \
  arabic-recognition-app \
  sh

# Interactive shell in running container
docker-compose exec arabic-recognition-app sh
```

## 📈 Performance Optimization

### Image Optimization
- **Multi-stage builds**: Separate build and runtime stages
- **Layer caching**: Optimize Dockerfile for cache efficiency
- **Minimal dependencies**: Install only production packages
- **Alpine base**: Smaller image size

### Runtime Optimization
```bash
# Set resource limits
docker run \
  --memory=512m \
  --cpus=1.0 \
  --restart=unless-stopped \
  arabic-recognition-app
```

### Scaling
```bash
# Scale horizontally
docker-compose up -d --scale arabic-recognition-app=3

# Load balancer (nginx example)
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

## 🔐 HTTPS in Production

### SSL Certificate Setup
```bash
# Using Let's Encrypt with nginx
docker run -d \
  --name nginx-proxy \
  -p 80:80 \
  -p 443:443 \
  -v /var/run/docker.sock:/tmp/docker.sock:ro \
  nginx-proxy

# Add SSL certificate
docker run -d \
  --name nginx-proxy-letsencrypt \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  jrcs/letsencrypt-nginx-proxy-companion
```

## 📋 Production Checklist

- [ ] Health checks configured
- [ ] Resource limits set
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] SSL certificates
- [ ] Security scanning
- [ ] Performance testing
- [ ] Disaster recovery plan

---

*Deploy with confidence using Docker's containerization for consistent, scalable Arabic Recognition App deployment.*
