# ✅ Deployment Checklist

Use this checklist to ensure successful deployment.

## Pre-Deployment

- [ ] VPS access (SSH key or root password)
- [ ] Domain DNS records configured (A record pointing to VPS IP)
- [ ] GitHub repository is accessible
- [ ] Local build works: `npm run build`

## Deployment Steps

### 1. Initial Server Setup
- [ ] SSH into VPS: `ssh root@72.156.126`
- [ ] System updated: `apt update && apt upgrade -y`
- [ ] Node.js 20.x installed and verified
- [ ] PM2 installed globally
- [ ] Nginx installed and running
- [ ] Git installed

### 2. Application Setup
- [ ] Repository cloned to `/var/www/admasits`
- [ ] Dependencies installed: `npm ci --production=false`
- [ ] Application built: `NODE_ENV=production npm run build`
- [ ] Build completed without errors

### 3. PM2 Configuration
- [ ] `ecosystem.config.js` created
- [ ] Logs directory created: `/var/www/admasits/logs`
- [ ] PM2 started: `pm2 start ecosystem.config.js`
- [ ] PM2 saved: `pm2 save`
- [ ] PM2 startup configured: `pm2 startup`
- [ ] Application running: `pm2 status`

### 4. Nginx Configuration
- [ ] Nginx config created: `/etc/nginx/sites-available/admasits`
- [ ] Site enabled: `ln -s /etc/nginx/sites-available/admasits /etc/nginx/sites-enabled/`
- [ ] Default site removed (if exists)
- [ ] Nginx config tested: `nginx -t`
- [ ] Nginx reloaded: `systemctl reload nginx`

### 5. DNS Configuration
- [ ] A record for `admasits.com` → `72.156.126`
- [ ] A record for `www.admasits.com` → `72.156.126`
- [ ] DNS propagated (check with `nslookup admasits.com`)
- [ ] Site accessible via HTTP: `http://admasits.com`

### 6. SSL Certificate
- [ ] Certbot installed: `apt install -y certbot python3-certbot-nginx`
- [ ] SSL certificate obtained: `certbot --nginx -d admasits.com -d www.admasits.com`
- [ ] HTTPS working: `https://admasits.com`
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal configured in crontab

### 7. Security
- [ ] Firewall configured (UFW recommended)
- [ ] Only ports 22, 80, 443 open
- [ ] SSH key-based authentication (optional but recommended)
- [ ] Regular system updates scheduled

## Post-Deployment Verification

### Application Status
- [ ] Site loads at `https://admasits.com`
- [ ] Site loads at `https://www.admasits.com`
- [ ] Both locales work: `/en` and `/de`
- [ ] Language switcher works
- [ ] All pages load correctly
- [ ] Images load correctly
- [ ] Forms work correctly

### Performance
- [ ] Page load times are acceptable
- [ ] Static assets cached properly
- [ ] No console errors in browser
- [ ] No 404 errors in logs

### Monitoring
- [ ] PM2 monitoring: `pm2 monit`
- [ ] Logs accessible: `pm2 logs admas-site`
- [ ] Nginx logs accessible: `/var/log/nginx/access.log`
- [ ] Error logs accessible: `/var/log/nginx/error.log`

## Troubleshooting Commands

```bash
# Check application status
pm2 status
pm2 logs admas-site --lines 50

# Check if port 3000 is in use
netstat -tlnp | grep 3000

# Check Nginx status
systemctl status nginx
nginx -t

# Test site locally
curl http://localhost:3000

# Check SSL certificate
certbot certificates

# Check DNS
nslookup admasits.com
dig admasits.com
```

## Common Issues

### Issue: Application not starting
**Solution:**
```bash
cd /var/www/admasits/admas-consulting
npm run build  # Check for build errors
pm2 logs admas-site --lines 100
```

### Issue: Nginx 502 Bad Gateway
**Solution:**
```bash
pm2 restart admas-site
systemctl status nginx
# Check if app is running on port 3000
netstat -tlnp | grep 3000
```

### Issue: SSL certificate not working
**Solution:**
```bash
certbot renew --dry-run
certbot certificates
# Re-run certbot if needed
certbot --nginx -d admasits.com -d www.admasits.com --force-renewal
```

### Issue: DNS not resolving
**Solution:**
- Wait for DNS propagation (up to 24 hours)
- Check DNS settings in Hostinger panel
- Verify A records are correct

## Success Criteria

✅ App accessible at `https://admasits.com`  
✅ App accessible at `https://www.admasits.com`  
✅ HTTPS working with valid SSL certificate  
✅ All pages load correctly  
✅ Both English and German locales work  
✅ PM2 process running and stable  
✅ Nginx serving traffic correctly  
✅ Auto-renewal configured for SSL  

## Next Steps

After successful deployment:
1. Monitor logs for first 24 hours
2. Set up regular backups
3. Configure monitoring/alerts (optional)
4. Set up CI/CD for auto-deployment (optional)

