const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

async function testFullReportPipeline() {
  console.log("=== Testing Real Report Submission & Triage Pipeline ===");

  // 1. Get a real tool ID from tools table
  const { data: tools } = await supabase.from("tools").select("id, name, url").limit(1);
  if (!tools || tools.length === 0) {
    console.error("No tools found in database.");
    return;
  }

  const sampleTool = tools[0];
  console.log(`Using target tool: [${sampleTool.name}] (${sampleTool.id})`);

  // 2. Insert report row
  const payload = {
    tool_id: sampleTool.id,
    reason: "404 Link Broken / Site Down",
    status: "pending",
    reported_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertErr } = await supabase
    .from("link_reports")
    .insert([payload])
    .select();

  if (insertErr) {
    console.error("INSERT failed:", insertErr);
    return;
  }

  console.log("✓ Report INSERT succeeded:", inserted);

  // 3. Fetch link reports with joined tool metadata
  const { data: fetchedReports, error: fetchErr } = await supabase
    .from("link_reports")
    .select("*, tools(name, url)")
    .order("reported_at", { ascending: false });

  console.log("✓ Triage Queue Fetch result:", fetchedReports);
}

testFullReportPipeline();
