import React from "react";
import Link from "next/link";
import { ArrowLeft, History, Check, Rss, FileCode } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { CHANGELOG_ENTRIES } from "@/lib/changelogData";

export const metadata = {
  title: "Public Changelog & Release Notes | Crawlers",
  description: "Chronological log of directory features, database schema updates, and taxonomy additions.",
  alternates: {
    types: {
      "application/rss+xml": "/changelog/rss.xml",
      "application/feed+json": "/changelog/feed.json",
    },
  },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Changelog</span>
        </div>

        {/* Page Header with RSS & JSON Feed Links */}
        <div className="border-b border-navy-800 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-navy-850 border border-navy-700 font-mono text-xs text-lime-accent">
              <History className="w-3.5 h-3.5" />
              <span>Public Release Log</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <a
                href="/changelog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-navy-900 border border-navy-700 text-amber-400 hover:border-amber-400/50 transition-colors"
              >
                <Rss className="w-3.5 h-3.5 text-amber-400" /> RSS Feed
              </a>
              <a
                href="/changelog/feed.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-navy-900 border border-navy-700 text-cyan-400 hover:border-cyan-400/50 transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" /> JSON Feed
              </a>
            </div>
          </div>

          <h1 className="font-mono text-3xl font-extrabold tracking-[-0.03em] text-slate-100">
            Crawlers Public Changelog
          </h1>
          <p className="text-sm text-slate-400 font-sans">
            Transparent record of platform features, taxonomy updates, and architectural changes.
          </p>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-navy-800">
          {CHANGELOG_ENTRIES.map((entry) => (
            <div key={entry.version} className="relative pl-8 space-y-3 font-sans">
              {/* Timeline Bullet */}
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-lime-accent ring-4 ring-navy-950" />

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <Badge variant="lime">{entry.version}</Badge>
                <span className="text-slate-500">{entry.date}</span>
              </div>

              <h2 className="font-mono text-xl font-bold text-slate-100 tracking-[-0.01em]">{entry.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{entry.description}</p>

              <ul className="space-y-1.5 pt-2 font-mono text-xs text-slate-400">
                {entry.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-lime-accent shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
