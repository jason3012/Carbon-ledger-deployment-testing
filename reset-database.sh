#!/bin/bash

echo "🗄️  Setting up Carbon Ledger Database"
echo "====================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/apps/api"

echo "1️⃣ Creating database if needed..."
createdb carbon_ledger 2>/dev/null || echo "Database already exists"

echo "2️⃣ Setting up database schema..."
pnpm exec dotenv -e ../../.env -- npx prisma db push

echo "3️⃣ Running database seed..."
pnpm exec dotenv -e ../../.env -- npx tsx src/prisma/seeds/seed.ts

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database setup complete!"
  echo ""
  echo "🔑 Demo credentials:"
  echo "   Email: demo@carbonledger.com"
  echo "   Password: demo123"
  echo ""
  echo "🌐 Next steps:"
  echo "1. Run: pnpm dev"
  echo "2. Go to http://localhost:3000"
  echo "3. Login with the credentials above"
  echo "4. Go to Settings → Sync Accounts from Nessie"
else
  echo ""
  echo "❌ Database setup failed!"
  exit 1
fi

