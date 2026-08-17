#!/bin/bash
docker exec ellrcj5pdigaqtowqf8qif6x-125332723823 ls -la /app/data/pickflick.db
echo "---"
# Check table schema
docker exec ellrcj5pdigaqtowqf8qif6x-125332723823 node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.profile.findMany().then(p => console.log('Profiles:', JSON.stringify(p))).catch(e => console.log('Error:', e.message)).finally(() => prisma.\$disconnect());
"
