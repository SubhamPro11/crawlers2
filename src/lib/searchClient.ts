import MiniSearch from "minisearch";
import { Tool } from "@/types/database";
import { TAXONOMY_SEEDS } from "./taxonomy";
import { MOCK_TOOLS } from "./mockData";

export interface SearchCategoryMatch {
  name: string;
  slug: string;
  description: string;
  sectionName: string;
  sectionSlug: string;
}

export interface SearchResults {
  tools: Tool[];
  categories: SearchCategoryMatch[];
}

let miniSearchInstance: MiniSearch<Tool> | null = null;
let indexLoadingPromise: Promise<MiniSearch<Tool>> | null = null;
let allLoadedTools: Tool[] = [];

/**
 * Initializes and caches the local MiniSearch index from the static JSON asset
 * or on-demand ISR route.
 */
export async function getSearchIndex(): Promise<MiniSearch<Tool>> {
  if (miniSearchInstance) {
    return miniSearchInstance;
  }

  if (indexLoadingPromise) {
    return indexLoadingPromise;
  }

  indexLoadingPromise = (async () => {
    try {
      // Attempt fetching static build-time search index first
      let res = await fetch("/search-index.json");
      if (!res.ok) {
        // Fallback to dynamic ISR search-index API route
        res = await fetch("/api/search-index");
      }

      if (res.ok) {
        const tools: Tool[] = await res.json();
        allLoadedTools = tools;

        const ms = new MiniSearch<Tool>({
          fields: ["name", "slug", "description", "category_id"],
          storeFields: [
            "id",
            "name",
            "slug",
            "description",
            "category_id",
            "pricing_model",
            "has_api",
            "logo_url",
            "url",
          ],
          searchOptions: {
            boost: { name: 3, slug: 2, category_id: 1.5, description: 1 },
            prefix: true,
            fuzzy: 0.2,
          },
        });

        ms.addAll(tools);
        miniSearchInstance = ms;
        return ms;
      }
    } catch (err) {
      console.warn("Failed to load full search index, using seed fallback:", err);
    }

    // Offline / fallback index
    allLoadedTools = MOCK_TOOLS;
    const fallbackMs = new MiniSearch<Tool>({
      fields: ["name", "slug", "description"],
      storeFields: ["id", "name", "slug", "description", "pricing_model", "has_api", "url"],
      searchOptions: { prefix: true, fuzzy: 0.2 },
    });
    fallbackMs.addAll(MOCK_TOOLS);
    miniSearchInstance = fallbackMs;
    return fallbackMs;
  })();

  return indexLoadingPromise;
}

/**
 * Synchronous taxonomy category search.
 */
export function searchCategories(query: string, limit = 4): SearchCategoryMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matched: SearchCategoryMatch[] = [];
  for (const sec of TAXONOMY_SEEDS) {
    for (const cat of sec.categories) {
      if (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
      ) {
        matched.push({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          sectionName: sec.name,
          sectionSlug: sec.slug,
        });
        if (matched.length >= limit) return matched;
      }
    }
  }
  return matched;
}

/**
 * Execute fast local search over 1,000+ indexed tools with category resolution.
 */
export async function searchDirectory(
  query: string,
  options?: { toolLimit?: number; categoryLimit?: number }
): Promise<SearchResults> {
  const q = query.trim();
  if (!q) {
    return { tools: [], categories: [] };
  }

  const categoryMatches = searchCategories(q, options?.categoryLimit || 4);

  const ms = await getSearchIndex();
  const searchResults = ms.search(q, {
    prefix: true,
    fuzzy: (term) => (term.length > 3 ? 0.2 : false),
  });

  const toolLimit = options?.toolLimit || 8;
  const tools = searchResults.slice(0, toolLimit).map((result) => {
    return (
      allLoadedTools.find((t) => t.id === result.id) ||
      ({
        id: String(result.id),
        name: result.name,
        slug: result.slug,
        description: result.description,
        category_id: result.category_id,
        pricing_model: result.pricing_model || "Free",
        has_api: Boolean(result.has_api),
        logo_url: result.logo_url || null,
        url: result.url || `https://${result.slug}.com`,
      } as Tool)
    );
  });

  return {
    tools,
    categories: categoryMatches,
  };
}
