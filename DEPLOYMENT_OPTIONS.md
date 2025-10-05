# 🚀 Deployment Options

Quick reference for deploying Carbon Ledger to production.

## 📋 Options Summary

| Platform | Difficulty | Cost | Best For | Setup Time |
|----------|-----------|------|----------|------------|
| **Railway + Vercel** | Easy | $5-25/mo | Quick MVP, demos | 30 min |
| **Render + Vercel** | Easy | $0-20/mo | Free testing | 30 min |
| **Vercel Only*** | Medium | $20-40/mo | All-in-one | 4-8 hours** |
| **AWS Amplify + App Runner** | Medium | $30-80/mo | AWS ecosystem | 2 hours |
| **AWS ECS/Fargate** | Hard | $50-150/mo | Production scale | 4 hours |

\* Requires refactoring Express API to Next.js API routes  
\** Refactoring time

## ✅ Recommended: Railway + Vercel (Easiest)

**Perfect for hackathons, MVPs, and demos**

### What You Get
- ✅ Frontend on Vercel (fast, global CDN)
- ✅ Backend API on Railway (always-on, not serverless)
- ✅ PostgreSQL included with Railway
- ✅ All AI features work out-of-the-box
- ✅ Cron jobs work natively
- ✅ No refactoring needed

### Quick Setup
1. Deploy backend to Railway (~15 min)
2. Deploy frontend to Vercel (~15 min)
3. Done! 🎉

**[→ Full Railway + Vercel Guide](./VERCEL_DEPLOYMENT.md#step-1-deploy-backend-to-railway)**

## 🆓 Free Tier: Render + Vercel

**Best for testing without spending money**

### What You Get
- ✅ Frontend on Vercel (free Hobby plan)
- ✅ Backend on Render (free tier, spins down after inactivity)
- ✅ PostgreSQL on Render (free tier, limited storage)
- ⚠️ Cold starts (~30s on first request)
- ⚠️ Spins down after 15 min inactivity

### Good For
- Testing deployment
- Demo videos (pre-warm before recording)
- Low-traffic personal projects

**[→ Render Deployment Guide](./VERCEL_DEPLOYMENT.md#alternative-deploy-backend-to-render)**

## 🏢 Production: AWS Deployment

**For serious production workloads**

### Option A: Amplify + App Runner
- **Pros**: Managed services, easier setup
- **Cons**: Less control, ~$30-80/mo
- **Setup**: 2 hours
- **[→ AWS Option A Guide](./aws/option-a/app-runner-readme.md)**

### Option B: ECS/Fargate + Copilot
- **Pros**: Full control, auto-scaling, production-grade
- **Cons**: More complex, ~$50-150/mo
- **Setup**: 4 hours
- **[→ AWS Option B Guide](./aws/option-b/README.md)**

## 🎯 Which Should You Choose?

### Choose Railway + Vercel if:
- ✅ You want to deploy in under 30 minutes
- ✅ You're building an MVP or hackathon project
- ✅ Budget is $5-25/month
- ✅ You want everything to "just work"

### Choose Render + Vercel if:
- ✅ You want completely free deployment
- ✅ You're okay with cold starts
- ✅ Traffic is low/infrequent
- ✅ Testing before committing to paid tier

### Choose Vercel-Only if:
- ✅ You want all-in-one platform
- ✅ You can invest 4-8 hours in refactoring
- ✅ You prefer serverless architecture
- ✅ Budget is $20-40/month

### Choose AWS if:
- ✅ You need production-grade infrastructure
- ✅ Auto-scaling is important
- ✅ You have AWS expertise
- ✅ Budget is $50-150/month

## 🚀 Ready to Deploy?

### 1️⃣ Start Here (Quickest Path)
**[Railway + Vercel Guide](./VERCEL_DEPLOYMENT.md)** - Deploy in 30 minutes

### 2️⃣ Need Production Scale?
**[AWS Deployment Guide](./aws/option-b/README.md)** - Enterprise-ready

### 3️⃣ Want Free Tier?
**[Render + Vercel Guide](./VERCEL_DEPLOYMENT.md#alternative-deploy-backend-to-render)** - Zero cost

## 📚 Additional Resources

- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Detailed Vercel + Railway/Render guide
- **[aws/option-a/](./aws/option-a/)** - AWS Amplify + App Runner configs
- **[aws/option-b/](./aws/option-b/)** - AWS ECS/Fargate configs
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common deployment issues

## 💡 Pro Tips

1. **Start with Railway + Vercel** - Easiest to set up, can scale later
2. **Use environment variables** - Never commit secrets to git
3. **Test locally first** - Make sure everything works before deploying
4. **Monitor your app** - Use Railway/Vercel dashboards for logs
5. **Add custom domain** - Both platforms make it easy

---

**Questions?** Check the detailed guides linked above or see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

