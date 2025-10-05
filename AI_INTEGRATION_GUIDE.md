# 🤖 AI Integration Guide - Carbon Ledger

## Overview

Your Carbon Ledger application now has **AI-powered emissions estimation and personalized action plan generation** using OpenAI's GPT models!

## What's New?

### 1. **AI-Enhanced CO2e Estimation**
- Uses OpenAI's AI models to analyze transactions and provide more accurate CO2e estimates
- Considers merchant context, transaction patterns, and spending categories
- Provides confidence scores and explanations for each estimate
- Suggests lower-carbon alternatives for purchases

### 2. **Personalized Action Plans**
- Generates custom carbon reduction strategies based on your spending patterns
- Analyzes your top emission categories and frequent merchants
- Creates 5-7 prioritized actions with difficulty levels and timeframes
- Provides step-by-step implementation guides
- Estimates potential CO2e reduction for each action

### 3. **Intelligent Insights**
- Analyzes emission trends over time
- Identifies significant patterns and potential causes
- Provides actionable recommendations

---

## 🚀 Setup Instructions

### Step 1: Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy your API key (starts with `sk-...`)

**Note:** OpenAI offers free trial credits for new accounts. After that, pricing is pay-as-you-go:
- GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens (recommended, cost-effective)
- GPT-4o: $2.50 per 1M input tokens, $10.00 per 1M output tokens (more powerful)

### Step 2: Configure Environment Variables

Open your `.env` file and update the AI settings:

```bash
# AI/ML API (for enhanced emissions estimation and action plans)
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
ENABLE_AI_FEATURES=true
```

**Configuration Options:**
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: `gpt-4o-mini`, alternatives: `gpt-4o`, `gpt-4-turbo`)
- `ENABLE_AI_FEATURES`: Set to `true` to enable AI features

### Step 3: Restart Your Servers

```bash
# Kill existing processes
pkill -f "Greenprint.*tsx"

# Start API server
pnpm --filter @carbon-ledger/api dev

# In another terminal, start web server
pnpm --filter @carbon-ledger/web dev
```

You should see in the API server logs:
```
🤖 AI Service initialized with OpenAI
```

If AI is disabled, you'll see:
```
🤖 AI Service disabled (set ENABLE_AI_FEATURES=true and OPENAI_API_KEY to enable)
```

---

## 📡 API Endpoints

### 1. AI-Enhanced Emissions Estimation

**Endpoint:** `emissions.computeWithAI`

**Usage:**
```typescript
const result = await trpc.emissions.computeWithAI.mutate({
  transactionId: 'txn_123'
});
```

**Response:**
```json
{
  "id": "est_123",
  "transactionId": "txn_123",
  "method": "ACTIVITY",
  "kgCO2e": 12.5,
  "details": {
    "source": "AI-Enhanced Estimate",
    "confidence": "high",
    "explanation": "Fuel purchase for approximately 10 gallons at $3.50/gallon...",
    "suggestedAlternatives": [
      "Consider carpooling for this route",
      "Explore electric vehicle options"
    ]
  }
}
```

### 2. Generate AI Action Plan

**Endpoint:** `recommendations.generateAIActionPlan`

**Usage:**
```typescript
const actionPlan = await trpc.recommendations.generateAIActionPlan.mutate({
  month: '2025-10' // optional, defaults to current month
});
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "rec_123",
      "title": "Reduce Fuel Consumption",
      "description": "Work from home 2 days per week...",
      "estReductionKg": 45.0
    }
  ],
  "actionPlan": {
    "title": "Your Path to 30% Carbon Reduction",
    "summary": "By focusing on transportation and energy use...",
    "targetReduction": 125.5,
    "timeline": "Implement over next 30 days",
    "estimatedImpact": "Reduce monthly emissions from 420kg to 295kg CO2e"
  }
}
```

---

## 💡 How It Works

### AI Emissions Estimation Process

1. **Transaction Analysis**
   - AI receives transaction details (amount, description, merchant, category)
   - Analyzes context and patterns
   - Cross-references with carbon accounting best practices

2. **Estimate Generation**
   - Calculates realistic kg CO2e based on transaction type
   - Provides confidence score (high/medium/low)
   - Explains reasoning behind the estimate
   - Suggests alternatives if applicable

3. **Database Storage**
   - Saves AI-enhanced estimate with metadata
   - Marks estimate as `aiEnhanced: true`
   - Falls back to traditional estimation if AI fails

### AI Action Plan Generation Process

1. **Pattern Analysis**
   - Analyzes all transactions for the month
   - Identifies top emission categories
   - Detects spending patterns and habits
   - Maps merchant visit frequency

2. **Plan Creation**
   - Generates personalized title and summary
   - Sets realistic reduction target (15-30%)
   - Creates 5-7 prioritized actions
   - Assigns difficulty and timeframe to each action
   - Provides step-by-step implementation guide

3. **Database Integration**
   - Saves recommendations to database
   - Links to user and month
   - Tracks acceptance status
   - Falls back to rule-based recommendations if AI fails

---

## 🔧 Usage Examples

### Example 1: Estimate Emissions for a New Transaction

```typescript
// After syncing transactions from Nessie
const transactions = await trpc.transactions.list.query();

// Pick a transaction to analyze with AI
const firstTxn = transactions[0];

// Get AI-enhanced estimate
const estimate = await trpc.emissions.computeWithAI.mutate({
  transactionId: firstTxn.id
});

console.log(`AI Estimate: ${estimate.kgCO2e} kg CO2e`);
console.log(`Confidence: ${estimate.details.confidence}`);
console.log(`Explanation: ${estimate.details.explanation}`);
```

### Example 2: Generate Personalized Action Plan

```typescript
// Generate action plan for current month
const plan = await trpc.recommendations.generateAIActionPlan.mutate();

console.log(`Action Plan: ${plan.actionPlan.title}`);
console.log(`Summary: ${plan.actionPlan.summary}`);
console.log(`Target Reduction: ${plan.actionPlan.targetReduction} kg CO2e`);

// Display actions
plan.recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec.title}`);
  console.log(`   Impact: ${rec.estReductionKg} kg CO2e`);
});
```

---

## 💰 Cost Estimation

### Typical Usage Costs (with gpt-4o-mini)

**Per Transaction Estimation:**
- Input: ~300 tokens (~$0.000045)
- Output: ~150 tokens (~$0.00009)
- **Total: ~$0.000135 per transaction**

**Per Action Plan Generation:**
- Input: ~1,500 tokens (~$0.000225)
- Output: ~800 tokens (~$0.00048)
- **Total: ~$0.000705 per action plan**

**Monthly Costs (Example):**
- 100 transactions × $0.000135 = $0.0135
- 1 action plan × $0.000705 = $0.000705
- **Total: ~$0.014 per month per user**

**With 1000 users:** ~$14/month

---

## 🎯 Best Practices

### 1. **Use AI Selectively**
- Enable AI for new/unusual transactions where traditional estimates are less accurate
- Use batch processing for initial setup
- Let users opt-in to AI features

### 2. **Monitor API Usage**
- Set up OpenAI usage alerts
- Track costs in OpenAI dashboard
- Consider caching common estimates

### 3. **Fallback Strategy**
- Always have traditional estimation as fallback
- Don't block user experience on AI failures
- Log AI errors for debugging

### 4. **User Experience**
- Show loading states for AI operations
- Display confidence scores to users
- Highlight AI-enhanced insights
- Allow users to provide feedback

---

## 🔒 Security & Privacy

### API Key Security
- ✅ API key stored in `.env` file (not in code)
- ✅ Never commit `.env` to version control
- ✅ Use different keys for dev/prod environments
- ✅ Rotate keys periodically

### Data Privacy
- Transaction data sent to OpenAI for analysis
- No personally identifiable information (PII) included
- OpenAI does not train models on API data (by default)
- Review [OpenAI's Data Usage Policy](https://openai.com/policies/api-data-usage-policies)

### Compliance
- Ensure compliance with your local data protection laws
- Consider data residency requirements
- Review terms with legal counsel for production use

---

## 🐛 Troubleshooting

### Issue: "AI Service disabled" message

**Solution:**
```bash
# Check .env file
cat .env | grep AI

# Should show:
# OPENAI_API_KEY=sk-...
# ENABLE_AI_FEATURES=true

# Restart API server
pkill -f "Greenprint.*tsx"
pnpm --filter @carbon-ledger/api dev
```

### Issue: "API key invalid" error

**Causes:**
- Expired or revoked API key
- Incorrect key format
- Billing issue with OpenAI account

**Solution:**
1. Generate new API key from OpenAI dashboard
2. Update `.env` file
3. Restart API server

### Issue: AI responses too slow

**Solutions:**
- Switch to faster model (`gpt-4o-mini` instead of `gpt-4o`)
- Reduce temperature setting (0.3 for estimates, 0.7 for action plans)
- Implement response caching
- Use batch processing for multiple transactions

### Issue: High API costs

**Solutions:**
- Disable AI for repeat/similar transactions
- Cache AI responses for common transaction patterns
- Use traditional estimation as default, AI as opt-in
- Set monthly budget limits in OpenAI dashboard

---

## 🚀 Advanced Features

### Custom Prompts

Edit `apps/api/src/modules/ai/ai.service.ts` to customize AI behavior:

```typescript
// Customize estimation prompt
const prompt = `You are a carbon emissions expert specializing in ${userRegion} data...`;

// Customize action plan style
const prompt = `Create an action plan with focus on ${userPreference}...`;
```

### Model Selection

Different models for different use cases:

- **gpt-4o-mini**: Fast, cost-effective, good for estimates
- **gpt-4o**: More accurate, better reasoning, higher cost
- **gpt-4-turbo**: Balance of speed and accuracy

### Integration with Other APIs

Combine AI with other carbon data sources:

```typescript
// Use Climatiq for precise factors, AI for context
const climatiqFactor = await getClimatiqFactor(category);
const aiContext = await aiService.estimateEmissionsWithAI(transaction);

const finalEstimate = combineEstimates(climatiqFactor, aiContext);
```

---

## 📊 Monitoring & Analytics

### Track AI Usage

Add logging to monitor AI performance:

```typescript
// In ai.service.ts
logger.info(`AI estimation: ${kgCO2e} kg, confidence: ${confidence}, cost: ${estimatedCost}`);
```

### Performance Metrics

Monitor:
- Response times (should be < 3 seconds)
- Confidence score distribution
- User feedback on AI recommendations
- Cost per user per month
- Cache hit rates

---

## 🎓 Next Steps

1. **Test the Integration**
   - Sync transactions
   - Generate AI estimates for a few transactions
   - Create an action plan
   - Review the results

2. **Customize the Experience**
   - Update AI prompts for your use case
   - Add region-specific context
   - Customize action plan recommendations

3. **Monitor Usage**
   - Set up OpenAI usage alerts
   - Track costs and performance
   - Collect user feedback

4. **Scale Gradually**
   - Start with AI opt-in
   - Expand based on user response
   - Optimize prompts for cost efficiency

---

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [Best Practices for Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Carbon Accounting Standards](https://ghgprotocol.org/)

---

## ✅ Summary

Your Carbon Ledger application now includes:

✅ AI-powered CO2e emission estimation  
✅ Personalized action plan generation  
✅ Intelligent insights and recommendations  
✅ Fallback to traditional estimation  
✅ Secure API key management  
✅ Cost-effective implementation  

**Ready to use!** Just add your OpenAI API key and enable the features in your `.env` file.

---

*Need help? Check the troubleshooting section or review the API documentation above.*


