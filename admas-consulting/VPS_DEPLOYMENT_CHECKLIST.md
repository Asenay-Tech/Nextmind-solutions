# ✅ Hostinger VPS Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📋 Pre-Deployment

- [ ] **VPS Access**
  - [ ] Have VPS IP address
  - [ ] Have root password or SSH key
  - [ ] Can SSH into VPS successfully

- [ ] **Domain Configuration**
  - [ ] Domain `admasits.com` points to VPS IP
  - [ ] DNS records configured correctly
  - [ ] Nameservers set correctly

- [ ] **Local Preparation**
  - [ ] Code is committed to Git (if using Git)
  - [ ] Environment variables documented
  - [ ] Build tested locally (`npm run build` works)

## 🔧 Server Setup

- [ ] **System Updates**
  - [ ] System updated (`apt update && apt upgrade`)
  - [ ] Essential tools installed (curl, wget, git)

- [ ] **Node.js Installation**
  - [ ] Node.js 20.x installed
  - [ ] Verified: `node --version` shows v20.x.x
  - [ ] npm working: `npm --version`

- [ ] **PM2 Installation**
  - [ ] PM2 installed globally
  - [ ] Verified: `pm2 --version`

- [ ] **Nginx Installation**
  - [ ] Nginx installed
  - [ ] Nginx running: `systemctl status nginx`
  - [ ] Nginx enabled on boot

## 📤 Application Deployment

- [ ] **Project Upload**
  - [ ] Project files uploaded to `/var/www/admasits`
  - [ ] All files present (check with `ls -la`)

- [ ] **Dependencies**
  - [ ] Navigated to project directory
  - [ ] Dependencies installed: `npm install`
  - [ ] No errors during installation

- [ ] **Build**
  - [ ] Application built: `npm run build`
  - [ ] Build successful (no errors)
  - [ ] `.next` folder created

- [ ] **Environment Variables**
  - [ ] `.env.production` file created
  - [ ] All required variables set
  - [ ] File permissions correct (600)

## 🚀 Application Startup

- [ ] **PM2 Configuration**
  - [ ] Application started with PM2
  - [ ] PM2 status shows "online"
  - [ ] PM2 save executed
  - [ ] PM2 startup configured

- [ ] **Application Testing**
  - [ ] Local test: `curl http://localhost:3000` works
  - [ ] No errors in PM2 logs
  - [ ] Application responds correctly

## 🌐 Nginx Configuration

- [ ] **Nginx Config Created**
  - [ ] Config file created: `/etc/nginx/sites-available/admasits`
  - [ ] Configuration correct (no syntax errors)
  - [ ] Symbolic link created in `sites-enabled`

- [ ] **Nginx Testing**
  - [ ] Config tested: `nginx -t` passes
  - [ ] Nginx reloaded: `systemctl reload nginx`
  - [ ] Website accessible via HTTP: `http://admasits.com`

## 🔐 SSL Setup

- [ ] **Certbot Installation**
  - [ ] Certbot installed
  - [ ] Certbot Nginx plugin installed

- [ ] **SSL Certificate**
  - [ ] Certificate obtained: `certbot --nginx -d admasits.com -d www.admasits.com`
  - [ ] Certificate valid (check expiration)
  - [ ] HTTPS redirect enabled

- [ ] **SSL Testing**
  - [ ] Website accessible via HTTPS: `https://admasits.com`
  - [ ] Padlock icon shows in browser
  - [ ] SSL Labs test passes (A or A+ rating)

- [ ] **Auto-Renewal**
  - [ ] Auto-renewal test: `certbot renew --dry-run`
  - [ ] Certbot timer active: `systemctl status certbot.timer`

## 🔒 Security

- [ ] **Firewall**
  - [ ] UFW enabled
  - [ ] Port 22 (SSH) allowed
  - [ ] Port 80 (HTTP) allowed
  - [ ] Port 443 (HTTPS) allowed
  - [ ] Firewall status checked

- [ ] **SSH Security** (Optional but recommended)
  - [ ] Non-root user created
  - [ ] SSH key authentication setup
  - [ ] Root login disabled (if applicable)

- [ ] **Fail2Ban** (Optional)
  - [ ] Fail2Ban installed
  - [ ] Fail2Ban running
  - [ ] Fail2Ban enabled on boot

## 🧪 Testing

### Basic Functionality
- [ ] **Homepage**
  - [ ] `https://admasits.com` loads
  - [ ] Redirects to `/en` correctly
  - [ ] No errors in browser console

- [ ] **Language Routes**
  - [ ] `https://admasits.com/en` works
  - [ ] `https://admasits.com/de` works
  - [ ] Language switcher functions

- [ ] **Navigation**
  - [ ] All menu links work
  - [ ] Footer links work
  - [ ] Internal navigation functions

### Visual Checks
- [ ] **Images**
  - [ ] Logo displays correctly
  - [ ] All images load
  - [ ] Image optimization working (check Network tab)

- [ ] **Styling**
  - [ ] CSS loads correctly
  - [ ] Fonts display properly
  - [ ] Layout looks correct

- [ ] **Responsive**
  - [ ] Mobile view works
  - [ ] Tablet view works
  - [ ] Desktop view works

### Performance
- [ ] **Lighthouse Audit**
  - [ ] Performance score: 90+
  - [ ] Accessibility score: 90+
  - [ ] Best Practices score: 90+
  - [ ] SEO score: 90+

- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

- [ ] **Server Performance**
  - [ ] PM2 memory usage reasonable
  - [ ] CPU usage normal
  - [ ] No memory leaks

## 📊 Monitoring

- [ ] **PM2 Monitoring**
  - [ ] PM2 status checked regularly
  - [ ] Logs reviewed for errors
  - [ ] Monitoring setup (optional)

- [ ] **Server Monitoring**
  - [ ] Disk space checked
  - [ ] Memory usage monitored
  - [ ] CPU usage monitored

## 🔄 Update Process

- [ ] **Update Workflow Documented**
  - [ ] Git pull process documented
  - [ ] Build process documented
  - [ ] Restart process documented

- [ ] **Deployment Script** (Optional)
  - [ ] `deploy.sh` script created
  - [ ] Script tested
  - [ ] Script permissions set (chmod +x)

## 📝 Documentation

- [ ] **Credentials Documented**
  - [ ] VPS IP address saved securely
  - [ ] SSH credentials saved securely
  - [ ] Database credentials (if any) saved securely

- [ ] **Configuration Documented**
  - [ ] Environment variables documented
  - [ ] Nginx config documented
  - [ ] PM2 config documented

## 🆘 Troubleshooting Prepared

- [ ] **Common Issues Documented**
  - [ ] 502 Bad Gateway solution
  - [ ] Port conflicts solution
  - [ ] SSL renewal process
  - [ ] PM2 restart process

- [ ] **Backup Plan**
  - [ ] Backup strategy defined
  - [ ] Rollback process documented

---

## 📝 Deployment Notes

**Deployment Date:** _______________

**Deployed By:** _______________

**VPS IP:** _______________

**Domain:** admasits.com

**Issues Encountered:**
- 

**Solutions Applied:**
- 

**Additional Notes:**
- 

---

## 🎯 Quick Commands Reference

```bash
# Navigate to app
cd /var/www/admasits

# Pull updates and deploy
git pull && npm install && npm run build && pm2 restart admasits

# Check status
pm2 status
pm2 logs admasits

# Nginx
nginx -t
systemctl reload nginx

# SSL
certbot renew
certbot certificates

# Firewall
ufw status
```

---

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete

