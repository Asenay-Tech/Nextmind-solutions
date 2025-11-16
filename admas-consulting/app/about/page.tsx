"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"

const founders = [
  {
    id: 1,
    name: "Prof. Dr. Sebhatleab Tewolde",
    title: "Secretary & Co-Founder · Head of Business Training",
    location: "Frankfurt, Germany",
    image: "/images/sebhataleb.png",
    description:
      "Prof. Dr. Sebhatleab provides leadership for ATCIT's training programs and supports the company's academic partnerships. His work focuses on practical business education and organizational development.",
    expertise: [
      "Management & Leadership",
      "Corporate Governance",
      "Training Development",
    ],
  },
  {
    id: 2,
    name: "Mr. Tesfai Tewolde",
    title: "Chairman & Co-Founder",
    location: "Frankfurt, Germany",
    image: "/images/tesfai.png",
    description:
      "Mr. Tesfai oversees strategic direction, partnerships, and business growth. He ensures strong client relationships and guides the company's expansion across regions.",
    expertise: [
      "Strategy & Business Operations",
      "Partnership Development",
      "Market Positioning",
    ],
  },
  {
    id: 3,
    name: "Mr. Hiruy Yohannes",
    title: "IT Operations Lead & Co-Founder",
    location: "Juba, South Sudan",
    image: "/images/hiruy.png",
    description:
      "Hiruy manages technology operations and IT infrastructure across the organization. He ensures systems reliability, data security, and regional tech support.",
    expertise: [
      "IT Operations",
      "Systems Integration",
      "Cloud Infrastructure",
    ],
  },
  {
    id: 4,
    name: "Mr. Henok Asenay",
    title: "Innovation & Technology Lead · Co-Founder",
    location: "Marburg, Germany",
    image: "/images/henok.png",
    description:
      "Henok leads innovation and digital solutions development. He focuses on building AI-driven tools and modernizing business processes through technology.",
    expertise: [
      "AI & Intelligent Systems",
      "Digital Transformation",
      "Product Development",
    ],
  },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // cubic-bezier equivalent to easeOut (type-safe)
    },
  },
}

export default function AboutPage() {
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
          transition={{ duration: 16, repeat: Infinity, ease: [0, 0, 1, 1] }}
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(96,165,250,0.08) 0%, rgba(138,99,241,0.18) 35%, transparent 70%), linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
            backgroundSize: "cover, 60px 60px, 60px 60px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Empowering Businesses Through{" "}
              <span className="gradient-text">Intelligence, Innovation, and Training.</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed"
            >
              Admas delivers cutting-edge solutions in business consulting, AI-driven systems, and
              professional training. We bridge technology and strategy to help organizations operate
              smarter, faster, and more efficiently.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Founding Team Section */}
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
              Founding Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Admas Training, Consulting & IT-Solutions (ATCIT)
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {founders.map((founder) => (
              <motion.div
                key={founder.id}
                variants={itemVariants}
                className="glass-card p-8 group"
              >
                <div className="flex flex-col items-center md:items-start mb-6">
                  {/* Circular Image with Glow */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-admas-purple-light via-admas-blue to-admas-cyan blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 group-hover:border-white/40 transition-all shadow-[0_0_30px_rgba(138,99,241,0.4)] bg-gradient-to-br from-admas-purple-light/20 to-admas-blue/20">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = "flex"
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white/40 text-4xl font-bold z-0 hidden">
                        {founder.name.charAt(0)}
                      </div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <h3 className="text-2xl font-heading font-bold text-white mb-2 text-center md:text-left">
                    {founder.name}
                  </h3>
                  <p className="text-sm text-admas-cyan mb-3 text-center md:text-left font-medium">
                    {founder.title}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-400 mb-4 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-admas-purple-light" />
                    <span>{founder.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-6">{founder.description}</p>

                {/* Core Expertise */}
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
                    Core Expertise:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 group-hover:bg-white/15 group-hover:border-white/30 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA Section */}
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
              We&apos;re shaping intelligent systems for a smarter future.
            </h2>
            <Link href="/business-management">
              <Button size="lg" className="btn-gradient mt-4">
                Explore Business Training
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
