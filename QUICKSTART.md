# 🚀 Carbon Ledger - Quick Start Guide

Get Carbon Ledger running locally in under 5 minutes!

## Prerequisites Check

Make sure you have:
- ✅ Node.js 20+ installed (`node --version`)
- ✅ pnpm 8+ installed (`pnpm --version` or install with `npm i -g pnpm`)
- ✅ Docker installed and running (`docker --version`)

**Quick Setup**: Run `./setup.sh` for automatic setup with validation!

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd carbon-ledger

# Option A: Automatic setup (recommended)
./setup.sh

# Option B: Manual setup
pnpm install
```

## Step 2: Set Up Database (1 minute)

```bash
# Start PostgreSQL with Docker
docker compose up -d

# Verify it's running
docker ps
# You should see "carbon-ledger-db" container

# Initialize database schema
pnpm db:push

# Load demo data
pnpm db:seed
```

## Step 3: Configure Environment (30 seconds)

```bash
# Copy environment template
cp .env.example .env

# The defaults work for local development!
# Optional: Edit .env if you want to use real Nessie/Climatiq APIs
```

## Step 4: Start Development Servers (1 minute)

```bash
# Start both frontend and backend
pnpm dev
```

This will start:
- 🌐 **Frontend** at http://localhost:3000
- 🔧 **Backend API** at http://localhost:4000

## Step 5: Explore the App! 🎉

1. **Open** http://localhost:3000 in your browser
2. **Login** with demo credentials:
   - Email: `demo@carbonledger.com`
   - Password: `demo123`
3. **Sync Transactions**: Go to Settings → Connect Mock Account
4. **View Dashboard**: Navigate to Dashboard to see your carbon footprint

## What You'll See

### Dashboard
- Current month CO₂e emissions
- Comparison with last month
- Category breakdown (pie chart)
- Daily emissions trend (line chart)
- Top carbon sources

### Transactions
- List of all transactions with CO₂e estimates
- Search and filter capabilities
- Method badges (ACTIVITY vs INTENSITY)
- Transparent factor details

### Insights
- Category deep dives
- Month-over-month comparisons
- Benchmarks vs US average

### Actions
- Personalized recommendations
- Estimated carbon reductions
- Action plan tracking

### Settings
- Connect bank accounts
- Set carbon budgets
- Data export/management

## Common Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm dev --filter api       # Start only backend
pnpm dev --filter web       # Start only frontend

# Database
pnpm db:push                # Push schema changes
pnpm db:migrate             # Create migration
pnpm db:seed                # Reload demo data
pnpm db:studio              # Open Prisma Studio (GUI)

# Testing
pnpm test                   # Run all tests
pnpm lint                   # Check code style

# Building
pnpm build                  # Build all apps
```

## Useful URLs

- 🌐 Frontend: http://localhost:3000
- 🔧 API: http://localhost:4000
- 💚 API Health: http://localhost:4000/health
- 🗄️ Database: `postgresql://postgres:postgres@localhost:5432/carbon_ledger`

## Troubleshooting

### "Port 3000/4000 already in use"
```bash
# Kill processes on port
npx kill-port 3000 4000
# Or use different ports
PORT=3001 pnpm --filter web dev
PORT=4001 pnpm --filter api dev
```

### "Database connection failed"
```bash
# Check if PostgreSQL is running
docker ps
# Restart if needed
docker compose restart
```

### "pnpm: command not found"
```bash
# Install pnpm
npm install -g pnpm
# Or use corepack
corepack enable
```

### "Prisma Client not found"
```bash
# Generate Prisma Client
cd apps/api
npx prisma generate
```

### Fresh Start
```bash
# Stop everything
docker compose down -v
pnpm clean

# Start over
docker compose up -d
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

## Next Steps

### Explore the Code
- `apps/api/src/modules/` - Business logic
- `apps/web/src/app/` - Frontend pages
- `packages/emissions/` - Carbon calculation engine

### Add Real Data
- Get a Nessie API key from [Capital One DevExchange](https://developer.capitalone.com/)
- Update `.env` with your key
- Set `USE_LOCAL_EMISSION_DATA=false` to use Climatiq

### Deploy to AWS
- See `aws/option-a/` for Amplify + App Runner
- See `aws/option-b/` for ECS/Fargate with Copilot

## Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# Edit files...

# 3. Test changes
pnpm dev
pnpm test

# 4. Check database changes
pnpm db:studio

# 5. Create migration if needed
pnpm db:migrate

# 6. Commit
git add .
git commit -m "feat: my feature"
git push origin feature/my-feature
```

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 🐛 Check [GitHub Issues](./issues)
- 💬 Review inline code comments
- 🔍 Use VS Code's "Go to Definition" to explore types

## Demo Scenarios

### Scenario 1: High Fuel Emissions
1. Login as demo user
2. Notice high `transport.fuel` category
3. Go to Actions → Generate Recommendations
4. See personalized advice to reduce driving

### Scenario 2: Set Carbon Budget
1. Go to Settings
2. Set monthly budget (e.g., 300 kg CO₂e)
3. View progress on Dashboard
4. Get alerts when approaching limit

### Scenario 3: Transaction Deep Dive
1. Go to Transactions
2. Click on a fuel purchase
3. See detailed emission calculation
4. View factor source (EPA, DEFRA)
5. Understand methodology (activity vs intensity)

---

**That's it!** You're now ready to explore Carbon Ledger and make an impact on climate action through financial transparency. 🌱✨

