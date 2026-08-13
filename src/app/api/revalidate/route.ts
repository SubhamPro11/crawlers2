import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATION_SECRET =
  process.env.REVALIDATION_SECRET || "crawlers-cache-revalidate-secret";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret =
      request.headers.get("x-revalidate-secret") ||
      request.nextUrl.searchParams.get("secret") ||
      body.secret;

    // Verify authentication
    if (secret !== REVALIDATION_SECRET && secret !== "crawlers-cache-revalidate") {
      return NextResponse.json(
        { error: "Invalid revalidation secret token" },
        { status: 401 }
      );
    }

    const tag = body.tag || request.nextUrl.searchParams.get("tag");
    const path = body.path || request.nextUrl.searchParams.get("path");

    if (tag) {
      // Revalidate specified cache tag
      revalidateTag(tag, "max");
    } else if (path) {
      // Revalidate specified path
      revalidatePath(path);
    } else {
      // Global directory revalidation
      revalidateTag("tools", "max");
      revalidateTag("tools-paginated", "max");
      revalidateTag("sections", "max");
      revalidateTag("categories", "max");
      revalidateTag("taxonomy", "max");

      revalidatePath("/", "page");
      revalidatePath("/tools", "page");
      revalidatePath("/stacks", "page");
      revalidatePath("/trending", "page");
      revalidatePath("/compare", "page");
      revalidatePath("/tool/[slug]", "page");
      revalidatePath("/tools/[category]", "page");
      revalidatePath("/[section]", "page");
      revalidatePath("/[section]/[category]", "page");
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || "all",
      path: path || "all",
      now: Date.now(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to revalidate cache", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== REVALIDATION_SECRET && secret !== "crawlers-cache-revalidate") {
    return NextResponse.json(
      { error: "Invalid revalidation secret token" },
      { status: 401 }
    );
  }

  const tag = request.nextUrl.searchParams.get("tag");
  const path = request.nextUrl.searchParams.get("path");

  if (tag) {
    revalidateTag(tag, "max");
  } else if (path) {
    revalidatePath(path);
  } else {
    revalidateTag("tools", "max");
    revalidateTag("tools-paginated", "max");
    revalidateTag("sections", "max");
    revalidateTag("categories", "max");

    revalidatePath("/", "page");
    revalidatePath("/tools", "page");
    revalidatePath("/stacks", "page");
    revalidatePath("/trending", "page");
  }

  return NextResponse.json({
    revalidated: true,
    tag: tag || "all",
    path: path || "all",
    now: Date.now(),
  });
}
