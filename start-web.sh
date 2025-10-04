#!/bin/bash
cd "$(dirname "$0")"
echo "🌐 Starting Carbon Ledger Web..."
pnpm --filter @carbon-ledger/web dev

