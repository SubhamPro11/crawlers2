"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateDirectoryCache(tagOrPath?: { tag?: string; path?: string }) {
  if (tagOrPath?.tag) {
    revalidateTag(tagOrPath.tag, "max");
  } else if (tagOrPath?.path) {
    revalidatePath(tagOrPath.path);
  } else {
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

  return { success: true, timestamp: Date.now() };
}
