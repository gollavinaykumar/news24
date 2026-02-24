#!/usr/bin/env bash
set -o errexit

echo "==> Installing dependencies..."
npm install

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running database migrations..."
npx prisma migrate deploy

echo "==> Building TypeScript..."
npm run build

echo "==> Seeding database..."
npm run seed || echo "Seeding skipped (may already be seeded)"

echo "==> Build complete!"
