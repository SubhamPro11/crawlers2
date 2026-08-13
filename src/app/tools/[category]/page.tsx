import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderGit2 } from "lucide-react";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { getCachedTools } from "@/lib/cached-queries";
import { ToolCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600; // SSG/ISR 1-hour static revalidation

export async function generateStaticParams() {
  const params: { category: string }[] = [];
  TAXONOMY_SEEDS.forEach((sec) => {
    sec.categories.forEach((cat) => {
      params.push({ category: cat.slug });
    });
  });
  return params;
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  let matchedCat;
  let matchedSec;

  for (const sec of TAXONOMY_SEEDS) {
    const cat = sec.categories.find((c) => c.slug === categorySlug);
    if (cat) {
      matchedCat = cat;
      matchedSec = sec;
      break;
    }
  }

  if (!matchedCat || !matchedSec) {
    return {
      title: "Category Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const canonicalUrl = `${baseUrl}/tools/${matchedCat.slug}`;

  return {
    title: `${matchedCat.name} AI Software & APIs — Directory Index`,
    description: `Curated index of tools for ${matchedCat.name}: ${matchedCat.description}. Verified endpoints and direct links.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${matchedCat.name} AI Software & APIs — Directory Index`,
      description: `Curated index of tools for ${matchedCat.name}: ${matchedCat.description}`,
      url: canonicalUrl,
      siteName: "Crawlers",
    },
    twitter: {
      card: "summary_large_image",
      site: "@crawlers",
      creator: "@crawlers",
      title: `${matchedCat.name} AI Software & APIs — Directory Index`,
      description: `Curated index of tools for ${matchedCat.name}: ${matchedCat.description}`,
    },
  };
}

export default async function ToolsCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  let category;
  let section;

  for (const sec of TAXONOMY_SEEDS) {
    const cat = sec.categories.find((c) => c.slug === categorySlug);
    if (cat) {
      category = cat;
      section = sec;
      break;
    }
  }

  if (!category || !section) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const categoryTools = await getCachedTools({ categorySlug });

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <CollectionPageJsonLd
        name={`${category.name} AI Software & APIs`}
        description={category.description}
        url={`${baseUrl}/tools/${category.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: baseUrl },
          { name: "Tools Directory", item: `${baseUrl}/tools` },
          { name: section.name, item: `${baseUrl}/${section.slug}` },
          { name: category.name, item: `${baseUrl}/tools/${category.slug}` },
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-lime-accent">
            Tools Index
          </Link>
          <span>/</span>
          <span className="text-lime-accent">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="border-b border-navy-800 pb-8 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <Badge variant="lime">{category.subgroup || section.name}</Badge>
            <span>•</span>
            <span className="text-slate-300 font-bold">{categoryTools.length} Indexed Tools</span>
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-lime-accent" /> {category.name}
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Tools Grid */}
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
                logoUrl={tool.logo_url}
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
    </div>
  );
}
