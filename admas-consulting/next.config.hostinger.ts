import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/**
 * Hostinger Static Export Configuration
 * 
 * This configuration enables static export for Hostinger shared hosting.
 * Use this config when deploying to Hostinger.
 * 
 * To use: Rename this file to next.config.ts or merge settings into existing config
 */
const nextConfig: NextConfig = {
  // Enable static export for Hostinger shared hosting
  output: 'export',
  
  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },
  
  // Compression (handled by Hostinger server)
  compress: true,
  
  // Production optimizations
  swcMinify: true,
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@headlessui/react'],
    optimizeCss: true,
  },
  
  // Trailing slash for better compatibility
  trailingSlash: false,
  
  // Base path (keep as '/' for root domain)
  basePath: '/',
  assetPrefix: '/',
};

export default withNextIntl(nextConfig);

