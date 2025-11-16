import { redirect } from "next/navigation"

// Redirect legacy non-localized route to English localized route to ensure clean build
export default function AboutRedirectPage() {
  redirect("/en/about")
}
