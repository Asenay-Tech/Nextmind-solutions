"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Send,
  Users,
  Zap,
} from "lucide-react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const supportOptions = [
  {
    icon: BookOpen,
    title: "Documentation Hub",
    description: "Learn, build, and troubleshoot with our step-by-step guides and best practices.",
    color: "from-admas-purple-light to-admas-blue",
  },
  {
    icon: Users,
    title: "Community & Collaboration",
    description: "Connect with other builders, share solutions, and join discussions.",
    color: "from-admas-blue to-admas-cyan",
  },
  {
    icon: Zap,
    title: "Dedicated Support",
    description: "Get direct assistance for technical, billing, and enterprise issues.",
    color: "from-admas-purple-light to-admas-cyan",
  },
]

const requestTypes = [
  "Technical Issue",
  "Billing / Invoice",
  "Account Access",
  "Integration Support",
  "Feature Request",
  "Partnership Inquiry",
  "Security / Compliance",
  "Other",
]

const priorityLevels = ["Low", "Medium", "High"]

const floatingElements = [
  { size: "w-16 h-16", style: { top: "15%", left: "8%" } },
  { size: "w-12 h-12", style: { top: "25%", right: "10%" } },
  { size: "w-14 h-14", style: { bottom: "20%", left: "15%" } },
  { size: "w-20 h-20", style: { bottom: "25%", right: "18%" } },
]

export default function SupportPageClient() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    requestType: "",
    priority: "Medium",
    message: "",
    file: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({
      fullName: "",
      email: "",
      company: "",
      requestType: "",
      priority: "Medium",
      message: "",
      file: null,
    })

    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-admas-dark via-admas-purple-dark to-admas-purple py-24 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingElements.map((element, index) => (
            <motion.div
              key={index}
              className={`absolute ${element.size} rounded-full bg-gradient-to-br from-admas-purple-light/20 via-admas-blue/15 to-admas-cyan/20 blur-3xl`}
              style={element.style}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 6 + index * 0.5,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-5xl font-heading font-bold text-white md:text-6xl lg:text-7xl"
            >
              How can we help you today?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl"
            >
              Our team is here to guide you through onboarding, technical questions,
              integrations, and enterprise support. Tell us what you need, and we'll take it
              from there.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Support Options Section */}
      <section className="relative bg-admas-dark py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-heading font-bold text-white md:text-4xl">
              Choose Your Support Path
            </h2>
            <p className="mx-auto max-w-2xl text-gray-400">
              Multiple ways to get the help you need, when you need it
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${option.color} shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-heading font-bold text-white">
                      {option.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{option.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Support Request Form Section */}
      <section className="relative bg-gradient-to-b from-admas-dark to-admas-purple-dark py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-heading font-bold text-white md:text-4xl">
                Submit a Support Request
              </h2>
              <p className="text-gray-400">
                Fill out the form below and our team will get back to you promptly
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10 md:p-10"
            >
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
                  <h3 className="mb-2 text-2xl font-heading font-bold text-white">
                    Request Submitted Successfully
                  </h3>
                  <p className="text-gray-400">
                    We've received your request and will respond within 24-48 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName" className="mb-2 block text-white">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2 block text-white">
                        Email Address <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="mb-2 block text-white">
                      Company / Organization
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="requestType" className="mb-2 block text-white">
                        Type of Request <span className="text-red-400">*</span>
                      </Label>
                      <select
                        id="requestType"
                        name="requestType"
                        required
                        value={formData.requestType}
                        onChange={handleInputChange}
                        className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-admas-dark"
                      >
                        <option value="" className="bg-admas-dark">
                          Select request type
                        </option>
                        {requestTypes.map((type) => (
                          <option key={type} value={type} className="bg-admas-dark">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="priority" className="mb-2 block text-white">
                        Priority <span className="text-red-400">*</span>
                      </Label>
                      <select
                        id="priority"
                        name="priority"
                        required
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="flex h-11 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admas-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-admas-dark"
                      >
                        {priorityLevels.map((level) => (
                          <option key={level} value={level} className="bg-admas-dark">
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block text-white">
                      Message / Description <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide details about your request..."
                      className="resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="file" className="mb-2 block text-white">
                      Attach File (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        className="cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white file:hover:bg-white/20"
                      />
                      {formData.file && (
                        <p className="mt-2 text-sm text-gray-400">
                          Selected: {formData.file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-gradient-to-r from-admas-purple-light via-admas-blue to-admas-cyan text-white shadow-lg shadow-admas-purple-light/30 hover:shadow-xl hover:shadow-admas-purple-light/40 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: [0, 0, 1, 1] }}
                            className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Request
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SLA & System Status Section */}
      <section className="relative bg-admas-dark py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-xl bg-white/5 p-6 backdrop-blur-xl border border-white/10"
              >
                <h3 className="mb-4 flex items-center text-xl font-heading font-bold text-white">
                  <FileText className="mr-2 h-5 w-5 text-admas-purple-light" />
                  Response Times
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2 text-admas-cyan">•</span>
                    <span>
                      <strong className="text-white">Standard:</strong> 24–48 hours
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-admas-cyan">•</span>
                    <span>
                      <strong className="text-white">Priority:</strong> 4–12 hours
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-admas-cyan">•</span>
                    <span>
                      <strong className="text-white">Enterprise SLA:</strong> Custom terms
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-xl bg-white/5 p-6 backdrop-blur-xl border border-white/10"
              >
                <h3 className="mb-4 flex items-center text-xl font-heading font-bold text-white">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />
                  System Status
                </h3>
                <div className="mb-4 flex items-center">
                  <div className="mr-3 h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
                  <span className="text-lg font-semibold text-white">
                    All systems operational
                  </span>
                </div>
                <a
                  href="#"
                  className="text-sm text-admas-purple-light hover:text-admas-cyan transition-colors"
                >
                  View status page →
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

