#!/bin/bash

echo "🚀 Setting up Carbon Ledger with NESSIE API ONLY"
echo "================================================="
echo ""

# Step 1: Reset database (no mock data)
echo "1️⃣ Resetting database (no mock data)..."
cd /Users/giovanni/divhacks/apps/api
pnpm exec dotenv -e ../../.env -- npx tsx src/prisma/seeds/seed.ts

if [ $? -ne 0 ]; then
  echo "❌ Database reset failed!"
  exit 1
fi

echo ""
echo "2️⃣ Adding sample purchases to Nessie..."
cd /Users/giovanni/divhacks
node add-nessie-purchases.js

echo ""
echo "3️⃣ Restarting servers..."

# Kill existing servers
lsof -ti:4000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

sleep 2

# Start API
echo "   Starting API..."
./start-api.sh > /tmp/api.log 2>&1 &
sleep 5

# Start Web
echo "   Starting Web..."
./start-web.sh > /tmp/web.log 2>&1 &
sleep 8

# Check servers
if lsof -ti:4000 > /dev/null && lsof -ti:3000 > /dev/null; then
  echo "   ✅ Both servers running"
else
  echo "   ❌ Server startup failed"
  exit 1
fi

echo ""
echo "================================================="
echo "✅ SETUP COMPLETE!"
echo "================================================="
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. CLOSE ALL BROWSER TABS for localhost:3000"
echo ""
echo "2. Open NEW browser tab: http://localhost:3000"
echo ""
echo "3. Login:"
echo "   Email: demo@carbonledger.com"
echo "   Password: demo123"
echo ""
echo "4. Go to: Settings (left sidebar)"
echo ""
echo "5. Click: 'Sync Accounts from Nessie'"
echo ""
echo "6. Wait for success message"
echo ""
echo "7. Go to: Dashboard"
echo ""
echo "8. You should see:"
echo "   - 1 account from Nessie (John Doe's Checking Account)"
echo "   - 10 transactions from Nessie API"
echo "   - Carbon emissions calculated for each"
echo "   - Charts showing your footprint"
echo ""
echo "💡 ALL DATA IS FROM NESSIE API - NO MOCK DATA!"
echo ""

