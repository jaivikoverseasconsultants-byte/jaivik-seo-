// Reads Bond University's own programme facts and international fees.
//
//   node scripts/crawl-bond-university.js
//
// Discovery only came from KC (data/wave-australia/kc/bond-university-courses-KC-raw.csv): it says
// which programmes exist. Every figure here is Bond's. Bond publishes no fee schedule PDF ("All fees
// are listed on each individual program page"), so each programme is read from its own page:
//   - bond.edu.au/program/<slug> carries data-program-detail-url="/api/program-details/<id>":
//     official name, programme code, duration and the intake offerings (semester, mode, campus).
//   - bond.edu.au/program/<slug>/fees carries data-fees-url="/api/program-fees/<id>/<code>": the
//     fee widget's JSON, per commencement year, with separate domestic and international figures,
//     each a semester fee and a programme total. Bond calls both "indicative".
// Bond teaches three semesters a year, so there is no annual fee to take; per semester and total are
// kept as published. Raw API responses are saved alongside, so every figure can be re-checked.
// Output: data/wave-australia/bond-university.json, reviewed before scripts/gen-bond-university.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/bond-university.json');
const KC = path.join(ROOT, 'data/wave-australia/kc/bond-university-courses-KC-raw.csv');
const BASE = 'https://bond.edu.au';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

// KC name -> Bond programme slug, where the rule below doesn't produce it.
const KC_TO_BOND = {
  'Doctor of Physiotherapy| (Quota Program - Limited Seats)': 'professional-doctorate-of-physiotherapy',
  'Master of Juris Doctor': 'juris-doctor',
  'Bachelor of Design in Architecture': 'bachelor-of-design-architecture',
  // the one combined degree Bond writes with a hyphen between the halves
  'Bachelor of Entrepreneurial Transformation / Bachelor of Global Studies (Sustainability)': 'bachelor-of-entrepreneurial-transformation-bachelor-of-global-studies-sustainability',
};

// KC rows Bond no longer offers, checked 2026-10-03: not in Bond's sitemap, and the programme URL
// either redirects to the programme finder or is refused.
const NOT_OFFERED = {
  'Bachelor of Health Transformation/ Bachelor of Health Sciences': 'bond.edu.au/program/bachelor-of-health-transformationbachelor-of-health-sciences 301s to the programme finder',
  'Bachelor of International Hotel and Tourism Management (3 Year Program)': 'bond.edu.au/program/bachelor-of-international-hotel-and-tourism-management-3-year-program returns 403 and is not in the sitemap',
};

// Programmes Bond offers that KC's list leaves out — KC carries only the "(Professional)" versions of
// these master's. Added 2026-10-03 by decision: they are the genuine equivalents of URLs from the July
// 2026 file this replaces (bond-mba, bond-master-of-finance, bond-msc-data-analytics, ...).
const FROM_BOND_SITE = [
  'master-of-business-administration',
  'master-of-finance',
  'master-of-data-analytics',
  'master-of-business-data-analytics',
  'master-of-marketing',
  'master-of-project-management',
];

// "Bachelor of Arts/ Bachelor of Laws" -> "bachelor-of-artsbachelor-of-laws": Bond joins the two
// halves of a combined degree with nothing between them.
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bondSlug = (name) => KC_TO_BOND[name]
  || name.replace(/\(pathway\)/i, '').split('/').map(slugify).join('');

// KC's CSV is not quoted consistently ("Bachelor of Policy, Philosophy and Economics" carries a bare
// comma), so each row is split on its "<n> months" field rather than on commas.
function readKc() {
  return fs.readFileSync(KC, 'utf8').trim().split(/\r?\n/).slice(1).map((line) => {
    const m = line.match(/^(.*?),(\d+) months,"([^"]*)",(\d*),([^,]*),(\d*),(.*)$/);
    if (!m) throw new Error(`unparsed KC row: ${line}`);
    return {
      name: m[1].trim(), months: Number(m[2]), intakes: m[3], tuitionYrAUD: m[4] ? Number(m[4]) : null,
      initialDepositAUD: m[6] ? Number(m[6]) : null, note: m[7].replace(/^KC coursefinder\.ai \(pointer - needs official verification\)\s*-?\s*/, '') || null,
    };
  });
}

// Plain curl: Bond answers it without a challenge, and it matches how the other crawlers fetch.
function get(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-s', '-L', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { status: 0, body: '' };
}

const attr = (html, name) => (html.match(new RegExp(`${name}="([^"]+)"`)) || [])[1] || null;

function main() {
  const kc = readKc();
  // One entry per Bond programme page; KC lists some programmes more than once.
  const bySlug = new Map();
  const dropped = [];
  for (const row of kc) {
    if (NOT_OFFERED[row.name]) { dropped.push({ kcName: row.name, reason: NOT_OFFERED[row.name] }); continue; }
    const slug = bondSlug(row.name);
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, kcRows: [] });
    bySlug.get(slug).kcRows.push(row);
  }
  for (const slug of FROM_BOND_SITE) if (!bySlug.has(slug)) bySlug.set(slug, { slug, kcRows: [], discoveredOn: 'bond.edu.au' });

  // Reuse programmes already fetched today unless --fresh: a full pass is ~300 requests.
  const prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
  const cached = new Map((prev?._crawledOn === new Date().toISOString().slice(0, 10) ? prev.results : []).filter((r) => r.status === 200).map((r) => [r.slug, r]));

  const results = [];
  for (const rec of bySlug.values()) {
    if (cached.has(rec.slug)) { results.push({ ...cached.get(rec.slug), kcRows: rec.kcRows, ...(rec.discoveredOn ? { discoveredOn: rec.discoveredOn } : {}) }); continue; }
    rec.url = `${BASE}/program/${rec.slug}`;
    const page = get(rec.url);
    rec.status = page.status;
    if (page.status !== 200) { console.log(`MISS ${rec.slug} (${page.status})`); results.push(rec); continue; }
    rec.detailApi = attr(page.body, 'data-program-detail-url');
    rec.programCode = attr(page.body, 'data-program');
    const feesPage = get(`${rec.url}/fees`);
    rec.feesApi = attr(feesPage.body, 'data-fees-url');
    if (rec.detailApi) rec.details = JSON.parse(get(BASE + rec.detailApi).body || 'null');
    if (rec.feesApi) rec.fees = JSON.parse(get(BASE + rec.feesApi).body || 'null');
    // Bond publishes one of three shapes per year: semester + total, annual + total, or total only.
    // New programmes (first intake 2027) carry 2027 fees only.
    const year = (rec.fees?.fees || []).filter((f) => f.international?.total).map((f) => f.year).sort()[0];
    const intl = year && rec.fees.fees.find((f) => f.year === year).international;
    console.log(`ok   ${rec.slug} | ${rec.details?.programs?.[0]?.duration || '?'} | intl ${year ? `${year}: ${intl.semester ? intl.semester + '/sem, ' : ''}${intl.annual ? intl.annual + '/yr, ' : ''}${intl.total} total` : 'none'}`);
    results.push(rec);
  }

  fs.writeFileSync(OUT, JSON.stringify({
    _sources: ['https://bond.edu.au/program/<slug> (data-program-detail-url)', 'https://bond.edu.au/program/<slug>/fees (data-fees-url)'],
    _basis: 'Bond indicative international tuition per semester and programme total, by commencement year; not annualised (three semesters a year).',
    _crawledOn: new Date().toISOString().slice(0, 10),
    dropped,
    results,
  }, null, 1));
  console.log(`\n${results.length} programmes, ${results.filter((r) => r.status === 200).length} pages found -> ${path.relative(ROOT, OUT)}`);
}

main();
