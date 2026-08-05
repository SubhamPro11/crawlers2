import React from "react";
import Link from "next/link";
import { ArrowLeft, Code2, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchTools } from "@/lib/supabase";
import { ToolCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "API Keys & Developer Endpoints Directory | Crawlers",
  description: "Audited registry of AI services, LLM providers, and developer tools offering programmatic API access.",
};

export default async function ApiRegistryPage() {
  const apiTools = await fetchTools({ hasApi: true });

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">API Registry</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
            <Code2 className="w-4 h-4" />
            <span>Developer API Endpoint Index</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            API Keys &amp; Developer Endpoints
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            Direct access to AI services offering programmatic REST/gRPC APIs, SDKs, and developer key generation.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-5 rounded border border-navy-800 bg-navy-900 font-mono text-xs text-slate-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-lime-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-100 block">Developer API Guarantee</span>
            <p className="text-slate-400 font-sans leading-relaxed">
              Every tool listed in this registry has been audited to confirm availability of developer API endpoints or local REST servers.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-navy-850 pb-3">
            <span>Showing {apiTools.length} Verified API Providers</span>
            <Badge variant="lime">API Enabled</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiTools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                slug={tool.slug}
                url={tool.url}
                description={tool.description}
                pricingModel={tool.pricing_model}
                hasApi={tool.has_api}
                tags={["api-provider"]}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
