import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { fetchTools, fetchToolBySlug } from "@/lib/supabase";
import { MOCK_TOOLS } from "@/lib/mockData";
import { CompareClient } from "./CompareClient";

export const metadata = {
  title: "Compare AI Tools Side-by-Side | Crawlers",
  description: "Evaluate features, pricing models, API endpoints, and licensing across AI tools.",
};

interface ComparePageProps {
  searchParams: Promise<{
    tools?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { tools: toolsQuery } = await searchParams;

  const allDbTools = (await fetchTools()) || MOCK_TOOLS;

  const slugs = toolsQuery ? toolsQuery.split(",").filter(Boolean) : ["ollama", "cursor"];
  const fetchedTools = await Promise.all(slugs.map((slug) => fetchToolBySlug(slug)));
  const initialTools = fetchedTools.filter((t): t is NonNullable<typeof t> => t !== null);

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Tool Comparison</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <h1 className="font-mono text-3xl font-bold text-slate-100 flex items-center gap-2">
            <ArrowLeftRight className="w-7 h-7 text-lime-accent" /> Side-by-Side Tool Comparison
          </h1>
          <p className="text-sm text-slate-400 font-sans">
            Unvarnished comparison matrix for developer tools and generative AI software.
          </p>
        </div>

        {/* Interactive Comparison Client View */}
        <Suspense fallback={<div className="font-mono text-xs text-slate-500 p-8 text-center">Loading comparison matrix...</div>}>
          <CompareClient initialTools={initialTools} allDbTools={allDbTools} />
        </Suspense>
      </main>
    </div>
  );
}
