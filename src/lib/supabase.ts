import { createClient } from "@supabase/supabase-js";
import { Section, Category, Tool, Submission } from "@/types/database";
import { TAXONOMY_SEEDS } from "./taxonomy";
import { MOCK_TOOLS } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey &&
    supabaseAnonKey !== "your-anon-key-here"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
