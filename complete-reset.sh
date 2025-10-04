#!/bin/bash

echo "🔄 COMPLETE RESET"
echo "================="
echo ""

# Stop all servers
echo "1️⃣ Stopping servers..."
lsof -ti:4000 | xargs kill -9 2>/dev/null && echo "   ✅ Stopped API (4000)"
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   ✅ Stopped Web (3000)"

sleep 2

# Reset database
echo ""
echo "2️⃣ Resetting database..."
cd /Users/giovanni/divhacks/apps/api
pnpm exec dotenv -e ../../.env -- npx tsx src/prisma/seeds/seed.ts

if [ $? -ne 0 ]; then
  echo "❌ Database seed failed!"
  exit 1
fi

# Start API
echo ""
echo "3️⃣ Starting API server..."
cd /Users/giovanni/divhacks
./start-api.sh > /tmp/api.log 2>&1 &

sleep 5

# Check if API is running
if lsof -ti:4000 > /dev/null; then
  echo "   ✅ API started successfully"
else
  echo "   ❌ API failed to start"
  cat /tmp/api.log
  exit 1
fi

# Start Web
echo ""
echo "4️⃣ Starting Web server..."
./start-web.sh > /tmp/web.log 2>&1 &

sleep 8

# Check if Web is running
if lsof -ti:3000 > /dev/null; then
  echo "   ✅ Web started successfully"
else
  echo "   ❌ Web failed to start"
  cat /tmp/web.log
  exit 1
fi

echo ""
echo "================="
echo "✅ COMPLETE RESET DONE!"
echo "================="
echo ""
echo "🌐 IMPORTANT - Do this in your browser:"
echo ""
echo "1. Close ALL browser tabs/windows"
echo "2. Open a NEW browser window (or incognito/private mode)"
echo "3. Go to: http://localhost:3000"
echo "4. Login:"
echo "   Email: demo@carbonledger.com"
echo "   Password: demo123"
echo ""
echo "📊 You should see:"
echo "   - Dashboard with data"
echo "   - 1 account already loaded"
echo "   - 20 transactions with carbon emissions"
echo ""

