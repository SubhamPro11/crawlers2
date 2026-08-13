import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { getCachedPaginatedTools } from "@/lib/cached-queries";
import { VerifiedToolsGrid } from "@/components/home/VerifiedToolsGrid";

export const revalidate = 3600; // SSG/ISR 1-hour revalidation

export const metadata = {
  title: "Complete AI Tools Directory Index (1,000+ Software)",
  description: "Browse the complete paginated index of human-curated AI software, developer tools, and API endpoints.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Complete AI Tools Directory Index (1,000+ Software)",
    description: "Browse the complete paginated index of human-curated AI software, developer tools, and API endpoints.",
    url: "https://crawlers.dpdns.org/tools",
    siteName: "Crawlers",
  },
  twitter: {
    card: "summary_large_image",
    site: "@crawlers",
    creator: "@crawlers",
    title: "Complete AI Tools Directory Index (1,000+ Software)",
    description: "Browse the complete paginated index of human-curated AI software, developer tools, and API endpoints.",
  },
};

interface ToolsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    pricing?: string;
    api?: string;
    sort?: string;
  }>;
}

export default async function ToolsDirectoryPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const categorySlug = params.category || "all";
  const pricingModel = params.pricing || "all";
  const hasApi = params.api === "true";
  const sortBy = (params.sort as "recently_added" | "name_asc") || "recently_added";

  const { tools, totalCount, totalPages } = await getCachedPaginatedTools({
    page,
    pageSize: 24,
    categorySlug,
    pricingModel,
    hasApi,
    sortBy,
  });

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 grain-overlay">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Link href="/" className="hover:text-lime-accent flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-lime-accent">Tool Index</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-navy-800 pb-6 space-y-2">
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-lime-accent" /> Complete AI Tools Directory
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans max-w-3xl leading-relaxed">
            Paginated server-rendered index of {totalCount} verified software tools. Zero unverified upvotes, direct manual link curation.
          </p>
        </div>

        {/* Interactive Filtered Tools Grid */}
        <VerifiedToolsGrid initialTools={tools} />

        {/* Server-Rendered Crawlable Pagination Bar */}
        {totalPages > 1 && (
          <div className="pt-8 border-t border-navy-850 flex items-center justify-between font-mono text-xs">
            <div className="text-slate-400">
              Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong> ({totalCount} total tools)
            </div>

              <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/tools?page=${page - 1}${categorySlug !== "all" ? `&category=${categorySlug}` : ""}${pricingModel !== "all" ? `&pricing=${pricingModel}` : ""}${hasApi ? "&api=true" : ""}`}
                  prefetch={true}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-200 hover:border-lime-accent/40 hover:text-lime-accent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Page
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-900 text-slate-600 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" /> Previous Page
                </span>
              )}

              {/* Numbered Page Links */}
              <div className="hidden sm:flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNum = Math.min(totalPages - 4 + i, page - 2 + i);
                  }
                  return (
                    <Link
                      key={pageNum}
                      href={`/tools?page=${pageNum}${categorySlug !== "all" ? `&category=${categorySlug}` : ""}${pricingModel !== "all" ? `&pricing=${pricingModel}` : ""}${hasApi ? "&api=true" : ""}`}
                      prefetch={true}
                      className={`px-2.5 py-1 rounded font-mono ${
                        pageNum === page
                          ? "bg-lime-accent text-navy-950 font-bold"
                          : "bg-navy-900 border border-navy-800 text-slate-300 hover:border-lime-accent/40"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {page < totalPages ? (
                <Link
                  href={`/tools?page=${page + 1}${categorySlug !== "all" ? `&category=${categorySlug}` : ""}${pricingModel !== "all" ? `&pricing=${pricingModel}` : ""}${hasApi ? "&api=true" : ""}`}
                  prefetch={true}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-200 hover:border-lime-accent/40 hover:text-lime-accent transition-colors font-bold"
                >
                  Next Page <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-900 text-slate-600 cursor-not-allowed">
                  Next Page <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
