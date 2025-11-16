"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { useTranslations } from "next-intl"

type Props = {
  params: Promise<{ locale: string }>
}

export default function BlogPage() {
  const t = useTranslations("nav")
  const tFooter = useTranslations("footer.social")
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4">
            {t("blog")}
          </h1>
          <p className="text-lg text-gray-300 md:text-2xl">
            {tFooter("comingSoon")}
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}

