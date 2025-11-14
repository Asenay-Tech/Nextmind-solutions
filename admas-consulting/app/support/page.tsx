import type { Metadata } from "next"
import SupportPageClient from "./SupportPageClient"

export const metadata: Metadata = {
  title: "Support Center | AdmasITS",
  description:
    "Get help with onboarding, technical questions, integrations, and enterprise support. Our team is here to guide you.",
}

export default function SupportPage() {
  return <SupportPageClient />
}
