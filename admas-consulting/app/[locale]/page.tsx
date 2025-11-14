import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import { locales, type Locale } from '@/i18n'

// Dynamically import below-the-fold components for better initial load
const ServiceGrid = dynamic(() => import("@/components/ServiceGrid"), {
  loading: () => <div className="min-h-[400px]" />,
})

const HowItWorks = dynamic(() => import("@/components/HowItWorks"), {
  loading: () => <div className="min-h-[400px]" />,
})

const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  loading: () => <div className="min-h-[400px]" />,
})

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[200px]" />,
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ServiceGrid />
      <HowItWorks />
      <WhyChooseUs />
      {/* TODO: Replace this area with 'Super Powerful Animation' section later */}
      <Footer />
    </main>
  )
}

