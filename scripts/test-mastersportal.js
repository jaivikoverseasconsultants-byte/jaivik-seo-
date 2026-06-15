// Feasibility test: Mastersportal / Bachelorsportal as bulk data source
// Run: node scripts/test-mastersportal.js
// NO puppeteer — static HTML only via axios + cheerio

const axios = require('axios');
const cheerio = require('cheerio');

const URLS = [
  {
    label: 'Mastersportal — Biotechnology / UK',
    url: 'https://www.mastersportal.com/search/master/biotechnology/united-kingdom',
    portal: 'masters',
  },
  {
    label: 'Mastersportal — Computer Science / Canada',
    url: 'https://www.mastersportal.com/search/master/computer-science/canada',
    portal: 'masters',
  },
  {
    label: 'Bachelorsportal — Business Administration / Australia',
    url: 'https://www.bachelorsportal.com/search/bachelor/business-administration/australia',
    portal: 'bachelors',
  },
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xhtml+xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
};

async function fetchPage(url) {
  const t0 = Date.now();
  try {
    const res = await axios.get(url, {
      headers: HEADERS,
      timeout: 20000,
      maxRedirects: 5,
    });
    return { status: res.status, html: res.data, ms: Date.now() - t0, error: null };
  } catch (e) {
    return { status: e.response?.status ?? 0, html: e.response?.data ?? '', ms: Date.now() - t0, error: e.message };
  }
}

function diagnoseHtml(html, portal) {
  const $ = cheerio.load(html);

  // ── Detection: is content in static HTML or JS-rendered? ──────────────────
  const bodyText = $('body').text().trim();
  const bodyLen = bodyText.length;

  // Signals that indicate JS-rendered (SPA) — minimal body, heavy script tags
  const scriptCount = $('script').length;
  const scriptSrcCount = $('script[src]').length;
  const hasNoscriptFallback = $('noscript').length > 0;
  const isLikelySPA = bodyLen < 2000 && scriptCount > 5;

  // ── Try multiple selectors that mastersportal / bachelorsportal use ────────
  const candidates = [
    // Known class names from past crawls
    '.HitCard',
    '.hit-card',
    '[class*="HitCard"]',
    '[class*="hit-card"]',
    '[class*="ProgrammeCard"]',
    '[class*="programme-card"]',
    // Generic article/li patterns
    'article',
    'li[class*="result"]',
    'li[class*="programme"]',
    'div[class*="result"]',
    // Structured data
    'script[type="application/ld+json"]',
  ];

  let matched = null;
  let matchedSelector = null;
  for (const sel of candidates) {
    const els = $(sel);
    if (els.length > 0) {
      matched = els;
      matchedSelector = sel;
      break;
    }
  }

  // ── JSON-LD extraction ─────────────────────────────────────────────────────
  const jsonLdBlocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jsonLdBlocks.push(JSON.parse($(el).html()));
    } catch {}
  });

  // ── Pagination signals ─────────────────────────────────────────────────────
  const totalResultsText =
    $('[class*="count"]').first().text().trim() ||
    $('[class*="total"]').first().text().trim() ||
    $('[class*="result-count"]').first().text().trim() ||
    $('[class*="header"] h1, [class*="header"] h2').first().text().trim() ||
    '';

  const paginationEl = $('[class*="pagination"], [class*="Pagination"], nav[aria-label*="page"]');
  const hasPagination = paginationEl.length > 0;
  const lastPageNum =
    paginationEl
      .find('a, button')
      .last()
      .text()
      .trim()
      .match(/\d+/)?.[0] ?? null;

  // ── Sample extraction (first 5 matching elements) ─────────────────────────
  const samples = [];
  if (matched && matchedSelector !== 'script[type="application/ld+json"]') {
    matched.slice(0, 5).each((i, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim().slice(0, 300);
      const links = [];
      $(el)
        .find('a[href]')
        .slice(0, 3)
        .each((_, a) => links.push($(a).attr('href')));
      samples.push({ index: i + 1, text, links });
    });
  }

  // ── Raw HTML snippet (first 3000 chars of body for SPA diagnosis) ─────────
  const rawSnippet = html.slice(0, 4000);

  // ── Interesting meta / title ───────────────────────────────────────────────
  const pageTitle = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') ?? '';

  return {
    bodyLen,
    scriptCount,
    scriptSrcCount,
    hasNoscriptFallback,
    isLikelySPA,
    pageTitle,
    metaDesc,
    matchedSelector,
    matchCount: matched?.length ?? 0,
    samples,
    jsonLdCount: jsonLdBlocks.length,
    jsonLdTypes: jsonLdBlocks.map((b) => b['@type'] ?? b.type ?? '?'),
    jsonLdSample: jsonLdBlocks.slice(0, 2),
    totalResultsText,
    hasPagination,
    lastPageNum,
    rawSnippet,
  };
}

async function main() {
  for (const { label, url, portal } of URLS) {
    console.log('\n' + '═'.repeat(70));
    console.log(`TEST: ${label}`);
    console.log(`URL:  ${url}`);
    console.log('═'.repeat(70));

    const { status, html, ms, error } = await fetchPage(url);
    console.log(`HTTP Status : ${status}  (${ms}ms)`);
    if (error) console.log(`Error       : ${error}`);

    if (!html) {
      console.log('No HTML received — skipping analysis');
      continue;
    }

    const d = diagnoseHtml(html, portal);

    console.log(`\n── Page Info ──────────────────────────────────────────────────`);
    console.log(`Title       : ${d.pageTitle}`);
    console.log(`Meta desc   : ${d.metaDesc.slice(0, 120)}`);

    console.log(`\n── SPA / Static Detection ─────────────────────────────────────`);
    console.log(`Body text length    : ${d.bodyLen} chars`);
    console.log(`Script tags total   : ${d.scriptCount} (${d.scriptSrcCount} with src)`);
    console.log(`Noscript fallback   : ${d.hasNoscriptFallback}`);
    console.log(`Likely SPA (JS-only): ${d.isLikelySPA ? 'YES ⚠️  — Puppeteer needed' : 'NO — static HTML likely usable'}`);

    console.log(`\n── Course Card Detection ──────────────────────────────────────`);
    console.log(`Matched selector    : ${d.matchedSelector ?? 'NONE — no card selectors matched'}`);
    console.log(`Cards found         : ${d.matchCount}`);

    if (d.samples.length > 0) {
      console.log(`\n── Sample Extractions (first 5) ───────────────────────────────`);
      d.samples.forEach((s) => {
        console.log(`\n  [${s.index}] ${s.text}`);
        if (s.links.length) console.log(`       Links: ${s.links.join(' | ')}`);
      });
    } else {
      console.log(`\nNo samples extracted — likely SPA. Raw HTML head (4000 chars):`);
      console.log(d.rawSnippet);
    }

    console.log(`\n── JSON-LD Structured Data ────────────────────────────────────`);
    console.log(`JSON-LD blocks      : ${d.jsonLdCount}`);
    console.log(`Types found         : ${d.jsonLdTypes.join(', ') || 'none'}`);
    if (d.jsonLdSample.length > 0) {
      console.log(`Sample:`);
      d.jsonLdSample.forEach((b, i) => console.log(`  [${i}] ${JSON.stringify(b).slice(0, 400)}`));
    }

    console.log(`\n── Pagination ─────────────────────────────────────────────────`);
    console.log(`Result count text   : ${d.totalResultsText || '(not found in static HTML)'}`);
    console.log(`Pagination element  : ${d.hasPagination ? 'YES' : 'NOT found'}`);
    console.log(`Last page number    : ${d.lastPageNum ?? 'unknown'}`);

    // Delay between requests to be polite
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\n' + '═'.repeat(70));
  console.log('FEASIBILITY SUMMARY');
  console.log('═'.repeat(70));
  console.log(`
Key questions to answer from above:
  1. Are cards in static HTML?    → check "Likely SPA" per URL
  2. What selectors work?         → check "Matched selector" per URL
  3. Does pagination exist?       → check "Pagination element"
  4. Total programme estimate:
     - If biotech UK = 740 results and ~15/page → ~50 pages
     - CS/Canada likely 200-400 → ~15-27 pages
     - Business/Australia likely 300-600 → ~20-40 pages
     - Scale to ALL fields × ALL countries → potentially 500k+ listings

  Next step decision:
    - If static HTML: cheerio scraper is fast, cheap, no rate-limit risk
    - If SPA: puppeteer required → slower, resource-heavy, likely blocked
    - If paginated API (XHR): best case — intercept API calls via browser devtools
  `);
}

main().catch(console.error);
