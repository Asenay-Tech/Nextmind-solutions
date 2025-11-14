"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Header() {
  const t = useTranslations('nav')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null)
  const companyRef = useRef<HTMLDivElement>(null)
  const resourcesRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/#services", label: t('solutions') },
    { href: "/business-management", label: t('businessTraining') },
  ]

  const companyLinks = [
    { href: "/about", label: t('aboutUs') },
    { href: "/careers", label: t('partners') },
  ]

  const resourcesLinks = [
    { href: "/support", label: t('support') },
    { href: "/#process", label: t('ourProcess') },
    { href: "/blog", label: t('blogComingSoon') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle dropdown click toggle for desktop
  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node) &&
        resourcesRef.current &&
        !resourcesRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  const toggleMobileDropdown = (dropdown: string) => {
    setMobileExpandedDropdown(
      mobileExpandedDropdown === dropdown ? null : dropdown
    )
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-admas-dark/80 backdrop-blur-lg shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0 flex-shrink-0">
            <div className="relative h-8 sm:h-10 w-auto flex items-center flex-shrink-0">
              <Image
                src="/assets/logo/logo.jpg"
                alt="AdmasITS Logo"
                width={120}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain"
                priority
                quality={90}
                sizes="(max-width: 640px) 80px, 120px"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-admas-purple-light transition-colors truncate">
                AdmasITS
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 hidden md:block">
                AI-Driven Systems &amp; Intelligent Ideas
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            {/* Company Dropdown */}
            <div ref={companyRef} className="relative">
              <button
                onClick={() => handleDropdownClick("company")}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap"
              >
                <span>{t('company')}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    activeDropdown === "company" && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "company" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {companyLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resources Dropdown */}
            <div ref={resourcesRef} className="relative">
              <button
                onClick={() => handleDropdownClick("resources")}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors font-medium whitespace-nowrap"
              >
                <span>{t('resources')}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    activeDropdown === "resources" && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {resourcesLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
            <LanguageSwitcher />
            <Link href="/login">
              <Button 
                variant="outline" 
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all text-sm px-3 xl:px-4 whitespace-nowrap"
              >
                {t('login')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-gradient text-sm px-4 xl:px-6 whitespace-nowrap">{t('getStarted')}</Button>
            </Link>
          </div>

          <button
            className="lg:hidden text-white p-2 -mr-1 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-white/10"
            >
              <div className="flex flex-col space-y-1 py-3 sm:py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors font-medium px-3 sm:px-4 py-2.5 text-sm sm:text-base"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Company Dropdown */}
              <div className="border-t border-white/10 mt-1">
                <button
                  onClick={() => toggleMobileDropdown("company")}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-white transition-colors font-medium px-4 py-2.5"
                >
                  <span>{t('company')}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      mobileExpandedDropdown === "company" && "rotate-180"
                    )}
                  />
                </button>
                {mobileExpandedDropdown === "company" && (
                  <div className="pl-6 py-2 space-y-1">
                    {companyLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Resources Dropdown */}
              <div className="border-t border-white/10">
                <button
                  onClick={() => toggleMobileDropdown("resources")}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-white transition-colors font-medium px-4 py-2.5"
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      mobileExpandedDropdown === "resources" && "rotate-180"
                    )}
                  />
                </button>
                {mobileExpandedDropdown === "resources" && (
                  <div className="pl-6 py-2 space-y-1">
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-3 sm:px-4 pt-4 space-y-2 border-t border-white/10 mt-2">
                <div className="flex justify-center mb-2">
                  <LanguageSwitcher />
                </div>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all text-sm sm:text-base"
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="btn-gradient w-full text-sm sm:text-base">{t('getStarted')}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
