# 🐳 Docker Deployment Guide - AdmasITS

Complete guide for deploying the Next.js app using Docker on Ubuntu 24.04 VPS.

## Prerequisites

- ✅ Ubuntu 24.04 VPS with root/SSH access
- ✅ Docker CE installed
- ✅ docker-compose installed
- ✅ Nginx installed
- ✅ Domain `admasits.com` registered
- ✅ DNS pointing to VPS IP (72.156.126)

---

## Step 1: Handle Kernel Upgrade & Reboot

If you see a kernel upgrade message:

```bash
# Check if reboot is required
cat /var/run/reboot-required

# Check current kernel
uname -r

# See available kernels
dpkg -l | grep linux-image | grep -v deinstall

# Reboot safely
reboot
```

**After reboot:**
- SSH back into VPS
- Verify kernel version: `uname -r`
- Continue with setup

---

## Step 2: Fix containerd.io Dependency

```bash
# Update package lists
apt-get update

# Fix any broken dependencies
apt-get install -y --fix-broken

# Install containerd.io (if not installed)
apt-get install -y containerd.io

# Or reinstall if there are conflicts
apt-get remove -y containerd.io
apt-get install -y containerd.io docker-ce docker-ce-cli

# Verify installation
dpkg -l | grep containerd.io
systemctl status containerd
```

---

## Step 3: Validate Docker Installation

```bash
# Check Docker version
docker --version

# Check docker-compose version
docker-compose --version
# OR
docker compose version

# Test Docker daemon
systemctl status docker

# Start Docker if not running
systemctl start docker
systemctl enable docker

# Test Docker with hello-world
docker run --rm hello-world

# Check Docker info
docker info
```

**Expected Output:**
```
✓ Docker version 24.x.x
✓ Docker Compose version 2.x.x
✓ Docker daemon is running
✓ hello-world container runs successfully
```

---

## Step 4: Setup Application with Docker

### 4.1 Clone Repository

```bash
# Create application directory
mkdir -p /var/www/admasits
cd /var/www/admasits

# Clone repository
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting
```

### 4.2 Configure Next.js for Docker

The `next.config.mjs` already has `output: 'standalone'` enabled for Docker optimization.

### 4.3 Build Docker Image

```bash
cd /var/www/admasits/admas-consulting

# Build Docker image
docker-compose build --no-cache

# Or build without cache (faster rebuilds)
docker-compose build
```

### 4.4 Start Docker Container

```bash
# Start container
docker-compose up -d

# Check container status
docker ps

# View logs
docker-compose logs -f

# Or view last 50 lines
docker-compose logs --tail=50
```

### 4.5 Verify Container is Running

```bash
# Check if container is running
docker ps | grep admas-site

# Test application locally
curl http://localhost:3000

# Check container health
docker inspect admas-site | grep -A 10 Health
```

**Expected Output:**
```
✓ Container is running
✓ Application responds on port 3000
✓ Health check passes
```

---

## Step 5: Configure Nginx Reverse Proxy

### 5.1 Create Nginx Configuration

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/admasits << 'EOF'
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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF
```

### 5.2 Enable Nginx Site

```bash
# Enable site
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## Step 6: Configure DNS

In your Hostinger domain panel:

1. Go to **Domains** → Select `admasits.com`
2. Go to **DNS / Name Servers**
3. Add DNS records:
   - **Type:** A
   - **Name:** @ (or admasits.com)
   - **Value:** 72.156.126
   - **TTL:** 3600

   - **Type:** A
   - **Name:** www
   - **Value:** 72.156.126
   - **TTL:** 3600

4. **Wait for DNS propagation** (can take 1-24 hours, usually 1-2 hours)

### Verify DNS

```bash
# Check DNS resolution
nslookup admasits.com
dig admasits.com

# Check from external service
curl https://dnschecker.org/#A/admasits.com
```

---

## Step 7: Install SSL Certificate (Let's Encrypt)

### 7.1 Install Certbot

```bash
# Install Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
# Get SSL certificate (will auto-configure Nginx)
certbot --nginx -d admasits.com -d www.admasits.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Obtain SSL certificate
- Update Nginx configuration
- Configure HTTPS
- Set up auto-renewal

### 7.3 Verify SSL

```bash
# Check certificate status
certbot certificates

# Test certificate renewal (dry run)
certbot renew --dry-run

# Check SSL from command line
curl -I https://admasits.com
```

### 7.4 Set Up Auto-Renewal

```bash
# Edit crontab
crontab -e

# Add this line (checks daily at 3 AM):
0 3 * * * /usr/bin/certbot renew --quiet
```

---

## Step 8: Verify Deployment

### 8.1 Check Docker Container

```bash
# Check container status
docker ps

# View logs
docker-compose logs --tail=50

# Check container health
docker inspect admas-site | grep -A 5 Health
```

### 8.2 Check Nginx

```bash
# Check Nginx status
systemctl status nginx

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 8.3 Test Application

```bash
# Test locally
curl http://localhost:3000

# Test via domain (after DNS propagation)
curl http://admasits.com
curl https://admasits.com

# Test with browser
# Visit: https://admasits.com
# Visit: https://admasits.com/en (English)
# Visit: https://admasits.com/de (German)
```

---

## Common Commands

### Docker Management

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker-compose logs -f
docker-compose logs --tail=100

# Restart container
docker-compose restart

# Stop container
docker-compose down

# Stop and remove containers
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# Execute command in container
docker-compose exec admas-site sh

# View container stats
docker stats admas-site
```

### Update Application

```bash
cd /var/www/admasits
git pull origin main
cd admas-consulting

# Rebuild Docker image
docker-compose build

# Restart container
docker-compose up -d
```

---

## Troubleshooting

### Issue: Container Not Starting

```bash
# Check logs
docker-compose logs --tail=100

# Check container status
docker ps -a

# Check Docker daemon
systemctl status docker

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue: Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000
netstat -tlnp | grep 3000

# Kill the process if needed
kill -9 <PID>

# Or change port in docker-compose.yml
# Edit: ports: - "3001:3000"
```

### Issue: Nginx 502 Bad Gateway

```bash
# Check if container is running
docker ps | grep admas-site

# Check container logs
docker-compose logs --tail=50

# Test application directly
curl http://localhost:3000

# Check Nginx configuration
nginx -t

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### Issue: SSL Certificate Not Working

```bash
# Check certificate status
certbot certificates

# Test renewal
certbot renew --dry-run

# Force renewal if needed
certbot renew --force-renewal

# Reinstall certificate
certbot --nginx -d admasits.com -d www.admasits.com --force-renewal
```

### Issue: Docker Build Fails

```bash
# Check Dockerfile syntax
docker build -t test-build .

# Check for missing files
ls -la

# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue: containerd.io Conflict

```bash
# Remove conflicting packages
apt-get remove -y containerd.io docker docker-engine docker.io

# Clean up
apt-get autoremove -y
apt-get autoclean

# Reinstall Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
systemctl start docker
systemctl enable docker
```

---

## Automated Deployment Script

Run the complete deployment script:

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/docker-setup.sh
chmod +x docker-setup.sh
./docker-setup.sh

# Download and run deployment script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/docker-deploy.sh
chmod +x docker-deploy.sh
./docker-deploy.sh
```

---

## Security Checklist

- [x] Docker running as non-root user (container runs as `nextjs` user)
- [x] Nginx configured with security headers
- [x] HTTPS enabled with Let's Encrypt
- [x] Firewall configured (UFW recommended)
- [x] SSL auto-renewal configured
- [x] Container health checks enabled
- [x] Log rotation configured

### Firewall Setup (Recommended)

```bash
apt install -y ufw

# Allow SSH (IMPORTANT: do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## Success Criteria ✅

- ✅ Docker container running: `docker ps | grep admas-site`
- ✅ Application accessible: `curl http://localhost:3000`
- ✅ Site accessible via HTTP: `http://admasits.com`
- ✅ Site accessible via HTTPS: `https://admasits.com`
- ✅ SSL certificate valid and auto-renewing
- ✅ Both locales work: `/en` and `/de`
- ✅ Nginx serving traffic correctly
- ✅ All pages load correctly

---

## Monitoring & Maintenance

### View Logs

```bash
# Docker logs
docker-compose logs -f admas-site

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log
```

### Monitor Resources

```bash
# Docker stats
docker stats admas-site

# System resources
htop
df -h
free -h
```

### Backup

```bash
# Backup application code
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/admasits

# Backup Docker images
docker save admas-site:latest | gzip > admas-site-backup-$(date +%Y%m%d).tar.gz
```

---

## Quick Reference

```bash
# Start application
cd /var/www/admasits/admas-consulting
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update application
git pull && docker-compose up -d --build

# Check status
docker ps
docker-compose ps
```

---

## Support

If you encounter issues:
1. Check Docker logs: `docker-compose logs --tail=100`
2. Check Nginx logs: `/var/log/nginx/error.log`
3. Check container status: `docker ps -a`
4. Verify DNS: `nslookup admasits.com`
5. Test locally: `curl http://localhost:3000`

