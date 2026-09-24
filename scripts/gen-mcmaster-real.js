// Builds the undergraduate rows in data/mcmaster-courses.ts from McMaster's OWN published data.
//
//   node scripts/gen-mcmaster-real.js
//
// Evidence (data/wave-canada/mcmaster-undergraduate.json, retrieved 2026-09-24, from mcmaster.ca):
//   the entry-programme catalogue, and McMaster's own Cost Estimator answers for an international
//   visa student on a full-time load.
//
// What this adds: the site held 86 McMaster rows, all postgraduate and all unpriced, carrying both
// an annualGBP of 12,819 and an annualCAD of 22,000 — a converted pair of house figures on a
// Canadian university. This adds the undergraduate entry programmes, priced from the estimator.
//
// McMaster admits to a Level I entry programme, not to a named major, so 20 programmes is the whole
// undergraduate catalogue as McMaster presents it — not a thin crawl.
//
// English comes from McMaster's own proficiency page and corrects two of the three stored scores.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const ev = read('data/wave-canada/mcmaster-undergraduate.json');

const FX = { usd: 0.73, inr: 61 };
const LIVING_CAD = 14000;

// McMaster's own English requirements for direct-entry undergraduate admission.
const ENGLISH = {
  ielts: 6.5,
  toefl: 86,
  pte: 60,
  sourceUrl: 'https://future.mcmaster.ca/apply/requirements/english-proficiency/',
  verifiedOn: '2026-09-24',
};

// Estimator entry -> programme page. The two lists name the same programmes slightly differently,
// and the three Bachelor of Technology streams share one page and one fee.
const norm = (s) => (s || '').toLowerCase().replace(/&/g, 'and').replace(/\(.*?\)/g, ' ')
  .replace(/\b(i|honours|program|programme|gateway)\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();

// the two lists use different names for the same programme in one case
const ALIAS = { iarts: 'bachelor of fine arts' };

const costFor = (name) => {
  const target = ALIAS[norm(name)] ?? norm(name);
  const hits = ev.estimatorCosts.filter((c) => {
    const n = norm(c.name);
    return n === target || n.startsWith(`${target} `) || target.startsWith(`${n} `);
  });
  if (!hits.length) return null;
  const prices = [...new Set(hits.map((h) => h.tuitionCAD))];
  // the Bachelor of Technology streams all price the same; anything that does not agree is ambiguous
  return prices.length === 1 ? { tuitionCAD: prices[0], from: hits.map((h) => h.name) } : null;
};

const GENERATED_ID = /^mcmaster-ug-/;
const src = fs.readFileSync(path.join(ROOT, 'data/mcmaster-courses.ts'), 'utf8');
const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*(\[[\s\S]*?\n\]);/);
const existing = (m ? eval(`(${m[1]})`) : []) // eslint-disable-line no-eval
  .filter((c) => !GENERATED_ID.test(c.id || ''));

const rows = [];
const seen = new Set(existing.map((c) => c.slug));
const review = { unpriced: [] };

for (const p of ev.programmes) {
  let slug = `mcmaster-${p.slug}`;
  for (let n = 2; seen.has(slug); n++) slug = `mcmaster-${p.slug}-${n}`;
  seen.add(slug);

  const cost = costFor(p.name);
  if (!cost) review.unpriced.push(p.name);
  const fee = cost ? cost.tuitionCAD : 0;
  const years = 4;

  rows.push({
    id: `mcmaster-ug-${rows.length + 1}`,
    name: p.name,
    slug,
    url: p.url,
    level: 'Bachelor',
    studyLevel: 'Undergraduate',
    duration: `${years} years`,
    durationYears: years,
    annualCAD: fee,
    annualUSD: Math.round(fee * FX.usd),
    annualINR: Math.round(fee * FX.inr),
    totalCAD: Math.round(fee * years),
    livingCostCAD: LIVING_CAD,
    livingCostUSD: Math.round(LIVING_CAD * FX.usd),
    livingCostINR: Math.round(LIVING_CAD * FX.inr),
    ieltsMin: ENGLISH.ielts,
    toeflMin: ENGLISH.toefl,
    pteMin: ENGLISH.pte,
    intakeMonths: ['September'],
    campus: 'Main Campus',
    country: 'Canada',
    province: 'Ontario',
    city: 'Hamilton',
    countryCode: 'CA',
    pgwp: true,
    feeVerified: Boolean(cost),
    feeScope: 'programme',
    feeBasis: cost
      ? 'estimated annual tuition for an international visa student on a full-time load, from McMaster\'s own cost estimator — tuition only; residence, meal plan and supplementary fees are separate'
      : 'not published — McMaster\'s own cost estimator returns no figure for this programme',
    feeSourceUrl: 'https://future.mcmaster.ca/finances/cost-estimator/',
    englishVerified: ENGLISH,
    englishScope: 'institution-wide',
  });
}

const all = [...existing, ...rows];
const header = `// McMaster University — postgraduate rows as previously held, plus the undergraduate entry
// programmes generated from McMaster's own published data.
// Regenerate the undergraduate rows with: node scripts/gen-mcmaster-real.js
// Evidence: data/wave-canada/mcmaster-undergraduate.json
// ${all.length} courses (${existing.length} postgraduate, ${rows.length} undergraduate) | generated: 2026-09-24
//
// Undergraduate fees are McMaster's own cost-estimator figure for an international visa student,
// full-time — tuition only, and McMaster calls it an estimate. The postgraduate rows keep
// feeVerified:false; they carry house figures in two currencies at once.

export interface McmasterCourse {
  id?: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
  province?: string; state?: string; city?: string; countryCode?: string; pgwp?: boolean;
  annualGBP?: number; totalGBP?: number; livingCostGBP?: number;
  annualCAD: number; annualUSD?: number; annualINR?: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD?: number; livingCostINR?: number;
  feeVerified?: boolean; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  englishVerified?: { ielts?: number; toefl?: number; pte?: number; sourceUrl: string; verifiedOn: string };
  englishScope?: string;
}

export const mcmasterCourses: McmasterCourse[] = ${JSON.stringify(all, null, 1)};

export function getMcmasterCoursesBySlug(slug: string): McmasterCourse | undefined {
  return mcmasterCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/mcmaster-courses.ts'), header);

console.log(`data/mcmaster-courses.ts: ${all.length} courses`);
console.log(`  kept from before (postgraduate, unpriced): ${existing.length}`);
console.log(`  added (undergraduate entry programmes): ${rows.length}`);
console.log(`  priced from McMaster's own estimator: ${rows.filter((r) => r.feeVerified).length}`);
const t = new Map(); rows.forEach((r) => { if (r.feeVerified) t.set(r.annualCAD, (t.get(r.annualCAD) || 0) + 1); });
console.log('  fees:', [...t.entries()].sort((a, b) => a[0] - b[0]).map(([f, n]) => `C$${f.toLocaleString('en-CA')}${n > 1 ? ` x${n}` : ''}`).join(', '));
if (review.unpriced.length) console.log(`  unpriced (${review.unpriced.length}): ${review.unpriced.join(', ')}`);
