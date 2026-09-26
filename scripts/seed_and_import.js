const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_AvdWqSLptj3FHgLOrvRZXw_NQIjs_El";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabase = createClient(supabaseUrl, DEFAULT_SUPABASE_KEY);

// Canonical 9 sections and 43 categories matching supabase/seed.sql and src/lib/taxonomy.ts
const TAXONOMY_SEEDS = [
  {
    number: 1,
    name: "Text & Writing",
    slug: "text-writing",
    description: "Tools for writing assistance, copywriting, transcription, and document intelligence.",
    categories: [
      { name: "Writing Assistants", slug: "writing-assistants", subgroup: "Content Generation & Copywriting", description: "Real-time prose enhancement, auto-completion, and drafting tools." },
      { name: "Copywriting", slug: "copywriting", subgroup: "Content Generation & Copywriting", description: "Marketing copy generators, ad headlines, and landing page text creation." },
      { name: "Resume Tools", slug: "resume-tools", subgroup: "Content Generation & Copywriting", description: "AI resume builders, cover letter engines, and career profile optimizers." },
      { name: "Transcription", slug: "transcription", subgroup: "Document Processing & Audio Transcription", description: "Speech-to-text conversion and automated meeting transcript generation." },
      { name: "Document AI", slug: "document-ai", subgroup: "Document Processing & Audio Transcription", description: "PDF parsing, contract summary engines, and structured document extraction." },
    ],
  },
  {
    number: 2,
    name: "Audio, Video & Media",
    slug: "audio-video-media",
    description: "Generative video, music production, voice synthesis, and multimedia editing tools.",
    categories: [
      { name: "Video Generator", slug: "video-generator", subgroup: "Video & Animation Production", description: "Text-to-video, avatar generation, and automated video editing software." },
      { name: "Podcast Tools", slug: "podcast-tools", subgroup: "Video & Animation Production", description: "Automated audio cleanup, show notes generation, and clip extraction." },
      { name: "Music Generation", slug: "music-generation", subgroup: "Audio, Speech & Music Processing", description: "AI composition tools, background track generation, and stem isolation." },
      { name: "Voice Cloning", slug: "voice-cloning", subgroup: "Audio, Speech & Music Processing", description: "Custom voice model creation and acoustic voice replication." },
      { name: "Text-to-Speech", slug: "text-to-speech", subgroup: "Audio, Speech & Music Processing", description: "High-fidelity audio narration and natural speech synthesis engines." },
    ],
  },
  {
    number: 3,
    name: "Design & 3D Creative",
    slug: "design-3d-creative",
    description: "Image generation, logo design, 3D modeling, spatial computing, and fashion design.",
    categories: [
      { name: "Image Generation", slug: "image-generation", subgroup: "2D Visuals & Graphics", description: "Diffusion models, concept art generators, and image edit pipelines." },
      { name: "Logo Generator", slug: "logo-generator", subgroup: "2D Visuals & Graphics", description: "Brand mark creation, vector logo generators, and identity design tools." },
      { name: "Fashion Design", slug: "fashion-design", subgroup: "2D Visuals & Graphics", description: "Apparel design, virtual try-on models, and pattern creation." },
      { name: "3D Modeling", slug: "3d-modeling", subgroup: "3D, Immersive & Spatial", description: "Text-to-3D asset generators, mesh refinement, and texture synthesis." },
      { name: "AR/VR", slug: "ar-vr", subgroup: "3D, Immersive & Spatial", description: "Spatial environment generation, interactive AR experiences, and VR tools." },
    ],
  },
  {
    number: 4,
    name: "Productivity & Business",
    slug: "productivity-business",
    description: "Workflow automation, project management, meeting tools, CRM, and financial assistant platforms.",
    categories: [
      { name: "Project Management", slug: "project-management", subgroup: "Workflow & Project Management", description: "Smart task scheduling, project summaries, and backlog prioritization." },
      { name: "CRM", slug: "crm", subgroup: "Workflow & Project Management", description: "Customer relationship management, sentiment tracking, and deal analytics." },
      { name: "Meeting Assistants", slug: "meeting-assistants", subgroup: "Workflow & Project Management", description: "Automated meeting notes, action item extractors, and attendance bots." },
      { name: "Email Assistants", slug: "email-assistants", subgroup: "Communication & Operations", description: "Smart inbox triage, draft generation, and follow-up reminders." },
      { name: "Finance Tools", slug: "finance-tools", subgroup: "Communication & Operations", description: "Invoice processing, expense auditing, and financial forecasting AI." },
    ],
  },
  {
    number: 5,
    name: "Developer & Tech Tools",
    slug: "developer-tech-tools",
    description: "AI coding copilots, developer infrastructure, API tools, no-code builders, and browser extensions.",
    categories: [
      { name: "Code Assistants", slug: "code-assistants", subgroup: "Code & Infrastructure", description: "Code completion, inline refactoring, bug fixing, and test generators." },
      { name: "DevTools", slug: "devtools", subgroup: "Code & Infrastructure", description: "CI/CD pipeline optimizers, telemetry analytics, and CLI extensions." },
      { name: "API Tools", slug: "api-tools", subgroup: "Code & Infrastructure", description: "API key registries, documentation engines, and mock server generators." },
      { name: "No-Code Builders", slug: "no-code-builders", subgroup: "Platforms & Extensions", description: "Prompt-driven web builders, workflow automation, and app creators." },
      { name: "AI Extensions", slug: "ai-extensions", subgroup: "Platforms & Extensions", description: "Browser extensions, IDE plugins, and terminal productivity enhancements." },
    ],
  },
  {
    number: 6,
    name: "Data, Models & Security",
    slug: "data-models-security",
    description: "Database AI extensions, cybersecurity tools, computer vision pipelines, and content moderation.",
    categories: [
      { name: "Database Tools", slug: "database-tools", subgroup: "Data Architecture & Analytics", description: "Text-to-SQL generation, vector index optimizers, and migration generators." },
      { name: "Computer Vision", slug: "computer-vision", subgroup: "Data Architecture & Analytics", description: "Object detection, OCR extraction, and visual inspection models." },
      { name: "Cybersecurity", slug: "cybersecurity", subgroup: "Security & Governance", description: "Vulnerability scanners, threat intelligence, and log anomaly detection." },
      { name: "Content Moderation", slug: "content-moderation", subgroup: "Security & Governance", description: "Automated safety filters, hallucination detection, and PII redact engines." },
    ],
  },
  {
    number: 7,
    name: "Marketing, Sales & SEO",
    slug: "marketing-sales-seo",
    description: "Lead generation, social management, automated ad creatives, and e-commerce optimization.",
    categories: [
      { name: "Lead Generation", slug: "lead-generation", subgroup: "Sales Engine & Outreach", description: "Prospect enrichment, cold outreach personalization, and pipeline scoring." },
      { name: "E-Commerce", slug: "e-commerce", subgroup: "Sales Engine & Outreach", description: "Product description generators, pricing intelligence, and store AI." },
      { name: "Social Media Tools", slug: "social-media-tools", subgroup: "Brand & Audience", description: "Post schedulers, thread generators, and engagement analytics." },
      { name: "Ad Generator", slug: "ad-generator", subgroup: "Brand & Audience", description: "Multi-channel ad variations, creative testing, and copy optimization." },
    ],
  },
  {
    number: 8,
    name: "Search, Chat & AI Agents",
    slug: "search-chat-ai-agents",
    description: "Autonomous agent frameworks, chatbot builders, personal AI assistants, and research engines.",
    categories: [
      { name: "AI Agents", slug: "ai-agents", subgroup: "Autonomous Agents & Systems", description: "Multi-agent orchestration frameworks, goal-directed task runners." },
      { name: "Research Tools", slug: "research-tools", subgroup: "Autonomous Agents & Systems", description: "Academic paper summaries, web synthesis engines, and fact checkers." },
      { name: "Chatbot Builders", slug: "chatbot-builders", subgroup: "Conversational Interfaces", description: "Custom RAG chatbot creation, customer support bots, and knowledge base sync." },
      { name: "Personal Assistants", slug: "personal-assistants", subgroup: "Conversational Interfaces", description: "Executive assistants, daily planners, and habit tracking bots." },
    ],
  },
  {
    number: 9,
    name: "Education & Lifestyle",
    slug: "education-lifestyle",
    description: "Adaptive learning tools, language acquisition, wellness guidance, gaming, and accessibility utilities.",
    categories: [
      { name: "Learning Tools", slug: "learning-tools", subgroup: "Learning & Knowledge Systems", description: "Personalized tutor bots, flashcard generators, and study plan tools." },
      { name: "Language Learning", slug: "language-learning", subgroup: "Learning & Knowledge Systems", description: "Conversational language practice and pronunciation feedback engines." },
      { name: "Accessibility", slug: "accessibility", subgroup: "Learning & Knowledge Systems", description: "Screen reader enrichers, alt-text generators, and sensory assistance AI." },
      { name: "Wellness", slug: "wellness", subgroup: "Lifestyle & Leisure", description: "Mindfulness assistants, sleep trackers, and fitness plan generators." },
      { name: "Gaming", slug: "gaming", subgroup: "Lifestyle & Leisure", description: "NPC dialog generators, procedural map builders, and game asset tools." },
      { name: "Travel", slug: "travel", subgroup: "Lifestyle & Leisure", description: "Itinerary planners, flight price predictors, and local culture guides." },
    ],
  },
];

const MOCK_TOOLS = [
  {
    name: "Ollama",
    slug: "ollama",
    url: "https://ollama.com",
    description: "Runs Llama 3, DeepSeek, and open weights locally on your workstation via a zero-config CLI daemon and HTTP endpoint.",
    pricing_model: "open-source",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Cursor",
    slug: "cursor",
    url: "https://cursor.com",
    description: "VS Code fork tailored for model-assisted editing. Indexes your codebase for instant semantic search, generates multi-file diffs, and inspects terminal failures directly.",
    pricing_model: "freemium",
    category_slug: "code-assistants",
    has_api: false,
  },
  {
    name: "v0 by Vercel",
    slug: "v0-by-vercel",
    url: "https://v0.dev",
    description: "Generates production-grade React components from prompt sketches. Emits raw Tailwind CSS and Radix UI code ready to drop into Next.js projects.",
    pricing_model: "freemium",
    category_slug: "no-code-builders",
    has_api: true,
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    url: "https://elevenlabs.io",
    description: "Low-latency voice synthesis API with custom voice cloning and real-time conversational audio streaming across 29+ languages.",
    pricing_model: "freemium",
    category_slug: "text-to-speech",
    has_api: true,
  },
  {
    name: "Whisper by OpenAI",
    slug: "whisper",
    url: "https://github.com/openai/whisper",
    description: "Robust open ASR model trained on 680k hours of audio. Provides PyTorch weights and C++ ports (`whisper.cpp`) for fast CPU/GPU offline transcription.",
    pricing_model: "open-source",
    category_slug: "transcription",
    has_api: true,
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    url: "https://midjourney.com",
    description: "Image generation model known for distinct artistic coherence, text rendering, and high-resolution lighting controls.",
    pricing_model: "paid",
    category_slug: "image-generation",
    has_api: false,
  },
  {
    name: "Claude by Anthropic",
    slug: "claude",
    url: "https://anthropic.com/claude",
    description: "State-of-the-art reasoning model suite featuring 200k context window, artifacts preview, and computer use capability.",
    pricing_model: "freemium",
    category_slug: "ai-agents",
    has_api: true,
  },
  {
    name: "Pinecone",
    slug: "pinecone",
    url: "https://pinecone.io",
    description: "Serverless vector database designed for high-throughput similarity search, RAG pipelines, and real-time embedding indexing.",
    pricing_model: "freemium",
    category_slug: "database-tools",
    has_api: true,
  },
];

// Helper to resolve category slug from text
function getCategorySlug(name, desc) {
  const text = (name + " " + desc).toLowerCase();
  if (text.includes("agent") || text.includes("agents") || text.includes("autonomous")) return "ai-agents";
  if (text.includes("chatbot") || text.includes("chat bot") || text.includes("customer support")) return "chatbot-builders";
  if (text.includes("sql") || text.includes("database") || text.includes("vector") || text.includes("postgres")) return "database-tools";
  if (text.includes("vision") || text.includes("ocr") || text.includes("detection")) return "computer-vision";
  if (text.includes("security") || text.includes("guardrail") || text.includes("vulnerability")) return "cybersecurity";
  if (text.includes("coding") || text.includes("copilot") || text.includes("autocomplete") || text.includes("refactor")) return "code-assistants";
  if (text.includes("no-code") || text.includes("builder") || text.includes("low-code")) return "no-code-builders";
  if (text.includes("api") || text.includes("sdk") || text.includes("framework")) return "api-tools";
  if (text.includes("logo") || text.includes("vector logo")) return "logo-generator";
  if (text.includes("fashion") || text.includes("apparel") || text.includes("try-on")) return "fashion-design";
  if (text.includes("3d") || text.includes("mesh") || text.includes("render")) return "3d-modeling";
  if (text.includes("ar/vr") || text.includes("vr") || text.includes("spatial")) return "ar-vr";
  if (text.includes("image") || text.includes("art") || text.includes("photo") || text.includes("design") || text.includes("avatar")) return "image-generation";
  if (text.includes("video") || text.includes("animation")) return "video-generator";
  if (text.includes("podcast") || text.includes("show notes")) return "podcast-tools";
  if (text.includes("music") || text.includes("audio track") || text.includes("beat")) return "music-generation";
  if (text.includes("speech") || text.includes("voice") || text.includes("narration")) return "text-to-speech";
  if (text.includes("transcription") || text.includes("speech to text")) return "transcription";
  if (text.includes("document") || text.includes("pdf") || text.includes("contract")) return "document-ai";
  if (text.includes("resume") || text.includes("cover letter")) return "resume-tools";
  if (text.includes("copy") || text.includes("writing") || text.includes("content writer")) return "copywriting";
  if (text.includes("social") || text.includes("twitter") || text.includes("linkedin")) return "social-media-tools";
  if (text.includes("ad ") || text.includes("advertising") || text.includes("campaign")) return "ad-generator";
  if (text.includes("ecommerce") || text.includes("store") || text.includes("product")) return "e-commerce";
  if (text.includes("lead") || text.includes("seo") || text.includes("outreach") || text.includes("sales")) return "lead-generation";
  if (text.includes("meeting") || text.includes("notes") || text.includes("calendar")) return "meeting-assistants";
  if (text.includes("email") || text.includes("inbox")) return "email-assistants";
  if (text.includes("crm")) return "crm";
  if (text.includes("finance") || text.includes("tax") || text.includes("invoice") || text.includes("legal")) return "finance-tools";
  if (text.includes("game") || text.includes("gaming")) return "gaming";
  if (text.includes("wellness") || text.includes("health") || text.includes("fitness")) return "wellness";
  if (text.includes("language")) return "language-learning";
  if (text.includes("learning") || text.includes("education") || text.includes("tutor") || text.includes("study")) return "learning-tools";
  if (text.includes("task") || text.includes("project") || text.includes("productivity") || text.includes("workflow")) return "project-management";
  return "devtools";
}

async function seedDatabase() {
  console.log("=== Step 1: Seeding Canonical Sections & Categories ===");
  const categoryMap = {}; // slug -> UUID

  for (const sSeed of TAXONOMY_SEEDS) {
    const { data: sectionData, error: sErr } = await supabase
      .from("sections")
      .upsert(
        {
          name: sSeed.name,
          slug: sSeed.slug,
          description: sSeed.description,
          display_order: sSeed.number,
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (sErr) {
      console.error(`Error upserting section ${sSeed.slug}:`, sErr.message);
      continue;
    }

    for (let i = 0; i < sSeed.categories.length; i++) {
      const cSeed = sSeed.categories[i];
      const { data: catData, error: cErr } = await supabase
        .from("categories")
        .upsert(
          {
            section_id: sectionData.id,
            name: cSeed.name,
            slug: cSeed.slug,
            subgroup: cSeed.subgroup,
            description: cSeed.description,
            display_order: i + 1,
          },
          { onConflict: "slug" }
        )
        .select()
        .single();

      if (cErr) {
        console.error(`Error upserting category ${cSeed.slug}:`, cErr.message);
      } else if (catData) {
        categoryMap[cSeed.slug] = catData.id;
      }
    }
  }

  console.log(`Seeded sections and mapped ${Object.keys(categoryMap).length} categories.`);

  console.log("=== Step 2: Parsing Tool Catalog ===");
  const { data: existingTools } = await supabase.from("tools").select("slug, name");
  const seenSlugs = new Set((existingTools || []).map((t) => t.slug));
  const seenNames = new Set((existingTools || []).map((t) => t.name.toLowerCase()));

  const parsedTools = [];

  // Seed baseline mock tools first if missing
  for (const mTool of MOCK_TOOLS) {
    if (!seenSlugs.has(mTool.slug) && !seenNames.has(mTool.name.toLowerCase())) {
      seenSlugs.add(mTool.slug);
      seenNames.add(mTool.name.toLowerCase());
      parsedTools.push({
        name: mTool.name,
        slug: mTool.slug,
        url: mTool.url,
        description: mTool.description,
        pricing_model: mTool.pricing_model,
        category_id: categoryMap[mTool.category_slug] || categoryMap["devtools"],
        has_api: mTool.has_api,
        is_active: true,
      });
    }
  }

  // Check for catalog files: AITool.md or alternative
  const catalogPaths = [
    path.join(__dirname, "../AITool.md"),
    path.join(__dirname, "../new ai b.md"),
  ];

  for (const filePath of catalogPaths) {
    if (!fs.existsSync(filePath)) continue;

    console.log(`Reading tools from ${path.basename(filePath)}...`);
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    let currentHeading = "Developer Tools";

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith("#")) {
        const headingText = line.replace(/^#+\s*/, "").trim();
        if (headingText && !headingText.toLowerCase().includes("master list") && !headingText.toLowerCase().includes("awesome")) {
          currentHeading = headingText;
        }
        continue;
      }

      // Match markdown links: 1. [Name](url) or - [Name](url) - description
      const match = line.match(/^(?:\d+\.|\-|\*)\s*\[([^\]]+)\]\(([^)]+)\)(.*)/);
      if (match) {
        let name = match[1].trim();
        let url = match[2].trim();
        let desc = match[3] ? match[3].trim() : "";

        if (desc.startsWith("-") || desc.startsWith("–") || desc.startsWith("—")) {
          desc = desc.substring(1).trim();
        }

        if (!desc || desc.length < 10) {
          desc = `${name} is an AI tool specialized in ${currentHeading.toLowerCase()}. Direct access and verified directory indexing.`;
        }

        const nameKey = name.toLowerCase();
        if (seenNames.has(nameKey)) continue; // Skip duplicates cleanly!

        let baseSlug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        if (!baseSlug || seenSlugs.has(baseSlug)) continue;

        seenNames.add(nameKey);
        seenSlugs.add(baseSlug);

        let pricing_model = "freemium";
        const textLower = (name + " " + desc).toLowerCase();
        if (textLower.includes("free") && !textLower.includes("freemium")) pricing_model = "free";
        else if (textLower.includes("open-source") || url.includes("github.com")) pricing_model = "open-source";
        else if (textLower.includes("paid")) pricing_model = "paid";

        const has_api = textLower.includes("api") || textLower.includes("sdk") || url.includes("github.com");
        const categorySlug = getCategorySlug(name, currentHeading + " " + desc);
        const category_id = categoryMap[categorySlug] || categoryMap["devtools"];

        parsedTools.push({
          name,
          slug: baseSlug,
          url,
          description: desc,
          pricing_model,
          category_id,
          has_api,
          is_active: true,
        });
      }
    }
  }

  console.log(`Parsed ${parsedTools.length} new unique tools to insert.`);

  if (parsedTools.length > 0) {
    const chunkSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < parsedTools.length; i += chunkSize) {
      const chunk = parsedTools.slice(i, i + chunkSize);
      const { data, error } = await supabase
        .from("tools")
        .upsert(chunk, { onConflict: "slug" })
        .select();

      if (error) {
        console.error(`Error inserting chunk ${Math.floor(i / chunkSize) + 1}:`, error.message);
      } else {
        insertedCount += data ? data.length : chunk.length;
        console.log(`Upserted chunk ${Math.floor(i / chunkSize) + 1} (${chunk.length} tools).`);
      }
    }

    console.log(`Done! Upserted ${insertedCount} tools to Supabase.`);
  }
}

seedDatabase().catch(console.error);
