# 🎯 Real Data Setup Guide

Your Carbon Ledger is now configured to use **REAL DATA ONLY** - no mocks!

## ✅ Changes Made

1. **✅ Mock data disabled** - App will only use real Nessie API
2. **✅ Manual transaction input added** - You can input your own transactions
3. **✅ Seed file updated** - No mock transactions created

## 🔧 Step 1: Set Up Your .env File

```bash
cd /Users/giovanni/divhacks

# Create/edit .env file
cat > .env << 'EOF'
NODE_ENV=development
DATABASE_URL=postgresql://giovanni@localhost:5432/carbon_ledger?schema=public
JWT_SECRET=dev-secret-change-in-production

# YOUR REAL NESSIE API KEY
NESSIE_API_KEY=e27a283d73c84346b049f3a5541616f5
NESSIE_API_BASE=https://api.reimaginebanking.com

# CLIMATIQ API KEY (if you have one)
CLIMATIQ_API_KEY=
CLIMATIQ_API_BASE=https://api.climatiq.io
USE_LOCAL_EMISSION_DATA=true

# Frontend
NEXT_PUBLIC_API_BASE=http://localhost:4000
EOF
```

## 🗄️ Step 2: Reset Database (Clean Start)

```bash
cd /Users/giovanni/divhacks

# Drop and recreate database
dropdb carbon_ledger
createdb carbon_ledger

# Push schema
cd apps/api
DATABASE_URL="postgresql://giovanni@localhost:5432/carbon_ledger?schema=public" \
  npx prisma db push --schema=./src/prisma/schema.prisma

# Generate Prisma Client
DATABASE_URL="postgresql://giovanni@localhost:5432/carbon_ledger?schema=public" \
  npx prisma generate --schema=./src/prisma/schema.prisma

# Seed with emission factors only (no mock transactions)
cd /Users/giovanni/divhacks
DATABASE_URL="postgresql://giovanni@localhost:5432/carbon_ledger?schema=public" \
  npx tsx apps/api/src/prisma/seeds/seed.ts
```

## 🚀 Step 3: Start Your Servers

### Terminal 1: API Server
```bash
cd /Users/giovanni/divhacks/apps/api

DATABASE_URL="postgresql://giovanni@localhost:5432/carbon_ledger?schema=public" \
PORT=4000 \
JWT_SECRET="dev-secret" \
USE_LOCAL_EMISSION_DATA=true \
NESSIE_API_KEY="e27a283d73c84346b049f3a5541616f5" \
NESSIE_API_BASE="https://api.reimaginebanking.com" \
npx tsx src/index.ts
```

### Terminal 2: Web Frontend
```bash
cd /Users/giovanni/divhacks/apps/web
NEXT_PUBLIC_API_BASE=http://localhost:4000 pnpm dev
```

## 📊 Step 4: Adding Data (3 Options)

### Option A: Connect Real Nessie Account

1. Open http://localhost:3000
2. Login with `demo@carbonledger.com` / `demo123`
3. Go to **Settings** → Click "Connect Mock Account"
   - This will now use your REAL Nessie API key
   - It will fetch accounts from YOUR Nessie sandbox
4. Go to **Transactions** → Click "Sync Transactions"
   - Fetches real purchases from Nessie

### Option B: Manually Input Transactions

You can now manually add transactions via API:

```bash
# Example: Add a gas station purchase
curl -X POST http://localhost:4000/trpc/transactions.createManual \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountId": "YOUR_ACCOUNT_ID",
    "merchantName": "Shell Gas Station",
    "amount": 45.50,
    "description": "Shell Gas Station - 12.5 gallons",
    "date": "2024-10-04",
    "mcc": "5541"
  }'
```

### Option C: Create Transactions in Nessie First

1. Go to Nessie API documentation
2. Use their API to create customers, accounts, and purchases
3. Then sync them into Carbon Ledger

## 🧪 Testing Your Real Nessie Connection

```bash
# Test if your key works
curl "https://api.reimaginebanking.com/accounts?key=e27a283d73c84346b049f3a5541616f5"

# If you see JSON data with accounts, it's working!
# If you get an error, the Nessie API might be down or your key might need regeneration
```

## 📝 Creating Sample Data in Nessie

If Nessie API is accessible, you can create test data:

```bash
# 1. Create a customer
curl -X POST "https://api.reimaginebanking.com/customers?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "address": {
      "street_number": "123",
      "street_name": "Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102"
    }
  }'

# 2. Create an account for that customer
curl -X POST "https://api.reimaginebanking.com/customers/CUSTOMER_ID/accounts?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Credit Card",
    "nickname": "My Card",
    "rewards": 0,
    "balance": 1000
  }'

# 3. Create purchases
curl -X POST "https://api.reimaginebanking.com/accounts/ACCOUNT_ID/purchases?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "Shell",
    "medium": "balance",
    "purchase_date": "2024-10-04",
    "amount": 45.50,
    "description": "Shell Gas Station - 12.5 gal"
  }'
```

## 🎯 MCC Codes for Manual Input

Use these MCC codes to ensure proper categorization:

| Category | MCC Code | Example |
|----------|----------|---------|
| Gas/Fuel | 5541 | Shell, Chevron |
| Grocery | 5411 | Whole Foods, Safeway |
| Restaurants | 5812 | McDonald's, Chipotle |
| Electricity | 4900 | PG&E, utility bills |
| Public Transit | 4111 | BART, Metro |
| Airlines | 3000 | Delta, United |
| Apparel | 5651 | Zara, H&M |
| Electronics | 5732 | Best Buy, Apple Store |

## 📈 Example: Full Workflow

```bash
# 1. Start servers (see Step 3)

# 2. Open browser → http://localhost:3000

# 3. Login with demo@carbonledger.com / demo123

# 4. Go to Settings → "Connect Mock Account"
#    - If Nessie API works, it will fetch your real data
#    - If not, you'll see an error

# 5. Go to Transactions → "Sync Transactions"
#    - Fetches purchases from Nessie

# 6. View Dashboard
#    - See real CO2e calculations
#    - No mock data!
```

## ⚠️ Important Notes

### If Nessie API is Down/Unreachable

The Nessie API (`api.reimaginebanking.com`) may be:
- Temporarily unavailable
- Deprecated or moved
- Behind a firewall

**If this happens:**
1. **Focus on manual transaction input** (Option B above)
2. Create a simple UI for adding transactions
3. Tell your audience: "Demonstrates manual transaction tracking with real emission calculations"

### Network Issues

If you get "Could not resolve host" errors:
```bash
# Try with full URL
curl -v "https://api.reimaginebanking.com/accounts?key=e27a283d73c84346b049f3a5541616f5"

# Check DNS
nslookup api.reimaginebanking.com

# Try ping
ping api.reimaginebanking.com
```

## 🎨 Building a Manual Input UI

I can help you add a simple form in the frontend to manually input transactions. This would give you full control over your data without depending on Nessie.

Would you like me to create a transaction input form page?

## 🔐 Security Reminder

- ✅ Your `.gitignore` already protects `.env` files
- ✅ Never commit API keys
- ✅ Regenerate keys after public exposure (our chat)
- ✅ Use different keys for production

## 📞 Next Steps

1. ✅ **Set up .env** with your keys (done above)
2. ✅ **Reset database** for clean start
3. ✅ **Start servers**
4. 🔄 **Test Nessie connection** (may or may not work)
5. 🎯 **Add data** via Nessie or manual input

---

**Your app is now 100% real-data ready!** No more mock transactions. 🚀

Let me know if you need help with:
- Creating a manual transaction input UI
- Troubleshooting Nessie API
- Adding Climatiq API
- Anything else!

