import React from "react";
import { TrendingUp, Eye } from "lucide-react";
import { Tool } from "@/types/database";
import { ToolCard } from "@/components/ui/Card";

interface TrendingSectionProps {
  tools: Tool[];
  viewCounts?: Record<string, number>;
  sparklines?: Record<string, number[]>;
}

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (!data || data.length < 2 || data.every((v) => v === 0)) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 48;
  const height = 16;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block overflow-visible">
      <title>24h trend shape</title>
      <polyline
        fill="none"
        stroke="#a3e635"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  tools,
  viewCounts = {},
  sparklines = {},
}) => {
  return (
    <section className="animate-entrance pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-navy-850">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-navy-800 pb-4 mb-8 gap-4">
        <div>
          <div className="font-mono text-[11px] text-lime-accent/70 uppercase tracking-[0.2em] mb-1.5">
            {"// 04. real_view_analytics"}
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-bold text-slate-100 tracking-[-0.02em] flex items-center gap-2.5">
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

      {tools.length === 0 ? (
        <div className="p-8 text-center bg-navy-900/60 border border-dashed border-navy-800 rounded-xl font-mono">
          <div className="inline-flex items-center gap-2 text-slate-300 text-xs mb-2">
            <Eye className="w-4 h-4 text-lime-accent" />
            <span>0 recorded page views in the last 24h</span>
          </div>
          <p className="text-sm text-slate-400 font-sans max-w-md mx-auto">
            Not enough live view-log data yet to compile trending rankings. Browse tool details to populate live telemetry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const views = viewCounts[tool.id] || 0;
            const sparklineData = sparklines[tool.id] || [];
            return (
              <div key={tool.id} className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-2 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-lime-accent" />
                    <strong>{views}</strong> {views === 1 ? "page view" : "page views"} (24h)
                    <Sparkline data={sparklineData} />
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
                  logoUrl={tool.logo_url}
                  hasApi={tool.has_api}
                  tags={["trending"]}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
