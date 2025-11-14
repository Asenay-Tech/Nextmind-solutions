"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CategoryFilter {
  id: string
  label: string
  activeClassName?: string
  inactiveClassName?: string
}

interface CategoryPillProps {
  category: CategoryFilter
  isActive: boolean
  onClick: () => void
}

export default function CategoryPill({
  category,
  isActive,
  onClick,
}: CategoryPillProps) {
  const activeStyles =
    category.activeClassName ??
    "bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan text-white shadow-lg shadow-admas-purple-light/50"
  const inactiveStyles =
    category.inactiveClassName ??
    "bg-transparent border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isActive ? 1.05 : 1,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-1 focus-visible:ring-offset-admas-dark",
        isActive ? activeStyles : inactiveStyles,
      )}
      type="button"
      aria-pressed={isActive}
    >
      {category.label}
    </motion.button>
  )
}

