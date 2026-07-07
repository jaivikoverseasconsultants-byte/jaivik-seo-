// Real crawl: Dalhousie University program finder AEM component API (structured JSON, no scraping needed).
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const API_URL = 'https://www.dal.ca/study/programs/_jcr_content/root/maincontent/main/programfinder.model.json';
const VALID_TYPES = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

async function main() {
  console.log('Fetching Dalhousie program finder API...');
  const res = await fetch(API_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${res.status} fetching ${API_URL}`);
  const data = await res.json();
  console.log(`Total programs in API: ${data.programs.length}`);

  const valid = data.programs.filter(p => Array.isArray(p.types) && p.types.some(t => VALID_TYPES.includes(t)) && p.mappedURL && p.name);
  console.log(`Valid (real degree/diploma/certificate programs): ${valid.length}`);

  const courses = valid.map(p => ({
    name: p.name.trim(),
    url: p.mappedURL,
    types: p.types.filter(t => VALID_TYPES.includes(t)),
    apiLevel: p.level,
    start: p.start,
    location: p.locations && p.locations[0] ? p.locations[0].title : null,
    faculty: p.faculties && p.faculties[0] ? p.faculties[0].title : null,
  }));

  const outPath = path.join(OUT_DIR, 'dalhousie-university.json');
  fs.writeFileSync(outPath, JSON.stringify({
    slug: 'dalhousie-university',
    sourceUrl: 'https://www.dal.ca/study/programs.html',
    apiUrl: API_URL,
    crawledAt: new Date().toISOString(),
    courses,
  }, null, 2));
  console.log(`Wrote ${courses.length} courses -> ${outPath}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
