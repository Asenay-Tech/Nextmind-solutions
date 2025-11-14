"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import type { TrainingModule } from "@/lib/trainingData"

interface TrainingDrawerContextValue {
  currentModule: TrainingModule | null
  openDrawer: (module: TrainingModule) => void
  closeDrawer: () => void
}

const TrainingDrawerContext = createContext<TrainingDrawerContextValue | undefined>(undefined)

export function TrainingDrawerProvider({ children }: { children: React.ReactNode }) {
  const [currentModule, setCurrentModule] = useState<TrainingModule | null>(null)

  const openDrawer = useCallback((module: TrainingModule) => {
    setCurrentModule(module)
  }, [])

  const closeDrawer = useCallback(() => {
    setCurrentModule(null)
  }, [])

  const value = useMemo(
    () => ({
      currentModule,
      openDrawer,
      closeDrawer,
    }),
    [currentModule, openDrawer, closeDrawer],
  )

  return <TrainingDrawerContext.Provider value={value}>{children}</TrainingDrawerContext.Provider>
}

export function useTrainingDrawer() {
  const ctx = useContext(TrainingDrawerContext)
  if (!ctx) {
    throw new Error("useTrainingDrawer must be used within a TrainingDrawerProvider")
  }
  return ctx
}

