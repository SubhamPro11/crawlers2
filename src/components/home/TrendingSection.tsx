import React from "react";
import { TrendingUp, Eye } from "lucide-react";
import { Tool } from "@/types/database";
import { ToolCard } from "@/components/ui/Card";

interface TrendingSectionProps {
  tools: Tool[];
  viewCounts?: Record<string, number>;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  tools,
  viewCounts = {},
}) => {
  const trendingTools = tools.slice(0, 3);

  return (
    <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-navy-850">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-800 pb-4 mb-8 gap-4">
        <div>
          <div className="font-mono text-xs text-lime-accent uppercase tracking-wider mb-1">
            {"// 04. real_view_analytics"}
          </div>
          <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-lime-accent" /> Trending by Real View Logs
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Ranked strictly by verified 24-hour page views. Zero upvote padding, zero sponsored boosts.
          </p>
        </div>

        <div className="font-mono text-xs text-slate-500 bg-navy-900 border border-navy-800 px-3 py-1.5 rounded-lg shrink-0">
          Analytics Status: <span className="text-slate-300 font-bold">Live Audit Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingTools.map((tool) => {
          const views = viewCounts[tool.id] || 0;
          return (
            <div key={tool.id} className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-lime-accent" />
                  <strong>{views}</strong> {views === 1 ? "page view" : "page views"} (24h)
                </span>
                <span className="text-slate-500">
                  {views === 0 ? "[Thin Data]" : "[Verified Traffic]"}
                </span>
              </div>
              <ToolCard
                id={tool.id}
                name={tool.name}
                slug={tool.slug}
                url={tool.url}
                description={tool.description}
                pricingModel={tool.pricing_model}
                hasApi={tool.has_api}
                tags={["trending"]}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
