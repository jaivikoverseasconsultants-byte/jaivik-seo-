// Reads La Trobe University's own course facts and international fees.
//
//   node scripts/crawl-la-trobe.js [--fresh]
//
// Discovery is La Trobe's own sitemap (robots.txt -> /sitemap.xml): every /courses/<slug> URL whose
// slug names an award (bachelor-, master-, diploma-, graduate-..., doctor-, juris-, associate-). The
// other /courses/ URLs are subject-area pages. No KC list is used for La Trobe. Every figure is La Trobe's. La Trobe publishes no fee schedule:
// its international fees page says "search for the course ... The 'Overview' section will list the
// annual tuition fee" (latrobe.edu.au/international/applying/fees). Each course page loads that
// overview from JSON, one file per year, student type and location:
//   latrobe.edu.au/courses/data/<year>/international/<location>/<slug>?v=<n>
// The page's own URL (with its ?v= parameter) must be used — without it the server returns HTML.
// Each file has the location, delivery mode, CRICOS code, duration, start dates and `fees.rawFees`,
// which mixes Domestic rows with "Onshore International Applicants" rows. Only the International
// row is taken, only for a campus offering with a CRICOS code (a student visa needs one), and the
// "/on/" location is La Trobe Online, which is skipped. Fees are per 120 credit points, La Trobe's
// full-time annual load. YEAR is the intake an applicant today would join.
// Output: data/wave-australia/la-trobe-university.json, reviewed before scripts/gen-la-trobe.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/la-trobe-university.json');
const BASE = 'https://www.latrobe.edu.au';
const YEAR = 2027;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function get(url, referer) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const args = ['-s', '-L', '--max-time', '40', '-A', UA, '-w', '\n%{http_code}'];
      if (referer) args.push('-H', `Referer: ${referer}`);
      const out = execFileSync('curl', [...args, url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { status: 0, body: '' };
}

/** Fetch one course page and every international location file it links for YEAR. */
function readCourse(slug) {
  const url = `${BASE}/courses/${slug}`;
  const page = get(url);
  const rec = { slug, url, status: page.status, locations: [] };
  if (page.status !== 200) return rec;
  const dataUrls = [...new Set(page.body.match(new RegExp(`https://www\\.latrobe\\.edu\\.au/courses/data/${YEAR}/international/[a-z]+/${slug}\\?v=[0-9.]+`, 'g')) || [])];
  rec.yearsListed = [...new Set((page.body.match(/courses\/data\/(\d{4})\/international\//g) || []).map((m) => m.match(/\d{4}/)[0]))].sort();
  for (const du of dataUrls) {
    const loc = du.match(/international\/([a-z]+)\//)[1];
    const res = get(du, url);
    let json = null;
    try { json = JSON.parse(res.body); } catch (e) { /* not JSON */ }
    const d = json?.data;
    const intl = (d?.fees?.rawFees || []).filter((f) => f.Fee_Type === 'International');
    rec.locations.push({
      loc, dataUrl: du, available: json?.availability ?? null,
      name: d?.awardTitle ?? null, advertisedTitle: d?.advertisedTitle ?? null,
      location: d?.locationDisplayName ?? null, deliveryMode: d?.deliveryModeDescription ?? null,
      cricos: d?.cricosCourseCode || null, duration: d?.duration ?? null, startDates: d?.startDates ?? null,
      totalCreditPoints: d?.totalCreditPoints ?? null, offerYear: d?.offerYear ?? null,
      internationalFees: intl.map((f) => ({ cohort: f.Cohorts, amount: Number(f.Fee_Amount), discounted: f.Discounted_Fee_Amount || null, basis: f.Pricing_Basis, context: f.Additional_Context })),
      domesticRowsIgnored: (d?.fees?.rawFees || []).filter((f) => f.Fee_Type !== 'International').length,
    });
  }
  return rec;
}

module.exports = { readCourse, YEAR };

const AWARD = /^(bachelor|master|diploma|graduate|doctor|associate|juris|advanced)-/;

function main() {
  const sm = get(`${BASE}/sitemap.xml`);
  const prefix = 'https://www.latrobe.edu.au/courses/';
  const slugs = [...new Set(sm.body.split('<loc>').slice(1).map((l) => l.split('</loc>')[0].trim())
    .filter((u) => u.startsWith(prefix)).map((u) => u.slice(prefix.length))
    .filter((x) => x && !x.includes('/')))].filter((x) => AWARD.test(x)).sort();
  if (slugs.length < 100) throw new Error(`only ${slugs.length} award slugs in the sitemap — check its format`);

  // Reuse courses fetched today unless --fresh.
  const today = new Date().toISOString().slice(0, 10);
  const prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
  const cached = new Map((prev?._crawledOn === today ? prev.results : []).filter((r) => r.status === 200).map((r) => [r.slug, r]));

  const results = [];
  for (const slug of slugs) {
    const rec = cached.get(slug) || readCourse(slug);
    const campus = rec.locations.filter((l) => l.cricos && l.loc !== 'on' && l.internationalFees.length);
    console.log(`${campus.length ? 'ok  ' : '--  '} ${slug} | ${campus.map((l) => `${l.location} ${l.internationalFees.map((f) => f.amount).join('/')}`).join(', ') || `no international campus offering (${rec.locations.map((l) => l.loc).join(',') || `no ${YEAR} data`})`}`);
    results.push(rec);
  }
  fs.writeFileSync(OUT, JSON.stringify({
    _sources: ['https://www.latrobe.edu.au/sitemap.xml (course discovery)', `https://www.latrobe.edu.au/courses/data/${YEAR}/international/<location>/<slug>?v=<n> (facts and fees)`],
    _basis: `La Trobe's ${YEAR} indicative annual tuition for onshore international applicants, per 120 credit points (full-time annual load).`,
    _year: YEAR,
    _crawledOn: today,
    results,
  }, null, 1));
  console.log(`
${results.length} award pages, ${results.filter((r) => r.locations.some((l) => l.cricos && l.loc !== 'on' && l.internationalFees.length)).length} with an international campus offering -> ${path.relative(ROOT, OUT)}`);
}

if (require.main === module) main();
