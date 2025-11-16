import dynamic from "next/dynamic"
import Header from "@/components/Header"
import Hero from "@/components/Hero"

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

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }]
}

export default function HomePage({ params }: Props) {
  // Force rebuild - cache buster
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ServiceGrid />
      <HowItWorks />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}

