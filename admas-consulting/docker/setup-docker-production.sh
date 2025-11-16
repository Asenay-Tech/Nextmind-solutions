#!/bin/bash

################################################################################
# Docker Production Setup Script for Ubuntu 24.04
# Configures Docker for production use with security best practices
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
# 1. Configure Docker Daemon
################################################################################

print_step "1. Configuring Docker Daemon..."

# Create docker directory if it doesn't exist
mkdir -p /etc/docker

# Backup existing daemon.json if it exists
if [ -f /etc/docker/daemon.json ]; then
    print_warning "Backing up existing daemon.json"
    cp /etc/docker/daemon.json /etc/docker/daemon.json.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create production-ready daemon.json
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "compress": "true"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "userland-proxy": false,
  "experimental": false,
  "metrics-addr": "127.0.0.1:9323",
  "default-address-pools": [
    {
      "base": "172.17.0.0/16",
      "size": 24
    }
  ]
}
EOF

print_success "Docker daemon.json configured"

################################################################################
# 2. Add User to Docker Group
################################################################################

print_step "2. Configuring User Permissions..."

# Get the actual user (not root if using sudo)
if [ -n "$SUDO_USER" ]; then
    DOCKER_USER="$SUDO_USER"
else
    # If running as root directly, ask for username
    read -p "Enter username to add to docker group (or press Enter to skip): " DOCKER_USER
fi

if [ -n "$DOCKER_USER" ] && id "$DOCKER_USER" &>/dev/null; then
    if groups "$DOCKER_USER" | grep -q "\bdocker\b"; then
        print_success "User $DOCKER_USER is already in docker group"
    else
        usermod -aG docker "$DOCKER_USER"
        print_success "User $DOCKER_USER added to docker group"
        print_warning "User must log out and back in, or run: newgrp docker"
    fi
else
    print_warning "Skipping user group configuration"
fi

################################################################################
# 3. Configure Docker Service
################################################################################

print_step "3. Configuring Docker Service..."

# Enable Docker to start on boot
systemctl enable docker
print_success "Docker service enabled for auto-start"

# Restart Docker to apply daemon.json changes
systemctl restart docker
print_success "Docker service restarted with new configuration"

# Wait a moment for Docker to start
sleep 2

# Verify Docker is running
if systemctl is-active --quiet docker; then
    print_success "Docker service is running"
else
    print_error "Docker service failed to start"
    systemctl status docker
    exit 1
fi

################################################################################
# 4. Configure Log Rotation
################################################################################

print_step "4. Configuring Log Rotation..."

# Create logrotate config for Docker containers
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF

print_success "Docker log rotation configured"

################################################################################
# 5. Set Up Firewall Rules (if UFW is installed)
################################################################################

print_step "5. Configuring Firewall..."

if command -v ufw &> /dev/null; then
    # Allow SSH (critical - don't lock yourself out!)
    ufw allow 22/tcp comment 'SSH'
    
    # Allow HTTP/HTTPS if needed
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    
    # Docker uses iptables, so we need to allow Docker's iptables rules
    # UFW and Docker can work together, but we need to ensure Docker's rules are preserved
    print_info "UFW is installed. Docker will manage its own iptables rules."
    print_info "Ensure UFW is configured to allow Docker traffic."
    
    print_success "Firewall rules configured"
else
    print_info "UFW not installed, skipping firewall configuration"
fi

################################################################################
# 6. Verify Installation
################################################################################

print_step "6. Verifying Installation..."

# Check Docker version
DOCKER_VERSION=$(docker --version)
print_success "Docker: ${DOCKER_VERSION}"

# Check Docker Compose version
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    print_success "Docker Compose: ${COMPOSE_VERSION}"
else
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose: ${COMPOSE_VERSION}"
fi

# Test Docker
if docker ps &> /dev/null; then
    print_success "Docker is functional"
else
    print_error "Docker is not functional"
    exit 1
fi

# Test hello-world container
if docker run --rm hello-world &> /dev/null; then
    print_success "Container execution test passed"
else
    print_error "Container execution test failed"
    exit 1
fi

################################################################################
# 7. Display Next Steps
################################################################################

echo ""
echo -e "${GREEN}================================================================================${NC}"
echo -e "${GREEN}                    SETUP COMPLETE!${NC}"
echo -e "${GREEN}================================================================================${NC}"
echo ""

print_success "Docker is now configured for production use"

if [ -n "$DOCKER_USER" ]; then
    echo ""
    echo -e "${YELLOW}Important:${NC}"
    echo "  User $DOCKER_USER has been added to the docker group."
    echo "  They must log out and back in, or run: ${BLUE}newgrp docker${NC}"
    echo "  to use Docker without sudo."
fi

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. If you added a user to docker group, log out and back in"
echo "  2. Run the verification script: ${BLUE}./verify-docker-setup.sh${NC}"
echo "  3. Test docker compose: ${BLUE}docker compose version${NC}"
echo "  4. Review daemon.json: ${BLUE}cat /etc/docker/daemon.json${NC}"
echo ""

print_success "Setup complete!"

