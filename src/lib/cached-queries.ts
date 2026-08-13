import { unstable_cache } from "next/cache";
import {
  fetchPaginatedTools as fetchPaginatedToolsRaw,
  fetchTools as fetchToolsRaw,
  fetchToolBySlug as fetchToolBySlugRaw,
  fetchSections as fetchSectionsRaw,
  fetchCategoriesBySection as fetchCategoriesBySectionRaw,
  fetchTrendingTools as fetchTrendingToolsRaw,
  PaginatedToolsResult,
} from "./supabase";
import { Tool, Section, Category } from "@/types/database";

/**
 * 1-Hour ISR Revalidation Window (3600 seconds)
 * Matches production curation cadence while on-demand revalidation
 * guarantees instant freshness upon tool approvals.
 */
export const CACHE_REVALIDATE_SECONDS = 3600;

export async function getCachedPaginatedTools(options?: {
  page?: number;
  pageSize?: number;
  limit?: number;
  categorySlug?: string;
  pricingModel?: string;
  hasApi?: boolean;
  sortBy?: "recently_added" | "name_asc";
}): Promise<PaginatedToolsResult> {
  const page = options?.page || 1;
  const limit = options?.limit || options?.pageSize || 24;
  const category = options?.categorySlug || "all";
  const pricing = options?.pricingModel || "all";
  const api = options?.hasApi ? "api" : "no-api";
  const sort = options?.sortBy || "recently_added";

  const fetcher = unstable_cache(
    async () => fetchPaginatedToolsRaw({ ...options, pageSize: limit }),
    ["paginated-tools-v3", `p-${page}`, `l-${limit}`, `c-${category}`, `pr-${pricing}`, `a-${api}`, `s-${sort}`],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["tools", "tools-paginated"],
    }
  );

  return fetcher();
}

export async function getCachedTools(options?: {
  categorySlug?: string;
  sectionSlug?: string;
  limit?: number;
}): Promise<Tool[]> {
  const category = options?.categorySlug || "all";
  const section = options?.sectionSlug || "all";
  const limit = options?.limit || 1000;

  const fetcher = unstable_cache(
    async () => fetchToolsRaw(options),
    ["tools-v2", `c-${category}`, `s-${section}`, `l-${limit}`],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["tools"],
    }
  );

  return fetcher();
}

export async function getCachedToolBySlug(slug: string): Promise<Tool | null> {
  const fetcher = unstable_cache(
    async () => fetchToolBySlugRaw(slug),
    ["tool-slug-v2", slug],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["tools", `tool-${slug}`],
    }
  );

  return fetcher();
}

export const getCachedSections = unstable_cache(
  async (): Promise<Section[]> => {
    return fetchSectionsRaw();
  },
  ["sections-cache-v2"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["sections", "taxonomy"],
  }
);

export async function getCachedCategoriesBySection(sectionSlug: string): Promise<Category[]> {
  const fetcher = unstable_cache(
    async () => fetchCategoriesBySectionRaw(sectionSlug),
    ["categories-by-sec-v2", sectionSlug],
    {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: ["categories", "taxonomy"],
    }
  );

  return fetcher();
}

export const getCachedTrendingTools = unstable_cache(
  async () => {
    return fetchTrendingToolsRaw();
  },
  ["trending-tools-cache-v2"],
  {
    revalidate: 600, // 10-minute cache for trending analytics
    tags: ["trending", "tools"],
  }
);
