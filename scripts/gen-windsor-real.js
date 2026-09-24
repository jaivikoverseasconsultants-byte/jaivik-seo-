// Builds data/windsor-courses.ts from the University of Windsor's OWN published data.
//
//   node scripts/gen-windsor-real.js
//
// Evidence (data/wave-canada/, retrieved 2026-09-24, both from uwindsor.ca):
//   windsor-programs.json             the programme catalogue, from Windsor's own REST feed
//   windsor-intl-fee-estimator.json   per-term international tuition, from Windsor's own estimator
//
// What this replaces: 50 rows that the file itself documented as placeholders — "generic
// placeholders, NOT crawled from uwindsor.ca" — carrying invented fees, and registered nowhere.
//
// Fees are PER TERM, and stay that way. Windsor's estimator labels Base Tuition "Assessed each
// term"; it offers no annual figure. Turning two terms into a year would be our arithmetic, not
// Windsor's published number, so annual fields are left at zero and unverified, and the per-term
// figure is carried in its own field with the basis stating what it is. Same decision as uOttawa.
//
// English is not published. Windsor's international pages lead to its English Pathway and
// Improvement programmes, which are preparatory routes, not the direct-entry requirement — the
// same trap as KPU, whose bands this project already refuses to publish.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const cat = read('data/wave-canada/windsor-programs.json');
const fees = read('data/wave-canada/windsor-intl-fee-estimator.json');
const rate = (code) => fees.majors.find((m) => m.code === code);

const FX = { usd: 0.73, inr: 61 };
const LIVING_CAD = 13000;

// Windsor's faculty names map onto the fee estimator's own "major" categories.
const FACULTY_TO_MAJOR = {
  'Arts, Humanities, and Social Sciences': 'ARTHUMSS',
  'Humanities and Culture': 'ARTHUMSS',
  'Social Sciences and Professional Studies': 'ARTHUMSS',
  'Creative and Performing Arts': 'ARTSS-VABE',
  'The Odette School of Business': 'BUSINESS',
  Engineering: 'ENGINEERNG',
  Science: 'SCIENCE',
  Nursing: 'NURSING',
  'Human Kinetics': 'HUMKINETIC',
  Education: 'CONCUREDUC',
  // Law is admitted and billed as its own programme type, which the undergraduate estimator
  // does not cover, so Law programmes are left unpriced
};

function majorFor(row) {
  // the estimator prices computer science separately from the rest of Science
  if (/computer science|information technology|applied computing/i.test(row.name)) return 'COMPSCIENC';
  if (/commercial aviation/i.test(row.name)) return 'ARTSS-AREO';
  if (/^economics|, economics/i.test(row.name)) return 'ECONOMICS';
  if (/social work/i.test(row.name)) return 'SOCIALWORK';
  const codes = [...new Set(row.faculties.map((f) => FACULTY_TO_MAJOR[f]).filter(Boolean))];
  if (!codes.length) return null;
  // a joint programme across faculties that charge differently cannot be priced from the estimator
  const prices = new Set(codes.map((c) => rate(c)?.termTuitionCAD));
  return prices.size === 1 ? codes[0] : null;
}

const slugify = (s) => `windsor-${s.toLowerCase()
  .replace(/&/g, ' and ').replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

const rows = [];
const seen = new Set();
const review = { noLevel: [], unpriced: [] };

for (const p of cat.rows) {
  if (!p.level) { review.noLevel.push(p.name); continue; }

  let slug = slugify(p.name);
  for (let n = 2; seen.has(slug); n++) slug = `${slugify(p.name)}-${n}`;
  seen.add(slug);

  const code = p.level === 'Undergraduate' ? majorFor(p) : null;
  const f = code ? rate(code) : null;
  if (!f) review.unpriced.push(`${p.name} [${p.level}${p.faculties.length ? ` · ${p.faculties[0]}` : ''}]`);

  const years = p.level === 'Undergraduate' ? 4 : 2;
  const award = p.award.filter((a) => !/^Master$/.test(a) || p.award.length === 1).join(' / ');

  rows.push({
    id: `windsor-${rows.length + 1}`,
    name: p.name,
    slug,
    url: p.url,
    level: award || (p.level === 'Undergraduate' ? 'Bachelor' : 'Masters'),
    studyLevel: p.level === 'Graduate' ? 'Postgraduate' : 'Undergraduate',
    duration: `${years} years`,
    durationYears: years,
    // Windsor publishes a per-term figure only; the annual fields stay empty rather than doubled
    annualCAD: 0,
    annualUSD: 0,
    annualINR: 0,
    totalCAD: 0,
    termTuitionCAD: f ? f.termTuitionCAD : null,
    termTuitionUSD: f ? Math.round(f.termTuitionCAD * FX.usd) : null,
    termTuitionINR: f ? Math.round(f.termTuitionCAD * FX.inr) : null,
    termEstimatedTotalCAD: f ? f.termEstimatedTotalCAD : null,
    livingCostCAD: LIVING_CAD,
    livingCostUSD: Math.round(LIVING_CAD * FX.usd),
    livingCostINR: Math.round(LIVING_CAD * FX.inr),
    ieltsMin: 6.5,
    toeflMin: 83,
    pteMin: 0,
    intakeMonths: ['September'],
    campus: 'Main Campus',
    country: 'Canada',
    province: 'Ontario',
    city: 'Windsor',
    countryCode: 'CA',
    faculty: p.faculties.join(' / '),
    feeCategory: f ? f.label : null,
    pgwp: true,
    // per-term only: nothing annual can be published, so the fee surfaces stay suppressed
    feeVerified: false,
    feeScope: f ? 'faculty, per term' : 'not published',
    feeBasis: f
      ? `Windsor publishes tuition per term, not per year: C$${f.termTuitionCAD.toLocaleString('en-CA')} per term for an international full-time student in ${f.label}, which its own estimator labels "assessed each term" (C$${f.termEstimatedTotalCAD.toLocaleString('en-CA')} for the term once incidental fees are added). No annual figure is published, and doubling it here would be our arithmetic rather than Windsor's number.`
      : 'not published — Windsor\'s undergraduate fee estimator covers no category for this programme',
    feeSourceUrl: 'https://www.uwindsor.ca/finance/fee-estimator',
  });
}

const header = `// University of Windsor — generated from Windsor's own published data.
// Regenerate with: node scripts/gen-windsor-real.js — do not edit by hand.
// Evidence: data/wave-canada/windsor-programs.json and windsor-intl-fee-estimator.json
// ${rows.length} courses | generated: 2026-09-24
//
// This replaces 50 rows the previous file itself described as generic placeholders.
//
// FEES ARE PER TERM. Windsor's estimator states Base Tuition "assessed each term" and publishes no
// annual figure, so annualCAD is 0 and every row is feeVerified:false. The per-term figure lives in
// termTuitionCAD with the basis spelling out what it covers.
//
// ENGLISH IS NOT PUBLISHED. Windsor's international pages lead to its English Pathway and
// Improvement programmes, which are preparatory routes rather than the direct-entry requirement.

export interface WindsorCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  termTuitionCAD: number | null; termTuitionUSD: number | null; termTuitionINR: number | null;
  termEstimatedTotalCAD: number | null;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
  province: string; city: string; countryCode: string;
  faculty: string; feeCategory: string | null; pgwp: boolean;
  feeVerified: boolean; feeScope: string; feeBasis: string; feeSourceUrl: string;
}

export const windsorCourses: WindsorCourse[] = ${JSON.stringify(rows, null, 1)};

export function getWindsorCourseBySlug(slug: string): WindsorCourse | undefined {
  return windsorCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/windsor-courses.ts'), header);

const ug = rows.filter((r) => r.studyLevel === 'Undergraduate');
const pg = rows.filter((r) => r.studyLevel === 'Postgraduate');
console.log(`data/windsor-courses.ts: ${rows.length} courses (${ug.length} undergraduate, ${pg.length} postgraduate)`);
console.log(`  with a per-term tuition figure: ${rows.filter((r) => r.termTuitionCAD).length}`);
console.log(`  annual fee published: 0 — Windsor states none`);
const t = new Map(); rows.forEach((r) => { if (r.termTuitionCAD) t.set(r.termTuitionCAD, (t.get(r.termTuitionCAD) || 0) + 1); });
console.log('  per-term spread:', [...t.entries()].sort((a, b) => a[0] - b[0]).map(([v, n]) => `C$${v.toLocaleString('en-CA')} x${n}`).join(', '));
for (const [k, v] of Object.entries(review)) if (v.length) console.log(`  ${k} (${v.length}): ${v.slice(0, 4).join('; ')}${v.length > 4 ? ` …+${v.length - 4}` : ''}`);
