const https = require("https");
const dns = require("dns");

const HOSTNAME = "crawlers.dpdns.org";
const ROUTES = [
  "/",
  "/tools",
  "/compare",
  "/admin",
  "/stacks",
  "/api/tools",
  "/changelog",
  "/trending",
  "/tool/ollama",
];

console.log("=== 1. DNS RESOLUTION TEST ===");
dns.resolve4(HOSTNAME, (err, addresses) => {
  if (err) {
    console.error("IPv4 DNS Resolve Error:", err.message);
  } else {
    console.log("IPv4 Addresses:", addresses);
  }
});

dns.resolve6(HOSTNAME, (err, addresses) => {
  if (err) {
    console.error("IPv6 DNS Resolve Error:", err.message);
  } else {
    console.log("IPv6 Addresses:", addresses);
  }
});

console.log("\n=== 2. HTTP ROUTE HEALTH CHECK ===");
ROUTES.forEach((route) => {
  const start = Date.now();
  const req = https.get(
    `https://${HOSTNAME}${route}`,
    {
      headers: {
        "User-Agent": "Crawlers-HealthCheck/1.0",
      },
    },
    (res) => {
      const duration = Date.now() - start;
      console.log(
        `Route ${route.padEnd(15)} => Status: ${res.statusCode} | Latency: ${duration}ms | Cache: ${
          res.headers["x-nextjs-cache"] || "N/A"
        } | Server: ${res.headers["server"]}`
      );
    }
  );

  req.on("error", (err) => {
    console.error(`Route ${route.padEnd(15)} => ERROR: ${err.message}`);
  });
});
