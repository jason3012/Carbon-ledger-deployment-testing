# Carbon Ledger - Architecture Documentation

## System Overview

Carbon Ledger is a full-stack TypeScript application that combines financial transaction data with environmental impact calculations to help users understand and reduce their carbon footprint.

## High-Level Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │◄────►│   Next.js   │◄────►│   Express    │
│  (Client)   │      │   Web App   │      │   + tRPC     │
└─────────────┘      └─────────────┘      └──────┬───────┘
                                                  │
                                                  ▼
                     ┌─────────────┐      ┌──────────────┐
                     │   Nessie    │      │  PostgreSQL  │
                     │     API     │      │   Database   │
                     └─────────────┘      └──────────────┘
                     (Mock/Real)
```

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State**: Zustand (auth), TanStack Query (server state)
- **API Client**: tRPC React Query
- **Charts**: Recharts
- **Validation**: Zod

### Backend Layer
- **Runtime**: Node.js 20
- **Framework**: Express
- **API**: tRPC (type-safe RPC)
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken)
- **Jobs**: node-cron

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Prisma Migrate
- **Seeding**: TypeScript seed scripts

### Shared Layer
- **Types**: Shared TypeScript definitions
- **Emissions**: Carbon calculation engine
- **Utilities**: Common helpers

## Directory Structure Deep Dive

```
carbon-ledger/
├── apps/
│   ├── api/                          # Backend application
│   │   ├── src/
│   │   │   ├── config/               # Configuration
│   │   │   │   └── env.ts            # Environment validation
│   │   │   ├── modules/              # Business logic modules
│   │   │   │   ├── accounts/         # Bank account management
│   │   │   │   ├── transactions/     # Transaction sync & retrieval
│   │   │   │   ├── emissions/        # CO₂e calculation & analytics
│   │   │   │   ├── recommendations/  # Personalized advice
│   │   │   │   └── budgets/          # Carbon budget management
│   │   │   ├── trpc/                 # tRPC configuration
│   │   │   │   ├── context.ts        # Request context
│   │   │   │   ├── index.ts          # tRPC setup
│   │   │   │   └── routers/          # API routes
│   │   │   ├── jobs/                 # Background jobs
│   │   │   ├── utils/                # Utilities
│   │   │   ├── prisma/               # Database
│   │   │   │   ├── schema.prisma     # Data model
│   │   │   │   └── seeds/            # Demo data
│   │   │   └── index.ts              # Server entry
│   │   └── Dockerfile
│   │
│   └── web/                          # Frontend application
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   │   ├── (app)/            # Authenticated routes
│       │   │   │   ├── layout.tsx    # App shell
│       │   │   │   ├── dashboard/    # Main dashboard
│       │   │   │   ├── transactions/ # Transaction list
│       │   │   │   ├── insights/     # Analytics
│       │   │   │   ├── actions/      # Recommendations
│       │   │   │   └── settings/     # User settings
│       │   │   ├── login/            # Auth page
│       │   │   ├── layout.tsx        # Root layout
│       │   │   └── globals.css       # Global styles
│       │   ├── components/
│       │   │   ├── ui/               # Base UI components
│       │   │   ├── layout/           # Layout components
│       │   │   └── providers.tsx     # Context providers
│       │   ├── lib/                  # Utilities
│       │   │   ├── trpc.ts           # tRPC client
│       │   │   └── utils.ts          # Helpers
│       │   └── store/                # State management
│       │       └── auth.ts           # Auth state
│       └── Dockerfile
│
├── packages/                         # Shared packages
│   ├── types/                        # TypeScript definitions
│   │   └── src/index.ts              # Domain types
│   ├── db/                           # Database client
│   │   └── src/index.ts              # Prisma wrapper
│   └── emissions/                    # Carbon calculations
│       └── src/
│           ├── classify.ts           # Transaction categorization
│           ├── estimate.ts           # CO₂e calculation
│           ├── datasets.ts           # Emission factors
│           └── constants.ts          # MCC mappings
│
└── aws/                              # Deployment configurations
    ├── option-a/                     # Managed services path
    │   ├── app-runner-readme.md
    │   ├── apprunner-service.json
    │   └── amplify-build-settings.md
    └── option-b/                     # Container orchestration path
        ├── copilot/
        │   ├── api/manifest.yml
        │   └── web/manifest.yml
        └── github-actions/
```

## Data Flow

### 1. Authentication Flow

```
User → Login Form → tRPC auth.login → Verify Password → Generate JWT → Store Token → Redirect
```

### 2. Transaction Sync Flow

```
User Action → Sync Button → tRPC transactions.sync → Nessie API → Parse Transactions
    ↓
Classify Categories → Store in DB → Compute Emissions → Store Estimates → Return Success
```

### 3. Emission Calculation Flow

```
Transaction → Extract Info → Check for Quantity Data
    ↓                              ↓
Has Quantity?                  No Quantity?
    ↓                              ↓
Activity-Based Calc         Spend-Based Calc
(gallons × factor)         (dollars × intensity)
    ↓                              ↓
Return Estimate with Method and Confidence
```

### 4. Dashboard Data Flow

```
Page Load → tRPC emissions.dashboard → Query DB
    ↓
Aggregate by Category, Date, Merchant → Calculate Stats → Return Dashboard Data
    ↓
Client Renders Charts and KPIs
```

## Database Schema

### Core Entities

```
User
├── id (cuid)
├── email (unique)
├── password (hashed)
└── name

Account (1:N with User)
├── id
├── userId
├── externalId (Nessie ID)
├── bankName
├── accountType
└── lastSyncedAt

Transaction (N:1 with Account)
├── id
├── accountId
├── merchantId
├── date
├── amountUSD
├── rawDescription
├── category
├── mcc
└── metadata

EmissionEstimate (1:1 with Transaction)
├── id
├── transactionId
├── method (ACTIVITY | INTENSITY)
├── kgCO2e
├── factorId
└── details (JSON)

EmissionFactor
├── id
├── source (EPA, DEFRA, etc.)
├── categoryKey
├── kgCO2ePerUnit
└── unit

Recommendation (N:1 with User)
├── id
├── userId
├── month
├── title
├── description
├── estReductionKg
└── accepted

Budget (N:1 with User)
├── id
├── userId
├── month
└── limitKg
```

## API Design

### tRPC Router Structure

```typescript
AppRouter
├── auth
│   ├── register(email, password, name?)
│   ├── login(email, password)
│   └── me()
├── accounts
│   ├── list()
│   ├── get(accountId)
│   └── syncFromNessie(useRealNessie?)
├── transactions
│   ├── list(accountId, filters?)
│   ├── get(transactionId)
│   └── sync(accountId, useRealNessie?)
├── emissions
│   ├── dashboard(month?)
│   ├── computeMissing(accountId?)
│   └── recomputeAll()
├── recommendations
│   ├── list(month?)
│   ├── generate(month?)
│   └── accept(recommendationId)
└── budgets
    ├── get(month)
    ├── upsert(month, limitKg)
    └── list()
```

### Authentication Middleware

```typescript
protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
```

## Emissions Calculation Engine

### Classification Algorithm

```typescript
function classifyTransaction(mcc: string, description: string): string {
  // 1. Try MCC code lookup
  if (MCC_CATEGORY_MAP[mcc]) return MCC_CATEGORY_MAP[mcc];
  
  // 2. Fallback to keyword matching
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some(kw => description.toLowerCase().includes(kw))) {
      return category;
    }
  }
  
  // 3. Default fallback
  return 'other';
}
```

### Estimation Algorithm

```typescript
function estimateEmissions(amount: number, category: string, description: string) {
  // 1. Try to extract physical quantity
  const quantity = extractQuantity(description); // e.g., "12.5 gal"
  
  if (quantity) {
    // Activity-based: quantity × factor
    const factor = findActivityFactor(category, quantity.unit);
    return {
      kgCO2e: quantity.value * factor.kgCO2ePerUnit,
      method: 'ACTIVITY',
      confidence: 'high'
    };
  } else {
    // Spend-based: dollars × intensity
    const intensity = findIntensityFactor(category);
    return {
      kgCO2e: amount * intensity.kgCO2ePerUnit,
      method: 'INTENSITY',
      confidence: 'medium'
    };
  }
}
```

## Deployment Architecture

### Option A: Managed Services

```
Internet
    ↓
CloudFront (Amplify)
    ↓
Next.js (Amplify)
    ↓
API Gateway (App Runner)
    ↓
Express + tRPC (App Runner)
    ↓
RDS PostgreSQL (Private Subnet)
```

**Advantages**: Fast deployment, managed scaling, minimal ops

### Option B: Container Orchestration

```
Internet
    ↓
Application Load Balancer
    ├── /api/* → API Service (ECS Fargate)
    └── /*     → Web Service (ECS Fargate)
             ↓
        RDS PostgreSQL (Private Subnet)
```

**Advantages**: Full control, cost optimization, production-grade

## Security Architecture

### Authentication
- JWT tokens with expiration
- Bcrypt password hashing (10 rounds)
- HTTP-only cookies (production)
- Authorization header with Bearer token

### API Security
- CORS configuration
- Helmet security headers
- Rate limiting (TODO)
- Input validation (Zod)
- SQL injection prevention (Prisma)

### Secrets Management
- Environment variables (local)
- AWS Secrets Manager (production)
- No secrets in code/git
- Secret rotation support

## Monitoring & Observability

### Logging
- Structured logging with timestamps
- Log levels (info, warn, error, debug)
- CloudWatch Logs (AWS)

### Metrics
- Container Insights (ECS)
- CloudWatch Metrics
- Health check endpoints

### Error Tracking
- Try/catch with error logging
- Graceful error handling
- User-friendly error messages

## Performance Considerations

### Database
- Indexed queries (accountId, date, category)
- Efficient aggregations
- Connection pooling (Prisma)
- Query optimization

### Frontend
- Static generation where possible
- Client-side caching (TanStack Query)
- Lazy loading
- Image optimization

### Backend
- Batch operations for emissions
- Async job processing
- Response caching (TODO)

## Scalability

### Horizontal Scaling
- Stateless services
- Load balancer distribution
- Auto-scaling policies (ECS)

### Database Scaling
- Read replicas (future)
- Connection pooling
- Query optimization
- Proper indexing

### Caching Strategy
- TanStack Query (client-side)
- Redis (future, server-side)
- CDN (static assets)

## Development Workflow

```
Developer → Local Dev (pnpm dev) → Git Push
    ↓
GitHub Actions CI
    ├── Lint
    ├── Type Check
    ├── Test
    └── Build
    ↓
Manual Deploy (for now)
    ├── Option A: Amplify Console + App Runner
    └── Option B: Copilot CLI → ECS
```

## Testing Strategy

### Unit Tests
- Emission calculations
- Classification logic
- Utility functions

### Integration Tests
- API endpoints (TODO)
- Database operations (TODO)

### E2E Tests
- Critical user flows (TODO)

## Future Architecture Improvements

1. **Caching Layer**: Redis for frequently accessed data
2. **Event Bus**: SQS/SNS for async processing
3. **Search**: Elasticsearch for advanced transaction search
4. **Analytics**: Data warehouse for historical analysis
5. **Microservices**: Split into smaller services if needed
6. **GraphQL**: Alternative to tRPC for mobile apps
7. **Websockets**: Real-time updates
8. **CDN**: CloudFront for global performance

