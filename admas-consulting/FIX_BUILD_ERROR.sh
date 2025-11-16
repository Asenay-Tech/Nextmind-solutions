#!/bin/bash
# Fix build error: Missing autoprefixer and PostCSS plugins

set -e

echo "🔧 Fixing build error..."

# Navigate to app directory
cd /var/www/admasits/admas-consulting

# Step 1: Install all dependencies (including autoprefixer, postcss, tailwindcss)
echo "📦 Installing dependencies..."
npm install

# Step 2: Verify autoprefixer is installed
echo "✅ Verifying PostCSS plugins..."
npm list autoprefixer postcss tailwindcss || echo "⚠️  Some packages may be missing"

# Step 3: Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf .next

# Step 4: Fix port conflict (kill any process on port 3000)
echo "🔌 Checking port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use, killing process..."
    lsof -ti:3000 | xargs kill -9 || true
    sleep 2
fi

# Step 5: Stop PM2 process if running
echo "🛑 Stopping PM2 process..."
pm2 stop admas-site 2>/dev/null || pm2 delete admas-site 2>/dev/null || true

# Step 6: Rebuild application
echo "🏗️  Rebuilding application..."
export NODE_ENV=production
npm run build

# Step 7: Start with PM2
echo "🚀 Starting with PM2..."
pm2 start npm --name "admas-site" -- start

# Step 8: Save PM2 config
pm2 save

echo "✅ Build fix complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs admas-site"

