import React from "react";
import Link from "next/link";
import { SectionSeed } from "@/lib/taxonomy";

interface TaxonomyGridProps {
  sections: SectionSeed[];
}

export const TaxonomyGrid: React.FC<TaxonomyGridProps> = ({ sections }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => {
        // Section 9 (Education & Lifestyle, 6 categories) gets a distinct layout span & treatment
        const isFeatured = section.categories.length > 5;

        return (
          <div
            key={section.slug}
            className={`p-6 rounded border border-navy-800 bg-navy-900/60 hover:border-navy-700 transition-all flex flex-col justify-between ${
              isFeatured
                ? "md:col-span-2 lg:col-span-2 border-lime-accent/40 bg-navy-900"
                : ""
            }`}
          >
            <div>
              {/* Left-aligned integrated index marker in heading */}
              <div className="flex items-baseline gap-2 mb-2 font-mono">
                <span className="text-lime-accent font-bold text-sm">
                  0{section.number} {"//"}
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  <Link
                    href={`/${section.slug}`}
                    className="hover:text-lime-accent transition-colors"
                  >
                    {section.name}
                  </Link>
                </h3>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed mb-5">
                {section.description}
              </p>
            </div>

            {/* Category Tags Layout */}
            <div className="p-6 pt-4 border-t border-navy-850 bg-navy-950/40">
              <div className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mb-2">
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
