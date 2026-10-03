// Reads the University of Tasmania's own course facts and international fees.
//
//   node scripts/crawl-utas.js [--fresh]
//
// Every figure here is UTAS's; no partner-platform list is used.
//   - Discovery: UTAS's courses sitemap (www.utas.edu.au/courses/sitemap.xml), every
//     /courses/<college>/courses/<code>-<slug> page (the rest are units).
//   - Facts: the page's schema.org Course JSON-LD (name, courseCode, CRICOS identifier), and the
//     international tab of its "Key Information" panel (the copy that carries the CRICOS code):
//     duration and "Location | <campus> | <study periods> | ..." pairs.
//   - Fees: the page's own sentences "<year> annual international student tuition fee: $<n> AUD" and
//     "Indicative total tuition fee for international students: $ <n> AUD", plus "The standard year of
//     study for this course is <n> credit points".
// Partial results are flushed every CHECKPOINT_EVERY courses (atomic write, _complete: false) and a
// re-run resumes from records of the current CRAWLER_VERSION, so a low-memory kill loses little.
// Output: data/wave-australia/utas.json, reviewed before scripts/gen-utas.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/utas.json');
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
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&ndash;/g, '–').replace(/\s+/g, ' ').replace(/(\s*\|\s*)+/g, '|');
const num = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || null;

function readCourse(url) {
  const res = get(url);
  const rec = { url, httpStatus: res.httpStatus, _v: CRAWLER_VERSION };
  if (res.httpStatus !== 200) return rec;
  const h = res.body;
  for (const m of h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]);
      if (j['@type'] === 'Course') {
        rec.name = j.name; rec.code = j.courseCode;
        rec.cricos = (j.identifier || []).find((i) => i.propertyID === 'CRICOS')?.value || null;
        rec.aqf = j.educationalCredentialAwarded || null;
      }
    } catch (e) { /* not JSON */ }
  }
  const t = flat(h);
  const fee = t.match(/(\d{4}) annual international student tuition fee:\s*\$\s*([\d,]+)\s*AUD/i);
  rec.feeYear = fee ? Number(fee[1]) : null;
  rec.annualFee = fee ? num(fee[2]) : null;
  rec.totalFee = num((t.match(/Indicative total tuition fee for international students:\s*\$\s*([\d,]+)/i) || [])[1]);
  rec.creditPointsPerYear = num((t.match(/standard year of study for this course is\s*([\d.]+)\s*credit points/i) || [])[1]);
  // International tab: the Key Information copy that carries the CRICOS code.
  const i = t.indexOf('CRICOS|:');
  if (i >= 0) {
    const block = t.slice(i, i + 2500);
    rec.duration = (block.match(/\|Duration\|([^|]+)\|/) || [])[1] || null;
    const loc = block.indexOf('|Location|');
    if (loc >= 0) {
      // "Hobart|Semester 1, Semester 2|Melbourne Study Centre|Semester 1|..." until free text starts
      const parts = block.slice(loc + '|Location|'.length).split('|');
      const pairs = [];
      for (let k = 0; k + 1 < parts.length; k += 2) {
        const campus = parts[k].trim();
        const periods = parts[k + 1].trim();
        if (!campus || campus.length > 40 || !/semester|trimester|term|summer|winter|spring|block|study period|january|february|march|april|may|june|july|august|september|october|november|december/i.test(periods)) break;
        pairs.push({ campus, periods });
      }
      rec.internationalLocations = pairs;
    }
  }
  return rec;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const sm = get('https://www.utas.edu.au/courses/sitemap.xml').body;
  const urls = [...new Set(sm.split('<loc>').slice(1).map((l) => l.split('</loc>')[0].trim())
    .filter((u) => /\/courses\/[a-z0-9-]+\/courses\/[a-z0-9]+-[a-z0-9-]+$/.test(u)))].sort();
  if (urls.length < 100) throw new Error(`only ${urls.length} course URLs in the sitemap`);

  let prev = null;
  try { prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null; } catch (e) { /* unreadable: start over */ }
  const cached = new Map((prev?.results || []).filter((r) => r.httpStatus === 200 && r._v === CRAWLER_VERSION).map((r) => [r.url, r]));
  if (cached.size) console.log(`resuming: ${cached.size} courses already fetched`);

  const results = [];
  const save = (complete) => {
    const tmp = `${OUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({
      _sources: ['https://www.utas.edu.au/courses/sitemap.xml (discovery)', 'each course page: Course JSON-LD, international Key Information, international fee sentences'],
      _crawledOn: today, _complete: complete, _courses: urls.length, results,
    }, null, 1));
    fs.renameSync(tmp, OUT);
  };
  for (const url of urls) {
    const rec = cached.get(url) || readCourse(url);
    if (!cached.has(url)) console.log(`${rec.annualFee && rec.cricos ? 'ok  ' : '--  '} ${url.split('/courses/').pop()} | ${rec.annualFee ?? 'no intl fee'} | ${rec.cricos ?? 'no CRICOS'} | ${(rec.internationalLocations || []).map((l) => `${l.campus}: ${l.periods}`).join('; ')}`);
    results.push(rec);
    if (results.length % CHECKPOINT_EVERY === 0) save(false);
  }
  save(true);
  console.log(`\n${results.length} course pages, ${results.filter((r) => r.annualFee && r.cricos).length} with an international fee and CRICOS -> ${path.relative(ROOT, OUT)}`);
}

main();
