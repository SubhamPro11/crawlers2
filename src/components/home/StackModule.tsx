import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { CuratedStack } from "@/lib/mockData";

interface StackModuleProps {
  stacks: CuratedStack[];
}

export const StackModule: React.FC<StackModuleProps> = ({ stacks }) => {
  if (stacks.length === 0) return null;

  const primaryStack = stacks[0];
  const secondaryStacks = stacks.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Featured Primary Stack (Spans 7 Cols) */}
      <div className="lg:col-span-7 p-6 sm:p-8 rounded border border-lime-accent/30 bg-navy-900/95 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 px-3 py-1 bg-lime-accent text-navy-950 font-mono text-[10px] font-bold uppercase tracking-wider">
          Primary Featured Stack
        </div>

        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-lime-accent mb-3">
            <Terminal className="w-4 h-4" />
            <span>curated_stack://{primaryStack.slug}</span>
          </div>

          <h3 className="font-mono text-2xl font-bold text-slate-100 group-hover:text-lime-accent transition-colors mb-3">
            {primaryStack.name}
          </h3>

          <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6 max-w-xl">
            {primaryStack.description}
          </p>

          {/* Included Tools Pills */}
          <div className="space-y-2 mb-6">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider block">
              Bundled Infrastructure Tools:
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {primaryStack.toolSlugs.map((slug) => (
                <span
                  key={slug}
                  className="px-2.5 py-1 rounded bg-navy-950 text-slate-200 border border-navy-800"
                >
                  ${slug}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-navy-850 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">{primaryStack.toolSlugs.length} Tools Hand-Selected</span>
          <Link
            href={`/compare?tools=${primaryStack.toolSlugs.slice(0, 2).join(",")}`}
            className="inline-flex items-center gap-1.5 text-lime-accent font-semibold hover:underline"
          >
            run stack <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Secondary Stacks List Column (Spans 5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {secondaryStacks.map((stack) => (
          <div
            key={stack.id}
            className="p-5 rounded border border-navy-800 bg-navy-900/70 hover:border-navy-700 transition-colors flex-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                  {"// Stack"}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {stack.toolSlugs.length} Tools
                </span>
              </div>
              <h4 className="font-mono text-base font-bold text-slate-100 mb-1">
                {stack.name}
              </h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                {stack.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-navy-850/60 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 text-[11px]">
                [{stack.toolSlugs.slice(0, 2).join(", ")}]
              </span>
              <Link
                href={`/compare?tools=${stack.toolSlugs.slice(0, 2).join(",")}`}
                className="text-slate-300 hover:text-lime-accent transition-colors flex items-center gap-1"
              >
                open stack <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
