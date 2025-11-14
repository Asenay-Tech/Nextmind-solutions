# 🚀 Hostinger Deployment Guide for AdmasITS

## Overview

This guide will walk you through deploying your Next.js application to Hostinger. Since you're using Next.js 16, we have two deployment options:

1. **Static Export** (Recommended for shared hosting) - Exports as static HTML/CSS/JS
2. **VPS Deployment** (For full Next.js features) - Requires Node.js server

**Your domain:** `admasits.com` (already configured in Hostinger)

---

## 📋 Prerequisites

- ✅ Domain `admasits.com` registered and managed in Hostinger
- ✅ Hostinger hosting account (shared hosting or VPS)
- ✅ Access to Hostinger File Manager or FTP
- ✅ Node.js installed locally (for building)

---

## 🔧 Option 1: Static Export (Recommended for Shared Hosting)

### Step 1: Configure Next.js for Static Export

Update `next.config.ts` to enable static export:

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable static export
  output: 'export',
  
  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },
  
  // Keep your existing optimizations
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@headlessui/react'],
  },
};

export default withNextIntl(nextConfig);
```

**⚠️ Important Notes:**
- Static export doesn't support API routes or server-side rendering
- Image optimization is disabled (images served as-is)
- All routes must be statically generated

### Step 2: Update i18n Configuration for Static Export

Update `middleware.ts` to handle static export:

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // For static export, we'll handle routing via .htaccess
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### Step 3: Build Production Bundle

```bash
cd admas-consulting
npm run build
```

This will create an `out/` folder (not `dist/`) with all static files.

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /en                                  5.2 kB         85.3 kB
└ ○ /de                                  5.2 kB         85.3 kB
```

### Step 4: Verify Build Output

Check that `out/` folder contains:
- `index.html` (or `en/index.html` and `de/index.html`)
- `_next/` folder with optimized assets
- All static assets (images, fonts, etc.)

---

## 🗂️ Step 2: Upload via Hostinger File Manager

### Option A: Using Hostinger File Manager (Easiest)

1. **Log in to Hostinger**
   - Go to `https://hpanel.hostinger.com`
   - Navigate to **Files** → **File Manager**

2. **Navigate to public_html**
   - Open the `public_html` folder (this is your website root)
   - **⚠️ Backup existing files first** (if any)

3. **Upload Files**
   - Click **Upload** button
   - Select **ALL contents** of the `out/` folder
   - Upload:
     - All HTML files
     - `_next/` folder (entire folder)
     - `assets/` folder (if exists)
     - Any other static files

4. **File Structure Should Look Like:**
   ```
   public_html/
   ├── en/
   │   └── index.html
   ├── de/
   │   └── index.html
   ├── _next/
   │   ├── static/
   │   └── ...
   ├── assets/
   └── .htaccess (we'll create this)
   ```

### Option B: Using FTP (Alternative)

1. **Get FTP Credentials**
   - Hostinger Panel → **FTP Accounts**
   - Note: Hostname, Username, Password

2. **Connect via FTP Client**
   - Use FileZilla, WinSCP, or VS Code FTP extension
   - Connect to your FTP server
   - Navigate to `public_html/`
   - Upload all files from `out/` folder

---

## 🌐 Step 3: Configure .htaccess for Routing

Create a `.htaccess` file in `public_html/` with the following content:

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Handle locale routing
  # Redirect root to /en
  RewriteCond %{REQUEST_URI} ^/$
  RewriteRule ^(.*)$ /en/ [R=301,L]

  # Handle /en and /de routes
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(en|de)/(.*)$ /$1/$2 [L]

  # If file doesn't exist, try locale folders
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/(en|de)/
  RewriteRule ^(.*)$ /en/$1 [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Force HTTPS (after SSL is enabled)
# Uncomment after SSL is set up:
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**How to create `.htaccess`:**
1. In Hostinger File Manager, click **New File**
2. Name it `.htaccess` (with the dot)
3. Paste the content above
4. Save

---

## 🌐 Step 4: Connect Domain

### Verify DNS Settings

1. **In Hostinger Panel:**
   - Go to **Domains** → **DNS / Nameservers**
   - Ensure nameservers are set to Hostinger's:
     - `ns1.dns-parking.com`
     - `ns2.dns-parking.com`

2. **Check DNS Records:**
   - **A Record:** Should point to Hostinger's IP
   - **CNAME:** `www` → `admasits.com` (optional)

3. **Domain Configuration:**
   - In Hostinger Panel → **Domains** → Select `admasits.com`
   - Ensure domain is **pointed to** your hosting account
   - Set **Document Root** to `public_html` (default)

### Update Base Path (If Needed)

If your site is in a subdirectory, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  basePath: '/', // Change to '/subfolder' if needed
  assetPrefix: '/', // Change to '/subfolder' if needed
  // ... rest of config
};
```

**For root domain (`admasits.com`), keep as `/`**

---

## 🔐 Step 5: Enable HTTPS (SSL)

### Activate Free SSL via Hostinger

1. **In Hostinger Panel:**
   - Go to **Security** → **SSL**
   - Find `admasits.com` in the list
   - Click **Install SSL** or **Activate**

2. **Wait for SSL Installation:**
   - Usually takes 5-15 minutes
   - You'll see a green checkmark when active

3. **Enable HTTPS Redirect:**
   - After SSL is active, uncomment these lines in `.htaccess`:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

4. **Verify SSL:**
   - Visit `https://admasits.com`
   - Check for padlock icon in browser
   - Test: `https://www.ssllabs.com/ssltest/analyze.html?d=admasits.com`

### Fix Mixed Content Issues

If you see mixed content warnings:

1. **Check all URLs in your code:**
   - Ensure images use `https://` or relative paths
   - Update any hardcoded `http://` URLs

2. **Add Content Security Policy** (optional, in `.htaccess`):
   ```apache
   <IfModule mod_headers.c>
     Header set Content-Security-Policy "upgrade-insecure-requests"
   </IfModule>
   ```

---

## 🧪 Step 6: Verify Deployment

### 1. Test Basic Functionality

Visit your site:
- `https://admasits.com` → Should redirect to `https://admasits.com/en`
- `https://admasits.com/en` → English version
- `https://admasits.com/de` → German version

**Check:**
- ✅ Page loads correctly
- ✅ Images display properly
- ✅ Language switcher works
- ✅ Navigation links work
- ✅ No console errors (F12 → Console)

### 2. Test Routing

- Navigate between pages
- Test language switching
- Check that URLs update correctly
- Verify browser back/forward buttons work

### 3. Performance Testing

**Lighthouse Audit:**
1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Performance**, **Accessibility**, **Best Practices**, **SEO**
4. Click **Generate report**
5. Target scores: 90+ in all categories

**GTmetrix:**
1. Visit `https://gtmetrix.com`
2. Enter `https://admasits.com`
3. Check:
   - PageSpeed Score
   - YSlow Score
   - Load time
   - Total page size

**WebPageTest:**
1. Visit `https://www.webpagetest.org`
2. Test from multiple locations
3. Check Core Web Vitals

### 4. Mobile Testing

- Test on actual mobile devices
- Use Chrome DevTools device emulator
- Check responsive layout at different breakpoints

---

## 🔄 Step 7: Auto-Deploy Setup (Optional)

### Option A: GitHub + Manual Deploy

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Production build"
   git push origin main
   ```

2. **Deploy workflow:**
   - Pull latest code
   - Run `npm run build`
   - Upload `out/` folder to Hostinger

### Option B: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./out/
          server-dir: /public_html/
```

**Setup Secrets in GitHub:**
- `FTP_SERVER`: Your FTP hostname
- `FTP_USERNAME`: Your FTP username
- `FTP_PASSWORD`: Your FTP password

---

## 🖥️ Option 2: VPS Deployment (For Full Next.js Features)

If you need server-side rendering, API routes, or dynamic features:

### Prerequisites

- Hostinger VPS plan
- SSH access
- Node.js installed on VPS

### Steps

1. **SSH into VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository:**
   ```bash
   git clone https://github.com/yourusername/admas-consulting.git
   cd admas-consulting
   ```

4. **Install Dependencies:**
   ```bash
   npm install --production
   ```

5. **Build Application:**
   ```bash
   npm run build
   ```

6. **Run with PM2:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "admasits" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name admasits.com www.admasits.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable SSL:**
   ```bash
   sudo certbot --nginx -d admasits.com -d www.admasits.com
   ```

---

## 🔧 Troubleshooting

### Issue: 404 Errors on Routes

**Solution:** Ensure `.htaccess` is correctly configured and `mod_rewrite` is enabled.

### Issue: Images Not Loading

**Solution:** 
- Check image paths are relative
- Verify `_next/static/` folder uploaded correctly
- Check browser console for 404 errors

### Issue: Language Switching Not Working

**Solution:**
- Verify `middleware.ts` configuration
- Check `.htaccess` routing rules
- Ensure both `/en` and `/de` folders exist

### Issue: SSL Certificate Not Working

**Solution:**
- Wait 15-30 minutes after installation
- Clear browser cache
- Verify DNS propagation
- Check SSL status in Hostinger panel

### Issue: Slow Loading Times

**Solution:**
- Enable compression in `.htaccess`
- Check image sizes (compress if needed)
- Verify caching headers
- Use CDN (Cloudflare) if available

---

## 📊 Post-Deployment Checklist

- [ ] Site loads at `https://admasits.com`
- [ ] HTTPS redirect works
- [ ] Language switcher functions
- [ ] All images display correctly
- [ ] Navigation links work
- [ ] Mobile responsive
- [ ] Lighthouse score 90+
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] DNS propagation complete

---

## 🎯 Quick Reference Commands

```bash
# Build for production
npm run build

# Check build output
ls -la out/

# Test build locally (if using serve)
npx serve out/

# Deploy (after building)
# Upload 'out/' folder contents to public_html/
```

---

## 📞 Support Resources

- **Hostinger Support:** https://www.hostinger.com/contact
- **Next.js Docs:** https://nextjs.org/docs
- **SSL Checker:** https://www.ssllabs.com/ssltest/

---

**Last Updated:** 2025-11-13
**Status:** ✅ Ready for Deployment

