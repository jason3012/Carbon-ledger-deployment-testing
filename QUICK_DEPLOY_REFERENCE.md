# ⚡ Quick Deploy Reference Card

**30-minute deployment cheat sheet**

---

## 🚂 **Railway (Backend API)**

### Setup Commands
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run pnpm --filter @carbon-ledger/api prisma migrate deploy
railway run pnpm --filter @carbon-ledger/api tsx apps/api/src/prisma/seeds/seed.ts
```

### Environment Variables
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate with: openssl rand -base64 32>
NESSIE_API_KEY=9a61128e72966e67649ec43222e120c9
NESSIE_API_BASE=http://api.nessieisreal.com
CLIMATIQ_API_BASE=https://api.climatiq.io
USE_LOCAL_EMISSION_DATA=true
ECHO_API_KEY=echo_b04f7559c995410688faf2bae7e40391dccf729c2affe2d3391332a6b66fa2e4
ECHO_APP_ID=c4cb4416-3196-4266-8865-27a67c05b9b1
ENABLE_AI_FEATURES=true
NODE_ENV=production
PORT=4000
```

### Build Settings
- **Root Directory**: `apps/api`
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @carbon-ledger/db prisma generate && pnpm --filter @carbon-ledger/api build`
- **Start Command**: `cd ../.. && pnpm --filter @carbon-ledger/api start`

---

## ▲ **Vercel (Frontend)**

### Environment Variables
```bash
NEXT_PUBLIC_API_BASE=https://your-railway-url.up.railway.app
```
⚠️ **Replace with your actual Railway API URL!**

### Build Settings
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @carbon-ledger/web build`
- **Framework**: Next.js
- ✅ **Include source files outside Root Directory**: ON

---

## 🧪 **Testing Checklist**

```bash
# 1. Test API health
curl https://your-railway-url.up.railway.app/health

# 2. Test frontend
open https://your-vercel-url.vercel.app

# 3. In browser:
# - Sign up (test@example.com / password123)
# - Login
# - Settings → Sync Accounts from Nessie
# - Transactions → See 20 transactions with CO2e
# - Actions → Generate Recommendations (AI)
# - Dashboard → View charts
```

---

## 🐛 **Quick Fixes**

### "pnpm not found" on Railway
Add to build command: `npm install -g pnpm && ...`

### "Failed to fetch" on frontend
Check `NEXT_PUBLIC_API_BASE` → Must be Railway API URL

### "Database connection error"
Run migrations: `railway run pnpm --filter @carbon-ledger/api prisma migrate deploy`

### "500 Internal Server Error"
Check Railway logs: Dashboard → API service → Logs tab

---

## 📱 **Important URLs**

- **GitHub Repo**: https://github.com/giovannivitale4722/Carbon-Ledger
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Railway API URL**: _________________ (fill this in!)
- **Your Vercel Frontend URL**: _________________ (fill this in!)

---

## 💰 **Cost**

- Railway: $5/month (Hobby)
- Vercel: $0/month (Free tier)
- **Total: $5/month**

---

## 📚 **Full Guides**

- **Complete Walkthrough**: `RAILWAY_VERCEL_WALKTHROUGH.md` (this directory)
- **All Deployment Options**: `DEPLOYMENT_OPTIONS.md`
- **Vercel Details**: `VERCEL_DEPLOYMENT.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

---

**Ready to deploy? Start with `RAILWAY_VERCEL_WALKTHROUGH.md`** →

