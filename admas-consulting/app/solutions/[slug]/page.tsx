import { notFound } from "next/navigation"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import WaitingMessage from "@/components/WaitingMessage"
import { servicesData } from "@/lib/data/services"

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = servicesData.find((entry) => entry.slug === params.slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: `${service.title} | AdmasITS`,
    description: service.description,
    openGraph: {
      title: `${service.title} | AdmasITS`,
      description: service.description,
      siteName: "AdmasITS",
    },
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData.find((entry) => entry.slug === params.slug)

  if (!service) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <WaitingMessage />
      <Footer />
    </main>
  )
}

