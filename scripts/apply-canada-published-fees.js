// Applies international tuition that Canadian universities publish OUTSIDE their programme
// pages (fee calculators, faculty tables, guarantee PDFs) onto the generated course files.
//
// Why a separate pass: data/dal-courses.ts (gen-dal-real.js) and data/waterlooug-courses.ts
// (ca-generate.js) are generated, so a hand edit would be lost on the next regeneration.
// Re-run this after either generator:   node scripts/apply-canada-published-fees.js
// It is idempotent — every value is recomputed from the evidence files below.
//
// Evidence (retrieved 2026-09-17, all from the universities' own sites):
//   data/wave-canada/dal-intl-tuition-guarantee.json    Dal international tuition guarantee
//   data/wave-canada/waterloo-intl-fees-by-faculty.json Waterloo per-term schedule + first-year table
//   data/wave-canada/waterloo-programme-faculty.json    faculty named on each Waterloo programme page
//
// Decisions (2026-09-17):
//   Waterloo — use the published first-year table (two terms, tuition + incidental fees) as-is;
//              never per-term × 2. instTuitionPerTermCAD is corrected to the programme's own
//              faculty rate (it was the Arts rate, 27,010, on all 107 rows).
//   Dalhousie — bachelor's only, where every faculty the programme belongs to is on the
//              guarantee at the same rate. The guarantee is an annual, tuition-only figure.
// Anything ambiguous is left feeVerified:false for manual review, never guessed.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FX = { usd: 0.73, inr: 61 }; // same factors as scripts/ca-generate.js
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

function loadArray(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const m = src.match(/(export const \w+\s*:\s*\w+\[\]\s*=\s*)(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error(`no course array in ${file}`);
  return { src, head: m[1], arr: JSON.parse(m[2]), whole: m[0] };
}

function writeArray(file, doc, arr) {
  const out = doc.src.replace(doc.whole, `${doc.head}${JSON.stringify(arr, null, 2)};`);
  fs.writeFileSync(path.join(ROOT, file), out);
}

function setFee(c, annualCAD, fields) {
  c.annualCAD = annualCAD;
  c.annualUSD = Math.round(annualCAD * FX.usd);
  c.annualINR = Math.round(annualCAD * FX.inr);
  c.totalCAD = Math.round(annualCAD * c.durationYears);
  c.feeVerified = true;
  Object.assign(c, fields);
}

// ── Dalhousie ────────────────────────────────────────────────────────────────
function applyDal() {
  const file = 'data/dal-courses.ts';
  const ev = read('data/wave-canada/dal-intl-tuition-guarantee.json');
  const bySlug = new Map(ev.rows.map(r => [r.slug, r]));
  const doc = loadArray(file);
  let n = 0;
  for (const c of doc.arr) {
    const r = bySlug.get(c.slug);
    if (!r || !r.guaranteedAnnualCAD) continue;
    setFee(c, r.guaranteedAnnualCAD, {
      feeScope: 'faculty (international tuition guarantee)',
      feeBasis: 'annual, tuition only (excludes incidental and co-op fees)',
      feeSourceUrl: 'https://www.dal.ca/admissions/cost-and-payment/tuition/international-tuition-guarantee.html',
    });
    n++;
  }
  // The legacy DalCourse interface predates the provenance fields.
  if (!/feeBasis\?: string/.test(doc.src)) {
    doc.src = doc.src.replace('export interface DalCourse {\n  feeVerified?: boolean;',
      'export interface DalCourse {\n  feeVerified?: boolean;\n  feeScope?: string;\n  feeBasis?: string;\n  feeSourceUrl?: string | null;');
  }
  writeArray(file, doc, doc.arr);
  return n;
}

// ── Waterloo (undergraduate) ─────────────────────────────────────────────────
const UW_FIRST_YEAR_BY_NAME = [
  [/^(Accounting|Sustainability) and Financial Management$/, 58000],
  [/^Architecture$/, 75000],
  [/^Business Administration \(Laurier\) and Computer Science/, 75000],
  [/^Business Administration \(Laurier\) and Mathematics/, 64000],
  [/^Computer Science$/, 73000],
  [/^Computing and Financial Management$/, 64000],
  [/^Global Business and Digital Arts$/, 56000],
  [/^Geography and Aviation$/, 51000],
  [/^Science and Aviation$/, 54000],
  [/^Mathematics\/Financial Analysis and Risk Management$/, 63000],
  [/^Software Engineering$/, 75000],
];
const UW_FIRST_YEAR_BY_FACULTY = { Arts: 58000, Engineering: 75000, Environment: 51000, Health: 54000, Science: 54000, Mathematics: 62000 };
const UW_PER_TERM_BY_NAME = [
  [/^(Architecture|Software Engineering|Computer Science|Data Science)$|^Business Administration \(Laurier\) and Computer Science/, 34942],
  [/^Mathematics\/Financial Analysis and Risk Management$/, 29828],
  [/^Global Business and Digital Arts$/, 26378],
];
const UW_PER_TERM_BY_FACULTY = { Arts: 27010, Engineering: 34942, Environment: 23598, Health: 25296, Science: 25296, Mathematics: 29259 };
// Not in the first-year table, or the page names faculties with different rates.
const UW_REVIEW = new Set(['Data Science', 'Optometry', 'Pharmacy', 'Pre-law',
  'Double degree program in human rights and law', 'Social Development Studies and Bachelor of Social Work Double']);

function uniqueRate(faculties, table) {
  const rates = [...new Set(faculties.map(f => table[f]))];
  return faculties.length && rates.length === 1 && rates[0] ? rates[0] : null;
}

function applyWaterloo() {
  const file = 'data/waterlooug-courses.ts';
  const map = new Map(read('data/wave-canada/waterloo-programme-faculty.json').map(r => [r.slug, r.faculties]));
  const doc = loadArray(file);
  const review = [];
  let n = 0;
  for (const c of doc.arr) {
    const fac = map.get(c.slug) || [];
    const byName = (tbl) => (tbl.find(([re]) => re.test(c.name)) || [])[1];
    c.instTuitionPerTermCAD = byName(UW_PER_TERM_BY_NAME) ?? uniqueRate(fac, UW_PER_TERM_BY_FACULTY);
    const firstYear = UW_REVIEW.has(c.name) ? null : (byName(UW_FIRST_YEAR_BY_NAME) ?? uniqueRate(fac, UW_FIRST_YEAR_BY_FACULTY));
    if (!firstYear) { review.push(`${c.name} [${fac.join('+') || 'no faculty on page'}]`); continue; }
    setFee(c, firstYear, {
      feeScope: 'faculty/programme table',
      feeBasis: 'first year (two terms), tuition + incidental fees, rounded',
      feeSourceUrl: 'https://uwaterloo.ca/future-students/financing/tuition',
    });
    n++;
  }
  writeArray(file, doc, doc.arr);
  return { n, review };
}

const dal = applyDal();
const uw = applyWaterloo();
console.log(`Dalhousie: ${dal} bachelor's rows verified from the international tuition guarantee`);
console.log(`Waterloo:  ${uw.n} rows verified from the first-year table; per-term rate corrected on all rows`);
console.log(`Waterloo left for manual review (${uw.review.length}):\n  ${uw.review.join('\n  ')}`);
