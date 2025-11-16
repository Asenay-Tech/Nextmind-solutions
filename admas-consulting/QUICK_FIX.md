# Quick Fix: Missing autoprefixer Build Error

## Commands to Run on VPS

```bash
# 1. Navigate to app directory
cd /var/www/admasits/admas-consulting

# 2. Install dependencies (fixes missing autoprefixer)
npm install

# 3. Verify PostCSS plugins are installed
npm list autoprefixer postcss tailwindcss

# 4. Clean build cache
rm -rf .next

# 5. Fix port 3000 conflict (kill process if needed)
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 6. Stop errored PM2 process
pm2 stop admas-site 2>/dev/null || pm2 delete admas-site 2>/dev/null || true

# 7. Rebuild application
export NODE_ENV=production
npm run build

# 8. Start with PM2
pm2 start npm --name "admas-site" -- start

# 9. Save PM2 config
pm2 save

# 10. Verify
pm2 status
pm2 logs admas-site --lines 20
```

## One-Line Fix

```bash
cd /var/www/admasits/admas-consulting && npm install && rm -rf .next && pm2 delete admas-site 2>/dev/null || true && lsof -ti:3000 | xargs kill -9 2>/dev/null || true && export NODE_ENV=production && npm run build && pm2 start npm --name "admas-site" -- start && pm2 save
```

## Verify Fix

```bash
# Check PM2 status
pm2 status
# Should show admas-site as "online" (not "errored")

# Check logs
pm2 logs admas-site --lines 30
# Should show "Ready" message, no errors

# Test locally
curl http://localhost:3000
# Should return HTML
```

