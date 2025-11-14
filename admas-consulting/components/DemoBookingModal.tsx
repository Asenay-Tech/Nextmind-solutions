"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, CheckCircle2, Calendar, Clock, Building2, Users, Briefcase, Target, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { cn } from "@/lib/utils"

interface DemoBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  // Step 1
  fullName: string
  email: string
  phone: string
  companyName: string
  companyWebsite: string
  country: string
  
  // Step 2
  teamSize: string
  industry: string
  jobRole: string
  
  // Step 3
  automationAreas: string[]
  challenges: string
  timeline: string
  
  // Step 4
  preferredTime: string
  timezone: string
  notes: string
}

const teamSizes = ["1-10", "11-50", "51-200", "200+"]
const industries = ["Tech", "Construction", "Logistics", "Finance", "Retail", "Government", "Other"]
const jobRoles = ["Founder/CEO", "Manager", "Engineer", "Operations", "Other"]
const automationAreas = [
  "Customer Support",
  "Internal Workflows",
  "Finance & Billing",
  "Inventory/Logistics",
  "AI Agents",
  "All of the Above"
]
const timelines = ["Immediately", "This Month", "Within 3 Months", "Just Exploring"]
const timezones = [
  "UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6", "UTC-5",
  "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC+0", "UTC+1", "UTC+2", "UTC+3",
  "UTC+4", "UTC+5", "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10", "UTC+11", "UTC+12"
]

export default function DemoBookingModal({ isOpen, onClose }: DemoBookingModalProps) {
  const t = useTranslations('demoBooking')
  const tCommon = useTranslations('common')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyWebsite: "",
    country: "",
    teamSize: "",
    industry: "",
    jobRole: "",
    automationAreas: [],
    challenges: "",
    timeline: "",
    preferredTime: "",
    timezone: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    setCurrentStep(1)
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      country: "",
      teamSize: "",
      industry: "",
      jobRole: "",
      automationAreas: [],
      challenges: "",
      timeline: "",
      preferredTime: "",
      timezone: "",
      notes: "",
    })
    setErrors({})
    onClose()
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow dragging from header area, not buttons or interactive elements
    const target = e.target as HTMLElement
    
    // Don't drag if clicking on buttons, icons, or interactive elements
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.tagName === 'SVG' || 
      target.closest('svg') ||
      target.tagName === 'PATH' ||
      target.closest('a') ||
      target.closest('[data-close-button]')
    ) {
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    
    // Calculate the offset from the click point to the modal's current position
    // Since modal starts centered, position is (0, 0), so we calculate offset from center
    const centerX = window.innerWidth / 2 + position.x
    const centerY = window.innerHeight / 2 + position.y
    
    setDragStart({
      x: e.clientX - centerX,
      y: e.clientY - centerY,
    })
    
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!modalRef.current) return

      e.preventDefault()
      const modal = modalRef.current
      const rect = modal.getBoundingClientRect()
      const padding = 20 // Minimum padding from screen edges
      
      // Calculate boundaries - modal is centered initially, position offsets from center
      const maxX = window.innerWidth / 2 - rect.width / 2 - padding
      const maxY = window.innerHeight / 2 - rect.height / 2 - padding

      // Calculate new position relative to center
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      let newX = e.clientX - centerX - dragStart.x
      let newY = e.clientY - centerY - dragStart.y

      // Apply boundaries to keep modal on screen
      newX = Math.max(-maxX, Math.min(maxX, newX))
      newY = Math.max(-maxY, Math.min(maxY, newY))

      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    document.addEventListener("mousemove", handleMouseMove, { passive: false })
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, dragStart, position])

  // Reset position when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }, [isOpen])

  // Scroll content to top when step changes
  const scrollToTop = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Scroll to top when step changes
  useEffect(() => {
    scrollToTop()
  }, [currentStep, scrollToTop])

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email address"
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
      if (!formData.country.trim()) newErrors.country = "Country is required"
    }

    if (step === 2) {
      if (!formData.teamSize) newErrors.teamSize = "Team size is required"
      if (!formData.industry) newErrors.industry = "Industry is required"
      if (!formData.jobRole) newErrors.jobRole = "Job role is required"
    }

    if (step === 3) {
      if (formData.automationAreas.length === 0) {
        newErrors.automationAreas = "Please select at least one area" as any
      }
      if (!formData.timeline) newErrors.timeline = "Timeline is required"
    }

    if (step === 4) {
      if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required"
      if (!formData.timezone) newErrors.timezone = "Timezone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      // Scroll will happen via useEffect
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setErrors({})
    // Scroll will happen via useEffect
  }

  const handleSubmit = () => {
    if (validateStep(4)) {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData)
      setCurrentStep(5)
    }
  }

  const toggleAutomationArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      automationAreas: prev.automationAreas.includes(area)
        ? prev.automationAreas.filter((a) => a !== area)
        : [...prev.automationAreas, area],
    }))
  }

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 pointer-events-none overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: position.x,
                y: position.y
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: isDragging ? 0 : 0.3, ease: "easeOut" }}
              className="relative w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] sm:my-auto flex flex-col overflow-hidden sm:rounded-2xl bg-admas-dark/95 backdrop-blur-2xl border-0 sm:border border-white/10 shadow-2xl pointer-events-auto"
            >
              {/* Header - Draggable Area */}
              <div 
                onMouseDown={handleMouseDown}
                className={cn(
                  "relative border-b border-white/10 bg-gradient-to-r from-admas-purple-dark/50 to-admas-dark/50 p-4 sm:p-5 md:p-6 flex-shrink-0",
                  isDragging ? "cursor-grabbing" : "sm:cursor-grab"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-0.5 sm:mb-1 truncate">
                      {t('title')}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {t('step')} {currentStep} {t('of')} 5
                    </p>
                  </div>
                  <button
                    data-close-button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 sm:h-5 sm:w-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentStep / 5) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan"
                  />
                </div>
              </div>

              {/* Content - Scrollable Area */}
              <div 
                ref={contentRef}
                className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 md:p-6 lg:p-8 min-h-0 custom-scrollbar"
                style={{
                  maxHeight: 'calc(100vh - 140px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(127, 90, 255, 0.3) transparent'
                }}
              >
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
                          <Users className="h-5 w-5 text-admas-purple-light" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white">
                          Basic Information
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <Input
                            value={formData.fullName}
                            onChange={(e) => updateField("fullName", e.target.value)}
                            placeholder="John Doe"
                            className={errors.fullName ? "border-red-500/50" : ""}
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => updateField("email", e.target.value)}
                              placeholder="john@company.com"
                              className={errors.email ? "border-red-500/50" : ""}
                            />
                            {errors.email && (
                              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone Number <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => updateField("phone", e.target.value)}
                              placeholder="+1 (555) 000-0000"
                              className={errors.phone ? "border-red-500/50" : ""}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Company Name <span className="text-red-400">*</span>
                            </label>
                            <Input
                              value={formData.companyName}
                              onChange={(e) => updateField("companyName", e.target.value)}
                              placeholder="Acme Inc."
                              className={errors.companyName ? "border-red-500/50" : ""}
                            />
                            {errors.companyName && (
                              <p className="mt-1 text-xs text-red-400">{errors.companyName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Company Website
                            </label>
                            <Input
                              type="url"
                              value={formData.companyWebsite}
                              onChange={(e) => updateField("companyWebsite", e.target.value)}
                              placeholder="https://company.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country / Region <span className="text-red-400">*</span>
                          </label>
                          <Input
                            value={formData.country}
                            onChange={(e) => updateField("country", e.target.value)}
                            placeholder="United States"
                            className={errors.country ? "border-red-500/50" : ""}
                          />
                          {errors.country && (
                            <p className="mt-1 text-xs text-red-400">{errors.country}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
                          <Building2 className="h-5 w-5 text-admas-purple-light" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white">
                          Business Details
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Team Size <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={formData.teamSize}
                            onChange={(e) => updateField("teamSize", e.target.value)}
                            className={cn(
                              "flex h-11 w-full rounded-lg border bg-white/5 px-4 py-2 text-sm text-white",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light",
                              errors.teamSize ? "border-red-500/50" : "border-white/20"
                            )}
                          >
                            <option value="">Select team size</option>
                            {teamSizes.map((size) => (
                              <option key={size} value={size} className="bg-admas-dark">
                                {size}
                              </option>
                            ))}
                          </select>
                          {errors.teamSize && (
                            <p className="mt-1 text-xs text-red-400">{errors.teamSize}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Industry <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={formData.industry}
                              onChange={(e) => updateField("industry", e.target.value)}
                              className={cn(
                                "flex h-11 w-full rounded-lg border bg-white/5 px-4 py-2 text-sm text-white",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light",
                                errors.industry ? "border-red-500/50" : "border-white/20"
                              )}
                            >
                              <option value="">Select industry</option>
                              {industries.map((industry) => (
                                <option key={industry} value={industry} className="bg-admas-dark">
                                  {industry}
                                </option>
                              ))}
                            </select>
                            {errors.industry && (
                              <p className="mt-1 text-xs text-red-400">{errors.industry}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Job Role <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={formData.jobRole}
                              onChange={(e) => updateField("jobRole", e.target.value)}
                              className={cn(
                                "flex h-11 w-full rounded-lg border bg-white/5 px-4 py-2 text-sm text-white",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light",
                                errors.jobRole ? "border-red-500/50" : "border-white/20"
                              )}
                            >
                              <option value="">Select job role</option>
                              {jobRoles.map((role) => (
                                <option key={role} value={role} className="bg-admas-dark">
                                  {role}
                                </option>
                              ))}
                            </select>
                            {errors.jobRole && (
                              <p className="mt-1 text-xs text-red-400">{errors.jobRole}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
                          <Target className="h-5 w-5 text-admas-purple-light" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white">
                          Demo Purpose
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-3">
                            What are you looking to automate? <span className="text-red-400">*</span>
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {automationAreas.map((area) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => toggleAutomationArea(area)}
                                className={cn(
                                  "flex items-center gap-2 p-3 rounded-lg border text-left transition-all",
                                  formData.automationAreas.includes(area)
                                    ? "border-admas-purple-light bg-admas-purple-light/10 text-white"
                                    : "border-white/20 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-4 w-4 rounded border-2 flex items-center justify-center transition-all",
                                    formData.automationAreas.includes(area)
                                      ? "border-admas-purple-light bg-admas-purple-light"
                                      : "border-white/30"
                                  )}
                                >
                                  {formData.automationAreas.includes(area) && (
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm">{area}</span>
                              </button>
                            ))}
                          </div>
                          {errors.automationAreas && (
                            <p className="mt-2 text-xs text-red-400">{errors.automationAreas as string}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Describe your current challenges
                          </label>
                          <Textarea
                            value={formData.challenges}
                            onChange={(e) => updateField("challenges", e.target.value)}
                            placeholder="Tell us about the challenges you're facing..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            How soon are you planning to start? <span className="text-red-400">*</span>
                          </label>
                          <select
                            value={formData.timeline}
                            onChange={(e) => updateField("timeline", e.target.value)}
                            className={cn(
                              "flex h-11 w-full rounded-lg border bg-white/5 px-4 py-2 text-sm text-white",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light",
                              errors.timeline ? "border-red-500/50" : "border-white/20"
                            )}
                          >
                            <option value="">Select timeline</option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline} className="bg-admas-dark">
                                {timeline}
                              </option>
                            ))}
                          </select>
                          {errors.timeline && (
                            <p className="mt-1 text-xs text-red-400">{errors.timeline}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
                          <Calendar className="h-5 w-5 text-admas-purple-light" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-white">
                          Scheduling Preferences
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Preferred Demo Time <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="datetime-local"
                              value={formData.preferredTime}
                              onChange={(e) => updateField("preferredTime", e.target.value)}
                              className={errors.preferredTime ? "border-red-500/50" : ""}
                            />
                            {errors.preferredTime && (
                              <p className="mt-1 text-xs text-red-400">{errors.preferredTime}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Timezone <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={formData.timezone}
                              onChange={(e) => updateField("timezone", e.target.value)}
                              className={cn(
                                "flex h-11 w-full rounded-lg border bg-white/5 px-4 py-2 text-sm text-white",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light",
                                errors.timezone ? "border-red-500/50" : "border-white/20"
                              )}
                            >
                              <option value="">Select timezone</option>
                              {timezones.map((tz) => (
                                <option key={tz} value={tz} className="bg-admas-dark">
                                  {tz}
                                </option>
                              ))}
                            </select>
                            {errors.timezone && (
                              <p className="mt-1 text-xs text-red-400">{errors.timezone}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Additional notes for preparation
                          </label>
                          <Textarea
                            value={formData.notes}
                            onChange={(e) => updateField("notes", e.target.value)}
                            placeholder="Any specific topics or questions you'd like us to cover..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-admas-purple-light to-admas-blue">
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                      </motion.div>

                      <h3 className="text-2xl font-heading font-bold text-white mb-3">
                        Demo Request Submitted!
                      </h3>
                      <p className="text-gray-300 mb-6 max-w-md mx-auto">
                        Thank you for your interest. We'll review your request and send you a confirmation email shortly with scheduling details.
                      </p>

                      <div className="glass-card p-6 max-w-md mx-auto mb-6 text-left">
                        <h4 className="text-sm font-semibold text-white mb-3">Summary</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><span className="text-gray-400">Name:</span> {formData.fullName}</p>
                          <p><span className="text-gray-400">Company:</span> {formData.companyName}</p>
                          <p><span className="text-gray-400">Timeline:</span> {formData.timeline}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {currentStep < 5 && (
                <div className="border-t border-white/10 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-admas-dark/50 to-admas-purple-dark/30 flex-shrink-0">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
                    <Button
                      variant="outline"
                      onClick={currentStep === 1 ? handleClose : handlePrevious}
                      className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{currentStep === 1 ? "Cancel" : "Previous"}</span>
                      <span className="sm:hidden">{currentStep === 1 ? "Cancel" : "Prev"}</span>
                    </Button>

                    <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={cn(
                            "h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full transition-all",
                            step === currentStep
                              ? "bg-admas-purple-light w-6 sm:w-8"
                              : step < currentStep
                              ? "bg-admas-purple-light/50"
                              : "bg-white/20"
                          )}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={currentStep === 4 ? handleSubmit : handleNext}
                      className="btn-gradient text-xs sm:text-sm px-3 sm:px-4 md:px-6 py-1.5 sm:py-2"
                    >
                      {currentStep === 4 ? "Submit" : "Next"}
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="border-t border-white/10 p-6 bg-gradient-to-r from-admas-dark/50 to-admas-purple-dark/30">
                  <div className="flex justify-center">
                    <Button onClick={handleClose} className="btn-gradient">
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

