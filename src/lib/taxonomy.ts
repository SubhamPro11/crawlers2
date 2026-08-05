export interface CategorySeed {
  name: string;
  slug: string;
  subgroup: string;
  description: string;
}

export interface SectionSeed {
  number: number;
  name: string;
  slug: string;
  description: string;
  categories: CategorySeed[];
}

export const TAXONOMY_SEEDS: SectionSeed[] = [
  {
    number: 1,
    name: "Text & Writing",
    slug: "text-writing",
    description: "Tools for writing assistance, copywriting, transcription, and document intelligence.",
    categories: [
      {
        name: "Writing Assistants",
        slug: "writing-assistants",
        subgroup: "Content Generation & Copywriting",
        description: "Real-time prose enhancement, auto-completion, and drafting tools.",
      },
      {
        name: "Copywriting",
        slug: "copywriting",
        subgroup: "Content Generation & Copywriting",
        description: "Marketing copy generators, ad headlines, and landing page text creation.",
      },
      {
        name: "Resume Tools",
        slug: "resume-tools",
        subgroup: "Content Generation & Copywriting",
        description: "AI resume builders, cover letter engines, and career profile optimizers.",
      },
      {
        name: "Transcription",
        slug: "transcription",
        subgroup: "Document Processing & Audio Transcription",
        description: "Speech-to-text conversion and automated meeting transcript generation.",
      },
      {
        name: "Document AI",
        slug: "document-ai",
        subgroup: "Document Processing & Audio Transcription",
        description: "PDF parsing, contract summary engines, and structured document extraction.",
      },
    ],
  },
  {
    number: 2,
    name: "Audio, Video & Media",
    slug: "audio-video-media",
    description: "Generative video, music production, voice synthesis, and multimedia editing tools.",
    categories: [
      {
        name: "Video Generator",
        slug: "video-generator",
        subgroup: "Video & Animation Production",
        description: "Text-to-video, avatar generation, and automated video editing software.",
      },
      {
        name: "Podcast Tools",
        slug: "podcast-tools",
        subgroup: "Video & Animation Production",
        description: "Automated audio cleanup, show notes generation, and clip extraction.",
      },
      {
        name: "Music Generation",
        slug: "music-generation",
        subgroup: "Audio, Speech & Music Processing",
        description: "AI composition tools, background track generation, and stem isolation.",
      },
      {
        name: "Voice Cloning",
        slug: "voice-cloning",
        subgroup: "Audio, Speech & Music Processing",
        description: "Custom voice model creation and acoustic voice replication.",
      },
      {
        name: "Text-to-Speech",
        slug: "text-to-speech",
        subgroup: "Audio, Speech & Music Processing",
        description: "High-fidelity audio narration and natural speech synthesis engines.",
      },
    ],
  },
  {
    number: 3,
    name: "Design & 3D Creative",
    slug: "design-3d-creative",
    description: "Image generation, logo design, 3D modeling, spatial computing, and fashion design.",
    categories: [
      {
        name: "Image Generation",
        slug: "image-generation",
        subgroup: "2D Visuals & Graphics",
        description: "Diffusion models, concept art generators, and image edit pipelines.",
      },
      {
        name: "Logo Generator",
        slug: "logo-generator",
        subgroup: "2D Visuals & Graphics",
        description: "Brand mark creation, vector logo generators, and identity design tools.",
      },
      {
        name: "Fashion Design",
        slug: "fashion-design",
        subgroup: "2D Visuals & Graphics",
        description: "Apparel design, virtual try-on models, and pattern creation.",
      },
      {
        name: "3D Modeling",
        slug: "3d-modeling",
        subgroup: "3D, Immersive & Spatial",
        description: "Text-to-3D asset generators, mesh refinement, and texture synthesis.",
      },
      {
        name: "AR/VR",
        slug: "ar-vr",
        subgroup: "3D, Immersive & Spatial",
        description: "Spatial environment generation, interactive AR experiences, and VR tools.",
      },
    ],
  },
  {
    number: 4,
    name: "Productivity & Business",
    slug: "productivity-business",
    description: "Workflow automation, project management, meeting tools, CRM, and financial assistant platforms.",
    categories: [
      {
        name: "Project Management",
        slug: "project-management",
        subgroup: "Workflow & Project Management",
        description: "Smart task scheduling, project summaries, and backlog prioritization.",
      },
      {
        name: "CRM",
        slug: "crm",
        subgroup: "Workflow & Project Management",
        description: "Customer relationship management, sentiment tracking, and deal analytics.",
      },
      {
        name: "Meeting Assistants",
        slug: "meeting-assistants",
        subgroup: "Workflow & Project Management",
        description: "Automated meeting notes, action item extractors, and attendance bots.",
      },
      {
        name: "Email Assistants",
        slug: "email-assistants",
        subgroup: "Communication & Operations",
        description: "Smart inbox triage, draft generation, and follow-up reminders.",
      },
      {
        name: "Finance Tools",
        slug: "finance-tools",
        subgroup: "Communication & Operations",
        description: "Invoice processing, expense auditing, and financial forecasting AI.",
      },
    ],
  },
  {
    number: 5,
    name: "Developer & Tech Tools",
    slug: "developer-tech-tools",
    description: "AI coding copilots, developer infrastructure, API tools, no-code builders, and browser extensions.",
    categories: [
      {
        name: "Code Assistants",
        slug: "code-assistants",
        subgroup: "Code & Infrastructure",
        description: "Code completion, inline refactoring, bug fixing, and test generators.",
      },
      {
        name: "DevTools",
        slug: "devtools",
        subgroup: "Code & Infrastructure",
        description: "CI/CD pipeline optimizers, telemetry analytics, and CLI extensions.",
      },
      {
        name: "API Tools",
        slug: "api-tools",
        subgroup: "Code & Infrastructure",
        description: "API key registries, documentation engines, and mock server generators.",
      },
      {
        name: "No-Code Builders",
        slug: "no-code-builders",
        subgroup: "Platforms & Extensions",
        description: "Prompt-driven web builders, workflow automation, and app creators.",
      },
      {
        name: "AI Extensions",
        slug: "ai-extensions",
        subgroup: "Platforms & Extensions",
        description: "Browser extensions, IDE plugins, and terminal productivity enhancements.",
      },
    ],
  },
  {
    number: 6,
    name: "Data, Models & Security",
    slug: "data-models-security",
    description: "Database AI extensions, cybersecurity tools, computer vision pipelines, and content moderation.",
    categories: [
      {
        name: "Database Tools",
        slug: "database-tools",
        subgroup: "Data Architecture & Analytics",
        description: "Text-to-SQL generation, vector index optimizers, and migration generators.",
      },
      {
        name: "Computer Vision",
        slug: "computer-vision",
        subgroup: "Data Architecture & Analytics",
        description: "Object detection, OCR extraction, and visual inspection models.",
      },
      {
        name: "Cybersecurity",
        slug: "cybersecurity",
        subgroup: "Security & Governance",
        description: "Vulnerability scanners, threat intelligence, and log anomaly detection.",
      },
      {
        name: "Content Moderation",
        slug: "content-moderation",
        subgroup: "Security & Governance",
        description: "Automated safety filters, hallucination detection, and PII redact engines.",
      },
    ],
  },
  {
    number: 7,
    name: "Marketing, Sales & SEO",
    slug: "marketing-sales-seo",
    description: "Lead generation, social management, automated ad creatives, and e-commerce optimization.",
    categories: [
      {
        name: "Lead Generation",
        slug: "lead-generation",
        subgroup: "Sales Engine & Outreach",
        description: "Prospect enrichment, cold outreach personalization, and pipeline scoring.",
      },
      {
        name: "E-Commerce",
        slug: "e-commerce",
        subgroup: "Sales Engine & Outreach",
        description: "Product description generators, pricing intelligence, and store AI.",
      },
      {
        name: "Social Media Tools",
        slug: "social-media-tools",
        subgroup: "Brand & Audience",
        description: "Post schedulers, thread generators, and engagement analytics.",
      },
      {
        name: "Ad Generator",
        slug: "ad-generator",
        subgroup: "Brand & Audience",
        description: "Multi-channel ad variations, creative testing, and copy optimization.",
      },
    ],
  },
  {
    number: 8,
    name: "Search, Chat & AI Agents",
    slug: "search-chat-ai-agents",
    description: "Autonomous agent frameworks, chatbot builders, personal AI assistants, and research engines.",
    categories: [
      {
        name: "AI Agents",
        slug: "ai-agents",
        subgroup: "Autonomous Agents & Systems",
        description: "Multi-agent orchestration frameworks, goal-directed task runners.",
      },
      {
        name: "Research Tools",
        slug: "research-tools",
        subgroup: "Autonomous Agents & Systems",
        description: "Academic paper summaries, web synthesis engines, and fact checkers.",
      },
      {
        name: "Chatbot Builders",
        slug: "chatbot-builders",
        subgroup: "Conversational Interfaces",
        description: "Custom RAG chatbot creation, customer support bots, and knowledge base sync.",
      },
      {
        name: "Personal Assistants",
        slug: "personal-assistants",
        subgroup: "Conversational Interfaces",
        description: "Executive assistants, daily planners, and habit tracking bots.",
      },
    ],
  },
  {
    number: 9,
    name: "Education & Lifestyle",
    slug: "education-lifestyle",
    description: "Adaptive learning tools, language acquisition, wellness guidance, gaming, and accessibility utilities.",
    categories: [
      {
        name: "Learning Tools",
        slug: "learning-tools",
        subgroup: "Learning & Knowledge Systems",
        description: "Personalized tutor bots, flashcard generators, and study plan tools.",
      },
      {
        name: "Language Learning",
        slug: "language-learning",
        subgroup: "Learning & Knowledge Systems",
        description: "Conversational language practice and pronunciation feedback engines.",
      },
      {
        name: "Accessibility",
        slug: "accessibility",
        subgroup: "Learning & Knowledge Systems",
        description: "Screen reader enrichers, alt-text generators, and sensory assistance AI.",
      },
      {
        name: "Wellness",
        slug: "wellness",
        subgroup: "Lifestyle & Leisure",
        description: "Mindfulness assistants, sleep trackers, and fitness plan generators.",
      },
      {
        name: "Gaming",
        slug: "gaming",
        subgroup: "Lifestyle & Leisure",
        description: "NPC dialog generators, procedural map builders, and game asset tools.",
      },
      {
        name: "Travel",
        slug: "travel",
        subgroup: "Lifestyle & Leisure",
        description: "Itinerary planners, flight price predictors, and local culture guides.",
      },
    ],
  },
];
