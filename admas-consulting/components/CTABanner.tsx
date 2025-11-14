"use client"

import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "./ui/button"

export default function CTABanner() {
  const t = useTranslations('cta')
  
  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-admas-purple-light via-admas-blue to-admas-cyan opacity-90" />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-14 md:py-16 lg:py-20 text-center">
            <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-heading font-bold text-white mb-4 sm:mb-5 md:mb-6 px-2 whitespace-normal break-words">
              {t('title')}
            </h2>
            <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-white/90 mb-8 sm:mb-9 md:mb-10 max-w-2xl mx-auto px-2 leading-relaxed whitespace-normal break-words">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-admas-purple font-bold w-full sm:w-auto px-6 sm:px-7 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg hover:bg-gray-100 group whitespace-nowrap"
                >
                  {t('getStartedToday')}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto px-6 sm:px-7 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg backdrop-blur-sm whitespace-nowrap"
                >
                  <Calendar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {t('bookDemo')}
                </Button>
              </Link>
            </div>

            <div className="mt-8 sm:mt-9 md:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center whitespace-nowrap">
                <span className="font-bold text-lg sm:text-xl md:text-2xl mr-1.5 sm:mr-2">24/7</span>
                <span className="break-words">{t('expertSupport')}</span>
              </div>
              <div className="flex items-center whitespace-nowrap">
                <span className="font-bold text-lg sm:text-xl md:text-2xl mr-1.5 sm:mr-2">100%</span>
                <span className="break-words">{t('customSolutions')}</span>
              </div>
              <div className="flex items-center whitespace-nowrap">
                <span className="font-bold text-lg sm:text-xl md:text-2xl mr-1.5 sm:mr-2">{t('globalReach')}</span>
                <span className="break-words">{t('reachScale')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

