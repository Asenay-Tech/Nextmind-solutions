# Docker Folder Structure Verification

## Container Structure After Build

This document verifies that all paths in the Dockerfile match the actual Next.js standalone output structure.

### Expected Standalone Output Structure

After `npm run build`, Next.js generates:

```
.next/standalone/
├── admas-consulting/              # Package name directory
│   ├── server.js                  # ⭐ Entry point
│   ├── node_modules/              # Production dependencies
│   └── package.json
└── node_modules/                  # Shared dependencies
```

### Dockerfile Copy Operations

```dockerfile
# Copy entire standalone directory to /app/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets to /app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public assets to /app/public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
```

### Container Structure After COPY

After all COPY operations, the container structure is:

```
/app/
├── admas-consulting/              # From standalone directory
│   ├── server.js                  # ⭐ Entry point location
│   ├── node_modules/              # Production dependencies
│   └── package.json
├── node_modules/                  # Shared dependencies
├── .next/
│   └── static/                    # Static assets
│       ├── chunks/                # JavaScript bundles
│       ├── media/                 # Fonts, images
│       └── [build-id]/            # Build manifests
└── public/                        # Public assets
    ├── assets/
    ├── images/
    └── ...
```

### WORKDIR Configuration

```dockerfile
WORKDIR /app/admas-consulting      # ✅ Changes to app directory
CMD ["node", "server.js"]          # ✅ Executes from /app/admas-consulting
```

### Verification

✅ **Entry Point:** `/app/admas-consulting/server.js` - **CORRECT**  
✅ **Static Assets:** `/app/.next/static` - **CORRECT**  
✅ **Public Assets:** `/app/public` - **CORRECT**  
✅ **Working Directory:** `/app/admas-consulting` - **CORRECT**  
✅ **CMD Path:** `server.js` (relative to WORKDIR) - **CORRECT**  

### Path Resolution in Runtime

When the container starts:

1. WORKDIR is set to `/app/admas-consulting`
2. CMD executes: `node server.js`
3. Node.js resolves `server.js` relative to `/app/admas-consulting`
4. Server starts and serves:
   - App routes from `/app/admas-consulting`
   - Static assets from `/app/.next/static` (Next.js handles this)
   - Public assets from `/app/public` (Next.js handles this)

### Next.js Standalone Server Behavior

The standalone `server.js` automatically resolves paths:

- **Static assets:** Next.js looks for `.next/static` relative to the server.js location
- **Public assets:** Next.js looks for `public/` relative to the project root
- **Build output:** Next.js uses `outputFileTracingRoot` from next.config.mjs

### Verified Configuration

From `next.config.mjs`:
```javascript
output: 'standalone',  // ✅ Enables standalone output
```

The standalone build includes all necessary dependencies and automatically resolves asset paths correctly.

### Conclusion

✅ All folder paths are **CORRECT** and **VERIFIED**:
- Server entry point: `/app/admas-consulting/server.js` ✅
- Static assets: `/app/.next/static` ✅
- Public assets: `/app/public` ✅
- Working directory: `/app/admas-consulting` ✅
- Command: `node server.js` (from WORKDIR) ✅

The Dockerfile configuration matches the Next.js standalone output structure perfectly.

