// Builds data/ucl-courses.ts from UCL's OWN published data.
//
//   node scripts/gen-ucl-real.js
//
// Evidence (data/wave-uk/, retrieved 2026-09-23, both from ucl.ac.uk):
//   ucl-undergraduate.json   the undergraduate catalogue: fee, duration and English level per course
//   ucl-english-levels.json  what each of UCL's five English levels requires
//
// What this adds: the site held 400 UCL rows, every one postgraduate and every one unpriced — their
// fees were house figures (£28,000 on 269 of them) that UCL does not publish. This adds the
// undergraduate catalogue, which was missing entirely, priced from each programme's own page.
//
// Getting it needed a browser: UCL is behind a Cloudflare challenge that command-line clients
// cannot pass. The catalogue was read in a real browser session and each page fetched from inside
// that page, where the clearance cookie applies.
//
// English: UCL states no institution-wide score. It defines five levels and each programme page
// names its level, so IELTS and PTE are per-programme. TOEFL is left out entirely — UCL now states
// it only on the new 4.5-5.5 scale, which our 0-120 toeflMin field cannot represent.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const catalogue = read('data/wave-uk/ucl-undergraduate.json');
const english = read('data/wave-uk/ucl-english-levels.json');

const FX = { usd: 1.27, inr: 105.7 }; // GBP, as lib/currency.ts uses
const LIVING_GBP = 13500;

const GENERATED_ID = /^ucl-ug-/;
const existingSrc = fs.readFileSync(path.join(ROOT, 'data/ucl-courses.ts'), 'utf8');
const existingMatch = existingSrc.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*(\[[\s\S]*?\n\]);/);
// drop anything a previous run of this script added, so re-running rebuilds rather than appends
const existing = (existingMatch ? eval(`(${existingMatch[1]})`) : []) // eslint-disable-line no-eval
  .filter((c) => !GENERATED_ID.test(c.id || ''));

const rows = [];
const seen = new Set(existing.map((c) => c.slug));
const review = { noFee: [], noLevel: [], noDuration: [] };

for (const c of catalogue.rows) {
  // UCL's own slug already identifies the programme and its award; keep it, prefixed for our routes
  let slug = `ucl-${c.slug.replace(/-2026$/, '')}`;
  for (let n = 2; seen.has(slug); n++) slug = `ucl-${c.slug.replace(/-2026$/, '')}-${n}`;
  seen.add(slug);

  if (!c.feeGBP) review.noFee.push(c.title);
  if (!c.englishLevel) review.noLevel.push(c.title);
  if (!c.durationYears) review.noDuration.push(c.title);

  const years = c.durationYears || (/MSci|MEng|MPharm/.test(c.title) ? 4 : 3);
  const lvl = c.englishLevel ? english.levels[String(c.englishLevel)] : null;
  const fee = c.feeGBP || 0;

  rows.push({
    id: `ucl-ug-${rows.length + 1}`,
    name: c.title,
    slug,
    url: `https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/${c.slug}`,
    level: (c.title.match(/\b(BA|BSc|BEng|MEng|MSci|LLB|BASc|BFA|MPharm|MBBS)\b[^,]*$/) || [])[1] || 'Bachelor',
    studyLevel: 'Undergraduate',
    duration: `${years} year${years > 1 ? 's' : ''}`,
    durationYears: years,
    annualGBP: fee,
    annualUSD: Math.round(fee * FX.usd),
    annualINR: Math.round(fee * FX.inr),
    totalGBP: Math.round(fee * years),
    livingCostGBP: LIVING_GBP,
    livingCostUSD: Math.round(LIVING_GBP * FX.usd),
    livingCostINR: Math.round(LIVING_GBP * FX.inr),
    // the row fields carry UCL's figures where it states them; the switch below decides what shows
    ieltsMin: lvl ? lvl.ielts : 6.5,
    toeflMin: 0,
    pteMin: lvl ? lvl.pte : 0,
    intakeMonths: ['September'],
    campus: 'Bloomsbury',
    country: 'UK',
    state: 'England',
    city: 'London',
    countryCode: 'GB',
    englishLevelUCL: c.englishLevel || null,
    feeVerified: Boolean(c.feeGBP),
    feeScope: 'programme',
    feeBasis: c.feeGBP
      ? 'overseas tuition fee for 2026-27, as stated on the programme page'
      : 'not published — UCL states no overseas fee on this programme page',
    feeSourceUrl: `https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/${c.slug}`,
    englishVerified: lvl
      ? {
        ielts: lvl.ielts,
        pte: lvl.pte,
        sourceUrl: 'https://www.ucl.ac.uk/prospective-students/undergraduate/how-apply/english-language-requirements',
        verifiedOn: '2026-09-23',
      }
      // no level on the page means no score can be attached to this programme
      : { sourceUrl: 'https://www.ucl.ac.uk/prospective-students/undergraduate/how-apply/english-language-requirements', verifiedOn: '2026-09-23' },
    englishScope: 'programme',
  });
}

const all = [...existing, ...rows];
const header = `// University College London — postgraduate rows as previously held, plus the undergraduate
// catalogue generated from UCL's own published data.
// Regenerate the undergraduate rows with: node scripts/gen-ucl-real.js
// Evidence: data/wave-uk/ucl-undergraduate.json and ucl-english-levels.json
// ${all.length} courses (${existing.length} postgraduate, ${rows.length} undergraduate) | generated: 2026-09-23
//
// Undergraduate fees are the "Overseas tuition fees (2026/27)" figure from each programme's own
// page. The postgraduate rows keep feeVerified:false — their fees are house figures UCL does not
// publish. TOEFL is 0 throughout: UCL now states TOEFL only on the new 4.5-5.5 scale.

export interface UclCourse {
  id?: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD?: number; livingCostINR?: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
  state?: string; city?: string; countryCode?: string;
  englishLevelUCL?: number | null;
  feeVerified?: boolean; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  englishVerified?: { ielts?: number; toefl?: number; pte?: number; sourceUrl: string; verifiedOn: string };
  englishScope?: string;
}

export const uclCourses: UclCourse[] = ${JSON.stringify(all, null, 1)};

export function getUclCourseBySlug(slug: string): UclCourse | undefined {
  return uclCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/ucl-courses.ts'), header);

console.log(`data/ucl-courses.ts: ${all.length} courses`);
console.log(`  kept from before (postgraduate, unpriced): ${existing.length}`);
console.log(`  added (undergraduate): ${rows.length}`);
console.log(`  priced from UCL's own programme pages: ${rows.filter((r) => r.feeVerified).length}`);
console.log(`  English published (IELTS + PTE by UCL level): ${rows.filter((r) => r.englishVerified && r.englishVerified.ielts).length}`);
const feeT = new Map(); rows.forEach((r) => { if (r.feeVerified) feeT.set(r.annualGBP, (feeT.get(r.annualGBP) || 0) + 1); });
console.log('  fee spread:', [...feeT.entries()].sort((a, b) => b[1] - a[1]).map(([f, n]) => `£${f.toLocaleString()} x${n}`).join(', '));
for (const [k, v] of Object.entries(review)) if (v.length) console.log(`  ${k} (${v.length}): ${v.slice(0, 4).join(', ')}${v.length > 4 ? ` …+${v.length - 4}` : ''}`);
