import React from "react";
import Link from "next/link";
import { Terminal, Shield, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-navy-800 section-alt py-12 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 font-mono text-slate-100 font-bold">
            <Terminal className="w-4 h-4 text-lime-accent" aria-hidden="true" />
            <span>Crawlers</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Human-curated AI tools directory. Unvarnished editorial reviews, native API listings, and direct source links. Zero fake stats.
          </p>
          <div className="pt-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-lime-accent" aria-hidden="true" />
            <span>Inquiries &amp; Legal:</span>
            <a href="mailto:contact@crawlers.directory" className="text-slate-300 hover:text-lime-accent underline">
              contact@crawlers.directory
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] text-slate-200 uppercase tracking-[0.2em] mb-3">Directory</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>
              <Link href="/#sections" className="hover:text-lime-accent transition-colors">
                All 9 Sections
              </Link>
            </li>
            <li>
              <Link href="/tools" className="hover:text-lime-accent transition-colors">
                All Software Index
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
          <h4 className="font-mono text-[11px] text-slate-200 uppercase tracking-[0.2em] mb-3">Community</h4>
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
          <h4 className="font-mono text-[11px] text-slate-200 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-lime-accent" aria-hidden="true" />
            <span>Legal &amp; Policy</span>
          </h4>
          <ul className="space-y-2 text-xs font-mono">
            <li>
              <Link href="/privacy" className="hover:text-lime-accent transition-colors">
                Privacy Policy (DPDP)
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-lime-accent transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-lime-accent transition-colors">
                Cookies &amp; Storage
              </Link>
            </li>
            <li>
              <a href="mailto:grievance@crawlers.directory" className="hover:text-lime-accent transition-colors">
                Grievance Officer
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Trademark Disclaimer & Legal Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-navy-850 space-y-3 font-mono text-[11px] text-slate-400">
        <p className="font-sans leading-relaxed text-slate-400">
          <strong>Trademark Disclaimer:</strong> All third-party product names, logos, brands, and registered trademarks displayed on Crawlers are the property of their respective owners. Display is solely for descriptive identification and nominative fair use, and does not imply affiliation, sponsorship, or endorsement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-navy-900 text-slate-400">
          <div>&copy; {new Date().getFullYear()} Crawlers Directory &middot; Operated in India &middot; v1.26.0</div>
          <div>
            100% Free Public Catalog &middot; Zero automated affiliate feeds &middot; Zero algorithmic curation.
          </div>
        </div>
      </div>
    </footer>
  );
};
