"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown"
import { trainingModules } from "@/lib/trainingData"
import { cn } from "@/lib/utils"

interface EnrollmentFormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  country: string
  city: string
  // Company / Organization
  companyName: string
  jobTitle: string
  industry: string
  numberOfEmployees: string
  // Course Selection
  selectedCourses: string[]
  // Enrollment Preferences
  preferredStartDate: string
  preferredSchedule: string
  // Additional Notes
  additionalNotes: string
  // Consent
  consentAccurate: boolean
  consentContact: boolean
}

interface FormErrors {
  fullName?: string
  email?: string
  selectedCourses?: string
  consentAccurate?: string
  consentContact?: string
}

const TRAINING_MODULE_OPTIONS = trainingModules.map((module) => ({
  value: module.id.toString(),
  label: module.title,
}))

const SCHEDULE_OPTIONS = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "evening", label: "Evening" },
]

interface EnrollmentFormProps {
  shouldExpand?: boolean
  onExpanded?: () => void
}

export default function EnrollmentForm({ shouldExpand = false, onExpanded }: EnrollmentFormProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<EnrollmentFormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    companyName: "",
    jobTitle: "",
    industry: "",
    numberOfEmployees: "",
    selectedCourses: [],
    preferredStartDate: "",
    preferredSchedule: "",
    additionalNotes: "",
    consentAccurate: false,
    consentContact: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Handle external expansion trigger
  useEffect(() => {
    if (shouldExpand && !isExpanded) {
      setIsExpanded(true)
      if (onExpanded) {
        onExpanded()
      }
    }
  }, [shouldExpand, isExpanded, onExpanded])

  const handleChange = (field: keyof EnrollmentFormData, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

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

    if (formData.selectedCourses.length === 0) {
      newErrors.selectedCourses = "Please select at least one course"
    }

    if (!formData.consentAccurate) {
      newErrors.consentAccurate = "Please confirm the information is accurate"
    }

    if (!formData.consentContact) {
      newErrors.consentContact = "Please agree to be contacted"
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
      personalInformation: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        country: formData.country.trim() || undefined,
        city: formData.city.trim() || undefined,
      },
      company: {
        companyName: formData.companyName.trim() || undefined,
        jobTitle: formData.jobTitle.trim() || undefined,
        industry: formData.industry.trim() || undefined,
        numberOfEmployees: formData.numberOfEmployees || undefined,
      },
      courseSelection: formData.selectedCourses.map((id) => {
        const module = trainingModules.find((m) => m.id.toString() === id)
        return module?.title || id
      }),
      enrollmentPreferences: {
        preferredStartDate: formData.preferredStartDate || undefined,
        preferredSchedule: formData.preferredSchedule || undefined,
      },
      additionalNotes: formData.additionalNotes.trim() || undefined,
      consent: {
        consentAccurate: formData.consentAccurate,
        consentContact: formData.consentContact,
      },
    }

    // Console log the data
    console.log("Enrollment submission:", submissionData)

    setIsSubmitting(false)

    // Show success toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      companyName: "",
      jobTitle: "",
      industry: "",
      numberOfEmployees: "",
      selectedCourses: [],
      preferredStartDate: "",
      preferredSchedule: "",
      additionalNotes: "",
      consentAccurate: false,
      consentContact: false,
    })
  }

  const selectedCoursesSummary = formData.selectedCourses
    .map((id) => {
      const module = trainingModules.find((m) => m.id.toString() === id)
      return module?.title
    })
    .filter(Boolean)

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-card p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl">
            {/* Header Section - Always Visible */}
            <div className={cn("mb-6 sm:mb-8", !isExpanded && "mb-0")}>
              <div className="flex items-start justify-between gap-3 sm:gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-heading font-bold text-white mb-2 sm:mb-3">
                    Enrollment Form
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    {isExpanded
                      ? "Complete the form below to enroll in our Business Management Training Programs"
                      : "Start your enrollment process by clicking the button below"}
                  </p>
                </div>
                {isExpanded && (
                  <Button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0"
                  >
                    <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Collapse Form</span>
                    <span className="sm:hidden">Collapse</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Collapsed State - Call to Action */}
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-center py-8"
              >
                <Button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  size="lg"
                  className="btn-gradient flex items-center gap-2 mx-auto"
                >
                  <ChevronDown className="h-5 w-5" />
                  Start Enrollment Process
                </Button>
              </motion.div>
            )}

            {/* Form Content - Collapsible */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-white border-b border-white/10 pb-2 mb-4 sm:mb-5">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
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

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Email <span className="text-red-400">*</span>
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

                  <div>
                    <Label htmlFor="phone" className="text-white mb-2 block">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-white mb-2 block">
                      Country
                    </Label>
                    <Input
                      id="country"
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Your country"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="city" className="text-white mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Your city"
                    />
                  </div>
                </div>
              </div>

              {/* Company / Organization Section */}
              <div className="space-y-6">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-white border-b border-white/10 pb-2 mb-4 sm:mb-5">
                  Company / Organization <span className="text-xs sm:text-sm font-normal text-gray-400">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div>
                    <Label htmlFor="companyName" className="text-white mb-2 block">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

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

                  <div>
                    <Label htmlFor="industry" className="text-white mb-2 block">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleChange("industry", e.target.value)}
                      placeholder="Your industry"
                    />
                  </div>

                  <div>
                    <Label htmlFor="numberOfEmployees" className="text-white mb-2 block">
                      Number of Employees
                    </Label>
                    <Input
                      id="numberOfEmployees"
                      type="number"
                      value={formData.numberOfEmployees}
                      onChange={(e) => handleChange("numberOfEmployees", e.target.value)}
                      placeholder="e.g., 50"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Course Selection Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">
                  Course Selection <span className="text-red-400">*</span>
                </h3>
                <div>
                  <Label htmlFor="courses" className="text-white mb-2 block">
                    Select Training Modules
                  </Label>
                  <MultiSelectDropdown
                    options={TRAINING_MODULE_OPTIONS}
                    selected={formData.selectedCourses}
                    onChange={(selected) => handleChange("selectedCourses", selected)}
                    placeholder="Select one or more training modules..."
                    error={errors.selectedCourses}
                  />
                  {errors.selectedCourses && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.selectedCourses}</p>
                  )}
                </div>

                {/* Selected Courses Summary */}
                {selectedCoursesSummary.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-lg border border-admas-purple-light/30 bg-admas-purple-light/10 p-4"
                  >
                    <h4 className="text-sm font-semibold text-white mb-3">Selected Courses Summary</h4>
                    <ul className="space-y-2">
                      {selectedCoursesSummary.map((title, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-admas-purple-light mt-0.5 flex-shrink-0" />
                          <span>{title}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Enrollment Preferences Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">
                  Enrollment Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="preferredStartDate" className="text-white mb-2 block">
                      Preferred Start Date
                    </Label>
                    <Input
                      id="preferredStartDate"
                      type="date"
                      value={formData.preferredStartDate}
                      onChange={(e) => handleChange("preferredStartDate", e.target.value)}
                      className="[color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredSchedule" className="text-white mb-2 block">
                      Preferred Schedule
                    </Label>
                    <select
                      id="preferredSchedule"
                      value={formData.preferredSchedule}
                      onChange={(e) => handleChange("preferredSchedule", e.target.value)}
                      className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-admas-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select schedule</option>
                      {SCHEDULE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-admas-dark">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-semibold text-white border-b border-white/10 pb-2">
                  Additional Notes
                </h3>
                <div>
                  <Label htmlFor="additionalNotes" className="text-white mb-2 block">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange("additionalNotes", e.target.value)}
                    placeholder="Tell us anything else you'd like us to know..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Consent Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consentAccurate"
                      checked={formData.consentAccurate}
                      onChange={(e) => handleChange("consentAccurate", e.target.checked)}
                      className={cn(
                        "mt-1 h-4 w-4 rounded border border-white/20 bg-white/5 text-admas-purple-light",
                        "focus:ring-2 focus:ring-admas-purple-light focus:ring-offset-2 focus:ring-offset-admas-dark",
                        "checked:bg-admas-purple-light checked:border-admas-purple-light",
                        "transition-colors cursor-pointer",
                        errors.consentAccurate && "border-red-500/50",
                      )}
                    />
                    <Label htmlFor="consentAccurate" className="text-white cursor-pointer flex-1">
                      I confirm that the provided information is accurate.{" "}
                      <span className="text-red-400">*</span>
                    </Label>
                  </div>
                  {errors.consentAccurate && (
                    <p className="ml-7 text-xs text-red-400">{errors.consentAccurate}</p>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consentContact"
                      checked={formData.consentContact}
                      onChange={(e) => handleChange("consentContact", e.target.checked)}
                      className={cn(
                        "mt-1 h-4 w-4 rounded border border-white/20 bg-white/5 text-admas-purple-light",
                        "focus:ring-2 focus:ring-admas-purple-light focus:ring-offset-2 focus:ring-offset-admas-dark",
                        "checked:bg-admas-purple-light checked:border-admas-purple-light",
                        "transition-colors cursor-pointer",
                        errors.consentContact && "border-red-500/50",
                      )}
                    />
                    <Label htmlFor="consentContact" className="text-white cursor-pointer flex-1">
                      I agree to be contacted by Admas. <span className="text-red-400">*</span>
                    </Label>
                  </div>
                  {errors.consentContact && (
                    <p className="ml-7 text-xs text-red-400">{errors.consentContact}</p>
                  )}
                </div>
              </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full btn-gradient"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Request Enrollment"
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg bg-admas-dark/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
          >
            <p className="text-white text-sm font-medium">
              Enrollment request submitted successfully.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

