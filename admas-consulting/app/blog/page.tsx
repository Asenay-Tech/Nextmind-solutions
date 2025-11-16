import Footer from "@/components/Footer"
import Header from "@/components/Header"

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-300 md:text-2xl">
            we are waiting from Prof. Sebhatleab
          </p>
        </div>
      </section>
      <Footer />
    </main>
  )
}

