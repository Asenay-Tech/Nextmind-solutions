# 🚀 Simple Step-by-Step Deployment Guide

## Don't worry! I'll guide you through everything, one step at a time.

---

## 📍 STEP 1: Prepare Your Computer

### What you need:
- ✅ Your code is ready (it is!)
- ✅ Node.js installed (check: open terminal/command prompt and type `node --version`)

### If Node.js is NOT installed:
1. Go to: https://nodejs.org/
2. Download the "LTS" version (recommended)
3. Install it (just click Next, Next, Next)
4. Restart your computer

**✅ Check:** Open terminal/command prompt, type `node --version`, press Enter. You should see a version number like `v20.x.x`

---

## 📍 STEP 2: Open Your Project Folder

### On Windows:
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
   ```bash
   cd "C:\Users\henok\Nextmind solutions\admas-consulting"
   ```
   (Press Enter after typing)

### Or easier way:
1. Open File Explorer
2. Go to: `C:\Users\henok\Nextmind solutions\admas-consulting`
3. Click in the address bar, type `cmd`, press Enter
4. A black window (terminal) will open in that folder

---

## 📍 STEP 3: Update Configuration for Hostinger

We need to tell Next.js to create static files (HTML/CSS/JS) instead of needing a server.

### What to do:
1. Open the file: `next.config.ts` in your code editor
2. Find this line (around line 6):
   ```typescript
   const nextConfig: NextConfig = {
   ```
3. Add these TWO lines RIGHT AFTER the opening `{`:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',  // <-- ADD THIS LINE
     images: {          // <-- ADD THIS LINE
       unoptimized: true,  // <-- ADD THIS LINE
     },                 // <-- ADD THIS LINE
   ```
4. Your file should look like this:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
     // Image optimization
     images: {
       formats: ['image/avif', 'image/webp'],
       // ... rest of your config
   ```
   
   **Wait!** You'll have TWO `images:` sections now. That's okay - we'll fix it.

5. **Actually, let me make it easier:** Just replace your ENTIRE `next.config.ts` file with this:

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Enable static export for Hostinger
  output: 'export',
  
  // Disable image optimization (required for static export)
  images: {
    unoptimized: true,
  },
  
  // Compression
  compress: true,
  
  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@headlessui/react'],
    optimizeCss: true,
  },
};

export default withNextIntl(nextConfig);
```

6. **Save the file** (Ctrl + S)

---

## 📍 STEP 4: Build Your Website

This creates all the files you need to upload.

### In the terminal/command prompt (the black window):

1. Make sure you're in the right folder:
   ```bash
   cd "C:\Users\henok\Nextmind solutions\admas-consulting"
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
   Press Enter and wait (this might take 2-5 minutes)

3. Build your website:
   ```bash
   npm run build
   ```
   Press Enter and wait (this might take 1-3 minutes)

4. **What you should see:**
   - Lots of text scrolling
   - At the end: "✓ Compiled successfully"
   - No red errors

5. **Check if it worked:**
   - Look for a folder called `out` in your project folder
   - Open it - you should see folders like `en`, `de`, `_next`, etc.

**✅ If you see the `out` folder with files inside, STEP 4 is done!**

---

## 📍 STEP 5: Log Into Hostinger

1. Open your web browser
2. Go to: https://hpanel.hostinger.com
3. Log in with your Hostinger account email and password
4. You should see your Hostinger dashboard

**✅ If you're logged in, STEP 5 is done!**

---

## 📍 STEP 6: Open File Manager

1. In Hostinger dashboard, look for **"Files"** in the left menu
2. Click on **"File Manager"**
3. You should see folders like `public_html`, `logs`, etc.

**✅ If you see the File Manager, STEP 6 is done!**

---

## 📍 STEP 7: Go to public_html Folder

1. In File Manager, find the folder called **`public_html`**
2. **Double-click** on `public_html` to open it
3. This is where your website files go!

**⚠️ IMPORTANT:** If there are any files here already:
- **Back them up first!** (Select all, right-click, Download)
- Or just note what's there (take a screenshot)

**✅ If you're inside `public_html` folder, STEP 7 is done!**

---

## 📍 STEP 8: Upload Your Website Files

### Option A: Upload via File Manager (Easiest)

1. **In Hostinger File Manager:**
   - Click the **"Upload"** button (usually at the top)
   - A new window/tab opens

2. **On your computer:**
   - Go to: `C:\Users\henok\Nextmind solutions\admas-consulting\out`
   - **Select ALL files and folders** inside the `out` folder:
     - Press `Ctrl + A` to select all
     - Or drag and drop everything

3. **Upload:**
   - Drag all selected files into the Hostinger upload window
   - OR click "Select Files" and choose all files
   - Wait for upload to finish (might take 2-5 minutes)

4. **What should be uploaded:**
   - `en` folder
   - `de` folder
   - `_next` folder
   - `assets` folder (if it exists)
   - Any `.html` files

**✅ If all files are uploaded, STEP 8 is done!**

---

## 📍 STEP 9: Upload .htaccess File

This file helps your website work correctly.

1. **In your project folder**, find the file called `.htaccess`
   - Location: `C:\Users\henok\Nextmind solutions\admas-consulting\.htaccess`

2. **In Hostinger File Manager:**
   - Make sure you're still in `public_html` folder
   - Click **"New File"** button
   - Name it exactly: `.htaccess` (with the dot at the beginning!)
   - Click Create

3. **Open the file:**
   - Right-click on `.htaccess` → Edit
   - Copy ALL content from your local `.htaccess` file
   - Paste it into Hostinger's editor
   - Click **Save**

**✅ If `.htaccess` file is uploaded and saved, STEP 9 is done!**

---

## 📍 STEP 10: Test Your Website

1. Open a new browser tab
2. Go to: `http://admasits.com`
3. **What should happen:**
   - Website loads
   - Might redirect to `/en`
   - You see your homepage

**✅ If website loads, STEP 10 is done!**

**❌ If you see errors:**
- Wait 5 minutes (DNS needs time to update)
- Try again
- Check if all files uploaded correctly

---

## 📍 STEP 11: Enable SSL (HTTPS)

This makes your website secure (shows padlock icon).

1. **In Hostinger dashboard:**
   - Go to **"Security"** in left menu
   - Click **"SSL"**

2. **Find your domain:**
   - Look for `admasits.com` in the list
   - Click **"Install SSL"** or **"Activate"** button

3. **Wait:**
   - Usually takes 5-15 minutes
   - You'll see a green checkmark when done

4. **After SSL is active:**
   - Go back to File Manager
   - Open `.htaccess` file
   - Find these lines (around line 7-8):
     ```apache
     # RewriteCond %{HTTPS} off
     # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
     ```
   - **Remove the `#` symbols** from both lines:
     ```apache
     RewriteCond %{HTTPS} off
     RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
     ```
   - Save the file

5. **Test:**
   - Go to `https://admasits.com`
   - You should see a padlock icon 🔒 in the browser

**✅ If HTTPS works with padlock icon, STEP 11 is done!**

---

## 📍 STEP 12: Final Check

Test everything:

- [ ] Website loads: `https://admasits.com`
- [ ] English version works: `https://admasits.com/en`
- [ ] German version works: `https://admasits.com/de`
- [ ] Language switcher works
- [ ] All images show correctly
- [ ] Navigation links work
- [ ] Padlock icon shows (HTTPS)

**✅ If everything works, CONGRATULATIONS! Your website is live! 🎉**

---

## 🆘 Need Help?

### Problem: "npm: command not found"
**Solution:** Node.js is not installed. Go back to STEP 1.

### Problem: Build fails with errors
**Solution:** 
- Make sure you're in the right folder
- Try: `npm install` first
- Check if `next.config.ts` is saved correctly

### Problem: Website shows 404 error
**Solution:**
- Check if `.htaccess` file is uploaded
- Make sure all files from `out` folder are uploaded
- Wait 5 minutes and try again

### Problem: Images don't show
**Solution:**
- Check if `_next` folder was uploaded completely
- Verify `assets` folder is uploaded
- Clear browser cache (Ctrl + Shift + Delete)

### Problem: SSL not working
**Solution:**
- Wait 15-30 minutes after installing
- Clear browser cache
- Check SSL status in Hostinger panel

---

## 📝 Quick Reference

**Your project folder:**
```
C:\Users\henok\Nextmind solutions\admas-consulting
```

**Build output folder:**
```
C:\Users\henok\Nextmind solutions\admas-consulting\out
```

**Hostinger upload location:**
```
public_html/
```

**Your website URL:**
```
https://admasits.com
```

---

## 🎯 Summary

1. ✅ Install Node.js (if needed)
2. ✅ Update `next.config.ts`
3. ✅ Run `npm run build`
4. ✅ Log into Hostinger
5. ✅ Open File Manager
6. ✅ Go to `public_html`
7. ✅ Upload `out` folder contents
8. ✅ Upload `.htaccess` file
9. ✅ Test website
10. ✅ Enable SSL
11. ✅ Update `.htaccess` for HTTPS
12. ✅ Final testing

**Take your time. Do one step at a time. You've got this! 💪**

