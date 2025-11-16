import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

/**
 * Safely load messages for a locale with fallback to English
 */
async function loadMessages(locale: string): Promise<Record<string, any>> {
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
  const messagesFilePath = `./messages/${validLocale}.json`
  
  try {
    // Use dynamic import with explicit path
    const messagesModule = await import(messagesFilePath)
    const messages = messagesModule.default
    
    // Validate messages structure
    if (!messages || typeof messages !== 'object' || Array.isArray(messages)) {
      throw new Error(
        `[i18n] Invalid messages structure for locale "${validLocale}": expected object, got ${typeof messages}${Array.isArray(messages) ? ' (array)' : ''}`
      )
    }
    
    console.log(`[i18n] ✓ Successfully loaded messages for locale: "${validLocale}"`)
    return messages
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Detailed error logging
    if (errorMessage.includes('Cannot find module') || errorMessage.includes('ENOENT')) {
      console.error(`[i18n] ✗ Messages file not found: "${messagesFilePath}" for locale "${locale}"`)
      console.error(`  Error: ${errorMessage}`)
    } else if (errorMessage.includes('JSON') || errorMessage.includes('parse') || errorMessage.includes('Unexpected')) {
      console.error(`[i18n] ✗ JSON parsing error in "${messagesFilePath}" for locale "${locale}":`)
      console.error(`  Error: ${errorMessage}`)
      if (errorStack) {
        const stackLines = errorStack.split('\n').slice(0, 5)
        console.error(`  Stack: ${stackLines.join('\n    ')}`)
      }
    } else {
      console.error(`[i18n] ✗ Error loading messages from "${messagesFilePath}" for locale "${locale}":`)
      console.error(`  Error: ${errorMessage}`)
      if (errorStack) {
        const stackLines = errorStack.split('\n').slice(0, 5)
        console.error(`  Stack: ${stackLines.join('\n    ')}`)
      }
    }
    
    // Fallback to English if not already trying English
    if (validLocale !== defaultLocale) {
      console.warn(`[i18n] ⚠ fallback to en for locale: "${locale}"`)
      try {
        return await loadMessages(defaultLocale)
      } catch (fallbackError) {
        console.error(`[i18n] ✗ Failed to load English fallback messages:`, fallbackError)
        throw fallbackError
      }
    }
    
    throw error
  }
}

export default getRequestConfig(async ({ locale }) => {
  // Log incoming locale for debugging
  console.log(`[i18n] getRequestConfig called with locale:`, locale, typeof locale)
  
  // Handle undefined or invalid locale gracefully - use default instead of crashing
  if (!locale || typeof locale !== 'string') {
    console.warn(`[i18n] ⚠ Invalid locale parameter: ${locale} (type: ${typeof locale}), falling back to default: "${defaultLocale}"`)
    locale = defaultLocale
  }
  
  // Validate locale is in allowed list
  if (!locales.includes(locale as Locale)) {
    console.warn(`[i18n] ⚠ Invalid locale "${locale}", using default: "${defaultLocale}"`)
    locale = defaultLocale
  }
  
  try {
    console.log(`[i18n] loading messages for ${locale}`)
    const messages = await loadMessages(locale)
    
    console.log(`[i18n] ✓ Successfully configured for locale: "${locale}"`)
    return {
      locale: locale as string,
      messages
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[i18n] ✗ Critical: Cannot load any messages for locale "${locale}"`)
    console.error(`[i18n] ✗ Error details:`, errorMessage)
    
    // Try to fallback to English one more time
    if (locale !== defaultLocale) {
      console.warn(`[i18n] ⚠ Attempting final fallback to English...`)
      try {
        const fallbackMessages = await loadMessages(defaultLocale)
        console.log(`[i18n] ✓ Final fallback to English succeeded`)
        return {
          locale: defaultLocale,
          messages: fallbackMessages
        }
      } catch (fallbackError) {
        console.error(`[i18n] ✗ Final fallback to English also failed:`, fallbackError)
        // Return empty messages instead of crashing
        console.warn(`[i18n] ⚠ Returning empty messages to prevent crash`)
        return {
          locale: defaultLocale,
          messages: {}
        }
      }
    }
    
    // Last resort: return empty messages instead of crashing
    console.warn(`[i18n] ⚠ Returning empty messages for locale "${locale}" to prevent crash`)
    return {
      locale: locale as string,
      messages: {}
    }
  }
})

