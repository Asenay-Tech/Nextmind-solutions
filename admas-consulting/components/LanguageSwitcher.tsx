"use client"

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Flag SVG Components
const FlagIcon = ({ country, className }: { country: 'gb' | 'de'; className?: string }) => {
  const flags = {
    gb: (
      <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="gb">
            <path fillOpacity="0.7" d="M-85.3 0h682.6v512h-682.6z"/>
          </clipPath>
        </defs>
        <g clipPath="url(#gb)" transform="translate(80) scale(.94)">
          <g strokeWidth="1pt">
            <path fill="#006" d="M-256 0H768v512H-256z"/>
            <path fill="#fff" d="M-256 0v57.2L653.5 512H768v-57.2L-141.5 0H-256zM768 0v57.2L-141.5 512H-256v-57.2L653.5 0H768z"/>
            <path fill="#fff" d="M170.7 0v512h170.6v-512H170.7zM-256 170.7v170.6H768V170.7H-256z"/>
            <path fill="#c00" d="M-256 204.8v102.4H768V204.8H-256zM170.7 0v512h102.4v-512H170.7zM-256 512L85.3 341.3h76.8L-179.2 512H-256zM-256 0L85.3 170.7H8.5L-256 38.4V0zm593.9 170.7L691.7 0H768L426.7 170.7h-76.8zM768 341.3L426.7 512h76.8L768 473.6v-132.3z"/>
          </g>
        </g>
      </svg>
    ),
    de: (
      <svg viewBox="0 0 640 480" className={className} xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffce00" d="M0 320h640v160H0z"/>
        <path fill="#000" d="M0 0h640v160H0z"/>
        <path fill="#d00" d="M0 160h640v160H0z"/>
      </svg>
    ),
  }
  return flags[country]
}

const languages = [
  { code: 'en', name: 'English', flag: 'gb' as const },
  { code: 'de', name: 'Deutsch', flag: 'de' as const },
] as const

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg",
          "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20",
          "text-white text-xs sm:text-sm font-medium transition-all",
          "focus:outline-none focus:ring-2 focus:ring-admas-purple-light focus:ring-offset-2 focus:ring-offset-admas-dark"
        )}
        aria-label="Switch language"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-4 h-3 sm:w-5 sm:h-3.5 flex-shrink-0 overflow-hidden rounded-sm shadow-sm">
            <FlagIcon country={currentLanguage.flag} className="w-full h-full object-cover" />
          </div>
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </div>
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
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                    locale === lang.code
                      ? "bg-white/10 text-white font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="w-5 h-4 flex-shrink-0 overflow-hidden rounded-sm shadow-sm">
                    <FlagIcon country={lang.flag} className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1">{lang.name}</span>
                  {locale === lang.code && (
                    <span className="ml-auto text-admas-purple-light text-base">✓</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
