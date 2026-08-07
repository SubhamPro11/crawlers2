import { createClient } from "@supabase/supabase-js";
import { Section, Category, Tool, Submission } from "@/types/database";
import { TAXONOMY_SEEDS } from "./taxonomy";
import { MOCK_TOOLS } from "./mockData";

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-key-here"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Trigger Google OAuth Sign-In
export async function signInWithGoogle(nextUrl = "/"): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: "Supabase client is not configured." };
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  return {};
}

// Sign out current user session
export async function signOutUser(): Promise<{ error?: string }> {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem("crawlers_admin_session");
  }
  return {};
}

// Fetch all sections
export async function fetchSections(): Promise<Section[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Section[];
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
    const { data: sectionData } = await supabase
      .from("sections")
      .select("id")
      .eq("slug", sectionSlug)
      .single();

    if (sectionData) {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("section_id", sectionData.id)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
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
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .single();
      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    } else if (options?.sectionSlug) {
      const { data: sectionData } = await supabase
        .from("sections")
        .select("id")
        .eq("slug", options.sectionSlug)
        .single();
      if (sectionData) {
        const { data: catList } = await supabase
          .from("categories")
          .select("id")
          .eq("section_id", sectionData.id);
        if (catList && catList.length > 0) {
          query = query.in(
            "category_id",
            catList.map((c) => c.id)
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

    const { data, error } = await query.order("added_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Tool[];
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
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", options.categorySlug)
        .single();
      if (catData) {
        query = query.eq("category_id", catData.id);
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

    const { data, count, error } = await query.range(from, to);

    if (!error && data) {
      const totalCount = count || data.length;
      return {
        tools: data as Tool[],
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
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!error && data) {
      // Log view asynchronously
      supabase.from("view_logs").insert({ tool_id: data.id }).then(() => {});
      return data as Tool;
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

