import { MetadataRoute } from "next";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { getCachedTools } from "@/lib/cached-queries";
import { MOCK_TOOLS } from "@/lib/mockData";

export const revalidate = 3600; // Regenerate sitemap every hour via ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";
  const now = new Date();

  // Core Landing & Directory Pages
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
      priority: 0.95,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/stacks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/api`,
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
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 9 Top-Level Section Hubs
  const sectionRoutes: MetadataRoute.Sitemap = TAXONOMY_SEEDS.map((section) => ({
    url: `${baseUrl}/${section.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 43 Canonical Category URLs (/tools/[category] & /[section]/[category])
  const categoryRoutes: MetadataRoute.Sitemap = [];
  TAXONOMY_SEEDS.forEach((section) => {
    section.categories.forEach((cat) => {
      // Primary category link
      categoryRoutes.push({
        url: `${baseUrl}/tools/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
      // Section-nested category link
      categoryRoutes.push({
        url: `${baseUrl}/${section.slug}/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  });

  // Dynamic Tool Detail Routes (1,000+ Tools)
  const dbTools = await getCachedTools();
  const tools = dbTools && dbTools.length > 0 ? dbTools : MOCK_TOOLS;

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(tool.updated_at || tool.added_at || now),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...sectionRoutes, ...categoryRoutes, ...toolRoutes];
}
