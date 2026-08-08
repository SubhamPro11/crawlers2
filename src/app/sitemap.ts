import { MetadataRoute } from "next";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { fetchTools } from "@/lib/supabase";
import { MOCK_TOOLS } from "@/lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stacks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/api`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Section routes
  const sectionRoutes: MetadataRoute.Sitemap = TAXONOMY_SEEDS.map((section) => ({
    url: `${baseUrl}/${section.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = TAXONOMY_SEEDS.flatMap((section) =>
    section.categories.map((cat) => ({
      url: `${baseUrl}/${section.slug}/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  );

  // Dynamic tool detail routes from database (with fallback to mock dataset)
  const dbTools = await fetchTools();
  const tools = dbTools && dbTools.length > 0 ? dbTools : MOCK_TOOLS;

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(tool.updated_at || tool.added_at || now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...sectionRoutes, ...categoryRoutes, ...toolRoutes];
}

