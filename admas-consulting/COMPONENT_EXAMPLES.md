# Component Implementation Examples
## Reusable Component Patterns

---

## 🎯 Example Component Implementations

### 1. SectionHeader Component

```typescript
// components/sections/SectionHeader.tsx
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  align?: 'left' | 'center' | 'right'
  showUnderline?: boolean
  gradientUnderline?: boolean
  className?: string
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  showUnderline = false,
  gradientUnderline = false,
  className
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={cn("mb-16", alignClass, className)}
    >
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-admas-purple-light"
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-4 text-4xl font-heading font-bold text-white md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>

      {showUnderline && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={cn(
            "mx-auto mb-6 h-1 w-24 rounded-full",
            gradientUnderline
              ? "bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan shadow-lg shadow-admas-purple-light/50"
              : "bg-white/20",
            align === 'left' && "mx-0",
            align === 'right' && "ml-auto mr-0"
          )}
        />
      )}

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
```

**Usage:**
```tsx
<SectionHeader
  title="Our AI Agent Solutions"
  description="Comprehensive AI Agent–powered solutions tailored to transform your business operations"
  align="center"
  showUnderline
  gradientUnderline
/>
```

---

### 2. SectionContainer Component

```typescript
// components/sections/SectionContainer.tsx
"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  id?: string
  variant?: 'default' | 'dark' | 'gradient'
  backgroundEffects?: boolean
  parallax?: boolean
  className?: string
}

export default function SectionContainer({
  children,
  id,
  variant = 'default',
  backgroundEffects = false,
  parallax = false,
  className
}: SectionContainerProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-12%", "16%"])

  const variantStyles = {
    default: "bg-transparent",
    dark: "bg-admas-dark",
    gradient: "bg-gradient-to-b from-admas-dark via-admas-purple-dark to-admas-dark"
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative overflow-hidden py-20 md:py-24 lg:py-32", variantStyles[variant], className)}
    >
      {backgroundEffects && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[600px] rounded-b-[36px] bg-gradient-to-b from-admas-dark/80 via-admas-purple-dark/70 to-transparent"
            style={parallax ? { y: parallaxY } : undefined}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.3),_transparent_60%)] blur-3xl"
            style={parallax ? { y: parallaxY } : undefined}
          />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4">
        {children}
      </div>

      {variant === 'gradient' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#0b0b2b] to-[#070720]" />
      )}
    </section>
  )
}
```

**Usage:**
```tsx
<SectionContainer
  id="services"
  variant="gradient"
  backgroundEffects
  parallax
>
  <SectionHeader title="Our Solutions" />
  <ServiceGrid services={services} />
</SectionContainer>
```

---

### 3. BenefitCard Component

```typescript
// components/cards/BenefitCard.tsx
"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BenefitCardProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: 'default' | 'minimal'
  index?: number
  className?: string
}

export default function BenefitCard({
  icon: Icon,
  title,
  description,
  variant = 'default',
  index = 0,
  className
}: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn("group", className)}
    >
      <div className={cn(
        "h-full p-6 transition-all duration-300",
        variant === 'default' 
          ? "glass-card hover:glass-card-hover" 
          : "rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
      )}>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-admas-purple-light to-admas-blue transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_16px_40px_rgba(96,165,250,0.5)]">
          <Icon className="h-6 w-6 text-white" />
        </div>

        <h3 className="mb-3 text-xl font-heading font-bold text-white">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
```

**Usage:**
```tsx
<BenefitsGrid>
  {benefits.map((benefit, index) => (
    <BenefitCard
      key={benefit.title}
      {...benefit}
      index={index}
    />
  ))}
</BenefitsGrid>
```

---

### 4. ProcessStepCard Component

```typescript
// components/cards/ProcessStepCard.tsx
"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessStepCardProps {
  number: string
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  iconAnimation?: {
    rotate?: number[]
    scale?: number[]
    y?: number[]
  }
  hasPulse?: boolean
  index?: number
  className?: string
}

export default function ProcessStepCard({
  number,
  icon: Icon,
  title,
  description,
  gradient,
  iconAnimation = { y: [0, -8, 0] },
  hasPulse = false,
  index = 0,
  className
}: ProcessStepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={cn("group relative", className)}
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-xl hover:shadow-admas-purple-light/20">
        {/* Gradient Background on Hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10",
            gradient
          )}
        />

        {/* Step Number */}
        <div className="relative z-10 mb-6">
          <span className="text-5xl font-bold text-white/10 md:text-6xl">
            {number}
          </span>
        </div>

        {/* Animated Icon */}
        <div className="relative z-10 mb-6 flex justify-center">
          <motion.div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
              gradient,
              hasPulse && "animate-pulse"
            )}
            animate={iconAnimation}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={
              hasPulse
                ? {
                    boxShadow: "0 0 20px rgba(120, 200, 255, 0.6)",
                  }
                : {}
            }
          >
            <Icon className="h-10 w-10 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="relative z-10 mb-3 text-2xl font-heading font-bold text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="relative z-10 text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Hover Glow Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, rgba(120, 200, 255, 0.1), rgba(176, 132, 255, 0.1))`,
            filter: "blur(20px)",
          }}
        />
      </div>
    </motion.div>
  )
}
```

**Usage:**
```tsx
<ProcessStepCard
  number="01"
  icon={Search}
  title="Discover"
  description="Understand business goals, workflows, and automation opportunities."
  gradient="from-admas-purple-light via-admas-blue to-admas-cyan"
  iconAnimation={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
  index={0}
/>
```

---

### 5. Responsive Grid Component

```typescript
// components/ui/Grid.tsx
import { cn } from "@/lib/utils"

interface GridProps {
  children: React.ReactNode
  cols?: {
    mobile?: 1 | 2
    tablet?: 2 | 3
    desktop?: 3 | 4
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = 'md',
  className 
}: GridProps) {
  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }[gap]

  // Build responsive grid classes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div 
      className={cn(
        'grid',
        gridCols[cols.mobile || 1],
        `md:${gridCols[cols.tablet || 2]}`,
        `lg:${gridCols[cols.desktop || 3]}`,
        gapClass,
        className
      )}
    >
      {children}
    </div>
  )
}
```

**Usage:**
```tsx
<Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {services.map(service => (
    <ServiceCard key={service.id} service={service} />
  ))}
</Grid>
```

---

### 6. Custom Hooks

#### useScrollReveal Hook

```typescript
// hooks/useScrollReveal.ts
import { useRef } from "react"
import { useInView } from "framer-motion"
import type { IntersectionOptions } from "framer-motion"

export function useScrollReveal(options?: IntersectionOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.2,
    ...options 
  })
  
  return {
    ref,
    isInView,
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.6, ease: "easeOut" }
  }
}
```

**Usage:**
```tsx
function MyComponent() {
  const { ref, initial, animate, transition } = useScrollReveal()
  
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      Content
    </motion.div>
  )
}
```

#### useParallax Hook

```typescript
// hooks/useParallax.ts
import { useRef } from "react"
import { useScroll, useTransform, MotionValue } from "framer-motion"

interface UseParallaxOptions {
  offset?: string
  speed?: number
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { offset = "200px", speed = 1 } = options
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [`0%`, `${parseInt(offset) * speed}%`]
  )
  
  return { ref, y }
}
```

**Usage:**
```tsx
function ParallaxSection() {
  const { ref, y } = useParallax({ offset: "100px", speed: 0.5 })
  
  return (
    <motion.div ref={ref} style={{ y }}>
      Parallax content
    </motion.div>
  )
}
```

---

### 7. Animation Variants (Shared)

```typescript
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 30, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

export const hoverScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: { scale: 0.98 }
}
```

**Usage:**
```tsx
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item, index) => (
    <motion.div key={index} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 📋 Refactored Homepage Example

```typescript
// app/page.tsx
import Footer from "@/components/layout/Footer"
import NavBar from "@/components/layout/NavBar"
import Hero from "@/components/hero/Hero"
import SectionContainer from "@/components/sections/SectionContainer"
import SectionHeader from "@/components/sections/SectionHeader"
import ServiceGrid from "@/components/sections/ServiceGrid"
import ProcessSteps from "@/components/sections/ProcessSteps"
import BenefitsGrid from "@/components/sections/BenefitsGrid"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <NavBar />
      
      <Hero
        title={
          <>
            Where <span className="gradient-text">Intelligent Systems</span>
            <br />
            Meet Immersive <span className="gradient-text">Intelligent Ideas</span>
          </>
        }
        description="Unlock autonomous decision-making and orchestrate complex workflows with human-inspired AI."
        primaryCTA={{
          label: "Explore Solutions",
          href: "#services"
        }}
        secondaryCTA={{
          label: "Schedule Consultation",
          href: "/contact"
        }}
        badge={{
          text: "AI-Powered Business Solutions",
          icon: Sparkles
        }}
        showWave
      />

      <SectionContainer
        id="services"
        variant="gradient"
        backgroundEffects
        parallax
      >
        <SectionHeader
          title="Our AI Agent Solutions"
          description="Comprehensive AI Agent–powered solutions tailored to transform your business operations"
          align="center"
          showUnderline
          gradientUnderline
        />
        <ServiceGrid showFilters />
      </SectionContainer>

      <SectionContainer
        id="process"
        variant="gradient"
      >
        <ProcessSteps
          steps={processSteps}
          layout="grid"
          showConnectors
          showProgress
        />
      </SectionContainer>

      <SectionContainer variant="default">
        <BenefitsGrid
          benefits={benefits}
          showHeader
          header={{
            title: "Why Choose AdmasITS",
            description: "We combine cutting-edge AI technology with deep business expertise"
          }}
        />
      </SectionContainer>

      <Footer />
    </main>
  )
}
```

---

## ✅ Best Practices

1. **Component Composition**
   - Build small, focused components
   - Compose larger components from smaller ones
   - Use props for customization

2. **Animation Performance**
   - Use `transform` and `opacity` only
   - Avoid animating layout properties
   - Use `will-change` sparingly

3. **Responsive Design**
   - Mobile-first approach
   - Use Tailwind breakpoints consistently
   - Test on multiple devices

4. **Type Safety**
   - Define TypeScript interfaces for all props
   - Use strict type checking
   - Export types for reuse

5. **Code Organization**
   - Group related components
   - Use consistent naming conventions
   - Document complex logic

---

**Last Updated:** 2025-01-27

