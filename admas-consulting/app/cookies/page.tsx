import Footer from "@/components/Footer"
import Header from "@/components/Header"

export default function CookiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 items-center justify-center px-4">
        <div className="legal-page text-center text-lg text-gray-300 md:text-2xl">
          we are waiting from Prof. Sebhatleab
        </div>
      </section>
      <Footer />
    </main>
  )
}

