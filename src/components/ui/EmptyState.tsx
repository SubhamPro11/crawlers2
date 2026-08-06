import React from "react";
import { Terminal } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  codeSnippet?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No results found",
  description = "No tools matched your filter criteria or query.",
  action,
  icon,
  codeSnippet,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-xl border border-navy-800 bg-navy-900/60 font-sans ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-navy-850 border border-navy-700 flex items-center justify-center text-slate-400 mb-4">
        {icon || <Terminal className="w-6 h-6 text-lime-accent" />}
      </div>
      <h3 className="text-lg font-mono font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {codeSnippet && (
        <div className="w-full max-w-sm bg-navy-950 border border-navy-800 rounded-lg p-3 text-left font-mono text-xs text-slate-400 mb-6">
          <span className="text-lime-accent">&gt;</span> {codeSnippet}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
