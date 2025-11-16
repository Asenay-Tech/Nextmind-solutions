# 🚀 VPS Deployment Checklist - Admas Consulting

## Pre-Deployment Verification

- [ ] VPS is Ubuntu 24.04 (or compatible)
- [ ] Domain `admasits.com` has A record pointing to VPS IP
- [ ] SSH access to VPS is configured
- [ ] Root or sudo access available
- [ ] Ports 22 (SSH), 80 (HTTP), 443 (HTTPS) are open

## Deployment Steps

### 1. Initial Setup

- [ ] SSH into VPS
  ```bash
  ssh root@your-vps-ip
  # or
  ssh your-user@your-vps-ip
  ```

### 2. Run Deployment Script

- [ ] Download deployment script to VPS
  ```bash
  wget https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/fix/build-and-docker-clean/admas-consulting/deploy.sh
  # Or upload via SCP from local machine
  ```

- [ ] Make script executable
  ```bash
  chmod +x deploy.sh
  ```

- [ ] Run deployment script
  ```bash
  sudo ./deploy.sh
  ```

### 3. Manual Steps (if automated script fails)

- [ ] Update system
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

- [ ] Install Docker
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  newgrp docker
  ```

- [ ] Install Docker Compose
  ```bash
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```

- [ ] Install Nginx
  ```bash
  sudo apt install -y nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx
  ```

- [ ] Install Certbot
  ```bash
  sudo apt install -y certbot python3-certbot-nginx
  ```

- [ ] Configure Firewall
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

- [ ] Clone Repository
  ```bash
  sudo mkdir -p /var/www/admasits
  cd /var/www/admasits
  sudo git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
  cd admas-consulting
  sudo git checkout fix/build-and-docker-clean
  ```

- [ ] Configure Nginx
  ```bash
  sudo cp nginx-production.conf /etc/nginx/sites-available/admasits.com
  sudo ln -s /etc/nginx/sites-available/admasits.com /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t
  sudo systemctl reload nginx
  ```

- [ ] Build and Start Docker
  ```bash
  cd /var/www/admasits/admas-consulting
  sudo mkdir -p logs
  sudo docker-compose build --no-cache
  sudo docker-compose up -d
  ```

- [ ] Obtain SSL Certificate
  ```bash
  sudo certbot --nginx -d admasits.com -d www.admasits.com
  ```

- [ ] Set Up Systemd Service
  ```bash
  sudo cp systemd-service.service /etc/systemd/system/admas-site.service
  sudo systemctl daemon-reload
  sudo systemctl enable admas-site.service
  sudo systemctl start admas-site.service
  ```

## Post-Deployment Verification

### 4. Verify Deployment

- [ ] Check Docker container status
  ```bash
  cd /var/www/admasits/admas-consulting
  docker-compose ps
  ```
  Expected: Container should show "Up" and "healthy"

- [ ] Check container logs
  ```bash
  docker-compose logs -f
  ```
  Expected: Should show "Ready on http://0.0.0.0:3000"

- [ ] Test HTTP endpoint
  ```bash
  curl http://localhost:3000/en
  ```
  Expected: Should return HTML (200 OK)

- [ ] Test HTTP via domain
  ```bash
  curl http://admasits.com/en
  ```
  Expected: Should return HTML (200 OK or 301 redirect to HTTPS)

- [ ] Test HTTPS via domain
  ```bash
  curl https://admasits.com/en
  ```
  Expected: Should return HTML (200 OK)

- [ ] Test all routes
  ```bash
  curl https://admasits.com/en
  curl https://admasits.com/de
  curl https://admasits.com/en/about
  curl https://admasits.com/en/partners
  curl https://admasits.com/en/contact
  ```
  Expected: All should return HTML (200 OK)

- [ ] Verify SSL certificate
  ```bash
  sudo certbot certificates
  ```
  Expected: Certificate should be listed and valid

- [ ] Check Nginx status
  ```bash
  sudo systemctl status nginx
  ```
  Expected: Should be "active (running)"

- [ ] Check Docker service status
  ```bash
  sudo systemctl status admas-site
  ```
  Expected: Should be "active (exited)" or "active (running)"

- [ ] Verify systemd auto-start
  ```bash
  sudo systemctl is-enabled admas-site
  ```
  Expected: Should return "enabled"

### 5. Browser Testing

- [ ] Open `https://admasits.com` in browser
- [ ] Verify homepage loads correctly
- [ ] Test language switcher (EN ↔ DE)
- [ ] Test navigation links
- [ ] Verify HTTPS lock icon in browser
- [ ] Test www subdomain: `https://www.admasits.com`

### 6. Performance Checks

- [ ] Test page load speed
- [ ] Verify static assets are cached (check Network tab)
- [ ] Verify Gzip compression is working
- [ ] Test mobile responsiveness

## Troubleshooting

### Container Not Starting

```bash
cd /var/www/admasits/admas-consulting
docker-compose logs -f
docker-compose ps
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Nginx Not Proxying

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo certbot --nginx -d admasits.com -d www.admasits.com --force-renewal
```

### Firewall Issues

```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Useful Commands

```bash
# View application logs
cd /var/www/admasits/admas-consulting
docker-compose logs -f

# Restart application
sudo systemctl restart admas-site

# Rebuild application
cd /var/www/admasits/admas-consulting
docker-compose build --no-cache
docker-compose up -d

# Update code from Git
cd /var/www/admasits/admas-consulting
git pull origin fix/build-and-docker-clean
docker-compose build --no-cache
docker-compose up -d

# Check container health
docker-compose ps
docker-compose exec admas-site node -e "require('http').get('http://localhost:3000/en', (r) => console.log(r.statusCode))"

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx

# Check service status
sudo systemctl status admas-site
sudo systemctl status nginx
sudo systemctl status docker
```

## Security Checklist

- [ ] Firewall is enabled (UFW)
- [ ] Only ports 22, 80, 443 are open
- [ ] SSL certificate is valid and auto-renewing
- [ ] Docker containers run as non-root user
- [ ] Nginx security headers are configured
- [ ] Regular security updates enabled
- [ ] SSH key authentication (disable password auth recommended)

## Maintenance

### Update Application

```bash
cd /var/www/admasits/admas-consulting
git pull origin fix/build-and-docker-clean
docker-compose build --no-cache
docker-compose up -d
```

### Backup Database (if applicable)

```bash
# Add backup commands here if database is added later
```

### Monitor Logs

```bash
# Application logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u admas-site -f
```

## Success Criteria

✅ All routes accessible via HTTPS  
✅ Language switcher works (EN/DE)  
✅ Static assets load correctly  
✅ SSL certificate valid and auto-renewing  
✅ Docker containers healthy  
✅ Nginx proxying correctly  
✅ Systemd service auto-starts on reboot  
✅ No console errors in browser  
✅ Page load time < 3 seconds  

## Support

If issues persist:
1. Check logs: `docker-compose logs -f`
2. Check Nginx: `sudo nginx -t && sudo tail -f /var/log/nginx/error.log`
3. Verify container: `docker-compose ps`
4. Check DNS: `nslookup admasits.com`
5. Test locally: `curl http://localhost:3000/en`

---

**Deployment Date:** ________________  
**Deployed By:** ________________  
**VPS IP:** ________________  
**Domain:** admasits.com
