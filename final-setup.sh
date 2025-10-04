#!/bin/bash

echo "🔧 Final Setup - Using Nessie API"
echo "=================================="
echo ""

# Update .env
ENV_FILE="/Users/giovanni/divhacks/.env"
if [ -f "$ENV_FILE" ]; then
  if grep -q "NESSIE_API_BASE=" "$ENV_FILE"; then
    sed -i '' 's|NESSIE_API_BASE=.*|NESSIE_API_BASE=http://api.nessieisreal.com|' "$ENV_FILE"
    echo "✅ Updated NESSIE_API_BASE in .env"
  else
    echo "NESSIE_API_BASE=http://api.nessieisreal.com" >> "$ENV_FILE"
    echo "✅ Added NESSIE_API_BASE to .env"
  fi
fi

echo ""
echo "🔄 Restarting API server..."

# Kill and restart API
lsof -ti:4000 | xargs kill -9 2>/dev/null
sleep 2

cd /Users/giovanni/divhacks
./start-api.sh > /tmp/api.log 2>&1 &

sleep 5

if lsof -ti:4000 > /dev/null; then
  echo "✅ API restarted successfully"
else
  echo "❌ API failed to start"
  cat /tmp/api.log
  exit 1
fi

echo ""
echo "=================================="
echo "✅ SETUP COMPLETE!"
echo "=================================="
echo ""
echo "🎯 NOW DO THIS:"
echo ""
echo "1. Go to: http://localhost:3000"
echo ""
echo "2. If you're logged out, login:"
echo "   Email: demo@carbonledger.com"
echo "   Password: demo123"
echo ""
echo "3. Go to: Settings (left sidebar)"
echo ""
echo "4. Click: 'Sync Accounts from Nessie'"
echo ""
echo "5. You should see:"
echo "   ✅ Successfully synced accounts!"
echo ""
echo "6. Go to: Dashboard"
echo ""
echo "7. You'll see:"
echo "   📊 1 account: My Checking Account ($5,000)"
echo "   📊 From Nessie API customer: John Doe"
echo ""
echo "💡 ALL DATA FROM NESSIE API - NO MOCK DATA!"
echo ""

