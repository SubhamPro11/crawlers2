import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MOCK_CURATED_STACKS } from "@/lib/mockData";
import { StackModule } from "@/components/home/StackModule";

export const revalidate = 3600; // SSG/ISR 1-hour static revalidation

export const metadata = {
  title: "Curated Operational AI Stacks & Tool Pipelines | Crawlers",
  description: "Hand-assembled software tool stacks for solo founders, developers, and content creators.",
};

export default function OperationalStacksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Operational Stacks</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-lime-accent" /> Curated Operational Stacks
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            Role-tailored tool pipelines curated for technical workflows. Each stack is hand-assembled with verified interoperability.
          </p>
        </div>

        {/* Stacks Module */}
        <StackModule stacks={MOCK_CURATED_STACKS} />
      </main>
    </div>
  );
}
