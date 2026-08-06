import React from "react";
import Link from "next/link";
import { Terminal, Code2, FolderGit2, Sparkles, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { MOCK_CURATED_STACKS } from "@/lib/mockData";
import { fetchTools } from "@/lib/supabase";
import { ToolCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SmartSearch } from "@/components/search/SmartSearch";
import { StackModule } from "@/components/home/StackModule";
import { TaxonomyGrid } from "@/components/home/TaxonomyGrid";
import { IndexStatusLine } from "@/components/home/IndexStatusLine";
import { TrendingSection } from "@/components/home/TrendingSection";

export const metadata = {
  title: "Crawlers — AI Tools Directory & API Registry",
  description: "Human-curated, terminal-inspired directory of AI tools, API endpoints, and developer resources. Direct links only, zero fabricated metrics.",
};

export default async function HomePage() {
  const tools = await fetchTools({ limit: 6 });
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative border-b border-navy-800 bg-navy-950 py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="crt-badge inline-flex items-center gap-2 px-3 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
            <Terminal className="w-3.5 h-3.5 text-lime-accent" />
            <span>crawlers://v1.0.0 --indexing-mode=human-curated</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tight text-slate-100 leading-tight">
            The Human-Curated <br />
            <span className="text-lime-accent">AI Tools &amp; API Directory</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Zero generic SaaS gradients. Zero fabricated engagement numbers. An unvarnished directory of AI software, developer tools, and API endpoints.
          </p>

          <div className="pt-1">
            <IndexStatusLine toolCount={tools.length} lastUpdatedText="14 minutes ago" />
          </div>

          {/* macOS Terminal Window Container for SmartSearch */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="macos-window text-left">
              <div className="macos-titlebar">
                <div className="macos-traffic-lights">
                  <span className="macos-dot macos-dot-red" />
                  <span className="macos-dot macos-dot-yellow" />
                  <span className="macos-dot macos-dot-green" />
                </div>
                <div className="font-mono text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-lime-accent" /> bash — crawlers-search (zsh) — 80x24
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ⌘K CLI
                </div>
              </div>
              <div className="p-4 bg-navy-950/70">
                <SmartSearch />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
            <Link href="#sections">
              <Button variant="primary" icon={<FolderGit2 className="w-4 h-4" />}>
                Explore 9 Taxonomy Sections
              </Button>
            </Link>
            <Link href="/api">
              <Button variant="outline" icon={<Code2 className="w-4 h-4" />}>
                Browse API Keys Registry
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Curated Stacks */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
            <div className="font-mono text-xs text-lime-accent uppercase tracking-wider mb-1">
              {"// 01. operational_stacks"}
            </div>
            <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-accent" /> Curated Operational Stacks
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Hand-assembled software pipelines for specific technical roles.
            </p>
          </div>
        </div>

        <StackModule stacks={MOCK_CURATED_STACKS} />
      </section>

      {/* 9 Taxonomy Sections Grid */}
      <section id="sections" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-dashed border-navy-800 bg-navy-950/40">
        <div className="border-b border-navy-800 pb-4 mb-8">
          <div className="font-mono text-xs text-lime-accent uppercase tracking-wider mb-1">
            {"// 02. directory_taxonomy"}
          </div>
          <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-lime-accent">$</span> Directory Taxonomy Index
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Explore 9 top-level groupings and their specialized sub-categories.
          </p>
        </div>

        <TaxonomyGrid sections={TAXONOMY_SEEDS} />
      </section>

      {/* Featured Tools Grid */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-navy-800">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
            <div className="font-mono text-xs text-lime-accent uppercase tracking-wider mb-1">
              {"// 03. active_tool_index"}
            </div>
            <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-lime-accent" /> Editorially Verified Tools
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Recently indexed AI software with audited links &amp; licensing models.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              slug={tool.slug}
              url={tool.url}
              description={tool.description}
              pricingModel={tool.pricing_model}
              hasApi={tool.has_api}
              tags={["ai-tools"]}
            />
          ))}
        </div>
      </section>

      {/* Real Data Trending Section */}
      <TrendingSection tools={tools} />

      <Footer />
    </div>
  );
}
