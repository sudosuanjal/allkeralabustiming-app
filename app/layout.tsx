import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: {
    default: "allkeralabustimings",
    template: "%s | allkeralabustimings",
  },
  description: "Kerala bus stand timings from community-maintained Markdown files. No backend, just static data.",
  applicationName: "allkeralabustimings",
  generator: "v0.app",
  keywords: ["Kerala", "bus timings", "KSRTC", "public transport", "Markdown"],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "allkeralabustimings",
    description: "Kerala bus stand timings from community-maintained Markdown files. No backend, just static data.",
    siteName: "allkeralabustimings",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "allkeralabustimings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
    title: "allkeralabustimings",
    description: "Kerala bus stand timings from community-maintained Markdown files.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "allkeralabustimings",
    url: siteUrl,
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    description: "Kerala bus stand timings from community-maintained Markdown files.",
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <head>
        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-dvh bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="animate-in fade-in-0 duration-300 motion-reduce:animate-none">
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
