#!/bin/sh
set -e

echo "Initializing database..."
cd /app
mkdir -p /app/data
node ./node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate 2>&1 || echo "DB init warning (non-fatal)"

echo "Starting PickFlick..."
exec node server.js
