-- Crawlers Taxonomy Seed Script
-- File: supabase/seed.sql

-- 1. Insert Sections
INSERT INTO sections (id, name, slug, description, display_order) VALUES
('10000000-0000-0000-0000-000000000001', 'Text & Writing', 'text-writing', 'Tools for writing assistance, copywriting, transcription, and document intelligence.', 1),
('10000000-0000-0000-0000-000000000002', 'Audio, Video & Media', 'audio-video-media', 'Generative video, music production, voice synthesis, and multimedia editing tools.', 2),
('10000000-0000-0000-0000-000000000003', 'Design & 3D Creative', 'design-3d-creative', 'Image generation, logo design, 3D modeling, spatial computing, and fashion design.', 3),
('10000000-0000-0000-0000-000000000004', 'Productivity & Business', 'productivity-business', 'Workflow automation, project management, meeting tools, CRM, and financial assistant platforms.', 4),
('10000000-0000-0000-0000-000000000005', 'Developer & Tech Tools', 'developer-tech-tools', 'AI coding copilots, developer infrastructure, API tools, no-code builders, and browser extensions.', 5),
('10000000-0000-0000-0000-000000000006', 'Data, Models & Security', 'data-models-security', 'Database AI extensions, cybersecurity tools, computer vision pipelines, and content moderation.', 6),
('10000000-0000-0000-0000-000000000007', 'Marketing, Sales & SEO', 'marketing-sales-seo', 'Lead generation, social management, automated ad creatives, and e-commerce optimization.', 7),
('10000000-0000-0000-0000-000000000008', 'Search, Chat & AI Agents', 'search-chat-ai-agents', 'Autonomous agent frameworks, chatbot builders, personal AI assistants, and research engines.', 8),
('10000000-0000-0000-0000-000000000009', 'Education & Lifestyle', 'education-lifestyle', 'Adaptive learning tools, language acquisition, wellness guidance, gaming, and accessibility utilities.', 9)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 2. Insert Categories with Subgroups
INSERT INTO categories (section_id, name, slug, subgroup, description, display_order) VALUES
-- Section 1: Text & Writing
('10000000-0000-0000-0000-000000000001', 'Writing Assistants', 'writing-assistants', 'Content Generation & Copywriting', 'Real-time prose enhancement, auto-completion, and drafting tools.', 1),
('10000000-0000-0000-0000-000000000001', 'Copywriting', 'copywriting', 'Content Generation & Copywriting', 'Marketing copy generators, ad headlines, and landing page text creation.', 2),
('10000000-0000-0000-0000-000000000001', 'Resume Tools', 'resume-tools', 'Content Generation & Copywriting', 'AI resume builders, cover letter engines, and career profile optimizers.', 3),
('10000000-0000-0000-0000-000000000001', 'Transcription', 'transcription', 'Document Processing & Audio Transcription', 'Speech-to-text conversion and automated meeting transcript generation.', 4),
('10000000-0000-0000-0000-000000000001', 'Document AI', 'document-ai', 'Document Processing & Audio Transcription', 'PDF parsing, contract summary engines, and structured document extraction.', 5),

-- Section 2: Audio, Video & Media
('10000000-0000-0000-0000-000000000002', 'Video Generator', 'video-generator', 'Video & Animation Production', 'Text-to-video, avatar generation, and automated video editing software.', 1),
('10000000-0000-0000-0000-000000000002', 'Podcast Tools', 'podcast-tools', 'Video & Animation Production', 'Automated audio cleanup, show notes generation, and clip extraction.', 2),
('10000000-0000-0000-0000-000000000002', 'Music Generation', 'music-generation', 'Audio, Speech & Music Processing', 'AI composition tools, background track generation, and stem isolation.', 3),
('10000000-0000-0000-0000-000000000002', 'Voice Cloning', 'voice-cloning', 'Audio, Speech & Music Processing', 'Custom voice model creation and acoustic voice replication.', 4),
('10000000-0000-0000-0000-000000000002', 'Text-to-Speech', 'text-to-speech', 'Audio, Speech & Music Processing', 'High-fidelity audio narration and natural speech synthesis engines.', 5),

-- Section 3: Design & 3D Creative
('10000000-0000-0000-0000-000000000003', 'Image Generation', 'image-generation', '2D Visuals & Graphics', 'Diffusion models, concept art generators, and image edit pipelines.', 1),
('10000000-0000-0000-0000-000000000003', 'Logo Generator', 'logo-generator', '2D Visuals & Graphics', 'Brand mark creation, vector logo generators, and identity design tools.', 2),
('10000000-0000-0000-0000-000000000003', 'Fashion Design', 'fashion-design', '2D Visuals & Graphics', 'Apparel design, virtual try-on models, and pattern creation.', 3),
('10000000-0000-0000-0000-000000000003', '3D Modeling', '3d-modeling', '3D, Immersive & Spatial', 'Text-to-3D asset generators, mesh refinement, and texture synthesis.', 4),
('10000000-0000-0000-0000-000000000003', 'AR/VR', 'ar-vr', '3D, Immersive & Spatial', 'Spatial environment generation, interactive AR experiences, and VR tools.', 5),

-- Section 4: Productivity & Business
('10000000-0000-0000-0000-000000000004', 'Project Management', 'project-management', 'Workflow & Project Management', 'Smart task scheduling, project summaries, and backlog prioritization.', 1),
('10000000-0000-0000-0000-000000000004', 'CRM', 'crm', 'Workflow & Project Management', 'Customer relationship management, sentiment tracking, and deal analytics.', 2),
('10000000-0000-0000-0000-000000000004', 'Meeting Assistants', 'meeting-assistants', 'Workflow & Project Management', 'Automated meeting notes, action item extractors, and attendance bots.', 3),
('10000000-0000-0000-0000-000000000004', 'Email Assistants', 'email-assistants', 'Communication & Operations', 'Smart inbox triage, draft generation, and follow-up reminders.', 4),
('10000000-0000-0000-0000-000000000004', 'Finance Tools', 'finance-tools', 'Communication & Operations', 'Invoice processing, expense auditing, and financial forecasting AI.', 5),

-- Section 5: Developer & Tech Tools
('10000000-0000-0000-0000-000000000005', 'Code Assistants', 'code-assistants', 'Code & Infrastructure', 'Code completion, inline refactoring, bug fixing, and test generators.', 1),
('10000000-0000-0000-0000-000000000005', 'DevTools', 'devtools', 'Code & Infrastructure', 'CI/CD pipeline optimizers, telemetry analytics, and CLI extensions.', 2),
('10000000-0000-0000-0000-000000000005', 'API Tools', 'api-tools', 'Code & Infrastructure', 'API key registries, documentation engines, and mock server generators.', 3),
('10000000-0000-0000-0000-000000000005', 'No-Code Builders', 'no-code-builders', 'Platforms & Extensions', 'Prompt-driven web builders, workflow automation, and app creators.', 4),
('10000000-0000-0000-0000-000000000005', 'AI Extensions', 'ai-extensions', 'Platforms & Extensions', 'Browser extensions, IDE plugins, and terminal productivity enhancements.', 5),

-- Section 6: Data, Models & Security
('10000000-0000-0000-0000-000000000006', 'Database Tools', 'database-tools', 'Data Architecture & Analytics', 'Text-to-SQL generation, vector index optimizers, and migration generators.', 1),
('10000000-0000-0000-0000-000000000006', 'Computer Vision', 'computer-vision', 'Data Architecture & Analytics', 'Object detection, OCR extraction, and visual inspection models.', 2),
('10000000-0000-0000-0000-000000000006', 'Cybersecurity', 'cybersecurity', 'Security & Governance', 'Vulnerability scanners, threat intelligence, and log anomaly detection.', 3),
('10000000-0000-0000-0000-000000000006', 'Content Moderation', 'content-moderation', 'Security & Governance', 'Automated safety filters, hallucination detection, and PII redact engines.', 4),

-- Section 7: Marketing, Sales & SEO
('10000000-0000-0000-0000-000000000007', 'Lead Generation', 'lead-generation', 'Sales Engine & Outreach', 'Prospect enrichment, cold outreach personalization, and pipeline scoring.', 1),
('10000000-0000-0000-0000-000000000007', 'E-Commerce', 'e-commerce', 'Sales Engine & Outreach', 'Product description generators, pricing intelligence, and store AI.', 2),
('10000000-0000-0000-0000-000000000007', 'Social Media Tools', 'social-media-tools', 'Brand & Audience', 'Post schedulers, thread generators, and engagement analytics.', 3),
('10000000-0000-0000-0000-000000000007', 'Ad Generator', 'ad-generator', 'Brand & Audience', 'Multi-channel ad variations, creative testing, and copy optimization.', 4),

-- Section 8: Search, Chat & AI Agents
('10000000-0000-0000-0000-000000000008', 'AI Agents', 'ai-agents', 'Autonomous Agents & Systems', 'Multi-agent orchestration frameworks, goal-directed task runners.', 1),
('10000000-0000-0000-0000-000000000008', 'Research Tools', 'research-tools', 'Autonomous Agents & Systems', 'Academic paper summaries, web synthesis engines, and fact checkers.', 2),
('10000000-0000-0000-0000-000000000008', 'Chatbot Builders', 'chatbot-builders', 'Conversational Interfaces', 'Custom RAG chatbot creation, customer support bots, and knowledge base sync.', 3),
('10000000-0000-0000-0000-000000000008', 'Personal Assistants', 'personal-assistants', 'Conversational Interfaces', 'Executive assistants, daily planners, and habit tracking bots.', 4),

-- Section 9: Education & Lifestyle
('10000000-0000-0000-0000-000000000009', 'Learning Tools', 'learning-tools', 'Learning & Knowledge Systems', 'Personalized tutor bots, flashcard generators, and study plan tools.', 1),
('10000000-0000-0000-0000-000000000009', 'Language Learning', 'language-learning', 'Learning & Knowledge Systems', 'Conversational language practice and pronunciation feedback engines.', 2),
('10000000-0000-0000-0000-000000000009', 'Accessibility', 'accessibility', 'Learning & Knowledge Systems', 'Screen reader enrichers, alt-text generators, and sensory assistance AI.', 3),
('10000000-0000-0000-0000-000000000009', 'Wellness', 'wellness', 'Lifestyle & Leisure', 'Mindfulness assistants, sleep trackers, and fitness plan generators.', 4),
('10000000-0000-0000-0000-000000000009', 'Gaming', 'gaming', 'Lifestyle & Leisure', 'NPC dialog generators, procedural map builders, and game asset tools.', 5),
('10000000-0000-0000-0000-000000000009', 'Travel', 'travel', 'Lifestyle & Leisure', 'Itinerary planners, flight price predictors, and local culture guides.', 6)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    subgroup = EXCLUDED.subgroup,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;
