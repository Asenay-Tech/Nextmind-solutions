"use client"

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTransition, useEffect, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import FlagIcon from './FlagIcon'

const languages = [
  { code: 'en' as const, flagCountry: 'gb' as const, label: 'EN' },
  { code: 'de' as const, flagCountry: 'de' as const, label: 'DE' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Mark component as mounted (client-side only) - for deferring interactivity only
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved locale from localStorage on mount (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const savedLocale = localStorage.getItem('preferred-locale')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'de')) {
      if (savedLocale !== locale) {
        console.log(`[LanguageSwitcher] Found saved locale: ${savedLocale}, current: ${locale}`)
        startTransition(() => {
          router.replace(pathname, { locale: savedLocale })
        })
      }
    }
  }, [mounted, locale, pathname, router])

  // Ensure we always have a valid locale (avoid hydration mismatch)
  // This must be the same on server and client
  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const handleLanguageChange = (newLocale: 'en' | 'de') => {
    if (newLocale === locale) {
      setIsOpen(false)
      return
    }

    console.log(`[LanguageSwitcher] Switching locale from ${locale} to ${newLocale}`)

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale)
    }

    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen || !mounted) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-language-switcher]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, mounted])

  // Handler that defers interactivity until mounted, but doesn't change HTML
  const handleButtonClick = () => {
    if (mounted) {
      setIsOpen((prev) => !prev)
    }
  }

  // CRITICAL: All HTML attributes must be identical on server and client
  // Only use `mounted` to defer functionality, never to change rendered HTML
  return (
    <div className="relative" data-language-switcher>
      <button
        onClick={handleButtonClick}
        disabled={pending}
        className={cn(
          "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/20 hover:border-white/30",
          pending && "opacity-50 cursor-not-allowed"
        )}
        aria-label={`Current language: ${currentLanguage.label}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FlagIcon country={currentLanguage.flagCountry} className="w-5 h-4" />
        <span className="font-medium">{currentLanguage.label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-40 rounded-xl bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((lang) => {
                const isSelected = lang.code === locale
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors",
                      isSelected && "bg-white/10 text-white"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <FlagIcon country={lang.flagCountry} className="w-5 h-4" />
                      <span className="font-medium">{lang.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-admas-purple-light flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
