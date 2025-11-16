# Next.js Project Structure

This is a Next.js 16 App Router application with TypeScript, internationalization (next-intl), and Tailwind CSS.

## Root Directory Structure

```
admas-consulting/
├── package.json              # ✅ Dependencies and scripts
├── next.config.mjs          # ✅ Next.js configuration
├── tsconfig.json            # ✅ TypeScript configuration
├── tailwind.config.ts       # ✅ Tailwind CSS configuration
├── postcss.config.mjs       # ✅ PostCSS configuration
├── eslint.config.mjs        # ✅ ESLint configuration
├── middleware.ts            # ✅ Next.js middleware (i18n routing)
├── i18n.ts                  # ✅ next-intl configuration
├── ecosystem.config.js      # ✅ PM2 configuration
├── Dockerfile               # ✅ Docker configuration
├── docker-compose.yml       # ✅ Docker Compose configuration
│
├── app/                     # ✅ Next.js App Router (main directory)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (legacy, may redirect)
│   ├── globals.css         # Global styles
│   ├── [locale]/           # Internationalized routes
│   │   ├── layout.tsx      # Locale-specific layout
│   │   ├── page.tsx        # Home page (/en, /de)
│   │   ├── about/
│   │   ├── partners/
│   │   ├── support/
│   │   └── ...
│   ├── about/              # Legacy routes (may redirect)
│   ├── partners/
│   └── ...
│
├── components/             # ✅ React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LanguageSwitcher.tsx
│   └── ...
│
├── lib/                    # ✅ Utilities and helpers
│   ├── data/
│   ├── utils/
│   └── ...
│
├── public/                 # ✅ Static assets
│   ├── images/
│   ├── assets/
│   └── ...
│
├── messages/               # ✅ i18n translation files
│   ├── en.json
│   └── de.json
│
├── hooks/                  # ✅ Custom React hooks
├── context/                # ✅ React context providers
├── scripts/                # ✅ Build/utility scripts
│
└── node_modules/           # ✅ Dependencies (generated)
└── .next/                  # ✅ Build output (generated)
```

## Key Files Explained

### package.json
Contains all npm scripts:
- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `type-check` - Run TypeScript type checking
- `lint` - Run ESLint

### next.config.mjs
Next.js configuration with:
- next-intl plugin integration
- Image optimization settings
- Security headers
- Standalone output for Docker

### app/ Directory
Uses Next.js 16 App Router:
- `app/[locale]/` - Locale-based routing (en, de)
- `app/[locale]/layout.tsx` - Root layout with i18n provider
- `app/[locale]/page.tsx` - Home page
- Route folders create URL paths automatically

### middleware.ts
Handles:
- Locale detection
- Redirects to `/en` or `/de`
- Routing configuration for next-intl

## Expected Folder Structure on VPS

```
/var/www/admasits/
└── admas-consulting/           # App root
    ├── package.json           # ✅ REQUIRED
    ├── next.config.mjs        # ✅ REQUIRED
    ├── tsconfig.json          # ✅ REQUIRED
    ├── app/                   # ✅ REQUIRED (Next.js App Router)
    ├── components/            # ✅ REQUIRED
    ├── public/                # ✅ REQUIRED
    ├── messages/              # ✅ REQUIRED (i18n)
    ├── lib/                   # ✅ REQUIRED
    ├── node_modules/          # ✅ Generated (run npm install)
    └── .next/                 # ✅ Generated (run npm run build)
```

## Verification Commands

```bash
cd /var/www/admasits/admas-consulting

# Check all required files exist
test -f package.json && echo "✅ package.json" || echo "❌ Missing package.json"
test -f next.config.mjs && echo "✅ next.config.mjs" || echo "❌ Missing next.config.mjs"
test -f tsconfig.json && echo "✅ tsconfig.json" || echo "❌ Missing tsconfig.json"
test -d app && echo "✅ app/ directory" || echo "❌ Missing app/ directory"
test -d components && echo "✅ components/ directory" || echo "❌ Missing components/ directory"
test -d public && echo "✅ public/ directory" || echo "❌ Missing public/ directory"
test -d messages && echo "✅ messages/ directory" || echo "❌ Missing messages/ directory"

# Check if build output exists
test -d .next && echo "✅ Built (/.next exists)" || echo "⚠️  Not built yet (run: npm run build)"
```

