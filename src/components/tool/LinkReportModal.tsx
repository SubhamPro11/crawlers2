"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flag, X, CheckCircle2, AlertCircle, Lock, LogIn } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase, signInWithGoogle } from "@/lib/supabase";

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
  const router = useRouter();
  const [reason, setReason] = useState("404 Link Broken / Site Down");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(Boolean(supabase));

  const handleCloseModal = () => {
    setSubmitted(false);
    setSubmitError(null);
    setReason("404 Link Broken / Site Down");
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !supabase) return;

    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setUser(data.user ?? null);
        setAuthChecking(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    if (!supabase) {
      setSubmitError("Database connection unavailable — try again.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("link_reports").insert([
        {
          tool_id: toolId,
          reason: reason,
          status: "pending",
          reported_at: new Date().toISOString(),
          reporter_id: user?.id ?? null,
        },
      ]);

      if (error) {
        console.error("Report submit error:", error);
        setSubmitError("Something went wrong — try again.");
      } else {
        setSubmitted(true);
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      }
    } catch (err: unknown) {
      console.error("Report submit error:", err);
      setSubmitError("Something went wrong — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-navy-800 bg-navy-900 font-mono text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150">
        <div className="px-5 py-3 border-b border-navy-800 flex items-center justify-between bg-navy-950">
          <div id="report-modal-title" className="text-[11px] text-slate-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <Flag className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" /> report_broken_link
          </div>
          <button
            onClick={handleCloseModal}
            aria-label="Close report dialog"
            className="text-slate-400 hover:text-slate-100 cursor-pointer p-1"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {authChecking ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              auth_syncing...
            </div>
          ) : !user ? (
            <div className="p-2 text-center space-y-4 font-mono">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-100">Sign in to report this problem</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Reporting broken links or endpoint errors for <strong className="text-slate-200 font-semibold">{toolName}</strong> requires an authenticated account.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    const currentUrl =
                      typeof window !== "undefined"
                        ? `${window.location.pathname}${window.location.search}`
                        : "/";
                    const { error } = await signInWithGoogle(currentUrl);
                    if (error) {
                      console.error("[Modal] Google sign-in failed:", error);
                      router.push(
                        `/login?error=initiation_failed&error_description=${encodeURIComponent(error)}&next=${encodeURIComponent(currentUrl)}`
                      );
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-navy-850 border border-navy-700 text-slate-200 hover:text-lime-accent hover:border-lime-accent/50 transition-colors flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-lime-accent" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          ) : submitted ? (
            <div className="p-4 text-center space-y-3 font-mono">
              <CheckCircle2 className="w-10 h-10 text-lime-accent mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-100">Thanks — your report has been logged</h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Our editorial team will verify target URL availability and licensing state.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-1.5 rounded-full bg-navy-850 border border-navy-700 text-slate-200 hover:text-lime-accent hover:border-lime-accent/50 transition-colors text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
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
                <label htmlFor="report-reason-select" className="text-slate-300 font-semibold block cursor-pointer">
                  $ issue_type
                </label>
                <select
                  id="report-reason-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-navy-900 border border-navy-800 text-slate-100 focus:outline-none focus:border-lime-accent cursor-pointer"
                >
                  <option value="404 Link Broken / Site Down">404 Link Broken / Site Down</option>
                  <option value="Redirected to Spam or Domain Parked">Redirected to Spam / Domain Parked</option>
                  <option value="API Endpoint Deprecated or Restricted">API Endpoint Deprecated or Restricted</option>
                  <option value="Licensing / Pricing Model Changed">Licensing / Pricing Model Changed</option>
                </select>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-navy-950 border border-navy-800 text-[11px] text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-lime-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Report metadata and your account ID are logged strictly for link maintenance and spam moderation in accordance with our{" "}
                  <Link href="/privacy" target="_blank" className="text-lime-accent underline font-mono">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-1.5 rounded-full bg-navy-900 border border-navy-800 text-slate-400 hover:text-slate-200 cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-1.5 rounded-full bg-amber-400 text-navy-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer disabled:opacity-50"
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
