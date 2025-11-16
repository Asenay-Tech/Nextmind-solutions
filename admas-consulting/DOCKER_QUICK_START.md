# 🐳 Docker Quick Start - AdmasITS

Quick reference for Docker deployment steps.

## Prerequisites Check

```bash
# SSH into VPS
ssh root@72.156.126

# Verify Docker
docker --version
docker-compose --version

# Verify Nginx
nginx -v

# Verify Git
git --version
```

---

## Step 1: Reboot for Kernel Upgrade

```bash
# Check if reboot required
cat /var/run/reboot-required

# If reboot needed, reboot safely
reboot

# After reboot, SSH back in and verify kernel
uname -r
```

---

## Step 2: Fix containerd.io Dependency

```bash
# Update packages
apt-get update

# Fix broken dependencies
apt-get install -y --fix-broken

# Install/reinstall containerd.io
apt-get install -y containerd.io

# Verify
dpkg -l | grep containerd.io
systemctl status containerd
```

---

## Step 3: Validate Docker

```bash
# Check Docker status
systemctl status docker

# Start if not running
systemctl start docker
systemctl enable docker

# Test Docker
docker run --rm hello-world

# Test docker-compose
docker-compose version
```

---

## Step 4: Deploy Application

### Option A: Automated Script (Recommended)

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/docker-setup.sh
chmod +x docker-setup.sh
./docker-setup.sh

# After reboot, run deployment script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/docker-deploy.sh
chmod +x docker-deploy.sh
./docker-deploy.sh
```

### Option B: Manual Steps

```bash
# Clone repository
mkdir -p /var/www/admasits
cd /var/www/admasits
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting

# Build Docker image
docker-compose build --no-cache

# Start container
docker-compose up -d

# Check status
docker ps
docker-compose logs --tail=50

# Test application
curl http://localhost:3000
```

---

## Step 5: Configure Nginx

```bash
# Copy Nginx config
cp nginx.conf /etc/nginx/sites-available/admasits

# Enable site
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx
```

---

## Step 6: Configure DNS

In Hostinger panel:
- **A Record:** `@` → `72.156.126`
- **A Record:** `www` → `72.156.126`

Wait for DNS propagation (1-24 hours).

---

## Step 7: Install SSL

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d admasits.com -d www.admasits.com

# Set up auto-renewal
crontab -e
# Add: 0 3 * * * /usr/bin/certbot renew --quiet
```

---

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart container
docker-compose restart

# Stop container
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Update application
cd /var/www/admasits
git pull origin main
cd admas-consulting
docker-compose up -d --build
```

---

## Troubleshooting

```bash
# Container not starting
docker-compose logs --tail=100

# Port 3000 in use
lsof -i :3000
netstat -tlnp | grep 3000

# Nginx 502 error
docker ps
curl http://localhost:3000

# Docker build fails
docker-compose build --no-cache
```

---

## Success Checklist

- [ ] Docker container running: `docker ps | grep admas-site`
- [ ] Application responds: `curl http://localhost:3000`
- [ ] Nginx configured: `nginx -t`
- [ ] DNS configured and propagated
- [ ] SSL certificate installed: `certbot certificates`
- [ ] Site accessible: `https://admasits.com`

---

For detailed instructions, see `DOCKER_DEPLOYMENT.md`.

