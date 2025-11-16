// Root layout - with next-intl, html/body tags are in app/[locale]/layout.tsx
// This file should only exist to satisfy Next.js requirements
// All actual layout logic is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
