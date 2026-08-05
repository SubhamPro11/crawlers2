# Crawlers — Crawler Architecture & Ethics Specification

> **Sub-Project Specification**: Legal, Ethical & Technical Architecture for Automated Data Indexing

---

## 1. Ethical Crawling Principles

When the automated crawler sub-project is activated, it must operate under strict ethical boundaries:

1. **Robots.txt Adherence**:
   - Every fetch request must first query and parse `https://<target-domain>/robots.txt`.
   - Disallowed paths MUST be skipped immediately without retry.
   - Custom `User-Agent`: `CrawlersBot/1.0 (+https://crawlers.dev/bot; bot-contact@crawlers.dev)`.

2. **Politeness & Rate Limiting**:
   - Per-domain rate limit: Maximum **1 request per 3,000ms (3 seconds)** per domain.
   - Respect `Crawl-delay` header when specified in `robots.txt`.
   - Automatic exponential backoff on HTTP 429 (Too Many Requests) or 5xx errors.

3. **Original Editorial Voice (No Verbatim Copy)**:
   - **Hard Rule**: Raw scraped marketing text must NEVER be stored or published directly.
   - Raw copy must pass through an editorial rephrasing pipeline to generate neutral, informative descriptions.
   - Promotional buzzwords ("best", "game-changing", "revolutionary") are stripped automatically.

4. **Zero Third-Party Embeds**:
   - Crawlers does not embed third-party web pages via `<iframe />` or web view frames.
   - Every tool card links directly to the official provider domain via standard `<a href target="_blank" rel="noopener noreferrer">`.

---

## 2. Audit Trail & Provenance Schema

Every tool record indexed via automated crawler must capture full provenance data for auditability:

```sql
-- Audit log schema for indexing compliance
CREATE TABLE IF NOT EXISTS crawler_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
    target_url TEXT NOT NULL,
    robots_status TEXT NOT NULL, -- 'allowed' | 'disallowed' | 'missing'
    http_status INTEGER NOT NULL,
    indexed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    raw_content_hash TEXT NOT NULL, -- SHA-256 hash of raw content (never store raw text)
    editorial_word_count INTEGER NOT NULL
);
```

---

## 3. Crawler Workflow Pipeline

```
[ Target URL ] ──> [ Check robots.txt ] ──> Allowed? ──> [ Fetch Meta & Title ]
                                 │                            │
                             Disallowed                       ▼
                                 │                 [ Extract Features & API ]
                                 ▼                            │
                          [ Log & Skip ]                      ▼
                                                   [ Synthesize Original Copy ]
                                                              │
                                                              ▼
                                                   [ Queue in Submissions ]
```

---

## 4. Operational Governance

- **Manual Moderation Gate**: Scraped entries do NOT go live immediately. They are inserted into `submissions` table with status `pending` for human editorial review.
- **Opt-Out Request Handling**: Domain owners can request removal by placing `User-agent: CrawlersBot Disallow: /` in their `robots.txt` or emailing `optout@crawlers.dev`.
