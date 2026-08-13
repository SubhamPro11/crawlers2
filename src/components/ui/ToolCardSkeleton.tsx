import React from "react";

export interface ToolCardSkeletonProps {
  className?: string;
}

export const ToolCardSkeleton: React.FC<ToolCardSkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative p-6 rounded-xl border border-navy-800 bg-navy-900/70 flex flex-col justify-between space-y-4 font-mono select-none overflow-hidden ${className}`}
    >
      {/* Subtle CRT terminal scan line indicator */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-accent/40 animate-pulse" />
        <span className="text-[9px] text-slate-600 tracking-wider">SYNCING</span>
      </div>

      <div className="space-y-4">
        {/* Header: Favicon + Title + Badge */}
        <div className="flex items-start gap-3">
          <div className="w-[42px] h-[42px] rounded-md bg-navy-800/90 border border-navy-750 shrink-0 animate-pulse" />
          <div className="space-y-2 min-w-0 flex-1 pt-0.5">
            <div className="h-4.5 w-3/5 bg-navy-800/90 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-16 bg-navy-850 rounded border border-navy-800 animate-pulse" />
              <div className="h-3.5 w-14 bg-navy-850/60 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Description skeleton lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full bg-navy-850/70 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-navy-850/70 rounded animate-pulse" />
          <div className="h-3 w-4/6 bg-navy-850/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="pt-3 border-t border-navy-850/80 flex items-center justify-between gap-3">
        <div className="flex gap-1.5">
          <div className="h-4 w-12 bg-navy-850/80 rounded border border-navy-800 animate-pulse" />
          <div className="h-4 w-14 bg-navy-850/60 rounded border border-navy-800 animate-pulse" />
        </div>
        <div className="h-4 w-16 bg-navy-850/80 rounded animate-pulse" />
      </div>
    </div>
  );
};

export const ToolsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
};
