import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "EVENTOR - Calendario Futurista",
  description: "Tu calendario futurista con efectos neon y diseño de vanguardia. Organiza tus eventos con estilo.",
  generator: "v0.app",
  keywords: [
    "EVENTOR",
    "calendario",
    "eventos",
    "futurista",
    "neon",
    "diseño",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
  ],
  authors: [{ name: "EVENTOR Team" }],
  openGraph: {
    title: "EVENTOR - Calendario Futurista",
    description: "Tu calendario futurista con efectos neon y diseño de vanguardia",
    siteName: "EVENTOR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EVENTOR - Calendario Futurista",
    description: "Tu calendario futurista con efectos neon y diseño de vanguardia",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <Suspense fallback={null}>
              {children}
              <Toaster />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
