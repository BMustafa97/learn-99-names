# Scripts Directory

This directory contains automation scripts for managing the Arabic Recognition App infrastructure.

## 📁 Available Scripts

### Infrastructure Management

#### `setup-aws-infrastructure.sh`
**Purpose**: Creates all required AWS infrastructure for the application.

**Features**:
- ✅ Creates ECR repository for Docker images
- ✅ Sets up ECS service-linked role
- ✅ Creates ECS cluster with Fargate capacity providers
- ✅ Configures CloudWatch log group
- ✅ Sets up IAM roles (task execution and task roles)
- ✅ Creates security group and networking
- ✅ Registers ECS task definition

**Usage**:
```bash
./scripts/setup-aws-infrastructure.sh
```

#### `spin-down-aws-infrastructure.sh`
**Purpose**: Removes AWS infrastructure to save costs while preserving Docker images.

**Features**:
- 🛑 Safely removes ECS service and cluster
- 🛑 Deletes task definitions and CloudWatch logs
- 🛑 Removes custom security group and IAM roles
- ✅ **Preserves ECR repository and Docker images**
- ✅ Provides cost savings estimates
- ✅ Requires confirmation before deletion

**Usage**:
```bash
./scripts/spin-down-aws-infrastructure.sh
```

#### `manage-infrastructure.sh`
**Purpose**: Unified interface for all infrastructure operations.

**Commands**:
- `setup` - Create infrastructure
- `spindown` - Remove infrastructure (preserve ECR)
- `status` - Show current infrastructure state
- `logs` - View recent application logs
- `deploy` - Trigger GitHub Actions deployment
- `cost` - Show cost estimates

**Usage**:
```bash
# Quick commands
./scripts/manage-infrastructure.sh status
./scripts/manage-infrastructure.sh spindown
./scripts/manage-infrastructure.sh setup

# View help
./scripts/manage-infrastructure.sh help
```

### Specialized Scripts

#### `create-ecs-service-linked-role.sh`
**Purpose**: Creates the ECS service-linked role required for ECS clusters.

**When to use**:
- First time setting up ECS in your AWS account
- When you get "Unable to assume the service linked role" errors
- Troubleshooting ECS cluster creation issues

**Usage**:
```bash
./scripts/create-ecs-service-linked-role.sh
```

## 🚀 Quick Start Guide

### Initial Setup
```bash
# 1. Configure AWS CLI
aws configure

# 2. Create infrastructure
./scripts/setup-aws-infrastructure.sh

# 3. Configure GitHub secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

# 4. Deploy application
git push origin main
```

### Daily Operations
```bash
# Check what's running
./scripts/manage-infrastructure.sh status

# View application logs
./scripts/manage-infrastructure.sh logs

# Trigger manual deployment
./scripts/manage-infrastructure.sh deploy
```

### Cost Management
```bash
# Save costs when not using
./scripts/manage-infrastructure.sh spindown

# Quick setup when needed
./scripts/manage-infrastructure.sh setup

# Check cost estimates
./scripts/manage-infrastructure.sh cost
```

## 📋 Prerequisites

### Required Tools
- **AWS CLI**: `aws --version`
- **Docker**: `docker --version`
- **Git**: `git --version`
- **GitHub CLI** (optional): `gh --version`

### AWS Permissions
Your AWS user/role needs permissions for:
- ECR (Elastic Container Registry)
- ECS (Elastic Container Service)
- IAM (Identity and Access Management)
- CloudWatch Logs
- VPC/EC2 (for security groups)

### Minimum IAM Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:*",
                "ecs:*",
                "iam:CreateRole",
                "iam:AttachRolePolicy",
                "iam:CreateServiceLinkedRole",
                "iam:GetRole",
                "iam:PassRole",
                "logs:*",
                "ec2:CreateSecurityGroup",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🔧 Script Configuration

All scripts use these default settings:
```bash
AWS_REGION="eu-west-1"
ECR_REPOSITORY="arabic-recognition-app"
ECS_CLUSTER="arabic-recognition-cluster"
ECS_SERVICE="arabic-recognition-service"
TASK_FAMILY="arabic-recognition-task"
LOG_GROUP="/ecs/arabic-recognition-app"
```

To customize, edit the variables at the top of each script.

## 📊 Cost Estimates

### Running Infrastructure (Monthly)
- **ECS Fargate**: $6-50+ (depending on usage)
- **CloudWatch Logs**: $1-5 (depending on log volume)
- **ECR Storage**: ~$0.10 per GB
- **Total**: $7-55+ per month

### Spun Down Infrastructure (Monthly)
- **ECR Storage Only**: $0.10-0.50
- **Savings**: $6.50-54.50 per month

## 🛡️ Safety Features

### Error Handling
- All scripts handle missing resources gracefully
- Clear error messages with suggested fixes
- Confirmation prompts for destructive operations

### Resource Protection
- ECR repository is never deleted automatically
- VPC and default networking preserved
- Service-linked roles preserved (shared across account)

### Status Verification
- Scripts verify current state before operations
- Show what exists vs. what will be created/deleted
- Provide rollback instructions

## 📋 Troubleshooting

### Common Issues

#### "Unable to assume the service linked role"
```bash
# Fix: Create the service-linked role
./scripts/create-ecs-service-linked-role.sh
```

#### "Cluster already exists"
```bash
# Check status first
./scripts/manage-infrastructure.sh status

# Or clean up and recreate
./scripts/spin-down-aws-infrastructure.sh
./scripts/setup-aws-infrastructure.sh
```

#### "AWS CLI not configured"
```bash
# Configure AWS credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export AWS_DEFAULT_REGION="eu-west-1"
```

### Getting Help

1. **Check script output** - All scripts provide detailed logging
2. **Use status command** - `./scripts/manage-infrastructure.sh status`
3. **Check AWS Console** - Verify resources in AWS web interface
4. **Review documentation** - See `/docs` folder for detailed guides

## 🔄 Typical Workflows

### Development Workflow
```bash
# Morning: Start infrastructure
./scripts/manage-infrastructure.sh setup

# Development: Deploy changes
git push origin main

# Evening: Save costs
./scripts/manage-infrastructure.sh spindown
```

### Production Workflow
```bash
# Setup once
./scripts/setup-aws-infrastructure.sh

# Deploy via CI/CD
git push origin main

# Monitor
./scripts/manage-infrastructure.sh status
./scripts/manage-infrastructure.sh logs
```

### Emergency Recovery
```bash
# Check what's running
./scripts/manage-infrastructure.sh status

# Full cleanup and recreate
./scripts/spin-down-aws-infrastructure.sh
./scripts/setup-aws-infrastructure.sh

# Or just recreate via deployment
git push origin main
```

---

These scripts provide a complete toolkit for managing your Arabic Recognition App infrastructure efficiently and cost-effectively.
