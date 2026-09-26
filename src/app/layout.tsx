import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientOverlays } from "@/components/layout/ClientOverlays";
import { CompareProvider } from "@/context/CompareContext";
import { SiteIdentityJsonLd } from "@/components/seo/JsonLd";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jet",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION ||
  "";
const bingVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
  process.env.BING_SITE_VERIFICATION ||
  "";

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
    "API registry",
    "AI infrastructure",
  ],
  authors: [{ name: "Crawlers Editorial Team" }],
  creator: "Crawlers Directory",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Crawlers",
    title: "Crawlers — AI Tools Directory & API Registry",
    description:
      "A human-curated directory of AI tools, API endpoints, and developer infrastructure. Direct source links, audited licensing, zero fabricated metrics.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@crawlers",
    creator: "@crawlers",
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
  verification: {
    ...(googleVerification && { google: googleVerification }),
    ...(bingVerification && { yandex: undefined, other: { "msvalidate.01": bingVerification } }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}>
      <head>
        {googleVerification && (
          <meta name="google-site-verification" content={googleVerification} />
        )}
        <SiteIdentityJsonLd siteUrl={baseUrl} />
      </head>
      <body className="min-h-full flex flex-col bg-navy-950 text-slate-100 selection:bg-lime-accent/30 selection:text-lime-accent">
        {/* Skip to Main Content for Screen Readers & Keyboard Users (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-lime-accent focus:text-navy-950 focus:font-mono focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
        >
          Skip to main content
        </a>
        <CompareProvider>
          <Navbar />
          <div id="main-content" className="flex-1 flex flex-col outline-none">
            {children}
          </div>
          <Footer />
          <ClientOverlays />
          <CookieConsentBanner />
        </CompareProvider>
      </body>
    </html>
  );
}
