"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

import { getCategoryColor, getCategoryLabel } from "@/lib/data/categories"
import type { Service } from "@/lib/types"

interface ServiceCardProps {
  service: Service
  index: number
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const IconComponent =
    (Icons[service.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Box

  return (
    <motion.div
      id={`service-${service.slug}`}
      initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.article
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="group glass-card relative h-full p-4 sm:p-5 md:p-6"
      >
        <div className="mb-3 sm:mb-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-admas-purple-light via-admas-blue to-admas-cyan text-white shadow-[0_12px_30px_rgba(96,165,250,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_16px_40px_rgba(96,165,250,0.5)]">
            <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        </div>

        <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-heading font-bold leading-snug text-white transition-colors duration-300 group-hover:text-admas-purple-light">
          {service.title}
        </h3>
        <p className="mb-3 sm:mb-4 text-sm leading-relaxed text-gray-300">{service.description}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {service.category.map((category) => (
            <span
              key={category}
              className={`${getCategoryColor(category)}/80 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs tracking-wide text-white/95 backdrop-blur`}
            >
              {getCategoryLabel(category)}
            </span>
          ))}
        </div>

        <motion.span
          className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(120deg, rgba(96,165,250,0.5), rgba(138,99,241,0.4), rgba(56,189,248,0.45))",
            filter: "blur(18px)",
          }}
          aria-hidden="true"
        />
      </motion.article>
    </motion.div>
  )
}

