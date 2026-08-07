"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Bookmark, Code2, ArrowLeftRight } from "lucide-react";
import { Badge } from "./Badge";
import { ToolFavicon } from "./ToolFavicon";
import { PricingModel } from "@/types/database";
import { useCompare } from "@/context/CompareContext";

export interface ToolCardProps {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  pricingModel: PricingModel;
  logoUrl?: string | null;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  hasApi?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  className?: string;
  indexHex?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  slug,
  url,
  description,
  pricingModel,
  logoUrl,
  categoryName,
  categorySlug,
  tags = [],
  hasApi = false,
  isBookmarked = false,
  onBookmarkToggle,
  className = "",
  indexHex,
}) => {
  const { toggleCompare, isInCompare } = useCompare();
  const isQueued = isInCompare(id) || isInCompare(slug);
  const isTemplated = description.includes("Indexed for fast search");
  const hexCode = indexHex || (id ? id.replace(/[^a-f0-9]/gi, "").slice(0, 4) : "3f2a");

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-xl border border-navy-800 bg-navy-900/90 hover:border-lime-accent/30 hover:shadow-[0_0_24px_-6px_rgba(163,230,53,0.12)] transition-all duration-300 card-lift ${className}`}
    >
      {/* Subtle hover index ID matching section // 0X. framing */}
      <div className="absolute top-3 right-3 font-mono text-[10px] text-lime-accent/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none tracking-widest bg-navy-950/80 px-1.5 py-0.5 rounded border border-lime-accent/20">
        #{hexCode}
      </div>

      <div>
        {/* Card Header: 42px Thumbnail Slot + Name & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5 pr-8">
            {/* Thumbnail slot (42px) */}
            <div className="w-[42px] h-[42px] rounded-lg bg-navy-950 border border-navy-800 flex items-center justify-center p-1 group-hover:border-lime-accent/40 transition-colors shrink-0 shadow-inner">
              <ToolFavicon url={url} name={name} logoUrl={logoUrl} size={30} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/tool/${slug}`}
                  className="font-mono text-base font-bold text-slate-100 group-hover:text-lime-accent transition-colors underline-offset-4 hover:underline"
                >
                  {name}
                </Link>
                {hasApi && (
                  <span
                    title="API Available"
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-950 text-lime-accent border border-lime-accent/30"
                  >
                    <Code2 className="w-3 h-3" /> API
                  </span>
                )}
                {isTemplated ? (
                  <span
                    title="Pending distinct editorial review"
                    className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/90 border border-amber-500/25"
                  >
                    Needs Review
                  </span>
                ) : (
                  <span
                    title="Editorially verified positioning"
                    className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20"
                  >
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge pricingModel={pricingModel}>{pricingModel}</Badge>
                
                {/* Compare Quick-Action Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCompare({ id, name, slug, url, logo_url: logoUrl, pricing_model: pricingModel });
                  }}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-all border ${
                    isQueued
                      ? "bg-lime-accent/15 text-lime-accent border-lime-accent/40 font-bold"
                      : "bg-navy-950 text-slate-400 border-navy-800 hover:border-navy-700 hover:text-slate-200"
                  }`}
                  title={isQueued ? "Remove from compare queue" : "Add to compare matrix"}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>{isQueued ? "Queued" : "+ Compare"}</span>
                </button>
              </div>
            </div>
          </div>

          {onBookmarkToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onBookmarkToggle(id);
              }}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                isBookmarked
                  ? "text-lime-accent bg-lime-accent/10 border border-lime-accent/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-navy-800"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Save Tool"}
              aria-label="Bookmark Tool"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* Category Badge */}
        {categoryName && (
          <div className="mb-3 text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>in</span>
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="text-slate-300 hover:text-lime-accent transition-colors"
              >
                {categoryName}
              </Link>
            ) : (
              <span>{categoryName}</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">{description}</p>
      </div>

      {/* Card Footer: Direct Link & Tag Pills */}
      <div className="pt-3 border-t border-navy-850 flex items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-slate-400 bg-navy-850 px-2 py-0.5 rounded-md border border-navy-800"
            >
              #{tag}
            </span>
          ))}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950 border border-lime-accent/40 text-lime-accent hover:bg-lime-accent hover:text-navy-950 font-mono text-xs font-semibold transition-all shrink-0"
        >
          {pricingModel === "open-source"
            ? "→ source"
            : hasApi
            ? "> api"
            : "open →"}{" "}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
