"use client"

import { useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"

import { servicesData } from "@/lib/data/services"
import { serviceMatchesCategory } from "@/lib/filters"

import FilterSection, { CategoryFilterType } from "./FilterSection"
import ServiceCard from "./ServiceCard"

export default function ServiceGrid() {
  const t = useTranslations('services')
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilterType>("All")

  const filteredServices = useMemo(() => {
    let filtered = servicesData

    if (activeCategory !== "All") {
      filtered = filtered.filter((service) =>
        serviceMatchesCategory(service, activeCategory),
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          (service.tags ?? []).some((tag) => tag.toLowerCase().includes(query)) ||
          service.subtopics.some(
            (subtopic) =>
              subtopic.title.toLowerCase().includes(query) ||
              subtopic.description.toLowerCase().includes(query),
          ),
      )
    }

    return filtered
  }, [activeCategory, searchQuery])

  const handleClearFilters = () => {
    setSearchQuery("")
    setActiveCategory("All")
  }

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-12%", "16%"])

  return (
    <section ref={sectionRef} id="services" className="relative overflow-hidden py-24">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] rounded-b-[36px] bg-gradient-to-b from-admas-dark/80 via-admas-purple-dark/70 to-transparent"
        style={{ y: parallaxY }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.3),_transparent_60%)] blur-3xl"
        style={{ y: parallaxY }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="mb-3 sm:mb-4 px-2 text-[clamp(1.875rem,5vw,3rem)] font-heading font-bold leading-tight text-white whitespace-normal break-words">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-3xl px-2 text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed text-gray-300 whitespace-normal break-words">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <FilterSection
            searchValue={searchQuery}
            activeCategory={activeCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="py-16 text-center"
          >
            <div className="mb-4 text-lg text-gray-400 whitespace-normal break-words">
              {t('noResults')}
            </div>
            <button
              onClick={handleClearFilters}
              className="font-medium text-admas-purple-light transition-colors hover:text-admas-cyan whitespace-normal break-words"
              type="button"
            >
              {t('clearFilters')}
            </button>
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#0b0b2b] to-[#070720]" />
    </section>
  )
}

