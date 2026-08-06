"use client";

import React, { useState } from "react";
import { Flag, X, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LinkReportModalProps {
  toolId: string;
  toolName: string;
  toolUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LinkReportModal: React.FC<LinkReportModalProps> = ({
  toolId,
  toolName,
  toolUrl,
  isOpen,
  onClose,
}) => {
  const [reason, setReason] = useState("404 Link Broken / Site Down");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (supabase) {
      try {
        await supabase.from("link_reports").insert([
          {
            tool_id: toolId,
            reason: reason,
            status: "pending",
            reported_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error("Report submit error:", err);
      }
    }

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-navy-800 bg-navy-900 font-mono text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150">
        <div className="px-5 py-3 border-b border-navy-800 flex items-center justify-between bg-navy-950">
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Flag className="w-3.5 h-3.5 text-amber-400" /> report_broken_link
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="toast-notification p-6 text-center space-y-2 text-lime-accent">
              <Check className="w-8 h-8 mx-auto" />
              <div className="font-bold">Report Logged into Admin Triage Queue</div>
              <p className="text-xs text-slate-400 font-sans">
                Thank you for keeping the directory clean and audited.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-amber-400 font-bold block">
                  Report Broken Link: {toolName}
                </span>
                <p className="text-slate-400 font-sans text-[11px]">
                  Target URL: <span className="text-slate-200">{toolUrl}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">$ issue_type</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-navy-900 border border-navy-800 text-slate-100 focus:outline-none focus:border-lime-accent"
                >
                  <option value="404 Link Broken / Site Down">404 Link Broken / Site Down</option>
                  <option value="Redirected to Spam or Domain Parked">Redirected to Spam / Domain Parked</option>
                  <option value="API Endpoint Deprecated or Restricted">API Endpoint Deprecated or Restricted</option>
                  <option value="Licensing / Pricing Model Changed">Licensing / Pricing Model Changed</option>
                </select>
              </div>

              <div className="p-3 rounded bg-navy-900 border border-navy-850 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-lime-accent shrink-0 mt-0.5" />
                <span>
                  Reports directly trigger maintainer triage in the `/admin` control plane.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-full bg-navy-900 border border-navy-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-1.5 rounded-full bg-amber-400 text-navy-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  {loading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
