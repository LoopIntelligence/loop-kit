---
name: playwright-scraper
description: Headless browser scraping and form filling that returns clean JSON. Use instead of MCP screenshots when you need structured data from web pages, to save tokens. Run scripts/run.js with a URL to get title, text, and links as JSON.
---

# Playwright Scraper Skill

## When to Use
- Scraping web pages for structured data (products, prices, tables)
- Filling forms and reading confirmation messages
- Extracting tables, lists, or specific elements from pages
- Any task where you need data FROM a page, not a visual screenshot
- Batch scraping multiple pages (scales to 100+ pages)

## When NOT to Use
- When you need to visually verify what a page looks like (use MCP screenshot)
- When you need to interact with a complex SPA step-by-step (use Playwright MCP)

## How to Run

```bash
node ~/.claude/skills/playwright-scraper/scripts/run.js "https://example.com"
```

Returns JSON with title, url, text, links, and headings.

## Custom Extraction
For tables, forms, or specific elements, write a one-off script using the same pattern as run.js. Always:
1. Use headless Chromium
2. Set a realistic user agent
3. Wait for networkidle on slow pages
4. Close the browser in a finally block
5. Strip nav, footer, cookie banners before extracting text

## Troubleshooting
- Empty text: switch waitUntil to networkidle
- Browser not found: run `npx playwright install chromium`
- Blocked by Cloudflare: add stealth plugin
- Timeout: increase all timeouts to 15000ms
