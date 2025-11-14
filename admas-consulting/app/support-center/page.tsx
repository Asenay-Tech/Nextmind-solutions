"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"

const categories = [
  {
    icon: "💬",
    title: "AI Agents & Automation",
    desc: "Guides for setup, fine-tuning, and integrating our AI systems with your business.",
    link: "/docs/ai-agents",
  },
  {
    icon: "💻",
    title: "IT Infrastructure",
    desc: "Learn about deployment, monitoring, and system health optimization.",
    link: "/docs/it-infrastructure",
  },
  {
    icon: "📦",
    title: "Billing & Subscriptions",
    desc: "Manage your plan, invoices, and account renewals securely.",
    link: "/docs/billing",
  },
  {
    icon: "👥",
    title: "Account & Security",
    desc: "Update user settings, manage permissions, and enable 2FA.",
    link: "/docs/account",
  },
  {
    icon: "🎓",
    title: "Business Training",
    desc: "Access online learning resources and certification programs.",
    link: "/docs/training",
  },
  {
    icon: "⚙️",
    title: "Developer API",
    desc: "Explore REST & WebSocket endpoints with authentication guides.",
    link: "/docs/api",
  },
] as const

const faqs = [
  {
    q: "How can I reset my account password?",
    a: "Go to Account → Security → Reset Password. You'll receive an email link.",
  },
  {
    q: "Where can I access training resources?",
    a: "Visit Business Training → Online Courses for our AI and IT learning materials.",
  },
  {
    q: "How do I contact technical support?",
    a: "Use the Contact Support button above or email support@admasits.com.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit cards, bank transfers, and PayPal. All transactions are secure and encrypted.",
  },
  {
    q: "Can I integrate AdmasITS solutions with my existing systems?",
    a: "Yes! Our AI agents and automation tools support REST APIs, webhooks, and common integrations. Check our Developer API documentation for details.",
  },
  {
    q: "How quickly can I get started with your services?",
    a: "Most implementations can begin within 24-48 hours. Contact our team for a custom timeline based on your needs.",
  },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export default function SupportCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-admas-dark via-admas-purple-dark to-admas-purple opacity-50" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          animate={{
            backgroundPosition: ["0% 0%", "22% 8%", "0% 0%"],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(96,165,250,0.08) 0%, rgba(138,99,241,0.18) 35%, transparent 70%), linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
            backgroundSize: "cover, 60px 60px, 60px 60px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6">
              Support Center
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Find quick answers, explore documentation, or reach our support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/docs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="btn-gradient">
                    Documentation
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-admas-purple-light text-admas-purple-light hover:bg-admas-purple-light/10 transition-all"
                  >
                    Contact Support
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.section>
        </div>
      </section>

      {/* Help Categories Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Help Categories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Browse our support resources by topic
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="glass-card p-6 text-center group"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-white mb-3">{cat.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">{cat.desc}</p>
                <Link
                  href={cat.link}
                  className="inline-flex items-center text-admas-cyan hover:text-admas-purple-light transition-colors font-medium group-hover:underline"
                >
                  View Details
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-heading font-semibold text-white pr-4">
                    {faq.q}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Still need help? Our experts are available 24/7.
            </h2>
            <Link href="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="btn-gradient mt-4">
                  Chat with Support
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

