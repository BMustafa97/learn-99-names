#!/bin/bash

# AWS Infrastructure Spin Down Script for Arabic Recognition App
# This script removes AWS resources to save costs, but preserves the ECR repository

set -e

# Configuration
AWS_REGION="eu-west-1"
ECR_REPOSITORY="arabic-recognition-app"
ECS_CLUSTER="arabic-recognition-cluster"
ECS_SERVICE="arabic-recognition-service"
TASK_FAMILY="arabic-recognition-task"
LOG_GROUP="/ecs/arabic-recognition-app"
SG_NAME="arabic-recognition-sg"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}🛑 AWS Infrastructure Spin Down${NC}"
echo -e "${RED}================================${NC}"
echo -e "${YELLOW}⚠️  WARNING: This will remove AWS resources and may cause data loss!${NC}"
echo -e "${YELLOW}📦 ECR repository will be PRESERVED to keep your Docker images${NC}"
echo ""

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

# Function to confirm destruction
confirm_destruction() {
    echo -e "${YELLOW}📋 Resources to be removed:${NC}"
    echo "  • ECS Service: $ECS_SERVICE"
    echo "  • ECS Cluster: $ECS_CLUSTER"
    echo "  • Task Definitions: $TASK_FAMILY (all revisions)"
    echo "  • CloudWatch Log Group: $LOG_GROUP"
    echo "  • Security Group: $SG_NAME"
    echo "  • IAM Roles: ecsTaskExecutionRole, ecsTaskRole"
    echo ""
    echo -e "${GREEN}📦 Resources to be PRESERVED:${NC}"
    echo "  • ECR Repository: $ECR_REPOSITORY (and all images)"
    echo "  • VPC and default networking"
    echo "  • ECS Service-Linked Role (shared across account)"
    echo ""
    
    read -p "Are you sure you want to proceed? Type 'yes' to continue: " confirmation
    if [[ $confirmation != "yes" ]]; then
        echo -e "${YELLOW}❌ Operation cancelled by user${NC}"
        exit 0
    fi
    echo ""
}

# Function to delete ECS service
delete_ecs_service() {
    echo -e "${YELLOW}🗑️  Deleting ECS service...${NC}"
    
    # Check if service exists
    if aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query 'services[0].status' --output text 2>/dev/null | grep -qE "ACTIVE|DRAINING"; then
        echo -e "${BLUE}📍 Found ECS service '$ECS_SERVICE'${NC}"
        
        # Scale down to 0 first
        echo -e "${YELLOW}⏬ Scaling service to 0 tasks...${NC}"
        aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE \
            --desired-count 0 \
            --region $AWS_REGION \
            --output table
        
        # Wait for tasks to stop
        echo -e "${YELLOW}⏳ Waiting for tasks to stop...${NC}"
        aws ecs wait services-stable \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE \
            --region $AWS_REGION
        
        # Delete the service
        echo -e "${YELLOW}🗑️  Deleting service...${NC}"
        aws ecs delete-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE \
            --region $AWS_REGION \
            --force
        
        echo -e "${GREEN}✅ ECS service '$ECS_SERVICE' deleted${NC}"
    else
        echo -e "${BLUE}ℹ️  ECS service '$ECS_SERVICE' not found or already deleted${NC}"
    fi
}

# Function to delete ECS cluster
delete_ecs_cluster() {
    echo -e "${YELLOW}🗑️  Deleting ECS cluster...${NC}"
    
    # Check if cluster exists and is active
    if aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
        echo -e "${BLUE}📍 Found ECS cluster '$ECS_CLUSTER'${NC}"
        
        # List any remaining services (shouldn't be any after previous step)
        REMAINING_SERVICES=$(aws ecs list-services --cluster $ECS_CLUSTER --region $AWS_REGION --query 'serviceArns' --output text)
        if [[ -n "$REMAINING_SERVICES" && "$REMAINING_SERVICES" != "None" ]]; then
            echo -e "${YELLOW}⚠️  Found remaining services in cluster:${NC}"
            echo "$REMAINING_SERVICES"
            echo -e "${YELLOW}🔄 Deleting remaining services...${NC}"
            for service in $REMAINING_SERVICES; do
                aws ecs delete-service --cluster $ECS_CLUSTER --service $service --region $AWS_REGION --force || true
            done
        fi
        
        # Delete the cluster
        aws ecs delete-cluster \
            --cluster $ECS_CLUSTER \
            --region $AWS_REGION
        
        echo -e "${GREEN}✅ ECS cluster '$ECS_CLUSTER' deleted${NC}"
    else
        echo -e "${BLUE}ℹ️  ECS cluster '$ECS_CLUSTER' not found or already deleted${NC}"
    fi
}

# Function to delete task definitions
delete_task_definitions() {
    echo -e "${YELLOW}🗑️  Deleting task definitions...${NC}"
    
    # List all task definition revisions
    TASK_DEFINITIONS=$(aws ecs list-task-definitions --family-prefix $TASK_FAMILY --region $AWS_REGION --query 'taskDefinitionArns' --output text 2>/dev/null)
    
    if [[ -n "$TASK_DEFINITIONS" && "$TASK_DEFINITIONS" != "None" ]]; then
        echo -e "${BLUE}📍 Found task definitions for family '$TASK_FAMILY'${NC}"
        
        for task_def in $TASK_DEFINITIONS; do
            echo -e "${YELLOW}🗑️  Deregistering task definition: $task_def${NC}"
            aws ecs deregister-task-definition \
                --task-definition $task_def \
                --region $AWS_REGION \
                --output table
        done
        
        echo -e "${GREEN}✅ All task definitions for '$TASK_FAMILY' deregistered${NC}"
    else
        echo -e "${BLUE}ℹ️  No task definitions found for family '$TASK_FAMILY'${NC}"
    fi
}

# Function to delete CloudWatch log group
delete_log_group() {
    echo -e "${YELLOW}🗑️  Deleting CloudWatch log group...${NC}"
    
    # Check if log group exists
    if aws logs describe-log-groups --log-group-name-prefix $LOG_GROUP --region $AWS_REGION --query 'logGroups[0].logGroupName' --output text 2>/dev/null | grep -q "$LOG_GROUP"; then
        echo -e "${BLUE}📍 Found log group '$LOG_GROUP'${NC}"
        
        # Delete log group
        aws logs delete-log-group \
            --log-group-name $LOG_GROUP \
            --region $AWS_REGION
        
        echo -e "${GREEN}✅ Log group '$LOG_GROUP' deleted${NC}"
    else
        echo -e "${BLUE}ℹ️  Log group '$LOG_GROUP' not found or already deleted${NC}"
    fi
}

# Function to delete security group
delete_security_group() {
    echo -e "${YELLOW}🗑️  Deleting security group...${NC}"
    
    # Get default VPC
    DEFAULT_VPC=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region $AWS_REGION 2>/dev/null)
    
    if [[ "$DEFAULT_VPC" != "None" && -n "$DEFAULT_VPC" ]]; then
        # Find security group
        SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$DEFAULT_VPC" --query 'SecurityGroups[0].GroupId' --output text --region $AWS_REGION 2>/dev/null)
        
        if [[ "$SG_ID" != "None" && -n "$SG_ID" ]]; then
            echo -e "${BLUE}📍 Found security group '$SG_NAME' (ID: $SG_ID)${NC}"
            
            # Delete security group
            aws ec2 delete-security-group \
                --group-id $SG_ID \
                --region $AWS_REGION
            
            echo -e "${GREEN}✅ Security group '$SG_NAME' deleted${NC}"
        else
            echo -e "${BLUE}ℹ️  Security group '$SG_NAME' not found or already deleted${NC}"
        fi
    else
        echo -e "${BLUE}ℹ️  Default VPC not found, skipping security group deletion${NC}"
    fi
}

# Function to delete IAM roles
delete_iam_roles() {
    echo -e "${YELLOW}🗑️  Deleting IAM roles...${NC}"
    
    # Delete ECS Task Execution Role
    EXECUTION_ROLE_NAME="ecsTaskExecutionRole"
    if aws iam get-role --role-name $EXECUTION_ROLE_NAME &> /dev/null; then
        echo -e "${BLUE}📍 Found IAM role '$EXECUTION_ROLE_NAME'${NC}"
        
        # Detach policies
        echo -e "${YELLOW}🔗 Detaching policies from '$EXECUTION_ROLE_NAME'...${NC}"
        aws iam detach-role-policy \
            --role-name $EXECUTION_ROLE_NAME \
            --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy || true
        
        # Delete role
        aws iam delete-role --role-name $EXECUTION_ROLE_NAME
        echo -e "${GREEN}✅ IAM role '$EXECUTION_ROLE_NAME' deleted${NC}"
    else
        echo -e "${BLUE}ℹ️  IAM role '$EXECUTION_ROLE_NAME' not found or already deleted${NC}"
    fi
    
    # Delete ECS Task Role
    TASK_ROLE_NAME="ecsTaskRole"
    if aws iam get-role --role-name $TASK_ROLE_NAME &> /dev/null; then
        echo -e "${BLUE}📍 Found IAM role '$TASK_ROLE_NAME'${NC}"
        
        # List and detach any attached policies
        ATTACHED_POLICIES=$(aws iam list-attached-role-policies --role-name $TASK_ROLE_NAME --query 'AttachedPolicies[].PolicyArn' --output text)
        if [[ -n "$ATTACHED_POLICIES" ]]; then
            echo -e "${YELLOW}🔗 Detaching policies from '$TASK_ROLE_NAME'...${NC}"
            for policy in $ATTACHED_POLICIES; do
                aws iam detach-role-policy --role-name $TASK_ROLE_NAME --policy-arn $policy || true
            done
        fi
        
        # Delete role
        aws iam delete-role --role-name $TASK_ROLE_NAME
        echo -e "${GREEN}✅ IAM role '$TASK_ROLE_NAME' deleted${NC}"
    else
        echo -e "${BLUE}ℹ️  IAM role '$TASK_ROLE_NAME' not found or already deleted${NC}"
    fi
}

# Function to show preserved resources
show_preserved_resources() {
    echo -e "${GREEN}📦 Preserved Resources${NC}"
    echo -e "${GREEN}====================${NC}"
    
    # Show ECR repository
    if aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null; then
        ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"
        IMAGE_COUNT=$(aws ecr list-images --repository-name $ECR_REPOSITORY --region $AWS_REGION --query 'length(imageIds)' --output text)
        echo -e "${GREEN}✅ ECR Repository: $ECR_REPOSITORY${NC}"
        echo -e "${GREEN}📍 URI: $ECR_URI${NC}"
        echo -e "${GREEN}🖼️  Images: $IMAGE_COUNT${NC}"
    else
        echo -e "${YELLOW}⚠️  ECR repository '$ECR_REPOSITORY' not found${NC}"
    fi
    
    # Show service-linked role
    if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
        echo -e "${GREEN}✅ ECS Service-Linked Role: AWSServiceRoleForECS${NC}"
    fi
}

# Function to display summary
display_summary() {
    echo ""
    echo -e "${GREEN}🎉 Infrastructure Spin Down Complete!${NC}"
    echo "====================================="
    echo ""
    echo -e "${GREEN}✅ Removed Resources:${NC}"
    echo "  • ECS Service and Cluster"
    echo "  • Task Definitions"
    echo "  • CloudWatch Log Group"
    echo "  • Security Group"
    echo "  • IAM Roles (Task Execution and Task Roles)"
    echo ""
    echo -e "${GREEN}📦 Preserved Resources:${NC}"
    echo "  • ECR Repository and Docker images"
    echo "  • VPC and default networking"
    echo "  • ECS Service-Linked Role"
    echo ""
    echo -e "${YELLOW}💰 Cost Savings:${NC}"
    echo "  • No ECS tasks running (main cost driver)"
    echo "  • No CloudWatch log ingestion charges"
    echo "  • ECR storage costs remain (minimal)"
    echo ""
    echo -e "${YELLOW}🔄 To recreate infrastructure:${NC}"
    echo "  1. Run: ./scripts/setup-aws-infrastructure.sh"
    echo "  2. Your Docker images will still be available in ECR"
    echo "  3. CI/CD pipeline will work immediately"
    echo ""
    echo -e "${GREEN}🛡️  Your Docker images are safe in ECR!${NC}"
}

# Function to estimate savings
show_cost_savings() {
    echo -e "${YELLOW}💰 Estimated Monthly Cost Savings:${NC}"
    echo "  • ECS Fargate tasks: ~\$20-50+ (depending on usage)"
    echo "  • CloudWatch logs: ~\$1-5 (depending on log volume)"
    echo "  • Load balancer: \$0 (not created by our setup)"
    echo "  • NAT Gateway: \$0 (using public subnets)"
    echo ""
    echo -e "${GREEN}📦 Remaining ECR costs: ~\$0.10 per GB per month${NC}"
    echo ""
}

# Main execution
main() {
    check_aws_cli
    echo ""
    
    show_cost_savings
    confirm_destruction
    
    echo -e "${RED}🛑 Starting infrastructure spin down...${NC}"
    echo ""
    
    delete_ecs_service
    echo ""
    
    delete_ecs_cluster
    echo ""
    
    delete_task_definitions
    echo ""
    
    delete_log_group
    echo ""
    
    delete_security_group
    echo ""
    
    delete_iam_roles
    echo ""
    
    show_preserved_resources
    echo ""
    
    display_summary
}

# Handle script interruption
trap 'echo -e "\n${YELLOW}⚠️  Script interrupted by user${NC}"; exit 1' INT

# Run main function
main "$@"
