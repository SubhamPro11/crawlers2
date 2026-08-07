const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

async function checkTables() {
  const tables = ["submissions", "tools", "categories", "sections", "profiles", "reports", "link_reports", "link_reports_queue"];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(1);
    console.log(`Table [${t}]:`, error ? `ERROR: ${error.message} (${error.code})` : `FOUND (count: ${data.length})`);
  }
}

checkTables();
