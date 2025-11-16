import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import SupportPageClient from "./SupportPageClient"

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'support.hero' })
  
  return {
    title: t('title') || 'Support Center | Admas',
    description: t('subtitle') || 'Get help with onboarding, technical questions, integrations, and enterprise support. Our team is here to guide you.',
  }
}

export default function SupportPage() {
  return <SupportPageClient />
}

