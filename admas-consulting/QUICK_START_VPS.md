# Quick Start Guide for VPS

## Prerequisites Check

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Navigate to app directory
cd /var/www/admasits/admas-consulting

# Verify you're in the right place
pwd
# Should output: /var/www/admasits/admas-consulting

# Check package.json exists
ls -la package.json
# Should show the file
```

---

## Step 1: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 1234 packages in 45s
```

---

## Step 2: Verify Scripts Work

```bash
# Check available scripts
npm run
# Should list: dev, build, start, type-check, etc.

# Test type-check
npm run type-check
# May show some TypeScript errors (non-blocking for build)

# Test build
npm run build
# Should complete successfully
```

---

## Step 3: Build for Production

```bash
export NODE_ENV=production
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
Build completed successfully
```

---

## Step 4: Start with PM2

### Option A: Simple One-Line Command

```bash
pm2 start npm --name "admas-site" -- start
```

### Option B: With Production Environment

```bash
NODE_ENV=production pm2 start npm --name "admas-site" -- start
```

### Option C: Using Ecosystem Config

```bash
pm2 start ecosystem.config.js
```

---

## Step 5: Verify It's Running

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬──────────────┬─────────┬─────────┬──────────┐
# │ id  │ name         │ status  │ restart │ uptime   │
# ├─────┼──────────────┼─────────┼─────────┼──────────┤
# │ 0   │ admas-site   │ online  │ 0       │ 2s       │
# └─────┴──────────────┴─────────┴─────────┴──────────┘

# Check logs
pm2 logs admas-site --lines 20

# Test locally
curl http://localhost:3000
```

---

## Step 6: Save and Enable Auto-Start

```bash
# Save PM2 configuration
pm2 save

# Enable PM2 to start on system reboot
pm2 startup
# Follow the instructions shown (usually involves running a sudo command)
```

---

## Troubleshooting "Missing Script" Errors

### Problem: `npm run build` says "Missing script: build"

**Solution 1: Verify Directory**
```bash
# Make sure you're in the right directory
cd /var/www/admasits/admas-consulting

# Verify package.json exists
cat package.json | grep -A 5 "scripts"
```

**Solution 2: Reinstall Dependencies**
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Solution 3: Check Node.js Version**
```bash
# Verify Node.js is installed
node --version
# Should be v18.x.x or higher (v20.x.x recommended)

# If not installed, install Node.js 20 LTS:
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

## Complete Setup Script

Copy and paste this entire block:

```bash
#!/bin/bash
set -e  # Exit on error

echo "🚀 Setting up AdmasITS Next.js App..."

# Navigate to app directory
cd /var/www/admasits/admas-consulting

# Verify package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: package.json not found!"
    echo "Current directory: $(pwd)"
    echo "Please ensure you're in the correct directory."
    exit 1
fi

echo "✅ Found package.json"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify scripts
echo "📋 Available scripts:"
npm run

# Type check (optional, may show non-critical errors)
echo "🔍 Running type check..."
npm run type-check || echo "⚠️  Type check completed with warnings"

# Build application
echo "🏗️  Building application..."
export NODE_ENV=production
npm run build

# Start with PM2
echo "🚀 Starting with PM2..."
pm2 start npm --name "admas-site" -- start || pm2 restart admas-site

# Save PM2 config
pm2 save

echo "✅ Setup complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs admas-site"
echo "🌐 Test: curl http://localhost:3000"
```

Save as `setup.sh` and run:
```bash
chmod +x setup.sh
./setup.sh
```

---

## One-Line PM2 Start Command

**From any directory:**
```bash
cd /var/www/admasits/admas-consulting && pm2 start npm --name "admas-site" -- start
```

**With production environment:**
```bash
cd /var/www/admasits/admas-consulting && NODE_ENV=production pm2 start npm --name "admas-site" -- start
```

**Using ecosystem config:**
```bash
cd /var/www/admasits/admas-consulting && pm2 start ecosystem.config.js
```

---

## Quick Reference

```bash
# Navigate to app
cd /var/www/admasits/admas-consulting

# Install dependencies (first time only)
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "admas-site" -- start

# View status
pm2 status

# View logs
pm2 logs admas-site

# Restart
pm2 restart admas-site

# Stop
pm2 stop admas-site
```

