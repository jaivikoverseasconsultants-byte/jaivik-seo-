// Reads Macquarie University's own course facts and international fees.
//
//   node scripts/crawl-macquarie.js [--fresh]
//
// Every figure here is Macquarie's; no partner-platform list is used.
//   - Discovery: the study site's own sitemap, www.mq.edu.au/study/sitemap-0.xml — every top-level
//     /study/find-a-course/courses/<slug>/ (nested paths are majors and specialisations of those).
//   - Facts and fees: each course page is a Gatsby page whose data file,
//     /study/page-data/find-a-course/courses/<slug>/page-data.json, embeds Macquarie's course record
//     (result.data.current.fields.json): title, CRICOS code, duration, credit points, type,
//     isOfferedToInternational, `fees` (one row per fee type — the "International Fee-paying" row has
//     estimated_annual_fee and fee_per_credit_point) and marketing_items.applications (one block per
//     student type; the "International - ..." block lists the sessions international students apply for).
//   - Session start dates: only in the page's rendered "Location and start dates" table
//     (Session | Location | Applications open | Applications close | Session commences).
// Output: data/wave-australia/macquarie.json, reviewed before scripts/gen-macquarie.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/macquarie.json');
const BASE = 'https://www.mq.edu.au/study';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const CRAWLER_VERSION = 2;
// Partial results are flushed to OUT every this many courses (marked _complete: false), and a re-run
// resumes from them, so a low-memory kill costs at most this many fetches.
const CHECKPOINT_EVERY = 10;

function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-s', '-L', '--max-time', '40', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { status: 0, body: '' };
}

const text = (h) => h.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '|').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').replace(/(\s*\|\s*)+/g, '|');

/** "Session 1|North Ryde|2 September 2026|8 February 2027|22 February 2027" rows of the start-dates table. */
function startTable(html) {
  const t = text(html);
  const rows = [];
  const re = /\|(Session \d|Term \d|[A-Z][a-z]+ (?:Session|Term|intake))\|([A-Za-z ,()-]+?)\|(\d{1,2} [A-Z][a-z]+ \d{4})\|(\d{1,2} [A-Z][a-z]+ \d{4})\|(\d{1,2} [A-Z][a-z]+ \d{4})(?=\|)/g;
  let m;
  while ((m = re.exec(t))) rows.push({ session: m[1], location: m[2].trim(), opens: m[3], closes: m[4], commences: m[5] });
  return rows;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  const sm = get(`${BASE}/sitemap-0.xml`).body;
  const slugs = [...new Set((sm.match(/\/study\/find-a-course\/courses\/[^<"]+/g) || [])
    .map((u) => u.replace('/study/find-a-course/courses/', '').replace(/\/$/, '')).filter((s) => s && !s.includes('/')))].sort();
  if (slugs.length < 100) throw new Error(`only ${slugs.length} course slugs in the sitemap`);

  // Resume: reuse records from an earlier (possibly interrupted) run made by this crawler version.
  // --fresh ignores them. Records from an older version are re-fetched (v1 lost every second row of
  // the start-dates table).
  let prev = null;
  try { prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null; } catch (e) { /* unreadable checkpoint: start over */ }
  const cached = new Map((prev?.results || []).filter((r) => r.status === 200 && r._v === CRAWLER_VERSION).map((r) => [r.slug, r]));
  if (cached.size) console.log(`resuming: ${cached.size} courses already fetched`);

  const results = [];
  const save = (complete) => {
    const tmp = `${OUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({
      _sources: [`${BASE}/sitemap-0.xml (discovery)`, `${BASE}/page-data/find-a-course/courses/<slug>/page-data.json (course record, fees)`, `${BASE}/find-a-course/courses/<slug>/ (start-dates table)`],
      _crawledOn: today,
      _complete: complete,
      _courses: slugs.length,
      results,
    }, null, 1));
    fs.renameSync(tmp, OUT); // atomic, so a kill mid-write never leaves a truncated checkpoint
  };
  for (const slug of slugs) {
    if (cached.has(slug)) { results.push(cached.get(slug)); continue; }
    const url = `${BASE}/find-a-course/courses/${slug}/`;
    const pd = get(`${BASE}/page-data/find-a-course/courses/${slug}/page-data.json`);
    const rec = { slug, url, status: pd.status, _v: CRAWLER_VERSION };
    let c = null;
    try { c = JSON.parse(JSON.parse(pd.body).result.data.current.fields.json); } catch (e) { /* no course record */ }
    if (c) {
      const intlFee = (c.fees || []).filter((f) => f.fee_type?.value === 'international_fee_paying');
      const intlApps = (c.marketing_items?.applications || []).filter((a) => /^International/i.test(a.instruction?.value || ''));
      Object.assign(rec, {
        code: c.code, title: c.title, type: c.type?.label, studyLevel: c.study_level, year: c.implementation_year,
        courseStatus: c.status?.value, cricos: (c.cricos_code || '').trim() || null,
        duration: c.course_duration_in_years?.label || null, creditPoints: c.credit_points,
        offeredToInternational: c.isOfferedToInternational, isDouble: c.isDouble, isPathway: c.isPathway,
        locations: [...new Set((c.offering || []).map((o) => o.location).filter(Boolean))],
        internationalFees: intlFee.map((f) => ({ annual: Number(f.estimated_annual_fee) || null, perCreditPoint: Number(f.fee_per_credit_point) || null, note: f.fee_note || null, intakes: f.intakes })),
        internationalSessions: [...new Set(intlApps.flatMap((a) => (a.application_dates || []).map((d) => d.intake?.value)).filter(Boolean))],
      });
      const page = get(url);
      rec.startTable = page.status === 200 ? startTable(page.body) : [];
    }
    const f = rec.internationalFees?.[0];
    console.log(`${rec.offeredToInternational && f?.annual ? 'ok  ' : '--  '} ${slug} | ${f?.annual ?? 'no intl fee'} | ${rec.cricos ?? 'no CRICOS'} | ${(rec.internationalSessions || []).join(',')} | ${(rec.startTable || []).map((r) => `${r.session} ${r.commences}`).join('; ')}`);
    results.push(rec);
    if (results.length % CHECKPOINT_EVERY === 0) save(false);
  }
  save(true);
  console.log(`\n${results.length} courses, ${results.filter((r) => r.offeredToInternational && r.internationalFees?.[0]?.annual).length} offered to international students with a fee -> ${path.relative(ROOT, OUT)}`);
}

main();
