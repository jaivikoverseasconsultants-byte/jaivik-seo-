// Third title pass: the 8 course-listing pages pass 1 missed, the one-off pages, and the
// two data files that carry their own metaTitle.
//
// The floor: buildMetadata() appends " | Jaivik Overseas Consultants" (30 chars), so the
// authored half has ~30 characters before Google truncates. A listing page whose subject is
// "University of Central Lancashire" (32 chars) cannot fit, whatever the descriptor. Those
// are trimmed to the shortest useful form and left long on purpose, with the university
// name leading so truncation only ever eats the generic tail.
//
// Usage: node scripts/shorten-page-titles-3.js [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// ---- course-listing variants pass 1 did not cover ----
const LISTING_VARIANTS = [
  { from: ' Courses & Programs 2026 – Fees, IELTS & Intakes', to: ' Courses — Fees & IELTS 2026' },
  { from: ' Courses – All Programs, Fees & IELTS 2026', to: ' Courses — Fees & IELTS 2026' },
];

// ---- one-off pages: authored title -> shorter authored title ----
const ONE_OFFS = [
  ['app/universities/page.tsx',
    'Top 300+ Universities Abroad for Indian Students 2026 – Filter by Fees, Rank & Country',
    'Top 300+ Universities Abroad 2026 — Fees & Rank'],
  ['app/universities-accepting-backlogs/page.tsx',
    'Universities Abroad That Accept Backlogs — Honest Guide for Indian Students 2026',
    'Universities Abroad That Accept Backlogs 2026'],
  ['app/mock-test/page.tsx',
    'Free IELTS Mock Test 2026 – Full Test + Reading, Listening, Writing, Speaking',
    'Free IELTS Mock Test 2026 — All 4 Sections'],
  ['app/course-finder/page.tsx',
    'Advanced Course & University Finder 2026 – Filter by Fees, IELTS, Country',
    'Course & University Finder — Fees & IELTS'],
  ['app/study-abroad-without-ielts/page.tsx',
    'Study Abroad Without Taking IELTS — Honest Guide for Indian Students 2026',
    'Study Abroad Without IELTS — 2026 Guide'],
  ['app/compare/page.tsx',
    'Study Abroad Comparison Tool – Compare Countries, Universities & Courses',
    'Compare Countries, Universities & Courses'],
  ['app/low-cgpa-universities-abroad/page.tsx',
    'Low CGPA? Universities Abroad You Can Still Apply To — Honest Guide 2026',
    'Low CGPA Universities Abroad — 2026 Guide'],
  ['app/cost-of-living/page.tsx',
    'Cost of Living Abroad 2026 for Indian Students | Canada, UK & Australia',
    'Cost of Living Abroad 2026 — Canada, UK & Australia'],
  ['app/study-gap-accepted-universities/page.tsx',
    'Study Abroad With a Study Gap — Honest Guide for Indian Students 2026',
    'Study Abroad With a Study Gap — 2026 Guide'],
  ['app/ielts-mock-test/page.tsx',
    'Free IELTS Mock Test Online – Band Score 1-9 with AI Feedback',
    'Free IELTS Mock Test — Band 1-9 with AI Feedback'],
  ['app/blog/page.tsx',
    'Study Abroad Blog 2026 – Tips, Guides & University Advice',
    'Study Abroad Blog 2026 — Tips & Guides'],
  ['app/book-counselling/page.tsx',
    'Book Free Counselling – Study Abroad Expert Session',
    'Book Free Study Abroad Counselling'],
  ['app/currency-converter/page.tsx',
    'Currency Converter – USD, CAD, GBP, AUD to INR',
    'Currency Converter — USD, GBP, CAD to INR'],
  ['app/visa-guide/page.tsx',
    'Student Visa Guides 2026 for Indian Students',
    'Student Visa Guides 2026'],
];

// ---- data-file metaTitles ----
const DATA_EDITS = [
  ['data/visa-guides.ts', ' Student Visa Guide 2026 for Indians: ', ' Student Visa Guide 2026: '],
  ['data/visa-guides.ts', ' Student Visa 500 Guide 2026 for Indians: ', ' Student Visa 500 Guide 2026: '],
  ['data/visa-guides.ts', 'Study Permit Process & Documents', 'Study Permit & Documents'],
  ['data/visa-guides.ts', 'CAS, IHS, Documents & Process', 'CAS, IHS & Documents'],
  ['data/visa-guides.ts', 'GTE, Documents & Process', 'GTE & Documents'],
  ['data/visa-guides.ts', 'APS, Blocked Account & Process', 'APS & Blocked Account'],
  ['data/visa-guides.ts', 'I-20, DS-160, SEVIS & Interview', 'I-20, DS-160 & SEVIS'],
  ['data/cost-of-living.ts', ' 2026 for Indian Students: ', ' 2026: '],
];

let count = 0;
const misses = [];

// listing variants
{
  const uniDir = path.join(ROOT, 'app', 'universities');
  let touched = 0;
  for (const e of fs.readdirSync(uniDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(uniDir, e.name, 'courses', 'page.tsx');
    if (!fs.existsSync(p)) continue;
    let src = fs.readFileSync(p, 'utf8');
    const before = src;
    for (const v of LISTING_VARIANTS) src = src.split(v.from).join(v.to);
    if (src !== before) {
      touched++;
      if (APPLY) fs.writeFileSync(p, src);
    }
  }
  console.log((APPLY ? 'edited ' : 'would edit ') + touched + ' remaining course-listing pages');
  count += touched;
}

// one-offs
for (const [file, from, to] of ONE_OFFS) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { misses.push(file + ' (missing)'); continue; }
  const src = fs.readFileSync(p, 'utf8');
  if (!src.includes(from)) { misses.push(file + ' (title not found)'); continue; }
  if (APPLY) fs.writeFileSync(p, src.split(from).join(to));
  console.log('  ' + (to.length + 30) + ' chars  ' + file.replace('app/', '/').replace('/page.tsx', ''));
  count++;
}

// data metaTitles
for (const [file, from, to] of DATA_EDITS) {
  const p = path.join(ROOT, file);
  const src = fs.readFileSync(p, 'utf8');
  if (!src.includes(from)) { misses.push(file + ': ' + from.slice(0, 40)); continue; }
  if (APPLY) fs.writeFileSync(p, src.split(from).join(to));
  count++;
}
console.log((APPLY ? 'edited ' : 'would edit ') + 'metaTitles in data/visa-guides.ts + data/cost-of-living.ts');

console.log('\n' + (APPLY ? 'changed ' : 'would change ') + count + ' targets');
if (misses.length) { console.log('not found (' + misses.length + '):'); misses.forEach(m => console.log('  ' + m)); }
if (!APPLY) console.log('\nrun with --apply to write');
