"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, CornerDownLeft, Shuffle, ArrowLeftRight, Search, X } from "lucide-react";
import { MOCK_TOOLS } from "@/lib/mockData";

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
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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
                setSelectedIndex((prev) => (prev + 1) % SUGGESTED_COMMANDS.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + SUGGESTED_COMMANDS.length) % SUGGESTED_COMMANDS.length);
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (input.trim()) {
                  handleExecuteCommand(input);
                } else {
                  handleExecuteCommand(SUGGESTED_COMMANDS[selectedIndex].cmd);
                }
              }
            }}
            placeholder="Type 'crawlers --random', '--compare', or search tools..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm truncate"
          />
          <kbd className="px-2 py-1 text-[10px] bg-navy-850 border border-navy-700 rounded text-slate-400 font-bold shrink-0">
            ENTER ↵
          </kbd>
        </div>

        {/* Suggested Terminal Commands List */}
        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
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
                  <span className={`font-bold text-xs font-mono transition-colors truncate ${isSelected ? "text-lime-accent" : "text-slate-200"}`}>
                    {item.cmd}
                  </span>
                  <span className="text-slate-400 text-[11px] font-sans truncate hidden sm:inline">
                    {item.desc}
                  </span>
                </div>
                <CornerDownLeft className={`w-3.5 h-3.5 shrink-0 transition-colors ${isSelected ? "text-lime-accent" : "text-slate-600"}`} />
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-navy-950 border-t border-navy-850 px-4 py-2.5 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Tip: Press <kbd className="text-slate-300 font-bold px-1 bg-navy-850 border border-navy-750 rounded">Cmd+K</kbd> anywhere to open CLI</span>
          <span className="text-lime-accent font-semibold">Crawlers Terminal Engine</span>
        </div>
      </div>
    </div>
  );
};
