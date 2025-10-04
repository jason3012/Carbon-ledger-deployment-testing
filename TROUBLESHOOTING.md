# 🔧 Carbon Ledger - Troubleshooting Guide

## Quick Fixes for Common Issues

### 🚨 "Command not found" Errors

#### pnpm: command not found
```bash
# Install pnpm globally
npm install -g pnpm

# Or use corepack (Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

#### node: command not found
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **macOS**: `brew install node` or download from nodejs.org
- **Linux**: `sudo apt install nodejs npm` (Ubuntu/Debian)

#### PostgreSQL not found
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 🚨 Port Already in Use

#### Kill processes on ports 3000/4000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

# Or use different ports
PORT=3001 pnpm --filter @carbon-ledger/web dev
PORT=4001 pnpm --filter @carbon-ledger/api dev
```

### 🚨 Database Connection Issues

#### PostgreSQL not running
```bash
# Check if PostgreSQL is running
psql -h localhost -U postgres -c "SELECT 1;"

# Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start PostgreSQL service from Services

# Test connection
psql -h localhost -U postgres -d carbon_ledger -c "SELECT 1;"
```

#### Database connection refused
```bash
# Reset database completely
./reset-database.sh
```

#### Permission denied (database)
```bash
# Check your .env DATABASE_URL
# Should be: postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public
# NOT: postgresql://your_username@localhost:5432/carbon_ledger?schema=public
```

### 🚨 Prisma Issues

#### Prisma Client not found
```bash
cd apps/api
npx prisma generate
```

#### Schema out of sync
```bash
pnpm db:push
```

#### Migration issues
```bash
# Reset migrations
rm -rf apps/api/src/prisma/migrations
pnpm db:push
```

### 🚨 Environment Variables

#### Missing .env file
```bash
# Create .env file
./setup-env.sh
```

#### Wrong API keys
```bash
# Edit .env file
nano .env
# or
code .env
```

### 🚨 Build Issues

#### TypeScript errors
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build
```

#### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### 🚨 Platform-Specific Issues

#### Windows (Git Bash/WSL)
```bash
# Make scripts executable
chmod +x *.sh

# If scripts don't work, use pnpm directly:
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

#### macOS
```bash
# If you get permission errors:
sudo chmod +x *.sh
```

#### Linux
```bash
# Install required packages
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 🚨 Network Issues

#### API not responding
```bash
# Check if API is running
curl http://localhost:4000/health

# Check API logs
# Look at the terminal where you ran ./start-api.sh
```

#### Frontend can't connect to API
```bash
# Check NEXT_PUBLIC_API_BASE in .env
# Should be: http://localhost:4000

# Restart both servers
./start-api.sh  # In one terminal
./start-web.sh  # In another terminal
```

### 🚨 Authentication Issues

#### "User does not exist" error
```bash
# Clear browser storage
# Chrome: F12 → Application → Storage → Clear storage
# Or use incognito mode

# Reset database
./reset-database.sh
```

#### Login not working
```bash
# Use demo credentials:
# Email: demo@carbonledger.com
# Password: demo123

# Or refresh token in Settings page
```

## 🔄 Complete Reset

If nothing else works:

```bash
# 1. Stop everything
pkill -f "node.*dev"  # Kill any running dev servers

# 2. Clean everything
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .next
rm -rf apps/api/dist

# 3. Start fresh
./setup.sh
```

## 📞 Getting Help

### Check Logs
```bash
# API logs
./start-api.sh  # Look at terminal output

# Database logs
# Check PostgreSQL logs:
# macOS: brew services info postgresql
# Linux: sudo journalctl -u postgresql
# Windows: Check Event Viewer

# Frontend logs
./start-web.sh  # Look at terminal output
```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* pnpm dev

# Or check browser console (F12)
```

### System Information
```bash
# Check versions
node --version
pnpm --version
psql --version

# Check system
uname -a  # Linux/macOS
systeminfo  # Windows
```

## 🎯 Still Stuck?

1. **Check the logs** - Most errors have helpful messages
2. **Try the complete reset** - Often fixes mysterious issues
3. **Use the setup script** - `./setup.sh` handles most setup automatically
4. **Check your .env file** - Make sure all variables are set correctly
5. **Verify prerequisites** - Node.js 20+, pnpm 8+, PostgreSQL running

## 📋 Environment Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm 8+ installed  
- [ ] PostgreSQL installed and running
- [ ] .env file exists and configured
- [ ] Database schema pushed
- [ ] Demo data seeded
- [ ] No port conflicts (3000/4000)
- [ ] Scripts are executable (Unix systems)

---

**Need more help?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.
