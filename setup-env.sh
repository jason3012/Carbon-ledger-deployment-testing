#!/bin/bash

echo "🔧 Setting up your .env file..."

cat > .env << 'EOF'
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public

# Auth
JWT_SECRET=dev-secret-change-in-production

# API Server
PORT=4000

# External APIs
NESSIE_API_BASE=https://api.reimaginebanking.com
NESSIE_API_KEY=9a61128e72966e67649ec43222e120c9

CLIMATIQ_API_BASE=https://api.climatiq.io
CLIMATIQ_API_KEY=

# Feature Toggles
USE_LOCAL_EMISSION_DATA=true

# Frontend
NEXT_PUBLIC_API_BASE=http://localhost:4000
EOF

echo "✅ .env file created!"
echo ""
echo "Your .env file is already in .gitignore - it won't be committed to git! 🔒"
echo ""
echo "Now you can run simplified commands:"
echo "  cd apps/api && pnpm dev"
echo "  cd apps/web && pnpm dev"

