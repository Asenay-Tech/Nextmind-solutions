import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n'
import "../globals.css"
import ScrollIndicator from "@/components/ScrollIndicator"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Optimized font loading with only required weights and subsets
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const siteDescription = {
  en: "AdmasITS delivers AI-driven systems and intelligent ideas for enterprises seeking intelligent automation and transformation.",
  de: "AdmasITS liefert KI-gestützte Systeme und intelligente Ideen für Unternehmen, die intelligente Automatisierung und Transformation suchen."
}

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Metadata {
  return {
    metadataBase: new URL("https://admasits.com"),
    title: {
      default: "AdmasITS",
      template: "%s | AdmasITS",
    },
    description: siteDescription.en, // Will be localized per page
    openGraph: {
      title: "AdmasITS",
      siteName: "AdmasITS",
      description: siteDescription.en,
      url: "https://admasits.com",
    },
    twitter: {
      card: "summary_large_image",
      title: "AdmasITS",
      description: siteDescription.en,
    },
    alternates: {
      languages: {
        'en': 'https://admasits.com/en',
        'de': 'https://admasits.com/de',
        'x-default': 'https://admasits.com/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  // getMessages() automatically uses the locale from the request context
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* SEO and i18n */}
        <link rel="alternate" hrefLang="en" href="https://admasits.com/en" />
        <link rel="alternate" hrefLang="de" href="https://admasits.com/de" />
        <link rel="alternate" hrefLang="x-default" href="https://admasits.com/en" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} smooth-scroll antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ScrollIndicator />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
