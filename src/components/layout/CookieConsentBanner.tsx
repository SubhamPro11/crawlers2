"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem("crawlers_consent_dismissed") === "true";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true; // Don't show during SSR
}

export const CookieConsentBanner: React.FC = () => {
  const isDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [manualDismissed, setManualDismissed] = useState(false);

  const handleDismiss = () => {
    try {
      localStorage.setItem("crawlers_consent_dismissed", "true");
    } catch {
      // Ignore
    }
    setManualDismissed(true);
  };

  if (isDismissed || manualDismissed) return null;

  return (
    <aside
      role="region"
      aria-label="Privacy and Cookie Notification"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-navy-950/95 backdrop-blur-md border-t border-navy-700 shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-start gap-3 text-slate-300">
          <div className="w-8 h-8 rounded-lg bg-lime-accent/10 border border-lime-accent/30 text-lime-accent flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Cookie className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>Zero-Tracker Architecture &middot; Essential Storage Notice</span>
            </div>
            <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-3xl">
              Crawlers uses essential session cookies (for sign-in) and local storage (for your compare queue). We do{" "}
              <strong className="text-slate-200 font-semibold">not</strong> deploy third-party advertising cookies or cross-site tracking pixels. Read our{" "}
              <Link href="/cookies" className="text-lime-accent hover:underline">
                Cookies Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-lime-accent hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleDismiss}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-lime-accent text-navy-950 font-bold hover:bg-lime-hover transition-colors text-xs cursor-pointer shadow-sm shadow-lime-accent/20"
          >
            <Check className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Acknowledge &amp; Close</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss cookie notice"
            className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
