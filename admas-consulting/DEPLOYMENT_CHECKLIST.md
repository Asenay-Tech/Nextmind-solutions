# ✅ Hostinger Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## 📋 Pre-Deployment

- [ ] **Backup existing site** (if any files exist in public_html)
- [ ] **Test build locally** (`npm run build`)
- [ ] **Verify build output** (check `out/` folder exists)
- [ ] **Review deployment guide** (`DEPLOYMENT_GUIDE.md`)

## 🔧 Configuration

- [ ] **Update next.config.ts** for static export
  - [ ] Add `output: 'export'`
  - [ ] Set `images: { unoptimized: true }`
- [ ] **Build production bundle**
  ```bash
  npm run build
  ```
- [ ] **Verify build success** (no errors in terminal)
- [ ] **Check out/ folder** contains:
  - [ ] `en/` folder with `index.html`
  - [ ] `de/` folder with `index.html`
  - [ ] `_next/` folder with static assets
  - [ ] `assets/` folder (if exists)

## 📤 Upload Files

- [ ] **Access Hostinger File Manager**
  - [ ] Log in to hpanel.hostinger.com
  - [ ] Navigate to Files → File Manager
- [ ] **Navigate to public_html**
  - [ ] Open `public_html` folder
  - [ ] Clear existing files (if needed, after backup)
- [ ] **Upload build files**
  - [ ] Upload ALL contents of `out/` folder
  - [ ] Ensure `_next/` folder uploaded completely
  - [ ] Verify file structure matches expected layout
- [ ] **Upload .htaccess**
  - [ ] Copy `.htaccess` file to `public_html/`
  - [ ] Verify file permissions (644)

## 🌐 Domain Configuration

- [ ] **Verify DNS settings**
  - [ ] Nameservers point to Hostinger
  - [ ] A record configured correctly
  - [ ] CNAME for www (optional)
- [ ] **Check domain pointing**
  - [ ] Domain points to hosting account
  - [ ] Document root set to `public_html`
- [ ] **Test domain**
  - [ ] Visit `http://admasits.com` (should redirect to `/en`)
  - [ ] Check both `/en` and `/de` routes work

## 🔐 SSL Setup

- [ ] **Install SSL certificate**
  - [ ] Go to Security → SSL in Hostinger panel
  - [ ] Click "Install SSL" for admasits.com
  - [ ] Wait 5-15 minutes for activation
- [ ] **Enable HTTPS redirect**
  - [ ] Uncomment HTTPS redirect lines in `.htaccess`
  - [ ] Test `http://` redirects to `https://`
- [ ] **Verify SSL**
  - [ ] Check padlock icon in browser
  - [ ] Test SSL Labs: https://www.ssllabs.com/ssltest/
  - [ ] No mixed content warnings

## 🧪 Testing

### Basic Functionality
- [ ] **Homepage loads**
  - [ ] `https://admasits.com` works
  - [ ] Redirects to `/en` correctly
- [ ] **Language switching**
  - [ ] Language switcher works
  - [ ] `/en` and `/de` routes accessible
  - [ ] Content changes between languages
- [ ] **Navigation**
  - [ ] All menu links work
  - [ ] Footer links work
  - [ ] Internal navigation functions

### Visual Checks
- [ ] **Images display**
  - [ ] Logo loads correctly
  - [ ] All images render properly
  - [ ] No broken image icons
- [ ] **Styling**
  - [ ] CSS loads correctly
  - [ ] Fonts display properly
  - [ ] Layout looks correct
- [ ] **Responsive design**
  - [ ] Mobile view works
  - [ ] Tablet view works
  - [ ] Desktop view works

### Performance
- [ ] **Lighthouse audit**
  - [ ] Performance score: 90+
  - [ ] Accessibility score: 90+
  - [ ] Best Practices score: 90+
  - [ ] SEO score: 90+
- [ ] **Core Web Vitals**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] **Page speed**
  - [ ] GTmetrix test passed
  - [ ] Page loads in < 3 seconds
  - [ ] No major performance issues

### Browser Compatibility
- [ ] **Chrome** - Works correctly
- [ ] **Firefox** - Works correctly
- [ ] **Safari** - Works correctly
- [ ] **Edge** - Works correctly
- [ ] **Mobile browsers** - Works correctly

## 🔍 Debugging

### Common Issues
- [ ] **404 errors**
  - [ ] Check `.htaccess` file exists
  - [ ] Verify mod_rewrite enabled
  - [ ] Check file paths are correct
- [ ] **Images not loading**
  - [ ] Verify `_next/static/` folder uploaded
  - [ ] Check image paths in code
  - [ ] Verify file permissions
- [ ] **Language routing issues**
  - [ ] Check `.htaccess` routing rules
  - [ ] Verify both `/en` and `/de` folders exist
  - [ ] Test middleware configuration
- [ ] **SSL issues**
  - [ ] Wait 15-30 minutes after installation
  - [ ] Clear browser cache
  - [ ] Check SSL status in Hostinger panel

## 📊 Post-Deployment

- [ ] **Monitor site**
  - [ ] Check error logs (if available)
  - [ ] Monitor performance
  - [ ] Check analytics (if set up)
- [ ] **Documentation**
  - [ ] Note any custom configurations
  - [ ] Document deployment process
  - [ ] Save deployment notes

## 🚀 Future Deployments

- [ ] **Set up deployment workflow**
  - [ ] Create deployment script (optional)
  - [ ] Document update process
  - [ ] Set up auto-deploy (if using GitHub Actions)

---

## 📝 Notes

**Deployment Date:** _______________

**Deployed By:** _______________

**Issues Encountered:** 
- 

**Solutions Applied:**
- 

**Additional Notes:**
- 

---

**Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete

