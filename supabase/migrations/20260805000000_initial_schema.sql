-- Crawlers Database Initial Schema Migration
-- Migration: 20260805000000_initial_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE pricing_model AS ENUM ('free', 'freemium', 'paid', 'open-source');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- 1. Sections Table (Top-level taxonomy groupings)
CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Categories Table (Belongs to a Section, optional subgrouping)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subgroup TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tags Table (Normalized tags)
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tools Table (Core tool entity)
CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    pricing_model pricing_model NOT NULL DEFAULT 'freemium',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    logo_url TEXT,
    has_api BOOLEAN NOT NULL DEFAULT false,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. Tool Tags Join Table
CREATE TABLE tool_tags (
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (tool_id, tag_id)
);

-- 6. Submissions Table (Community-submitted tools pending moderation)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    pricing_model pricing_model NOT NULL DEFAULT 'freemium',
    tags TEXT[] DEFAULT '{}',
    submitter_email TEXT,
    status submission_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. View Logs Table (Auditable event logs for trending analytics)
CREATE TABLE view_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    user_agent TEXT,
    referrer TEXT,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for optimal query performance
CREATE INDEX idx_sections_slug ON sections(slug);
CREATE INDEX idx_categories_section_id ON categories(section_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_is_active ON tools(is_active);
CREATE INDEX idx_tools_pricing_model ON tools(pricing_model);
CREATE INDEX idx_tools_has_api ON tools(has_api);
CREATE INDEX idx_tool_tags_tag_id ON tool_tags(tag_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_view_logs_tool_id_viewed_at ON view_logs(tool_id, viewed_at);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Configuration
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public Read Access
CREATE POLICY "Allow public read access on sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Allow public read access on active tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on tool_tags" ON tool_tags FOR SELECT USING (true);

-- RLS Policies: Public Submissions & View Event Logging
CREATE POLICY "Allow public insert on submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on view_logs" ON view_logs FOR INSERT WITH CHECK (true);

-- Admin / Service Role write policies (Restricted write by default)
CREATE POLICY "Allow service role full access on sections" ON sections FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on categories" ON categories FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on tags" ON tags FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on tools" ON tools FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on tool_tags" ON tool_tags FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on submissions" ON submissions FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role full access on view_logs" ON view_logs FOR ALL TO service_role USING (true);
