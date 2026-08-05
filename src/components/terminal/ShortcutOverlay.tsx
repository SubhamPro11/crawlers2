"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, X, Terminal, Compass, Zap } from "lucide-react";

export const ShortcutOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // '?' key opens shortcut modal
      if (e.key === "?") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        setPendingG(false);
        return;
      }

      // '/' focuses search or opens palette
      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        } else {
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true })
          );
        }
        return;
      }

      // Handle 'g' sequence chords
      if (e.key === "g" && !pendingG) {
        setPendingG(true);
        timer = setTimeout(() => setPendingG(false), 1000);
        return;
      }

      if (pendingG) {
        setPendingG(false);
        clearTimeout(timer);
        if (e.key === "h") {
          router.push("/");
        } else if (e.key === "a") {
          router.push("/api");
        } else if (e.key === "c") {
          router.push("/compare");
        } else if (e.key === "r") {
          router.push("/random");
        } else if (e.key === "l") {
          router.push("/changelog");
        } else if (e.key === "s") {
          router.push("/submit");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, pendingG, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-navy-950 border border-lime-accent/50 rounded-lg shadow-2xl overflow-hidden font-mono text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-navy-900 border-b border-navy-800 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Keyboard className="w-4 h-4 text-lime-accent" />
            <span>Terminal Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Global Shortcuts */}
          <div className="space-y-3">
            <div className="text-xs text-lime-accent font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-navy-850 pb-1">
              <Zap className="w-3.5 h-3.5" /> Core Global Actions
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Shortcut Cheat Sheet</span>
                <kbd className="px-2 py-0.5 bg-navy-800 border border-navy-700 rounded text-lime-accent font-bold">
                  ?
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Command Palette</span>
                <kbd className="px-2 py-0.5 bg-navy-800 border border-navy-700 rounded text-lime-accent font-bold">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Focus Search Input</span>
                <kbd className="px-2 py-0.5 bg-navy-800 border border-navy-700 rounded text-lime-accent font-bold">
                  /
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Dismiss Overlay</span>
                <kbd className="px-2 py-0.5 bg-navy-800 border border-navy-700 rounded text-slate-400">
                  ESC
                </kbd>
              </div>
            </div>
          </div>

          {/* Quick Jump Chords */}
          <div className="space-y-3">
            <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-navy-850 pb-1">
              <Compass className="w-3.5 h-3.5" /> Quick Navigation Chords (Press &apos;g&apos; then key)
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Go to Homepage</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">h</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Go to API Registry</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">a</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Go to Tool Compare</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">c</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Surprise Me (Random)</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">r</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Go to Changelog</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">l</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-navy-900 border border-navy-850">
                <span className="text-slate-300">Submit Tool</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-slate-300">g</kbd>
                  <kbd className="px-1.5 py-0.5 bg-navy-800 rounded text-cyan-400 font-bold">s</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-navy-900 border-t border-navy-800 px-5 py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Press <kbd className="text-slate-300 font-bold">?</kbd> to toggle this menu anytime</span>
          <span className="text-lime-accent font-semibold flex items-center gap-1">
            <Terminal className="w-3 h-3" /> Keyboard Mode Active
          </span>
        </div>
      </div>
    </div>
  );
};
