import { NextRequest, NextResponse } from "next/server";
import { fetchTools } from "@/lib/supabase";
import { MOCK_TOOL_TAGS } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const tagParam = searchParams.get("tag");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  let tools = await fetchTools({
    categorySlug: categoryParam || undefined,
    limit: limit > 100 ? 100 : limit,
  });

  // Filter by tag if requested
  if (tagParam && tools.length > 0) {
    tools = tools.filter((t) => {
      const toolTags = MOCK_TOOL_TAGS[t.slug] || [];
      return toolTags.some((tag) => tag.toLowerCase() === tagParam.toLowerCase());
    });
  }

  const responsePayload = {
    count: tools.length,
    filters: {
      category: categoryParam || null,
      tag: tagParam || null,
      limit: limit,
    },
    tools: tools.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      url: t.url,
      description: t.description,
      pricing_model: t.pricing_model,
      has_api: t.has_api,
      tags: MOCK_TOOL_TAGS[t.slug] || ["ai"],
      added_at: t.added_at,
    })),
  };

  return NextResponse.json(responsePayload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "99",
      "X-RateLimit-Reset": Math.floor(Date.now() / 1000 + 3600).toString(),
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}
