import React from "react";

interface IndexStatusLineProps {
  toolCount?: number;
  lastUpdatedText?: string;
}

export const IndexStatusLine: React.FC<IndexStatusLineProps> = ({
  toolCount = 8,
  lastUpdatedText = "14 minutes ago",
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-navy-900 border border-navy-800 font-mono text-xs text-slate-400">
      <span className="w-2 h-2 rounded-full bg-lime-accent animate-pulse shrink-0"></span>
      <span>
        Index status: <strong className="text-slate-200">{toolCount} tools active</strong> • Last indexed: {lastUpdatedText} • Manual verification mode
      </span>
    </div>
  );
};
