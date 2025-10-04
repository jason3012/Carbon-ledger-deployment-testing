@echo off
REM Carbon Ledger - Windows Setup Script

echo 🚀 Carbon Ledger - Windows Setup
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  pnpm not found, installing...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm
        echo Please install pnpm manually: npm install -g pnpm
        pause
        exit /b 1
    )
)

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 🔧 Creating .env file...
    call setup-env.sh
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
    pause
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
    pause
    exit /b 1
)
echo ✅ Database schema created

REM Seed database
echo.
echo 🌱 Loading demo data...
pnpm db:seed
if %errorlevel% neq 0 (
    echo ❌ Failed to load demo data
    pause
    exit /b 1
)
echo ✅ Demo data loaded

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
