import { notFound } from "next/navigation"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import WaitingMessage from "@/components/WaitingMessage"
import { trainingModules } from "@/lib/trainingData"

interface TrainingDetailPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return trainingModules.map((module) => ({
    slug: module.slug,
  }))
}

export default function TrainingDetailPage({ params }: TrainingDetailPageProps) {
  const module = trainingModules.find((item) => item.slug === params.slug)

  if (!module) {
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

