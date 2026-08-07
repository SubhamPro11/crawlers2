import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientOverlays } from "@/components/layout/ClientOverlays";
import { CompareProvider } from "@/context/CompareContext";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Crawlers — AI Tools Directory & API Registry",
    template: "%s | Crawlers",
  },
  description:
    "A human-curated directory of AI tools, API endpoints, and developer infrastructure. Direct source links, audited licensing, zero fabricated metrics.",
  keywords: [
    "AI directory",
    "AI tools",
    "developer APIs",
    "LLM tools",
    "open source AI",
    "terminal UI",
    "curated software",
  ],
  authors: [{ name: "Crawlers Editorial Team" }],
  creator: "Crawlers Directory",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Crawlers AI Tools Directory",
    title: "Crawlers — AI Tools Directory & API Registry",
    description:
      "A human-curated directory of AI tools, API endpoints, and developer infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crawlers — AI Tools Directory",
    description:
      "Human-curated AI tools directory, API registry, and developer infrastructure index.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-navy-950 text-slate-100 selection:bg-lime-accent/30 selection:text-lime-accent">
        <CompareProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <ClientOverlays />
        </CompareProvider>
      </body>
    </html>
  );
}
