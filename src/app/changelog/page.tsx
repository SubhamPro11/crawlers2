import React from "react";
import Link from "next/link";
import { ArrowLeft, History, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Public Changelog & Release Notes | Crawlers",
  description: "Chronological log of directory features, database schema updates, and taxonomy additions.",
};

const CHANGELOG_ENTRIES = [
  {
    version: "v1.2.0",
    date: "2026-08-05",
    title: "Core Pages & Route Shells Scaffolded",
    description: "Delivered 8 top-level application routes with full Next.js metadata, terminal-navy styling, and static dataset wrappers.",
    highlights: [
      "Added `/`, `/[section]`, `/[section]/[category]`, and `/tool/[slug]` route shells",
      "Added `/compare` side-by-side comparison matrix",
      "Added `/submit` community submission form",
      "Added `/api` API Keys Registry view",
      "Added `/changelog` public changelog log",
    ],
  },
  {
    version: "v1.1.0",
    date: "2026-08-04",
    title: "Design System & Visual Identity Baseline",
    description: "Configured terminal-inspired dark navy background (`#060A14`) and lime-green accent theme in Tailwind CSS v4.",
    highlights: [
      "Integrated `JetBrains_Mono` for headings/chrome and `Inter` for body text",
      "Built base component library: `Button`, `Badge`, `Input`, `ToolCard`, `EmptyState`, `Skeleton`",
      "Built `/style-guide` dev playground",
      "Zero purple/cyan SaaS gradients or sparkle icons",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-08-03",
    title: "Initial Taxonomy & Database Schema Design",
    description: "Designed 9-section information architecture and authored initial SQL database schema with Row Level Security.",
    highlights: [
      "Authored `20260805000000_initial_schema.sql` Supabase migration",
      "Defined custom ENUMs for pricing models and submission status",
      "Authored 9 top-level taxonomy sections and 40+ categories in `supabase/seed.sql`",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100">
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

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-navy-850 border border-navy-700 font-mono text-xs text-lime-accent">
            <History className="w-3.5 h-3.5" />
            <span>Public Release Log</span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-slate-100">
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

              <h2 className="font-mono text-xl font-bold text-slate-100">{entry.title}</h2>
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
