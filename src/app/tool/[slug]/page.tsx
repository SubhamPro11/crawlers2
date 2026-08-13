import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code2, ShieldCheck, ArrowLeftRight, Calendar } from "lucide-react";
import { MOCK_TOOL_TAGS } from "@/lib/mockData";
import { getCachedToolBySlug, getCachedTools } from "@/lib/cached-queries";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ToolCard } from "@/components/ui/Card";
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ToolDetailClientActions } from "@/components/tool/ToolDetailClientActions";

interface ToolDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getCachedToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const canonicalUrl = `${baseUrl}/tool/${tool.slug}`;

  return {
    title: `${tool.name} — AI Tool Review & API Access`,
    description: tool.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.name} — AI Tool Review & API Access`,
      description: tool.description,
      url: canonicalUrl,
      siteName: "Crawlers",
    },
    twitter: {
      card: "summary_large_image",
      site: "@crawlers",
      creator: "@crawlers",
      title: `${tool.name} — AI Tool Review & API Access`,
      description: tool.description,
    },
  };
}

export const revalidate = 3600; // SSG/ISR 1-hour static revalidation

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getCachedToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const tags = MOCK_TOOL_TAGS[tool.slug] || ["ai-tools"];
  const relatedTools = (await getCachedTools({ limit: 4 })).filter((t) => t.id !== tool.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <SoftwareApplicationJsonLd
        name={tool.name}
        description={tool.description}
        url={tool.url}
        applicationCategory="DeveloperApplication"
        operatingSystem="All"
        offers={{
          price: tool.pricing_model === "free" ? "0" : "0",
          priceCurrency: "USD",
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: baseUrl },
          { name: "Tools Directory", item: `${baseUrl}/tools` },
          { name: tool.name, item: `${baseUrl}/tool/${tool.slug}` },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </Link>
          <span>/</span>
          <span className="text-lime-accent">{tool.name}</span>
        </div>

        {/* Tool Header Card */}
        <div className="p-8 rounded-xl border border-navy-800 bg-navy-900 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
                  {tool.name}
                </h1>
                <Badge pricingModel={tool.pricing_model}>{tool.pricing_model}</Badge>
                {tool.has_api && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-lime-accent/10 text-lime-accent border border-lime-accent/30">
                    <Code2 className="w-3.5 h-3.5" /> API Access Available
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Indexed: {new Date(tool.added_at).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Editorially Audited
                </span>
              </div>
            </div>

            {/* Direct Source Action */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/compare?tools=${tool.slug}`}>
                <Button variant="outline" size="sm" icon={<ArrowLeftRight className="w-4 h-4" />}>
                  Compare Tool
                </Button>
              </Link>
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" icon={<ExternalLink className="w-4 h-4" />}>
                  Visit Official Source
                </Button>
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-navy-850 pt-6 space-y-4">
            <h2 className="font-mono text-xs text-lime-accent uppercase tracking-wider">
              Editorial Description
            </h2>
            <p className="text-base text-slate-200 font-sans leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Tag Metadata & Client Actions */}
          <div className="border-t border-navy-850 pt-4 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-slate-500">Tags:</span>
            {tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-navy-850 text-slate-300 border border-navy-700">
                #{tag}
              </span>
            ))}
          </div>

          <ToolDetailClientActions
            toolId={tool.id}
            toolName={tool.name}
            toolSlug={tool.slug}
            toolUrl={tool.url}
            hasApi={tool.has_api}
          />
        </div>

        {/* Third-Party Direct Link Notice (Enforcing Hard Constraint) */}
        <div className="p-4 rounded-xl border border-navy-800 bg-navy-950 font-mono text-xs text-slate-400 flex items-center justify-between">
          <span>
            Note: Crawlers links directly to official provider sites. We do not iframe or embed third-party web pages.
          </span>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime-accent hover:underline flex items-center gap-1 font-bold shrink-0 ml-4"
          >
            {tool.url} <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Related Tools */}
        <div className="space-y-6 pt-6">
          <h2 className="font-mono text-xl font-bold text-slate-100">
            Similar AI Software
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((related) => (
              <ToolCard
                key={related.id}
                id={related.id}
                name={related.name}
                slug={related.slug}
                url={related.url}
                description={related.description}
                pricingModel={related.pricing_model}
                hasApi={related.has_api}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
