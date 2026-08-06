import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/style-guide", "/api/private/", "/admin", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
