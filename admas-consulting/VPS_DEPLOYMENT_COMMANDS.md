# 🚀 VPS Deployment Commands - Exact Linux Terminal Steps

Complete step-by-step commands to build and run the Next.js app on a Linux VPS.

## Prerequisites

- Ubuntu 24.04 VPS with root/SSH access
- Node.js 20.x LTS installed
- Git installed
- Domain DNS configured (admasits.com → VPS IP)

---

## Step 1: Connect to VPS

```bash
ssh root@72.156.126
```

---

## Step 2: Install Node.js (if not installed)

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

## Step 3: Clone Repository

```bash
# Create application directory
mkdir -p /var/www/admasits
cd /var/www/admasits

# Clone repository
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .

# Navigate to app directory
cd admas-consulting
```

---

## Step 4: Install Dependencies

```bash
# Install production and development dependencies
npm ci --production=false

# Or if npm ci fails, use:
npm install
```

---

## Step 5: Type Check (Verify TypeScript)

```bash
# Run TypeScript type checking
npm run type-check

# Expected output: No errors (or fix any errors shown)
```

---

## Step 6: Build Application

```bash
# Set production environment
export NODE_ENV=production

# Build the Next.js application
npm run build

# This will:
# 1. Run type-check automatically (via prebuild script)
# 2. Build the application
# 3. Create optimized production build in .next/ directory
# 4. Show "Build completed successfully" message

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

---

## Step 7: Start Application

### Option A: Direct Start (Testing)

```bash
# Start the application on port 3000
npm start

# Or use production-specific script:
npm run start:production

# Application will be available at:
# http://localhost:3000
# http://localhost:3000/en (English)
# http://localhost:3000/de (German)
```

### Option B: PM2 (Production - Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "admas-site" -- start

# Or use ecosystem config (if created):
# pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Enable PM2 startup script (follow instructions)
pm2 startup

# Check status
pm2 status

# View logs
pm2 logs admas-site

# Monitor
pm2 monit
```

---

## Step 8: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/admasits << 'EOF'
server {
    listen 80;
    server_name admasits.com www.admasits.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## Step 9: Install SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d admasits.com -d www.admasits.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended: Yes)

# Verify certificate
certbot certificates
```

---

## Step 10: Set Up Auto-Renewal

```bash
# Edit crontab
crontab -e

# Add this line (checks daily at 3 AM):
0 3 * * * /usr/bin/certbot renew --quiet
```

---

## Quick Reference: All Commands in Sequence

```bash
# 1. SSH into VPS
ssh root@72.156.126

# 2. Navigate to app directory
cd /var/www/admasits/admas-consulting

# 3. Install dependencies (first time only)
npm ci --production=false

# 4. Type check
npm run type-check

# 5. Build application
export NODE_ENV=production
npm run build

# 6. Start with PM2
pm2 start npm --name "admas-site" -- start
pm2 save
pm2 startup

# 7. Verify application is running
pm2 status
curl http://localhost:3000

# 8. Configure Nginx (see Step 8 above)

# 9. Install SSL (see Step 9 above)

# 10. Verify site
curl https://admasits.com
```

---

## Update Application (Future Deploys)

```bash
# Navigate to app directory
cd /var/www/admasits/admas-consulting

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm ci --production=false

# Type check
npm run type-check

# Build application
export NODE_ENV=production
npm run build

# Restart PM2 process
pm2 restart admas-site

# Or if using npm start directly:
# Ctrl+C to stop, then: npm start
```

---

## Troubleshooting

### Build Fails

```bash
# Check for TypeScript errors
npm run type-check

# Clean build cache
rm -rf .next
npm run build
```

### Application Won't Start

```bash
# Check if port 3000 is in use
netstat -tlnp | grep 3000
lsof -i :3000

# Check PM2 logs
pm2 logs admas-site --lines 100

# Restart PM2
pm2 restart admas-site
```

### TypeScript Errors

```bash
# Run type check with verbose output
npm run type-check

# Check tsconfig.json
cat tsconfig.json

# Verify all dependencies are installed
npm install
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or change port in .env or package.json
export PORT=3001
npm start
```

---

## Environment Variables (Optional)

```bash
# Create .env.production file
cat > /var/www/admasits/admas-consulting/.env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://admasits.com
EOF

# Restart application after creating .env
pm2 restart admas-site
```

---

## Monitoring Commands

```bash
# PM2 status
pm2 status

# PM2 logs
pm2 logs admas-site --lines 50

# PM2 monitor
pm2 monit

# System resources
htop
df -h
free -h

# Application logs
tail -f ~/.pm2/logs/admas-site-out.log
tail -f ~/.pm2/logs/admas-site-error.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Success Checklist

- [ ] Node.js 20.x installed: `node --version`
- [ ] Repository cloned: `ls /var/www/admasits/admas-consulting`
- [ ] Dependencies installed: `ls node_modules`
- [ ] Type check passes: `npm run type-check` (no errors)
- [ ] Build successful: `npm run build` (no errors)
- [ ] Application starts: `npm start` or `pm2 status`
- [ ] Port 3000 accessible: `curl http://localhost:3000`
- [ ] Nginx configured: `nginx -t`
- [ ] SSL installed: `certbot certificates`
- [ ] Site accessible: `curl https://admasits.com`

---

## Production Checklist

- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] All type errors resolved
- [ ] Build completes without warnings
- [ ] Application runs on port 3000
- [ ] PM2 configured for auto-restart
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (UFW recommended)
- [ ] Monitoring setup (PM2 monit)
- [ ] Backup strategy in place

---

## Exact Build and Start Commands Summary

```bash
# Build (run once, or when code changes)
cd /var/www/admasits/admas-consulting
npm ci --production=false
npm run type-check
export NODE_ENV=production
npm run build

# Start (run once, or use PM2 for production)
npm start

# Or with PM2 (production):
pm2 start npm --name "admas-site" -- start
pm2 save
```

