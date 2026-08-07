"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeftRight, X, Trash2, ArrowRight } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { ToolFavicon } from "@/components/ui/ToolFavicon";

export const CompareTray: React.FC = () => {
  const { queuedTools, removeFromCompare, clearCompare } = useCompare();

  if (queuedTools.length === 0) return null;

  const compareUrl = `/compare?tools=${queuedTools.map((t) => t.slug).join(",")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 bg-navy-950/95 border border-lime-accent/40 text-slate-100 p-3 pl-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md font-mono text-xs max-w-md">
        {/* Compare Icon & Count Badge */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-accent/10 border border-lime-accent/30 text-lime-accent">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>{queuedTools.length} {queuedTools.length === 1 ? "tool" : "tools"} queued</span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans">
              {queuedTools.length < 2 ? "Select 1 more to compare" : "Ready for side-by-side audit"}
            </div>
          </div>
        </div>

        {/* Queued Tool Avatars */}
        <div className="flex items-center gap-1.5 border-l border-navy-800 pl-3 pr-1">
          {queuedTools.slice(0, 3).map((tool) => (
            <div
              key={tool.id}
              className="relative group/pill flex items-center gap-1 bg-navy-900 border border-navy-800 rounded-md px-1.5 py-1 text-[11px]"
              title={tool.name}
            >
              <ToolFavicon url={tool.url} name={tool.name} logoUrl={tool.logo_url} size={14} />
              <span className="truncate max-w-[70px] text-slate-300">{tool.name}</span>
              <button
                onClick={() => removeFromCompare(tool.id)}
                className="text-slate-500 hover:text-red-400 transition-colors ml-0.5"
                title={`Remove ${tool.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {queuedTools.length > 3 && (
            <span className="text-[10px] text-slate-500">+{queuedTools.length - 3}</span>
          )}
        </div>

        {/* Actions: Compare Button & Clear */}
        <div className="flex items-center gap-2 border-l border-navy-800 pl-3">
          <Link
            href={compareUrl}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
              queuedTools.length >= 2
                ? "bg-lime-accent text-navy-950 hover:bg-lime-400 shadow-sm"
                : "bg-navy-900 border border-navy-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            Compare <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={clearCompare}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-navy-900 transition-colors"
            title="Clear all queued tools"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
