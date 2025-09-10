# ECS Service-Linked Role Troubleshooting

## Issue: "Unable to assume the service linked role"

This error occurs when trying to create an ECS cluster without the required ECS service-linked role.

### Error Message
```
An error occurred (InvalidParameterException) when calling the CreateCluster operation: 
Unable to assume the service linked role. Please verify that the ECS service linked role exists.
```

## 🔧 Solutions

### Option 1: Run the Service-Linked Role Script (Recommended)
```bash
./scripts/create-ecs-service-linked-role.sh
```

This script will:
- ✅ Check if the role already exists
- ✅ Create the role if needed
- ✅ Verify the role is ready
- ✅ Provide detailed feedback

### Option 2: Manual AWS CLI Creation
```bash
# Create the service-linked role
aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

# Verify it was created
aws iam get-role --role-name AWSServiceRoleForECS
```

### Option 3: AWS Console Creation
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Navigate to **Roles** in the left sidebar
3. Click **Create role**
4. Select **AWS service**
5. Choose **Elastic Container Service**
6. Select **Elastic Container Service Task**
7. Click **Next** through the steps
8. Name the role `AWSServiceRoleForECS`
9. Click **Create role**

## 🔍 Root Cause

The ECS service-linked role (`AWSServiceRoleForECS`) is required for:
- ECS clusters to manage capacity providers
- ECS services to interact with other AWS services
- Auto Scaling integration
- Load balancer integration

This role is usually created automatically when you first use ECS, but some accounts may need to create it explicitly.

## ✅ Verification

After creating the role, verify it exists:
```bash
aws iam get-role --role-name AWSServiceRoleForECS
```

Expected output should include:
```json
{
    "Role": {
        "RoleName": "AWSServiceRoleForECS",
        "Arn": "arn:aws:iam::YOUR_ACCOUNT_ID:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS",
        "CreateDate": "2025-09-10T...",
        "AssumeRolePolicyDocument": "...",
        "Description": "Role to enable Amazon ECS to manage your cluster."
    }
}
```

## 🚀 After Fix

Once the service-linked role is created, you can:

1. **Re-run the setup script:**
   ```bash
   ./scripts/setup-aws-infrastructure.sh
   ```

2. **Or manually create the ECS cluster:**
   ```bash
   aws ecs create-cluster \
     --cluster-name arabic-recognition-cluster \
     --capacity-providers FARGATE \
     --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1
   ```

## 🛡️ Permissions Required

To create the service-linked role, your AWS user/role needs:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole",
                "iam:GetRole"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🔄 Updated Setup Process

The updated setup script now:
1. ✅ Creates the ECS service-linked role first
2. ✅ Then creates the ECS cluster
3. ✅ Provides fallback options if role creation fails
4. ✅ Gives clear error messages and next steps

## 📞 Still Having Issues?

If you continue to have problems:

1. **Check IAM permissions** - Ensure your user has sufficient permissions
2. **Try different region** - Some regions may have different requirements
3. **Contact AWS Support** - For account-specific issues
4. **Use AWS Console** - Manual creation via console often works when CLI fails

The service-linked role is a one-time setup per AWS account, so once created, this error won't occur again.
