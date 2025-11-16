"use client"

import { motion, useScroll } from "framer-motion"

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll()

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-32 bottom-32 right-6 z-[60] hidden md:flex w-[3px] flex-col items-center justify-center"
    >
      <div className="relative h-full w-px overflow-hidden rounded-full bg-white/10">
        <motion.span
          style={{ scaleY: scrollYProgress, originY: 0 }}
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-admas-purple-light via-admas-blue to-admas-cyan shadow-[0_0_12px_rgba(96,165,250,0.55)]"
        />
      </div>
      <motion.div
        className="mt-3 h-2 w-2 rounded-full bg-white/40 shadow-[0_0_10px_rgba(138,99,241,0.4)]"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
      />
    </div>
  )
}

