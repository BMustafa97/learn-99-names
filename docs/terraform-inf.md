# Terraform Infrastructure Guide

This document provides comprehensive instructions for deploying the Arabic Recognition App infrastructure using Terraform with security best practices for public repositories.

## 🏗️ Architecture Overview

The Terraform configuration creates:

- **ECR Repository** - References existing Docker image storage (managed externally)
- **Application Load Balancer (ALB)** - HTTPS/HTTP traffic routing
- **ECS Fargate Cluster** - Serverless container hosting
- **Auto Scaling** - Automatic scaling based on CPU usage
- **CloudWatch Logs** - Centralized logging with encryption
- **Security Groups** - Network-level security controls
- **IAM Roles** - Least-privilege access controls
- **SSL/TLS Certificate** - Free HTTPS via AWS Certificate Manager

> **⚠️ Important**: The ECR repository is referenced as a data source and must exist before running Terraform. This repository is managed outside of this Terraform configuration.

## 🔒 Security First Approach

### Public Repository Security

This infrastructure is designed for public repositories with these security principles:

1. **No Hardcoded Secrets** - All sensitive data via variables or AWS services
2. **Encrypted Storage** - ECR images, CloudWatch logs, and state encryption
3. **Least Privilege IAM** - Minimal required permissions
4. **Network Security** - Private subnets, security groups, HTTPS-only
5. **Audit Logging** - ALB access logs and CloudWatch monitoring

### State File Security

⚠️ **CRITICAL**: Never commit `terraform.tfstate` files to git!

The state file contains sensitive information. Use remote state storage:

```hcl
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "arabic-recognition-app/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

## 📋 Prerequisites

### 1. ECR Repository

The ECR repository must exist before running Terraform, as it's managed externally:

```bash
# Create ECR repository if it doesn't exist
aws ecr create-repository \
    --repository-name arabic-recognition-app \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Verify repository exists
aws ecr describe-repositories --repository-names arabic-recognition-app
```

### 2. AWS Account Setup

```bash
# Install AWS CLI
brew install awscli  # macOS
# or
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  # Linux

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID, Secret Access Key, region (eu-west-1), and output format (json)
```

### 3. Terraform Installation

```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installation
terraform --version
```

### 4. Required AWS Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "ecs:*",
        "ecr:*",
        "elasticloadbalancing:*",
        "iam:*",
        "logs:*",
        "acm:*",
        "application-autoscaling:*",
        "kms:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
git clone https://github.com/BMustafa97/learn-99-names.git
cd learn-99-names/terraform
```

### 2. Configure Variables

```bash
# Copy the example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit the configuration
nano terraform.tfvars  # or use your preferred editor
```

### 3. Essential Configuration

Edit `terraform.tfvars` with your settings:

```hcl
# Basic Configuration
aws_region     = "eu-west-1"
environment    = "dev"  # dev, staging, or prod
project_name   = "arabic-recognition-app"
project_owner  = "your-email@example.com"

# HTTPS Configuration (recommended)
domain_name = "myapp.example.com"  # Your domain for HTTPS

# Container Configuration
container_port = 3000
image_tag     = "latest"
desired_count = 1

# Production Settings
enable_deletion_protection = false  # Set to true for production
log_retention_days        = 14      # Increase for production
```

### 4. Initialize and Deploy

```bash
# Initialize Terraform
terraform init

# Review the planned changes
terraform plan

# Apply the infrastructure
terraform apply
```

### 5. Verify Deployment

```bash
# Get the load balancer URL
terraform output application_url

# Check ECS service status
aws ecs describe-services --cluster $(terraform output -raw ecs_cluster_name) --services $(terraform output -raw ecs_service_name)
```

## 🔧 Configuration Options

### Basic HTTP Setup

For development or testing without HTTPS:

```hcl
domain_name = ""  # Leave empty for HTTP only
```

### HTTPS Setup with Custom Domain

```hcl
domain_name = "myapp.example.com"
subject_alternative_names = ["www.myapp.example.com"]
```

**DNS Setup Required:**
1. Create CNAME record: `myapp.example.com` → `your-alb-dns-name`
2. Add validation records from certificate output

### Production Configuration

```hcl
environment = "prod"
enable_deletion_protection = true
enable_autoscaling = true
max_capacity = 5
log_retention_days = 90
alb_access_logs_bucket = "your-alb-logs-bucket"
```

### Environment Variables and Secrets

```hcl
container_environment_variables = [
  {
    name  = "NODE_ENV"
    value = "production"
  },
  {
    name  = "API_ENDPOINT"
    value = "https://api.example.com"
  }
]

container_secrets = [
  {
    name      = "DATABASE_PASSWORD"
    valueFrom = "arn:aws:secretsmanager:eu-west-1:123456789012:secret:prod/myapp/db-password"
  }
]
```

## 🔐 Security Configuration

### 1. Secrets Management

**DO NOT** put secrets in terraform files. Use AWS Secrets Manager:

```bash
# Create a secret
aws secretsmanager create-secret \
  --name "prod/arabic-recognition-app/api-key" \
  --secret-string "your-secret-value"

# Reference in terraform.tfvars
container_secrets = [
  {
    name      = "API_KEY"
    valueFrom = "arn:aws:secretsmanager:eu-west-1:123456789012:secret:prod/arabic-recognition-app/api-key"
  }
]
```

### 2. Network Security

The infrastructure uses defense-in-depth:

- **ALB Security Group**: Only allows HTTP(S) from internet
- **ECS Security Group**: Only allows traffic from ALB
- **Private Communication**: ECS tasks communicate via ALB only

### 3. Encryption

All data is encrypted:

- **ECR Images**: AES256 encryption
- **CloudWatch Logs**: KMS encryption
- **Traffic**: HTTPS/TLS encryption (when domain configured)

### 4. IAM Best Practices

- **Least Privilege**: Minimal required permissions
- **No Hardcoded Keys**: Uses IAM roles for service-to-service communication
- **Regular Rotation**: Use AWS Secrets Manager auto-rotation

## 📊 Monitoring and Logging

### CloudWatch Integration

```bash
# View logs
aws logs tail /ecs/arabic-recognition-app --follow

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=arabic-recognition-app-dev-service \
  --start-time 2023-01-01T00:00:00Z \
  --end-time 2023-01-01T23:59:59Z \
  --period 300 \
  --statistics Average
```

### ALB Access Logs

To enable ALB access logs:

1. Create S3 bucket for logs
2. Set bucket policy for ALB access
3. Configure in terraform.tfvars:

```hcl
alb_access_logs_bucket = "your-alb-logs-bucket"
```

## 💰 Cost Optimization

### Estimated Monthly Costs

| Component | Cost | Notes |
|-----------|------|-------|
| Fargate Tasks | $6-24 | Depends on CPU/memory |
| ALB | $16-18 | Fixed cost |
| CloudWatch Logs | $1-3 | Based on volume |
| ECR Storage | $0.10/GB | Image storage |
| Data Transfer | $0-5 | Based on traffic |
| SSL Certificate | FREE | Via ACM |
| **Total** | **$23-50/month** | Typical range |

### Cost Reduction Strategies

1. **Use Fargate Spot** (non-production):
   ```hcl
   use_fargate_spot = true
   ```

2. **Optimize Task Size**:
   ```hcl
   task_cpu    = 256  # Minimum for most apps
   task_memory = 512  # Minimum required
   ```

3. **Auto Scaling**:
   ```hcl
   enable_autoscaling = true
   min_capacity = 0   # Scale to zero when not in use
   ```

4. **Log Retention**:
   ```hcl
   log_retention_days = 7  # Reduce for development
   ```

## 🔄 CI/CD Integration

### GitHub Actions Integration

The infrastructure outputs required values for CI/CD:

```yaml
# In your GitHub Actions workflow
- name: Deploy to ECS
  env:
    ECR_REPOSITORY: ${{ terraform.outputs.ecr_repository_url }}
    ECS_CLUSTER: ${{ terraform.outputs.ecs_cluster_name }}
    ECS_SERVICE: ${{ terraform.outputs.ecs_service_name }}
    ECS_TASK_DEFINITION: ${{ terraform.outputs.task_definition_arn }}
```

### Docker Build and Push

```bash
# Get ECR repository URL
ECR_REPO=$(terraform output -raw ecr_repository_url)

# Build and push
docker build -t $ECR_REPO:latest .
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $ECR_REPO
docker push $ECR_REPO:latest
```

## 🧹 Maintenance

### Regular Updates

```bash
# Update Terraform providers
terraform init -upgrade

# Plan with latest versions
terraform plan

# Apply updates
terraform apply
```

### State Management

```bash
# List resources
terraform state list

# Import existing resources
terraform import aws_ecs_cluster.main existing-cluster-name

# Move resources
terraform state mv aws_ecs_service.old aws_ecs_service.new
```

### Backup and Recovery

```bash
# Backup state
terraform state pull > backup.tfstate

# Restore state (if needed)
terraform state push backup.tfstate
```

## 🗑️ Cleanup

### Development Environment

```bash
# Destroy all resources
terraform destroy
```

### Production Environment

```bash
# Disable deletion protection first
terraform apply -var="enable_deletion_protection=false"

# Then destroy
terraform destroy
```

⚠️ **Warning**: This will delete all infrastructure and data!

## 🐛 Troubleshooting

### Common Issues

1. **Certificate Validation Failed**
   ```bash
   # Check DNS records
   terraform output ssl_certificate_validation_records
   # Add the CNAME records to your DNS provider
   ```

2. **ECS Service Won't Start**
   ```bash
   # Check service events
   aws ecs describe-services --cluster CLUSTER_NAME --services SERVICE_NAME
   
   # Check task logs
   aws logs tail /ecs/arabic-recognition-app --follow
   ```

3. **ALB Health Checks Failing**
   ```bash
   # Verify container is responding
   curl -I http://ALB_DNS_NAME/
   
   # Check target group health
   aws elbv2 describe-target-health --target-group-arn TARGET_GROUP_ARN
   ```

4. **Permission Errors**
   ```bash
   # Check IAM policies
   aws iam simulate-principal-policy \
     --policy-source-arn USER_ARN \
     --action-names ecs:CreateCluster \
     --resource-arns '*'
   ```

### Debugging Commands

```bash
# Terraform debugging
export TF_LOG=DEBUG
terraform plan

# AWS CLI debugging
aws ecs describe-clusters --debug

# Container debugging (if enabled)
aws ecs execute-command \
  --cluster CLUSTER_NAME \
  --task TASK_ARN \
  --container CONTAINER_NAME \
  --interactive \
  --command "/bin/sh"
```

## 📚 Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [Terraform State Management](https://developer.hashicorp.com/terraform/language/state)

## 🤝 Contributing

When contributing to this infrastructure:

1. **Never commit secrets or state files**
2. **Test changes in a development environment first**
3. **Document any new variables or outputs**
4. **Follow security best practices**
5. **Update this documentation with changes**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Consult the Terraform and AWS documentation
4. Open an issue in the repository with error details

---

**Remember**: Always follow security best practices and never commit sensitive data to version control!
