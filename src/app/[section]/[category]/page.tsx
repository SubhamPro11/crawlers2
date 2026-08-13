import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { getCachedTools } from "@/lib/cached-queries";
import { ToolCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600; // SSG/ISR 1-hour static revalidation

export async function generateStaticParams() {
  const params: { section: string; category: string }[] = [];
  TAXONOMY_SEEDS.forEach((sec) => {
    sec.categories.forEach((cat) => {
      params.push({ section: sec.slug, category: cat.slug });
    });
  });
  return params;
}

interface CategoryPageProps {
  params: Promise<{
    section: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { section: sectionSlug, category: categorySlug } = await params;
  const section = TAXONOMY_SEEDS.find((s) => s.slug === sectionSlug);
  const category = section?.categories.find((c) => c.slug === categorySlug);

  if (!section || !category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.name} AI Tools — ${section.name}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const canonicalUrl = `${baseUrl}/${section.slug}/${category.slug}`;

  return {
    title,
    description: category.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: category.description,
      url: canonicalUrl,
      siteName: "Crawlers",
    },
    twitter: {
      card: "summary_large_image",
      site: "@crawlers",
      creator: "@crawlers",
      title,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { section: sectionSlug, category: categorySlug } = await params;
  const section = TAXONOMY_SEEDS.find((s) => s.slug === sectionSlug);
  const category = section?.categories.find((c) => c.slug === categorySlug);

  if (!section || !category) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const categoryTools = await getCachedTools({ categorySlug });

  return (
    <>
      <CollectionPageJsonLd
        name={`${category.name} AI Software & APIs`}
        description={category.description}
        url={`${baseUrl}/${section.slug}/${category.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: baseUrl },
          { name: section.name, item: `${baseUrl}/${section.slug}` },
          { name: category.name, item: `${baseUrl}/${section.slug}/${category.slug}` },
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link href={`/${section.slug}`} className="hover:text-lime-accent">
            {section.name}
          </Link>
          <span>/</span>
          <span className="text-lime-accent">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="border-b border-navy-800 pb-8 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Badge variant="lime">{category.subgroup}</Badge>
            <span>•</span>
            <span>{categoryTools.length} Indexed Tools</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            {category.name}
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Filter Controls (Mock UI state) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded bg-navy-900 border border-navy-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-lime-accent" />
            <span>Pricing Filter:</span>
            <div className="flex items-center gap-1.5 ml-2">
              <Badge pricingModel="free">Free</Badge>
              <Badge pricingModel="freemium">Freemium</Badge>
              <Badge pricingModel="paid">Paid</Badge>
              <Badge pricingModel="open-source">Open Source</Badge>
            </div>
          </div>
          <div className="text-slate-400">
            Sorted by <span className="text-slate-200 font-semibold">Recently Added</span>
          </div>
        </div>

        {/* Tools Listing Grid */}
        {categoryTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <ToolCard
                key={tool.id}
                id={tool.id}
                name={tool.name}
                slug={tool.slug}
                url={tool.url}
                description={tool.description}
                pricingModel={tool.pricing_model}
                hasApi={tool.has_api}
                categoryName={category.name}
                categorySlug={category.slug}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No tools indexed in ${category.name}`}
            description="We haven't indexed software in this category yet. Submit a tool to be reviewed."
            codeSnippet={`crawlers query --category ${category.slug}`}
          />
        )}
      </main>
    </>
  );
}
