const { createClient } = require("@supabase/supabase-js");

const DEFAULT_SUPABASE_URL = "https://pmeacccwxsejxhzoeyic.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZWFjY2N3eHNlanhoem9leWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTExMjcsImV4cCI6MjEwMTU4NzEyN30.miFV9xJDd35TdiQTJyhiGr_NGqKEKm4wm8cfaX02qqw";

const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);

async function inspectSubmissions() {
  console.log("=== Inspecting Submissions Table Schema ===");
  const { data, error } = await supabase.from("submissions").insert([
    {
      name: "Test Report",
      url: "https://example.com",
      description: "[REPORT BROKEN LINK] Issue: 404 Link Broken / Site Down | Tool: Test Tool",
      category: "Broken Link Report",
      pricing_model: "free",
      tags: ["broken-link-report"],
      status: "pending",
      submitted_at: new Date().toISOString(),
    }
  ]).select();

  console.log("Insert into submissions result:", { data, error });
}

inspectSubmissions();
