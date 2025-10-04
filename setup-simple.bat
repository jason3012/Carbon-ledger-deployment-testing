@echo off
echo 🚀 Carbon Ledger - Simple Windows Setup
echo ======================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js 20+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Check pnpm
echo Checking pnpm...
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  pnpm not found, installing...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm
        echo Please install manually: npm install -g pnpm
        pause
        exit /b 1
    )
)
echo ✅ pnpm found

REM Create .env file
echo Creating .env file...
if not exist .env (
    echo NODE_ENV=development > .env
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public >> .env
    echo JWT_SECRET=dev-secret-change-in-production >> .env
    echo PORT=4000 >> .env
    echo NESSIE_API_BASE=https://api.reimaginebanking.com >> .env
    echo NESSIE_API_KEY=9a61128e72966e67649ec43222e120c9 >> .env
    echo CLIMATIQ_API_BASE=https://api.climatiq.io >> .env
    echo CLIMATIQ_API_KEY= >> .env
    echo USE_LOCAL_EMISSION_DATA=true >> .env
    echo NEXT_PUBLIC_API_BASE=http://localhost:4000 >> .env
    echo ✅ .env file created
) else (
    echo ✅ .env file exists
)

REM Install dependencies
echo Installing dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo 🎉 Setup Complete!
echo.
echo Next steps:
echo 1. Install PostgreSQL from https://www.postgresql.org/download/windows/
echo 2. Run: pnpm dev
echo 3. Open: http://localhost:3000
echo.
pause
