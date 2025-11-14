"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import type { TrainingModule } from "@/lib/trainingData"

interface TrainingCardProps {
  module: TrainingModule
  onOpen: (module: TrainingModule) => void
}

export default function TrainingCard({ module, onOpen }: TrainingCardProps) {
  const previewBullets = module.bullets.slice(0, 2)
  const [imageError, setImageError] = useState(false)

  return (
    <article className="training-card relative flex h-full flex-col overflow-hidden rounded-[16px] sm:rounded-[18px] md:rounded-[20px] bg-white/10 p-4 sm:p-5 md:p-6 text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-[12px] transition-transform duration-300 hover:-translate-y-1">
      <figure className="mb-4 sm:mb-5 md:mb-6 overflow-hidden rounded-[14px] sm:rounded-[16px] md:rounded-[18px] rounded-b-xl shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
        <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
          {!imageError ? (
            <Image
              src={module.image}
              alt={module.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl">📚</div>
                <div className="text-[10px] sm:text-xs text-white/60">Image not found</div>
              </div>
            </div>
          )}
        </div>
      </figure>

      <div className="flex flex-1 flex-col space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-heading font-semibold leading-snug">{module.title}</h3>

        {previewBullets.length > 0 ? (
          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm leading-relaxed text-white/80">
            {previewBullets.map((bullet, index) => (
              <li key={`${module.id}-preview-${index}`} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}

        {module.bullets.length > 0 ? (
          <button
            type="button"
            onClick={() => onOpen(module)}
            className="flex w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-white/12 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            View Details
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300" />
          </button>
        ) : null}
      </div>
    </article>
  )
}

