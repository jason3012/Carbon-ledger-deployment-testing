#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Carbon Ledger API..."
pnpm --filter @carbon-ledger/api dev

