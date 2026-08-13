"use client";

import React, { useState, useMemo, useTransition } from "react";
import { ShieldCheck, Filter, ArrowUpDown, Code2, RotateCcw, Activity } from "lucide-react";
import { Tool, PricingModel } from "@/types/database";
import { ToolCard } from "@/components/ui/Card";
import { ToolCardSkeleton } from "@/components/ui/ToolCardSkeleton";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";

interface VerifiedToolsGridProps {
  initialTools: Tool[];
}

export const VerifiedToolsGrid: React.FC<VerifiedToolsGridProps> = ({ initialTools }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [apiOnly, setApiOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"recently_added" | "name_asc">("recently_added");
  const [isPending, startTransition] = useTransition();

  // Extract all categories from TAXONOMY_SEEDS
  const allCategories = useMemo(() => {
    const map = new Map<string, string>();
    TAXONOMY_SEEDS.forEach((sec) => {
      sec.categories.forEach((cat) => {
        map.set(cat.slug, cat.name);
      });
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, []);

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let result = [...initialTools];

    // Filter by Pricing Model
    if (selectedPricing !== "all") {
      result = result.filter((t) => t.pricing_model === selectedPricing);
    }

    // Filter by API Availability
    if (apiOnly) {
      result = result.filter((t) => t.has_api);
    }

    // Filter by Category if category_id or slug match
    if (selectedCategory !== "all") {
      result = result.filter((t) => {
        if (!t.category_id) return false;
        return t.category_id.includes(selectedCategory) || t.category_id === `cat-${selectedCategory}`;
      });
    }

    // Sort tools
    if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime());
    }

    return result;
  }, [initialTools, selectedCategory, selectedPricing, apiOnly, sortBy]);

  const hasActiveFilters = selectedCategory !== "all" || selectedPricing !== "all" || apiOnly;

  const handleCategoryChange = (val: string) => {
    startTransition(() => {
      setSelectedCategory(val);
    });
  };

  const handlePricingChange = (val: string) => {
    startTransition(() => {
      setSelectedPricing(val);
    });
  };

  const handleApiToggle = () => {
    startTransition(() => {
      setApiOnly((prev) => !prev);
    });
  };

  const handleSortChange = (val: "recently_added" | "name_asc") => {
    startTransition(() => {
      setSortBy(val);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setSelectedCategory("all");
      setSelectedPricing("all");
      setApiOnly(false);
      setSortBy("recently_added");
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-navy-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-lime-accent/70 uppercase tracking-[0.2em]">
              {"// 03. active_tool_index"}
            </span>
            {isPending && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-lime-accent bg-lime-accent/10 px-2 py-0.5 rounded border border-lime-accent/30 animate-pulse">
                <Activity className="w-3 h-3 animate-spin" />
                <span>FILTERING...</span>
              </span>
            )}
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-[-0.02em] flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-lime-accent" /> Editorially Verified Tools
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Showing {filteredTools.length} of {initialTools.length} indexed tools with audited links &amp; licensing models.
          </p>
        </div>

        {/* Interactive Filter / Sort Bar */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-navy-950 border border-navy-800 hover:border-navy-700 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-lime-accent/50 appearance-none cursor-pointer pr-8 shadow-sm"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Pricing Model Filter */}
          <select
            value={selectedPricing}
            onChange={(e) => handlePricingChange(e.target.value)}
            className="bg-navy-950 border border-navy-800 hover:border-navy-700 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-lime-accent/50 cursor-pointer shadow-sm"
          >
            <option value="all">All Pricing</option>
            <option value="open-source">Open-Source</option>
            <option value="freemium">Freemium</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          {/* API Toggle Button */}
          <button
            onClick={handleApiToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              apiOnly
                ? "bg-lime-accent/10 border-lime-accent/40 text-lime-accent"
                : "bg-navy-950 border-navy-800 text-slate-400 hover:border-navy-700 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> API Only
          </button>

          {/* Sort Control */}
          <div className="relative flex items-center gap-1 bg-navy-950 border border-navy-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as "recently_added" | "name_asc")}
              className="bg-transparent text-slate-200 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="recently_added" className="bg-navy-950 text-slate-200">
                Recently Added
              </option>
              <option value="name_asc" className="bg-navy-950 text-slate-200">
                Name (A-Z)
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-navy-950 border border-navy-800 text-slate-400 hover:text-lime-accent hover:border-lime-accent/30 transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tools Grid Container with Optimistic Transition */}
      <div className={`transition-opacity duration-200 ${isPending ? "opacity-70 pointer-events-none" : "opacity-100"}`}>
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                slug={tool.slug}
                url={tool.url}
                description={tool.description}
                pricingModel={tool.pricing_model as PricingModel}
                logoUrl={tool.logo_url}
                hasApi={tool.has_api}
                tags={["ai-tools"]}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-navy-900/60 border border-dashed border-navy-800 rounded-xl font-mono space-y-3">
            <div className="text-slate-300 text-sm">
              No tools match the selected category &amp; pricing filters.
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-950 border border-lime-accent/40 text-lime-accent text-xs hover:bg-lime-accent hover:text-navy-950 transition-colors font-mono font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
