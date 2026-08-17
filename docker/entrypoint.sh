#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app
npx prisma db push --accept-data-loss 2>&1 || echo "Prisma db push warning (non-fatal)"

echo "Starting PickFlick..."
exec node server.js
