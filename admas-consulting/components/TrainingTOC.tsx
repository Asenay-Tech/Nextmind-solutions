"use client"

import { useEffect, useState } from "react"

interface TocItem {
  id: string
  title: string
}

interface TrainingTOCProps {
  items: TocItem[]
}

export default function TrainingTOC({ items }: TrainingTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0.1,
      },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={(event) => handleClick(event, item.id)}
          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
            activeId === item.id
              ? "bg-white/20 text-white"
              : "bg-white/10 text-white/70 hover:bg-white/16 hover:text-white"
          }`}
        >
          <span className="line-clamp-2">{item.title}</span>
        </button>
      ))}
    </nav>
  )
}

