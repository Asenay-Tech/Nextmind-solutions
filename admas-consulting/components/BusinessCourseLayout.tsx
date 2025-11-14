"use client"

import { useMemo, useState } from "react"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"

import type { BusinessModule } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BusinessCourseLayoutProps {
  modules: BusinessModule[]
}

export default function BusinessCourseLayout({ modules }: BusinessCourseLayoutProps) {
  const initialModuleId = modules[0]?.id
  const [openModules, setOpenModules] = useState<Set<string | number>>(
    () => new Set(initialModuleId !== undefined ? [initialModuleId] : []),
  )
  const [activeModule, setActiveModule] = useState<string | number | null>(
    initialModuleId ?? null,
  )
  const [tocOpen, setTocOpen] = useState(false)

  const toggleModule = (id: string | number) => {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setActiveModule(id)
  }

  const handleNavigate = (id: string | number) => {
    setOpenModules((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setActiveModule(id)
    setTocOpen(false)

    const element = document.getElementById(`module-${id}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const sanitizedModules = useMemo(() => {
    return modules.map((module) => ({
      ...module,
      topics:
        module.topics?.filter((topic) => {
          const trimmed = topic?.trim()
          return trimmed !== "" && trimmed !== "—" && trimmed !== "-"
        }) ?? [],
    }))
  }, [modules])

  return (
    <div className="flex flex-col md:grid md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-8 md:gap-12">
      <aside className="md:sticky md:top-28 md:self-start">
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-center justify-between md:justify-start gap-3 mb-4">
            <h3 className="text-lg font-heading font-semibold text-white">
              Course Outline
            </h3>
            <button
              type="button"
              onClick={() => setTocOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors w-9 h-9"
              aria-label="Toggle course outline"
            >
              {tocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          <nav
            className={cn(
              "space-y-2",
              tocOpen ? "block" : "hidden md:block",
            )}
          >
            {sanitizedModules.map((module) => {
              const isActive = activeModule === module.id
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => handleNavigate(module.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                    isActive
                      ? "bg-white/15 text-white shadow-lg shadow-admas-purple-light/20 border border-white/20"
                      : "text-gray-400 hover:text-white hover:bg-white/10 border border-white/10",
                  )}
                >
                  {module.title}
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="space-y-6 md:space-y-8">
        {sanitizedModules.map((module) => {
          const isOpen = openModules.has(module.id)

          return (
            <article
              key={module.id}
              id={`module-${module.id}`}
              className="glass-card border border-white/10 rounded-3xl overflow-hidden transition-shadow hover:shadow-[0_0_35px_rgba(123,97,255,0.15)]"
            >
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between gap-6 px-6 py-6 md:px-8 md:py-7 text-left"
                aria-expanded={isOpen}
                aria-controls={`module-content-${module.id}`}
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-white mb-2">
                    {module.title}
                  </h3>
                  {module.description ? (
                    <p className="text-sm md:text-base text-gray-300 max-w-3xl">
                      {module.description}
                    </p>
                  ) : null}
                </div>
                <span className="flex-shrink-0 text-admas-purple-light">
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 transition-transform" />
                  ) : (
                    <ChevronRight className="w-5 h-5 transition-transform" />
                  )}
                </span>
              </button>

              <div
                id={`module-content-${module.id}`}
                className={cn(
                  "px-6 md:px-8 pb-6 md:pb-8 transition-all duration-300",
                  isOpen ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
                )}
              >
                <div className="border-t border-white/10 pt-6 md:pt-8 space-y-5">
                  <ul className="space-y-3 md:space-y-4">
                    {module.topics?.map((topic, index) => (
                      <li
                        key={`${module.id}-${index}-${topic}`}
                        className="relative pl-6 text-sm md:text-base text-gray-300 leading-relaxed before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-admas-purple-light before:shadow-[0_0_12px_rgba(123,97,255,0.6)]"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

