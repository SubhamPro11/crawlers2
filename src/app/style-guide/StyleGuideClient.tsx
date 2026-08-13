"use client";

import React from "react";
import { Terminal, Search, Filter, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ToolCard } from "@/components/ui/Card";

export function StyleGuideClient() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="border-b border-navy-800 pb-6">
        <div className="flex items-center gap-2 font-mono text-lime-accent text-sm mb-2">
          <Terminal className="w-4 h-4" />
          <span>crawlers://design-system/style-guide</span>
        </div>
        <h1 className="text-3xl font-mono font-bold tracking-tight text-slate-100">
          Design System &amp; Visual Identity
        </h1>
        <p className="text-slate-400 font-sans mt-2 max-w-2xl">
          Terminal-inspired dark navy UI tokens, monospace typography hierarchy, high-contrast lime accents, and restraint. Zero generic SaaS gradients or sparkle icons.
        </p>
      </header>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          1. Color Palette Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 font-mono text-xs">
          <div className="p-4 bg-navy-950 border border-navy-800 rounded">
            <div className="h-10 rounded bg-navy-950 mb-2 border border-navy-800"></div>
            <div className="text-slate-200 font-bold">navy-950</div>
            <div className="text-slate-500">#060A14</div>
          </div>
          <div className="p-4 bg-navy-900 border border-navy-800 rounded">
            <div className="h-10 rounded bg-navy-900 mb-2 border border-navy-800"></div>
            <div className="text-slate-200 font-bold">navy-900</div>
            <div className="text-slate-500">#0B1120</div>
          </div>
          <div className="p-4 bg-navy-850 border border-navy-800 rounded">
            <div className="h-10 rounded bg-navy-850 mb-2 border border-navy-800"></div>
            <div className="text-slate-200 font-bold">navy-850</div>
            <div className="text-slate-500">#10192D</div>
          </div>
          <div className="p-4 bg-navy-800 border border-navy-800 rounded">
            <div className="h-10 rounded bg-navy-800 mb-2 border border-navy-700"></div>
            <div className="text-slate-200 font-bold">navy-800</div>
            <div className="text-slate-500">#17243C</div>
          </div>
          <div className="p-4 bg-navy-900 border border-navy-800 rounded">
            <div className="h-10 rounded bg-lime-accent mb-2"></div>
            <div className="text-lime-accent font-bold">lime-accent</div>
            <div className="text-slate-500">#A3E635</div>
          </div>
          <div className="p-4 bg-navy-900 border border-navy-800 rounded">
            <div className="h-10 rounded bg-navy-850 border border-lime-accent/30 mb-2"></div>
            <div className="text-slate-200 font-bold">lime-border</div>
            <div className="text-slate-500">rgba(163,230,53,0.3)</div>
          </div>
        </div>
      </section>

      {/* 2. Typography Stack */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          2. Typography Hierarchy
        </h2>
        <div className="p-6 bg-navy-900 border border-navy-800 rounded space-y-4">
          <div>
            <span className="text-xs font-mono text-slate-500 block mb-1">Heading 1 (Monospace)</span>
            <h1 className="text-2xl md:text-3xl font-mono font-bold text-slate-100">
              Discover Human-Curated AI Infrastructure
            </h1>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-500 block mb-1">Heading 2 (Monospace)</span>
            <h2 className="text-xl font-mono font-semibold text-slate-200">
              Developer &amp; Tech Tools &gt; Code Assistants
            </h2>
          </div>
          <div>
            <span className="text-xs font-mono text-slate-500 block mb-1">Body Text (Inter Sans)</span>
            <p className="text-slate-300 font-sans text-sm leading-relaxed max-w-2xl">
              An unvarnished directory of tools offering native API endpoints, local execution binaries, and developer integrations. No fabricated metrics, affiliate fluff, or generic SaaS marketing copy.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Base Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          3. Button Variants &amp; Sizes
        </h2>
        <div className="p-6 bg-navy-900 border border-navy-800 rounded space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<Terminal className="w-4 h-4" />}>
              Primary Terminal
            </Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Variant</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button variant="danger">Danger Action</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-navy-850 pt-4">
            <Button size="sm" variant="primary">
              Small (sm)
            </Button>

            <Button size="md" variant="primary">
              Medium (md)
            </Button>

            <Button size="lg" variant="primary">
              Large (lg)
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Badges & Tag Micro-components */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          4. Badges &amp; Pricing Enums
        </h2>
        <div className="p-6 bg-navy-900 border border-navy-800 rounded flex flex-wrap gap-4">
          <Badge pricingModel="free">Free</Badge>
          <Badge pricingModel="freemium">Freemium</Badge>
          <Badge pricingModel="paid">Paid</Badge>
          <Badge pricingModel="open-source">Open Source</Badge>
          <Badge variant="lime">Featured Stack</Badge>
          <Badge variant="outline">#devtools</Badge>
          <Badge variant="subtle">v1.26.0</Badge>
        </div>
      </section>

      {/* 5. Inputs & Form Components */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          5. Input Fields
        </h2>
        <div className="p-6 bg-navy-900 border border-navy-800 rounded grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Terminal Prompt Search"
            promptPrefix
            placeholder="search by name, category, or tag..."
          />
          <Input
            label="Standard Query Input"
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search API tools..."
          />
          <Input
            label="Input with Error State"
            promptPrefix
            error="Please enter a valid URL beginning with https://"
            defaultValue="invalid-url-submission"
          />
          <Input
            label="Input with Right Accessory"
            placeholder="Filter categories..."
            rightElement={<Filter className="w-4 h-4 text-slate-500" />}
          />
        </div>
      </section>

      {/* 6. Tool Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          6. Tool Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolCard
            id="1"
            name="Ollama"
            slug="ollama"
            url="https://ollama.com"
            description="Get up and running with Llama 3, Mistral, and other large language models locally. Lightweight CLI framework for model management."
            pricingModel="open-source"
            categoryName="DevTools"
            categorySlug="devtools"
            tags={["local-ai", "llm-runner", "cli"]}
            hasApi
            isBookmarked
            onBookmarkToggle={() => {}}
          />
          <ToolCard
            id="2"
            name="Cursor"
            slug="cursor"
            url="https://cursor.com"
            description="AI-first code editor built on VS Code. Features intelligent terminal context integration, multi-file code editing, and fast semantic code indexing."
            pricingModel="freemium"
            categoryName="Code Assistants"
            categorySlug="code-assistants"
            tags={["editor", "copilot", "autocomplete"]}
            hasApi={false}
            isBookmarked={false}
            onBookmarkToggle={() => {}}
          />
        </div>
      </section>

      {/* 7. Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          7. Skeleton Loaders
        </h2>
        <div className="p-6 bg-navy-900 border border-navy-800 rounded space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="w-10 h-10" />
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="text" className="w-2/3 h-3" />
            </div>
          </div>
          <Skeleton variant="rectangular" className="h-24 w-full" />
        </div>
      </section>

      {/* 8. Empty State Pattern */}
      <section className="space-y-4">
        <h2 className="text-xl font-mono font-semibold text-lime-accent border-b border-navy-850 pb-2">
          8. Empty State Pattern
        </h2>
        <EmptyState
          title="No tools match query: 'quantum-compiler'"
          description="We couldn't find any tool matching your search filters in the active directory index."
          codeSnippet="crawlers search --query 'quantum-compiler' --count 0"
          action={
            <Button variant="outline" icon={<Cpu className="w-4 h-4" />}>
              Submit New Tool
            </Button>
          }
        />
      </section>

      <footer className="border-t border-navy-800 pt-6 text-center font-mono text-xs text-slate-500">
        Crawlers Design System • Terminal Navy &amp; Lime Identity • Strict Non-SaaS Aesthetic
      </footer>
    </div>
  );
}
