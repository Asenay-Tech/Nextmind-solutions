/**
 * Safe message loader with fallback handling
 * Always returns an object (never throws)
 */
export async function getMessagesSafe(locale: string): Promise<Record<string, any>> {
  console.log(`[i18n-helpers] getMessagesSafe called with locale: "${locale}" (type: ${typeof locale})`)
  
  // Validate and normalize locale
  if (!locale || typeof locale !== 'string') {
    console.warn(`[i18n-helpers] ⚠ Invalid locale input: ${locale}, using "en"`)
    locale = 'en'
  }
  
  const validLocale = ['en', 'de'].includes(locale) ? locale : 'en'
  const messagesPath = `../messages/${validLocale}.json`
  
  console.log(`[i18n-helpers] Attempting to load messages from: ${messagesPath}`)
  
  try {
    const messagesModule = await import(messagesPath)
    const messages = messagesModule.default
    
    if (!messages) {
      throw new Error(`Messages module default is null or undefined`)
    }
    
    if (typeof messages !== 'object') {
      throw new Error(`Invalid format: expected object, got ${typeof messages}`)
    }
    
    if (Array.isArray(messages)) {
      throw new Error(`Invalid format: expected object, got array`)
    }
    
    console.log(`[i18n-helpers] ✓ Successfully loaded messages for locale: "${validLocale}" (${Object.keys(messages).length} root keys)`)
    return messages
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error(`[i18n-helpers] ✗ Failed to load messages from "${messagesPath}"`)
    console.error(`[i18n-helpers] ✗ Error type: ${error instanceof Error ? error.constructor.name : typeof error}`)
    console.error(`[i18n-helpers] ✗ Error message: ${errorMessage}`)
    if (errorStack) {
      const stackLines = errorStack.split('\n').slice(0, 3)
      console.error(`[i18n-helpers] ✗ Error stack: ${stackLines.join(' | ')}`)
    }
    
    // If not English, try English fallback
    if (validLocale !== 'en') {
      console.warn(`[i18n-helpers] ⚠ Falling back to English messages for locale: "${locale}"`)
      const fallbackPath = `../messages/en.json`
      console.log(`[i18n-helpers] Attempting fallback load from: ${fallbackPath}`)
      
      try {
        const fallbackModule = await import(fallbackPath)
        const fallbackMessages = fallbackModule.default
        
        if (fallbackMessages && typeof fallbackMessages === 'object' && !Array.isArray(fallbackMessages)) {
          console.log(`[i18n-helpers] ✓ Successfully loaded fallback English messages (${Object.keys(fallbackMessages).length} root keys)`)
          return fallbackMessages
        } else {
          throw new Error(`Fallback messages invalid format: ${typeof fallbackMessages}`)
        }
      } catch (fallbackError) {
        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        console.error(`[i18n-helpers] ✗ Fallback to English also failed: ${fallbackErrorMessage}`)
      }
    }
    
    // Last resort: return empty object
    console.warn(`[i18n-helpers] ⚠ Returning empty messages object for locale: "${locale}"`)
    return {}
  }
}

