import React from "react";
import Link from "next/link";
import { Terminal, FolderGit2, Sparkles, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { MOCK_CURATED_STACKS } from "@/lib/mockData";
import { fetchTools } from "@/lib/supabase";
import { ToolCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SmartSearch } from "@/components/search/SmartSearch";
import { StackModule } from "@/components/home/StackModule";
import { TaxonomyGrid } from "@/components/home/TaxonomyGrid";
import { IndexStatusLine } from "@/components/home/IndexStatusLine";

export const revalidate = 3600; // SSG/ISR 1-hour revalidation

export const metadata = {
  title: "Crawlers — AI Tools Directory & API Registry",
  description: "A human-curated directory of AI tools, API endpoints, and developer infrastructure. Direct source links, audited licensing, zero fabricated metrics.",
};

export default async function HomePage() {
  // Fetch lightweight 6-tool preview for static homepage
  const previewTools = await fetchTools({ limit: 6 });

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      {/* Hero Section */}
      <section className="relative border-b border-navy-800 hero-vignette py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="crt-badge animate-hero inline-flex items-center gap-2 px-3 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
            <Terminal className="w-3.5 h-3.5 text-lime-accent" />
            <span>crawlers://v1.0.0 --audit=manual --feeds=zero</span>
          </div>

          <h1 className="animate-hero-delayed text-3xl sm:text-5xl md:text-6xl font-mono font-extrabold text-slate-100 leading-[1.08] tracking-[-0.04em]">
            The Human-Curated <br className="hidden sm:block" />
            <span className="text-lime-accent">AI Tools &amp; API Directory</span>
          </h1>

          <blockquote className="animate-hero-delayed-2 relative max-w-xl mx-auto border-l-2 border-lime-accent/40 pl-5 py-1">
            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed italic">
              Zero generic SaaS gradients. Zero fabricated engagement numbers.&nbsp;An&nbsp;unvarnished directory of AI software, developer tools, and&nbsp;API&nbsp;endpoints.
            </p>
          </blockquote>

          <div className="pt-1">
            <IndexStatusLine toolCount={1000} lastUpdatedText="Just now" />
          </div>

          <div className="pt-2">
            <SmartSearch />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
            <Link href="/tools">
              <Button variant="primary" icon={<ShieldCheck className="w-4 h-4" />}>
                Browse All 1,000+ Tools
              </Button>
            </Link>
            <Link href="#sections">
              <Button variant="outline" icon={<FolderGit2 className="w-4 h-4" />}>
                Explore Taxonomy Sections
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Curated Stacks Preview */}
      <section className="animate-entrance pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
            <div className="font-mono text-[11px] text-lime-accent/70 uppercase tracking-[0.2em] mb-1.5">
              {"// 01. operational_stacks"}
            </div>
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-[-0.02em] flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-lime-accent" /> Curated Operational Stacks
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Hand-assembled tool pipelines for specific technical roles.
            </p>
          </div>
          <Link
            href="/stacks"
            className="font-mono text-xs text-lime-accent hover:underline inline-flex items-center gap-1.5 shrink-0"
          >
            All Stacks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StackModule stacks={MOCK_CURATED_STACKS} />
      </section>

      {/* 9 Taxonomy Sections Grid */}
      <section id="sections" className="animate-entrance py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-dashed border-navy-800 section-alt">
        <div className="border-b border-navy-800 pb-4 mb-8">
          <div className="font-mono text-[11px] text-lime-accent/70 uppercase tracking-[0.2em] mb-1.5">
            {"// 02. directory_taxonomy"}
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-[-0.02em]">
            Directory Taxonomy Index
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Nine top-level groupings with specialized sub-categories. Browse by domain.
          </p>
        </div>

        <TaxonomyGrid sections={TAXONOMY_SEEDS} />
      </section>

      {/* Featured Tools Preview */}
      <section className="animate-entrance pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-navy-800 section-inset">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
            <div className="font-mono text-[11px] text-lime-accent/70 uppercase tracking-[0.2em] mb-1.5">
              {"// 03. featured_tools_preview"}
            </div>
            <h2 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-[-0.02em] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-lime-accent" /> Editorially Verified Tools
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Previewing top verified AI software. Explore full paginated index on `/tools`.
            </p>
          </div>
          <Link
            href="/tools"
            className="font-mono text-xs text-lime-accent hover:underline inline-flex items-center gap-1.5 shrink-0 font-bold"
          >
            Browse All Tools →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewTools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              slug={tool.slug}
              url={tool.url}
              description={tool.description}
              pricingModel={tool.pricing_model}
              logoUrl={tool.logo_url}
              hasApi={tool.has_api}
              tags={["ai-tools"]}
            />
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link href="/tools">
            <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Open Complete Paginated Tool Index (1,000+ Software)
            </Button>
          </Link>
        </div>
      </section>

      {/* Telemetry Bar Link */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-navy-850">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-xl bg-navy-900 border border-navy-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-lime-accent/10 border border-lime-accent/30 text-lime-accent">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-slate-100">Live Traffic Telemetry</div>
              <div className="text-xs text-slate-400 font-sans">
                Explore real 24h view logs and trending software rankings.
              </div>
            </div>
          </div>
          <Link href="/trending">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View Live Telemetry →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
