const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

async function testFetchReports() {
  console.log("=== Fetching link_reports from Supabase ===");
  const { data, error } = await supabase
    .from("link_reports")
    .select("*, tools(name, url)")
    .order("reported_at", { ascending: false });

  console.log("Fetch reports result:", { data, error });
}

testFetchReports();
