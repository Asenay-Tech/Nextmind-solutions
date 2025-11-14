import Footer from "@/components/Footer"
import Header from "@/components/Header"
import WaitingMessage from "@/components/WaitingMessage"

export default function ApiPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <WaitingMessage />
      <Footer />
    </main>
  )
}


