import { NextResponse } from "next/server";
import { getCachedTools } from "@/lib/cached-queries";

export const revalidate = 3600; // 1-hour ISR cache

export async function GET() {
  const tools = await getCachedTools();

  const compactTools = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description
      ? t.description.length > 140
        ? t.description.slice(0, 137) + "..."
        : t.description
      : "",
    category_id: t.category_id,
    pricing_model: t.pricing_model,
    has_api: Boolean(t.has_api),
    logo_url: t.logo_url || null,
    url: t.url,
  }));

  return NextResponse.json(compactTools, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
