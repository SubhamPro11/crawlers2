import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  if (!REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "REVALIDATION_SECRET is not configured on server" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const secret =
      request.headers.get("x-revalidate-secret") ||
      request.nextUrl.searchParams.get("secret") ||
      body.secret;

    // Verify authentication
    if (secret !== REVALIDATION_SECRET) {
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
    console.error("Failed to revalidate cache:", err);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: "REVALIDATION_SECRET is not configured on server" },
      { status: 500 }
    );
  }

  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== REVALIDATION_SECRET) {
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
