# Amplify Build Settings

## amplify.yml

Place this file in your repository root or configure in Amplify Console:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - corepack enable
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm --filter @carbon-ledger/web build
  artifacts:
    baseDirectory: apps/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - apps/web/.next/cache/**/*
```

## Environment Variables (Amplify Console)

Set these in: Amplify Console → App Settings → Environment Variables

```
NEXT_PUBLIC_API_BASE=https://<your-app-runner-url>
NEXTAUTH_URL=https://<your-amplify-domain>
NEXTAUTH_SECRET=<your-secret>
```

## Build Image Settings

- **Build image**: Amazon Linux:2023
- **Node version**: 20.x (set in package.json engines)

## Advanced Settings

- Enable automatic builds from main/master branch
- Add branch-specific environment variables if needed
- Set up custom domain (optional)

## Custom Domain Setup

1. Go to Domain Management in Amplify Console
2. Add your domain
3. Follow DNS verification steps
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting

### Build Fails with "pnpm not found"
- Ensure `corepack enable` is in preBuild commands
- Verify Node version is 20.x

### Environment Variables Not Working
- Check that `NEXT_PUBLIC_*` prefix is used for client-side vars
- Rebuild app after adding new environment variables

### Slow Builds
- Verify cache paths are configured
- Consider using a custom Docker image with pre-installed dependencies

