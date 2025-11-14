 "use client"

import { useEffect } from "react"
import { X } from "lucide-react"

import { useTrainingDrawer } from "@/context/TrainingDrawerContext"

export default function TrainingDrawer() {
  const { currentModule, closeDrawer } = useTrainingDrawer()
  const isOpen = Boolean(currentModule)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeDrawer])

  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-[520px] transform-gpu flex-col bg-gradient-to-b from-[#211b52]/85 via-[#14112f]/85 to-[#0e0c24]/90 text-white shadow-[-4px_0_24px_rgba(0,0,0,0.4)] backdrop-blur-[18px] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "clamp(380px, 40vw, 520px)" }}
      aria-hidden={!isOpen}
    >
      <div className="sticky top-0 z-10 bg-gradient-to-br from-[#4a3aff]/40 via-transparent to-transparent px-8 pb-6 pt-8 shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2 pr-6">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-200/80">Training Module</p>
            <h2 className="text-2xl font-heading font-semibold leading-snug">{currentModule?.title}</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full border border-white/10 bg-white/10 p-2 text-white/80 transition hover:border-white/30 hover:bg-white/20 hover:text-white"
            aria-label="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-8 pb-16 pt-8 training-drawer-scroll">
        <div className="space-y-4 text-base leading-7 text-white/85">
          {currentModule?.bullets.map((bullet, index) => (
            <p key={`${currentModule.id}-drawer-${index}`} className="whitespace-pre-line">
              {bullet}
            </p>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <style jsx global>{`
        .training-drawer-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .training-drawer-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .training-drawer-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6a5acd, #8f46ff);
          border-radius: 9999px;
        }
      `}</style>
    </div>
  )
}

