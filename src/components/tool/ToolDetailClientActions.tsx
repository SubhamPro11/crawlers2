"use client";

import React, { useState } from "react";
import { Flag, Copy, Check } from "lucide-react";
import { LinkReportModal } from "./LinkReportModal";

interface ToolDetailClientActionsProps {
  toolId: string;
  toolName: string;
  toolSlug: string;
  toolUrl: string;
  hasApi: boolean;
}

export const ToolDetailClientActions: React.FC<ToolDetailClientActionsProps> = ({
  toolId,
  toolName,
  toolSlug,
  toolUrl,
  hasApi,
}) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const apiSnippet = `curl "https://crawlers.dev/api/tools?tag=${toolSlug}"`;

  const handleCopyApi = () => {
    navigator.clipboard.writeText(apiSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-navy-850 font-mono text-xs relative">
        <div className="flex items-center gap-2">
          {hasApi && (
            <button
              onClick={handleCopyApi}
              className="px-3 py-1.5 rounded-lg bg-navy-850 border border-navy-700 text-lime-accent hover:bg-navy-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied API Endpoint!" : "Copy API Curl Snippet"}</span>
            </button>
          )}
        </div>

        {copied && (
          <div className="fixed top-20 right-6 z-50 toast-notification px-4 py-2 text-xs font-mono text-lime-accent flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <Check className="w-4 h-4" />
            <span>Endpoint curl command copied to clipboard</span>
          </div>
        )}

        <button
          onClick={() => setReportOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <span>Report Broken Link</span>
        </button>
      </div>

      <LinkReportModal
        toolId={toolId}
        toolName={toolName}
        toolUrl={toolUrl}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
};
