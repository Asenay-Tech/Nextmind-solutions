#!/bin/bash

# AdmasITS - Complete VPS Deployment Script
# This script automates the entire deployment process from scratch
# Usage: Run this script on your VPS as root

set -e  # Exit on error

echo "🚀 Starting AdmasITS Complete Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="admasits.com"
WWW_DOMAIN="www.admasits.com"
APP_DIR="/var/www/admasits"
REPO_URL="https://github.com/Asenay-Tech/Nextmind-solutions.git"
APP_NAME="admas-site"
NODE_VERSION="20"  # LTS version

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or use sudo${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   AdmasITS VPS Deployment Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Update system
echo -e "${YELLOW}[1/10] 📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Step 2: Install Node.js
echo -e "${YELLOW}[2/10] 📦 Installing Node.js ${NODE_VERSION}...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
else
    echo -e "${GREEN}✓ Node.js already installed: $(node --version)${NC}"
fi

# Verify Node.js and npm
NODE_VERSION_INSTALLED=$(node --version)
NPM_VERSION_INSTALLED=$(npm --version)
echo -e "${GREEN}✓ Node.js: $NODE_VERSION_INSTALLED${NC}"
echo -e "${GREEN}✓ npm: $NPM_VERSION_INSTALLED${NC}"

# Step 3: Install PM2
echo -e "${YELLOW}[3/10] 📦 Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 already installed: $(pm2 --version)${NC}"
fi

# Step 4: Install Nginx
echo -e "${YELLOW}[4/10] 📦 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# Step 5: Install Git
echo -e "${YELLOW}[5/10] 📦 Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt install -y git
else
    echo -e "${GREEN}✓ Git already installed: $(git --version)${NC}"
fi

# Step 6: Clone or update repository
echo -e "${YELLOW}[6/10] 📥 Cloning repository...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Directory exists, pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin main || git pull origin master || true
    cd admas-consulting 2>/dev/null || true
else
    mkdir -p $APP_DIR
    cd $APP_DIR
    git clone $REPO_URL .
    cd admas-consulting
fi

# Step 7: Install dependencies
echo -e "${YELLOW}[7/10] 📦 Installing dependencies...${NC}"
npm ci --production=false

# Step 8: Build application
echo -e "${YELLOW}[8/10] 🔨 Building application...${NC}"
NODE_ENV=production npm run build

# Step 9: Create PM2 ecosystem file
echo -e "${YELLOW}[9/10] ⚙️  Configuring PM2...${NC}"
cat > $APP_DIR/admas-consulting/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$APP_DIR/admas-consulting',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '$APP_DIR/logs/pm2-error.log',
    out_file: '$APP_DIR/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
EOF

# Create logs directory
mkdir -p $APP_DIR/logs

# Start or restart PM2
if pm2 list | grep -q "$APP_NAME"; then
    echo -e "${YELLOW}Restarting existing PM2 process...${NC}"
    pm2 restart $APP_NAME
else
    echo -e "${YELLOW}Starting new PM2 process...${NC}"
    cd $APP_DIR/admas-consulting
    pm2 start ecosystem.config.js
fi

pm2 save
pm2 startup

# Step 10: Configure Nginx
echo -e "${YELLOW}[10/10] 🌐 Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;

    # Increase body size limit for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Cache images
    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
    }
}
EOF

# Enable site
if [ ! -L /etc/nginx/sites-enabled/$DOMAIN ]; then
    ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
fi

# Remove default Nginx site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Basic Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Point your domain DNS to this VPS:${NC}"
echo -e "   - A record: $DOMAIN -> $(hostname -I | awk '{print $1}')"
echo -e "   - A record: $WWW_DOMAIN -> $(hostname -I | awk '{print $1}')"
echo ""
echo -e "${BLUE}2. Wait for DNS propagation (can take up to 24 hours)${NC}"
echo ""
echo -e "${BLUE}3. Install SSL certificate:${NC}"
echo -e "   ${YELLOW}sudo apt install certbot python3-certbot-nginx -y${NC}"
echo -e "   ${YELLOW}sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN${NC}"
echo ""
echo -e "${BLUE}4. Set up auto-renewal:${NC}"
echo -e "   ${YELLOW}sudo crontab -e${NC}"
echo -e "   ${YELLOW}Add: 0 3 * * * /usr/bin/certbot renew --quiet${NC}"
echo ""
echo -e "${GREEN}✅ Application is running at: http://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📊 PM2 Status:${NC}"
pm2 status
echo ""
echo -e "${YELLOW}📝 Recent logs:${NC}"
pm2 logs $APP_NAME --lines 10 --nostream
echo ""
echo -e "${GREEN}🎉 Deployment setup complete!${NC}"

