# Infrastructure Spin Down Guide

Guide for safely removing AWS infrastructure to save costs while preserving your Docker images and deployment capability.

## 🎯 Purpose

The spin down script removes AWS resources that incur ongoing costs while preserving:
- ✅ **ECR Repository**: Your Docker images remain safe
- ✅ **ECS Service-Linked Role**: Shared across your AWS account
- ✅ **VPC & Networking**: Default AWS resources
- ✅ **GitHub Workflows**: Ready for instant redeployment

## 💰 Cost Savings

### Monthly Savings When Spun Down
- **ECS Fargate Tasks**: $6-50+ (depending on usage)
- **CloudWatch Logs**: $1-5 (depending on log volume)
- **Total Savings**: $7-55+ per month

### Remaining Costs
- **ECR Storage**: ~$0.10 per GB per month (minimal)

## 🚀 Quick Commands

### Spin Down Infrastructure
```bash
# Using the dedicated script
./scripts/spin-down-aws-infrastructure.sh

# Or using the management script
./scripts/manage-infrastructure.sh spindown
```

### Check Status
```bash
./scripts/manage-infrastructure.sh status
```

### Recreate Infrastructure
```bash
./scripts/manage-infrastructure.sh setup
```

## 🔄 Spin Down Process

### What Gets Removed
1. **ECS Service** - Stops all running tasks
2. **ECS Cluster** - Removes the compute cluster
3. **Task Definitions** - Deregisters all task revisions
4. **CloudWatch Log Group** - Removes log storage
5. **Security Group** - Removes custom network rules
6. **IAM Roles** - Removes task execution and task roles

### What Stays Protected
1. **ECR Repository** - All your Docker images
2. **VPC & Subnets** - Default AWS networking
3. **ECS Service-Linked Role** - Shared AWS account resource
4. **GitHub Workflows** - Ready for redeployment

## 📋 Step-by-Step Process

### 1. Confirmation
The script will show you exactly what will be removed:
```
Resources to be removed:
  • ECS Service: arabic-recognition-service
  • ECS Cluster: arabic-recognition-cluster
  • Task Definitions: arabic-recognition-task (all revisions)
  • CloudWatch Log Group: /ecs/arabic-recognition-app
  • Security Group: arabic-recognition-sg
  • IAM Roles: ecsTaskExecutionRole, ecsTaskRole

Resources to be PRESERVED:
  • ECR Repository: arabic-recognition-app (and all images)
  • VPC and default networking
  • ECS Service-Linked Role (shared across account)
```

### 2. Service Shutdown
- Scales ECS service to 0 tasks
- Waits for all tasks to stop gracefully
- Deletes the ECS service

### 3. Cluster Cleanup
- Removes any remaining services
- Deletes the ECS cluster

### 4. Resource Cleanup
- Deregisters all task definition revisions
- Deletes CloudWatch log group
- Removes custom security group
- Deletes IAM roles

### 5. Verification
- Shows preserved ECR repository and image count
- Confirms all target resources are removed

## 🔄 Redeployment Process

After spinning down, you can recreate everything:

### Option 1: Full Setup
```bash
./scripts/setup-aws-infrastructure.sh
```

### Option 2: GitHub Actions Deploy
```bash
# Push to main branch (will recreate infrastructure automatically)
git push origin main

# Or manually trigger deployment
./scripts/manage-infrastructure.sh deploy
```

### What Happens During Redeployment
1. **Infrastructure Recreation**: ECS cluster, service, roles, etc.
2. **Image Pull**: Uses existing images from ECR
3. **Service Startup**: Deploys latest version immediately
4. **Health Checks**: Verifies deployment success

## 🛡️ Safety Features

### Confirmation Required
- Script requires typing "yes" to proceed
- Shows exactly what will be removed/preserved
- Can be cancelled at any time with Ctrl+C

### Graceful Shutdown
- Tasks are stopped gracefully (not killed)
- Waits for services to stabilize before deletion
- Handles missing resources without errors

### Error Handling
- Continues if some resources are already deleted
- Provides clear status messages
- Shows what succeeded and what was skipped

## 📊 Monitoring During Spin Down

### Real-time Status
```bash
# Watch ECS service scaling down
aws ecs describe-services --cluster arabic-recognition-cluster --services arabic-recognition-service

# Monitor running tasks
aws ecs list-tasks --cluster arabic-recognition-cluster
```

### Verification Commands
```bash
# Check if cluster exists
aws ecs describe-clusters --clusters arabic-recognition-cluster

# Verify ECR repository is preserved
aws ecr describe-repositories --repository-names arabic-recognition-app

# List remaining IAM roles
aws iam list-roles --query 'Roles[?contains(RoleName, `ecs`)]'
```

## 🔧 Customization

### Modify Resources to Remove
Edit the script variables at the top:
```bash
# Configuration
AWS_REGION="eu-west-1"
ECR_REPOSITORY="arabic-recognition-app"
ECS_CLUSTER="arabic-recognition-cluster"
ECS_SERVICE="arabic-recognition-service"
TASK_FAMILY="arabic-recognition-task"
LOG_GROUP="/ecs/arabic-recognition-app"
SG_NAME="arabic-recognition-sg"
```

### Skip Certain Resources
Comment out function calls in the `main()` function:
```bash
main() {
    check_aws_cli
    confirm_destruction
    
    delete_ecs_service
    delete_ecs_cluster
    delete_task_definitions
    # delete_log_group        # Skip log group deletion
    delete_security_group
    delete_iam_roles
    
    display_summary
}
```

## 🚨 Important Notes

### ECR Repository Protection
- The script will **NEVER** delete your ECR repository
- All Docker images remain safe and accessible
- You can manually delete ECR repository if needed (separate action)

### Service-Linked Role
- ECS service-linked role is shared across your AWS account
- Used by all ECS clusters in your account
- Safe to keep (no ongoing costs)

### VPC and Networking
- Uses default VPC and subnets
- Shared with other AWS resources
- Only custom security group is removed

## 🔄 Typical Usage Pattern

### Development/Testing Cycle
```bash
# Start development
./scripts/setup-aws-infrastructure.sh

# Deploy and test
git push origin main

# Spin down when not in use
./scripts/spin-down-aws-infrastructure.sh

# Quick redeploy when needed
git push origin main  # Auto-recreates infrastructure
```

### Cost-Conscious Usage
- Spin down during nights/weekends
- Spin up only when needed
- Use status command to check current state
- Set up alerts for unexpected resource creation

## 🆘 Troubleshooting

### Script Fails Partway Through
- Re-run the script (it handles already-deleted resources)
- Check AWS permissions for your user/role
- Verify AWS CLI configuration

### Can't Delete Some Resources
- May have dependencies (load balancers, etc.)
- Check AWS Console for error details
- Manual deletion may be required

### Need to Preserve Logs
- Export CloudWatch logs before running script
- Or comment out `delete_log_group` function call

---

The spin down script provides a safe, cost-effective way to manage your infrastructure while keeping your deployment capability intact. Your Docker images and GitHub workflows remain ready for instant redeployment!
