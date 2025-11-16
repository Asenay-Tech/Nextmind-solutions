# 🚀 VPS Deployment Quick Start Guide

## One-Line Deployment

```bash
# SSH into your VPS, then run:
curl -fsSL https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/fix/build-and-docker-clean/admas-consulting/deploy.sh | sudo bash
```

Or download and run manually:

```bash
wget https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/fix/build-and-docker-clean/admas-consulting/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

## Manual Deployment Steps

### 1. SSH into VPS
```bash
ssh root@your-vps-ip
```

### 2. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 5. Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 6. Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7. Clone Repository
```bash
sudo mkdir -p /var/www/admasits
cd /var/www/admasits
sudo git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting
sudo git checkout fix/build-and-docker-clean
```

### 8. Configure Nginx
```bash
sudo cp nginx-production.conf /etc/nginx/sites-available/admasits.com
sudo ln -s /etc/nginx/sites-available/admasits.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 9. Build & Start Docker
```bash
cd /var/www/admasits/admas-consulting
sudo mkdir -p logs
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### 10. Get SSL Certificate
```bash
sudo certbot --nginx -d admasits.com -d www.admasits.com
```

### 11. Set Up Auto-Start
```bash
sudo cp systemd-service.service /etc/systemd/system/admas-site.service
sudo systemctl daemon-reload
sudo systemctl enable admas-site.service
sudo systemctl start admas-site.service
```

## Verification

### Check Container Status
```bash
cd /var/www/admasits/admas-consulting
docker-compose ps
# Should show: Up (healthy)
```

### Check Logs
```bash
docker-compose logs -f
# Should show: Ready on http://0.0.0.0:3000
```

### Test Endpoints
```bash
curl http://localhost:3000/en
curl https://admasits.com/en
```

### Browser Test
Open: `https://admasits.com`

## Troubleshooting

### Container Not Starting
```bash
cd /var/www/admasits/admas-consulting
docker-compose logs -f
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Nginx Not Working
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### SSL Issues
```bash
sudo certbot certificates
sudo certbot --nginx -d admasits.com -d www.admasits.com --force-renewal
```

## Useful Commands

```bash
# View logs
cd /var/www/admasits/admas-consulting && docker-compose logs -f

# Restart app
sudo systemctl restart admas-site

# Rebuild app
cd /var/www/admasits/admas-consulting
docker-compose build --no-cache && docker-compose up -d

# Update code
cd /var/www/admasits/admas-consulting
git pull origin fix/build-and-docker-clean
docker-compose build --no-cache && docker-compose up -d
```

## Files Created

After deployment, these files are in place:

- `/var/www/admasits/admas-consulting/` - Application directory
- `/etc/nginx/sites-available/admasits.com` - Nginx configuration
- `/etc/nginx/sites-enabled/admasits.com` - Nginx symlink
- `/etc/systemd/system/admas-site.service` - Auto-start service
- `/etc/letsencrypt/live/admasits.com/` - SSL certificates

## Support

See `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting and verification steps.

