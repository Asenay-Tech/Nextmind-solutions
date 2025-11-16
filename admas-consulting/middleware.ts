import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Log incoming request for debugging
  const pathname = request.nextUrl.pathname
  console.log(`[middleware] Processing request: ${pathname}`)
  
  // Extract locale from pathname (e.g., /de/about -> 'de')
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/)
  const extractedLocale = localeMatch ? localeMatch[1] : null
  
  if (extractedLocale) {
    console.log(`[middleware] Extracted locale from pathname: "${extractedLocale}"`)
  } else {
    console.log(`[middleware] No locale found in pathname, will use defaultLocale`)
  }
  
  // Call next-intl middleware (it handles locale extraction and routing)
  try {
    const response = intlMiddleware(request)
    
    // Log response status if available (response might be a Promise)
    if (response && typeof response === 'object' && 'status' in response) {
      console.log(`[middleware] Response status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[middleware] ✗ Error in middleware:`, errorMessage)
    // Let next-intl handle the error, just pass through
    return intlMiddleware(request)
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

