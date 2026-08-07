"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  ExternalLink,
  Check,
  X,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Tool } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ToolFavicon } from "@/components/ui/ToolFavicon";
import { useCompare, CompareItem } from "@/context/CompareContext";
import { supabase } from "@/lib/supabase";
import { MOCK_TOOLS } from "@/lib/mockData";

interface CompareClientProps {
  initialTools: Tool[];
  allDbTools: Tool[];
}

export const CompareClient: React.FC<CompareClientProps> = ({
  initialTools,
  allDbTools,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { queuedTools, addToCompare, removeFromCompare, clearCompare } = useCompare();

  const [comparedTools, setComparedTools] = useState<Tool[]>(initialTools);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Sync state with URL params or CompareContext queue on mount
  useEffect(() => {
    const toolsParam = searchParams.get("tools");
    let slugsToFetch: string[] = [];

    if (toolsParam) {
      slugsToFetch = toolsParam.split(",").filter(Boolean);
    } else if (queuedTools.length >= 2) {
      slugsToFetch = queuedTools.map((t) => t.slug);
    }

    if (slugsToFetch.length > 0) {
      const matched = slugsToFetch
        .map((slug) => allDbTools.find((t) => t.slug === slug))
        .filter((t): t is Tool => t !== undefined);

      if (matched.length > 0) {
        setComparedTools(matched);
      }
    }
  }, [searchParams, allDbTools, queuedTools]);

  // Update URL whenever comparedTools changes
  const updateComparedTools = (newTools: Tool[]) => {
    setComparedTools(newTools);
    const slugs = newTools.map((t) => t.slug).join(",");
    const newUrl = slugs ? `/compare?tools=${slugs}` : `/compare`;
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  const handleAddTool = (tool: Tool) => {
    if (comparedTools.some((t) => t.id === tool.id || t.slug === tool.slug)) return;
    if (comparedTools.length >= 4) {
      alert("You can compare up to 4 tools side-by-side.");
      return;
    }

    const updated = [...comparedTools, tool];
    updateComparedTools(updated);
    addToCompare({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      url: tool.url,
      logo_url: tool.logo_url,
      pricing_model: tool.pricing_model,
    });
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveTool = (toolId: string) => {
    const updated = comparedTools.filter((t) => t.id !== toolId && t.slug !== toolId);
    updateComparedTools(updated);
    removeFromCompare(toolId);
  };

  const filteredSearchResults = allDbTools.filter(
    (t) =>
      !comparedTools.some((ct) => ct.id === t.id || ct.slug === t.slug) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-mono">
      {/* Search & Add Tool Control Bar */}
      <div className="rounded-xl border border-navy-800 bg-navy-900/90 p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] text-lime-accent font-semibold uppercase tracking-wider">
              Tool Selector ({comparedTools.length}/4 Active)
            </div>
            <h2 className="text-sm font-bold text-slate-200">
              Add tools to side-by-side comparison matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {comparedTools.length > 0 && (
              <button
                onClick={() => {
                  updateComparedTools([]);
                  clearCompare();
                }}
                className="px-3.5 py-1.5 rounded-full bg-navy-950 border border-navy-800 text-xs text-slate-400 hover:text-red-400 hover:border-red-900 transition-colors flex items-center gap-1.5 cursor-pointer font-bold shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Matrix
              </button>
            )}
          </div>
        </div>

        {/* Autocomplete Search Dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Type to search and add tools (e.g. Groq, NVIDIA NIM, Cerebras, Ollama)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-navy-950 border border-navy-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-accent text-xs font-mono"
            />
          </div>

          {isDropdownOpen && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-navy-800 bg-navy-950 shadow-2xl overflow-hidden max-h-60 overflow-y-auto font-mono text-xs">
              {filteredSearchResults.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No matching tools found for "{searchQuery}"
                </div>
              ) : (
                filteredSearchResults.slice(0, 8).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleAddTool(tool)}
                    className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-navy-900 transition-colors border-b border-navy-850 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ToolFavicon url={tool.url} name={tool.name} logoUrl={tool.logo_url} size={20} />
                      <div className="truncate">
                        <span className="font-bold text-slate-100">{tool.name}</span>
                        <span className="text-slate-500 text-[11px] ml-2 font-sans truncate">
                          {tool.description}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent font-bold text-[11px] flex items-center gap-1 shrink-0">
                      <Plus className="w-3 h-3" /> Add
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Tool Pill Badges */}
        {comparedTools.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-850">
            <span className="text-[11px] text-slate-400 font-semibold">Comparing:</span>
            {comparedTools.map((tool) => (
              <span
                key={tool.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950 border border-navy-700 text-slate-200 text-xs"
              >
                <ToolFavicon url={tool.url} name={tool.name} logoUrl={tool.logo_url} size={14} />
                <span className="font-bold">{tool.name}</span>
                <button
                  onClick={() => handleRemoveTool(tool.id)}
                  className="text-slate-500 hover:text-red-400 cursor-pointer ml-1"
                  title={`Remove ${tool.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Matrix Table or Empty State */}
      {comparedTools.length < 2 ? (
        <div className="rounded-xl border border-navy-800 bg-navy-900/80 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-lime-accent/10 border border-lime-accent/30 mx-auto flex items-center justify-center text-lime-accent">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-100">Select at least 2 tools to compare</h3>
            <p className="text-xs text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
              Use the search bar above or click <strong>+ Compare</strong> on any tool card across the directory to queue tools for side-by-side feature comparison.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-navy-800 bg-navy-900 overflow-hidden font-sans shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-navy-800 bg-navy-950">
                  <th className="p-4 text-slate-400 uppercase tracking-wider text-[11px] font-bold w-44 min-w-[170px] sticky left-0 bg-navy-950 z-10 border-r border-navy-850">
                    Feature Matrix
                  </th>
                  {comparedTools.map((tool) => (
                    <th key={tool.id} className="p-4 min-w-[220px] max-w-[300px] border-r border-navy-850 last:border-r-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ToolFavicon url={tool.url} name={tool.name} logoUrl={tool.logo_url} size={22} />
                          <Link href={`/tool/${tool.slug}`} className="font-bold text-sm text-slate-100 hover:text-lime-accent transition-colors">
                            {tool.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemoveTool(tool.id)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                          title={`Remove ${tool.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-850">
                {/* Row 1: Pricing Model */}
                <tr>
                  <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold sticky left-0 bg-navy-900 z-10 border-r border-navy-850">
                    Pricing Model
                  </td>
                  {comparedTools.map((tool) => (
                    <td key={tool.id} className="p-4 border-r border-navy-850 last:border-r-0">
                      <Badge pricingModel={tool.pricing_model}>{tool.pricing_model}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Row 2: API Access */}
                <tr>
                  <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold sticky left-0 bg-navy-900 z-10 border-r border-navy-850">
                    Native API Endpoint
                  </td>
                  {comparedTools.map((tool) => (
                    <td key={tool.id} className="p-4 border-r border-navy-850 last:border-r-0">
                      {tool.has_api ? (
                        <span className="text-lime-accent flex items-center gap-1.5 font-bold">
                          <Check className="w-4 h-4" /> Yes (API Available)
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <X className="w-4 h-4 text-red-400" /> No Native API
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Core Overview Description */}
                <tr>
                  <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold sticky left-0 bg-navy-900 z-10 border-r border-navy-850 align-top">
                    Core Overview
                  </td>
                  {comparedTools.map((tool) => (
                    <td key={tool.id} className="p-4 border-r border-navy-850 last:border-r-0 text-slate-300 font-sans leading-relaxed align-top">
                      {tool.description}
                    </td>
                  ))}
                </tr>

                {/* Row 4: Direct Link CTA */}
                <tr>
                  <td className="p-4 text-slate-400 font-mono text-[11px] font-semibold sticky left-0 bg-navy-900 z-10 border-r border-navy-850">
                    Direct Source Link
                  </td>
                  {comparedTools.map((tool) => (
                    <td key={tool.id} className="p-4 border-r border-navy-850 last:border-r-0">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                          Visit {tool.name}
                        </Button>
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
