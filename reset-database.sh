#!/bin/bash

echo "🔄 Resetting database with fresh data..."
echo "========================================"
echo ""

cd /Users/giovanni/divhacks/apps/api

echo "1️⃣ Running database seed..."
pnpm exec dotenv -e ../../.env -- npx tsx src/prisma/seeds/seed.ts

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database reset complete!"
  echo ""
  echo "🔑 Demo credentials:"
  echo "   Email: demo@carbonledger.com"
  echo "   Password: demo123"
  echo ""
  echo "🌐 Next steps:"
  echo "1. Go to http://localhost:3000"
  echo "2. Clear browser data (Ctrl+Shift+Delete or Cmd+Shift+Delete)"
  echo "3. Login with the credentials above"
  echo "4. You should see mock transactions already loaded!"
else
  echo ""
  echo "❌ Database seed failed!"
  exit 1
fi

