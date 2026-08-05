import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-navy-800 bg-navy-950 py-12 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 font-mono text-slate-100 font-bold">
            <Terminal className="w-4 h-4 text-lime-accent" />
            <span>Crawlers</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Human-curated AI tools directory. Unvarnished editorial reviews, native API listings, and direct source links. Zero fake stats.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs text-slate-200 uppercase tracking-wider mb-3">Directory</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>
              <Link href="/#sections" className="hover:text-lime-accent transition-colors">
                All 9 Sections
              </Link>
            </li>
            <li>
              <Link href="/api" className="hover:text-lime-accent transition-colors">
                API Keys Registry
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-lime-accent transition-colors">
                Tool Comparison
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-slate-200 uppercase tracking-wider mb-3">Community</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>
              <Link href="/submit" className="hover:text-lime-accent transition-colors">
                Submit a Tool
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="hover:text-lime-accent transition-colors">
                Public Changelog
              </Link>
            </li>
            <li>
              <Link href="/style-guide" className="hover:text-lime-accent transition-colors">
                Design System
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-slate-200 uppercase tracking-wider mb-3">Ethical Standard</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            No purple/cyan templates. Direct links only. Editorial integrity guaranteed.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-navy-900 text-center font-mono text-[11px] text-slate-500">
        &copy; {new Date().getFullYear()} Crawlers AI Tools Directory. Built for developers &amp; creators.
      </div>
    </footer>
  );
};
