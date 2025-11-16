"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  const t = useTranslations("services")
  const defaultPlaceholder = placeholder || t("searchPlaceholder")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-visible transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <span className="pointer-events-none absolute inset-y-0 left-3 sm:left-4 flex items-center z-20">
        <div
          className={cn(
            "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-md ring-1 ring-purple-400/30",
            "glass-icon",
            isFocused && "glass-icon-active",
          )}
        >
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-admas-purple-light" />
        </div>
      </span>
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={defaultPlaceholder}
        className={cn(
          "w-full glass-filter py-4 sm:py-5 md:py-6 pl-12 sm:pl-14 md:pl-16 pr-4 sm:pr-5 text-sm sm:text-base md:text-lg text-white placeholder:text-gray-200",
          "bg-transparent relative z-10 rounded-xl sm:rounded-2xl focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:outline-none",
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

