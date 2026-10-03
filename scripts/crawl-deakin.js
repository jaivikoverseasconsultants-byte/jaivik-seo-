// Reads Deakin University's own course facts and international fees.
//
//   node scripts/crawl-deakin.js [--fresh]
//
// Every figure here is Deakin's; no partner-platform list is used. (Deakin was once listed as
// WAF-blocked; plain curl reads it without a challenge as of 2026-10-03.)
//   - Discovery: Deakin's course sitemap (www.deakin.edu.au/footer/sitemap/xml/course.xml), every
//     /course/<slug>-international page — Deakin's international version of each course.
//   - Facts and fee: the page's schema.org Course JSON-LD (audience "International students": name,
//     courseCode, timeToComplete, hasCourseInstance with onsite/online locations, offers.price and
//     offers.description e.g. "$45,800 for 1 yr full-time AUD") and its key-information text:
//     "Year <n> course information", Intakes ("Trimesters 1, 2, 3"), CRICOS code(s) with campus,
//     Duration, and the estimated-tuition-fee note (typical first-year load).
// Partial results are flushed every CHECKPOINT_EVERY courses (atomic write, _complete: false) and a
// re-run resumes from records of the current CRAWLER_VERSION.
// Output: data/wave-australia/deakin.json, reviewed before scripts/gen-deakin.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/deakin.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const CRAWLER_VERSION = 1;
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
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&rsquo;/g, "'").replace(/\s+/g, ' ').replace(/(\s*\|\s*)+/g, '|');
const after = (t, label) => { const i = t.indexOf(`|${label}|`); return i < 0 ? null : t.slice(i + label.length + 2).split('|')[0].trim(); };

function readCourse(url) {
  const res = get(url);
  const rec = { url, httpStatus: res.httpStatus, _v: CRAWLER_VERSION };
  if (res.httpStatus !== 200) return rec;
  const h = res.body;
  for (const m of h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (j['@type'] !== 'Course') continue;
      Object.assign(rec, {
        name: j.name, code: j.courseCode, audience: j.audience?.audienceType || null,
        educationLevel: j.educationLevel || null, timeToComplete: j.timeToComplete || null,
        instances: (j.hasCourseInstance || []).map((c) => ({ mode: c.courseMode, location: c.location?.name || null })),
        offerPrice: Number(j.offers?.price) || null, offerCurrency: j.offers?.priceCurrency || null, offerDescription: j.offers?.description || null,
      });
    } catch (e) { /* not JSON */ }
  }
  const t = flat(h);
  // "<dt><strong>Year</strong></dt><dd><p>2027 course information" — read from the raw markup; the
  // flattened text splits the label from the year.
  rec.courseYear = Number((h.match(/Year<\/strong><\/dt>\s*<dd>\s*<p>\s*(\d{4}) course information/) || [])[1]) || null;
  rec.intakes = after(t, 'Intakes');
  rec.duration = after(t, 'Duration');
  rec.campusText = after(t, 'Campus');
  const cr = t.indexOf('CRICOS code|');
  rec.cricos = cr >= 0 ? [...t.slice(cr, cr + 600).matchAll(/(\d{6}[0-9A-Z])\s*([A-Z][A-Za-z ()-]+)?/g)].map((m) => ({ code: m[1], campus: (m[2] || '').trim() || null })) : [];
  rec.feeNote = (t.match(/Estimated tuition fee\|[^|]*\|[^|]*\|([^|]{0,300})/) || [])[1] || null;
  return rec;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const sm = get('https://www.deakin.edu.au/footer/sitemap/xml/course.xml').body;
  const urls = [...new Set(sm.split('<loc>').slice(1).map((l) => l.split('</loc>')[0].trim()).filter((u) => /\/course\/[a-z0-9-]+-international$/.test(u)))].sort();
  if (urls.length < 100) throw new Error(`only ${urls.length} international course URLs in the sitemap`);

  let prev = null;
  try { prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null; } catch (e) { /* start over */ }
  const cached = new Map((prev?.results || []).filter((r) => r.httpStatus === 200 && r._v === CRAWLER_VERSION).map((r) => [r.url, r]));
  if (cached.size) console.log(`resuming: ${cached.size} courses already fetched`);

  const results = [];
  const save = (complete) => {
    const tmp = `${OUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({
      _sources: ['https://www.deakin.edu.au/footer/sitemap/xml/course.xml (discovery)', 'each /course/<slug>-international page: Course JSON-LD + key information'],
      _crawledOn: today, _complete: complete, _courses: urls.length, results,
    }, null, 1));
    fs.renameSync(tmp, OUT);
  };
  for (const url of urls) {
    const rec = cached.get(url) || readCourse(url);
    if (!cached.has(url)) console.log(`${rec.offerPrice && rec.cricos?.length ? 'ok  ' : '--  '} ${url.split('/course/')[1]} | ${rec.offerDescription ?? 'no fee'} | ${(rec.cricos || []).map((c) => c.code).join(',') || 'no CRICOS'} | ${rec.intakes ?? ''} | ${(rec.instances || []).filter((i) => i.mode === 'onsite').map((i) => i.location).join(', ')}`);
    results.push(rec);
    if (results.length % CHECKPOINT_EVERY === 0) save(false);
  }
  save(true);
  console.log(`\n${results.length} international course pages, ${results.filter((r) => r.offerPrice && r.cricos?.length).length} with a fee and CRICOS -> ${path.relative(ROOT, OUT)}`);
}

main();
