"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X, Download } from "lucide-react"

import type { TrainingModule } from "@/lib/trainingData"
import { parseTrainingModule, type StructuredTopic } from "@/lib/utils/trainingParser"
import { generateTrainingModulePDF } from "@/lib/utils/pdfGenerator"

interface TrainingOverlayProps {
  open: boolean
  module: TrainingModule | null
  onClose: () => void
}

export default function TrainingOverlay({ open, module, onClose }: TrainingOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  
  // Parse module bullets into structured format
  const parsedModule = useMemo(() => {
    if (!module) return null
    return parseTrainingModule(module.bullets)
  }, [module])

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null
      const timeout = window.setTimeout(() => {
        const closeButton = panelRef.current?.querySelector<HTMLElement>("[data-close-button]")
        closeButton?.focus()
      }, 0)
      return () => {
        window.clearTimeout(timeout)
        previousFocusRef.current?.focus?.()
      }
    }
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }
    const scrollElement = panelRef.current
    if (!scrollElement) {
      return
    }

    const updateShadows = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollElement
      setShowTopShadow(scrollTop > 6)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 6)
    }

    updateShadows()
    scrollElement.addEventListener("scroll", updateShadows)
    window.addEventListener("resize", updateShadows)

    const raf = window.requestAnimationFrame(updateShadows)

    return () => {
      window.cancelAnimationFrame(raf)
      scrollElement.removeEventListener("scroll", updateShadows)
      window.removeEventListener("resize", updateShadows)
      setShowTopShadow(false)
      setShowBottomShadow(false)
    }
  }, [open, module])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )

        if (focusable.length === 0) {
          event.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const isShift = event.shiftKey
        const activeElement = document.activeElement as HTMLElement | null

        if (!isShift && activeElement === last) {
          event.preventDefault()
          first.focus()
        } else if (isShift && activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  if (typeof window === "undefined") {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {open && module ? (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-overlay-title"
            ref={containerRef}
            className="fixed inset-0 z-[110] flex items-center justify-center px-3 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              onClick={(event) => event.stopPropagation()}
              className="relative mx-auto flex w-[min(92vw,660px)] max-h-[90vh] origin-center flex-col overflow-y-auto rounded-[22px] border border-white/10 bg-[rgba(13,13,22,0.94)] shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <figure className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
                <Image
                  src={module.image}
                  alt={module.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 600px"
                  className="h-full w-full object-cover rounded-t-xl"
                />
              </figure>

              <div className="flex flex-1 flex-col gap-6">
                {/* Stable Header Section */}
                <div className="px-6 pt-6">
                  <div className="flex items-start justify-between w-full flex-wrap gap-4 min-h-[80px]">
                    {/* Title Section */}
                    <div className="flex flex-col max-w-[70%] min-w-[250px] flex-1 space-y-2">
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70 w-fit">
                        Training Module
                      </span>
                      <h2
                        id="training-overlay-title"
                        className="text-2xl font-heading font-semibold leading-snug text-white"
                      >
                        {module.title}
                      </h2>
                    </div>

                    {/* Button Container - Always Right Aligned */}
                    <div className="flex-shrink-0 flex items-center gap-2 sm:flex-row flex-col">
                      <button
                        type="button"
                        onClick={() => generateTrainingModulePDF(module)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 shadow-sm"
                        aria-label="Download Outline (PDF)"
                      >
                        <Download className="h-4 w-4" />
                        Download Outline (PDF)
                      </button>
                      <button
                        type="button"
                        data-close-button
                        onClick={onClose}
                        className="rounded-full border border-white/10 bg-white/10 p-2 text-white/80 transition hover:border-white/30 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 flex-shrink-0"
                        aria-label="Close details"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4 pr-2 text-sm leading-relaxed text-white/85">
                  {parsedModule && parsedModule.chapters.length > 0 ? (
                    parsedModule.chapters.map((chapter, chapterIndex) => (
                      <StructuredTopicRenderer
                        key={`chapter-${chapterIndex}`}
                        topic={chapter}
                        moduleId={module.id}
                      />
                    ))
                  ) : (
                    // Fallback to original format if parsing fails
                    module.bullets.map((bullet, index) => (
                      <p key={`${module.id}-overlay-${index}`}>{bullet}</p>
                    ))
                  )}
                </div>
              </div>

              <div className="pointer-events-none mx-auto mb-4 mt-2 h-2 w-24 rounded-full bg-white/12 shadow-[0_0_16px_rgba(148,119,255,0.45)]" />

              <div
                className={`pointer-events-none sticky top-0 h-0 transition-opacity duration-200 ${
                  showTopShadow ? "opacity-100" : "opacity-0"
                }`}
              />
              <div
                className={`pointer-events-none sticky bottom-0 h-0 transition-opacity duration-200 ${
                  showBottomShadow ? "opacity-100" : "opacity-0"
                }`}
              />
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

/**
 * Renders a structured topic with proper hierarchy
 */
function StructuredTopicRenderer({
  topic,
  moduleId,
}: {
  topic: StructuredTopic
  moduleId: number
}) {
  const renderTopic = (t: StructuredTopic, depth: number = 0, parentIndex: number = 0) => {
    const isFirst = depth === 0 && parentIndex === 0
    
    if (t.type === "chapter") {
      return (
        <div key={`${moduleId}-${t.number || t.title}-${depth}-${parentIndex}`} className={isFirst ? "" : "mt-6"}>
          <h3 className="text-lg font-heading font-semibold text-admas-purple-light mb-4 pb-2 border-b border-white/10">
            {t.title}
          </h3>
          {t.children && t.children.length > 0 && (
            <div className="space-y-3">
              {t.children.map((child, index) => (
                <div key={`${moduleId}-child-${index}-${depth + 1}`}>
                  {renderTopic(child, depth + 1, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    if (t.type === "section") {
      return (
        <div key={`${moduleId}-${t.number || t.title}-${depth}-${parentIndex}`} className="mt-3">
          <div className="text-sm font-semibold text-white/90 mb-2">
            <span className="text-admas-purple-light">{t.number}</span> {t.title}
          </div>
          {t.children && t.children.length > 0 && (
            <div className="ml-6 mt-2 space-y-2">
              {t.children.map((child, index) => (
                <div key={`${moduleId}-child-${index}-${depth + 1}`}>
                  {renderTopic(child, depth + 1, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    if (t.type === "subtopic") {
      return (
        <div key={`${moduleId}-${t.number || t.title}-${depth}-${parentIndex}`} className="mt-1.5">
          <div className="text-sm text-white/80 leading-relaxed">
            <span className="text-white/50 font-mono text-xs mr-2">{t.number}</span>
            <span>{t.title}</span>
          </div>
          {t.children && t.children.length > 0 && (
            <div className="ml-8 mt-1.5 space-y-1.5">
              {t.children.map((child, index) => (
                <div key={`${moduleId}-child-${index}-${depth + 1}`}>
                  {renderTopic(child, depth + 1, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    
    return null
  }
  
  return renderTopic(topic, 0, 0)
}

