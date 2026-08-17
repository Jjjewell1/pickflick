#!/bin/sh
set -e

echo "Initializing database..."
cd /app
mkdir -p /app/data
chown -R nextjs:nodejs /app/data
DATABASE_URL="file:/app/data/pickflick.db" ./node_modules/.bin/prisma db push --skip-generate 2>&1 || echo "DB init warning (non-fatal)"
chown -R nextjs:nodejs /app/data

echo "Starting PickFlick..."
exec node server.js
