import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { getMessagesSafe } from '@/lib/i18n-helpers'
import { locales } from '@/i18n'
import '../globals.css'

// Optimized font loading with only required weights and subsets
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  console.log(`[metadata] generateMetadata called`)
  
  let locale = 'en'
  let messages: Record<string, any> = {}
  
  try {
    console.log(`[metadata] Attempting to resolve params promise...`)
    const resolvedParams = await params
    console.log(`[metadata] Params resolved:`, resolvedParams)
    
    locale = resolvedParams?.locale || 'en'
    console.log(`[metadata] Extracted locale: "${locale}"`)
    
    if (!locale || typeof locale !== 'string') {
      console.warn(`[metadata] ⚠ Locale is invalid: ${locale} (type: ${typeof locale}), using "en"`)
      locale = 'en'
    }
    
    if (!['en', 'de'].includes(locale)) {
      console.warn(`[metadata] ⚠ Invalid locale "${locale}", using "en"`)
      locale = 'en'
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    const errorStack = err instanceof Error ? err.stack : undefined
    console.error('[metadata] ✗ Error resolving params:', errorMessage)
    if (errorStack) {
      console.error('[metadata] ✗ Error stack:', errorStack.split('\n').slice(0, 3).join(' | '))
    }
    locale = 'en'
  }
  
  try {
    console.log(`[metadata] Loading messages for locale: "${locale}"`)
    messages = await getMessagesSafe(locale)
    console.log(`[metadata] Messages loaded (${Object.keys(messages).length} root keys)`)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[metadata] ✗ Error loading messages for metadata:', errorMessage)
    messages = {}
  }
  
  const siteName = messages?.meta?.siteName || 'Admas'
  const description = messages?.meta?.description || 'Admas delivers AI-driven systems and intelligent ideas for enterprises seeking intelligent automation and transformation.'
  const titleTemplate = messages?.meta?.titleTemplate || '%s | Admas'
  
  console.log(`[metadata] ✓ Generated metadata for locale: "${locale}"`)
  
  try {
    return {
      metadataBase: new URL('https://admasits.com'),
      title: {
        default: siteName,
        template: titleTemplate,
      },
      description,
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
      },
    }
  } catch (err) {
    console.error('[metadata] ✗ Failed to generate metadata object:', err)
    // Return minimal valid metadata
    return {
      title: 'Admas',
      description: 'Admas delivers AI-driven systems and intelligent ideas for enterprises seeking intelligent automation and transformation.',
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
      },
    }
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  console.log(`[layout] LocaleLayout function called`)
  
  // Wrap entire function in top-level try/catch to catch ANY error
  try {
    // Initialize with safe defaults - never crash
    let locale = 'en'
    let messages: Record<string, any> = {}
    let validLocale = 'en'
    
    try {
      console.log(`[layout] Attempting to resolve params promise...`)
      // Resolve params promise
      const resolvedParams = await params
      console.log(`[layout] Params resolved:`, resolvedParams)
      
      locale = resolvedParams?.locale || 'en'
      console.log(`[layout] Extracted locale: "${locale}" (type: ${typeof locale})`)
      
      // Validate locale
      if (!locale || typeof locale !== 'string') {
        console.warn(`[layout] ⚠ Locale is invalid: ${locale} (type: ${typeof locale}), using "en"`)
        locale = 'en'
      }
      
      if (!['en', 'de'].includes(locale)) {
        console.warn(`[layout] ⚠ Invalid locale "${locale}", using "en"`)
        locale = 'en'
      }
      
      validLocale = locale
      console.log(`[layout] Valid locale set to: "${validLocale}"`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      const errorStack = err instanceof Error ? err.stack : undefined
      console.error('[layout] ✗ Error resolving params:', errorMessage)
      if (errorStack) {
        console.error('[layout] ✗ Error stack:', errorStack.split('\n').slice(0, 3).join(' | '))
      }
      locale = 'en'
      validLocale = 'en'
    }

    try {
      console.log(`[layout] Loading messages for locale: "${locale}"`)
      // Load messages - this never throws (returns {} on error)
      messages = await getMessagesSafe(locale)
      
      // Validate messages object - ensure it's not null/undefined
      if (!messages || typeof messages !== 'object') {
        console.warn(`[layout] ⚠ Messages is invalid, using empty object`)
        messages = {}
      }
      
      console.log(`[layout] Messages loaded (${Object.keys(messages).length} root keys)`)
      console.log(`[layout] Messages object type: ${typeof messages}, isArray: ${Array.isArray(messages)}`)
    } catch (err) {
      // This should never happen (getMessagesSafe never throws), but just in case
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.warn(`[layout] ⚠ Failed to load messages for locale "${locale}" – using empty object:`, errorMessage)
      messages = {}
    }
    
    // Ensure messages is always a valid object for NextIntlClientProvider
    if (!messages || typeof messages !== 'object' || Array.isArray(messages)) {
      console.warn(`[layout] ⚠ Messages validation failed, resetting to empty object`)
      messages = {}
    }

    // Always render valid HTML with lang attribute
    // Never crash, always return valid JSX
    console.log(`[layout] rendering layout with final locale: "${validLocale}"`)
    
    try {
      return (
        <html lang={validLocale} suppressHydrationWarning>
          <body className={`${inter.variable} ${spaceGrotesk.variable} smooth-scroll antialiased`}>
            <NextIntlClientProvider locale={validLocale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      )
    } catch (err) {
      // Last resort: render minimal HTML if JSX fails
      const errorMessage = err instanceof Error ? err.message : String(err)
      const errorStack = err instanceof Error ? err.stack : undefined
      console.error('[layout] ✗ Error rendering JSX, using minimal fallback:', errorMessage)
      if (errorStack) {
        console.error('[layout] ✗ JSX error stack:', errorStack.split('\n').slice(0, 3).join(' | '))
      }
      return (
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.variable} ${spaceGrotesk.variable} smooth-scroll antialiased`}>
            <NextIntlClientProvider locale="en" messages={{}}>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      )
    }
  } catch (error) {
    // Top-level catch for ANY unhandled error
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('[layout] ✗ Fatal error in LocaleLayout:', errorMessage)
    if (errorStack) {
      console.error('[layout] ✗ Fatal error stack:', errorStack.split('\n').slice(0, 10).join('\n'))
    }
    
    // Return absolutely minimal HTML to prevent blank screen
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Admas</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <NextIntlClientProvider locale="en" messages={{}}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    )
  }
}

