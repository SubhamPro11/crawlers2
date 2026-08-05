import { MetadataRoute } from "next";
import { TAXONOMY_SEEDS } from "@/lib/taxonomy";
import { MOCK_TOOLS } from "@/lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dev";
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

  // Tool detail routes
  const toolRoutes: MetadataRoute.Sitemap = MOCK_TOOLS.map((tool) => ({
    url: `${baseUrl}/tool/${tool.slug}`,
    lastModified: new Date(tool.updated_at || tool.added_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...sectionRoutes, ...categoryRoutes, ...toolRoutes];
}
