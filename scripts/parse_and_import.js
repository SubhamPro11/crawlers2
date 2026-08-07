const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../no read.md");
const content = fs.readFileSync(filePath, "utf-8");

const lines = content.split("\n");
const tools = [];



for (let line of lines) {
  line = line.trim();
  if (!line.includes("[")) continue;
  
  // Ignore section anchors like - [A](#a)
  if (line.includes("](#")) continue;
  if (line.includes("Top AI Directories") && line.includes("topaidirectories.com")) continue;

  const match = line.match(/\[([^\]]+)\]\(([^)]+)\)(.*)/);
  if (match) {
    let name = match[1].trim();
    let url = match[2].trim();
    let desc = match[3].trim();
    
    // Clean desc
    if (desc.startsWith("-")) desc = desc.substring(1).trim();
    if (desc.startsWith("–")) desc = desc.substring(1).trim();
    if (desc.startsWith("—")) desc = desc.substring(1).trim();
    if (!desc) {
      desc = `${name} - Curated AI directory and tools collection.`;
    }
    
    // Clean name
    name = name.replace(/^#\d+\s*/, "").trim();

    // Generate slug
    let slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!slug) slug = `tool-${Date.now()}`;

    // Determine category / tags
    let pricing_model = "freemium";
    if (desc.toLowerCase().includes("free") || name.toLowerCase().includes("free")) {
      pricing_model = "free";
    } else if (desc.toLowerCase().includes("open-source") || desc.toLowerCase().includes("github")) {
      pricing_model = "open-source";
    }

    let has_api = desc.toLowerCase().includes("api") || name.toLowerCase().includes("api");

    tools.push({
      name,
      slug,
      url,
      description: desc,
      pricing_model,
      has_api
    });
  }
}

console.log(`Parsed ${tools.length} tools from no read.md.`);
console.log("Sample 5 tools:", JSON.stringify(tools.slice(0, 5), null, 2));

// Save to scratch JSON
fs.writeFileSync(path.join(__dirname, "parsed_tools.json"), JSON.stringify(tools, null, 2));
