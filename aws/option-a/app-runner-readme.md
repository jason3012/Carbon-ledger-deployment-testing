# Option A: AWS Amplify + App Runner Deployment

Fast path for deploying Carbon Ledger using managed services.

## Architecture

- **Frontend**: AWS Amplify Hosting (Next.js)
- **Backend API**: AWS App Runner (Express + tRPC)
- **Database**: Amazon RDS PostgreSQL (or Aurora Serverless v2)
- **Secrets**: AWS Secrets Manager
- **Jobs**: EventBridge Scheduler

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- GitHub repository connected

## Step 1: Set up RDS PostgreSQL

```bash
# Create RDS instance (or use Aurora Serverless v2)
aws rds create-db-instance \
  --db-instance-identifier carbon-ledger-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password <YOUR_PASSWORD> \
  --allocated-storage 20 \
  --vpc-security-group-ids <YOUR_SG_ID> \
  --db-subnet-group-name <YOUR_SUBNET_GROUP> \
  --publicly-accessible false

# Get connection string
# Format: postgresql://postgres:<PASSWORD>@<ENDPOINT>:5432/carbon_ledger
```

## Step 2: Store Secrets

```bash
# Create database URL secret
aws secretsmanager create-secret \
  --name carbon-ledger/database-url \
  --secret-string "postgresql://postgres:<PASSWORD>@<RDS_ENDPOINT>:5432/carbon_ledger"

# Create other secrets
aws secretsmanager create-secret \
  --name carbon-ledger/jwt-secret \
  --secret-string "<RANDOM_STRING>"

# (Optional) Nessie API key
aws secretsmanager create-secret \
  --name carbon-ledger/nessie-api-key \
  --secret-string "<YOUR_NESSIE_KEY>"

# (Optional) Climatiq API key
aws secretsmanager create-secret \
  --name carbon-ledger/climatiq-api-key \
  --secret-string "<YOUR_CLIMATIQ_KEY>"
```

## Step 3: Deploy API to App Runner

### Option A: Deploy from ECR

```bash
# Build and push Docker image
cd apps/api
docker build -t carbon-ledger-api:latest ../../ -f Dockerfile

# Tag and push to ECR
aws ecr create-repository --repository-name carbon-ledger-api
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker tag carbon-ledger-api:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/carbon-ledger-api:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/carbon-ledger-api:latest
```

### Create App Runner Service

```bash
# Create service (see apprunner-service.json for configuration)
aws apprunner create-service --cli-input-json file://apprunner-service.json
```

### Option B: Deploy from GitHub

App Runner can build directly from your GitHub repository. Configure in AWS Console.

### Run Migrations

```bash
# Connect to App Runner instance or run locally against RDS
export DATABASE_URL="postgresql://..."
pnpm --filter @carbon-ledger/api prisma migrate deploy
pnpm --filter @carbon-ledger/api tsx apps/api/src/prisma/seeds/seed.ts
```

## Step 4: Deploy Frontend to Amplify

```bash
# Connect GitHub repository in Amplify Console
# Build settings (see amplify-build-settings.md)

# Set environment variables in Amplify:
NEXT_PUBLIC_API_BASE=https://<app-runner-domain>
```

Or via CLI:

```bash
amplify init
amplify add hosting
amplify publish
```

## Step 5: Set up EventBridge Scheduler

```bash
# Create IAM role for EventBridge to invoke App Runner
aws iam create-role \
  --role-name EventBridgeToAppRunner \
  --assume-role-policy-document file://eventbridge-trust-policy.json

# Create schedule for transaction sync (hourly)
aws scheduler create-schedule \
  --name carbon-ledger-sync-transactions \
  --schedule-expression "rate(1 hour)" \
  --flexible-time-window Mode=OFF \
  --target '{
    "Arn": "<APP_RUNNER_SERVICE_ARN>",
    "RoleArn": "<EVENTBRIDGE_ROLE_ARN>",
    "HttpParameters": {
      "PathParameterValues": ["/jobs/sync-transactions"],
      "HeaderParameters": {},
      "QueryStringParameters": {}
    },
    "RetryPolicy": {"MaximumRetryAttempts": 2}
  }'

# Create schedule for monthly recompute (daily at midnight)
aws scheduler create-schedule \
  --name carbon-ledger-recompute-monthly \
  --schedule-expression "cron(0 0 * * ? *)" \
  --flexible-time-window Mode=OFF \
  --target '{...}'
```

## Environment Variables Summary

### App Runner (API)
- `DATABASE_URL` (from Secrets Manager)
- `JWT_SECRET` (from Secrets Manager)
- `NODE_ENV=production`
- `PORT=4000`
- `USE_LOCAL_EMISSION_DATA=true`
- `NESSIE_API_KEY` (optional, from Secrets Manager)
- `CLIMATIQ_API_KEY` (optional, from Secrets Manager)

### Amplify (Frontend)
- `NEXT_PUBLIC_API_BASE=https://<app-runner-url>`
- `NEXTAUTH_URL=https://<amplify-domain>`
- `NEXTAUTH_SECRET` (from Secrets Manager)

## Estimated Monthly Cost

- App Runner: ~$25-50 (depending on traffic)
- Amplify Hosting: ~$15-30
- RDS t3.micro: ~$15-20
- Secrets Manager: ~$2
- EventBridge Scheduler: <$1

**Total: ~$57-103/month**

## Monitoring

- App Runner logs: CloudWatch Logs
- Amplify build logs: Amplify Console
- RDS metrics: CloudWatch

## Troubleshooting

### API Health Check Failing
- Check App Runner logs in CloudWatch
- Verify database connectivity (security groups, VPC)
- Ensure secrets are properly injected

### Frontend Can't Connect to API
- Verify `NEXT_PUBLIC_API_BASE` is set correctly
- Check CORS settings in API
- Verify App Runner URL is accessible

### Database Connection Issues
- Check RDS security group allows App Runner VPC Connector
- Verify connection string in Secrets Manager
- Check VPC DNS resolution

