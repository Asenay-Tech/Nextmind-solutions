"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown"
import { countries } from "@/lib/data/countries"
import { cn } from "@/lib/utils"

interface TrainingRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  fullName: string
  email: string
  phone: string
  organization: string
  jobTitle: string
  country: string
  message: string
  modulesSelected: string[]
}

interface FormErrors {
  fullName?: string
  email?: string
  modulesSelected?: string
}

const TRAINING_MODULE_OPTIONS = [
  { value: "1", label: "Training No. 1: Basic Business Management Methods" },
  { value: "2", label: "Training No. 2: Overview of Specific Management Areas" },
  { value: "3", label: "Training No. 3: Basics of Internal Management Accounting" },
  { value: "4", label: "Training No. 4: Basics of Internal Control & Internal Auditing" },
  { value: "5", label: "Training No. 5: Internal Control over Cash, Receivables and Inventories" },
  { value: "6", label: "Training No. 6: Project Cycle Management" },
  { value: "7", label: "Training No. 7: Procurement and Property Management" },
  { value: "8", label: "Training No. 8: Marketing Management" },
  { value: "9", label: "Training No. 9: Human Resource Management" },
  { value: "10", label: "Training No. 10: Financial Reports and Interpretation" },
  { value: "11", label: "Training No. 11: Strategic Management" },
  { value: "12", label: "Training No. 12: Internal Regulations (Bylaws)" },
  { value: "13", label: "Training No. 13: Basic Meeting Procedures" },
]

export default function TrainingRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: TrainingRequestModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    jobTitle: "",
    country: "",
    message: "",
    modulesSelected: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      // Reset form when closing
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        jobTitle: "",
        country: "",
        message: "",
        modulesSelected: [],
      })
      setErrors({})
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.modulesSelected.length === 0) {
      newErrors.modulesSelected = "Please select at least one training module"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Prepare submission data
    const submissionData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      organization: formData.organization.trim() || undefined,
      jobTitle: formData.jobTitle.trim() || undefined,
      country: formData.country || undefined,
      modulesSelected: formData.modulesSelected.map((id) => {
        const option = TRAINING_MODULE_OPTIONS.find((opt) => opt.value === id)
        return option?.label || id
      }),
      message: formData.message.trim() || undefined,
    }

    // Console log the data
    console.log("Training Request Submission:", JSON.stringify(submissionData, null, 2))

    setIsSubmitting(false)
    onClose()

    // Show success toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      if (onSuccess) {
        onSuccess()
      }
    }, 3000)
  }

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (typeof window === "undefined") {
    return null
  }

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-0 sm:p-2 md:p-4 pointer-events-none overflow-y-auto">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full sm:h-auto sm:max-h-[calc(100vh-2rem)] md:max-h-[90vh] sm:max-w-3xl overflow-hidden sm:rounded-2xl bg-gradient-to-br from-[#0b1020] to-[#1a1f3c] border-0 sm:border border-white/10 shadow-2xl pointer-events-auto flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-white/10 bg-gradient-to-r from-admas-purple-dark/30 to-admas-dark/30 backdrop-blur-xl p-4 sm:p-5 md:p-6 flex-shrink-0">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-0.5 sm:mb-1">
                        Request Training Information
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Select your training modules and provide your contact information.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full border border-white/10 bg-white/10 p-1.5 sm:p-2 text-white/80 transition hover:border-white/30 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 flex-shrink-0"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain max-h-[calc(100vh-140px)] sm:max-h-[calc(90vh-180px)] p-4 sm:p-5 md:p-6 custom-scrollbar min-h-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Training Modules Selection */}
                    <div>
                      <Label htmlFor="modules" className="text-white mb-2 block">
                        Training Modules <span className="text-red-400">*</span>
                      </Label>
                      <MultiSelectDropdown
                        options={TRAINING_MODULE_OPTIONS}
                        selected={formData.modulesSelected}
                        onChange={(selected) => handleChange("modulesSelected", selected)}
                        placeholder="Select one or more training modules..."
                        error={errors.modulesSelected}
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-white mb-2 block">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        className={cn(errors.fullName && "border-red-500/50")}
                      />
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-white mb-2 block">
                        Email Address <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        className={cn(errors.email && "border-red-500/50")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-white mb-2 block">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Organization */}
                    <div>
                      <Label htmlFor="organization" className="text-white mb-2 block">
                        Organization / Company
                      </Label>
                      <Input
                        id="organization"
                        type="text"
                        value={formData.organization}
                        onChange={(e) => handleChange("organization", e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>

                    {/* Job Title */}
                    <div>
                      <Label htmlFor="jobTitle" className="text-white mb-2 block">
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleChange("jobTitle", e.target.value)}
                        placeholder="Your job title"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country" className="text-white mb-2 block">
                        Country
                      </Label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-admas-dark disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                          <option key={country} value={country} className="bg-admas-dark">
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-white mb-2 block">
                        Message / Additional Details
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell us more about your training needs..."
                        rows={4}
                      />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 btn-gradient"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="sm:w-auto border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[300] px-6 py-4 rounded-lg bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <p className="text-white text-sm font-medium">
              Your training request has been received. We'll contact you shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  )
}

