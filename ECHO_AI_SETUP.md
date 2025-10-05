# 🤖 Echo Merit Systems AI Integration Guide

## Overview

Your Carbon Ledger now uses **Echo Merit Systems** for AI-powered emissions estimation and personalized action plans. Echo handles authentication, billing, and AI provider access automatically!

## What's Echo Merit Systems?

Echo is a billing infrastructure for AI applications that:
- ✅ Handles user authentication & API keys
- ✅ Manages AI usage billing automatically
- ✅ Provides access to OpenAI models (GPT-4o, GPT-4o-mini, etc.)
- ✅ Tracks usage and balances
- ✅ Simplifies payment processing

## Features

### 1. **AI-Enhanced CO2e Estimation**
- Analyzes transactions with AI for accurate emissions estimates
- Provides confidence scores and detailed explanations
- Suggests lower-carbon alternatives
- Uses spend-based carbon accounting principles

### 2. **Personalized Action Plans**
- Generates custom carbon reduction strategies
- Analyzes spending patterns and emission categories
- Creates 5-7 prioritized actions with specific percentage reductions
- Example: "Take public transportation 2-3 times per week to reduce fuel emissions by 15%"

### 3. **Intelligent Insights**
- Analyzes emission trends over time
- Identifies patterns and potential causes
- Provides actionable recommendations

---

## 🚀 Setup Instructions

### Step 1: Create Echo App

1. Go to **[echo.merit.systems/new](https://echo.merit.systems/new)**
2. Create a new app
3. Copy your `APP_ID` (you'll need this!)

### Step 2: Generate API Key

For users (or yourself for testing):

1. Go to `https://echo.merit.systems/app/YOUR_APP_ID/keys`
2. Click **"Create API Key"**
3. Copy the key (starts with `echo_...`)

### Step 3: Configure Environment Variables

Update your `.env` file:

```bash
# AI/ML API - Echo Merit Systems
ECHO_API_KEY=echo_your-api-key-here
ECHO_APP_ID=your-app-id-here
ENABLE_AI_FEATURES=true
```

### Step 4: Restart Servers

```bash
# Kill existing processes
pkill -f "Greenprint.*tsx"

# Start API server
pnpm --filter @carbon-ledger/api dev

# In another terminal, start web server
pnpm --filter @carbon-ledger/web dev
```

You should see in the API logs:
```
🤖 AI Service initialized with Echo Merit Systems
```

---

## 💡 How It Works

### Architecture

```
Your App
    ↓
Echo SDK
    ↓ (handles auth & billing)
OpenAI API
    ↓
AI Response (billed through Echo)
```

### Usage Flow

1. **User authenticates** with Echo API key
2. **App makes AI request** through Echo SDK
3. **Echo handles billing** automatically
4. **AI response returned** to your app
5. **User's balance updated** in Echo

---

## 📡 API Endpoints

### 1. Estimate Emissions with AI

**Endpoint:** `emissions.computeWithAI`

```typescript
const estimate = await trpc.emissions.computeWithAI.mutate({
  transactionId: 'txn_123'
});

console.log(estimate.kgCO2e); // 12.5 kg CO2e
console.log(estimate.details.confidence); // "high"
console.log(estimate.details.explanation);
console.log(estimate.details.suggestedAlternatives);
```

**Response:**
```json
{
  "id": "est_123",
  "kgCO2e": 12.5,
  "method": "ACTIVITY",
  "details": {
    "source": "AI-Enhanced Estimate",
    "confidence": "high",
    "explanation": "Based on fuel purchase at $42.50...",
    "suggestedAlternatives": [
      "Consider carpooling for this route",
      "Explore electric vehicle options",
      "Use public transportation when possible"
    ],
    "aiEnhanced": true
  }
}
```

### 2. Generate AI Action Plan

**Endpoint:** `recommendations.generateAIActionPlan`

```typescript
const plan = await trpc.recommendations.generateAIActionPlan.mutate({
  month: '2025-10' // optional
});

console.log(plan.actionPlan.title);
console.log(plan.actionPlan.targetReduction);
plan.recommendations.forEach(rec => {
  console.log(`${rec.title}: ${rec.estReductionKg} kg CO2e saved`);
});
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "Take public transportation 2-3 times per week",
      "description": "Switch from driving to public transit...",
      "estReductionKg": 45.0
    }
  ],
  "actionPlan": {
    "title": "Your Path to 30% Carbon Reduction",
    "summary": "By focusing on transportation and energy use...",
    "targetReduction": 125.5,
    "timeline": "Implement over next 30 days",
    "estimatedImpact": "Reduce from 420kg to 295kg CO2e/month",
    "actions": [
      {
        "category": "transport.fuel",
        "action": "Take public transportation 2-3 times per week",
        "difficulty": "easy",
        "impactKg": 45.0,
        "timeframe": "immediate",
        "steps": [
          "Identify 2-3 regular trips that can use public transit",
          "Research transit routes and schedules",
          "Purchase monthly transit pass for convenience",
          "Track fuel savings and emission reductions"
        ]
      }
    ]
  }
}
```

---

## 💰 Billing & Costs

### How Billing Works

- **Pay-as-you-go**: Users only pay for what they use
- **Transparent pricing**: Based on OpenAI's pricing
- **Echo fee**: Small percentage on top of AI costs
- **Your revenue**: Set your own markup in Echo dashboard

### Cost Estimates (gpt-4o-mini)

**Per Transaction Estimation:**
- Input: ~400 tokens
- Output: ~150 tokens
- **Cost: ~$0.0002 per transaction**

**Per Action Plan:**
- Input: ~2000 tokens
- Output: ~800 tokens
- **Cost: ~$0.001 per plan**

**Monthly Example (100 users):**
- 100 transactions/user × 100 users = 10,000 estimates
- 1 action plan/user × 100 users = 100 plans
- **Total: ~$2.10/month in AI costs**

### User Balance Management

```typescript
// Check user's balance
const balance = await aiService.checkBalance();
console.log(balance.formatted); // "$5.42"

// Create top-up link if low
if (balance.balance < 1) {
  const paymentLink = await aiService.createPaymentLink(10);
  // Send link to user
}
```

---

## 🎯 Usage Examples

### Example 1: Analyze All Transactions

```typescript
// Get all transactions
const transactions = await trpc.transactions.list.query();

// Analyze each with AI
for (const txn of transactions) {
  const estimate = await trpc.emissions.computeWithAI.mutate({
    transactionId: txn.id
  });
  
  console.log(`${txn.rawDescription}: ${estimate.kgCO2e} kg CO2e`);
  console.log(`Confidence: ${estimate.details.confidence}`);
  
  if (estimate.details.suggestedAlternatives) {
    console.log('Alternatives:', estimate.details.suggestedAlternatives);
  }
}
```

### Example 2: Monthly Carbon Review

```typescript
// Generate action plan for current month
const plan = await trpc.recommendations.generateAIActionPlan.mutate();

console.log(`\n${plan.actionPlan.title}`);
console.log(`\nCurrent emissions: ${plan.actionPlan.totalEmissions} kg CO2e`);
console.log(`Target reduction: ${plan.actionPlan.targetReduction} kg CO2e`);
console.log(`\nRecommended Actions:`);

plan.recommendations.forEach((rec, i) => {
  console.log(`\n${i + 1}. ${rec.title}`);
  console.log(`   Impact: ${rec.estReductionKg} kg CO2e reduction`);
  console.log(`   ${rec.description}`);
});
```

---

## 🔒 Security & Privacy

### API Key Security
- ✅ Store Echo API keys in environment variables only
- ✅ Never commit keys to version control
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys periodically
- ✅ Echo handles user authentication automatically

### Data Privacy
- Transaction data sent to OpenAI via Echo for analysis
- Echo logs API usage for billing purposes
- No personally identifiable information (PII) sent
- OpenAI doesn't train models on API data (per OpenAI policy)
- Review [Echo's Privacy Policy](https://echo.merit.systems/privacy)

---

## 🐛 Troubleshooting

### Issue: "AI Service disabled" message

**Check:**
```bash
# View .env configuration
cat .env | grep ECHO

# Should show:
# ECHO_API_KEY=echo_...
# ECHO_APP_ID=your-app-id
# ENABLE_AI_FEATURES=true
```

**Fix:**
1. Ensure you have valid Echo API key and App ID
2. Set `ENABLE_AI_FEATURES=true`
3. Restart API server

### Issue: "Insufficient balance" error

**Solution:**
```typescript
// Check balance
const balance = await aiService.checkBalance();
if (balance.balance < 1) {
  // Create payment link
  const link = await aiService.createPaymentLink(10);
  // User adds funds via link
}
```

### Issue: AI responses are slow

**Optimize:**
- Use `gpt-4o-mini` instead of `gpt-4o` (3x faster, 15x cheaper)
- Cache common transaction patterns
- Batch process multiple transactions
- Consider using streaming responses

### Issue: High costs

**Reduce:**
- Use AI only for unusual/complex transactions
- Cache AI estimates for similar transactions
- Set daily/monthly usage limits
- Use traditional estimation as default, AI as opt-in

---

## 🚀 Advanced Features

### Custom Pricing

Set your own markup in Echo dashboard:
1. Go to Echo app settings
2. Set pricing model (pass-through, markup %, fixed fee)
3. Echo handles billing automatically

### Usage Analytics

```typescript
// Track AI usage
const stats = {
  estimations: 0,
  actionPlans: 0,
  totalCost: 0
};

// After AI call
stats.estimations++;
// Echo tracks actual costs automatically
```

### Multi-User Support

Each user gets their own Echo API key:
1. User visits your app
2. App redirects to Echo key creation
3. User returns with API key
4. Your app stores key securely
5. All AI usage billed to that user's balance

---

## 📚 Resources

- [Echo Merit Systems](https://echo.merit.systems)
- [Echo Documentation](https://echo.merit.systems/docs)
- [Echo TypeScript SDK](https://www.npmjs.com/package/@merit-systems/echo-typescript-sdk)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI Models](https://platform.openai.com/docs/models)

---

## ✅ Summary

Your Carbon Ledger now includes:

✅ Echo Merit Systems integration  
✅ AI-powered CO2e emission estimation  
✅ Personalized action plan generation  
✅ Automatic billing through Echo  
✅ Balance checking and top-up links  
✅ Secure API key management  

**Ready to use!** Just add your Echo API key and App ID to start using AI features.

---

## 🎓 Next Steps

1. **Test the Integration**
   - Create Echo app and get your App ID
   - Generate API key for testing
   - Try estimating emissions for a transaction
   - Generate an action plan

2. **Set Up Production**
   - Create production Echo app
   - Configure pricing/markup
   - Add balance warnings
   - Monitor usage and costs

3. **Enhance User Experience**
   - Add loading states for AI operations
   - Display confidence scores to users
   - Show suggested alternatives prominently
   - Allow users to provide feedback

4. **Monitor & Optimize**
   - Track Echo usage analytics
   - Optimize prompts for accuracy and cost
   - Cache common patterns
   - Gather user feedback

---

*Need help? Check [Echo's documentation](https://echo.merit.systems/docs) or the troubleshooting section above.*

