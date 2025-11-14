# Nextmind Solutions

Enterprise-grade Next.js application for AdmasITS - AI-Driven Systems & Intelligent Ideas.

## 🚀 Features

- ✅ **Next.js 16** with App Router
- ✅ **Internationalization (i18n)** - English & German support
- ✅ **Server-Side Rendering (SSR)**
- ✅ **Image Optimization** - WebP/AVIF support
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Performance Optimized** - Lighthouse score 90+
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Utility-first styling

## 📦 Tech Stack

- **Framework:** Next.js 16.0.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **UI Components:** Headless UI

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see your application.

## 📁 Project Structure

```
admas-consulting/
├── app/                    # Next.js App Router pages
│   ├── [locale]/          # Internationalized routes
│   ├── about/             # About page
│   ├── business-management/ # Business training
│   └── ...
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ...
├── lib/                    # Utilities and data
├── messages/              # i18n translation files
│   ├── en.json
│   └── de.json
├── public/                # Static assets
└── ...
```

## 🌍 Internationalization

The application supports multiple languages:
- English (`/en`)
- German (`/de`)

Language switcher is available in the header.

## 🚀 Deployment

### VPS Deployment (Hostinger)

See `VPS_DEPLOYMENT_GUIDE.md` for complete instructions.

Quick steps:
1. Build: `npm run build`
2. Deploy to VPS with PM2
3. Configure Nginx reverse proxy
4. Setup SSL with Let's Encrypt

## 📊 Performance

- **Lighthouse Score:** 90+
- **Core Web Vitals:** All metrics in "Good" range
- **Image Optimization:** WebP/AVIF formats
- **Code Splitting:** Dynamic imports enabled

## 📝 Documentation

- `VPS_DEPLOYMENT_GUIDE.md` - VPS deployment instructions
- `PERFORMANCE_REPORT.md` - Performance optimizations
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with descriptive messages
4. Push to your branch
5. Create a Pull Request

## 📄 License

Private - All rights reserved

## 🔗 Links

- **Website:** https://admasits.com
- **Documentation:** See `/docs` folder

---

Built with ❤️ by AdmasITS Team

