#!/bin/bash

# AWS Setup Script for Arabic Recognition App CI/CD Pipeline
# This script sets up the required AWS infrastructure for the deployment pipeline

set -e

# Configuration
AWS_REGION="eu-west-1"
ECR_REPOSITORY="arabic-recognition-app"
ECS_CLUSTER="arabic-recognition-cluster"
ECS_SERVICE="arabic-recognition-service"
TASK_FAMILY="arabic-recognition-task"
LOG_GROUP="/ecs/arabic-recognition-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up AWS infrastructure for Arabic Recognition App${NC}"
echo "======================================================"

# Function to check if AWS CLI is configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
        exit 1
    fi
    
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    echo -e "${GREEN}✅ AWS CLI configured for account: ${AWS_ACCOUNT_ID}${NC}"
}

# Function to create ECR repository
create_ecr_repository() {
    echo -e "${YELLOW}📦 Creating ECR repository...${NC}"
    
    if aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null; then
        echo -e "${GREEN}✅ ECR repository '$ECR_REPOSITORY' already exists${NC}"
    else
        aws ecr create-repository \
            --repository-name $ECR_REPOSITORY \
            --region $AWS_REGION \
            --image-scanning-configuration scanOnPush=true
        echo -e "${GREEN}✅ ECR repository '$ECR_REPOSITORY' created${NC}"
    fi
    
    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
    echo -e "${GREEN}📍 ECR URI: ${ECR_URI}${NC}"
}

# Function to create ECS service-linked role
create_ecs_service_linked_role() {
    echo -e "${YELLOW}🔗 Creating ECS service-linked role...${NC}"
    
    # Check if the service-linked role already exists
    if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
        echo -e "${GREEN}✅ ECS service-linked role already exists${NC}"
    else
        # Create the service-linked role
        aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com &> /dev/null || {
            # If it fails, it might already exist or be in the process of being created
            echo -e "${YELLOW}⚠️  ECS service-linked role creation initiated (may already exist)${NC}"
        }
        
        # Wait a moment for the role to be available
        echo -e "${YELLOW}⏳ Waiting for ECS service-linked role to be available...${NC}"
        sleep 10
        
        # Verify the role exists
        if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
            echo -e "${GREEN}✅ ECS service-linked role is now available${NC}"
        else
            echo -e "${YELLOW}⚠️  ECS service-linked role may still be propagating. Continuing...${NC}"
        fi
    fi
}

# Function to create ECS cluster
create_ecs_cluster() {
    echo -e "${YELLOW}🖥️  Creating ECS cluster...${NC}"
    
    if aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
        echo -e "${GREEN}✅ ECS cluster '$ECS_CLUSTER' already exists and is active${NC}"
    else
        # Try to create cluster with capacity providers first
        if aws ecs create-cluster \
            --cluster-name $ECS_CLUSTER \
            --capacity-providers FARGATE \
            --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
            --region $AWS_REGION 2>/dev/null; then
            echo -e "${GREEN}✅ ECS cluster '$ECS_CLUSTER' created with capacity providers${NC}"
        else
            echo -e "${YELLOW}⚠️  Failed to create cluster with capacity providers, trying simple cluster creation...${NC}"
            # Fallback: create simple cluster without capacity providers
            if aws ecs create-cluster \
                --cluster-name $ECS_CLUSTER \
                --region $AWS_REGION; then
                echo -e "${GREEN}✅ ECS cluster '$ECS_CLUSTER' created (simple cluster)${NC}"
                echo -e "${YELLOW}ℹ️  You can add capacity providers later via AWS Console${NC}"
            else
                echo -e "${RED}❌ Failed to create ECS cluster. Please check IAM permissions.${NC}"
                echo -e "${YELLOW}💡 You may need to create the cluster manually in the AWS Console${NC}"
            fi
        fi
    fi
}

# Function to create CloudWatch log group
create_log_group() {
    echo -e "${YELLOW}📊 Creating CloudWatch log group...${NC}"
    
    if aws logs describe-log-groups --log-group-name-prefix $LOG_GROUP --region $AWS_REGION --query 'logGroups[0].logGroupName' --output text 2>/dev/null | grep -q "$LOG_GROUP"; then
        echo -e "${GREEN}✅ Log group '$LOG_GROUP' already exists${NC}"
    else
        aws logs create-log-group \
            --log-group-name $LOG_GROUP \
            --region $AWS_REGION
        echo -e "${GREEN}✅ Log group '$LOG_GROUP' created${NC}"
    fi
}

# Function to create IAM roles
create_iam_roles() {
    echo -e "${YELLOW}🔐 Creating IAM roles...${NC}"
    
    # ECS Task Execution Role
    EXECUTION_ROLE_NAME="ecsTaskExecutionRole"
    if aws iam get-role --role-name $EXECUTION_ROLE_NAME &> /dev/null; then
        echo -e "${GREEN}✅ ECS Task Execution Role already exists${NC}"
    else
        # Create trust policy
        cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
        
        aws iam create-role \
            --role-name $EXECUTION_ROLE_NAME \
            --assume-role-policy-document file://trust-policy.json
        
        aws iam attach-role-policy \
            --role-name $EXECUTION_ROLE_NAME \
            --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
        
        rm trust-policy.json
        echo -e "${GREEN}✅ ECS Task Execution Role created${NC}"
    fi
    
    # ECS Task Role
    TASK_ROLE_NAME="ecsTaskRole"
    if aws iam get-role --role-name $TASK_ROLE_NAME &> /dev/null; then
        echo -e "${GREEN}✅ ECS Task Role already exists${NC}"
    else
        aws iam create-role \
            --role-name $TASK_ROLE_NAME \
            --assume-role-policy-document file://trust-policy.json 2>/dev/null || true
        echo -e "${GREEN}✅ ECS Task Role created${NC}"
    fi
}

# Function to create task definition
create_task_definition() {
    echo -e "${YELLOW}📋 Creating ECS task definition...${NC}"
    
    # Update task definition template with actual account ID
    if [ -f ".aws/task-definition-template.json" ]; then
        sed "s/YOUR_ACCOUNT_ID/${AWS_ACCOUNT_ID}/g" .aws/task-definition-template.json > task-definition.json
        
        # Register task definition
        aws ecs register-task-definition \
            --cli-input-json file://task-definition.json \
            --region $AWS_REGION
        
        rm task-definition.json
        echo -e "${GREEN}✅ Task definition registered${NC}"
    else
        echo -e "${RED}❌ Task definition template not found at .aws/task-definition-template.json${NC}"
        echo -e "${YELLOW}ℹ️  You'll need to manually create the task definition${NC}"
    fi
}

# Function to create VPC and networking (simplified)
create_networking() {
    echo -e "${YELLOW}🌐 Checking VPC and networking...${NC}"
    
    # Get default VPC
    DEFAULT_VPC=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region $AWS_REGION)
    
    if [ "$DEFAULT_VPC" != "None" ]; then
        echo -e "${GREEN}✅ Using default VPC: $DEFAULT_VPC${NC}"
        
        # Get subnets
        SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$DEFAULT_VPC" --query 'Subnets[0:2].SubnetId' --output text --region $AWS_REGION)
        echo -e "${GREEN}✅ Available subnets: $SUBNETS${NC}"
        
        # Create security group
        SG_NAME="arabic-recognition-sg"
        SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION 2>/dev/null)
        
        if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
            SG_ID=$(aws ec2 create-security-group \
                --group-name $SG_NAME \
                --description "Security group for Arabic Recognition App" \
                --vpc-id $DEFAULT_VPC \
                --region $AWS_REGION \
                --query 'GroupId' --output text)
            
            # Allow HTTP traffic
            aws ec2 authorize-security-group-ingress \
                --group-id $SG_ID \
                --protocol tcp \
                --port 3000 \
                --cidr 0.0.0.0/0 \
                --region $AWS_REGION
            
            echo -e "${GREEN}✅ Security group created: $SG_ID${NC}"
        else
            echo -e "${GREEN}✅ Security group exists: $SG_ID${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No default VPC found. You'll need to create VPC and networking manually.${NC}"
    fi
}

# Function to display summary
display_summary() {
    echo ""
    echo -e "${GREEN}🎉 AWS Infrastructure Setup Complete!${NC}"
    echo "======================================"
    echo -e "${GREEN}ECR Repository URI:${NC} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
    echo -e "${GREEN}ECS Cluster:${NC} ${ECS_CLUSTER}"
    echo -e "${GREEN}Log Group:${NC} ${LOG_GROUP}"
    echo -e "${GREEN}AWS Region:${NC} ${AWS_REGION}"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Update GitHub secrets with AWS credentials"
    echo "2. Verify the workflow files in .github/workflows/"
    echo "3. Push changes to trigger the CI/CD pipeline"
    echo "4. Create ECS service manually or through the first deployment"
    echo ""
    echo -e "${YELLOW}GitHub Secrets to configure:${NC}"
    echo "- AWS_ACCESS_KEY_ID"
    echo "- AWS_SECRET_ACCESS_KEY"
    echo ""
    echo -e "${GREEN}For detailed instructions, see docs/cicd-setup.md${NC}"
}

# Main execution
main() {
    check_aws_cli
    create_ecr_repository
    create_ecs_service_linked_role
    create_ecs_cluster
    create_log_group
    create_iam_roles
    create_task_definition
    create_networking
    display_summary
}

# Run main function
main "$@"
