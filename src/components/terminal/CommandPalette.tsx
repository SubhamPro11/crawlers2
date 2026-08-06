"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, CornerDownLeft, Shuffle, GitCompare, Search, X } from "lucide-react";
import { MOCK_TOOLS } from "@/lib/mockData";

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setInput("");
  };

  // Command handlers
  const handleExecuteCommand = (commandStr: string) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    handleClose();

    if (trimmed.startsWith("crawlers --random") || trimmed === "random" || trimmed === "/random") {
      const randomIndex = Math.floor(Math.random() * MOCK_TOOLS.length);
      const randomTool = MOCK_TOOLS[randomIndex];
      router.push(`/tool/${randomTool.slug}`);
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
        const match = MOCK_TOOLS.find(
          (t) =>
            t.name.toLowerCase().includes(queryStr.toLowerCase()) ||
            t.slug.toLowerCase().includes(queryStr.toLowerCase())
        );
        if (match) {
          router.push(`/tool/${match.slug}`);
        } else {
          router.push(`/#sections`);
        }
      }
      return;
    }

    // Default search fallback
    const match = MOCK_TOOLS.find(
      (t) =>
        t.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        t.slug.toLowerCase().includes(trimmed.toLowerCase())
    );
    if (match) {
      router.push(`/tool/${match.slug}`);
    } else {
      router.push(`/#sections`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-navy-950 border border-lime-accent/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden font-mono text-slate-100 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150">
        {/* Terminal Title Bar */}
        <div className="bg-navy-900 border-b border-navy-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-lime-accent" /> crawlers-cli v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">ESC to close</span>
            <button onClick={handleClose} className="text-slate-500 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command Input Bar */}
        <div className="p-4 bg-navy-900/60 border-b border-navy-850 flex items-center gap-3">
          <span className="text-lime-accent font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleExecuteCommand(input);
              }
            }}
            placeholder="type 'crawlers --random', 'crawlers --compare ollama cursor', or search..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm"
          />
          <kbd className="px-2 py-0.5 text-[10px] bg-navy-850 border border-navy-700 rounded text-slate-400">
            ENTER
          </kbd>
        </div>

        {/* Preset Command Hints */}
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto divide-y divide-navy-850">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            Suggested Terminal Commands
          </div>

          <div
            onClick={() => handleExecuteCommand("crawlers --random")}
            className="pt-2 flex items-center justify-between p-2 rounded hover:bg-navy-850 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs">
              <Shuffle className="w-4 h-4 text-lime-accent" />
              <span className="text-slate-200 font-bold group-hover:text-lime-accent">
                crawlers --random
              </span>
              <span className="text-slate-500 text-[11px]">- Surprise me with a random tool</span>
            </div>
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
          </div>

          <div
            onClick={() => handleExecuteCommand("crawlers --compare ollama cursor")}
            className="pt-2 flex items-center justify-between p-2 rounded hover:bg-navy-850 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs">
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200 font-bold group-hover:text-cyan-400">
                crawlers --compare ollama cursor
              </span>
              <span className="text-slate-500 text-[11px]">- Side-by-side tool comparison</span>
            </div>
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
          </div>

          <div
            onClick={() => handleExecuteCommand("crawlers --search devtools")}
            className="pt-2 flex items-center justify-between p-2 rounded hover:bg-navy-850 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200 font-bold group-hover:text-amber-400">
                crawlers --search devtools
              </span>
              <span className="text-slate-500 text-[11px]">- Instant directory category query</span>
            </div>
            <CornerDownLeft className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300" />
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-navy-950 border-t border-navy-850 px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tip: Press <kbd className="text-slate-300 font-bold">Cmd+K</kbd> anywhere to open CLI</span>
          <span className="text-lime-accent font-semibold">Crawlers Terminal Engine</span>
        </div>
      </div>
    </div>
  );
};
