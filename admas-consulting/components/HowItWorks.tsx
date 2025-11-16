"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  BarChart3,
  Code,
  Infinity,
  Lightbulb,
  Rocket,
  Search,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

export default function HowItWorks() {
  const t = useTranslations("howItWorks")
  const steps = [
    {
      number: "01",
      icon: Search,
      title: t("steps.1.title"),
      description: t("steps.1.description"),
      gradient: "from-admas-purple-light via-admas-blue to-admas-cyan",
      iconAnimation: {
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      },
    },
    {
      number: "02",
      icon: BarChart3,
      title: t("steps.2.title"),
      description: t("steps.2.description"),
      gradient: "from-admas-blue via-admas-cyan to-admas-purple-light",
      iconAnimation: {
        y: [0, -8, 0],
        scale: [1, 1.05, 1],
      },
    },
    {
      number: "03",
      icon: Lightbulb,
      title: t("steps.3.title"),
      description: t("steps.3.description"),
      gradient: "from-admas-cyan via-admas-purple-light to-admas-blue",
      iconAnimation: {
        scale: [1, 1.15, 1],
      },
      hasPulse: true,
    },
    {
      number: "04",
      icon: Code,
      title: t("steps.4.title"),
      description: t("steps.4.description"),
      gradient: "from-admas-purple-light via-admas-blue to-admas-cyan",
      iconAnimation: {
        y: [0, -4, 0],
        scale: [1, 1.05, 1],
      },
    },
    {
      number: "05",
      icon: Rocket,
      title: t("steps.5.title"),
      description: t("steps.5.description"),
      gradient: "from-admas-blue via-admas-cyan to-admas-purple-light",
      iconAnimation: {
        y: [0, -12, 0],
        rotate: [-5, 5, -5, 0],
      },
    },
    {
      number: "06",
      icon: Infinity,
      title: t("steps.6.title"),
      description: t("steps.6.description"),
      gradient: "from-admas-cyan via-admas-purple-light to-admas-blue",
      iconAnimation: {
        rotate: [0, 180, 360],
        scale: [1, 1.05, 1],
      },
    },
  ]
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Ensure section is visible when navigated to via hash
  useEffect(() => {
    if (window.location.hash === "#process" && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" })
        setIsVisible(true)
      }, 100)
    } else {
      // Check if section is already in viewport on mount
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 },
      )
      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }
      return () => observer.disconnect()
    }
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-admas-dark via-admas-purple-dark to-admas-dark py-12 sm:py-16 md:py-24 lg:py-32 min-h-screen"
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-admas-purple-light/10 via-admas-blue/10 to-admas-cyan/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,200,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(176,132,255,0.15),transparent_50%)]" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-12 md:mb-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3 sm:mb-4 px-2 text-[clamp(1.875rem,6vw,3.75rem)] font-heading font-bold text-white whitespace-normal break-words"
          >
            {t("title")}
          </motion.h2>
          {/* Glowing Gradient Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mb-4 sm:mb-5 md:mb-6 h-0.5 sm:h-1 w-16 sm:w-20 md:w-24 rounded-full bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan shadow-lg shadow-admas-purple-light/50"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-3xl px-2 text-[clamp(1rem,2.5vw,1.25rem)] text-gray-300 leading-relaxed whitespace-normal break-words"
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Animated Connecting Lines (Desktop Only) - Connect through icon centers */}
          {/* First Row Line */}
          <div className="hidden lg:block absolute top-[140px] left-0 right-0 h-0.5 pointer-events-none">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="h-full w-full bg-gradient-to-r from-admas-purple-light via-admas-blue via-admas-cyan to-admas-purple-light"
              style={{
                boxShadow: "0 0 20px rgba(120, 200, 255, 0.5)",
              }}
            />
          </div>
          {/* Second Row Line */}
          <div className="hidden lg:block absolute top-[calc(140px+100%)] left-0 right-0 h-0.5 pointer-events-none">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="h-full w-full bg-gradient-to-r from-admas-purple-light via-admas-blue via-admas-cyan to-admas-purple-light"
              style={{
                boxShadow: "0 0 20px rgba(120, 200, 255, 0.5)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="group relative"
                >
                  <div className="relative h-full overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-xl hover:shadow-admas-purple-light/20">
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                    />

                    {/* Step Number */}
                    <div className="relative z-10 mb-4 sm:mb-5 md:mb-6">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-white/10">
                        {step.number}
                      </span>
                    </div>

                    {/* Animated Icon */}
                    <div className="relative z-10 mb-4 sm:mb-5 md:mb-6 flex justify-center">
                      <motion.div
                        className={`flex h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ${
                          (step as any).hasPulse ? "animate-pulse" : ""
                        }`}
                        animate={step.iconAnimation as any}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: [0.42, 0, 0.58, 1],
                        }}
                        style={
                          (step as any).hasPulse
                            ? {
                                boxShadow: "0 0 20px rgba(120, 200, 255, 0.6)",
                              }
                            : {}
                        }
                      >
                        <Icon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="relative z-10 mb-2 sm:mb-3 text-xl sm:text-2xl font-heading font-bold text-white whitespace-normal break-words">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 text-sm sm:text-base text-gray-300 leading-relaxed whitespace-normal break-words">
                      {step.description}
                    </p>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, rgba(120, 200, 255, 0.1), rgba(176, 132, 255, 0.1))`,
                        filter: "blur(20px)",
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Scroll Progress Bar / Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
              <span>{t("progress.start")}</span>
              <span>{t("progress.end")}</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full w-full origin-left bg-gradient-to-r from-admas-purple-light via-admas-blue via-admas-cyan to-admas-purple-light"
                style={{
                  boxShadow: "0 0 10px rgba(120, 200, 255, 0.5)",
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{t("progress.step1")}</span>
              <span>{t("progress.step2")}</span>
              <span>{t("progress.step3")}</span>
              <span>{t("progress.step4")}</span>
              <span>{t("progress.step5")}</span>
              <span>{t("progress.step6")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
