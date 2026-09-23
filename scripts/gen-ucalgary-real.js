// Builds data/ucalgary-courses.ts from the University of Calgary's OWN published data.
//
//   node scripts/gen-ucalgary-real.js
//
// Evidence (data/wave-canada/, retrieved 2026-09-22, both from ucalgary.ca):
//   ucalgary-programmes.json            the undergraduate catalogue, with each degree and faculty
//   ucalgary-intl-cost-estimator.json   UCalgary's own international cost estimator, per faculty
//
// What this replaces: 97 rows that were all postgraduate and all carried the same C$25,000 —
// a single fabricated figure repeated on every row, suppressed but still the only fee we held.
// The postgraduate rows are kept as they were; this adds the undergraduate catalogue, which the
// site did not have at all, and prices it from the university's own estimator.
//
// Fees: UCalgary prices undergraduate tuition by FACULTY, not by programme, and its estimator
// states a figure for a full-time course load over two terms. Haskayne and Schulich charge more in
// upper years, so the multi-year total is first year + upper years rather than annual x duration.
//
// English is deliberately absent: UCalgary serves its proficiency requirements from a filtered
// Drupal view that no server-rendered response exposes, so the stored 6.5/86/58 is a house default.
// data/wave-canada/institution-english.json records it as unresolved and the switch suppresses it.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const programmes = read('data/wave-canada/ucalgary-programmes.json');
const estimator = read('data/wave-canada/ucalgary-intl-cost-estimator.json');

const FX = { usd: 0.73, inr: 61 };
const LIVING_CAD = 13000;

// how long each award runs, from UCalgary's own programme structure
const YEARS = [
  [/Bachelor of Science in Engineering/i, 4],
  [/Juris Doctor/i, 3],
  [/Doctor of Medicine/i, 3],
  [/Doctor of Veterinary Medicine/i, 4],
  [/Master of/i, 2],
  [/Bachelor of/i, 4],
];
const yearsFor = (degree) => (YEARS.find(([re]) => re.test(degree || '')) || [null, 4])[1];

const rate = (faculty, year) => estimator.rows.find((r) => r.faculty === faculty && r.year === year);

const slugify = (s) => `calgary-${s.toLowerCase()
  .replace(/&/g, ' and ').replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

// Keep the rows that were already here (they are postgraduate) and add the undergraduate catalogue
// beside them. Rows this script generated are dropped first and rebuilt — without that, a second
// run reads its own output as "existing" and appends the whole catalogue again.
const GENERATED_ID = /^calgary-ug-/;
const existingSrc = fs.readFileSync(path.join(ROOT, 'data/ucalgary-courses.ts'), 'utf8');
const existingMatch = existingSrc.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*(\[[\s\S]*?\n\]);/);
const existing = (existingMatch ? eval(`(${existingMatch[1]})`) : []) // eslint-disable-line no-eval
  .filter((c) => !GENERATED_ID.test(c.id || ''));

const rows = [];
const seen = new Set(existing.map((c) => c.slug));
const review = { noDegree: [], noRate: [], implausible: [] };

for (const p of programmes.rows) {
  if (!p.degree || !p.studyLevel) { review.noDegree.push(p.name); continue; }

  let slug = slugify(p.name);
  for (let n = 2; seen.has(slug); n++) slug = `${slugify(p.name)}-${n}`;
  seen.add(slug);

  let first = rate(p.faculty, 'first');
  const upper = rate(p.faculty, 'upper');
  if (!first) review.noRate.push(`${p.name} (${p.faculty})`);

  // The estimator returns C$14,901 for Veterinary Medicine — below the rate every ordinary bachelor's
  // degree pays, for a four-year professional doctorate. Whatever that figure represents, it is not
  // a year of DVM tuition, so it is not published. Anything under the baseline faculty rate is held
  // back the same way rather than trusted because a form returned it.
  const baseline = rate('Faculty of Arts', 'first');
  if (first && baseline && first.tuitionCAD < baseline.tuitionCAD) {
    review.implausible.push(`${p.name} (${p.faculty}) — estimator gave C$${first.tuitionCAD.toLocaleString('en-CA')}, below the C$${baseline.tuitionCAD.toLocaleString('en-CA')} baseline`);
    first = null;
  }

  const years = yearsFor(p.degree);
  const annualCAD = first ? first.tuitionCAD : 0;
  // charge the upper-year rate for the years after the first, which is what a student actually pays
  const totalCAD = first && upper ? Math.round(first.tuitionCAD + upper.tuitionCAD * (years - 1)) : 0;

  rows.push({
    id: `calgary-ug-${rows.length + 1}`,
    name: p.name,
    slug,
    url: p.url,
    level: p.degree,
    studyLevel: p.studyLevel,
    duration: `${years} years`,
    durationYears: years,
    annualCAD,
    annualUSD: Math.round(annualCAD * FX.usd),
    annualINR: Math.round(annualCAD * FX.inr),
    totalCAD,
    livingCostCAD: LIVING_CAD,
    livingCostUSD: Math.round(LIVING_CAD * FX.usd),
    livingCostINR: Math.round(LIVING_CAD * FX.inr),
    ieltsMin: 6.5,
    toeflMin: 86,
    pteMin: 58,
    intakeMonths: ['September'],
    campus: 'Main Campus',
    country: 'Canada',
    province: 'Alberta',
    city: 'Calgary',
    countryCode: 'CA',
    faculty: p.faculty,
    pgwp: true,
    feeVerified: Boolean(first),
    feeScope: 'faculty',
    feeBasis: first
      ? `annual international tuition for a full-time course load over two terms, 2026-27, ${p.faculty} — UCalgary prices undergraduate tuition by faculty, not by programme; general fees of C$${first.generalFeesCAD.toLocaleString('en-CA')} are charged on top${upper && upper.tuitionCAD !== first.tuitionCAD ? `, and the rate rises to C$${upper.tuitionCAD.toLocaleString('en-CA')} after first year` : ''}`
      : 'not published — UCalgary prices undergraduate tuition by faculty, and its own estimator returns no usable figure for this one',
    feeSourceUrl: first ? 'https://www.ucalgary.ca/registrar/finances/understanding-your-fees/undergraduate-student-cost-estimator' : null,
    generalFeesCAD: first ? first.generalFeesCAD : null,
  });
}

const all = [...existing, ...rows];
const header = `// University of Calgary — postgraduate rows as previously held, plus the undergraduate
// catalogue generated from UCalgary's own published data.
// Regenerate the undergraduate rows with: node scripts/gen-ucalgary-real.js
// Evidence: data/wave-canada/ucalgary-programmes.json and ucalgary-intl-cost-estimator.json
// ${all.length} courses (${existing.length} postgraduate, ${rows.length} undergraduate) | generated: 2026-09-22
//
// Undergraduate fees are UCalgary's own estimator output for an international student: tuition for
// a full-time course load over two terms, by faculty. The postgraduate rows keep feeVerified:false
// — they all carry the same C$25,000, which UCalgary does not publish anywhere.

export interface UcalgaryCourse {
  id?: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
  province?: string; city?: string; countryCode?: string; faculty?: string; pgwp?: boolean;
  annualCAD: number; annualINR: number; annualUSD: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD?: number; livingCostINR?: number;
  feeVerified?: boolean; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  generalFeesCAD?: number | null;
}

export const ucalgaryCourses: UcalgaryCourse[] = ${JSON.stringify(all, null, 1)};

export function getUcalgaryCoursesBySlug(slug: string): UcalgaryCourse | undefined {
  return ucalgaryCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/ucalgary-courses.ts'), header);

const ug = rows.filter((r) => r.studyLevel === 'Undergraduate');
const pg = rows.filter((r) => r.studyLevel === 'Postgraduate');
console.log(`data/ucalgary-courses.ts: ${all.length} courses`);
console.log(`  kept from before (postgraduate, unpriced): ${existing.length}`);
console.log(`  added: ${rows.length} (${ug.length} undergraduate, ${pg.length} graduate/professional listed in the undergraduate index)`);
console.log(`  priced from UCalgary's own estimator: ${rows.filter((r) => r.feeVerified).length}`);
const byFac = new Map();
rows.forEach((r) => byFac.set(r.faculty, (byFac.get(r.faculty) || 0) + 1));
console.log('  by faculty:', [...byFac.entries()].sort((a, b) => b[1] - a[1]).map(([f, n]) => `${f.replace(/^(Faculty|School) of /, '')} ${n}`).join(', '));
for (const [k, v] of Object.entries(review)) if (v.length) console.log(`  ${k} (${v.length}): ${v.join(', ')}`);
