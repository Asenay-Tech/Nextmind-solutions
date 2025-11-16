#!/bin/bash

# AdmasITS - Docker Deployment Script
# This script handles Docker setup, deployment, and Nginx configuration

set -e  # Exit on error

echo "🐳 Starting AdmasITS Docker Deployment..."

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
APP_NAME="admas-site"
REPO_URL="https://github.com/Asenay-Tech/Nextmind-solutions.git"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or use sudo${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   AdmasITS Docker Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Resolve containerd.io dependency issue
echo -e "${YELLOW}[1/8] 🔧 Resolving containerd.io dependency...${NC}"
if dpkg -l | grep -q containerd.io; then
    echo -e "${YELLOW}containerd.io is installed, checking for conflicts...${NC}"
    apt-get update
    apt-get install -y --fix-broken || true
    apt-get install -y containerd.io || true
else
    echo -e "${YELLOW}Installing containerd.io...${NC}"
    apt-get update
    apt-get install -y containerd.io || true
fi

# Step 2: Validate Docker installation
echo -e "${YELLOW}[2/8] 🐳 Validating Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed!${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker-compose --version)
echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
echo -e "${GREEN}✓ Docker Compose: $COMPOSE_VERSION${NC}"

# Test Docker
echo -e "${YELLOW}Testing Docker...${NC}"
docker ps > /dev/null
echo -e "${GREEN}✓ Docker is working${NC}"

# Step 3: Check for kernel upgrade
echo -e "${YELLOW}[3/8] 🔄 Checking for kernel upgrade...${NC}"
if [ -f /var/run/reboot-required ]; then
    echo -e "${YELLOW}⚠️  Kernel upgrade detected. Reboot required.${NC}"
    echo -e "${YELLOW}⚠️  Please reboot now and run this script again after reboot.${NC}"
    read -p "Reboot now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Rebooting in 5 seconds...${NC}"
        sleep 5
        reboot
    else
        echo -e "${YELLOW}⚠️  Skipping reboot. Please reboot manually and run this script again.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ No reboot required${NC}"
fi

# Step 4: Setup application directory
echo -e "${YELLOW}[4/8] 📁 Setting up application directory...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Directory exists, updating...${NC}"
    cd $APP_DIR
    git pull origin main || git pull origin master || true
    cd admas-consulting 2>/dev/null || true
else
    mkdir -p $APP_DIR
    cd $APP_DIR
    git clone $REPO_URL .
    cd admas-consulting
fi

# Create logs directory
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/admas-consulting/logs

# Step 5: Build Docker image
echo -e "${YELLOW}[5/8] 🏗️  Building Docker image...${NC}"
cd $APP_DIR/admas-consulting
docker-compose build --no-cache

# Step 6: Start Docker container
echo -e "${YELLOW}[6/8] 🚀 Starting Docker container...${NC}"
docker-compose down 2>/dev/null || true  # Stop any existing containers
docker-compose up -d

# Wait for container to be ready
echo -e "${YELLOW}Waiting for container to be ready...${NC}"
sleep 10

# Check container status
if docker ps | grep -q "$APP_NAME"; then
    echo -e "${GREEN}✓ Container is running${NC}"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    docker-compose logs
    exit 1
fi

# Step 7: Configure Nginx
echo -e "${YELLOW}[7/8] 🌐 Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name admasits.com www.admasits.com;

    client_max_body_size 10M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
        expires 1y;
    }

    # Cache Next.js image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
    }

    # Cache images
    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
        expires 7d;
    }

    # Cache public assets
    location /assets {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
        expires 30d;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# Enable site
if [ ! -L /etc/nginx/sites-enabled/$DOMAIN ]; then
    ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
fi

# Remove default site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Test and reload Nginx
nginx -t
systemctl reload nginx

echo -e "${GREEN}✓ Nginx configured${NC}"

# Step 8: Install SSL Certificate (if DNS is configured)
echo -e "${YELLOW}[8/8] 🔒 SSL Certificate Setup${NC}"
if command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot is installed${NC}"
    echo -e "${YELLOW}To install SSL certificate, run:${NC}"
    echo -e "${BLUE}certbot --nginx -d $DOMAIN -d $WWW_DOMAIN${NC}"
else
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
    echo -e "${YELLOW}To install SSL certificate, run:${NC}"
    echo -e "${BLUE}certbot --nginx -d $DOMAIN -d $WWW_DOMAIN${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Configure DNS:${NC}"
echo -e "   - A record: $DOMAIN -> $(hostname -I | awk '{print $1}')"
echo -e "   - A record: $WWW_DOMAIN -> $(hostname -I | awk '{print $1}')"
echo ""
echo -e "${BLUE}2. Wait for DNS propagation (can take up to 24 hours)${NC}"
echo ""
echo -e "${BLUE}3. Install SSL certificate:${NC}"
echo -e "   ${YELLOW}certbot --nginx -d $DOMAIN -d $WWW_DOMAIN${NC}"
echo ""
echo -e "${BLUE}4. Set up auto-renewal:${NC}"
echo -e "   ${YELLOW}crontab -e${NC}"
echo -e "   ${YELLOW}Add: 0 3 * * * /usr/bin/certbot renew --quiet${NC}"
echo ""
echo -e "${GREEN}✅ Application is running in Docker at: http://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📊 Docker Status:${NC}"
docker ps | grep $APP_NAME
echo ""
echo -e "${YELLOW}📝 Container Logs:${NC}"
docker-compose logs --tail=20
echo ""
echo -e "${GREEN}🎉 Docker deployment complete!${NC}"

