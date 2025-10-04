@echo off
REM Carbon Ledger - Windows Setup Script

echo 🚀 Carbon Ledger - Windows Setup
echo ================================
echo.

REM Enable error handling
setlocal enabledelayedexpansion

REM Check if Node.js is installed
echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js 20+ from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Node.js found

REM Check if pnpm is installed
echo Checking pnpm...
pnpm --version
if %errorlevel% neq 0 (
    echo ⚠️  pnpm not found, installing...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm
        echo Please install pnpm manually: npm install -g pnpm
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
    echo ✅ pnpm installed successfully
) else (
    echo ✅ pnpm found
)

REM Check if PostgreSQL is available
echo Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL not found
    echo Please install PostgreSQL from https://www.postgresql.org/download/windows/
    echo Or use the installer from the official website
    echo.
    echo Press any key to continue anyway (you can install PostgreSQL later)...
    pause >nul
) else (
    echo ✅ PostgreSQL found
)

echo ✅ Prerequisites check passed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 🔧 Creating .env file...
    echo NODE_ENV=development > .env
    echo. >> .env
    echo # Database >> .env
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public >> .env
    echo. >> .env
    echo # Auth >> .env
    echo JWT_SECRET=dev-secret-change-in-production >> .env
    echo. >> .env
    echo # API Server >> .env
    echo PORT=4000 >> .env
    echo. >> .env
    echo # External APIs >> .env
    echo NESSIE_API_BASE=https://api.reimaginebanking.com >> .env
    echo NESSIE_API_KEY=9a61128e72966e67649ec43222e120c9 >> .env
    echo. >> .env
    echo CLIMATIQ_API_BASE=https://api.climatiq.io >> .env
    echo CLIMATIQ_API_KEY= >> .env
    echo. >> .env
    echo # Feature Toggles >> .env
    echo USE_LOCAL_EMISSION_DATA=true >> .env
    echo. >> .env
    echo # Frontend >> .env
    echo NEXT_PUBLIC_API_BASE=http://localhost:4000 >> .env
    echo ✅ .env file created
) else (
    echo ✅ .env file exists
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo ✅ Dependencies installed

REM Check PostgreSQL
echo.
echo 🗄️  Checking PostgreSQL...
REM Note: User needs to have PostgreSQL installed and running locally
echo ⚠️  Please ensure PostgreSQL is installed and running:
echo    Download from: https://www.postgresql.org/download/
echo    Default connection: postgresql://postgres:postgres@localhost:5432

REM Setup database
echo.
echo 🗄️  Setting up database schema...
pnpm db:push
if %errorlevel% neq 0 (
    echo ❌ Failed to create database schema
    echo Make sure PostgreSQL is running and accessible
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo ✅ Database schema created
)

REM Seed database
echo.
echo 🌱 Loading demo data...
pnpm db:seed
if %errorlevel% neq 0 (
    echo ❌ Failed to load demo data
    echo You can run this later with: pnpm db:seed
    echo.
    echo Press any key to continue anyway...
    pause >nul
) else (
    echo ✅ Demo data loaded
)

REM Success message
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo ✅ Carbon Ledger is ready to run!
echo.
echo 📋 Next steps:
echo 1. Start the development servers:
echo    pnpm dev
echo.
echo 2. Open your browser:
echo    Frontend: http://localhost:3000
echo    API: http://localhost:4000
echo.
echo 3. Login with demo credentials:
echo    Email: demo@carbonledger.com
echo    Password: demo123
echo.
echo 📖 For more help, see QUICKSTART.md
echo.
echo ✅ Happy coding! 🚀
pause
