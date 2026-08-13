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

export const getCachedPaginatedTools = unstable_cache(
  async (options?: Parameters<typeof fetchPaginatedToolsRaw>[0]): Promise<PaginatedToolsResult> => {
    return fetchPaginatedToolsRaw(options);
  },
  ["paginated-tools-cache"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["tools", "tools-paginated"],
  }
);

export const getCachedTools = unstable_cache(
  async (options?: Parameters<typeof fetchToolsRaw>[0]): Promise<Tool[]> => {
    return fetchToolsRaw(options);
  },
  ["tools-cache"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["tools"],
  }
);

export const getCachedToolBySlug = unstable_cache(
  async (slug: string): Promise<Tool | null> => {
    return fetchToolBySlugRaw(slug);
  },
  ["tool-by-slug-cache"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["tools"],
  }
);

export const getCachedSections = unstable_cache(
  async (): Promise<Section[]> => {
    return fetchSectionsRaw();
  },
  ["sections-cache"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["sections", "taxonomy"],
  }
);

export const getCachedCategoriesBySection = unstable_cache(
  async (sectionSlug: string): Promise<Category[]> => {
    return fetchCategoriesBySectionRaw(sectionSlug);
  },
  ["categories-by-section-cache"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["categories", "taxonomy"],
  }
);

export const getCachedTrendingTools = unstable_cache(
  async () => {
    return fetchTrendingToolsRaw();
  },
  ["trending-tools-cache"],
  {
    revalidate: 600, // 10-minute cache for trending analytics
    tags: ["trending", "tools"],
  }
);
