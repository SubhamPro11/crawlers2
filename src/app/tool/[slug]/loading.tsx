import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ToolsGridSkeleton } from "@/components/ui/ToolCardSkeleton";

export default function ToolDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay font-mono">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </span>
          <span>/</span>
          <span className="text-lime-accent animate-pulse">Loading Tool...</span>
        </div>

        {/* Main Detail Header Card Skeleton */}
        <div className="p-8 rounded-xl border border-navy-800 bg-navy-900/80 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3 flex-1 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-navy-800 border border-navy-750 shrink-0 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-48 bg-navy-800 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-navy-850 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3.5 w-full bg-navy-850/80 rounded animate-pulse" />
                <div className="h-3.5 w-5/6 bg-navy-850/80 rounded animate-pulse" />
                <div className="h-3.5 w-4/6 bg-navy-850/60 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-10 w-32 bg-navy-850 border border-navy-800 rounded-lg animate-pulse" />
              <div className="h-10 w-28 bg-navy-850 border border-navy-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Related Tools Skeleton Section */}
        <div className="space-y-4 pt-6 border-t border-navy-850">
          <div className="h-4 w-40 bg-navy-850 rounded animate-pulse" />
          <ToolsGridSkeleton count={3} />
        </div>
      </main>
    </div>
  );
}
