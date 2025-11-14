import * as React from "react"

import { cn } from "@/lib/utils"

type AccordionType = "single" | "multiple"

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
  type: AccordionType
  collapsible?: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function useAccordionContext() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an <Accordion>")
  }
  return context
}

interface AccordionProps {
  children: React.ReactNode
  type?: AccordionType
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
}

export function Accordion({
  children,
  type = "single",
  collapsible = false,
  defaultValue,
  value,
  onValueChange,
  className,
}: AccordionProps) {
  const isControlled = value !== undefined
  const initial =
    typeof value !== "undefined"
      ? value
      : typeof defaultValue !== "undefined"
      ? defaultValue
      : type === "single"
      ? []
      : []

  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(initial) ? initial : initial ? [initial] : [],
  )

  const currentOpenItems = React.useMemo(() => {
    if (isControlled) {
      if (Array.isArray(value)) return value
      return value ? [value] : []
    }
    return openItems
  }, [isControlled, value, openItems])

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let next: string[]
      if (type === "single") {
        const isActive = currentOpenItems.includes(itemValue)
        if (isActive) {
          next = collapsible ? [] : currentOpenItems
        } else {
          next = [itemValue]
        }
      } else {
        const isActive = currentOpenItems.includes(itemValue)
        next = isActive
          ? currentOpenItems.filter((value) => value !== itemValue)
          : [...currentOpenItems, itemValue]
      }

      if (!isControlled) {
        setOpenItems(next)
      }

      if (onValueChange) {
        onValueChange(type === "single" ? next[0] ?? "" : next)
      }
    },
    [collapsible, currentOpenItems, isControlled, onValueChange, type],
  )

  const contextValue = React.useMemo(
    () => ({
      openItems: currentOpenItems,
      toggleItem,
      type,
      collapsible,
    }),
    [currentOpenItems, toggleItem, type, collapsible],
  )

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
  toggle: () => void
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null)

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within an <AccordionItem>",
    )
  }
  return context
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({
  value,
  children,
  className,
}: AccordionItemProps) {
  const { openItems, toggleItem } = useAccordionContext()
  const isOpen = openItems.includes(value)

  const toggle = React.useCallback(() => toggleItem(value), [toggleItem, value])

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, toggle }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "overflow-hidden rounded-2xl border border-white/10 transition-all",
          className,
        )}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  const { isOpen, toggle } = useAccordionItemContext()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-admas-dark",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "ml-2 text-lg transition-transform",
          isOpen ? "rotate-45" : "rotate-0",
        )}
      >
        +
      </span>
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const { isOpen } = useAccordionItemContext()
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div
        className={cn(
          "overflow-hidden px-2 pb-4 pt-0 text-sm text-gray-300",
          className,
        )}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  )
}

