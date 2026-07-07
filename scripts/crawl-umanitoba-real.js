// Real crawl: University of Manitoba academic catalogue (CourseLeaf A-Z index, same platform as uOttawa).
// Source: https://catalog.umanitoba.ca/azindex/ -> /undergraduate-studies/... and /graduate-studies/... program pages.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try { results[idx] = await fn(items[idx], idx); }
      catch (e) { results[idx] = { error: e.message }; }
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

const WHITELIST_RE = /\b(B\.?\s?Sc\.?|B\.?\s?A\.?\b|B\.?\s?Comm\.?|Bachelor|Honours|M\.?\s?Sc\.?|M\.?\s?A\.?\b|Master|PhD|Ph\.?D\.?|Doctorate|Diploma|Certificate|Juris Doctor)\b/i;
const BLACKLIST_RE = /\bMinor\b/i;

async function main() {
  console.log('Fetching UManitoba catalogue A-Z index...');
  const html = await fetchText('https://catalog.umanitoba.ca/azindex/');

  const linkRe = /<a href="(\/(?:undergraduate|graduate)-studies\/[^"]+)">([^<]+)<\/a>/g;
  const seen = new Set();
  const candidates = [];
  let m;
  while ((m = linkRe.exec(html))) {
    if (m[1].includes('course-descriptions')) continue;
    const url = 'https://catalog.umanitoba.ca' + m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    const name = m[2].replace(/\s+/g, ' ').trim();
    const level = m[1].startsWith('/undergraduate-studies/') ? 'Undergraduate' : 'Graduate';
    candidates.push({ url, name, level });
  }
  console.log(`Found ${candidates.length} candidate program pages (undergrad+graduate, excl. course-descriptions).`);

  const passedFilter = candidates.filter(c => WHITELIST_RE.test(c.name) && !BLACKLIST_RE.test(c.name));
  console.log(`Passed name whitelist/blacklist filter: ${passedFilter.length}`);

  console.log('Validating each page resolves (HTTP 200 + has h1)...');
  const results = await pool(passedFilter, 12, async (item) => {
    const pageHtml = await fetchText(item.url);
    const h1Match = pageHtml.match(/<h1[^>]*>([^<]+)<\/h1>/);
    return { ...item, valid: !!h1Match, h1: h1Match ? h1Match[1].replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : null };
  });

  const valid = results.filter(r => !r.error && r.valid);
  const invalid = results.filter(r => r.error || !r.valid);
  console.log(`Valid (resolves + has content): ${valid.length}`);
  console.log(`Rejected (404 or no content): ${invalid.length}`);
  if (invalid.length) console.log('Sample rejects:', JSON.stringify(invalid.slice(0, 5), null, 1));

  const outPath = path.join(OUT_DIR, 'university-of-manitoba.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'university-of-manitoba',
    sourceUrl: 'https://catalog.umanitoba.ca/azindex/',
    crawledAt: new Date().toISOString(),
    courses: valid.map(v => ({ name: v.h1 || v.name, url: v.url, level: v.level })),
  }, null, 2));
  console.log(`Wrote ${valid.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
