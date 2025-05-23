#!/bin/bash
set -e

echo "🔧 Installing dependencies..."
npm ci

echo "🏗️ Building frontend..."
npx vite build

echo "📦 Building server..."
npx esbuild server/index.prod.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build completed successfully!"