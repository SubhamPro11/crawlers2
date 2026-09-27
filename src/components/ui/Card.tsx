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

export const ToolCard: React.FC<ToolCardProps> = React.memo(({
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
      className={`group relative p-6 rounded-xl border border-navy-800 bg-navy-900/90 hover:border-lime-accent/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_24px_-6px_rgba(163,230,53,0.12)] card-lift ${className}`}
    >
      {/* Upper Section: Title, Badges, Header Metadata */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar / Favicon Slot */}
          <div className="flex items-center gap-3 min-w-0">
            <ToolFavicon url={url} name={name} logoUrl={logoUrl} size={42} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/tool/${slug}`}
                  className="font-mono text-lg font-bold tracking-tight text-slate-100 group-hover:text-lime-accent transition-colors truncate"
                >
                  {name}
                </Link>
                {isTemplated ? (
                  <span
                    title="Automated entry pending distinct editorial review"
                    className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0"
                  >
                    Needs Review
                  </span>
                ) : (
                  <span
                    title="Editorially verified positioning"
                    className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20 shrink-0"
                  >
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge pricingModel={pricingModel}>{pricingModel}</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Quick-Action Button - Fixed top-right placement */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleCompare({ id, name, slug, url, logo_url: logoUrl, pricing_model: pricingModel });
              }}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition-all border ${
                isQueued
                  ? "bg-lime-accent/15 text-lime-accent border-lime-accent/40 font-bold"
                  : "bg-navy-950 text-slate-400 border-navy-800 hover:border-navy-700 hover:text-slate-200"
              }`}
              title={isQueued ? "Remove from compare queue" : "Add to compare matrix"}
              aria-label={`${isQueued ? "Remove" : "Add"} ${name} to compare`}
            >
              <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
              <span>{isQueued ? "Queued" : "Compare"}</span>
            </button>

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
        </div>

        {/* Category Badge */}
        {categoryName && (
          <div className="mb-3 text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>in</span>
            {categorySlug ? (
              <Link
                href={`/tools/${categorySlug}`}
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
          <span>
            {pricingModel === "open-source"
              ? "→ source"
              : hasApi
              ? "→ api"
              : "→ visit"}
          </span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
});

ToolCard.displayName = "ToolCard";
