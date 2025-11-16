# 🚀 Complete Deployment Guide - Local & VPS

## 📋 Table of Contents
1. [Local Setup & GitHub Push](#local-setup--github-push)
2. [VPS Deployment](#vps-deployment)
3. [Quick Reference](#quick-reference)

---

## 🖥️ LOCAL SETUP & GITHUB PUSH

### STEP 1: Open Terminal/Command Prompt

**On Windows:**
- Press `Windows Key + R`
- Type `cmd` and press Enter
- OR open PowerShell
- OR use VS Code Terminal (Ctrl + `)

**Navigate to your project:**
```powershell
cd "C:\Users\henok\Nextmind solutions"
```

---

### STEP 2: Configure Git User (If Not Already Done)

```powershell
# Set your GitHub username
git config user.name "Asenay-Tech"

# Set your email (use your GitHub email)
git config user.email "henokasenay100@gmail.com"

# Verify configuration
git config user.name
git config user.email
```

**Expected Output:**
```
Asenay-Tech
henokasenay100@gmail.com
```

---

### STEP 3: Initialize Git Repository (If Not Already Done)

```powershell
# Initialize Git repository
git init

# Check status
git status
```

**Expected Output:** Shows "On branch main" or "On branch master"

---

### STEP 4: Add All Files to Git

```powershell
# Add all files
git add .

# Check what will be committed
git status
```

**Expected Output:** Shows all files as "new file:" or "modified:"

---

### STEP 5: Create Initial Commit

```powershell
# Commit all files
git commit -m "Initial commit"

# Check commit history
git log --oneline -1
```

**Expected Output:**
```
[commit-hash] Initial commit
```

---

### STEP 6: Rename Branch to Main (If Needed)

```powershell
# Rename branch to main
git branch -M main

# Verify branch name
git branch
```

**Expected Output:** Shows `* main`

---

### STEP 7: Add GitHub Remote

```powershell
# Add remote repository
git remote add origin https://github.com/Asenay-Tech/Nextmind-solutions.git

# Verify remote
git remote -v
```

**Expected Output:**
```
origin  https://github.com/Asenay-Tech/Nextmind-solutions.git (fetch)
origin  https://github.com/Asenay-Tech/Nextmind-solutions.git (push)
```

---

### STEP 8: Push to GitHub

```powershell
# Push to GitHub
git push -u origin main
```

**What happens:**
- You'll be prompted for GitHub credentials
- Use your GitHub username and Personal Access Token (not password)
- If you don't have a token, create one: https://github.com/settings/tokens

**Expected Output:**
```
Enumerating objects: 171, done.
Counting objects: 100% (171/171), done.
Compressing objects: 100% (154/154), done.
Writing objects: 100% (171/171), 29.25 MiB | 5.05 MiB/s, done.
Total 171 (delta 17), reused 0 (delta 0)
To https://github.com/Asenay-Tech/Nextmind-solutions.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**✅ Success!** Your code is now on GitHub at: `https://github.com/Asenay-Tech/Nextmind-solutions`

---

### STEP 9: Verify Push

```powershell
# Check status
git status

# View remote branches
git branch -r
```

**Expected Output:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

---

## 🖥️ VPS DEPLOYMENT (Hostinger)

### Prerequisites Checklist

- [ ] VPS IP address: `72.61.156.126`
- [ ] SSH access (root password)
- [ ] Domain `admasits.com` points to VPS IP
- [ ] GitHub repository is ready

---

### STEP 1: Connect to VPS via SSH

**On Windows (PowerShell):**
```powershell
ssh root@72.61.156.126
```

**On Windows (PuTTY):**
1. Download PuTTY: https://www.putty.org/
2. Enter IP: `72.61.156.126`
3. Port: `22`
4. Click "Open"
5. Enter username: `root`
6. Enter password when prompted

**Expected Output:**
```
Welcome to Ubuntu 24.04.3 LTS
root@srv1057930:~#
```

---

### STEP 2: Update System

```bash
# Update package list
apt update

# Upgrade system packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

**Wait for completion** (may take 2-5 minutes)

---

### STEP 3: Install Node.js 20.x

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version
npm --version
```

**Expected Output:**
```
v20.x.x
10.x.x
```

---

### STEP 4: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

**Expected Output:** `5.x.x` or higher

---

### STEP 5: Install Nginx

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx

# Enable Nginx on boot
systemctl enable nginx

# Check status
systemctl status nginx
```

**Expected Output:** `active (running)`

---

### STEP 6: Clone Your Repository

```bash
# Create app directory
mkdir -p /var/www/admasits
cd /var/www/admasits

# Clone your GitHub repository
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .

# Navigate to project folder
cd admas-consulting
```

**Note:** If repository is private, you'll need to:
1. Use SSH key, OR
2. Use Personal Access Token in URL: `https://TOKEN@github.com/Asenay-Tech/Nextmind-solutions.git`

---

### STEP 7: Install Dependencies

```bash
# Make sure you're in project directory
cd /var/www/admasits/admas-consulting

# Install dependencies
npm install

# This will take 2-5 minutes
```

**Expected Output:** Shows package installation progress

---

### STEP 8: Build Application

```bash
# Build for production
npm run build

# Wait for completion
# Should see: "✓ Compiled successfully"
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

---

### STEP 9: Create Environment File

```bash
# Create .env.production file
nano .env.production
```

**Add these lines:**
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://admasits.com
```

**Save:** Press `Ctrl + X`, then `Y`, then `Enter`

---

### STEP 10: Start Application with PM2

```bash
# Start Next.js with PM2
pm2 start npm --name "admasits" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**Important:** The `pm2 startup` command will show a command like:
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Copy and run that command!**

**Check status:**
```bash
pm2 status
pm2 logs admasits
```

**Expected Output:**
```
┌─────┬───────────┬─────────┬─────────┬──────────┐
│ id  │ name      │ status  │ cpu     │ memory   │
├─────┼───────────┼─────────┼─────────┼─────────┤
│ 0   │ admasits  │ online  │ 0%      │ 45.2mb   │
└─────┴───────────┴─────────┴─────────┴──────────┘
```

---

### STEP 11: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/admasits
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name admasits.com www.admasits.com;

    # Increase body size limit
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

**Enable site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

**Expected Output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### STEP 12: Install SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d admasits.com -d www.admasits.com
```

**Follow the prompts:**
1. Enter your email address
2. Agree to terms (type `A` and press Enter)
3. Choose redirect HTTP to HTTPS (option `2` recommended)

**Wait 1-2 minutes** for certificate installation

**Verify SSL:**
```bash
certbot certificates
```

**Expected Output:** Shows certificate details with expiration date

---

### STEP 13: Configure Firewall

```bash
# Enable firewall
ufw enable

# Allow SSH (important!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Check status
ufw status
```

**Expected Output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

### STEP 14: Test Your Website

**In your browser:**
1. Visit: `https://admasits.com`
2. Should see your website loading
3. Check padlock icon 🔒 (HTTPS working)

**On VPS (test locally):**
```bash
# Test if app is running
curl http://localhost:3000

# Check PM2 status
pm2 status

# View logs
pm2 logs admasits --lines 50
```

---

### STEP 15: Verify Everything Works

**Checklist:**
- [ ] Website loads at `https://admasits.com`
- [ ] English version works: `https://admasits.com/en`
- [ ] German version works: `https://admasits.com/de`
- [ ] Language switcher functions
- [ ] All images display correctly
- [ ] Navigation links work
- [ ] SSL certificate valid (padlock icon)
- [ ] PM2 shows app as "online"
- [ ] Nginx is running

---

## 🔄 UPDATING YOUR APPLICATION

### When You Make Changes Locally:

**1. On Your Local Computer:**
```powershell
cd "C:\Users\henok\Nextmind solutions"

# Pull latest (if working with others)
git pull origin main

# Make your changes...
# Then commit
git add .
git commit -m "Your commit message"
git push origin main
```

**2. On VPS:**
```bash
cd /var/www/admasits/admas-consulting

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

---

## 📊 QUICK REFERENCE

### Local Commands

```powershell
# Navigate to project
cd "C:\Users\henok\Nextmind solutions"

# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main
```

### VPS Commands

```bash
# Navigate to project
cd /var/www/admasits/admas-consulting

# Pull updates
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart app
pm2 restart admasits

# View logs
pm2 logs admasits

# Check status
pm2 status

# Nginx reload
systemctl reload nginx

# Check Nginx config
nginx -t
```

---

## 🆘 TROUBLESHOOTING

### Problem: Can't push to GitHub

**Solution:**
1. Create Personal Access Token: https://github.com/settings/tokens
2. Use token as password when pushing
3. Or setup SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Problem: VPS shows "502 Bad Gateway"

**Solution:**
```bash
# Check if Next.js is running
pm2 status

# If not running, start it
cd /var/www/admasits/admas-consulting
pm2 start npm --name "admasits" -- start

# Check logs for errors
pm2 logs admasits
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

### Problem: Changes not showing after update

**Solution:**
```bash
# Rebuild application
npm run build

# Restart PM2
pm2 restart admasits

# Clear browser cache
```

---

## ✅ FINAL CHECKLIST

### Local Setup:
- [ ] Git configured with name and email
- [ ] Repository initialized
- [ ] Files committed
- [ ] Remote added
- [ ] Code pushed to GitHub

### VPS Setup:
- [ ] Connected via SSH
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Application built
- [ ] PM2 running app
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Website accessible

---

## 🎉 SUCCESS!

**Your website is now live at:**
- 🌐 **https://admasits.com**
- 🇬🇧 **https://admasits.com/en** (English)
- 🇩🇪 **https://admasits.com/de** (German)

**GitHub Repository:**
- 📦 **https://github.com/Asenay-Tech/Nextmind-solutions**

---

**Last Updated:** 2025-11-14  
**Status:** ✅ Complete Guide

