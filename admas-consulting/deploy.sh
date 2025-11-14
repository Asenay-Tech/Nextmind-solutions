#!/bin/bash

# AdmasITS - VPS Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting AdmasITS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/admasits"
APP_NAME="admasits"
NODE_ENV="production"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or use sudo${NC}"
    exit 1
fi

# Navigate to app directory
echo -e "${YELLOW}📁 Navigating to app directory...${NC}"
cd $APP_DIR || { echo -e "${RED}Directory $APP_DIR not found!${NC}"; exit 1; }

# Pull latest changes (if using Git)
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 Pulling latest changes from Git...${NC}"
    git pull origin main || git pull origin master
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Restart PM2
echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
pm2 restart $APP_NAME || pm2 start npm --name $APP_NAME -- start

# Save PM2 configuration
pm2 save

# Show status
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}📊 PM2 Status:${NC}"
pm2 status

echo -e "${YELLOW}📝 Recent logs:${NC}"
pm2 logs $APP_NAME --lines 20 --nostream

echo -e "${GREEN}🎉 Deployment successful!${NC}"

