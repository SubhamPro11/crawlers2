"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Code2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tool } from "@/types/database";
import { MOCK_TOOLS } from "@/lib/mockData";

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: Tool[] = query.trim()
    ? MOCK_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.slug.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <Input
        promptPrefix
        placeholder="search tools by name, description, or tags (e.g. ollama, cli, tts)..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(Boolean(e.target.value.trim()));
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        rightElement={
          query ? (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-slate-500" />
          )
        }
      />

      {/* Floating Results Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-navy-900 border border-navy-700 rounded shadow-xl max-h-96 overflow-y-auto divide-y divide-navy-850">
          <div className="p-2 font-mono text-[11px] text-slate-400 bg-navy-950 flex items-center justify-between border-b border-navy-800">
            <span>Query: &quot;{query}&quot;</span>
            <span>{results.length} Matches Found</span>
          </div>

          {results.length > 0 ? (
            results.map((tool) => (
              <Link
                key={tool.id}
                href={`/tool/${tool.slug}`}
                onClick={() => setIsOpen(false)}
                className="block p-3 hover:bg-navy-850 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-100 group-hover:text-lime-accent transition-colors">
                      {tool.name}
                    </span>
                    {tool.has_api && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-lime-accent border border-lime-accent/20 flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> API
                      </span>
                    )}
                  </div>
                  <Badge pricingModel={tool.pricing_model}>{tool.pricing_model}</Badge>
                </div>
                <p className="text-xs text-slate-400 font-sans line-clamp-1">
                  {tool.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="p-6 text-center font-mono text-xs text-slate-400">
              No software matched &quot;{query}&quot;. Try searching for &apos;ollama&apos; or &apos;cursor&apos;.
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2 bg-navy-950 text-center font-mono text-xs">
              <Link
                href={`/compare?tools=${results.slice(0, 2).map((r) => r.slug).join(",")}`}
                onClick={() => setIsOpen(false)}
                className="text-lime-accent hover:underline inline-flex items-center gap-1"
              >
                Compare Top Results <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
