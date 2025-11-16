"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Award, GraduationCap, TrendingUp, Users } from "lucide-react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import TrainingCard from "@/components/TrainingCard"
import TrainingOverlay from "@/components/TrainingOverlay"
import TrainingRequestModal from "@/components/training/TrainingRequestModal"
import EnrollmentForm from "@/components/enrollment/EnrollmentForm"
import BusinessTrainingHeroAnimation from "@/components/animations/BusinessTrainingHeroAnimation"
import { useTrainingRequestModal } from "@/hooks/useTrainingRequestModal"
import type { TrainingModule } from "@/lib/trainingData"
import { trainingModules } from "@/lib/trainingData"

const benefits = [
  {
    icon: GraduationCap,
    title: "Expert Training Department",
    description: "Developed and delivered by a dedicated training department of academic professionals, industry experts, and senior consultants.",
  },
  {
    icon: Users,
    title: "Practical, Real-World Application",
    description: "Includes real case studies, hands-on exercises, and applied managerial techniques you can use immediately.",
  },
  {
    icon: Award,
    title: "Globally Recognized Certification",
    description: "Receive an official certificate from Admas — ideal for professional portfolios and career growth.",
  },
  {
    icon: TrendingUp,
    title: "Career-Driven Skill Development",
    description: "Gain high-impact managerial, financial, and leadership skills that support promotions and organizational success.",
  },
] as const

export default function BusinessManagementPage() {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null)
  const [shouldExpandForm, setShouldExpandForm] = useState(false)
  const enrollmentFormRef = useRef<HTMLDivElement>(null)
  const isOverlayOpen = Boolean(selectedModule)
  const {
    isOpen: isRequestModalOpen,
    openModal: openRequestModal,
    closeModal: closeRequestModal,
    handleSuccess: handleRequestSuccess,
  } = useTrainingRequestModal()

  const handleClose = () => {
    setSelectedModule(null)
  }

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Update URL hash for direct navigation
    window.history.pushState(null, "", "#enrollment-form")
    // Scroll to enrollment form with better positioning
    enrollmentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    // Expand the form immediately
    setShouldExpandForm(true)
  }

  useEffect(() => {
    document.body.style.overflow = isOverlayOpen ? "hidden" : ""
  }, [isOverlayOpen])

  // Handle direct hash navigation (e.g., when URL contains #enrollment-form)
  useEffect(() => {
    if (window.location.hash === "#enrollment-form") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        enrollmentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        setShouldExpandForm(true)
      }, 100)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <BusinessTrainingHeroAnimation />
        <div className="absolute inset-0 bg-gradient-to-br from-admas-dark via-admas-purple-dark to-admas-purple opacity-50 z-[1]" />

        <div className="container mx-auto px-4 relative z-[2]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Business Management <span className="gradient-text">Training Programs</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8">
              Empowering decision-makers with the science of management and finance through comprehensive
              training programs.
            </p>

            <a href="#enrollment-form" onClick={handleEnrollClick} className="inline-block">
              <Button size="lg" className="btn-gradient">
                Enroll Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-bold text-white mb-8 sm:mb-10 md:mb-12 text-center">
            Why Choose Our Training
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="group relative rounded-lg sm:rounded-xl border border-white/15 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 sm:p-6 md:p-7 text-center backdrop-blur-xl transition-all duration-300 hover:border-admas-purple-light/60 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:shadow-[0_12px_40px_rgba(127,90,255,0.25)] hover:-translate-y-2"
                >
                  {/* Enhanced glow effect on hover */}
                  <div className="absolute -inset-[1px] rounded-lg sm:rounded-xl bg-gradient-to-br from-admas-purple-light/0 via-admas-blue/0 to-admas-cyan/0 opacity-0 transition-opacity duration-300 group-hover:opacity-40 blur-xl -z-10" />
                  
                  {/* Icon container with consistent alignment and improved styling */}
                  <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-admas-purple-light to-admas-blue flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 shadow-[0_4px_20px_rgba(127,90,255,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_32px_rgba(127,90,255,0.55)] group-hover:rotate-3">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  
                  {/* Content with improved spacing */}
                  <div className="relative z-10">
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white mb-2 sm:mb-3 leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                      {benefit.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-bold text-white mb-3 sm:mb-4 px-2">
              Training Modules
            </h2>
            <p className="text-sm sm:text-base text-gray-400 px-2">
              Comprehensive curriculum covering {trainingModules.length} essential business management topics
            </p>
          </div>

          <div className="training-grid grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 overflow-visible sm:grid-cols-2 xl:grid-cols-3">
            {trainingModules.map((module) => (
              <TrainingCard
                key={module.id}
                module={module}
                onOpen={setSelectedModule}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-14 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-heading font-bold text-white mb-3 sm:mb-4">
              Ready to Invest in Your Future?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
              Join hundreds of professionals who have transformed their careers through our training
              programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="btn-gradient text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4" onClick={openRequestModal}>
                Request Training Information
              </Button>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Explore Other Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div ref={enrollmentFormRef} id="enrollment-form" className="scroll-mt-24">
        <EnrollmentForm shouldExpand={shouldExpandForm} onExpanded={() => setShouldExpandForm(false)} />
      </div>

      <Footer />
      <TrainingOverlay open={isOverlayOpen} module={selectedModule} onClose={handleClose} />
      <TrainingRequestModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        onSuccess={handleRequestSuccess}
      />
    </main>
  )
}

