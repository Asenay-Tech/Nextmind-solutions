"use client"

import { motion } from "framer-motion"
import { Award, BarChart, Clock, Shield, Users, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export default function WhyChooseUs() {
  const t = useTranslations('whyChooseUs')
  
  const benefits = [
    {
      icon: Shield,
      title: t('enterpriseSecurity.title'),
      description: t('enterpriseSecurity.description'),
    },
    {
      icon: Zap,
      title: t('rapidImplementation.title'),
      description: t('rapidImplementation.description'),
    },
    {
      icon: Users,
      title: t('expertTeam.title'),
      description: t('expertTeam.description'),
    },
    {
      icon: BarChart,
      title: t('measurableROI.title'),
      description: t('measurableROI.description'),
    },
    {
      icon: Clock,
      title: t('support24x7.title'),
      description: t('support24x7.description'),
    },
    {
      icon: Award,
      title: t('industryExpertise.title'),
      description: t('industryExpertise.description'),
    },
  ] as const

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[clamp(1.875rem,5vw,3rem)] font-heading font-bold text-white mb-3 sm:mb-4 px-2 whitespace-normal break-words">
              {t('title')}
            </h2>
            <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-400 max-w-3xl mx-auto px-2 leading-relaxed whitespace-normal break-words">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card p-4 sm:p-5 md:p-6 group hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-admas-purple-light to-admas-blue flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3 whitespace-normal break-words">
                  {benefit.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-400 leading-relaxed whitespace-normal break-words">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

