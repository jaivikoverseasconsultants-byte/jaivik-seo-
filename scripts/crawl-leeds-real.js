// Real crawl: University of Leeds course-search results (server-rendered Funnelback listing).
// Source: https://courses.leeds.ac.uk/course-search/{undergraduate,masters}-courses (paginated).
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

function extractCourses(html) {
  const articles = html.split('<article').slice(1);
  const out = [];
  for (const art of articles) {
    const linkMatch = art.match(/<a href="([^"]+)" class="uol-results-items__item__link">\s*([^<]+?)\s*<\/a>/);
    if (!linkMatch) continue;
    const rawHref = linkMatch[1].replace(/&amp;/g, '&');
    const urlMatch = rawHref.match(/[?&]url=([^&]+)/);
    if (!urlMatch) continue;
    const realUrl = decodeURIComponent(urlMatch[1]);
    const name = linkMatch[2].replace(/\s+/g, ' ').trim();
    const durationMatch = art.match(/<dt class="uol-results-items__item__meta__label">Duration<\/dt>\s*<dd class="uol-results-items__item__meta__data">([^<]+)<\/dd>/);
    const duration = durationMatch ? durationMatch[1].replace(/\s+/g, ' ').trim() : null;
    out.push({ name, url: realUrl, duration });
  }
  return out;
}

async function crawlSection(sectionPath, totalResults, typeParam) {
  const pageSize = 15;
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  const results = await pool(pageNums, 6, async (page) => {
    const startRank = (page - 1) * pageSize + 1;
    const url = `https://courses.leeds.ac.uk/course-search/${sectionPath}?page=${page}&start_rank=${startRank}`;
    const html = await fetchText(url);
    return extractCourses(html);
  });

  return results.flat();
}

async function main() {
  console.log('Fetching UG course search results...');
  const ug = await crawlSection('undergraduate-courses', 309, 'UG');
  console.log(`UG courses: ${ug.length}`);

  console.log('Fetching Masters course search results...');
  const pg = await crawlSection('masters-courses', 280, 'PG');
  console.log(`PG courses: ${pg.length}`);

  const all = [
    ...ug.map(c => ({ ...c, level: 'Undergraduate' })),
    ...pg.map(c => ({ ...c, level: 'Postgraduate' })),
  ];

  const seen = new Set();
  const deduped = all.filter(c => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });
  console.log(`Total (deduped by URL): ${deduped.length}`);

  const outPath = path.join(OUT_DIR, 'university-of-leeds.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'university-of-leeds',
    sourceUrl: 'https://courses.leeds.ac.uk/course-search/undergraduate-courses',
    crawledAt: new Date().toISOString(),
    courses: deduped,
  }, null, 2));
  console.log(`Wrote ${deduped.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
