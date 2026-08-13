import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Terminal, FolderGit2, ArrowRight } from "lucide-react";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { getCachedTools } from "@/lib/cached-queries";
import { ToolCard } from "@/components/ui/Card";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600; // SSG/ISR 1-hour static revalidation

export async function generateStaticParams() {
  return TAXONOMY_SEEDS.map((s) => ({ section: s.slug }));
}

interface SectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export async function generateMetadata({ params }: SectionPageProps) {
  const { section: sectionSlug } = await params;
  const section = TAXONOMY_SEEDS.find((s) => s.slug === sectionSlug);

  if (!section) {
    return {
      title: "Section Not Found",
    };
  }

  const title = `${section.name} AI Software & APIs — Directory Section 0${section.number}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const canonicalUrl = `${baseUrl}/${section.slug}`;

  return {
    title,
    description: section.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: section.description,
      url: canonicalUrl,
      siteName: "Crawlers",
    },
    twitter: {
      card: "summary_large_image",
      site: "@crawlers",
      creator: "@crawlers",
      title,
      description: section.description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section: sectionSlug } = await params;
  const section = TAXONOMY_SEEDS.find((s) => s.slug === sectionSlug);

  if (!section) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const sectionTools = await getCachedTools({ sectionSlug, limit: 12 });

  // Group categories by subgroup
  const subgroupMap: Record<string, typeof section.categories> = {};
  section.categories.forEach((cat) => {
    const sg = cat.subgroup || "General";
    if (!subgroupMap[sg]) subgroupMap[sg] = [];
    subgroupMap[sg].push(cat);
  });

  return (
    <>
      <CollectionPageJsonLd
        name={`${section.name} AI Software & APIs`}
        description={section.description}
        url={`${baseUrl}/${section.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: baseUrl },
          { name: section.name, item: `${baseUrl}/${section.slug}` },
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">{section.name}</span>
        </div>

        {/* Section Header */}
        <div className="border-b border-navy-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-navy-850 border border-navy-700 font-mono text-xs text-lime-accent">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Section 0{section.number}</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            {section.name}
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Subgroups & Categories */}
        <div className="space-y-8">
          <h2 className="font-mono text-xl font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-lime-accent" /> Categories in {section.name}
          </h2>

          {Object.entries(subgroupMap).map(([subgroupName, categories]) => (
            <div key={subgroupName} className="space-y-4">
              <h3 className="font-mono text-xs text-lime-accent uppercase tracking-wider border-b border-navy-850 pb-2">
                {"//"} {subgroupName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="p-5 rounded border border-navy-800 bg-navy-900 flex flex-col justify-between hover:border-lime-accent/40 transition-colors group"
                  >
                    <div>
                      <h4 className="font-mono text-base font-bold text-slate-100 group-hover:text-lime-accent transition-colors mb-2">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                        {cat.description}
                      </p>
                    </div>

                    <Link
                      href={`/${section.slug}/${cat.slug}`}
                      className="font-mono text-xs text-lime-accent flex items-center gap-1.5 pt-3 border-t border-navy-850 hover:underline"
                    >
                      Browse Category Tools <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tools Sample in this section */}
        <div className="pt-8 border-t border-navy-800 space-y-6">
          <h2 className="font-mono text-xl font-bold text-slate-100">
            Featured Tools in {section.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionTools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                slug={tool.slug}
                url={tool.url}
                description={tool.description}
                pricingModel={tool.pricing_model}
                hasApi={tool.has_api}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
