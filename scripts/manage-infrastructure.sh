#!/bin/bash

# Quick Infrastructure Management Script
# Provides easy commands to manage your Arabic Recognition App infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="eu-west-1"
ECR_REPOSITORY="arabic-recognition-app"
ECS_CLUSTER="arabic-recognition-cluster"
ECS_SERVICE="arabic-recognition-service"

show_usage() {
    echo -e "${GREEN}🚀 Arabic Recognition App - Infrastructure Manager${NC}"
    echo "=================================================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Create all AWS infrastructure"
    echo "  spindown  - Remove infrastructure (preserve ECR)"
    echo "  status    - Show current infrastructure status"
    echo "  logs      - View application logs from CloudWatch"
    echo "  deploy    - Trigger GitHub Actions deployment"
    echo "  cost      - Show estimated costs"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup        # Create infrastructure"
    echo "  $0 status       # Check what's running"
    echo "  $0 spindown     # Remove infrastructure to save costs"
    echo "  $0 logs         # View recent application logs"
    echo ""
}

check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed${NC}"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not configured${NC}"
        exit 1
    fi
}

show_status() {
    echo -e "${BLUE}📊 Infrastructure Status${NC}"
    echo "======================"
    
    check_aws_cli
    
    # ECR Repository
    echo -e "${YELLOW}📦 ECR Repository:${NC}"
    if aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null; then
        IMAGE_COUNT=$(aws ecr list-images --repository-name $ECR_REPOSITORY --region $AWS_REGION --query 'length(imageIds)' --output text)
        echo -e "  ✅ Repository exists with $IMAGE_COUNT images"
    else
        echo -e "  ❌ Repository not found"
    fi
    
    # ECS Cluster
    echo -e "${YELLOW}🖥️  ECS Cluster:${NC}"
    if aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
        TASK_COUNT=$(aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION --query 'clusters[0].runningTasksCount' --output text)
        echo -e "  ✅ Cluster active with $TASK_COUNT running tasks"
    else
        echo -e "  ❌ Cluster not found or inactive"
    fi
    
    # ECS Service
    echo -e "${YELLOW}🚀 ECS Service:${NC}"
    if aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query 'services[0].status' --output text 2>/dev/null | grep -qE "ACTIVE|DRAINING"; then
        RUNNING_COUNT=$(aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query 'services[0].runningCount' --output text)
        DESIRED_COUNT=$(aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query 'services[0].desiredCount' --output text)
        echo -e "  ✅ Service active: $RUNNING_COUNT/$DESIRED_COUNT tasks running"
    else
        echo -e "  ❌ Service not found or inactive"
    fi
    
    # Log Group
    echo -e "${YELLOW}📊 CloudWatch Logs:${NC}"
    if aws logs describe-log-groups --log-group-name-prefix "/ecs/arabic-recognition-app" --region $AWS_REGION --query 'logGroups[0].logGroupName' --output text 2>/dev/null | grep -q "/ecs/arabic-recognition-app"; then
        echo -e "  ✅ Log group exists"
    else
        echo -e "  ❌ Log group not found"
    fi
}

show_logs() {
    echo -e "${BLUE}📋 Recent Application Logs${NC}"
    echo "========================="
    
    check_aws_cli
    
    LOG_GROUP="/ecs/arabic-recognition-app"
    
    if aws logs describe-log-groups --log-group-name-prefix $LOG_GROUP --region $AWS_REGION --query 'logGroups[0].logGroupName' --output text 2>/dev/null | grep -q "$LOG_GROUP"; then
        echo -e "${YELLOW}Fetching logs from last 10 minutes...${NC}"
        echo ""
        
        START_TIME=$(date -d '10 minutes ago' '+%s')000
        
        aws logs filter-log-events \
            --log-group-name $LOG_GROUP \
            --start-time $START_TIME \
            --region $AWS_REGION \
            --query 'events[*].[timestamp,message]' \
            --output table
    else
        echo -e "${RED}❌ Log group not found. Application may not be deployed yet.${NC}"
    fi
}

trigger_deploy() {
    echo -e "${BLUE}🚀 Triggering GitHub Actions Deployment${NC}"
    echo "======================================"
    
    if command -v gh &> /dev/null; then
        if gh auth status &> /dev/null; then
            echo -e "${YELLOW}Triggering workflow via GitHub CLI...${NC}"
            gh workflow run build-deploy.yml
            echo -e "${GREEN}✅ Deployment triggered! Check GitHub Actions tab for progress.${NC}"
        else
            echo -e "${YELLOW}GitHub CLI not authenticated. Please run 'gh auth login' first.${NC}"
            show_manual_deploy_instructions
        fi
    else
        echo -e "${YELLOW}GitHub CLI not installed.${NC}"
        show_manual_deploy_instructions
    fi
}

show_manual_deploy_instructions() {
    echo ""
    echo -e "${YELLOW}Manual deployment options:${NC}"
    echo "1. Push to main branch:"
    echo "   git push origin main"
    echo ""
    echo "2. Go to GitHub Actions tab and manually trigger 'Build and Deploy'"
    echo ""
    echo "3. Install GitHub CLI for easier deployments:"
    echo "   brew install gh"
}

show_cost_estimate() {
    echo -e "${BLUE}💰 Cost Estimates (Monthly)${NC}"
    echo "=========================="
    echo ""
    echo -e "${YELLOW}When infrastructure is RUNNING:${NC}"
    echo "  • ECS Fargate (1 task, 0.25 vCPU, 0.5 GB): ~\$6-12"
    echo "  • CloudWatch Logs (moderate usage): ~\$1-3"
    echo "  • ECR storage (per GB): ~\$0.10"
    echo "  • Data transfer: ~\$0-5 (depending on usage)"
    echo "  📊 Total: ~\$7-20 per month"
    echo ""
    echo -e "${YELLOW}When infrastructure is SPUN DOWN:${NC}"
    echo "  • ECR storage only: ~\$0.10-0.50"
    echo "  💰 Savings: ~\$6.50-19.50 per month"
    echo ""
    echo -e "${GREEN}💡 Tip: Use 'spindown' when not actively using the app!${NC}"
}

case "${1:-help}" in
    "setup")
        echo -e "${GREEN}🚀 Setting up infrastructure...${NC}"
        ./scripts/setup-aws-infrastructure.sh
        ;;
    "spindown")
        echo -e "${RED}🛑 Spinning down infrastructure...${NC}"
        ./scripts/spin-down-aws-infrastructure.sh
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "deploy")
        trigger_deploy
        ;;
    "cost")
        show_cost_estimate
        ;;
    "help"|*)
        show_usage
        ;;
esac
