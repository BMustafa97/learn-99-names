# AWS App Runner Deployment Guide

This document covers the AWS App Runner deployment setup for the Arabic Recognition App.

## 🌟 Why AWS App Runner?

AWS App Runner was chosen over traditional ECS+ALB setup for several key benefits:

### Cost Optimization
- **~60% Cost Reduction**: From ~$50/month to ~$20-30/month
- **Pay-per-Use**: No idle infrastructure costs
- **No VPC Costs**: Eliminates VPC NAT Gateway expenses (~$45/month)
- **No Load Balancer Costs**: Built-in load balancing (~$20/month savings)

### Operational Benefits
- **Zero Infrastructure Management**: No servers, VPCs, or load balancers to maintain
- **Automatic HTTPS**: Built-in SSL/TLS certificates and renewal
- **Auto Scaling**: Scales from 1 to 10 instances based on traffic
- **Health Checks**: Automatic health monitoring and recovery
- **Global Deployment**: Built-in CDN and edge locations

## 🏗️ Infrastructure Overview

### Current Architecture

```
┌─────────────────────────────────────────┐
│            Internet Users               │
└─────────────┬───────────────────────────┘
              │ HTTPS Traffic
              ▼
┌─────────────────────────────────────────┐
│         AWS App Runner Service          │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │        Load Balancer (Built-in)     │ │
│  └─────────────────────────────────────┘ │
│                     │                   │
│  ┌─────────────────────────────────────┐ │
│  │       Auto Scaling Group            │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐   │ │
│  │  │Instance│ │Instance│ │Instance│   │ │
│  │  │   1    │ │   2    │ │  ...   │   │ │
│  │  └────────┘ └────────┘ └────────┘   │ │
│  │         Min: 1, Max: 10             │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  Features:                              │
│  ✅ HTTPS/SSL Termination               │
│  ✅ Health Checks                       │
│  ✅ Zero-downtime Deployments           │
│  ✅ Request Routing                     │
│  ✅ Global CDN                          │
└─────────────────────────────────────────┘
              │ Pull Images
              ▼
┌─────────────────────────────────────────┐
│        Amazon ECR Repository           │
│   (Container Image Storage)            │
│  📦 arabic-recognition-app:latest       │
│  📦 arabic-recognition-app:v1.0.0       │
└─────────────────────────────────────────┘
```

### Resource Configuration

| Component | Configuration | Purpose |
|-----------|---------------|---------|
| **Service** | ar-recognition-dev | Main App Runner service |
| **CPU** | 0.25 vCPU | Right-sized for web app workload |
| **Memory** | 0.5 GB | Sufficient for Node.js application |
| **Port** | 3000 | Application listening port |
| **Auto Scaling** | Min: 1, Max: 10 | Handle traffic spikes |
| **Concurrency** | 100 requests/instance | Optimal for web traffic |

## 🚀 Deployment Process

### 1. Infrastructure Deployment (Terraform)

```bash
# Navigate to terraform directory
cd terraform/

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

### 2. Container Deployment (GitHub Actions)

The CI/CD pipeline automatically:

1. **Builds** the Docker container
2. **Tests** the application
3. **Pushes** to ECR repository
4. **Triggers** App Runner auto-deployment

```yaml
# Key CI/CD steps for App Runner
- name: Build and push to ECR
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    ECR_REPOSITORY: arabic-recognition-app
  run: |
    docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

# App Runner automatically detects and deploys new images
```

### 3. Verification

After deployment, verify the service:

```bash
# Check App Runner service status
aws apprunner describe-service \
  --service-arn $(terraform output -raw apprunner_service_arn)

# Test the application
curl -f https://$(terraform output -raw application_url_default)
```

## 📊 Configuration Details

### App Runner Service Configuration

```hcl
resource "aws_apprunner_service" "app" {
  service_name = "ar-recognition-dev"
  
  source_configuration {
    image_repository {
      image_identifier = "${aws_ecr_repository.repo.repository_url}:latest"
      image_configuration {
        port = "3000"
        runtime_environment_variables = {
          NODE_ENV = "production"
        }
      }
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }
  
  instance_configuration {
    cpu               = "0.25 vCPU" 
    memory            = "0.5 GB"
    instance_role_arn = aws_iam_role.instance_role.arn
  }
  
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.auto_scaling.arn
  
  health_check_configuration {
    healthy_threshold   = 1
    interval           = 10
    path               = "/"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 5
  }
}
```

### Auto Scaling Configuration

```hcl
resource "aws_apprunner_auto_scaling_configuration_version" "auto_scaling" {
  auto_scaling_configuration_name = "ar-recognition-scaling"
  
  max_concurrency = 100  # Requests per instance
  max_size        = 10   # Maximum instances
  min_size        = 1    # Minimum instances
}
```

## 🔒 Security Configuration

### IAM Roles

**Instance Role**: Permissions for the running application
```hcl
resource "aws_iam_role" "instance_role" {
  name = "ar-recognition-instance-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
      }
    ]
  })
}
```

**ECR Access Role**: Permissions to pull container images
```hcl
resource "aws_iam_role" "access_role" {
  name = "ar-recognition-access-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      }
    ]
  })
}
```

## 📈 Monitoring & Observability

### Built-in Monitoring

App Runner provides automatic monitoring through:

- **Application Metrics**: Request count, response time, error rate
- **Instance Metrics**: CPU utilization, memory usage
- **Scaling Metrics**: Active instances, scaling events
- **Health Checks**: Service health and availability

### CloudWatch Integration

```bash
# View application logs
aws logs tail /aws/apprunner/ar-recognition-dev/application --follow

# View service logs  
aws logs tail /aws/apprunner/ar-recognition-dev/service --follow
```

### Custom Health Checks

The service monitors the application health via:
- **Endpoint**: `GET /`
- **Interval**: Every 10 seconds
- **Timeout**: 5 seconds
- **Healthy Threshold**: 1 successful check
- **Unhealthy Threshold**: 5 failed checks

## 💰 Cost Analysis

### Monthly Cost Breakdown

| Resource | Cost | Description |
|----------|------|-------------|
| **App Runner Service** | ~$15-25 | Based on CPU/memory usage |
| **ECR Storage** | ~$1-2 | Container image storage |
| **Data Transfer** | ~$1-3 | Outbound traffic |
| **CloudWatch Logs** | ~$1 | Log storage and retention |
| **Total** | **~$18-31** | Significant savings vs ECS+ALB |

### Cost Comparison

| Architecture | Monthly Cost | Components |
|--------------|--------------|------------|
| **Previous (ECS+ALB)** | ~$50+ | ECS cluster, ALB, VPC NAT Gateway |
| **Current (App Runner)** | ~$20-30 | App Runner service only |
| **Savings** | **~60%** | **$20-30/month reduction** |

## 🔧 Troubleshooting

### Common Issues

1. **Service Failed to Start**
   ```bash
   # Check service status
   aws apprunner describe-service --service-arn <service-arn>
   
   # Check application logs
   aws logs tail /aws/apprunner/ar-recognition-dev/application
   ```

2. **Image Pull Failures**
   ```bash
   # Verify ECR permissions
   aws ecr describe-repositories --repository-names arabic-recognition-app
   
   # Check access role permissions
   aws iam get-role --role-name ar-recognition-access-role
   ```

3. **Health Check Failures**
   ```bash
   # Test health endpoint locally
   curl -f http://localhost:3000/
   
   # Verify container port configuration
   ```

### Recovery Procedures

1. **Service Recovery**: App Runner automatically restarts failed instances
2. **Rollback**: Deploy previous container image version
3. **Scaling Issues**: Adjust auto-scaling configuration
4. **Performance**: Monitor CloudWatch metrics and adjust resources

## 🔄 Updates & Maintenance

### Automatic Updates

- **Container Images**: Auto-deployed when pushed to ECR
- **Security Patches**: Handled by AWS platform
- **Infrastructure**: Managed through Terraform

### Manual Updates

```bash
# Update Terraform configuration
terraform plan
terraform apply

# Force new deployment
aws apprunner start-deployment --service-arn <service-arn>
```

## 📚 Additional Resources

- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [App Runner Pricing](https://aws.amazon.com/apprunner/pricing/)
- [Terraform AWS Provider App Runner](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apprunner_service)
- [App Runner Best Practices](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-best-practices.html)

---

*This guide covers the complete App Runner deployment for cost-effective, scalable container hosting.*