"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { useTranslations } from "next-intl"

type Props = {
  params: Promise<{ locale: string }>
}

export default function CookiesPage() {
  const t = useTranslations("legal")
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 items-center justify-center px-4">
        <div className="legal-page text-center text-lg text-gray-300 md:text-2xl">
          {t("placeholder")}
        </div>
      </section>
      <Footer />
    </main>
  )
}

