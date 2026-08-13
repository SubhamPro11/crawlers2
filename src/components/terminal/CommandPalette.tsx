"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, CornerDownLeft, Shuffle, ArrowLeftRight, Search, X, Code2, Layers } from "lucide-react";
import { searchDirectory, getSearchIndex, SearchResults } from "@/lib/searchClient";
import { Tool } from "@/types/database";

interface SuggestedCommand {
  cmd: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const SUGGESTED_COMMANDS: SuggestedCommand[] = [
  {
    cmd: "crawlers --random",
    desc: "- Surprise me with a random tool detail page",
    icon: Shuffle,
    iconColor: "text-lime-accent",
  },
  {
    cmd: "crawlers --compare ollama cursor",
    desc: "- Side-by-side tool feature comparison matrix",
    icon: ArrowLeftRight,
    iconColor: "text-emerald-400",
  },
  {
    cmd: "crawlers --search devtools",
    desc: "- Instant directory category & tool query",
    icon: Search,
    iconColor: "text-amber-400",
  },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResults>({ tools: [], categories: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input and warm up search index when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      getSearchIndex().catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Live instant search across 1,000+ local tools (< 1ms)
  useEffect(() => {
    const q = input.trim();
    if (!q) {
      setSearchResults({ tools: [], categories: [] });
      setSelectedIndex(0);
      return;
    }

    let isCurrent = true;
    const cleanQuery = q.startsWith("crawlers --search") ? q.replace("crawlers --search", "").trim() : q;

    if (!cleanQuery) {
      setSearchResults({ tools: [], categories: [] });
      return;
    }

    searchDirectory(cleanQuery, { toolLimit: 6, categoryLimit: 3 }).then((res) => {
      if (isCurrent) {
        setSearchResults(res);
        setSelectedIndex(0);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [input]);

  const handleClose = () => {
    setIsOpen(false);
    setInput("");
  };

  // Command execution router
  const handleExecuteCommand = (commandStr: string) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    handleClose();

    if (trimmed.startsWith("crawlers --random") || trimmed === "random" || trimmed === "/random") {
      router.push(`/random`);
      return;
    }

    if (trimmed.startsWith("crawlers --compare")) {
      const parts = trimmed.replace("crawlers --compare", "").trim().split(/\s+/);
      if (parts.length >= 2) {
        router.push(`/compare?tools=${parts[0]},${parts[1]}`);
        return;
      } else {
        router.push(`/compare`);
        return;
      }
    }

    if (trimmed.startsWith("crawlers --search")) {
      const queryStr = trimmed.replace("crawlers --search", "").trim();
      if (queryStr) {
        router.push(`/tools?query=${encodeURIComponent(queryStr)}`);
      } else {
        router.push(`/tools`);
      }
      return;
    }

    // Direct tool or category match execution
    if (searchResults.tools.length > 0) {
      const tool = searchResults.tools[selectedIndex] || searchResults.tools[0];
      router.push(`/tool/${tool.slug}`);
      return;
    }

    if (searchResults.categories.length > 0) {
      const cat = searchResults.categories[0];
      router.push(`/tools/${cat.slug}`);
      return;
    }

    router.push(`/tools`);
  };

  if (!isOpen) return null;

  const isSearching = input.trim().length > 0;
  const listItemsCount = isSearching
    ? searchResults.tools.length + searchResults.categories.length
    : SUGGESTED_COMMANDS.length;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-navy-950 border border-lime-accent/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden font-mono text-slate-100 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150">
        {/* Terminal Title Bar */}
        <div className="bg-navy-900 border-b border-navy-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-lime-accent" /> crawlers-cli v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-sans">Press ESC to exit</span>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-200 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command Input Bar */}
        <div className="p-4 bg-navy-900/60 border-b border-navy-850 flex items-center gap-3">
          <span className="text-lime-accent font-bold text-base">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (listItemsCount > 0 ? (prev + 1) % listItemsCount : 0));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  listItemsCount > 0 ? (prev - 1 + listItemsCount) % listItemsCount : 0
                );
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (isSearching) {
                  if (selectedIndex < searchResults.tools.length) {
                    const tool = searchResults.tools[selectedIndex];
                    handleClose();
                    router.push(`/tool/${tool.slug}`);
                  } else {
                    const catIndex = selectedIndex - searchResults.tools.length;
                    const cat = searchResults.categories[catIndex];
                    if (cat) {
                      handleClose();
                      router.push(`/tools/${cat.slug}`);
                    } else {
                      handleExecuteCommand(input);
                    }
                  }
                } else {
                  handleExecuteCommand(SUGGESTED_COMMANDS[selectedIndex]?.cmd || input);
                }
              }
            }}
            placeholder="Type 'crawlers --random', '--compare', or search 1,000+ tools..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm truncate"
          />
          <kbd className="px-2 py-1 text-[10px] bg-navy-850 border border-navy-700 rounded text-slate-400 font-bold shrink-0">
            ENTER ↵
          </kbd>
        </div>

        {/* Results / Commands List */}
        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
          {!isSearching ? (
            <>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-2">
                Suggested Terminal Commands
              </div>

              {SUGGESTED_COMMANDS.map((item, index) => {
                const IconComponent = item.icon;
                const isSelected = selectedIndex === index;
                return (
                  <div
                    key={item.cmd}
                    onClick={() => handleExecuteCommand(item.cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-navy-900 border-lime-accent/50 shadow-sm"
                        : "bg-navy-950/60 border-navy-850 hover:bg-navy-900 hover:border-navy-750"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <IconComponent className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                      <span
                        className={`font-bold text-xs font-mono transition-colors truncate ${
                          isSelected ? "text-lime-accent" : "text-slate-200"
                        }`}
                      >
                        {item.cmd}
                      </span>
                      <span className="text-slate-400 text-[11px] font-sans truncate hidden sm:inline">
                        {item.desc}
                      </span>
                    </div>
                    <CornerDownLeft
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isSelected ? "text-lime-accent" : "text-slate-600"
                      }`}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {/* Matched Tools */}
              {searchResults.tools.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-lime-accent/80 uppercase tracking-wider font-bold mb-1">
                    Matching Tools ({searchResults.tools.length})
                  </div>
                  {searchResults.tools.map((tool, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => {
                          handleClose();
                          router.push(`/tool/${tool.slug}`);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-navy-900 border-lime-accent/50 shadow-sm"
                            : "bg-navy-950/60 border-navy-850 hover:bg-navy-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Code2
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? "text-lime-accent" : "text-slate-400"
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-xs font-mono truncate ${
                                  isSelected ? "text-lime-accent" : "text-slate-100"
                                }`}
                              >
                                {tool.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-300 font-mono">
                                {tool.pricing_model || "Free"}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-sans truncate max-w-md">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        <CornerDownLeft
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isSelected ? "text-lime-accent" : "text-slate-600"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Matched Categories */}
              {searchResults.categories.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] text-amber-400/80 uppercase tracking-wider font-bold mb-1">
                    Taxonomy Categories ({searchResults.categories.length})
                  </div>
                  {searchResults.categories.map((cat, index) => {
                    const itemIndex = searchResults.tools.length + index;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <div
                        key={cat.slug}
                        onClick={() => {
                          handleClose();
                          router.push(`/tools/${cat.slug}`);
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-navy-900 border-amber-400/50 shadow-sm"
                            : "bg-navy-950/60 border-navy-850 hover:bg-navy-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span
                            className={`font-bold text-xs font-mono truncate ${
                              isSelected ? "text-amber-400" : "text-slate-200"
                            }`}
                          >
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-sans truncate">
                            in {cat.sectionName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Category →</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {searchResults.tools.length === 0 && searchResults.categories.length === 0 && (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  No matching tools or commands found for &ldquo;{input}&rdquo;
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-navy-950 border-t border-navy-850 px-4 py-2.5 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>
            Tip: Press <kbd className="text-slate-300 font-bold px-1 bg-navy-850 border border-navy-750 rounded">Cmd+K</kbd> anywhere to open CLI
          </span>
          <span className="text-lime-accent font-semibold">Local Search Engine (&lt; 1ms)</span>
        </div>
      </div>
    </div>
  );
};
