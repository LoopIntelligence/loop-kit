const { chromium } = require('playwright');

async function scrape(url) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const result = await page.evaluate(() => {
      const noise = ['nav', 'footer', 'header', '[class*="cookie"]', '[class*="banner"]', '[class*="popup"]', '[class*="modal"]', '[id*="cookie"]'];
      noise.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));

      return {
        title: document.title || '',
        text: document.body ? document.body.innerText.trim() : '',
        links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: a.innerText.trim(),
          href: a.href
        })).filter(l => l.text && l.href),
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean)
      };
    });

    result.url = url;
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}

const url = process.argv[2];
if (!url) {
  console.error('Usage: node run.js <URL>');
  process.exit(1);
}
scrape(url).catch(err => {
  console.error(err.message);
  process.exit(1);
});
