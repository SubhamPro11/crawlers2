import React from "react";
import Link from "next/link";
import { ExternalLink, Bookmark, Code2 } from "lucide-react";
import { Badge } from "./Badge";
import { PricingModel } from "@/types/database";

export interface ToolCardProps {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  pricingModel: PricingModel;
  categoryName?: string;
  categorySlug?: string;
  tags?: string[];
  hasApi?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  slug,
  url,
  description,
  pricingModel,
  categoryName,
  categorySlug,
  tags = [],
  hasApi = false,
  isBookmarked = false,
  onBookmarkToggle,
  className = "",
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded border border-navy-800 bg-navy-900/90 hover:border-navy-600 transition-all duration-200 ${className}`}
    >
      <div>
        {/* Card Header: Name, Pricing Badge & Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Link
              href={`/tool/${slug}`}
              className="font-mono text-base font-bold text-slate-100 group-hover:text-lime-accent transition-colors underline-offset-4 hover:underline"
            >
              {name}
            </Link>
            {hasApi && (
              <span
                title="API Available"
                className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-navy-800 text-lime-accent border border-lime-accent/20"
              >
                <Code2 className="w-3 h-3" /> API
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge pricingModel={pricingModel}>{pricingModel}</Badge>
            {onBookmarkToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onBookmarkToggle(id);
                }}
                className={`p-1.5 rounded transition-colors ${
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

        {/* Category & Tags */}
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
              className="font-mono text-[11px] text-slate-400 bg-navy-850 px-2 py-0.5 rounded border border-navy-800"
            >
              #{tag}
            </span>
          ))}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-lime-accent hover:text-lime-hover hover:underline shrink-0"
        >
          Visit Source <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
