const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

// Category mapping helper
function mapHeadingToCategorySlug(heading) {
  const h = heading.toLowerCase().trim();
  if (h.includes("audio") || h.includes("transcrib") || h.includes("podcast")) return "transcription";
  if (h.includes("avatar")) return "image-generation";
  if (h.includes("code assistant") || h.includes("developer tools") || h.includes("sql") || h.includes("low-code")) return "code-assistants";
  if (h.includes("copywriting") || h.includes("general writing") || h.includes("email") || h.includes("paraphraser")) return "copywriting";
  if (h.includes("customer support") || h.includes("chat")) return "chatbots";
  if (h.includes("design") || h.includes("logo") || h.includes("image") || h.includes("fashion")) return "image-generation";
  if (h.includes("education") || h.includes("research")) return "learning-education";
  if (h.includes("gaming") || h.includes("fun")) return "gaming-ai";
  if (h.includes("legal")) return "legal-ai";
  if (h.includes("music") || h.includes("text to speech")) return "text-to-speech";
  if (h.includes("personalized video") || h.includes("video")) return "video-generator";
  if (h.includes("productivity") || h.includes("summarizer") || h.includes("memory") || h.includes("spreadsheet")) return "productivity";
  if (h.includes("real estate")) return "3d-modeling";
  if (h.includes("sales") || h.includes("social media") || h.includes("seo") || h.includes("startup")) return "marketing-sales";
  if (h.includes("prompt")) return "devtools";
  return "devtools";
}

async function run() {
  console.log("--- Fetching category mapping from Supabase ---");
  const { data: categories, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr) {
    console.error("Error fetching categories:", catErr.message);
    return;
  }
  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.slug] = c.id;
  });

  // Fetch existing tools to avoid duplicate slugs or update existing
  const { data: existingTools } = await supabase.from("tools").select("slug, name");
  const seenSlugs = new Set((existingTools || []).map((t) => t.slug));

  console.log("--- Parsing AITool.md ---");
  const filePath = path.join(__dirname, "../AITool.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let currentCategoryHeading = "General AI";
  const parsedTools = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Check for section header
    if (line.startsWith("#")) {
      const headingText = line.replace(/^#+\s*/, "").trim();
      if (headingText && headingText !== "AI Tool Master List") {
        currentCategoryHeading = headingText;
      }
      continue;
    }

    // Match list items like: 1. [Krisp](https://krisp.ai/?ref=futurepedia)
    const match = line.match(/^(?:\d+\.|\-|\*)\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      let name = match[1].trim();
      let rawUrl = match[2].trim();

      // Clean URL: keep base URL or remove tracking ref query param if standard
      let url = rawUrl;
      try {
        const parsedUrl = new URL(rawUrl);
        parsedUrl.searchParams.delete("ref");
        parsedUrl.searchParams.delete("via");
        parsedUrl.searchParams.delete("utm_source");
        url = parsedUrl.toString();
      } catch (e) {
        url = rawUrl;
      }

      // Generate base slug
      let baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!baseSlug) baseSlug = `aitool-${Date.now()}`;

      let slug = baseSlug;
      let counter = 1;
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      seenSlugs.add(slug);

      const catSlug = mapHeadingToCategorySlug(currentCategoryHeading);
      const category_id = categoryMap[catSlug] || categoryMap["devtools"];

      const nameLower = name.toLowerCase();
      let pricing_model = "freemium";
      if (nameLower.includes("free")) pricing_model = "free";
      if (url.includes("github.com") || nameLower.includes("open")) pricing_model = "open-source";

      const has_api = nameLower.includes("api") || nameLower.includes("cli") || url.includes("github.com");

      const description = `${name} is an AI-powered tool specialized in ${currentCategoryHeading.toLowerCase()}. Indexed for fast search & direct link access.`;

      parsedTools.push({
        name,
        slug,
        url,
        description,
        pricing_model,
        category_id,
        has_api,
        is_active: true,
      });
    }
  }

  console.log(`Parsed ${parsedTools.length} new tools from AITool.md.`);

  console.log("--- Upserting into Supabase tools table ---");
  const chunkSize = 50;
  let insertedCount = 0;

  for (let i = 0; i < parsedTools.length; i += chunkSize) {
    const chunk = parsedTools.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("tools")
      .upsert(chunk, { onConflict: "slug" })
      .select();

    if (error) {
      console.error(`Error inserting chunk ${i / chunkSize + 1}:`, error.message);
    } else {
      insertedCount += data ? data.length : chunk.length;
      console.log(`Inserted chunk ${i / chunkSize + 1}/${Math.ceil(parsedTools.length / chunkSize)} (${chunk.length} tools).`);
    }
  }

  console.log(`--- COMPLETE! Successfully imported ${insertedCount} tools from AITool.md into Supabase! ---`);
}

run().catch(console.error);
