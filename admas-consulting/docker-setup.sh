#!/bin/bash

# AdmasITS - Docker Setup and Validation Script
# This script handles kernel reboot, containerd.io fix, and Docker validation

set -e  # Exit on error

echo "🔧 Starting Docker Setup and Validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or use sudo${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Docker Setup & Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check for kernel upgrade
echo -e "${YELLOW}[1/4] 🔄 Checking for kernel upgrade...${NC}"
if [ -f /var/run/reboot-required ]; then
    echo -e "${YELLOW}⚠️  Kernel upgrade detected. Reboot required.${NC}"
    echo -e "${YELLOW}Current kernel: $(uname -r)${NC}"
    echo ""
    echo -e "${BLUE}Available kernels:${NC}"
    dpkg -l | grep linux-image | grep -v deinstall
    
    read -p "Reboot now to load new kernel? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Rebooting in 5 seconds... (Press Ctrl+C to cancel)${NC}"
        sleep 5
        echo -e "${GREEN}Rebooting...${NC}"
        reboot
    else
        echo -e "${YELLOW}⚠️  Skipping reboot. Please reboot manually when ready.${NC}"
        echo -e "${YELLOW}After reboot, run this script again to continue.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✓ No reboot required${NC}"
    echo -e "${GREEN}✓ Current kernel: $(uname -r)${NC}"
fi

# Step 2: Fix containerd.io dependency
echo -e "${YELLOW}[2/4] 🔧 Resolving containerd.io dependency...${NC}"

# Update package lists
apt-get update

# Check if containerd.io is installed
if dpkg -l | grep -q containerd.io; then
    echo -e "${YELLOW}containerd.io is installed${NC}"
    # Try to fix any broken dependencies
    apt-get install -y --fix-broken || true
else
    echo -e "${YELLOW}Installing containerd.io...${NC}"
    # Install containerd.io from Docker's official repository
    apt-get install -y ca-certificates curl gnupg lsb-release
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y containerd.io docker-ce docker-ce-cli docker-compose-plugin || true
fi

# Verify containerd.io
if dpkg -l | grep -q containerd.io; then
    CONTAINERD_VERSION=$(dpkg -l | grep containerd.io | awk '{print $3}')
    echo -e "${GREEN}✓ containerd.io installed: $CONTAINERD_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  containerd.io installation may have issues, but continuing...${NC}"
fi

# Step 3: Validate Docker
echo -e "${YELLOW}[3/4] 🐳 Validating Docker installation...${NC}"

# Check Docker command
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo -e "${YELLOW}Installing Docker...${NC}"
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

# Check docker-compose command
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing docker-compose...${NC}"
    apt-get install -y docker-compose-plugin || \
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose
fi

# Get versions
DOCKER_VERSION=$(docker --version)
COMPOSE_VERSION=$(docker-compose --version 2>/dev/null || docker compose version 2>/dev/null || echo "Not found")
echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
echo -e "${GREEN}✓ Docker Compose: $COMPOSE_VERSION${NC}"

# Test Docker daemon
echo -e "${YELLOW}Testing Docker daemon...${NC}"
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✓ Docker daemon is running${NC}"
else
    echo -e "${YELLOW}Starting Docker daemon...${NC}"
    systemctl start docker
    systemctl enable docker
    echo -e "${GREEN}✓ Docker daemon started and enabled${NC}"
fi

# Test Docker
if docker ps > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker is working${NC}"
else
    echo -e "${RED}❌ Docker is not working!${NC}"
    echo -e "${YELLOW}Checking Docker status...${NC}"
    systemctl status docker
    exit 1
fi

# Test docker-compose
if docker-compose version > /dev/null 2>&1 || docker compose version > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker Compose is working${NC}"
else
    echo -e "${RED}❌ Docker Compose is not working!${NC}"
    exit 1
fi

# Step 4: Test Docker with sample container
echo -e "${YELLOW}[4/4] 🧪 Testing Docker with sample container...${NC}"
echo -e "${YELLOW}Running hello-world container...${NC}"
if docker run --rm hello-world > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker test successful${NC}"
else
    echo -e "${YELLOW}⚠️  Docker test failed, but continuing...${NC}"
fi

# Check Docker info
echo -e "${BLUE}Docker Info:${NC}"
docker info | grep -E "Server Version|Operating System|Kernel Version|Total Memory" || true

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Docker Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📊 Docker Status:${NC}"
systemctl status docker --no-pager -l | head -n 5
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "${BLUE}1. Run the deployment script:${NC}"
echo -e "   ${YELLOW}./docker-deploy.sh${NC}"
echo ""
echo -e "${BLUE}2. Or follow manual deployment steps in DEPLOYMENT_INSTRUCTIONS.md${NC}"
echo ""
echo -e "${GREEN}✅ Docker is ready for deployment!${NC}"

