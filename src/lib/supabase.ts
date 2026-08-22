import { createBrowserClient } from "@supabase/ssr";
import { Section, Category, Tool, Submission, LinkReport } from "@/types/database";
import { TAXONOMY_SEEDS } from "./taxonomy";
import { MOCK_TOOLS } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-key-here"
);

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Helper to prevent database queries from hanging Worker execution
async function withTimeout<T>(promise: PromiseLike<T>, ms = 3000): Promise<T | null> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer!);
    return result as T;
  } catch (err) {
    clearTimeout(timer!);
    console.error("Supabase request error caught gracefully:", err);
    return null;
  }
}

// Trigger Google OAuth Sign-In
export async function signInWithGoogle(nextUrl = "/"): Promise<{ error?: string }> {
  if (!supabase) {
    const errorMsg = "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing or not configured.";
    console.error("[Auth Error]", errorMsg);
    return { error: errorMsg };
  }

  try {
    const origin = typeof window !== "undefined" && window.location.origin
      ? window.location.origin.replace(/\/$/, "")
      : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

    const cleanNext = nextUrl.startsWith("/") && !nextUrl.startsWith("//") ? nextUrl : "/";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(cleanNext)}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("[Auth Error] Google OAuth initiation failed:", error.message);
      return { error: error.message };
    }

    if (data?.url && typeof window !== "undefined") {
      window.location.href = data.url;
    }

    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during Google sign in";
    console.error("[Auth Error] Google OAuth exception:", message);
    return { error: message };
  }
}



// Sign out current user session
export async function signOutUser(): Promise<{ error?: string }> {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
  }
  return {};
}

// Fetch all sections
export async function fetchSections(): Promise<Section[]> {
  if (supabase) {
    const res = await withTimeout(
      supabase.from("sections").select("*").order("display_order", { ascending: true })
    );

    if (res && !res.error && res.data && res.data.length > 0) {
      return res.data as Section[];
    }
  }

  // Fallback to static seeds
  return TAXONOMY_SEEDS.map((s) => ({
    id: `sec-${s.slug}`,
    name: s.name,
    slug: s.slug,
    description: s.description,
    display_order: s.number,
    created_at: new Date().toISOString(),
  }));
}

// Fetch categories for a section
export async function fetchCategoriesBySection(sectionSlug: string): Promise<Category[]> {
  if (supabase) {
    const secRes = await withTimeout(
      supabase.from("sections").select("id").eq("slug", sectionSlug).single()
    );

    if (secRes && secRes.data) {
      const catRes = await withTimeout(
        supabase
          .from("categories")
          .select("*")
          .eq("section_id", secRes.data.id)
          .order("display_order", { ascending: true })
      );

      if (catRes && !catRes.error && catRes.data && catRes.data.length > 0) {
        return catRes.data as Category[];
      }
    }
  }

  // Fallback
  const seedSection = TAXONOMY_SEEDS.find((s) => s.slug === sectionSlug);
  if (!seedSection) return [];

  return seedSection.categories.map((c, idx) => ({
    id: `cat-${c.slug}`,
    section_id: `sec-${seedSection.slug}`,
    name: c.name,
    slug: c.slug,
    subgroup: c.subgroup,
    description: c.description,
    display_order: idx + 1,
    created_at: new Date().toISOString(),
  }));
}

// Fetch tools with optional filters
export async function fetchTools(options?: {
  categorySlug?: string;
  sectionSlug?: string;
  hasApi?: boolean;
  searchQuery?: string;
  pricingModel?: string;
  limit?: number;
}): Promise<Tool[]> {
  if (supabase) {
    let query = supabase.from("tools").select("*").eq("is_active", true);

    if (options?.categorySlug) {
      const catRes = await withTimeout(
        supabase.from("categories").select("id").eq("slug", options.categorySlug).single()
      );
      if (catRes && catRes.data) {
        query = query.eq("category_id", catRes.data.id);
      }
    } else if (options?.sectionSlug) {
      const secRes = await withTimeout(
        supabase.from("sections").select("id").eq("slug", options.sectionSlug).single()
      );
      if (secRes && secRes.data) {
        const catListRes = await withTimeout(
          supabase.from("categories").select("id").eq("section_id", secRes.data.id)
        );
        if (catListRes && catListRes.data && catListRes.data.length > 0) {
          query = query.in(
            "category_id",
            catListRes.data.map((c) => c.id)
          );
        }
      }
    }

    if (options?.hasApi) {
      query = query.eq("has_api", true);
    }

    if (options?.pricingModel) {
      query = query.eq("pricing_model", options.pricingModel);
    }

    if (options?.searchQuery) {
      query = query.or(
        `name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`
      );
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const res = await withTimeout(query.order("added_at", { ascending: false }));

    if (res && !res.error && res.data && res.data.length > 0) {
      return res.data as Tool[];
    }
  }

  // Fallback to mock dataset
  let results = [...MOCK_TOOLS];

  if (options?.hasApi) {
    results = results.filter((t) => t.has_api);
  }

  if (options?.pricingModel) {
    results = results.filter((t) => t.pricing_model === options.pricingModel);
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    results = results.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export interface PaginatedToolsResult {
  tools: Tool[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Server-side paginated tool queries using Supabase .range()
export async function fetchPaginatedTools(options?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  pricingModel?: string;
  hasApi?: boolean;
  searchQuery?: string;
  sortBy?: "recently_added" | "name_asc";
}): Promise<PaginatedToolsResult> {
  const page = Math.max(1, options?.page || 1);
  const pageSize = Math.max(1, Math.min(100, options?.pageSize || 24));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (supabase) {
    let query = supabase.from("tools").select("*", { count: "exact" }).eq("is_active", true);

    if (options?.categorySlug && options.categorySlug !== "all") {
      const catRes = await withTimeout(
        supabase.from("categories").select("id").eq("slug", options.categorySlug).single()
      );
      if (catRes && catRes.data) {
        query = query.eq("category_id", catRes.data.id);
      }
    }

    if (options?.hasApi) {
      query = query.eq("has_api", true);
    }

    if (options?.pricingModel && options.pricingModel !== "all") {
      query = query.eq("pricing_model", options.pricingModel);
    }

    if (options?.searchQuery) {
      query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
    }

    if (options?.sortBy === "name_asc") {
      query = query.order("name", { ascending: true });
    } else {
      query = query.order("added_at", { ascending: false });
    }

    const res = await withTimeout(query.range(from, to));

    if (res && !res.error && res.data) {
      const totalCount = res.count || res.data.length;
      return {
        tools: res.data as Tool[],
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    }
  }

  // Fallback to MOCK_TOOLS
  let results = [...MOCK_TOOLS];
  if (options?.hasApi) results = results.filter((t) => t.has_api);
  if (options?.pricingModel && options.pricingModel !== "all") {
    results = results.filter((t) => t.pricing_model === options.pricingModel);
  }
  const totalCount = results.length;
  const tools = results.slice(from, from + pageSize);

  return {
    tools,
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

// Fetch single tool detail by slug
export async function fetchToolBySlug(slug: string): Promise<Tool | null> {
  if (supabase) {
    const res = await withTimeout(
      supabase
        .from("tools")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single()
    );

    if (res && !res.error && res.data) {
      // Log view asynchronously
      supabase.from("view_logs").insert({ tool_id: res.data.id }).then(() => {});
      return res.data as Tool;
    }
  }

  // Fallback
  return MOCK_TOOLS.find((t) => t.slug === slug) || null;
}

// Insert community tool submission
export async function insertSubmission(
  submission: Omit<Submission, "id" | "status" | "submitted_at">
): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    const { error } = await supabase.from("submissions").insert({
      name: submission.name,
      url: submission.url,
      description: submission.description,
      category: submission.category,
      pricing_model: submission.pricing_model,
      tags: submission.tags,
      submitter_email: submission.submitter_email,
      status: "pending",
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Fallback mode (for development without DB)
  return { success: true };
}

// Fetch real pending community tool submissions from database
export async function fetchPendingSubmissions(): Promise<Submission[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (!error && data) {
      return data as Submission[];
    }
  }
  return [];
}

// Update submission status in database
export async function updateSubmissionStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    const { error } = await supabase
      .from("submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }
  return { success: true };
}

export async function fetchPendingLinkReports(): Promise<LinkReport[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("link_reports")
      .select("*, tools(name, url)")
      .eq("status", "pending")
      .order("reported_at", { ascending: false });

    if (!error && data) {
      return data as LinkReport[];
    }
  }
  return [];
}

export async function updateLinkReportStatus(
  id: string,
  status: "resolved" | "dismissed"
): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    const { error } = await supabase
      .from("link_reports")
      .update({ status })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }
  return { success: true };
}

export interface TrendingResult {
  tools: Tool[];
  viewCounts: Record<string, number>;
  sparklines: Record<string, number[]>;
}

// Fetch trending tools based on real view_logs table data
export async function fetchTrendingTools(): Promise<TrendingResult> {
  if (supabase) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: logs, error } = await supabase
      .from("view_logs")
      .select("tool_id, viewed_at")
      .gte("viewed_at", twentyFourHoursAgo);

    if (!error && logs && logs.length > 0) {
      const counts: Record<string, number> = {};
      const bucketMaps: Record<string, number[]> = {};
      const nowMs = Date.now();
      const bucketDuration = 6 * 60 * 60 * 1000; // 6h buckets (4 buckets for 24h)

      logs.forEach((log) => {
        if (log.tool_id) {
          counts[log.tool_id] = (counts[log.tool_id] || 0) + 1;
          
          if (!bucketMaps[log.tool_id]) {
            bucketMaps[log.tool_id] = [0, 0, 0, 0];
          }
          
          const viewedAtMs = new Date(log.viewed_at).getTime();
          const ageMs = nowMs - viewedAtMs;
          const bucketIndex = Math.min(3, Math.max(0, Math.floor(ageMs / bucketDuration)));
          // Index 3 is oldest 6h, Index 0 is newest 6h. Reverse for left-to-right chronological plot:
          const chronoIndex = 3 - bucketIndex;
          bucketMaps[log.tool_id][chronoIndex] = (bucketMaps[log.tool_id][chronoIndex] || 0) + 1;
        }
      });

      const sortedIds = Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 3);

      if (sortedIds.length > 0) {
        const { data: trendingTools } = await supabase
          .from("tools")
          .select("*")
          .in("id", sortedIds);

        if (trendingTools && trendingTools.length > 0) {
          const sortedTools = sortedIds
            .map((id) => trendingTools.find((t) => t.id === id))
            .filter((t): t is Tool => Boolean(t));
          return { tools: sortedTools, viewCounts: counts, sparklines: bucketMaps };
        }
      }
    }
  }

  return { tools: [], viewCounts: {}, sparklines: {} };
}

export interface AdminAnalyticsData {
  totalTools: number;
  toolsWithApi: number;
  pricingBreakdown: Record<string, number>;
  categoryDistribution: { categoryName: string; count: number }[];
  submissionStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  trendingData: TrendingResult;
}

// Fetch genuinely available analytics metrics from tools, submissions, categories, and view_logs
export async function fetchAdminAnalytics(): Promise<AdminAnalyticsData> {
  let totalTools = 0;
  let toolsWithApi = 0;
  const pricingBreakdown: Record<string, number> = {
    free: 0,
    freemium: 0,
    paid: 0,
    "open-source": 0,
  };
  const categoryCounts: Record<string, number> = {};
  const submissionStats = { total: 0, pending: 0, approved: 0, rejected: 0 };

  if (supabase) {
    // 1. Tools metadata & pricing breakdown
    const { data: tools } = await supabase.from("tools").select("id, pricing_model, has_api, category_id").eq("is_active", true);
    if (tools) {
      totalTools = tools.length;
      tools.forEach((t) => {
        if (t.has_api) toolsWithApi++;
        if (t.pricing_model) {
          pricingBreakdown[t.pricing_model] = (pricingBreakdown[t.pricing_model] || 0) + 1;
        }
      });
    }

    // 2. Category distribution
    const { data: categories } = await supabase.from("categories").select("id, name");
    if (categories && tools) {
      const catMap = new Map(categories.map((c) => [c.id, c.name]));
      tools.forEach((t) => {
        if (t.category_id) {
          const name = catMap.get(t.category_id) || "Uncategorized";
          categoryCounts[name] = (categoryCounts[name] || 0) + 1;
        }
      });
    }

    // 3. Submissions breakdown
    const { data: submissions } = await supabase.from("submissions").select("status");
    if (submissions) {
      submissionStats.total = submissions.length;
      submissions.forEach((s) => {
        if (s.status === "pending") submissionStats.pending++;
        if (s.status === "approved") submissionStats.approved++;
        if (s.status === "rejected") submissionStats.rejected++;
      });
    }
  }

  const categoryDistribution = Object.entries(categoryCounts)
    .map(([categoryName, count]) => ({ categoryName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const trendingData = await fetchTrendingTools();

  return {
    totalTools: totalTools || MOCK_TOOLS.length,
    toolsWithApi,
    pricingBreakdown,
    categoryDistribution,
    submissionStats,
    trendingData,
  };
}

