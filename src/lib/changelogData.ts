export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  highlights: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
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
