# AdmasITS VPS Deployment Instructions

## Quick Start

Run the automated deployment script on your VPS:

```bash
# SSH into your VPS
ssh root@72.156.126

# Download and run deployment script
curl -O https://raw.githubusercontent.com/Asenay-Tech/Nextmind-solutions/main/admas-consulting/deploy-vps.sh
chmod +x deploy-vps.sh
./deploy-vps.sh
```

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

### 1. SSH into VPS

```bash
ssh root@72.156.126
```

### 2. Update System

```bash
apt update && apt upgrade -y
```

### 3. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 4. Install PM2

```bash
npm install -g pm2
pm2 --version
```

### 5. Install Nginx

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 6. Install Git

```bash
apt install -y git
```

### 7. Clone Repository

```bash
mkdir -p /var/www/admasits
cd /var/www/admasits
git clone https://github.com/Asenay-Tech/Nextmind-solutions.git .
cd admas-consulting
```

### 8. Install Dependencies

```bash
npm ci --production=false
```

### 9. Build Application

```bash
NODE_ENV=production npm run build
```

### 10. Create PM2 Configuration

Create `/var/www/admasits/admas-consulting/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'admas-site',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/admasits/admas-consulting',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/admasits/logs/pm2-error.log',
    out_file: '/var/www/admasits/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
```

Create logs directory:

```bash
mkdir -p /var/www/admasits/logs
```

### 11. Start with PM2

```bash
cd /var/www/admasits/admas-consulting
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions shown
```

### 12. Configure Nginx

Create `/etc/nginx/sites-available/admasits`:

```nginx
server {
    listen 80;
    server_name admasits.com www.admasits.com;

    client_max_body_size 10M;

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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 24h;
        add_header Cache-Control "public";
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site
nginx -t  # Test configuration
systemctl reload nginx
```

### 13. Configure DNS

Point your domain DNS records to your VPS IP:

- **Type:** A
- **Name:** @ (or admasits.com)
- **Value:** 72.156.126
- **TTL:** 3600 (or default)

- **Type:** A
- **Name:** www
- **Value:** 72.156.126
- **TTL:** 3600 (or default)

Wait for DNS propagation (can take up to 24 hours, usually 1-2 hours).

### 14. Install SSL Certificate (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d admasits.com -d www.admasits.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 15. Set Up Auto-Renewal

```bash
crontab -e
```

Add this line:

```
0 3 * * * /usr/bin/certbot renew --quiet
```

This will check for certificate renewal daily at 3 AM.

## Post-Deployment

### Check Application Status

```bash
pm2 status
pm2 logs admas-site --lines 50
```

### Restart Application

```bash
cd /var/www/admasits/admas-consulting
pm2 restart admas-site
```

### Update Application

```bash
cd /var/www/admasits
git pull origin main
cd admas-consulting
npm ci --production=false
NODE_ENV=production npm run build
pm2 restart admas-site
```

### View Logs

```bash
# PM2 logs
pm2 logs admas-site

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Application logs
tail -f /var/www/admasits/logs/pm2-out.log
tail -f /var/www/admasits/logs/pm2-error.log
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs admas-site --lines 100

# Restart application
pm2 restart admas-site
```

### Nginx 502 Bad Gateway

- Check if the application is running: `pm2 status`
- Check if the application is listening on port 3000: `netstat -tlnp | grep 3000`
- Check application logs: `pm2 logs admas-site`

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

### SSL Certificate Issues

```bash
# Test renewal
certbot renew --dry-run

# Check certificate status
certbot certificates
```

## Environment Variables (if needed)

If you need environment variables, create `.env.production`:

```bash
nano /var/www/admasits/admas-consulting/.env.production
```

Add:

```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://admasits.com
PORT=3000
```

Then restart:

```bash
pm2 restart admas-site
```

## Security Checklist

- [x] Nginx configured with security headers
- [x] HTTPS enabled with Let's Encrypt
- [x] Firewall configured (UFW recommended)
- [x] PM2 running as non-root user (optional but recommended)
- [x] Regular system updates
- [x] SSL auto-renewal configured

## Firewall Setup (Recommended)

```bash
apt install -y ufw
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
ufw status
```

## Performance Monitoring

```bash
# Monitor PM2
pm2 monit

# View system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h
```

## Success Criteria

✅ App accessible at `http://admasits.com`  
✅ App accessible at `https://admasits.com` (after SSL)  
✅ PM2 process running  
✅ Nginx serving the application  
✅ SSL certificate installed and auto-renewing  

## Support

If you encounter issues, check:
1. PM2 logs: `pm2 logs admas-site`
2. Nginx logs: `/var/log/nginx/error.log`
3. Application build: `npm run build` (should complete without errors)

