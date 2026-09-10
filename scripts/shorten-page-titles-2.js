// Second title pass: the remaining templates, the pillar generators, and a brand-suffix bug.
//
// Pass 1 (scripts/shorten-page-titles.js) handled the two templates behind ~99% of pages.
// This one covers the rest of the multi-page templates plus a real bug it surfaced:
// 8 pages hand-write "| Jaivik Overseas" into their own title AND route through
// buildMetadata(), which appends "| Jaivik Overseas Consultants" — so they shipped with
// the brand twice, e.g.
//     "Free IELTS Mock Test 2026 – … | Jaivik Overseas | Jaivik Overseas Consultants"
// The fix removes the hand-written half; the buildMetadata suffix is the canonical one.
//
// Same ordering principle as pass 1: the distinguishing term stays at the front, the
// generic tail is what gets cut.
//
// Usage: node scripts/shorten-page-titles-2.js [--apply]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const EDITS = [
  // ---- multi-page templates ----
  {
    file: 'app/compare/[slug]/page.tsx',
    label: 'compare (10 pages)',
    from: '${nameA} vs ${nameB} — Fees, Courses & PSW Compared for Indian Students',
    to: '${nameA} vs ${nameB} — Fees, Courses & PSW',
  },
  {
    file: 'app/universities/country/[country]/page.tsx',
    label: 'country hub (17 pages)',
    from: 'Study in ${country} from India – Top Universities, Fees & Visa 2026',
    to: 'Study in ${country} — Fees, Universities & Visa 2026',
  },
  {
    file: 'app/courses/category/[category]/page.tsx',
    label: 'course category (6 pages)',
    from: '${category} Courses Abroad – Fees, Eligibility & Jobs 2026',
    to: '${category} Courses Abroad — Fees & Eligibility 2026',
  },
  {
    file: 'app/courses-with-psw/[country]/page.tsx',
    label: 'PSW hub (6 pages)',
    from: '${COUNTRY_HEADLINE[data.country]} — Full List with Fees in INR',
    to: '${COUNTRY_HEADLINE[data.country]} — Fees in INR',
  },
  {
    file: 'app/mock-test/[level]/[section]/page.tsx',
    label: 'mock test (15 pages)',
    from: 'IELTS ${sectionLabel} Mock Test – ${levelLabel} | Free Practice',
    to: 'IELTS ${sectionLabel} Mock Test – ${LEVEL_SHORT[level] || level}',
  },

  // ---- pillar generators ----
  {
    file: 'lib/subject-pillars.ts',
    label: 'subject pillars',
    from: '${config.name} Abroad for Indian Students — Fees in INR, IELTS & Top Universities 2026',
    to: '${config.name} Abroad — Fees in INR, IELTS & Universities',
  },
  {
    file: 'lib/cost-pillars.ts',
    label: 'cost pillars',
    from: 'Cost of Studying in ${config.displayName} for Indian Students — Tuition + Living Costs in INR 2026',
    to: 'Cost of Studying in ${config.displayName} — Tuition + Living in INR 2026',
  },
];

// ---- the doubled brand suffix ----
const DOUBLED_BRAND = [
  'app/blog/page.tsx',
  'app/course-finder/page.tsx',
  'app/currency-converter/page.tsx',
  'app/dashboard/page.tsx',
  'app/mock-test/page.tsx',
  'app/student-portal/dashboard/page.tsx',
  'app/student-portal/page.tsx',
  'app/visa-guide/page.tsx',
];

let changed = 0, skipped = [];

for (const e of EDITS) {
  const p = path.join(ROOT, e.file);
  if (!fs.existsSync(p)) { skipped.push(e.file + ' (missing)'); continue; }
  const src = fs.readFileSync(p, 'utf8');
  if (!src.includes(e.from)) { skipped.push(e.file + ' (pattern not found)'); continue; }
  const out = src.split(e.from).join(e.to);
  console.log((APPLY ? 'edit  ' : 'would ') + e.label.padEnd(26) + e.file);
  if (APPLY) fs.writeFileSync(p, out);
  changed++;
}

for (const f of DOUBLED_BRAND) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { skipped.push(f + ' (missing)'); continue; }
  const src = fs.readFileSync(p, 'utf8');
  // Only strip inside the title line, never elsewhere in the file.
  const out = src.replace(/(title:\s*['`][^'`]*?)\s*\|\s*Jaivik Overseas(['`])/, '$1$2');
  if (out === src) { skipped.push(f + ' (no doubled brand found)'); continue; }
  console.log((APPLY ? 'edit  ' : 'would ') + 'de-duplicate brand'.padEnd(26) + f);
  if (APPLY) fs.writeFileSync(p, out);
  changed++;
}

console.log('\n' + (APPLY ? 'changed ' : 'would change ') + changed + ' files');
if (skipped.length) {
  console.log('skipped ' + skipped.length + ':');
  skipped.forEach(s => console.log('  ' + s));
}
if (!APPLY) console.log('\nrun with --apply to write');
