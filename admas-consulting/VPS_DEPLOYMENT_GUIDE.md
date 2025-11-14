# 🚀 Hostinger VPS Deployment Guide - Next.js 16 with Full Features

## Overview

This guide will help you deploy your Next.js 16 application to Hostinger VPS with:
- ✅ Server-Side Rendering (SSR)
- ✅ API Routes
- ✅ Image Optimization
- ✅ Dynamic Features
- ✅ PM2 Process Management
- ✅ Nginx Reverse Proxy
- ✅ SSL/HTTPS with Let's Encrypt

**Your Domain:** `admasits.com`  
**VPS OS:** Ubuntu (recommended)

---

## 📋 Prerequisites

- ✅ Hostinger VPS with root/SSH access
- ✅ Domain `admasits.com` pointing to VPS IP
- ✅ Basic Linux command line knowledge
- ✅ Your Next.js project ready locally

---

## 🔧 STEP 1: Connect to Your VPS

### Get VPS Credentials

1. Log into Hostinger Panel: https://hpanel.hostinger.com
2. Go to **VPS** → **Your VPS**
3. Note down:
   - **IP Address** (e.g., `123.45.67.89`)
   - **Root Password** (or SSH key)

### Connect via SSH

**On Windows:**
- Use **PuTTY** (download: https://www.putty.org/)
- Or use **Windows Terminal** / **PowerShell**
- Or use **VS Code** with Remote SSH extension

**On Mac/Linux:**
- Use Terminal app

**SSH Command:**
```bash
ssh root@YOUR_VPS_IP
# Example: ssh root@123.45.67.89
```

Enter your root password when prompted.

**✅ If you see a command prompt like `root@vps:~#`, you're connected!**

---

## 🔧 STEP 2: Update System

```bash
# Update package list
apt update

# Upgrade system packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

---

## 🔧 STEP 3: Install Node.js

### Install Node.js 20.x (LTS)

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version
# Should show: v20.x.x

npm --version
# Should show: 10.x.x
```

**✅ If you see version numbers, Node.js is installed!**

---

## 🔧 STEP 4: Install PM2 (Process Manager)

PM2 keeps your Next.js app running 24/7 and restarts it if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
# Should show: 5.x.x or higher
```

**✅ PM2 is installed!**

---

## 🔧 STEP 5: Install Nginx

Nginx will act as a reverse proxy and handle SSL.

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx

# Enable Nginx to start on boot
systemctl enable nginx

# Check status
systemctl status nginx
# Should show: active (running)
```

**✅ Nginx is installed and running!**

---

## 🔧 STEP 6: Upload Your Project to VPS

### Option A: Using Git (Recommended)

**1. On your local computer:**
```bash
# Make sure your code is committed to Git
cd "C:\Users\henok\Nextmind solutions\admas-consulting"
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. On VPS:**
```bash
# Create app directory
mkdir -p /var/www/admasits
cd /var/www/admasits

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Or if you have a private repo, use SSH key
# git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git .
```

### Option B: Using SCP (Alternative)

**On your local computer (Windows PowerShell):**
```powershell
# Navigate to your project folder
cd "C:\Users\henok\Nextmind solutions\admas-consulting"

# Upload files (replace YOUR_VPS_IP)
scp -r . root@YOUR_VPS_IP:/var/www/admasits
```

**On VPS:**
```bash
# Create directory
mkdir -p /var/www/admasits
```

---

## 🔧 STEP 7: Install Project Dependencies

```bash
# Navigate to project directory
cd /var/www/admasits

# Install dependencies
npm install --production=false

# This might take 2-5 minutes
```

**✅ Dependencies installed!**

---

## 🔧 STEP 8: Build Your Application

```bash
# Make sure you're in project directory
cd /var/www/admasits

# Build the application
npm run build

# This will create .next folder with optimized production build
# Wait for "✓ Compiled successfully" message
```

**✅ Build complete!**

---

## 🔧 STEP 9: Configure Environment Variables

```bash
# Create .env.production file
nano /var/www/admasits/.env.production
```

**Add your environment variables:**
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://admasits.com
# Add any other environment variables you need
```

**Save:** Press `Ctrl + X`, then `Y`, then `Enter`

---

## 🔧 STEP 10: Start Application with PM2

```bash
# Navigate to project directory
cd /var/www/admasits

# Start Next.js with PM2
pm2 start npm --name "admasits" -- start

# Save PM2 configuration (so it restarts on server reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# This will show a command - copy and run it!

# Check status
pm2 status
# Should show "admasits" as "online"

# View logs
pm2 logs admasits
# Press Ctrl+C to exit logs
```

**✅ Your app is running!**

**Test it:**
```bash
# Check if app is listening
curl http://localhost:3000
# Should show HTML content
```

---

## 🔧 STEP 11: Configure Nginx Reverse Proxy

### Create Nginx Configuration

```bash
# Create configuration file
nano /etc/nginx/sites-available/admasits
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name admasits.com www.admasits.com;

    # Increase body size limit (for file uploads)
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;

    # Proxy to Next.js
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Cache images
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public";
    }
}
```

**Save:** Press `Ctrl + X`, then `Y`, then `Enter`

### Enable Site Configuration

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
# Should show: "syntax is ok" and "test is successful"

# Reload Nginx
systemctl reload nginx
```

**✅ Nginx configured!**

**Test:** Visit `http://admasits.com` in your browser - you should see your website!

---

## 🔧 STEP 12: Install SSL Certificate (Let's Encrypt)

### Install Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

### Get SSL Certificate

```bash
# Get certificate for your domain
certbot --nginx -d admasits.com -d www.admasits.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms (A)
# - Choose whether to redirect HTTP to HTTPS (2 - recommended)
```

**Wait 1-2 minutes** - Certbot will automatically:
- Get SSL certificate
- Update Nginx configuration
- Enable HTTPS redirect

**✅ SSL installed!**

**Test:** Visit `https://admasits.com` - you should see a padlock icon 🔒

---

## 🔧 STEP 13: Verify Everything Works

### Check PM2 Status

```bash
pm2 status
# Should show "admasits" as "online"
```

### Check Nginx Status

```bash
systemctl status nginx
# Should show "active (running)"
```

### Check SSL Certificate

```bash
certbot certificates
# Should show your certificate details
```

### Test Your Website

Visit in browser:
- ✅ `https://admasits.com` - Should load
- ✅ `https://admasits.com/en` - English version
- ✅ `https://admasits.com/de` - German version
- ✅ Check padlock icon (HTTPS working)

---

## 🔧 STEP 14: Setup Auto-Renewal for SSL

SSL certificates expire every 90 days. Let's set up auto-renewal:

```bash
# Test renewal (dry run)
certbot renew --dry-run

# Certbot automatically sets up renewal, but verify:
systemctl status certbot.timer
# Should show "active"
```

**✅ SSL will auto-renew!**

---

## 🔧 STEP 15: Firewall Configuration

### Configure UFW Firewall

```bash
# Enable firewall
ufw enable

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Check status
ufw status
# Should show rules for 22, 80, 443
```

**✅ Firewall configured!**

---

## 🔄 Updating Your Application

When you make changes to your code:

### Option A: Using Git (Recommended)

**1. On your local computer:**
```bash
git add .
git commit -m "Update description"
git push origin main
```

**2. On VPS:**
```bash
cd /var/www/admasits

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild application
npm run build

# Restart PM2
pm2 restart admasits

# Check logs
pm2 logs admasits --lines 50
```

### Option B: Manual Upload

**1. Upload files via SCP or FTP**

**2. On VPS:**
```bash
cd /var/www/admasits
npm install
npm run build
pm2 restart admasits
```

---

## 📊 Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs admasits

# View last 100 lines
pm2 logs admasits --lines 100

# Restart app
pm2 restart admasits

# Stop app
pm2 stop admasits

# Start app
pm2 start admasits

# Delete app from PM2
pm2 delete admasits

# Monitor (real-time)
pm2 monit

# View detailed info
pm2 show admasits
```

---

## 🔍 Troubleshooting

### Problem: Website shows "502 Bad Gateway"

**Solution:**
```bash
# Check if Next.js is running
pm2 status

# If not running, start it
pm2 start npm --name "admasits" -- start

# Check logs for errors
pm2 logs admasits
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process or change port in package.json
```

### Problem: SSL certificate not working

**Solution:**
```bash
# Check certificate
certbot certificates

# Renew manually if needed
certbot renew

# Reload Nginx
systemctl reload nginx
```

### Problem: Changes not showing

**Solution:**
```bash
# Rebuild application
cd /var/www/admasits
npm run build

# Restart PM2
pm2 restart admasits

# Clear browser cache
```

### Problem: Out of memory

**Solution:**
```bash
# Check memory usage
free -h

# Increase Node.js memory limit
pm2 delete admasits
pm2 start npm --name "admasits" -- start --max-memory-restart 1G
pm2 save
```

---

## 🔐 Security Best Practices

### 1. Create Non-Root User

```bash
# Create new user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Switch to new user
su - deploy
```

### 2. Disable Root SSH Login

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change: PermitRootLogin yes → PermitRootLogin no
# Save and restart SSH
sudo systemctl restart sshd
```

### 3. Setup Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 4. Regular Updates

```bash
# Update system weekly
sudo apt update && sudo apt upgrade -y
```

---

## 📈 Monitoring & Performance

### Setup PM2 Monitoring (Optional)

```bash
# Install PM2 Plus (free monitoring)
pm2 link YOUR_SECRET_KEY YOUR_PUBLIC_KEY

# Or use PM2 web dashboard
pm2 web
# Visit: http://YOUR_VPS_IP:9615
```

### Monitor Resources

```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# Check logs
pm2 logs admasits
```

---

## 📝 Quick Reference

**Project Location:**
```
/var/www/admasits
```

**PM2 Commands:**
```bash
pm2 start npm --name "admasits" -- start
pm2 restart admasits
pm2 logs admasits
pm2 status
```

**Nginx Config:**
```
/etc/nginx/sites-available/admasits
```

**SSL Certificate:**
```bash
certbot --nginx -d admasits.com -d www.admasits.com
certbot renew
```

**Useful Commands:**
```bash
# Rebuild and restart
cd /var/www/admasits && npm run build && pm2 restart admasits

# View logs
pm2 logs admasits --lines 100

# Check Nginx
nginx -t
systemctl reload nginx
```

---

## ✅ Deployment Checklist

- [ ] VPS accessible via SSH
- [ ] Node.js 20.x installed
- [ ] PM2 installed and configured
- [ ] Nginx installed and running
- [ ] Project uploaded to `/var/www/admasits`
- [ ] Dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] PM2 running application
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed
- [ ] HTTPS redirect working
- [ ] Firewall configured
- [ ] Website accessible at `https://admasits.com`
- [ ] Both `/en` and `/de` routes working
- [ ] SSL auto-renewal configured

---

## 🎉 Congratulations!

Your Next.js application is now live on Hostinger VPS with:
- ✅ Full SSR support
- ✅ API routes working
- ✅ Image optimization enabled
- ✅ SSL/HTTPS secured
- ✅ Auto-restart on crashes
- ✅ Production-ready setup

**Your website:** https://admasits.com

---

## 📞 Support

- **Hostinger Support:** https://www.hostinger.com/contact
- **PM2 Docs:** https://pm2.keymetrics.io/
- **Nginx Docs:** https://nginx.org/en/docs/
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** 2025-11-13  
**Status:** ✅ Ready for VPS Deployment

