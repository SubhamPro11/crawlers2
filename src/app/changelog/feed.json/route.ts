import { NextResponse } from "next/server";
import { CHANGELOG_ENTRIES } from "@/lib/changelogData";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dev";

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Crawlers Directory — Public Changelog",
    home_page_url: `${baseUrl}/changelog`,
    feed_url: `${baseUrl}/changelog/feed.json`,
    description: "Chronological release notes, taxonomy additions, and technical changes for Crawlers.",
    items: CHANGELOG_ENTRIES.map((entry) => ({
      id: entry.version,
      url: `${baseUrl}/changelog`,
      title: `${entry.version} - ${entry.title}`,
      summary: entry.description,
      content_text: `${entry.description}\n\nHighlights:\n${entry.highlights.map((h) => `- ${h}`).join("\n")}`,
      date_published: new Date(entry.date).toISOString(),
    })),
  };

  return NextResponse.json(jsonFeed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
