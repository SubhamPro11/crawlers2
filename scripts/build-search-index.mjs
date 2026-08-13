import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateIndex() {
  console.log('Generating build-time local search index...');
  const start = performance.now();

  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, slug, description, category_id, pricing_model, has_api, logo_url, url')
    .eq('is_active', true)
    .order('added_at', { ascending: false });

  if (error || !tools) {
    console.warn('Warning: Could not fetch live tools from Supabase for search index, skipping static JSON file:', error);
    return;
  }

  // Optimize payload: truncate long descriptions to 140 chars to minimize payload size
  const compactTools = tools.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description ? (t.description.length > 140 ? t.description.slice(0, 137) + '...' : t.description) : '',
    category_id: t.category_id,
    pricing_model: t.pricing_model,
    has_api: Boolean(t.has_api),
    logo_url: t.logo_url || null,
    url: t.url,
  }));

  const outPath = path.join(rootDir, 'public', 'search-index.json');
  fs.writeFileSync(outPath, JSON.stringify(compactTools));

  const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(2);
  const duration = (performance.now() - start).toFixed(2);
  console.log(`Generated ${compactTools.length} tools search index at public/search-index.json (${sizeKb} KB) in ${duration} ms`);
}

generateIndex().catch(console.error);
