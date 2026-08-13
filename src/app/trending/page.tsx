import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { getCachedTrendingTools } from "@/lib/cached-queries";
import { TrendingSection } from "@/components/home/TrendingSection";

export const revalidate = 600; // SSG/ISR 10-minute revalidation for trending telemetry

export const metadata = {
  title: "Live Trending AI Tools Telemetry (24h View Audit)",
  description: "Real-time 24-hour page view telemetry and traffic rankings across verified AI software.",
  alternates: {
    canonical: "/trending",
  },
  openGraph: {
    title: "Live Trending AI Tools Telemetry (24h View Audit)",
    description: "Real-time 24-hour page view telemetry and traffic rankings across verified AI software.",
    url: "https://crawlers.dpdns.org/trending",
    siteName: "Crawlers",
  },
  twitter: {
    card: "summary_large_image",
    site: "@crawlers",
    creator: "@crawlers",
    title: "Live Trending AI Tools Telemetry (24h View Audit)",
    description: "Real-time 24-hour page view telemetry and traffic rankings across verified AI software.",
  },
};

export default async function TrendingPage() {
  const { tools, viewCounts, sparklines } = await getCachedTrendingTools();

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Traffic Telemetry</span>
        </div>

        {/* Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-lime-accent" /> Trending by Real View Logs
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            Unvarnished traffic rankings based on real 24-hour page view event logs. Zero algorithm boosts, zero sponsored placement padding.
          </p>
        </div>

        {/* Trending Section Component */}
        <TrendingSection tools={tools} viewCounts={viewCounts} sparklines={sparklines} />
      </main>
    </div>
  );
}
