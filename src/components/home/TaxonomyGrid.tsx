import React from "react";
import Link from "next/link";
import {
  Type,
  Film,
  Image as ImageIcon,
  Code2,
  BarChart3,
  Bot,
  Database,
  Shield,
  GraduationCap,
} from "lucide-react";
import { SectionSeed } from "@/lib/taxonomy";

/* One distinct icon per taxonomy section — semantically mapped, not decorative */
const SECTION_ICONS: Record<string, React.ReactNode> = {
  "text-writing": <Type className="w-4 h-4" />,
  "audio-video-media": <Film className="w-4 h-4" />,
  "image-design": <ImageIcon className="w-4 h-4" />,
  "code-development": <Code2 className="w-4 h-4" />,
  "data-analytics": <BarChart3 className="w-4 h-4" />,
  "ai-assistants-agents": <Bot className="w-4 h-4" />,
  "infrastructure-devops": <Database className="w-4 h-4" />,
  "security-compliance": <Shield className="w-4 h-4" />,
  "education-lifestyle": <GraduationCap className="w-4 h-4" />,
};

interface TaxonomyGridProps {
  sections: SectionSeed[];
}

export const TaxonomyGrid: React.FC<TaxonomyGridProps> = ({ sections }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => {
        // Section 9 (Education & Lifestyle, 6 categories) gets a distinct layout span & treatment
        const isFeatured = section.categories.length > 5;
        const sectionIcon = SECTION_ICONS[section.slug];

        return (
          <div
            key={section.slug}
            className={`p-6 rounded-xl border border-navy-800 bg-navy-900/60 hover:border-lime-accent/20 hover:shadow-[0_0_24px_-6px_rgba(163,230,53,0.06)] transition-all duration-300 card-lift flex flex-col justify-between ${
              isFeatured
                ? "md:col-span-2 lg:col-span-2 border-lime-accent/40 bg-navy-900"
                : ""
            }`}
          >
            <div>
              {/* Left-aligned integrated index marker in heading */}
              <div className="flex items-center gap-2.5 mb-2 font-mono">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-lime-accent/10 border border-lime-accent/20 text-lime-accent shrink-0">
                  {sectionIcon || <span className="text-xs font-bold">0{section.number}</span>}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lime-accent/70 font-bold text-xs tracking-[0.15em]">
                    0{section.number} {"//"}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 tracking-[-0.01em]">
                    <Link
                      href={`/${section.slug}`}
                      className="hover:text-lime-accent transition-colors"
                    >
                      {section.name}
                    </Link>
                  </h3>
                </div>
              </div>

              <p className="text-[13px] text-slate-400 font-sans leading-relaxed mb-5">
                {section.description}
              </p>
            </div>

            {/* Category Tags Layout */}
            <div className="p-6 pt-4 border-t border-navy-850 bg-navy-950/40">
              <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                Sub-Categories ({section.categories.length})
              </div>
              <div
                className={`grid gap-2 ${
                  isFeatured ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {section.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${section.slug}/${cat.slug}`}
                    className="font-mono text-xs text-slate-300 hover:text-lime-accent hover:translate-x-0.5 transition-all truncate flex items-center gap-1.5"
                  >
                    <span className="text-slate-600 text-[10px]">&gt;</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
