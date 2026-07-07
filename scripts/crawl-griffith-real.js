// Real crawl: Griffith University's own program REST API (degrees.griffith.edu.au).
// Source: /rest-api/v3/index/programs (id index) -> /rest-api/v3/index/program/{id} (per-program JSON).
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
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

const DEGREE_TYPE_RE = /Bachelor|Master|Doctor|Graduate Certificate|Graduate Diploma|Diploma|Certificate/i;

async function main() {
  console.log('Fetching Griffith program ID index...');
  const idx = await fetchJson('https://degrees.griffith.edu.au/rest-api/v3/index/programs');
  const ids = idx.programs.program.map(p => p.identifier.match(/\/(\d+)$/)[1]);
  console.log(`Found ${ids.length} program IDs.`);

  console.log('Fetching each program record...');
  const results = await pool(ids, 15, async (id) => {
    const data = await fetchJson(`https://degrees.griffith.edu.au/rest-api/v3/index/program/${id}`);
    return data;
  });

  const fetched = results.filter(r => !r.error);
  console.log(`Fetched successfully: ${fetched.length} / ${ids.length}`);

  const offered = fetched.filter(p => p.currentlyOffered === true || p.currentlyOffered === 'true');
  console.log(`currentlyOffered=true: ${offered.length}`);

  const typeNames = offered.map(p => (p.types && p.types.type ? (Array.isArray(p.types.type) ? p.types.type.map(t => t.name).join('/') : p.types.type.name) : ''));
  const valid = offered.filter((p, i) => DEGREE_TYPE_RE.test(typeNames[i]) || DEGREE_TYPE_RE.test(p.title || ''));
  console.log(`Passed degree-type whitelist: ${valid.length}`);

  const courses = valid.map(p => ({
    name: p.title,
    url: p.url,
    award: p.award,
    academicCareer: p.academicCareer,
    type: p.types && p.types.type ? (Array.isArray(p.types.type) ? p.types.type[0].name : p.types.type.name) : null,
    academicOrgDescr: p.academicOrgDescr,
  })).filter(c => c.name && c.url);

  const outPath = path.join(OUT_DIR, 'griffith-university.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'griffith-university',
    sourceUrl: 'https://degrees.griffith.edu.au/rest-api/v3/index/programs',
    crawledAt: new Date().toISOString(),
    courses,
  }, null, 2));
  console.log(`Wrote ${courses.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
