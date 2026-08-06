const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

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
      { name: "Document AI", slug: "document-ai", subgroup: "Document Processing & Audio Transcription", description: "PDF parsing, contract summary engines, and structured document extraction." }
    ]
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
      { name: "Text-to-Speech", slug: "text-to-speech", subgroup: "Audio, Speech & Music Processing", description: "High-fidelity audio narration and natural speech synthesis engines." }
    ]
  },
  {
    number: 3,
    name: "Design & 3D Creative",
    slug: "design-3d-creative",
    description: "Image generation, logo design, 3D modeling, spatial computing, and fashion design.",
    categories: [
      { name: "Image Generation", slug: "image-generation", subgroup: "Visual Art & Design Generation", description: "Prompt-driven text-to-image synthesis and style transfer engines." },
      { name: "Logo Design", slug: "logo-design", subgroup: "Visual Art & Design Generation", description: "Brand identity, vector logo generators, and typography design tools." },
      { name: "3D Modeling", slug: "3d-modeling", subgroup: "3D & Spatial Computing", description: "Text-to-3D mesh generation, texture synthesis, and spatial asset tools." },
      { name: "Spatial Computing", slug: "spatial-computing", subgroup: "3D & Spatial Computing", description: "NeRF, Gaussian Splatting, and AR/VR environment generation." },
      { name: "Fashion AI", slug: "fashion-ai", subgroup: "Industrial & Product Design", description: "Virtual apparel try-on, textile pattern generation, and fashion concepts." }
    ]
  },
  {
    number: 4,
    name: "Code & Development",
    slug: "code-development",
    description: "AI code assist, no-code application builders, developer tools, and agentic frameworks.",
    categories: [
      { name: "Code Assistants", slug: "code-assistants", subgroup: "Software Engineering & IDE Tools", description: "In-IDE autocomplete, inline refactoring, and code explanation assistants." },
      { name: "No-Code Builders", slug: "no-code-builders", subgroup: "Software Engineering & IDE Tools", description: "Prompt-to-UI generators and full-stack web application scaffolding." },
      { name: "Developer Tools", slug: "devtools", subgroup: "Developer Infrastructure & APIs", description: "Terminal assistants, API registries, and debugging engines." },
      { name: "AI Frameworks", slug: "ai-frameworks", subgroup: "Developer Infrastructure & APIs", description: "Agent orchestrators, RAG frameworks, and model fine-tuning SDKs." }
    ]
  },
  {
    number: 5,
    name: "Data & Analytics",
    slug: "data-analytics",
    description: "Data analysis, business intelligence, interactive visualization, and financial AI.",
    categories: [
      { name: "Data Analysis", slug: "data-analysis", subgroup: "Business Intelligence & Insights", description: "Automated EDA, natural language SQL generation, and tabular insights." },
      { name: "Business Intelligence", slug: "business-intelligence", subgroup: "Business Intelligence & Insights", description: "Executive dashboards, predictive forecasting, and revenue analytics." },
      { name: "Data Visualization", slug: "data-visualization", subgroup: "Data Engineering & Processing", description: "Chart generation, interactive data storyboards, and graph visualization." },
      { name: "Financial AI", slug: "financial-ai", subgroup: "Finance & Quantitative Analytics", description: "Stock analysis, algorithmic trading signals, and financial report parsing." }
    ]
  },
  {
    number: 6,
    name: "AI Assistants & Agents",
    slug: "ai-assistants-agents",
    description: "Autonomous agents, personal productivity assistants, enterprise chatbots, and workflow automation.",
    categories: [
      { name: "Personal Assistants", slug: "personal-assistants", subgroup: "Autonomous Agents & Workflow", description: "Task management, calendar scheduling, and context-aware life assistants." },
      { name: "AI Agents", slug: "ai-agents", subgroup: "Autonomous Agents & Workflow", description: "Multi-step autonomous agents capable of Web browsing, API execution, and coding." },
      { name: "Chatbots", slug: "chatbots", subgroup: "Conversational Interfaces", description: "Customer support bots, conversational knowledge bases, and custom GPTs." },
      { name: "Workflow Automation", slug: "workflow-automation", subgroup: "Autonomous Agents & Workflow", description: "Zapier/Make alternatives with native LLM step execution." }
    ]
  },
  {
    number: 7,
    name: "Infrastructure & DevOps",
    slug: "infrastructure-devops",
    description: "Model hosting, vector databases, MLOps platforms, and specialized GPU cloud compute.",
    categories: [
      { name: "Model Hosting", slug: "model-hosting", subgroup: "Model Infrastructure & Cloud Compute", description: "Serverless LLM endpoints, dedicated GPU clusters, and model serving APIs." },
      { name: "Vector Databases", slug: "vector-databases", subgroup: "Model Infrastructure & Cloud Compute", description: "High-dimensional vector storage, ANN indexing, and embedding retrieval engines." },
      { name: "MLOps", slug: "mlops", subgroup: "Lifecycle Management & Monitoring", description: "Experiment tracking, model evaluation, prompt monitoring, and observability." },
      { name: "Cloud Compute", slug: "cloud-compute", subgroup: "Model Infrastructure & Cloud Compute", description: "On-demand GPU instances (H100, A100) for deep learning training." }
    ]
  },
  {
    number: 8,
    name: "Security & Compliance",
    slug: "security-compliance",
    description: "AI red teaming, data privacy, guardrails, and bias detection software.",
    categories: [
      { name: "AI Security", slug: "ai-security", subgroup: "Security, Safety & Compliance", description: "Prompt injection defense, LLM vulnerability scanning, and red teaming tools." },
      { name: "Data Privacy", slug: "data-privacy", subgroup: "Security, Safety & Compliance", description: "PII masking, synthetic data generation, and enterprise data governance." },
      { name: "Bias Detection", slug: "bias-detection", subgroup: "Security, Safety & Compliance", description: "Model fairness evaluation, toxicity scoring, and hallucination monitoring." }
    ]
  },
  {
    number: 9,
    name: "Education & Lifestyle",
    slug: "education-lifestyle",
    description: "AI tutors, gaming AI engines, health trackers, legal tools, and marketing platforms.",
    categories: [
      { name: "Learning & Education", slug: "learning-education", subgroup: "Education & Knowledge Management", description: "AI flashcard generators, personalized tutoring, and research paper summaries." },
      { name: "Gaming AI", slug: "gaming-ai", subgroup: "Entertainment & Gaming", description: "NPC dialogue engines, procedural asset generation, and game design AI." },
      { name: "Health & Wellness", slug: "health-wellness", subgroup: "Health, Legal & Domain Tools", description: "Symptom checkers, fitness planning, and medical paper research assistants." },
      { name: "Legal AI", slug: "legal-ai", subgroup: "Health, Legal & Domain Tools", description: "Contract analysis, legal research search engines, and compliance drafting." },
      { name: "Marketing & Sales", slug: "marketing-sales", subgroup: "Business Intelligence & Insights", description: "Lead enrichment, outbound email generators, and SEO content scoring." },
      { name: "Productivity", slug: "productivity", subgroup: "Autonomous Agents & Workflow", description: "Note-taking, summary engines, and distraction-free AI workspaces." }
    ]
  }
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
    description: "State-of-the-art reasoning model suite (Claude 3.5 Sonnet & Haiku) featuring 200k context window, artifacts preview, and computer use capability.",
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
    category_slug: "vector-databases",
    has_api: true,
  }
];

async function seedDatabase() {
  console.log("--- Step 1: Seeding Sections & Categories ---");
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

  console.log(`Successfully seeded sections and mapped ${Object.keys(categoryMap).length} categories.`);

  console.log("--- Step 2: Parsing tools from no read.md ---");
  const filePath = path.join(__dirname, "../no read.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const parsedTools = [];
  const seenSlugs = new Set();

  // Helper to resolve category
  function getCategorySlug(name, desc) {
    const text = (name + " " + desc).toLowerCase();
    if (text.includes("agent") || text.includes("agents")) return "ai-agents";
    if (text.includes("coding") || text.includes("dev") || text.includes("github")) return "devtools";
    if (text.includes("headshot") || text.includes("image") || text.includes("design")) return "image-generation";
    if (text.includes("writing") || text.includes("copy") || text.includes("resume")) return "copywriting";
    if (text.includes("video") || text.includes("audio") || text.includes("music")) return "video-generator";
    if (text.includes("learning") || text.includes("education") || text.includes("course")) return "learning-education";
    if (text.includes("sales") || text.includes("marketing") || text.includes("seo")) return "marketing-sales";
    if (text.includes("productivity") || text.includes("work")) return "productivity";
    return "devtools"; // Default directory category
  }

  // First add MOCK_TOOLS
  for (const mTool of MOCK_TOOLS) {
    seenSlugs.add(mTool.slug);
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

  for (let line of lines) {
    line = line.trim();
    if (!line.includes("[")) continue;
    if (line.includes("](#")) continue;
    if (line.includes("Top AI Directories") && line.includes("topaidirectories.com")) continue;

    const match = line.match(/\[([^\]]+)\]\(([^)]+)\)(.*)/);
    if (match) {
      let name = match[1].trim();
      let url = match[2].trim();
      let desc = match[3].trim();

      // Clean description string
      if (desc.startsWith("-")) desc = desc.substring(1).trim();
      if (desc.startsWith("–")) desc = desc.substring(1).trim();
      if (desc.startsWith("—")) desc = desc.substring(1).trim();
      if (desc.startsWith(")") || desc.startsWith("]")) desc = desc.substring(1).trim();
      
      // Clean up markdown formatting in description
      desc = desc.replace(/^\*+/, "").replace(/\*+$/, "").trim();
      if (desc.startsWith("-")) desc = desc.substring(1).trim();

      if (!desc || desc.length < 5) {
        desc = `${name} is a curated directory and platform for discovering AI tools and software.`;
      }

      name = name.replace(/^#\d+\s*/, "").replace(/^-\s*/, "").trim();

      // Generate unique slug
      let baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!baseSlug) baseSlug = `directory-${Date.now()}`;

      let slug = baseSlug;
      let counter = 1;
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      seenSlugs.add(slug);

      // Determine pricing model
      let pricing_model = "freemium";
      const textLower = (name + " " + desc).toLowerCase();
      if (textLower.includes("free") && !textLower.includes("freemium")) {
        pricing_model = "free";
      } else if (textLower.includes("open-source") || textLower.includes("github.com")) {
        pricing_model = "open-source";
      } else if (textLower.includes("paid") || textLower.includes("premium")) {
        pricing_model = "paid";
      }

      const has_api = textLower.includes("api") || textLower.includes("sdk");
      const categorySlug = getCategorySlug(name, desc);
      const category_id = categoryMap[categorySlug] || categoryMap["devtools"];

      parsedTools.push({
        name,
        slug,
        url,
        description: desc,
        pricing_model,
        category_id,
        has_api,
        is_active: true,
      });
    }
  }

  console.log(`Total tools to insert into Supabase: ${parsedTools.length}`);

  console.log("--- Step 3: Upserting tools into Supabase ---");
  // Batch insert in chunks of 50
  const chunkSize = 50;
  let insertedCount = 0;

  for (let i = 0; i < parsedTools.length; i += chunkSize) {
    const chunk = parsedTools.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("tools")
      .upsert(chunk, { onConflict: "slug" })
      .select();

    if (error) {
      console.error(`Error inserting chunk ${i / chunkSize}:`, error.message);
    } else {
      insertedCount += data ? data.length : chunk.length;
      console.log(`Inserted chunk ${i / chunkSize + 1} (${chunk.length} tools).`);
    }
  }

  console.log(`--- DONE! Successfully processed & upserted ${insertedCount} tools to Supabase tools table! ---`);
}

seedDatabase().catch(console.error);
