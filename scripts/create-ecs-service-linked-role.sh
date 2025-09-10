#!/bin/bash

# ECS Service-Linked Role Creation Script
# This script creates the ECS service-linked role that is required for ECS clusters

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔗 Creating ECS Service-Linked Role${NC}"
echo "=================================="

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

# Function to create ECS service-linked role
create_ecs_service_linked_role() {
    echo -e "${YELLOW}🔗 Creating ECS service-linked role...${NC}"
    
    # Check if the service-linked role already exists
    if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
        echo -e "${GREEN}✅ ECS service-linked role already exists${NC}"
        
        # Display role details
        ROLE_ARN=$(aws iam get-role --role-name AWSServiceRoleForECS --query 'Role.Arn' --output text)
        echo -e "${GREEN}📍 Role ARN: ${ROLE_ARN}${NC}"
    else
        echo -e "${YELLOW}⏳ Creating ECS service-linked role...${NC}"
        
        # Create the service-linked role
        if aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com 2>/dev/null; then
            echo -e "${GREEN}✅ ECS service-linked role created successfully${NC}"
        else
            # Check error details
            if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
                echo -e "${GREEN}✅ ECS service-linked role already exists (created during error handling)${NC}"
            else
                echo -e "${RED}❌ Failed to create ECS service-linked role${NC}"
                echo -e "${YELLOW}💡 This might be due to:${NC}"
                echo "   - Role already exists in your account"
                echo "   - Insufficient permissions"
                echo "   - AWS service issue"
                echo ""
                echo -e "${YELLOW}🔧 Manual creation steps:${NC}"
                echo "1. Go to AWS IAM Console"
                echo "2. Navigate to Roles"
                echo "3. Click 'Create role'"
                echo "4. Select 'AWS service' and choose 'Elastic Container Service'"
                echo "5. Follow the prompts to create the service-linked role"
                exit 1
            fi
        fi
        
        # Wait a moment for the role to be available
        echo -e "${YELLOW}⏳ Waiting for role to be available...${NC}"
        sleep 5
        
        # Verify the role exists and get ARN
        if aws iam get-role --role-name AWSServiceRoleForECS &> /dev/null; then
            ROLE_ARN=$(aws iam get-role --role-name AWSServiceRoleForECS --query 'Role.Arn' --output text)
            echo -e "${GREEN}✅ ECS service-linked role is ready${NC}"
            echo -e "${GREEN}📍 Role ARN: ${ROLE_ARN}${NC}"
        else
            echo -e "${YELLOW}⚠️  Role may still be propagating. This is normal and should resolve shortly.${NC}"
        fi
    fi
}

# Main function
main() {
    echo -e "${GREEN}Starting ECS service-linked role creation...${NC}"
    echo ""
    
    check_aws_cli
    echo ""
    
    create_ecs_service_linked_role
    echo ""
    
    echo -e "${GREEN}🎉 ECS Service-Linked Role Setup Complete!${NC}"
    echo "=========================================="
    echo ""
    echo -e "${YELLOW}What this role does:${NC}"
    echo "- Allows ECS to make calls to other AWS services on your behalf"
    echo "- Required for ECS clusters and services to function properly"
    echo "- Automatically manages permissions for ECS operations"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "- You can now create ECS clusters without service-linked role errors"
    echo "- Run the main setup script: ./setup-aws-infrastructure.sh"
    echo "- Or manually create ECS resources via AWS Console/CLI"
    echo ""
    echo -e "${GREEN}✅ Ready to proceed with ECS cluster creation!${NC}"
}

# Run main function
main "$@"
