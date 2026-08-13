import React from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { ToolsGridSkeleton } from "@/components/ui/ToolCardSkeleton";

export default function ToolsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay font-mono">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </span>
          <span>/</span>
          <span className="text-lime-accent">Tool Index</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-lime-accent animate-pulse" /> Complete AI Tools Directory
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-sans max-w-3xl leading-relaxed">
            Streaming verified software index from directory cache...
          </p>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-wrap items-center justify-between border-b border-navy-800 pb-4 gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
            <span>Loading tools index...</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-32 bg-navy-900 border border-navy-800 rounded-lg animate-pulse" />
            <div className="h-8 w-28 bg-navy-900 border border-navy-800 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-navy-900 border border-navy-800 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* 6-Card Grid Skeleton */}
        <ToolsGridSkeleton count={6} />
      </main>
    </div>
  );
}
