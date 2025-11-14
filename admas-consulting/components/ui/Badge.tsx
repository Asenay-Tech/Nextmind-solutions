import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "gold" | "default"
}

export default function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full leading-none text-xs font-semibold"

  const variants: Record<typeof variant, string> = {
    default:
      "px-2.5 py-0.5 bg-white/10 text-white border border-white/15 backdrop-blur",
    gold:
      "px-2.5 py-0.5 text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 shadow-[0_0_18px_rgba(245,158,11,.35)] ring-1 ring-amber-300/60",
  }

  return <span className={cn(base, variants[variant], className)} {...props} />
}

