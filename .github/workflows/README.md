# GitHub Workflows

This directory contains the CI/CD workflows for the Arabic Recognition App.

## 🔄 Workflows

### 1. CI Matrix Tests (`ci-matrix.yml`)
Comprehensive testing workflow that runs on every push and pull request.

**Features:**
- 🔍 **Change Detection**: Only runs relevant tests based on file changes
- 📊 **Matrix Testing**: Tests across multiple Node.js versions and operating systems
- 🐳 **Docker Testing**: Validates Docker builds and compose setups
- 🔒 **Security Scanning**: npm audit and container vulnerability scanning
- 📝 **Documentation**: Validates markdown and documentation accuracy

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger via GitHub Actions UI

### 2. Build and Deploy (`build-deploy.yml`)
Production build and deployment workflow.

**Features:**
- 🏗️ **Docker Build**: Builds and tests Docker images
- 📦 **ECR Push**: Pushes images to Amazon ECR
- 🚀 **ECS Deploy**: Deploys to Amazon ECS (main branch only)
- ✅ **Health Checks**: Verifies deployment success
- 🔄 **Rollback Support**: Automatic rollback on deployment failure

**Triggers:**
- Push to `main` branch (builds and deploys)
- Push to other branches (builds only)
- Pull requests (builds only)
- Manual trigger with optional forced deployment

## 🚀 Quick Start

### 1. AWS Setup
Run the setup script to create required AWS resources:
```bash
./scripts/setup-aws-infrastructure.sh
```

### 2. GitHub Secrets
Configure these secrets in your repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 3. Deploy
Push to the `main` branch to trigger automatic deployment:
```bash
git push origin main
```

## 📊 Workflow Status

### Matrix Tests Status
| Test Type | Node 18 | Node 20 | Status |
|-----------|---------|---------|--------|
| Ubuntu    | ✅      | ✅      | Passing |
| Windows   | ✅      | ✅      | Passing |
| macOS     | ✅      | ✅      | Passing |

### Docker Tests
| Component | Status |
|-----------|--------|
| Build     | ✅ Passing |
| Compose   | ✅ Passing |
| Health    | ✅ Passing |

## 🔧 Customization

### Environment Variables
Update these in `build-deploy.yml`:
```yaml
env:
  ECR_REPOSITORY: arabic-recognition-app
  ECS_SERVICE: arabic-recognition-service
  ECS_CLUSTER: arabic-recognition-cluster
  ECS_TASK_DEFINITION: arabic-recognition-task
  AWS_REGION: eu-west-1
```

### Test Matrix
Modify the matrix in `ci-matrix.yml`:
```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

## 📝 Workflow Files

- **`ci-matrix.yml`**: Comprehensive testing with matrix strategies
- **`build-deploy.yml`**: Build Docker images and deploy to AWS

## 🔍 Monitoring

### Build Logs
- View detailed logs in GitHub Actions tab
- Each step provides comprehensive output
- Failed steps highlight specific issues

### Deployment Status
- ECS service status visible in AWS console
- CloudWatch logs for application monitoring
- Health check results in workflow logs

## 🆘 Troubleshooting

### Common Issues

1. **Package Lock Missing**
   - Run `npm install` to generate `package-lock.json`
   - Commit the file to repository

2. **Docker Build Fails**
   - Check Dockerfile syntax
   - Verify all required files are present

3. **AWS Deployment Fails**
   - Verify AWS credentials are correct
   - Check ECS cluster and service exist
   - Ensure IAM permissions are sufficient

4. **Health Check Fails**
   - Container may need more time to start
   - Check application logs in CloudWatch
   - Verify port 3000 is accessible

### Support
- Check `docs/cicd-setup.md` for detailed setup instructions
- Review workflow logs for specific error messages
- Verify AWS infrastructure is properly configured

---

For detailed setup instructions, see [`docs/cicd-setup.md`](../docs/cicd-setup.md).
