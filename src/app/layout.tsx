import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EVENTOR - Calendario Futurista",
  description: "Tu calendario futurista con efectos neon y diseño de vanguardia. Organiza tus eventos con estilo.",
  keywords: ["EVENTOR", "calendario", "eventos", "futurista", "neon", "diseño", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "EVENTOR Team" }],
  openGraph: {
    title: "EVENTOR - Calendario Futurista",
    description: "Tu calendario futurista con efectos neon y diseño de vanguardia",
    url: "https://chat.z.ai",
    siteName: "EVENTOR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EVENTOR - Calendario Futurista",
    description: "Tu calendario futurista con efectos neon y diseño de vanguardia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
