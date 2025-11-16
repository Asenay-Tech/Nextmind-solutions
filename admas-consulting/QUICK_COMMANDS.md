# ⚡ Quick Commands Reference

## 🖥️ LOCAL COMMANDS (Windows PowerShell)

### Initial Setup
```powershell
# Navigate to project
cd "C:\Users\henok\Nextmind solutions"

# Configure Git
git config user.name "Asenay-Tech"
git config user.email "henokasenay100@gmail.com"

# Initialize (if needed)
git init
git branch -M main

# Add remote
git remote add origin https://github.com/Asenay-Tech/Nextmind-solutions.git
```

### Daily Workflow
```powershell
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest
git pull origin main
```

---

## 🖥️ VPS COMMANDS (Linux/Ubuntu)

### First Time Setup
```bash
# Connect to VPS
ssh root@72.61.156.126

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Clone repository
mkdir -p /var/www/admasits
cd /var/www/admasits
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .

# Setup project
cd admas-consulting
npm install
npm run build

# Start with PM2
pm2 start npm --name "admasits" -- start
pm2 save
pm2 startup  # Run the command it shows!

# Install SSL
apt install -y certbot python3-certbot-nginx
certbot --nginx -d admasits.com -d www.admasits.com
```

### Update Application
```bash
cd /var/www/admasits/admas-consulting
git pull origin main
npm install
npm run build
pm2 restart admasits
```

### Check Status
```bash
# PM2 status
pm2 status
pm2 logs admasits

# Nginx status
systemctl status nginx
nginx -t

# SSL status
certbot certificates
```

---

## 📝 Copy-Paste Ready Commands

### Complete Local Setup (One Block)
```powershell
cd "C:\Users\henok\Nextmind solutions"
git config user.name "Asenay-Tech"
git config user.email "henokasenay100@gmail.com"
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Asenay-Tech/Nextmind-solutions.git
git push -u origin main
```

### Complete VPS Setup (One Block)
```bash
ssh root@72.61.156.126
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs npm nginx certbot python3-certbot-nginx
npm install -g pm2
mkdir -p /var/www/admasits && cd /var/www/admasits
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting
npm install
npm run build
pm2 start npm --name "admasits" -- start
pm2 save
pm2 startup
certbot --nginx -d admasits.com -d www.admasits.com
```

---

**Quick Access:**
- 📖 Full Guide: `COMPLETE_DEPLOYMENT_GUIDE.md`
- ✅ Checklist: `VPS_DEPLOYMENT_CHECKLIST.md`

