#!/bin/bash

echo "🌱 Carbon Ledger - Setup Script"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing..."
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Start database
echo "🐘 Starting PostgreSQL..."
docker compose up -d
sleep 3
echo "✅ Database started"
echo ""

# Setup database
echo "🗄️  Setting up database schema..."
pnpm db:push
echo "✅ Schema created"
echo ""

# Seed data
echo "🌱 Seeding demo data..."
pnpm db:seed
echo "✅ Data seeded"
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Demo Credentials:"
echo "  Email: demo@carbonledger.com"
echo "  Password: demo123"
echo ""
echo "Start development with:"
echo "  pnpm dev"
echo ""
echo "Then open: http://localhost:3000"
echo "================================"
