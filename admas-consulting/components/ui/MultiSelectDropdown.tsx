"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  error?: string
  className?: string
}

export default function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  error,
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const selectedLabels = options.filter((opt) => selected.includes(opt.value))

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full min-h-[44px] rounded-lg border bg-white/5 px-4 py-2.5 text-left text-sm text-white transition-all",
          "border-white/20 hover:border-[#4a4d7a] focus:outline-none focus:ring-2 focus:ring-admas-purple-light focus:ring-offset-2 focus:ring-offset-admas-dark",
          error && "border-red-500/50",
          isOpen && "border-admas-purple-light ring-2 ring-admas-purple-light/20",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 flex-1">
            {selectedLabels.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selectedLabels.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-admas-purple-light/20 to-admas-blue/20 px-3 py-1 text-xs font-medium text-white border border-admas-purple-light/30"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => removeOption(option.value, e)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full rounded-lg border border-white/10 bg-[#0b1020] shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                      "hover:bg-white/10 text-white",
                      isSelected && "bg-admas-purple-light/10",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "border-admas-purple-light bg-admas-purple-light"
                          : "border-white/30 bg-transparent",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

