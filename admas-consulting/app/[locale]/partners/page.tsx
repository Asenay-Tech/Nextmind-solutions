"use client"

import { Link } from "@/i18n/routing"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Bot,
  Building2,
  Cloud,
  Briefcase,
  Network,
  Target,
  Users,
  Zap,
  Globe,
  Code,
} from "lucide-react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"

type Props = {
  params: Promise<{ locale: string }>
}

export default function PartnersPage() {
  const t = useTranslations("partners")
  
  const partnershipAreas = [
    {
      icon: Bot,
      titleKey: "areas.aiAutomation.title",
      descriptionKey: "areas.aiAutomation.description",
    },
    {
      icon: Briefcase,
      titleKey: "areas.businessConsulting.title",
      descriptionKey: "areas.businessConsulting.description",
    },
    {
      icon: Cloud,
      titleKey: "areas.itInfrastructure.title",
      descriptionKey: "areas.itInfrastructure.description",
    },
    {
      icon: Building2,
      titleKey: "areas.industrySpecific.title",
      descriptionKey: "areas.industrySpecific.description",
    },
    {
      icon: Network,
      titleKey: "areas.erpSystems.title",
      descriptionKey: "areas.erpSystems.description",
    },
  ] as const

  const collaborationModels = [
    {
      icon: Target,
      titleKey: "models.strategic.title",
      descriptionKey: "models.strategic.description",
    },
    {
      icon: Briefcase,
      titleKey: "models.projectBased.title",
      descriptionKey: "models.projectBased.description",
    },
    {
      icon: Globe,
      titleKey: "models.globalNetwork.title",
      descriptionKey: "models.globalNetwork.description",
    },
  ] as const

  const benefits = [
    {
      icon: Zap,
      titleKey: "benefits.expertise",
    },
    {
      icon: Code,
      titleKey: "benefits.scalable",
    },
    {
      icon: Globe,
      titleKey: "benefits.global",
    },
    {
      icon: Users,
      titleKey: "benefits.teams",
    },
  ] as const

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // cubic-bezier equivalent to easeOut (type-safe)
      },
    },
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-admas-dark via-admas-purple-dark to-admas-purple opacity-50" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          animate={{
            backgroundPosition: ["0% 0%", "22% 8%", "0% 0%"],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: [0, 0, 1, 1] }}
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(96,165,250,0.08) 0%, rgba(138,99,241,0.18) 35%, transparent 70%), linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
            backgroundSize: "cover, 60px 60px, 60px 60px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight"
            >
              {t("hero.title")} <span className="gradient-text">Admas</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="btn-gradient">
                    {t("cta.primary")}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Areas Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {t("areas.title")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("areas.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {partnershipAreas.map((area, i) => {
              const Icon = area.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  className="glass-card p-6 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-admas-purple-light to-admas-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">{t(area.titleKey as any)}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{t(area.descriptionKey as any)}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Collaboration Models Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {t("models.title")}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("models.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {collaborationModels.map((model, index) => {
              const Icon = model.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="glass-card p-8 text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-admas-purple-light/10 via-transparent to-admas-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-admas-purple-light to-admas-blue flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-3">{t(model.titleKey as any)}</h3>
                    <p className="text-gray-400 leading-relaxed">{t(model.descriptionKey as any)}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              {t("benefits.title")}
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass-card p-6 flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-admas-purple-light" />
                  </div>
                  <div>
                    <p className="text-lg font-heading font-semibold text-white">{t(benefit.titleKey as any)}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              {t("finalCta.title")}
            </h2>
            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="btn-gradient mt-4">
                  {t("cta.secondary")}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

