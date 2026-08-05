import { NextResponse } from "next/server";
import { CHANGELOG_ENTRIES } from "@/lib/changelogData";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crawlers.dev";

  const rssItemsXml = CHANGELOG_ENTRIES.map(
    (entry) => `
    <item>
      <title><![CDATA[${entry.version} - ${entry.title}]]></title>
      <link>${baseUrl}/changelog</link>
      <guid isPermaLink="false">${entry.version}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description><![CDATA[${entry.description}\n\nHighlights:\n${entry.highlights.map((h) => `- ${h}`).join("\n")}]]></description>
    </item>`
  ).join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crawlers Directory — Public Changelog</title>
    <link>${baseUrl}/changelog</link>
    <description>Chronological release notes, taxonomy additions, and technical changes for Crawlers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/changelog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
