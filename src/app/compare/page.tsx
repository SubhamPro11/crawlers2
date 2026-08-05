import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ArrowLeftRight, Check, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MOCK_TOOLS } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

  const slugs = toolsQuery ? toolsQuery.split(",") : ["ollama", "cursor"];
  const toolA = MOCK_TOOLS.find((t) => t.slug === slugs[0]) || MOCK_TOOLS[0];
  const toolB = MOCK_TOOLS.find((t) => t.slug === slugs[1]) || MOCK_TOOLS[1];

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
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

        {/* Comparison Matrix Table */}
        <div className="rounded border border-navy-800 bg-navy-900 overflow-hidden font-sans">
          <div className="grid grid-cols-3 border-b border-navy-800 bg-navy-850 p-4 font-mono text-xs text-slate-400 uppercase tracking-wider">
            <div>Feature Matrix</div>
            <div className="text-lime-accent font-bold">{toolA.name}</div>
            <div className="text-lime-accent font-bold">{toolB.name}</div>
          </div>

          {/* Row 1: Pricing Model */}
          <div className="grid grid-cols-3 p-4 border-b border-navy-850 items-center">
            <div className="font-mono text-xs text-slate-400">Pricing Model</div>
            <div>
              <Badge pricingModel={toolA.pricing_model}>{toolA.pricing_model}</Badge>
            </div>
            <div>
              <Badge pricingModel={toolB.pricing_model}>{toolB.pricing_model}</Badge>
            </div>
          </div>

          {/* Row 2: API Access */}
          <div className="grid grid-cols-3 p-4 border-b border-navy-850 items-center">
            <div className="font-mono text-xs text-slate-400">Native API Endpoint</div>
            <div className="font-mono text-xs flex items-center gap-1 text-slate-200">
              {toolA.has_api ? (
                <span className="text-lime-accent flex items-center gap-1 font-bold">
                  <Check className="w-4 h-4" /> Yes (API Available)
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1">
                  <X className="w-4 h-4 text-red-400" /> No Native API
                </span>
              )}
            </div>
            <div className="font-mono text-xs flex items-center gap-1 text-slate-200">
              {toolB.has_api ? (
                <span className="text-lime-accent flex items-center gap-1 font-bold">
                  <Check className="w-4 h-4" /> Yes (API Available)
                </span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1">
                  <X className="w-4 h-4 text-red-400" /> No Native API
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Operational Description */}
          <div className="grid grid-cols-3 p-4 border-b border-navy-850 items-start">
            <div className="font-mono text-xs text-slate-400">Core Overview</div>
            <div className="text-xs text-slate-300 leading-relaxed pr-4">{toolA.description}</div>
            <div className="text-xs text-slate-300 leading-relaxed pr-4">{toolB.description}</div>
          </div>

          {/* Row 4: Direct Link */}
          <div className="grid grid-cols-3 p-4 items-center">
            <div className="font-mono text-xs text-slate-400">Direct Source Link</div>
            <div>
              <a href={toolA.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Visit {toolA.name}
                </Button>
              </a>
            </div>
            <div>
              <a href={toolB.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Visit {toolB.name}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
