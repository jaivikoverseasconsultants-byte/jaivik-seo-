// Real crawl: University of Birmingham course pages via its own sitemap.
// Source: https://www.birmingham.ac.uk/study/sitemap.xml -> /study/{undergraduate,postgraduate}/subjects/*-courses/<course>
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
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

const SUFFIX_RE = /-(msc|ba|bsc|phd|ma|msci|mres|meng|llm|beng|pgcert|llb|mpa|pgdip|mph|doctorate)$/i;
const SUFFIX_LEVEL = {
  msc: 'Master', ma: 'Master', msci: 'Master', mres: 'Master (Research)', llm: 'Master', mpa: 'Master', mph: 'Master',
  ba: 'Bachelor', bsc: 'Bachelor', meng: 'Bachelor', beng: 'Bachelor', llb: 'Bachelor',
  phd: 'PhD', doctorate: 'PhD',
  pgcert: 'Postgraduate Certificate', pgdip: 'Postgraduate Diploma',
};

async function main() {
  console.log('Fetching Birmingham /study sitemap...');
  const xml = await fetchText('https://www.birmingham.ac.uk/study/sitemap.xml');
  const allUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);

  const candidates = allUrls.filter(u => {
    if (!/^https:\/\/www\.birmingham\.ac\.uk\/study\/(undergraduate|postgraduate)\/subjects\//.test(u)) return false;
    const depth = u.split('/').length;
    if (depth !== 8) return false;
    const lastSeg = u.split('/').pop();
    return SUFFIX_RE.test(lastSeg);
  });
  console.log(`Found ${candidates.length} candidate course URLs (matched degree-suffix whitelist).`);

  console.log('Fetching each course page for its real title...');
  const results = await pool(candidates, 12, async (url) => {
    const html = await fetchText(url);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const name = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : null;
    const suffix = url.split('/').pop().match(SUFFIX_RE)[1].toLowerCase();
    const level = url.includes('/undergraduate/') ? 'Undergraduate' : 'Postgraduate';
    return { url, name, suffix, level };
  });

  const valid = results.filter(r => !r.error && r.name && r.name.length > 2);
  const invalid = results.filter(r => r.error || !r.name);
  console.log(`Valid (resolves + has H1 title): ${valid.length}`);
  console.log(`Rejected: ${invalid.length}`);
  if (invalid.length) console.log('Sample rejects:', JSON.stringify(invalid.slice(0, 5), null, 1));

  const outPath = path.join(OUT_DIR, 'university-of-birmingham.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'university-of-birmingham',
    sourceUrl: 'https://www.birmingham.ac.uk/study/sitemap.xml',
    crawledAt: new Date().toISOString(),
    courses: valid,
  }, null, 2));
  console.log(`Wrote ${valid.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
