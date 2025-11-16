# PM2 Production Setup Guide

## Quick PM2 Start Command

```bash
cd /var/www/admasits/admas-consulting && pm2 start npm --name "admas-site" -- start
```

Or using the ecosystem config file:

```bash
cd /var/www/admasits/admas-consulting && pm2 start ecosystem.config.js
```

---

## Troubleshooting "Missing Script" Errors

### 1. Verify You're in the Correct Directory

```bash
# Check current directory
pwd
# Should show: /var/www/admasits/admas-consulting

# If not, navigate there:
cd /var/www/admasits/admas-consulting
```

### 2. Verify package.json Exists

```bash
# Check if package.json exists
ls -la package.json
# Should show the file

# View package.json contents
cat package.json | grep -A 10 "scripts"
```

### 3. Verify node_modules Are Installed

```bash
# Check if node_modules exists
ls -la node_modules | head -5

# If missing, install dependencies:
npm install
# or
npm ci --production=false
```

### 4. Verify Node.js and npm Are Installed

```bash
# Check Node.js version
node --version
# Should show: v20.x.x or higher

# Check npm version
npm --version
# Should show: 10.x.x or higher
```

---

## Complete PM2 Setup Process

### Step 1: Navigate to App Directory

```bash
cd /var/www/admasits/admas-consulting
```

### Step 2: Install Dependencies (If Not Done)

```bash
npm install
```

### Step 3: Build the Application

```bash
npm run build
```

### Step 4: Start with PM2

```bash
# Option A: Simple command
pm2 start npm --name "admas-site" -- start

# Option B: Using ecosystem config
pm2 start ecosystem.config.js

# Option C: Explicit with production environment
NODE_ENV=production pm2 start npm --name "admas-site" -- start
```

### Step 5: Save PM2 Configuration

```bash
pm2 save
```

### Step 6: Enable PM2 Startup (Auto-start on reboot)

```bash
pm2 startup
# Follow the instructions shown
```

---

## PM2 Management Commands

```bash
# View all processes
pm2 status

# View logs
pm2 logs admas-site

# View last 100 lines
pm2 logs admas-site --lines 100

# Restart application
pm2 restart admas-site

# Stop application
pm2 stop admas-site

# Delete application
pm2 delete admas-site

# Monitor resources
pm2 monit

# View detailed info
pm2 describe admas-site
```

---

## One-Line PM2 Start Command

**From any directory:**
```bash
cd /var/www/admasits/admas-consulting && pm2 start npm --name "admas-site" -- start
```

**From the app directory:**
```bash
pm2 start npm --name "admas-site" -- start
```

---

## Expected Project Structure

```
/var/www/admasits/
└── admas-consulting/          # Main app directory
    ├── package.json           # ✅ Must exist
    ├── next.config.mjs        # ✅ Next.js config
    ├── tsconfig.json          # ✅ TypeScript config
    ├── ecosystem.config.js    # ✅ PM2 config (optional)
    ├── app/                   # ✅ Next.js App Router
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── [locale]/
    ├── components/            # ✅ React components
    ├── public/                # ✅ Static assets
    ├── lib/                   # ✅ Utilities
    ├── messages/              # ✅ i18n translations
    ├── node_modules/          # ✅ Dependencies (after npm install)
    └── .next/                 # ✅ Build output (after npm run build)
```

---

## Verification Checklist

Run these commands to verify everything is set up correctly:

```bash
# 1. Check you're in the right directory
pwd
# Expected: /var/www/admasits/admas-consulting

# 2. Verify package.json exists
test -f package.json && echo "✅ package.json exists" || echo "❌ package.json missing"

# 3. Verify node_modules exists
test -d node_modules && echo "✅ node_modules exists" || echo "❌ node_modules missing - run: npm install"

# 4. Check scripts in package.json
npm run | grep -E "(dev|build|start|type-check)"
# Should show all scripts

# 5. Test type-check
npm run type-check
# Should complete without errors (or show specific errors)

# 6. Test build
npm run build
# Should complete successfully

# 7. Verify PM2 is installed
pm2 --version
# Should show version number
```

---

## Common Issues and Solutions

### Issue: "Missing script: build"
**Solution:** You're not in the correct directory. Navigate to `/var/www/admasits/admas-consulting`

### Issue: "Cannot find module"
**Solution:** Dependencies not installed. Run `npm install`

### Issue: "Command not found: npm"
**Solution:** Node.js/npm not installed. Install Node.js 20.x LTS

### Issue: PM2 not found
**Solution:** Install PM2 globally: `npm install -g pm2`

---

## Production Environment Setup

```bash
# Set production environment
export NODE_ENV=production

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "admas-site" -- start -- --port 3000

# Or use ecosystem config
pm2 start ecosystem.config.js
```

---

## Full Deployment Script

```bash
#!/bin/bash
cd /var/www/admasits/admas-consulting
npm ci --production=false
npm run type-check
export NODE_ENV=production
npm run build
pm2 restart admas-site || pm2 start npm --name "admas-site" -- start
pm2 save
```

