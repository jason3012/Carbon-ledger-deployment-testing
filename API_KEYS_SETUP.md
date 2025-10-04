# 🔑 API Keys Setup Guide

This guide will help you get API keys for Carbon Ledger's external integrations.

## Current Status

Your app works **without API keys** using:
- ✅ **Mock Nessie data** - 20 realistic demo transactions
- ✅ **Local emission factors** - 18 scientifically-backed CO2e factors from EPA, DEFRA, and EIOMLCA

**You only need API keys if you want:**
- Real Capital One/Nessie bank transaction data
- Climatiq's extensive emission factor database

---

## 🏦 Option 1: Nessie API (Capital One Banking Data)

### What is Nessie?
Nessie is Capital One's API for simulating bank transactions and accounts. Perfect for hackathons and demos!

### Getting Your Nessie API Key

1. **Visit Capital One DevExchange**
   - Go to: https://developer.capitalone.com/
   - Click "Sign In" or "Get Started"

2. **Create an Account**
   - Sign up with your email
   - Verify your email address

3. **Get Your API Key**
   - Navigate to the "Nessie" section
   - Click "Get API Key" or "Create Application"
   - Copy your API key (looks like: `abc123def456...`)

4. **Add to Your .env File**
   ```bash
   cd /Users/giovanni/divhacks
   
   # Edit .env and add:
   NESSIE_API_KEY=your_actual_key_here
   ```

5. **Test It**
   - Restart your API server
   - Go to Settings → Connect Account
   - The app will now fetch real Nessie data!

### Nessie Features
- ✅ Simulate bank accounts (checking, savings, credit cards)
- ✅ Create mock transactions
- ✅ Test different spending patterns
- ✅ Perfect for demos and hackathons
- ✅ **FREE for developers**

### Resources
- Documentation: https://developer.capitalone.com/docs/nessie-api/
- API Explorer: https://developer.capitalone.com/platform-documentation/
- Sample Data: Built into Nessie automatically

---

## 🌍 Option 2: Climatiq API (Enhanced Emission Factors)

### What is Climatiq?
Climatiq provides a comprehensive database of emission factors from scientific sources worldwide. It offers more granular and up-to-date carbon data than local factors.

### Getting Your Climatiq API Key

1. **Visit Climatiq**
   - Go to: https://www.climatiq.io/
   - Click "Get Started" or "Sign Up"

2. **Create a Free Account**
   - Sign up with your email
   - Choose the **Free Tier** (includes 1,000 API calls/month)

3. **Get Your API Key**
   - Go to Dashboard after login
   - Navigate to "API Keys" section
   - Click "Create API Key"
   - Give it a name (e.g., "Carbon Ledger")
   - Copy the key (looks like: `xyz789abc456...`)

4. **Add to Your .env File**
   ```bash
   cd /Users/giovanni/divhacks
   
   # Edit .env and add:
   CLIMATIQ_API_KEY=your_actual_key_here
   USE_LOCAL_EMISSION_DATA=false
   ```

5. **Test It**
   - Restart your API server
   - Sync transactions (Settings → Sync)
   - The app will now use Climatiq's emission factors!

### Climatiq Benefits
- ✅ 100,000+ emission factors
- ✅ Regularly updated scientific data
- ✅ Country-specific factors
- ✅ Industry-specific calculations
- ✅ 1,000 free API calls/month
- ✅ More accurate than local estimates

### Free Tier Limits
- 1,000 API requests per month
- Access to full emission factor database
- Perfect for development and demos

### Resources
- Documentation: https://www.climatiq.io/docs
- API Reference: https://www.climatiq.io/docs/api-reference
- Emission Factors: https://www.climatiq.io/data

---

## 📝 Updating Your .env File

### Current .env Template
```bash
# Shared
NODE_ENV=development

# Database
DATABASE_URL=postgresql://giovanni@localhost:5432/carbon_ledger?schema=public

# Auth
JWT_SECRET=dev-secret-change-in-production

# External APIs
NESSIE_API_BASE=https://api.reimaginebanking.com
NESSIE_API_KEY=                    # <-- ADD YOUR KEY HERE

CLIMATIQ_API_BASE=https://api.climatiq.io
CLIMATIQ_API_KEY=                  # <-- ADD YOUR KEY HERE

# Feature Toggles
USE_LOCAL_EMISSION_DATA=true       # Set to 'false' to use Climatiq

# Frontend
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

### How to Edit
```bash
# Open in your favorite editor
nano .env
# or
code .env
# or
vim .env
```

### After Adding Keys
```bash
# Restart your API server for changes to take effect
# Kill the current API process (Ctrl+C) then:

cd /Users/giovanni/divhacks/apps/api
DATABASE_URL="postgresql://giovanni@localhost:5432/carbon_ledger?schema=public" \
PORT=4000 \
JWT_SECRET="dev-secret" \
USE_LOCAL_EMISSION_DATA=false \
NESSIE_API_KEY="your_key" \
CLIMATIQ_API_KEY="your_key" \
npx tsx src/index.ts
```

---

## 🔒 Security Best Practices

### ✅ Your .gitignore is Already Set Up!
The `.env` file is already in your `.gitignore`, so your keys are safe from being committed to git.

### Additional Tips

1. **Never commit API keys**
   - ✅ Already protected by `.gitignore`
   - Always use `.env` for secrets

2. **Use different keys for production**
   - Development: Test keys
   - Production: Production keys with monitoring

3. **Rotate keys regularly**
   - Change keys every few months
   - Immediately if compromised

4. **Use environment-specific files**
   - `.env` - Local development (gitignored)
   - `.env.example` - Template (committed to git)
   - Production - Use AWS Secrets Manager

5. **Monitor API usage**
   - Check Nessie dashboard
   - Check Climatiq dashboard
   - Set up usage alerts

---

## 🧪 Testing Your API Keys

### Test Nessie Connection
```bash
# Using curl
curl -X GET "https://api.reimaginebanking.com/accounts?key=YOUR_KEY"

# Should return JSON with account data
```

### Test Climatiq Connection
```bash
# Using curl
curl -X GET "https://api.climatiq.io/data/v1/emission-factors" \
  -H "Authorization: Bearer YOUR_KEY"

# Should return emission factors
```

### Test in Carbon Ledger

1. **Start the app** with your new keys
2. **Go to Settings** → Connect Account
3. **Click "Connect Mock Account"** (uses Nessie with your key if provided)
4. **Go to Transactions** → Click "Sync Transactions"
5. **Check the emissions** - If using Climatiq, you'll see more detailed factors

---

## 🆘 Troubleshooting

### "Invalid API Key" Error

**Nessie:**
- Double-check your key from Capital One DevExchange
- Make sure there are no extra spaces
- Try regenerating the key

**Climatiq:**
- Verify you copied the full key
- Check if you exceeded free tier limits
- Ensure the key is active in dashboard

### "Rate Limit Exceeded"

**Solution:**
- Wait for your quota to reset (monthly for Climatiq)
- Switch back to local emission data temporarily:
  ```bash
  USE_LOCAL_EMISSION_DATA=true
  ```
- Consider upgrading your plan for production

### Keys Not Working

1. Check `.env` file syntax (no quotes around values)
2. Restart API server after adding keys
3. Check for typos in key names
4. Verify keys are active in respective dashboards

---

## 💡 Cost Comparison

### Free Tier (Current Setup)
- ✅ **Cost:** $0
- ✅ **Nessie:** Mock data (unlimited)
- ✅ **Emission Factors:** Local EPA/DEFRA data
- ✅ **Perfect for:** Development, demos, hackathons

### With Free API Keys
- ✅ **Cost:** $0
- ✅ **Nessie:** Capital One sandbox (unlimited)
- ✅ **Climatiq:** 1,000 calls/month
- ✅ **Perfect for:** Enhanced demos, testing

### Production (Future)
- 💰 **Nessie:** Partner with Capital One
- 💰 **Climatiq:** Starts at $99/month (10,000 calls)
- 💰 **Alternative:** Continue using local factors (free)

---

## 📚 Additional Resources

### Capital One / Nessie
- Main site: https://developer.capitalone.com/
- Documentation: https://developer.capitalone.com/docs/nessie-api/
- GitHub: https://github.com/capitalone/nessie

### Climatiq
- Main site: https://www.climatiq.io/
- Documentation: https://www.climatiq.io/docs
- Blog: https://www.climatiq.io/blog
- Data Explorer: https://www.climatiq.io/data

### Carbon Emissions Resources
- EPA Emission Factors: https://www.epa.gov/climateleadership/ghg-emission-factors-hub
- DEFRA Guidelines: https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023
- IPCC Guidelines: https://www.ipcc.ch/

---

## ✅ Quick Checklist

- [x] `.gitignore` includes `.env` (already done!)
- [ ] Sign up for Nessie API (optional)
- [ ] Get Nessie API key (optional)
- [ ] Sign up for Climatiq (optional)
- [ ] Get Climatiq API key (optional)
- [ ] Add keys to `.env` file
- [ ] Restart API server
- [ ] Test with real data
- [ ] Monitor usage limits

---

**Remember:** Your app works great without API keys! They're only needed for:
- ✨ Real Capital One transaction data (Nessie)
- ✨ Enhanced emission calculations (Climatiq)

For demos and development, the **mock data and local factors are perfect**! 🚀

