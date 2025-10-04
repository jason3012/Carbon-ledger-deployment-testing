# Option B: ECS/Fargate + Copilot Deployment

Production-ready deployment using AWS ECS on Fargate with AWS Copilot CLI.

## Architecture

- **Frontend**: ECS Fargate (Next.js) behind ALB
- **Backend API**: ECS Fargate (Express + tRPC) behind ALB
- **Database**: Amazon RDS PostgreSQL
- **Load Balancer**: Application Load Balancer (ALB)
- **Container Registry**: Amazon ECR
- **Secrets**: AWS Secrets Manager
- **Jobs**: EventBridge Scheduler → ECS Tasks

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Docker installed
- AWS Copilot CLI installed: `brew install aws/tap/copilot-cli`

## Step 1: Initialize Copilot Application

```bash
cd /path/to/carbon-ledger

# Initialize Copilot application
copilot app init carbon-ledger

# Create environment (dev, staging, prod)
copilot env init --name prod --profile default --default-config

# Deploy environment infrastructure (VPC, ALB, etc.)
copilot env deploy --name prod
```

## Step 2: Create RDS Database

```bash
# Option A: Manual RDS creation
aws rds create-db-instance \
  --db-instance-identifier carbon-ledger-db-prod \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password <YOUR_PASSWORD> \
  --allocated-storage 20 \
  --vpc-security-group-ids <COPILOT_ENV_SG> \
  --db-subnet-group-name <COPILOT_ENV_SUBNET_GROUP>

# Option B: Use Copilot addons (recommended)
# Create addons/rds-postgres.yml in your service directory
copilot storage init
```

## Step 3: Store Secrets

```bash
# Store database URL
copilot secret init --name DATABASE_URL --overwrite
# Paste: postgresql://postgres:<PASSWORD>@<RDS_ENDPOINT>:5432/carbon_ledger

# Store JWT secret
copilot secret init --name JWT_SECRET --overwrite
# Paste: <random-string>

# Store NextAuth secret
copilot secret init --name NEXTAUTH_SECRET --overwrite
```

## Step 4: Deploy API Service

```bash
# Initialize API service
copilot svc init \
  --name api \
  --svc-type "Load Balanced Web Service" \
  --dockerfile apps/api/Dockerfile

# Deploy API service
copilot svc deploy --name api --env prod

# Run database migrations
copilot svc exec --name api --env prod --command bash
# Inside container:
pnpm --filter @carbon-ledger/api prisma migrate deploy
pnpm --filter @carbon-ledger/api tsx apps/api/src/prisma/seeds/seed.ts
```

## Step 5: Deploy Web Service

```bash
# Initialize web service
copilot svc init \
  --name web \
  --svc-type "Load Balanced Web Service" \
  --dockerfile apps/web/Dockerfile

# Update manifest with API URL
# Edit copilot/web/manifest.yml and set NEXT_PUBLIC_API_BASE

# Deploy web service
copilot svc deploy --name web --env prod
```

## Step 6: Configure ALB Path Routing

By default, Copilot creates separate ALBs. To use a single ALB with path routing:

```yaml
# In copilot/web/manifest.yml
http:
  path: '/'
  alias: carbon-ledger.example.com

# In copilot/api/manifest.yml
http:
  path: '/api/*'
  alias: carbon-ledger.example.com
```

## Step 7: Set up Scheduled Jobs

```bash
# Create IAM role for EventBridge to run ECS tasks
aws iam create-role \
  --role-name EventBridgeToECS \
  --assume-role-policy-document file://eventbridge-ecs-trust-policy.json

# Create schedule for transaction sync
aws scheduler create-schedule \
  --name carbon-ledger-sync-transactions \
  --schedule-expression "rate(1 hour)" \
  --flexible-time-window Mode=OFF \
  --target '{
    "Arn": "arn:aws:ecs:region:account:cluster/carbon-ledger-prod-Cluster",
    "RoleArn": "<EVENTBRIDGE_ROLE_ARN>",
    "EcsParameters": {
      "TaskDefinitionArn": "<API_TASK_DEF_ARN>",
      "LaunchType": "FARGATE",
      "NetworkConfiguration": {
        "awsvpcConfiguration": {
          "Subnets": ["subnet-xxx"],
          "SecurityGroups": ["sg-xxx"],
          "AssignPublicIp": "DISABLED"
        }
      }
    },
    "Input": "{\"containerOverrides\":[{\"name\":\"api\",\"command\":[\"/bin/sh\",\"-c\",\"curl -X POST http://localhost:4000/jobs/sync-transactions\"]}]}"
  }'
```

## Copilot Commands Reference

```bash
# List applications
copilot app ls

# List services
copilot svc ls

# Show service status
copilot svc status --name api --env prod

# View logs
copilot svc logs --name api --env prod --follow

# Execute command in running task
copilot svc exec --name api --env prod

# Update service
copilot svc deploy --name api --env prod

# Delete service
copilot svc delete --name api --env prod

# Delete environment
copilot env delete --name prod

# Delete application
copilot app delete
```

## CI/CD with GitHub Actions

See `github-actions/api-deploy.yml` and `github-actions/web-deploy.yml` for automated deployments.

## Monitoring & Logging

- **Logs**: CloudWatch Logs (auto-configured by Copilot)
- **Metrics**: CloudWatch Container Insights
- **Tracing**: AWS X-Ray (optional, enable in manifest)

```bash
# View logs
copilot svc logs --name api --follow

# Show service status and metrics
copilot svc show --name api --env prod
```

## Estimated Monthly Cost

- ECS Fargate (2 tasks, 0.25 vCPU, 0.5 GB): ~$15-25
- Application Load Balancer: ~$20-25
- RDS t3.micro: ~$15-20
- ECR: ~$1
- Secrets Manager: ~$2
- Data Transfer: ~$5-10

**Total: ~$58-83/month**

## Troubleshooting

### Service won't start
```bash
copilot svc logs --name api --env prod
# Check for missing environment variables or database connection issues
```

### Database connection timeout
- Verify RDS security group allows traffic from ECS tasks
- Check VPC and subnet configuration

### Cannot access service via ALB
- Verify health checks are passing
- Check security group rules
- Ensure target registration is complete

### Migrations fail
```bash
# Run migrations manually
copilot svc exec --name api --env prod
# Then run: pnpm --filter @carbon-ledger/api prisma migrate deploy
```

