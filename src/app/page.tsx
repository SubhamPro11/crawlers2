import React from "react";
import Link from "next/link";
import { Terminal, Code2, FolderGit2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { MOCK_CURATED_STACKS } from "@/lib/mockData";
import { fetchTools } from "@/lib/supabase";
import { ToolCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SmartSearch } from "@/components/search/SmartSearch";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-lime-accent/10 border border-lime-accent/30 font-mono text-xs text-lime-accent">
            <Terminal className="w-3.5 h-3.5" />
            <span>crawlers://v1.0.0 --indexing-mode=human-curated</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold tracking-tight text-slate-100 leading-tight">
            The Human-Curated <br />
            <span className="text-lime-accent">AI Tools &amp; API Directory</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Zero generic SaaS gradients. Zero fabricated engagement numbers. An unvarnished directory of AI software, developer tools, and API endpoints.
          </p>

          <div className="pt-2">
            <SmartSearch />
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
            <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-accent" /> Curated Stacks
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Hand-assembled tool combinations for specific operational roles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_CURATED_STACKS.map((stack) => (
            <div
              key={stack.id}
              className="p-6 rounded border border-navy-800 bg-navy-900 flex flex-col justify-between hover:border-lime-accent/40 transition-colors"
            >
              <div>
                <span className="font-mono text-xs text-lime-accent uppercase tracking-wider block mb-2">
                  Hand-Curated Stack
                </span>
                <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">{stack.name}</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                  {stack.description}
                </p>
              </div>

              <div className="pt-4 border-t border-navy-850 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{stack.toolSlugs.length} Tools Included</span>
                <Link
                  href={`/compare?tools=${stack.toolSlugs.slice(0, 2).join(",")}`}
                  className="text-lime-accent hover:underline flex items-center gap-1"
                >
                  View Stack <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9 Taxonomy Sections Grid */}
      <section id="sections" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="border-b border-navy-800 pb-4 mb-8">
          <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-lime-accent">$</span> Browse Directory Taxonomy
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Explore 9 top-level groupings and their specialized sub-categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TAXONOMY_SEEDS.map((section) => (
            <div
              key={section.slug}
              className="p-6 rounded border border-navy-800 bg-navy-900/80 hover:border-navy-600 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded border border-lime-accent/20">
                  0{section.number}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {section.categories.length} Categories
                </span>
              </div>

              <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">
                <Link
                  href={`/${section.slug}`}
                  className="hover:text-lime-accent transition-colors"
                >
                  {section.name}
                </Link>
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4 line-clamp-2">
                {section.description}
              </p>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-navy-850">
                {section.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${section.slug}/${cat.slug}`}
                    className="font-mono text-[11px] text-slate-300 bg-navy-850 hover:bg-navy-800 hover:text-lime-accent px-2 py-0.5 rounded border border-navy-800 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-8">
          <div>
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

      <Footer />
    </div>
  );
}
