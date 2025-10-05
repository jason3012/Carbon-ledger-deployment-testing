# 🚀 Vercel Deployment Guide

## ⚠️ Important Considerations

**This application is NOT fully ready for Vercel deployment** due to its architecture. Here's why and what you need to know:

### Current Architecture Issues

1. **Separate Backend API**: The Express.js API (`apps/api`) runs as a standalone server
   - Vercel is optimized for Next.js serverless functions
   - Express servers need to run continuously (not serverless-friendly)
   - Scheduled jobs (cron) won't work on Vercel

2. **PostgreSQL Database**: Requires persistent database connection
   - Vercel works best with serverless databases (Vercel Postgres, Neon, PlanetScale)
   - Traditional PostgreSQL connections can exhaust connection pools in serverless

3. **AI Features**: Echo Merit Systems SDK needs persistent connections
   - May hit cold start issues with serverless functions

## ✅ Recommended Deployment Options

### Option 1: Hybrid Deployment (Recommended)

**Frontend on Vercel + Backend Elsewhere**

- ✅ **Frontend**: Deploy Next.js app to Vercel
- ✅ **Backend**: Deploy Express API to:
  - Railway (easiest, $5/mo)
  - Render (free tier available)
  - AWS App Runner (production-grade)
  - Digital Ocean App Platform
- ✅ **Database**: Use managed PostgreSQL:
  - Railway ($5/mo, included with API)
  - Neon (serverless PostgreSQL, free tier)
  - Supabase (PostgreSQL + free tier)

### Option 2: Refactor for Vercel (Requires Work)

Convert Express API to Next.js API routes:
- Move tRPC routers to `/apps/web/src/app/api/trpc/[trpc]/route.ts`
- Convert cron jobs to Vercel Cron
- Use Vercel Postgres or Neon for database
- Use Prisma with connection pooling (Prisma Accelerate)

**Estimated effort**: 4-8 hours of refactoring

### Option 3: Full AWS/ECS Deployment (Production)

Use existing AWS configurations in `/aws/` folder:
- Complete control and scalability
- Costs more but production-ready
- See `aws/option-a/` or `aws/option-b/` folders

## 🎯 Quick Deploy Guide (Option 1 - Hybrid)

### Step 1: Deploy Backend to Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project** → "Deploy from GitHub repo"

3. **Add PostgreSQL database**:
   ```
   Railway Dashboard → New → Database → PostgreSQL
   ```

4. **Configure API service**:
   - Root Directory: `apps/api`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @carbon-ledger/api build`
   - Start Command: `cd ../.. && pnpm --filter @carbon-ledger/api start`
   - Add PORT environment variable: `4000`

5. **Set Environment Variables** (in Railway dashboard):
   ```bash
   DATABASE_URL=<from Railway PostgreSQL>
   JWT_SECRET=<random-string-32-chars>
   NESSIE_API_KEY=<your-key>
   NESSIE_API_BASE=http://api.nessieisreal.com
   CLIMATIQ_API_KEY=<your-key-if-you-have-one>
   CLIMATIQ_API_BASE=https://api.climatiq.io
   USE_LOCAL_EMISSION_DATA=true
   ECHO_API_KEY=echo_b04f7559c995410688faf2bae7e40391dccf729c2affe2d3391332a6b66fa2e4
   ECHO_APP_ID=c4cb4416-3196-4266-8865-27a67c05b9b1
   ENABLE_AI_FEATURES=true
   NODE_ENV=production
   ```

6. **Run migrations** (Railway CLI or dashboard):
   ```bash
   npx prisma migrate deploy
   npx tsx apps/api/src/prisma/seeds/seed.ts
   ```

7. **Get your API URL**: 
   ```
   https://your-project.railway.app
   ```

### Step 2: Deploy Frontend to Vercel

1. **Push code to GitHub** (if not already)

2. **Go to [vercel.com](https://vercel.com)** → "New Project" → Import from GitHub

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm --filter @carbon-ledger/web build`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `pnpm install`

4. **Set Environment Variables**:
   ```bash
   NEXT_PUBLIC_API_BASE=https://your-project.railway.app
   ```

5. **Deploy** → Click "Deploy"

6. **Your app is live!** 🎉

### Step 3: Test Everything

1. Visit your Vercel URL
2. Create account / Login
3. Sync accounts from Nessie
4. Check transactions page for CO2e estimates
5. Generate AI recommendations

## 📋 Environment Variables Checklist

### Backend (Railway/Render/etc.)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=<random-32-char-string>
NESSIE_API_KEY=9a61128e72966e67649ec43222e120c9
NESSIE_API_BASE=http://api.nessieisreal.com
CLIMATIQ_API_KEY=<optional>
CLIMATIQ_API_BASE=https://api.climatiq.io
USE_LOCAL_EMISSION_DATA=true
ECHO_API_KEY=echo_b04f7559c995410688faf2bae7e40391dccf729c2affe2d3391332a6b66fa2e4
ECHO_APP_ID=c4cb4416-3196-4266-8865-27a67c05b9b1
ENABLE_AI_FEATURES=true
NODE_ENV=production
PORT=4000
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_BASE=https://your-backend-url.railway.app
```

## 🔧 Alternative: Deploy Backend to Render

Render offers a generous free tier:

1. **Sign up at [render.com](https://render.com)**

2. **New Web Service** → Connect GitHub

3. **Configure**:
   - **Root Directory**: `apps/api`
   - **Build Command**: 
     ```bash
     cd ../.. && npm install -g pnpm && pnpm install && pnpm --filter @carbon-ledger/api prisma generate && pnpm --filter @carbon-ledger/api build
     ```
   - **Start Command**: 
     ```bash
     cd ../.. && pnpm --filter @carbon-ledger/api start
     ```

4. **Add PostgreSQL** (free tier):
   - Dashboard → New → PostgreSQL
   - Copy `DATABASE_URL`

5. **Add Environment Variables** (same as Railway)

6. **Deploy** → Get your API URL

## 🚨 Known Issues & Solutions

### Issue 1: Monorepo Build Failures
**Problem**: Vercel/Railway can't find workspace packages

**Solution**: Build commands navigate to root first:
```bash
cd ../.. && pnpm install && pnpm --filter <package> build
```

### Issue 2: Prisma Client Not Generated
**Problem**: `@prisma/client` errors on deployment

**Solution**: Add to build command:
```bash
pnpm --filter @carbon-ledger/api prisma generate
```

### Issue 3: Database Connection Pool Exhaustion
**Problem**: "Too many connections" errors

**Solution**: Use connection pooling:
- Neon: Built-in pooling
- Supabase: Use connection pooler URL
- PgBouncer: Set up manually

### Issue 4: Cold Starts with AI
**Problem**: First AI request takes 20+ seconds

**Solution**: 
- Keep backend warm with uptime monitoring (UptimeRobot)
- Use Railway/Render (always-on containers)
- Consider caching AI responses

## 📊 Cost Estimates

### Hybrid Deployment (Frontend: Vercel, Backend: Railway)
- **Vercel**: Free (Hobby) or $20/mo (Pro)
- **Railway**: $5/mo (includes PostgreSQL)
- **Total**: $5-25/mo

### Vercel-Only (After Refactoring)
- **Vercel**: $20/mo (Pro, for cron)
- **Neon/Vercel Postgres**: Free tier or $19/mo
- **Total**: $20-40/mo

### AWS Deployment (Existing configs)
- **ECS + RDS + ALB**: ~$50-100/mo
- Production-grade, auto-scaling

## 🎓 Next Steps

1. **Quick Deploy**: Follow Option 1 (Railway + Vercel) above
2. **Test thoroughly**: Check all features work
3. **Monitor**: Set up logging (Railway/Render dashboards)
4. **Domain**: Add custom domain in Vercel
5. **SSL**: Automatic with Vercel & Railway

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Neon PostgreSQL](https://neon.tech)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Questions?** Check `README.md` or `TROUBLESHOOTING.md` for more details.

