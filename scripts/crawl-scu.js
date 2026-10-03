// Reads Southern Cross University's own course facts and international fees.
//
//   node scripts/crawl-scu.js [--fresh]
//
// Every figure here is SCU's; no partner-platform list is used.
//   - Discovery: SCU's sitemap (www.scu.edu.au/google-sitemap/index.xml), every
//     /study/courses/<slug>-<id>/ course; its YEAR version (/study/courses/<slug>-<id>/<YEAR>/) is read.
//   - Facts: the page's "International snapshot" (Start Date as months, Duration, Location) and the
//     international availability table "Location | Teaching period | Annual Fees | CRICOS", one row per
//     campus (offshore partner campuses carry N/A and are dropped by the generator).
// Partial results are flushed every CHECKPOINT_EVERY courses (atomic write, _complete: false) and a
// re-run resumes from records of the current CRAWLER_VERSION.
// Output: data/wave-australia/scu.json, reviewed before scripts/gen-scu.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/scu.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const YEAR = 2027;
const CRAWLER_VERSION = 2; // v1 took the name from <h1>, which is the year selector ("2027")
const CHECKPOINT_EVERY = 10;

function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-s', '-L', '--max-time', '40', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { httpStatus: status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { httpStatus: 0, body: '' };
}

const flat = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '|')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').replace(/(\s*\|\s*)+/g, '|');

function readCourse(base) {
  const url = `${base}${YEAR}/`;
  const res = get(url);
  const rec = { base, url, httpStatus: res.httpStatus, _v: CRAWLER_VERSION };
  if (res.httpStatus !== 200) return rec;
  const h = res.body;
  // "Bachelor of Nursing - 2027 - SCU"; the page's <h1> is the year selector, not the course name.
  rec.name = ((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '').replace(/\s+-\s+\d{4}\s+-\s+SCU\s*$/, '').replace(/&amp;/g, '&').trim() || null;
  const t = flat(h);
  const snap = t.indexOf('International snapshot|');
  if (snap >= 0) {
    const s = t.slice(snap, snap + 1200);
    const field = (label) => (s.match(new RegExp(`\\|${label}\\|(?:What's this\\|)?([^|]+)\\|`)) || [])[1]?.trim() || null;
    rec.intlStart = field('Start Date');
    rec.intlDuration = field('Duration');
    rec.intlLocation = field('Location');
    rec.abbreviation = field('Course abbreviation');
  }
  // International availability table: the one with a CRICOS column.
  const tab = t.indexOf('|Annual Fees|CRICOS|');
  rec.intlRows = [];
  if (tab >= 0) {
    const cells = t.slice(tab + '|Annual Fees|CRICOS|'.length).split('|');
    for (let k = 0; k + 3 < cells.length; k += 4) {
      const [campus, periods, fee, cricos] = cells.slice(k, k + 4).map((c) => c.trim());
      if (!/term|session|trimester|semester/i.test(periods)) break;
      rec.intlRows.push({ campus, periods, fee, cricos });
    }
  }
  return rec;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const sm = get('https://www.scu.edu.au/google-sitemap/index.xml').body;
  const bases = [...new Set(sm.split('<loc>').slice(1).map((l) => l.split('</loc>')[0].trim())
    .map((u) => (u.match(/^(https:\/\/www\.scu\.edu\.au\/study\/courses\/[a-z0-9-]+-\d+\/)/) || [])[1]).filter(Boolean))].sort();
  if (bases.length < 50) throw new Error(`only ${bases.length} course URLs in the sitemap`);

  let prev = null;
  try { prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null; } catch (e) { /* start over */ }
  const cached = new Map((prev?.results || []).filter((r) => r.httpStatus === 200 && r._v === CRAWLER_VERSION).map((r) => [r.base, r]));
  if (cached.size) console.log(`resuming: ${cached.size} courses already fetched`);

  const results = [];
  const save = (complete) => {
    const tmp = `${OUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({
      _sources: ['https://www.scu.edu.au/google-sitemap/index.xml (discovery)', `each /study/courses/<slug>-<id>/${YEAR}/ page: International snapshot + international availability table`],
      _year: YEAR, _crawledOn: today, _complete: complete, _courses: bases.length, results,
    }, null, 1));
    fs.renameSync(tmp, OUT);
  };
  for (const base of bases) {
    const rec = cached.get(base) || readCourse(base);
    if (!cached.has(base)) console.log(`${rec.intlRows?.some((r) => /\$/.test(r.fee)) ? 'ok  ' : '--  '} ${base.split('/courses/')[1]} | ${rec.intlStart ?? 'no intl start'} | ${(rec.intlRows || []).filter((r) => /\$/.test(r.fee)).map((r) => `${r.campus} ${r.fee} ${r.cricos}`).join('; ')}`);
    results.push(rec);
    if (results.length % CHECKPOINT_EVERY === 0) save(false);
  }
  save(true);
  console.log(`\n${results.length} courses, ${results.filter((r) => r.intlRows?.some((x) => /\$/.test(x.fee))).length} with an international campus fee -> ${path.relative(ROOT, OUT)}`);
}

main();
