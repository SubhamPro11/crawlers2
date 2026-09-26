"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Code2, ArrowRight, FolderGit2, CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ToolFavicon } from "@/components/ui/ToolFavicon";
import { Tool } from "@/types/database";
import { searchDirectory, getSearchIndex, SearchCategoryMatch } from "@/lib/searchClient";

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [categoryResults, setCategoryResults] = useState<SearchCategoryMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preheat index lazily when user interacts with search
  const preheatIndex = () => {
    getSearchIndex().catch(() => {});
  };

  // Global '/' keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Local instant search on query change (< 1ms execution, 0 network calls per keystroke)
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setCategoryResults([]);
      setIsLoading(false);
      return;
    }

    setIsOpen(true);
    let isCurrent = true;

    searchDirectory(q, { toolLimit: 8, categoryLimit: 4 }).then((res) => {
      if (isCurrent) {
        setCategoryResults(res.categories);
        setSearchResults(res.tools);
        setIsLoading(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [query]);

  const totalMatches = searchResults.length + categoryResults.length;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Full Pill-Shaped Terminal Bar Container */}
      <div className="relative flex items-center bg-navy-950/90 border border-navy-700 hover:border-navy-600 focus-within:border-lime-accent focus-within:ring-1 focus-within:ring-lime-accent/40 rounded-full shadow-lg transition-all duration-200">
        {/* Terminal $ Prompt - Padded for curved left pill edge */}
        <div className="pl-5 sm:pl-6 pr-1.5 font-mono font-bold text-lime-accent text-sm sm:text-base select-none flex items-center gap-1 shrink-0">
          <span>$</span>
        </div>

        {/* Input Field with reserved right padding for curved pill edge & hint badge */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (!val.trim()) {
              setSearchResults([]);
              setCategoryResults([]);
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            preheatIndex();
            if (query.trim()) setIsOpen(true);
          }}
          onMouseEnter={preheatIndex}
          placeholder="Search 838+ tools, categories, APIs..."
          aria-label="Search 838+ tools, categories, and APIs"
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-xs sm:text-sm font-mono py-3.5 pl-1 pr-28 sm:pr-36 focus:outline-none"
        />

        {/* Action / Keyboard Shortcut Hint - Padded for curved right pill edge */}
        <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 shrink-0 z-10">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-navy-850 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-navy-900/90 border border-navy-800 px-2.5 py-0.5 rounded-full select-none pointer-events-none">
              <span>press</span>
              <kbd className="text-slate-300 font-bold bg-navy-800 px-1.5 py-0.2 rounded border border-navy-700 text-[10px]">
                /
              </kbd>
              <span>to search</span>
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden divide-y divide-navy-850 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Status Bar */}
          <div className="px-3.5 py-2 font-mono text-[11px] text-slate-400 bg-navy-950 flex items-center justify-between border-b border-navy-800">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-lime-accent" />
              Query: &quot;<strong className="text-slate-200">{query}</strong>&quot;
            </span>
            <span>
              {isLoading ? (
                <span className="text-lime-accent animate-pulse">Scanning index...</span>
              ) : (
                `${totalMatches} results`
              )}
            </span>
          </div>

          {/* Special Easter Egg command */}
          {query.trim().toLowerCase() === "whoami" && (
            <div className="p-4 font-mono text-xs text-lime-accent bg-navy-950 space-y-2 border-t border-navy-800">
              <div className="text-slate-200 font-bold">$ whoami</div>
              <p className="text-slate-300 leading-relaxed font-sans">
                Crawlers is built &amp; editorially curated by a single developer. Zero paid placements, zero sponsored badges, zero automated affiliate scraping.
              </p>
              <div className="text-slate-500 text-[11px]">
                Status: Direct manual verification • Contact: subham@crawlers.dev
              </div>
            </div>
          )}

          {/* Taxonomy Categories Group */}
          {categoryResults.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-lime-accent/80 flex items-center gap-1.5 mb-1">
                <FolderGit2 className="w-3 h-3" /> Taxonomy Categories
              </div>
              <div className="space-y-1">
                {categoryResults.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/tools/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-navy-850 transition-colors group"
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-200 group-hover:text-lime-accent flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          in {cat.sectionName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
                        {cat.description}
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-lime-accent transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tools Group */}
          {searchResults.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Search className="w-3 h-3 text-slate-400" /> Indexed AI Tools
              </div>
              <div className="space-y-1">
                {searchResults.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-navy-850 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ToolFavicon url={tool.url} name={tool.name} logoUrl={tool.logo_url} size={24} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-100 group-hover:text-lime-accent transition-colors truncate">
                            {tool.name}
                          </span>
                          {tool.has_api && (
                            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-navy-950 text-lime-accent border border-lime-accent/30 flex items-center gap-0.5 shrink-0">
                              <Code2 className="w-2.5 h-2.5" /> API
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans truncate">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <Badge pricingModel={tool.pricing_model} size="sm" className="shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty Search Result */}
          {!isLoading && totalMatches === 0 && query.trim().toLowerCase() !== "whoami" && (
            <div className="p-6 text-center font-mono text-xs text-slate-400">
              No index matches found for &quot;<span className="text-slate-200">{query}</span>&quot;. Try &apos;whoami&apos;, &apos;ollama&apos;, or &apos;transcription&apos;.
            </div>
          )}

          {/* Footer Action Hint */}
          {searchResults.length > 0 && (
            <div className="p-2 bg-navy-950 text-center font-mono text-xs border-t border-navy-850">
              <Link
                href={`/compare?tools=${searchResults.slice(0, 2).map((r) => r.slug).join(",")}`}
                onClick={() => setIsOpen(false)}
                className="text-lime-accent hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                Compare Top Results <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
