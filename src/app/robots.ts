import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dpdns.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tools",
          "/tools/*",
          "/tool/*",
          "/trending",
          "/compare",
          "/stacks",
          "/submit",
          "/changelog",
          "/api/tools",
          "/search-index.json",
          "/llms.txt",
          "/llms-full.txt",
          "/sitemap.xml",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/revalidate",
          "/auth/*",
          "/style-guide",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/revalidate", "/auth/*"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
