"use client"

import { useEffect, useState } from "react"
import { Link } from "@/i18n/routing"
import { usePathname } from "@/i18n/routing"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"

export default function Footer() {
  const t = useTranslations("footer")
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const [showToast, setShowToast] = useState(false)

  const footerLinks = {
    solutions: [
      { label: t("solutions.aiAgents"), href: "/#services", anchor: "service-ai-agents" },
      { label: t("solutions.inventory"), href: "/#services", anchor: "service-inventory-logistics" },
      { label: t("solutions.finance"), href: "/#services", anchor: "service-automated-billing-payroll" },
      { label: t("solutions.infrastructure"), href: "/#services", anchor: "service-it-infrastructure" },
    ],
    company: [
      { label: t("company.about"), href: "/about", anchor: undefined },
      { label: t("company.training"), href: "/business-management", anchor: undefined },
      { label: t("company.partners"), href: "/partners", anchor: undefined },
    ],
    resources: [
      { label: t("resources.blog"), href: "/blog", anchor: undefined },
      { label: t("resources.process"), href: "/#process", anchor: undefined },
      { label: t("resources.support"), href: "/support", anchor: undefined },
    ],
    legal: [
      { label: t("legal.privacy"), href: "/privacy", anchor: undefined },
      { label: t("legal.terms"), href: "/terms", anchor: undefined },
      { label: t("legal.cookies"), href: "/cookies", anchor: undefined },
      { label: t("legal.gdpr"), href: "/gdpr", anchor: undefined },
    ],
  }

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
    { icon: Youtube, label: "YouTube" },
  ] as const

  const scrollToService = (anchor: string) => {
    const element = document.getElementById(anchor)
    if (element) {
      // Calculate offset for fixed header (adjust if needed)
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleSolutionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    anchor?: string,
  ) => {
    // If anchor exists, handle smooth scroll
    if (anchor) {
      e.preventDefault()
      // If we're not on the home page, navigate first
      const currentPath = pathname || '/'
      if (currentPath !== "/") {
        window.location.href = `${href}#${anchor}`
        // Wait for navigation, then scroll
        setTimeout(() => {
          scrollToService(anchor)
        }, 300)
      } else {
        // Already on home page, just scroll
        scrollToService(anchor)
      }
    }
  }

  // Handle hash navigation on page load
  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.substring(1) // Remove #
      setTimeout(() => {
        scrollToService(hash)
      }, 100)
    }
  }, [pathname])

  const handleSocialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!showToast) {
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 2500)
    }
  }

  const handleSocialKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!showToast) {
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
        }, 2500)
      }
    }
  }

  return (
    <footer className="bg-admas-dark border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-4 group">
              <div className="relative h-8 sm:h-10 w-auto flex items-center flex-shrink-0">
                <Image
                  src="/assets/logo/logo.jpg"
                  alt="Admas Logo"
                  width={120}
                  height={40}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-admas-purple-light transition-colors">Admas</div>
                <div className="text-[10px] sm:text-xs text-gray-400">AI-Systems and Intelligent Management plc</div>
              </div>
            </Link>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed whitespace-normal break-words">
              {t("description")}
            </p>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-admas-purple-light flex-shrink-0" />
                <a
                  href="mailto:contact@admasits.com"
                  className="hover:text-white transition-colors break-all"
                >
                  contact@admasits.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-admas-purple-light flex-shrink-0" />
                <a href="tel:+4917657725997" className="hover:text-white transition-colors">
                  +49 176 57725997
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-admas-purple-light flex-shrink-0" />
                <span className="break-words">Frankfurt, Germany.</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base whitespace-nowrap">{t("solutions.title")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.anchor ? `${link.href}#${link.anchor}` : link.href}
                    onClick={(e) => handleSolutionClick(e, link.href, link.anchor)}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base whitespace-nowrap">{t("company.title")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-words"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base whitespace-nowrap">{t("resources.title")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-words"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base whitespace-nowrap">{t("legal.title")}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-4 sm:py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left whitespace-normal break-words">
              {t("copyright", { year: currentYear })}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <button
                    key={social.label}
                    onClick={handleSocialClick}
                    onKeyDown={handleSocialKeyDown}
                    aria-label={social.label}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-admas-purple-light focus:ring-offset-2 focus:ring-offset-admas-dark"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <p className="text-white text-sm font-medium">{t("social.comingSoon")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

