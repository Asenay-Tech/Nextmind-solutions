"use client"

import { motion } from "framer-motion"
import { categories } from "@/lib/data/categories"
import type { CategoryType } from "@/lib/types"
import CategoryPill, { CategoryFilter } from "./CategoryPill"
import SearchBar from "./SearchBar"

export type CategoryFilterType = CategoryType | "All"

interface FilterSectionProps {
  searchValue: string
  activeCategory: CategoryFilterType
  onSearchChange: (value: string) => void
  onCategoryChange: (category: CategoryFilterType) => void
}

// Map category colors to gradient classes
const categoryGradients: Record<string, string> = {
  "bg-purple-500": "bg-gradient-to-r from-purple-500 to-purple-600",
  "bg-blue-500": "bg-gradient-to-r from-blue-500 to-blue-600",
  "bg-cyan-500": "bg-gradient-to-r from-cyan-500 to-cyan-600",
  "bg-teal-500": "bg-gradient-to-r from-teal-500 to-teal-600",
  "bg-green-500": "bg-gradient-to-r from-green-500 to-green-600",
  "bg-indigo-500": "bg-gradient-to-r from-indigo-500 to-indigo-600",
  "bg-emerald-500": "bg-gradient-to-r from-emerald-500 to-emerald-600",
  "bg-pink-500": "bg-gradient-to-r from-pink-500 to-pink-600",
  "bg-violet-500": "bg-gradient-to-r from-violet-500 to-violet-600",
  "bg-amber-500": "bg-gradient-to-r from-amber-500 to-amber-600",
  "bg-gray-500": "bg-gradient-to-r from-gray-500 to-gray-600",
}

const filterCategories: CategoryFilter[] = [
  {
    id: "All",
    label: "All",
    activeClassName:
      "bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan text-white shadow-lg shadow-admas-purple-light/50",
    inactiveClassName:
      "bg-transparent border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm",
  },
  ...categories.map((category) => ({
    id: category.id,
    label: category.label,
    activeClassName: `${categoryGradients[category.color] || category.color} text-white shadow-lg shadow-purple-500/50`,
    inactiveClassName:
      "bg-transparent border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm",
  })),
]

export default function FilterSection({
  searchValue,
  activeCategory,
  onSearchChange,
  onCategoryChange,
}: FilterSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="flex justify-center px-2">
        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>

      <motion.div
        className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-3 px-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {filterCategories.map((category) => {
          const isActive = activeCategory === category.id
          return (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.2 }}
            >
              <CategoryPill
                category={category}
                isActive={isActive}
                onClick={() => onCategoryChange(category.id as CategoryFilterType)}
              />
            </motion.div>
          )
        })}
      </motion.div>

      {(searchValue || activeCategory !== "All") && (
        <div className="text-center">
          <button
            onClick={() => {
              onSearchChange("")
              onCategoryChange("All")
            }}
            className="text-xs sm:text-sm text-admas-purple-light hover:text-admas-cyan transition-colors"
            type="button"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

