const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const FREE_LLM_TOOLS = [
  // ⚡ Provider Directory (29 API Providers)
  {
    name: "NVIDIA NIM",
    slug: "nvidia-nim",
    url: "https://build.nvidia.com/settings/api-keys",
    description: "Enterprise GPU microservices endpoint providing free access to 123+ open LLMs (GLM-5, Laguna, Llama-3.3) with up to 1M token context.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "ModelScope",
    slug: "modelscope",
    url: "https://modelscope.cn/my/myaccesstoken",
    description: "Open-source model hosting platform providing free API endpoints for 53+ models including Qwen3.5 and MiniMax M2.5 with 1M context.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Cloudflare Workers AI",
    slug: "cloudflare-workers-ai",
    url: "https://dash.cloudflare.com/profile/api-tokens",
    description: "Global serverless GPU inference network running 39+ open models with up to 10M token context window and 10,000 free daily neuron allocations.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "OpenRouter",
    slug: "openrouter",
    url: "https://openrouter.ai/workspaces/default/keys",
    description: "Unified API gateway offering 22+ free LLM models alongside single-key routing to OpenAI, Anthropic, and open-source models with up to 1M context.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "GitHub Models",
    slug: "github-models",
    url: "https://github.com/marketplace/models",
    description: "Free developer playground and OpenAI-compatible API endpoint hosting 16+ top models including Phi-4, Mistral Large, and Llama 3.3.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Google Gemini API",
    slug: "google-gemini-api",
    url: "https://aistudio.google.com/app/apikey",
    description: "Multimodal developer API with 1M context window for Gemini 3.6 Flash, 3.5 Flash, and Flash-Lite. Generous free tier offering 15-30 RPM & 1,500 RPD.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Ollama Cloud",
    slug: "ollama-cloud",
    url: "https://ollama.com/settings/keys",
    description: "Managed cloud endpoint for Ollama hosting 14+ open models (DeepSeek V4, MiniMax M3) with up to 1M context windows.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "OVHcloud AI Endpoints",
    slug: "ovhcloud-ai-endpoints",
    url: "https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/",
    description: "European serverless AI inference hub serving 14+ open-weight LLMs including Qwen3.5-397B and Llama 3.3 70B.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "LLM7.io",
    slug: "llm7-io",
    url: "https://token.llm7.io",
    description: "Free OpenAI-compatible proxy endpoint offering 13+ models including DeepSeek R1, DeepSeek V3, and GPT-4o-mini with 30-120 RPM.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Groq",
    slug: "groq",
    url: "https://console.groq.com/keys",
    description: "Ultra-fast LPU inference engine powering Llama 3.3 70B, Moonshot Kimi K2, and DeepSeek R1 with 30 RPM and zero credit card requirement.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Mistral AI",
    slug: "mistral-ai",
    url: "https://console.mistral.ai/api-keys",
    description: "Official developer API for Mistral models including Mistral 7B, Mixtral 8x7B, and Mistral Medium 3.5 with 256k context window.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Cohere",
    slug: "cohere",
    url: "https://dashboard.cohere.com/api-keys",
    description: "Enterprise language modeling API providing Command A+ (218B) and Command R+ models with up to 436k context and 20 RPM free tier.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Kilo Code",
    slug: "kilo-code",
    url: "https://kilo.ai",
    description: "Free AI developer gateway providing access to Nemotron 3 Ultra, StepFun 3.7 Flash, and 12+ open models with ~200 requests/hour.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Cerebras",
    slug: "cerebras",
    url: "https://cloud.cerebras.ai/",
    description: "Wafer-scale engine providing world-record inference speeds for Llama 3.1 70B and GPT-OSS 120B with 1M tokens/day free tier.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "OpenCode Zen",
    slug: "opencode-zen",
    url: "https://opencode.ai/auth",
    description: "Developer API gateway for coding & reasoning models including DeepSeek V4 Flash and MiMo-V2.5 with 1M context.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Aion Labs",
    slug: "aion-labs",
    url: "https://www.aionlabs.ai",
    description: "Specialized LLM provider serving Aion 2.5, Aion 2.0, and roleplay models with 15 RPM and 20k TPD free allocation.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Hugging Face Inference API",
    slug: "huggingface-inference",
    url: "https://huggingface.co/settings/tokens",
    description: "Serverless inference API routing to 7+ open models (Llama 3.1 8B, Gemma 3, Qwen2.5-Coder) with credit-metered free tier.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Agnes AI",
    slug: "agnes-ai",
    url: "https://platform.agnes-ai.com/settings/apiKeys",
    description: "Multi-modal AI hub delivering Agnes 2.0 Flash, text, image, and video models with 256k context and 30 RPM.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Alibaba Cloud Model Studio",
    slug: "alibaba-cloud-model-studio",
    url: "https://bailian.console.alibabacloud.com/?apiKey=1",
    description: "Global cloud API for Qwen3-Max, Qwen3-Plus, and Qwen3-VL-Plus with up to 1M context window and free tier access.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Zhipu AI (Z AI)",
    slug: "zhipu-ai",
    url: "https://open.bigmodel.cn/usercenter/apikeys",
    description: "Pioneer Chinese AI lab providing GLM-4.7-Flash and GLM-4.5-Flash with 200k context window and zero API cost.",
    pricing_model: "free",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "SambaNova",
    slug: "sambanova",
    url: "https://cloud.sambanova.ai/apis",
    description: "Reconfigurable dataflow architecture delivering DeepSeek-V3.1 and MiniMax-M2.7 at ultra-high throughput with 20 RPM free.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "SiliconFlow",
    slug: "siliconflow",
    url: "https://cloud.siliconflow.cn/account/ak",
    description: "High-performance inference platform hosting DeepSeek-R1-Distill-Qwen-7B and DeepSeek OCR with 30 RPM and 60K TPM.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "xAI Grok API",
    slug: "xai-grok-api",
    url: "https://console.x.ai",
    description: "Official developer console for Grok-4.3, Grok-4.1 Fast (2M context), and Grok-3 Mini with recurring monthly credits.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Chutes.ai",
    slug: "chutes-ai",
    url: "https://chutes.ai/",
    description: "Decentralized community-powered AI hosting platform serving DeepSeek-R1 and Llama 3.1 70B with un-throttled free access.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Glhf.chat",
    slug: "glhf-chat",
    url: "https://glhf.chat/",
    description: "Open community OpenAI-compatible endpoint providing unlimited free queries for open-source Llama 3.1 70B and Mixtral 8x7B.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "AI21 Labs",
    slug: "ai21-labs",
    url: "https://studio.ai21.com/account/api-key",
    description: "Language intelligence portal serving Jamba Large 1.7 and Jamba Mini 2 hybrid SSM-Transformer models with 256k context and 200 RPM.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "DeepSeek API",
    slug: "deepseek-api",
    url: "https://platform.deepseek.com/api_keys",
    description: "Official API for DeepSeek-V3.2 and DeepSeek-R1 reasoning models with 128k context and low-cost pay-as-you-go / free tier.",
    pricing_model: "freemium",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "Nscale",
    slug: "nscale",
    url: "https://console.nscale.com/",
    description: "High-performance GPU cloud provider serving Llama-3.3-70B-Instruct and DeepSeek-R1-Distill-Llama-70B under fair-use free allocation.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "Nebius",
    slug: "nebius",
    url: "https://studio.nebius.com/settings/api-keys",
    description: "AI cloud platform providing fast API inference for Qwen3-235B-A22B with 128k context window.",
    pricing_model: "freemium",
    category_slug: "devtools",
    has_api: true,
  },

  // 🖥️ Local / Self-Hosted LLM Runtimes
  {
    name: "Ollama",
    slug: "ollama",
    url: "https://ollama.com",
    description: "Get up and running with Llama 3.3, DeepSeek-R1, and 100+ open LLMs locally. Provides GPU acceleration and an OpenAI-compatible REST server.",
    pricing_model: "open-source",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "LM Studio",
    slug: "lm-studio",
    url: "https://lmstudio.ai",
    description: "Desktop GUI app to discover, download, and run any GGUF model offline on macOS, Windows, and Linux with a local OpenAI-compatible server.",
    pricing_model: "free",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "llama.cpp",
    slug: "llama-cpp",
    url: "https://github.com/ggerganov/llama.cpp",
    description: "Ultra-lightweight C/C++ LLM inference engine with AVX2/AVX512/Metal/CUDA optimization for high-speed local model execution.",
    pricing_model: "open-source",
    category_slug: "api-tools",
    has_api: true,
  },
  {
    name: "GPT4All",
    slug: "gpt4all",
    url: "https://gpt4all.io",
    description: "Ecosystem of open-source desktop chatbots that run locally on consumer CPUs without requiring a dedicated discrete GPU.",
    pricing_model: "open-source",
    category_slug: "code-assistants",
    has_api: false,
  },
  {
    name: "Jan.ai",
    slug: "jan-ai",
    url: "https://jan.ai",
    description: "100% offline, privacy-first desktop alternative to ChatGPT that runs on your local machine with local API server extensions.",
    pricing_model: "open-source",
    category_slug: "devtools",
    has_api: true,
  },
  {
    name: "KoboldCpp",
    slug: "koboldcpp",
    url: "https://github.com/LostRuins/koboldcpp",
    description: "Single-executable C++ GGUF model runner with Web UI built-in, optimized for text generation and local story writing.",
    pricing_model: "open-source",
    category_slug: "devtools",
    has_api: true,
  },
];

async function importFreeLLMTools() {
  console.log("=== Importing 35+ Free LLM API Providers & Local Runtimes into Supabase ===");

  // Step 1: Fetch category mapping (slug -> id)
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug");

  if (catErr) {
    console.error("Error fetching categories:", catErr);
    process.exit(1);
  }

  const categoryMap = {};
  categories.forEach((c) => {
    categoryMap[c.slug] = c.id;
  });

  console.log(`Fetched ${Object.keys(categoryMap).length} categories from Supabase.`);

  // Fallback category ID if specific slug not matched
  const devtoolsCatId = categoryMap["devtools"] || categories[0]?.id;
  const apiToolsCatId = categoryMap["api-tools"] || devtoolsCatId;

  let insertedCount = 0;
  let errorCount = 0;

  for (const item of FREE_LLM_TOOLS) {
    let catId = categoryMap[item.category_slug] || apiToolsCatId;

    const payload = {
      name: item.name,
      slug: item.slug,
      url: item.url,
      description: item.description,
      pricing_model: item.pricing_model,
      category_id: catId,
      has_api: item.has_api,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertErr } = await supabase
      .from("tools")
      .upsert(payload, { onConflict: "slug" });

    if (upsertErr) {
      console.error(`Failed to upsert tool [${item.name}]:`, upsertErr.message);
      errorCount++;
    } else {
      console.log(`✓ Upserted: ${item.name} (${item.pricing_model}, has_api: ${item.has_api})`);
      insertedCount++;
    }
  }

  console.log(`\n=== Import Finished: ${insertedCount} succeeded, ${errorCount} failed ===`);
}

importFreeLLMTools();
