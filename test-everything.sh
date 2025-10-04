#!/bin/bash

echo "🧪 Testing Carbon Ledger Application"
echo "===================================="
echo ""

# Check servers
echo "1️⃣ Checking servers..."
API_PID=$(lsof -ti:4000)
WEB_PID=$(lsof -ti:3000)

if [ -n "$API_PID" ]; then
  echo "   ✅ API server running (PID: $API_PID)"
else
  echo "   ❌ API server NOT running"
  echo "      Run: ./start-api.sh"
  exit 1
fi

if [ -n "$WEB_PID" ]; then
  echo "   ✅ Web server running (PID: $WEB_PID)"
else
  echo "   ❌ Web server NOT running"
  echo "      Run: ./start-web.sh"
  exit 1
fi

echo ""
echo "2️⃣ Testing API health..."
HEALTH=$(curl -s http://localhost:4000/health)
if echo "$HEALTH" | grep -q "ok"; then
  echo "   ✅ API health check passed"
else
  echo "   ❌ API health check failed"
  echo "      Response: $HEALTH"
fi

echo ""
echo "3️⃣ Testing web frontend..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$WEB_STATUS" = "200" ]; then
  echo "   ✅ Web frontend responding"
else
  echo "   ❌ Web frontend not responding (HTTP $WEB_STATUS)"
fi

echo ""
echo "4️⃣ Testing Nessie API connection..."
node test-nessie.js 2>&1 | grep -A 3 "SUCCESS" && echo "   ✅ Nessie API connected" || echo "   ❌ Nessie API connection failed"

echo ""
echo "===================================="
echo "🎯 Next Steps:"
echo ""
echo "1. Open browser: http://localhost:3000"
echo "2. Login: demo@carbonledger.com / demo123"
echo "3. Check dashboard for data"
echo "4. Click 'Connect Mock Account' to sync from Nessie"
echo ""
echo "💡 Press F12 in browser to check for errors in Console"

