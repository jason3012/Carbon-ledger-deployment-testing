#!/bin/bash
# Carbon Ledger - Universal Setup for ALL Devices
# Works on: macOS, Linux, Windows (Git Bash/WSL)

set -e

echo "🚀 Carbon Ledger - Universal Setup"
echo "=================================="
echo "This will work on ANY computer!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_status "Working directory: $SCRIPT_DIR"

# Check prerequisites
echo ""
echo "🔍 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        print_success "Node.js $NODE_VERSION (✅ >= 20.0.0)"
    else
        print_error "Node.js $NODE_VERSION found, but version 20+ required"
        echo "Please install Node.js 20+ from https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js not found"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_success "pnpm $PNPM_VERSION"
else
    print_warning "pnpm not found, installing..."
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        print_success "pnpm installed successfully"
    else
        print_error "Failed to install pnpm"
        echo "Please install pnpm manually: npm install -g pnpm"
        exit 1
    fi
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker found: $DOCKER_VERSION"
    
    # Check if Docker is running
    if docker info &> /dev/null; then
        print_success "Docker is running"
    else
        print_warning "Docker is installed but not running"
        echo "Please start Docker Desktop and try again"
        exit 1
    fi
else
    print_error "Docker not found"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if .env already exists
if [ -f ".env" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Keeping existing .env file"
    else
        print_status "Overwriting .env file"
        rm .env
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    ./setup-env.sh
    print_success ".env file created"
else
    print_success ".env file exists"
fi

# Install dependencies
echo ""
print_status "Installing dependencies..."
pnpm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check PostgreSQL
print_status "Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    if psql -h localhost -U postgres -d carbon_ledger -c "SELECT 1;" &> /dev/null; then
        print_success "PostgreSQL is running and accessible"
    else
        print_warning "PostgreSQL not accessible. Please start PostgreSQL:"
        echo "  macOS: brew services start postgresql"
        echo "  Linux: sudo systemctl start postgresql"
        echo "  Windows: Start PostgreSQL service"
        echo ""
        echo "Then run: ./setup-database.sh"
        exit 1
    fi
else
    print_warning "PostgreSQL not found. Please install PostgreSQL:"
    echo "  macOS: brew install postgresql"
    echo "  Linux: sudo apt install postgresql"
    echo "  Windows: Download from postgresql.org"
    exit 1
fi

# Push database schema
echo ""
print_status "Setting up database schema..."
pnpm db:push
if [ $? -eq 0 ]; then
    print_success "Database schema created"
else
    print_error "Failed to create database schema"
    exit 1
fi

# Seed database
echo ""
print_status "Loading demo data..."
pnpm db:seed
if [ $? -eq 0 ]; then
    print_success "Demo data loaded"
else
    print_error "Failed to load demo data"
    exit 1
fi

# Final success message
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_success "Carbon Ledger is ready to run!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development servers:"
echo "   ${BLUE}pnpm dev${NC}"
echo ""
echo "2. Open your browser:"
echo "   ${BLUE}Frontend: http://localhost:3000${NC}"
echo "   ${BLUE}API: http://localhost:4000${NC}"
echo ""
echo "3. Login with demo credentials:"
echo "   ${BLUE}Email: demo@carbonledger.com${NC}"
echo "   ${BLUE}Password: demo123${NC}"
echo ""
echo "🔧 Alternative start commands:"
echo "   ${BLUE}./start-api.sh${NC}  # Start API only"
echo "   ${BLUE}./start-web.sh${NC}  # Start Web only"
echo ""
echo "📖 For more help, see QUICKSTART.md"
echo ""
print_success "Happy coding! 🚀"