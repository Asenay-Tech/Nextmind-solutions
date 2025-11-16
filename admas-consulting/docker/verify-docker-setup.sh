#!/bin/bash

################################################################################
# Docker Setup Verification Script for Ubuntu 24.04
# Verifies Docker installation, permissions, and production readiness
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

print_info() {
    echo -e "${BLUE}ℹ${NC} ${1}"
}

# Track issues
ISSUES=0
WARNINGS=0

################################################################################
# 1. Verify Docker Installation
################################################################################

print_step "1. Verifying Docker Installation..."

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: ${DOCKER_VERSION}"
else
    print_error "Docker is not installed or not in PATH"
    ISSUES=$((ISSUES + 1))
    exit 1
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    if docker compose version &> /dev/null; then
        COMPOSE_VERSION=$(docker compose version)
        print_success "Docker Compose is installed: ${COMPOSE_VERSION}"
    else
        COMPOSE_VERSION=$(docker-compose --version)
        print_success "Docker Compose is installed: ${COMPOSE_VERSION}"
    fi
else
    print_error "Docker Compose is not installed"
    ISSUES=$((ISSUES + 1))
    exit 1
fi

################################################################################
# 2. Verify Docker Service Status
################################################################################

print_step "2. Verifying Docker Service Status..."

if systemctl is-active --quiet docker; then
    print_success "Docker service is running"
else
    print_error "Docker service is not running"
    print_info "Attempting to start Docker service..."
    if sudo systemctl start docker; then
        print_success "Docker service started successfully"
    else
        print_error "Failed to start Docker service"
        ISSUES=$((ISSUES + 1))
    fi
fi

if systemctl is-enabled --quiet docker; then
    print_success "Docker service is enabled (will start on boot)"
else
    print_warning "Docker service is not enabled for auto-start"
    print_info "Run: sudo systemctl enable docker"
    WARNINGS=$((WARNINGS + 1))
fi

################################################################################
# 3. Verify Docker Daemon Configuration
################################################################################

print_step "3. Verifying Docker Daemon Configuration..."

DAEMON_JSON="/etc/docker/daemon.json"

if [ -f "$DAEMON_JSON" ]; then
    print_success "Docker daemon.json exists"
    print_info "Current daemon.json:"
    cat "$DAEMON_JSON" | sed 's/^/  /'
else
    print_warning "Docker daemon.json does not exist"
    print_info "Consider creating /etc/docker/daemon.json for production settings"
    WARNINGS=$((WARNINGS + 1))
fi

################################################################################
# 4. Verify User Permissions
################################################################################

print_step "4. Verifying User Permissions..."

CURRENT_USER=${SUDO_USER:-$USER}

if [ "$CURRENT_USER" = "root" ]; then
    print_warning "Running as root user"
    print_info "For production, use a non-root user with docker group membership"
    WARNINGS=$((WARNINGS + 1))
else
    print_success "Running as non-root user: ${CURRENT_USER}"
    
    if groups "$CURRENT_USER" | grep -q "\bdocker\b"; then
        print_success "User ${CURRENT_USER} is in docker group"
    else
        print_error "User ${CURRENT_USER} is NOT in docker group"
        print_info "Run: sudo usermod -aG docker ${CURRENT_USER}"
        print_info "Then log out and log back in, or run: newgrp docker"
        ISSUES=$((ISSUES + 1))
    fi
fi

################################################################################
# 5. Test Docker Without Sudo
################################################################################

print_step "5. Testing Docker Without Sudo..."

if [ "$CURRENT_USER" != "root" ]; then
    if docker ps &> /dev/null; then
        print_success "Docker commands work without sudo"
    else
        print_error "Docker commands require sudo"
        print_info "User may need to log out and back in after being added to docker group"
        print_info "Or run: newgrp docker"
        ISSUES=$((ISSUES + 1))
    fi
else
    print_warning "Skipping sudo test (running as root)"
fi

################################################################################
# 6. Test Docker Compose Without Sudo
################################################################################

print_step "6. Testing Docker Compose Without Sudo..."

if [ "$CURRENT_USER" != "root" ]; then
    if docker compose version &> /dev/null || docker-compose version &> /dev/null; then
        print_success "Docker Compose commands work without sudo"
    else
        print_error "Docker Compose commands require sudo"
        ISSUES=$((ISSUES + 1))
    fi
else
    print_warning "Skipping sudo test (running as root)"
fi

################################################################################
# 7. Verify Docker Network
################################################################################

print_step "7. Verifying Docker Network..."

if docker network ls &> /dev/null; then
    print_success "Docker networking is functional"
    NETWORK_COUNT=$(docker network ls | wc -l)
    print_info "Found ${NETWORK_COUNT} Docker networks"
else
    print_error "Docker networking is not functional"
    ISSUES=$((ISSUES + 1))
fi

################################################################################
# 8. Test Container Creation
################################################################################

print_step "8. Testing Container Creation..."

if docker run --rm hello-world &> /dev/null; then
    print_success "Container creation and execution works"
else
    print_error "Container creation failed"
    ISSUES=$((ISSUES + 1))
fi

################################################################################
# 9. Verify Storage Driver
################################################################################

print_step "9. Verifying Storage Driver..."

STORAGE_DRIVER=$(docker info 2>/dev/null | grep "Storage Driver" | awk '{print $3}')

if [ -n "$STORAGE_DRIVER" ]; then
    print_success "Storage driver: ${STORAGE_DRIVER}"
    if [ "$STORAGE_DRIVER" = "overlay2" ]; then
        print_success "Using recommended overlay2 storage driver"
    else
        print_warning "Using ${STORAGE_DRIVER} storage driver (overlay2 recommended)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_warning "Could not determine storage driver"
    WARNINGS=$((WARNINGS + 1))
fi

################################################################################
# 10. Check Disk Space
################################################################################

print_step "10. Checking Disk Space..."

DISK_USAGE=$(df -h /var/lib/docker 2>/dev/null | tail -1 | awk '{print $5}' | sed 's/%//')

if [ -n "$DISK_USAGE" ]; then
    if [ "$DISK_USAGE" -lt 80 ]; then
        print_success "Docker disk usage: ${DISK_USAGE}%"
    elif [ "$DISK_USAGE" -lt 90 ]; then
        print_warning "Docker disk usage: ${DISK_USAGE}% (getting high)"
        WARNINGS=$((WARNINGS + 1))
    else
        print_error "Docker disk usage: ${DISK_USAGE}% (critical)"
        ISSUES=$((ISSUES + 1))
    fi
else
    print_info "Could not determine Docker disk usage"
fi

################################################################################
# 11. Verify Firewall Configuration
################################################################################

print_step "11. Verifying Firewall Configuration..."

if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        print_success "UFW firewall is active"
        
        # Check if Docker ports are allowed
        if ufw status | grep -q "22/tcp"; then
            print_success "SSH (22) is allowed"
        else
            print_warning "SSH (22) may not be allowed - ensure you can still access the server"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        print_warning "UFW firewall is not active"
        print_info "Consider enabling firewall: sudo ufw enable"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_info "UFW not installed (firewall check skipped)"
fi

################################################################################
# 12. Check for Security Best Practices
################################################################################

print_step "12. Checking Security Best Practices..."

# Check if rootless mode is being used (optional, not required)
if docker info 2>/dev/null | grep -q "rootless"; then
    print_success "Docker is running in rootless mode (enhanced security)"
else
    print_info "Docker is running in standard mode (acceptable for most use cases)"
fi

# Check Docker version for known vulnerabilities
DOCKER_MAJOR=$(docker --version | grep -oP '\d+' | head -1)
if [ "$DOCKER_MAJOR" -ge 20 ]; then
    print_success "Docker version is recent (${DOCKER_MAJOR}.x)"
else
    print_warning "Docker version may be outdated (${DOCKER_MAJOR}.x)"
    WARNINGS=$((WARNINGS + 1))
fi

################################################################################
# 13. Verify Docker Compose File
################################################################################

print_step "13. Checking for docker-compose.yml..."

if [ -f "docker-compose.yml" ]; then
    print_success "docker-compose.yml found"
    
    # Validate compose file
    if docker compose config &> /dev/null; then
        print_success "docker-compose.yml is valid"
    else
        print_error "docker-compose.yml has syntax errors"
        docker compose config
        ISSUES=$((ISSUES + 1))
    fi
else
    print_info "docker-compose.yml not found in current directory"
fi

################################################################################
# Summary
################################################################################

echo ""
echo -e "${BLUE}================================================================================${NC}"
echo -e "${BLUE}                    VERIFICATION SUMMARY${NC}"
echo -e "${BLUE}================================================================================${NC}"
echo ""

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Docker is ready for production.${NC}"
    exit 0
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) found, but no critical issues.${NC}"
    echo -e "${GREEN}✓ Docker is functional and ready to use.${NC}"
    exit 0
else
    echo -e "${RED}✗ ${ISSUES} critical issue(s) found.${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) also found.${NC}"
    fi
    echo ""
    echo "Please fix the issues above before proceeding."
    exit 1
fi

