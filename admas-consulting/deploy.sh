#!/bin/bash

################################################################################
# Admas Consulting - VPS Deployment Script
# Ubuntu 24.04 | Docker + Docker Compose + Nginx + HTTPS
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="admasits.com"
WWW_DOMAIN="www.admasits.com"
DEPLOY_DIR="/var/www/admasits"
REPO_URL="https://github.com/Asenay-Tech/Nextmind-solutions.git"
BRANCH="fix/build-and-docker-clean"
APP_DIR="${DEPLOY_DIR}/admas-consulting"

# Print colored output
print_step() {
    echo -e "\n${BLUE}==>${NC} ${1}"
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

################################################################################
# Step 1: System Update
################################################################################

print_step "Step 1/11: Updating system packages..."
apt update && apt upgrade -y
apt install -y curl wget git ufw software-properties-common apt-transport-https ca-certificates gnupg lsb-release
print_success "System updated"

################################################################################
# Step 2: Install Docker
################################################################################

print_step "Step 2/11: Installing Docker..."

# Remove old versions
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install Docker using official script
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
else
    print_warning "Docker already installed"
fi

# Add current user to docker group (if not root)
if [ "$SUDO_USER" ]; then
    usermod -aG docker $SUDO_USER
    print_success "User $SUDO_USER added to docker group"
fi

# Start and enable Docker
systemctl start docker
systemctl enable docker
print_success "Docker started and enabled"

# Verify Docker
docker --version

################################################################################
# Step 3: Install Docker Compose
################################################################################

print_step "Step 3/11: Installing Docker Compose..."

if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed (version: ${DOCKER_COMPOSE_VERSION})"
else
    print_warning "Docker Compose already installed"
fi

# Verify Docker Compose
docker-compose --version

################################################################################
# Step 4: Install Nginx
################################################################################

print_step "Step 4/11: Installing Nginx..."

if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    print_success "Nginx installed"
else
    print_warning "Nginx already installed"
fi

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx started and enabled"

# Verify Nginx
nginx -v

################################################################################
# Step 5: Install Certbot
################################################################################

print_step "Step 5/11: Installing Certbot for SSL..."

apt install -y certbot python3-certbot-nginx
print_success "Certbot installed"

# Verify Certbot
certbot --version

################################################################################
# Step 6: Configure Firewall
################################################################################

print_step "Step 6/11: Configuring UFW firewall..."

# Allow SSH (critical - don't lock yourself out!)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall (interactive - user needs to confirm)
print_warning "Enabling firewall (you'll be prompted to confirm)..."
echo "y" | ufw enable

print_success "Firewall configured: SSH (22), HTTP (80), HTTPS (443)"

################################################################################
# Step 7: Clone Repository
################################################################################

print_step "Step 7/11: Cloning repository..."

# Create deployment directory
mkdir -p ${DEPLOY_DIR}
cd ${DEPLOY_DIR}

# Clone repository (or pull if exists)
if [ -d ".git" ]; then
    print_warning "Repository already exists, pulling latest..."
    git fetch origin
    git checkout ${BRANCH} || git checkout -b ${BRANCH} origin/${BRANCH}
    git pull origin ${BRANCH}
else
    git clone ${REPO_URL} .
    cd ${APP_DIR}
    git checkout ${BRANCH}
fi

# Verify we're on correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    cd ${APP_DIR}
    git checkout ${BRANCH}
fi

print_success "Repository cloned/updated on branch: ${BRANCH}"

################################################################################
# Step 8: Configure Nginx (Initial - before SSL)
################################################################################

print_step "Step 8/11: Configuring Nginx reverse proxy..."

# Backup default config
if [ -f /etc/nginx/sites-available/default ]; then
    mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
fi

# Create Nginx configuration
cat > /etc/nginx/sites-available/${DOMAIN} << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name admasits.com www.admasits.com;

    # Increase body size limit for file uploads
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
NGINX_CONFIG

# Enable site
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/

# Remove default site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

print_success "Nginx configured for ${DOMAIN}"

################################################################################
# Step 9: Build and Start Docker Containers
################################################################################

print_step "Step 9/11: Building and starting Docker containers..."

cd ${APP_DIR}

# Create logs directory if it doesn't exist
mkdir -p logs

# Build Docker image
print_warning "Building Docker image (this may take several minutes)..."
docker-compose build --no-cache

# Start containers
docker-compose up -d

# Wait for container to be healthy
print_warning "Waiting for container to start..."
sleep 10

# Check container status
if docker-compose ps | grep -q "healthy\|Up"; then
    print_success "Docker containers started successfully"
else
    print_error "Container may not be healthy. Check logs with: docker-compose logs"
fi

# Show container status
docker-compose ps

################################################################################
# Step 10: Obtain SSL Certificate with Certbot
################################################################################

print_step "Step 10/11: Obtaining SSL certificate with Certbot..."

# Verify domain is accessible
print_warning "Verifying domain ${DOMAIN} is accessible..."
if curl -s -o /dev/null -w "%{http_code}" http://${DOMAIN}/en | grep -q "200\|301\|302"; then
    print_success "Domain is accessible"
else
    print_warning "Domain may not be accessible yet. Waiting 30 seconds..."
    sleep 30
fi

# Obtain SSL certificate (non-interactive for automation, but you may need to run manually)
print_warning "Obtaining SSL certificate..."
print_warning "You may need to run this manually if email/prompts are required:"
echo ""
echo -e "${YELLOW}sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}${NC}"
echo ""

# Try to get certificate automatically (will fail if email required)
certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN} --non-interactive --agree-tos --redirect --register-unsafely-without-email 2>/dev/null || {
    print_warning "Automatic certificate generation failed (likely needs email)"
    print_warning "Run manually: sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}"
}

# Test certificate renewal
certbot renew --dry-run

print_success "SSL certificate configured"

################################################################################
# Step 11: Set Up Systemd Service for Auto-Start
################################################################################

print_step "Step 11/11: Setting up systemd service for auto-start..."

# Create systemd service file
cat > /etc/systemd/system/admas-site.service << 'SERVICE_FILE'
[Unit]
Description=Admas Consulting Docker Compose
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/admasits/admas-consulting
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
ExecReload=/usr/local/bin/docker-compose restart
TimeoutStartSec=0
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE_FILE

# Reload systemd
systemctl daemon-reload

# Enable service
systemctl enable admas-site.service

print_success "Systemd service created and enabled"

################################################################################
# Deployment Complete
################################################################################

echo ""
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}                    DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}If SSL certificate wasn't obtained automatically, run:${NC}"
echo "   sudo certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}"
echo ""
echo "2. ${YELLOW}Verify deployment:${NC}"
echo "   curl http://${DOMAIN}/en"
echo "   curl https://${DOMAIN}/en"
echo ""
echo "3. ${YELLOW}Check Docker container logs:${NC}"
echo "   cd ${APP_DIR}"
echo "   docker-compose logs -f"
echo ""
echo "4. ${YELLOW}Check container status:${NC}"
echo "   docker-compose ps"
echo ""
echo "5. ${YELLOW}Restart services:${NC}"
echo "   sudo systemctl restart admas-site"
echo "   sudo systemctl restart nginx"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  • View logs:        cd ${APP_DIR} && docker-compose logs -f"
echo "  • Restart app:      sudo systemctl restart admas-site"
echo "  • Stop app:         cd ${APP_DIR} && docker-compose down"
echo "  • Start app:        cd ${APP_DIR} && docker-compose up -d"
echo "  • Rebuild app:      cd ${APP_DIR} && docker-compose build --no-cache && docker-compose up -d"
echo "  • Check status:     docker-compose ps"
echo ""
echo -e "${GREEN}Your site should be accessible at: https://${DOMAIN}${NC}"
echo ""
