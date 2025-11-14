"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"

import { Button } from "./ui/button"
import DemoBookingModal from "./DemoBookingModal"

const MotionButton = motion(Button)

const floatingNodes = [
  { size: "w-20 h-20", style: { top: "12%", left: "10%" } },
  { size: "w-16 h-16", style: { top: "18%", right: "12%" } },
  { size: "w-14 h-14", style: { bottom: "18%", left: "18%" } },
  { size: "w-24 h-24", style: { bottom: "22%", right: "20%" } },
]

const typingPhrases = {
  en: [
    "AI-Powered Business Solutions",
    "Autonomous Intelligence for Teams",
    "Adaptive Workflows at Scale",
  ],
  de: [
    "KI-gestützte Geschäftslösungen",
    "Autonome Intelligenz für Teams",
    "Adaptive Workflows im großen Maßstab",
  ],
}

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale() as 'en' | 'de'
  const heroRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const hueRotate = useTransform(scrollYProgress, [0, 1], ["0deg", "35deg"])

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const currentPhrase = useMemo(() => typingPhrases[locale][phraseIndex], [phraseIndex, locale])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && charIndex <= currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex))
        setCharIndex((prev) => prev + 1)
      }, 90)
    } else if (!isDeleting && charIndex > currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1400)
    } else if (isDeleting && charIndex >= 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, charIndex))
        setCharIndex((prev) => prev - 1)
      }, 55)
    } else if (isDeleting && charIndex < 0) {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % typingPhrases[locale].length)
      setCharIndex(0)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, currentPhrase, isDeleting, locale])

  return (
    <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden pt-14 sm:pt-16 md:pt-20">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(96,165,250,0.18), transparent 55%), radial-gradient(circle at 85% 25%, rgba(138,99,241,0.35), transparent 60%), radial-gradient(circle at 50% 85%, rgba(56,189,248,0.25), transparent 55%)",
          filter: hueRotate,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ["0% 0%", "22% 8%", "0% 0%"],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(96,165,250,0.08) 0%, rgba(138,99,241,0.18) 35%, transparent 70%), linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
          backgroundSize: "cover, 60px 60px, 60px 60px",
        }}
      />

      {floatingNodes.map((node, index) => (
        <motion.span
          key={index}
          className={`floating-node absolute ${node.size} rounded-full bg-gradient-to-br from-admas-purple-light/30 via-admas-blue/20 to-admas-cyan/25 blur-2xl`}
          style={node.style as any}
          animate={{
            y: [-6, 6, -6],
            x: [0, 6, 0],
          }}
          transition={{
            duration: 10 + index * 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group mb-4 sm:mb-6 inline-flex items-center space-x-2 rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-admas-cyan transition-transform duration-500 group-hover:rotate-12 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-200">
              <span className="gradient-text">{displayText}</span>
              <span className="ml-1 inline-block h-3 sm:h-4 w-[2px] animate-pulse rounded bg-white/80 align-middle" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="mb-4 sm:mb-6 px-2 text-[clamp(2rem,8vw,4.5rem)] font-heading font-bold leading-[1.1] sm:leading-tight text-white whitespace-normal break-words"
          >
            {t('titlePart1')} <span className="gradient-text">{t('titlePart2')}</span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {t('titlePart3')} <span className="gradient-text">{t('titlePart4')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            className="mx-auto mb-8 sm:mb-10 max-w-3xl px-2 text-[clamp(1rem,2.5vw,1.35rem)] leading-relaxed text-gray-300 whitespace-normal break-words"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.35 }}
            className="mb-12 sm:mb-16 flex flex-col items-center justify-center gap-3 sm:gap-4 px-2 sm:flex-row"
          >
            <a href="#services" className="w-full sm:w-auto">
              <MotionButton
                size="lg"
                className="btn-gradient group relative overflow-hidden w-full sm:w-auto px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg whitespace-nowrap"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t('exploreSolutions')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
                <motion.span
                  className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15),_transparent_60%)] opacity-0"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </MotionButton>
            </a>
            <MotionButton
              size="lg"
              variant="outline"
              className="relative overflow-hidden w-full sm:w-auto border border-white/25 bg-white/10 px-6 sm:px-8 md:px-9 py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg text-white shadow-[0_10px_40px_rgba(12,9,34,0.55)] backdrop-blur-xl transition-all whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDemoModalOpen(true)}
            >
              <span className="relative z-10">{t('bookDemo')}</span>
              <motion.span
                className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ opacity: 0, x: "-120%" }}
                whileHover={{ opacity: 1, x: "120%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </MotionButton>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full" aria-hidden="true">
          <path
            d="M0 140L60 122C120 104 240 68 360 58C480 48 600 64 720 82C840 100 960 122 1080 122C1200 122 1320 100 1380 88L1440 76V140H1380C1320 140 1200 140 1080 140C960 140 840 140 720 140C600 140 480 140 360 140C240 140 120 140 60 140H0Z"
            fill="url(#waveGradient)"
            fillOpacity="0.9"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#09091f" />
              <stop offset="0.5" stopColor="#140a2f" />
              <stop offset="1" stopColor="#070720" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <DemoBookingModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </section>
  )
}