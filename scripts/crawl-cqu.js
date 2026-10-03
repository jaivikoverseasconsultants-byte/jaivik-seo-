// Reads CQUniversity's own course facts from its handbook (handbook.cqu.edu.au).
//
//   node scripts/crawl-cqu.js [--fresh]
//
// cqu.edu.au itself sits behind a Cloudflare JS challenge, which is not worked around. The handbook is
// openly served (no robots.txt restrictions) and gives, per course: name, CRICOS codes per campus,
// duration, and "Where and when can I start?" (campus x term for international students). Its newest
// course versions are 2024, and fees there stop at 2024 — so NO fee is taken from it. Tuition shown for
// CQU comes only from the partner-platform list, labelled as an estimate (see scripts/gen-cqu.js).
//   - Discovery: the handbook's /he/courses/{undergraduate,postgraduate,honours} category pages.
//   - Facts: /he/courses/view/<code> (the current version CQU publishes).
// Partial results are flushed every CHECKPOINT_EVERY courses (atomic write, _complete: false) and a
// re-run resumes from records of the current CRAWLER_VERSION.
// Output: data/wave-australia/cqu.json, reviewed before scripts/gen-cqu.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/cqu.json');
const BASE = 'https://handbook.cqu.edu.au';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const CRAWLER_VERSION = 2; // v1 read the default (old) version and only the nav text for intakes
const CHECKPOINT_EVERY = 10;

function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-s', '-L', '--max-time', '60', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { httpStatus: status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { httpStatus: 0, body: '' };
}

const flat = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '|')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/\s+/g, ' ').replace(/(\s*\|\s*)+/g, '|');

function readCourse(code) {
  // The plain URL shows an older default version; its "Term Year" list names every version
  // ("2027 HE Term 1", "2022 HE Term 1", ...). Read the newest one: /he/courses/view/<code>/HT<n>/<year>.
  const first = get(`${BASE}/he/courses/view/${code}`);
  const rec = { code, httpStatus: first.httpStatus, _v: CRAWLER_VERSION };
  if (first.httpStatus !== 200) return rec;
  if (/Course Not Found/.test(flat(first.body))) { rec.notFound = true; return rec; }
  const versions = [...new Set((flat(first.body).match(/\|(\d{4}) HE Term (\d)\|/g) || []).map((v) => v.replace(/\|/g, '')))]
    .map((v) => { const m = v.match(/(\d{4}) HE Term (\d)/); return { year: Number(m[1]), term: Number(m[2]) }; })
    .sort((a, b) => b.year - a.year || a.term - b.term);
  const newest = versions[0];
  rec.url = newest ? `${BASE}/he/courses/view/${code}/HT${newest.term}/${newest.year}` : `${BASE}/he/courses/view/${code}`;
  const res = newest ? get(rec.url) : first;
  rec.httpStatus = res.httpStatus;
  if (res.httpStatus !== 200) return rec;
  const t = flat(res.body);
  rec.name = ((res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || null;
  rec.version = (t.match(/Currently Displaying\|(\d{4} HE Term \d)/) || [])[1] || null;
  rec.duration = (t.match(/\|Duration\|([^|]+)\|/) || [])[1] || null;
  const cr = t.indexOf('|CRICOS Codes|');
  rec.cricos = [];
  if (cr >= 0) {
    for (const m of t.slice(cr, cr + 800).matchAll(/\|([A-Z]{3}) - (\d{6}[A-Z]|\d{7})(?=\|)/g)) rec.cricos.push({ campus: m[1], code: m[2] });
  }
  // "International Availability|Term 3 - 2027|Brisbane|Melbourne|...|Term 2 - 2027|..." — campuses per term.
  rec.intlAvailability = [];
  const ia = t.indexOf('|International Availability|');
  if (ia >= 0) {
    const cells = t.slice(ia + '|International Availability|'.length, ia + 6000).split('|');
    let cur = null;
    for (const c of cells) {
      const m = c.match(/^Term (\d) - (\d{4})$/);
      if (m) { cur = { term: Number(m[1]), year: Number(m[2]), campuses: [] }; rec.intlAvailability.push(cur); continue; }
      if (!cur || !/^[A-Z][A-Za-z ]{2,30}$/.test(c) || /Availability|Overview|Course|Details|Click/.test(c)) { if (cur && rec.intlAvailability.length > 0 && !/^[A-Z][A-Za-z ]{2,30}$/.test(c)) break; continue; }
      cur.campuses.push(c);
    }
  }
  return rec;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const codes = new Set();
  for (const cat of ['undergraduate', 'postgraduate', 'honours']) {
    const h = get(`${BASE}/he/courses/${cat}`).body;
    for (const m of h.matchAll(/\/he\/courses\/view\/([A-Za-z0-9]+)/g)) codes.add(m[1]);
  }
  if (codes.size < 50) throw new Error(`only ${codes.size} course codes found`);

  let prev = null;
  try { prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null; } catch (e) { /* start over */ }
  const cached = new Map((prev?.results || []).filter((r) => r.httpStatus === 200 && r._v === CRAWLER_VERSION).map((r) => [r.code, r]));
  if (cached.size) console.log(`resuming: ${cached.size} courses already fetched`);

  const results = [];
  const save = (complete) => {
    const tmp = `${OUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({
      _sources: [`${BASE}/he/courses/{undergraduate,postgraduate,honours} (discovery)`, `${BASE}/he/courses/view/<code> (facts; no fees used)`],
      _crawledOn: today, _complete: complete, _courses: codes.size, results,
    }, null, 1));
    fs.renameSync(tmp, OUT);
  };
  for (const code of [...codes].sort()) {
    const rec = cached.get(code) || readCourse(code);
    if (!cached.has(code)) console.log(`${rec.cricos?.length ? 'ok  ' : '--  '} ${code} | ${rec.notFound ? 'NOT FOUND' : rec.name} | ${rec.version ?? '?'} | ${(rec.cricos || []).map((c) => c.code).filter((v, i, a) => a.indexOf(v) === i).join(',')} | ${(rec.intlAvailability || []).filter((a) => a.year === 2027).map((a) => `T${a.term}:${a.campuses.join('/')}`).join(' ')}`);
    results.push(rec);
    if (results.length % CHECKPOINT_EVERY === 0) save(false);
  }
  save(true);
  console.log(`\n${results.length} courses, ${results.filter((r) => r.cricos?.length).length} with CRICOS -> ${path.relative(ROOT, OUT)}`);
}

main();
