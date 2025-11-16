# 🚀 Quick Deployment Guide - AdmasITS to VPS

## One-Command Deployment (Automated)

SSH into your VPS and run:

```bash
ssh root@72.156.126

# Download and run deployment script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/deploy-vps.sh
chmod +x deploy-vps.sh
./deploy-vps.sh
```

## Manual Step-by-Step (Recommended)

### 1. SSH into VPS

```bash
ssh root@72.156.126
```

### 2. Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git
```

### 3. Clone & Setup Project

```bash
# Create app directory
mkdir -p /var/www/admasits
cd /var/www/admasits

# Clone repository
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting

# Install dependencies
npm ci --production=false

# Build application
NODE_ENV=production npm run build
```

### 4. Start with PM2

```bash
# Create PM2 ecosystem config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'admas-site',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/admasits/admas-consulting',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/admasits/logs/pm2-error.log',
    out_file: '/var/www/admasits/logs/pm2-out.log',
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
EOF

# Create logs directory
mkdir -p /var/www/admasits/logs

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions shown
```

### 5. Configure Nginx

```bash
# Create Nginx config
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

# Test and reload
nginx -t
systemctl reload nginx
```

### 6. Configure DNS

In your Hostinger domain settings, point DNS to VPS:

- **A Record:** `@` → `72.156.126`
- **A Record:** `www` → `72.156.126`

Wait for DNS propagation (1-24 hours, usually 1-2 hours).

### 7. Install SSL Certificate

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d admasits.com -d www.admasits.com

# Follow the prompts (enter email, agree to terms, etc.)
```

### 8. Auto-Renew SSL

```bash
# Edit crontab
crontab -e

# Add this line:
0 3 * * * /usr/bin/certbot renew --quiet
```

## Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs admas-site --lines 20

# Check Nginx status
systemctl status nginx

# Test site
curl http://localhost:3000
```

## Update Application (Future Deploys)

```bash
cd /var/www/admasits
git pull origin main
cd admas-consulting
npm ci --production=false
NODE_ENV=production npm run build
pm2 restart admas-site
```

## Troubleshooting

### Application Not Starting
```bash
pm2 logs admas-site --lines 50
pm2 restart admas-site
```

### Nginx 502 Error
```bash
# Check if app is running
pm2 status

# Check if port 3000 is in use
netstat -tlnp | grep 3000
```

### SSL Certificate Issues
```bash
certbot renew --dry-run
certbot certificates
```

## Success ✅

Your app should be live at:
- **HTTP:** http://admasits.com
- **HTTPS:** https://admasits.com (after SSL setup)

