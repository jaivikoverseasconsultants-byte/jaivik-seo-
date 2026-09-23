// Builds the undergraduate rows in data/uoft-courses.ts from the University of Toronto's OWN data.
//
//   node scripts/gen-uoft-real.js
//
// Evidence (data/wave-canada/, retrieved 2026-09-23, both from utoronto.ca):
//   uoft-undergraduate-programs.json  the feed behind U of T's own programme finder
//   uoft-intl-fee-schedules.json      the per-faculty international fee schedules (PDF)
//
// What this adds: the site held 248 U of T rows, all postgraduate, all carrying the same fabricated
// 15,150 — and in annualGBP, on a Canadian university. This adds the undergraduate catalogue and
// prices it from U of T's own faculty fee schedules, in CAD.
//
// Two things the fee schedules force on us:
//   - U of T prices by FACULTY, not by programme of study. A Specialist in Physics and one in
//     History are both Arts & Science and both pay the Arts & Science programme fee.
//   - UTM and UTSC cannot be priced from their own PDFs. UTM's lists two full-time rates and labels
//     every row for the cohort admitted in 2023 or earlier; UTSC bills per credit and states no
//     annual figure. Programmes offered ONLY on those campuses are left unverified rather than
//     given a rate that may not be theirs. A programme also offered at St. George is priced at the
//     St. George rate, which is the offering being described.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const listing = read('data/wave-canada/uoft-undergraduate-programs.json');
const schedules = read('data/wave-canada/uoft-intl-fee-schedules.json');
const rate = (key) => schedules.faculties.find((f) => f.key === key);

const FX = { usd: 0.73, inr: 61 };
const LIVING_CAD = 15000;

// Which faculty's schedule a programme is billed under, from the degree it leads to.
// The degree field is U of T's own, e.g. "HBA", "HBSc", "BASc", "MusBac", "BBA, BCom".
function facultyFor(degree, campus) {
  const d = (degree || '').toUpperCase();
  const onStGeorge = /UTSG/.test(campus || '');
  if (/BASC/.test(d)) return 'APSC';           // Applied Science & Engineering
  if (/MUSBAC/.test(d)) return 'MUSIC';
  if (/BKIN/.test(d)) return 'FPEH';
  if (/BSCN/.test(d)) return 'NURS';
  // everything else is an Arts & Science degree, which only has a usable rate at St. George
  if (/HBA|HBSC|BCOM|BCS/.test(d) && onStGeorge) return 'ARTSC';
  return null;
}

const slugify = (s) => `uoft-${s.toLowerCase()
  .replace(/&/g, ' and ').replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;

const GENERATED_ID = /^uoft-ug-/;
const existingSrc = fs.readFileSync(path.join(ROOT, 'data/uoft-courses.ts'), 'utf8');
const existingMatch = existingSrc.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*(\[[\s\S]*?\n\]);/);
const existingRaw = (existingMatch ? eval(`(${existingMatch[1]})`) : []) // eslint-disable-line no-eval
  .filter((c) => !GENERATED_ID.test(c.id || ''));

// The postgraduate rows carry zero-width characters inside their names ("Master of Teaching" three
// times, differing only by an invisible U+200B), which slugified to the same value — eight slugs
// had two or three rows competing for one URL. Strip the invisible characters and keep the first
// row of each slug; no URL disappears, since the surviving row answers to it.
const dropped = [];
const bySlug = new Map();
for (const c of existingRaw) {
  const name = String(c.name || '').replace(/[​-‍﻿]/g, '').replace(/\s+/g, ' ').trim();
  if (bySlug.has(c.slug)) { dropped.push(`${c.slug} — "${name}"`); continue; }
  bySlug.set(c.slug, { ...c, name });
}
const existing = [...bySlug.values()];

// one page per programme: the finder repeats a programme for each type and campus combination
const byPage = new Map();
for (const r of listing.rows) {
  const cur = byPage.get(r.alias);
  if (!cur) { byPage.set(r.alias, { ...r, types: new Set([r.type]) }); continue; }
  cur.types.add(r.type);
  if (!cur.campus.includes(r.campus)) cur.campus = [...new Set((`${cur.campus}, ${r.campus}`).split(/,\s*/))].join(', ');
  if (r.degree && !cur.degree.includes(r.degree)) cur.degree = `${cur.degree}, ${r.degree}`;
}

const rows = [];
const seen = new Set(existing.map((c) => c.slug));
const review = { minorOnly: [], unpricedCampus: [], unpricedDegree: [] };

for (const p of byPage.values()) {
  const types = [...p.types].join(', ');
  // a Minor is a component of someone else's degree, not a programme to apply to
  if (!/Specialist|Major/.test(types)) { review.minorOnly.push(p.item); continue; }

  let slug = slugify(p.item);
  for (let n = 2; seen.has(slug); n++) slug = `${slugify(p.item)}-${n}`;
  seen.add(slug);

  const key = facultyFor(p.degree, p.campus);
  const f = key ? rate(key) : null;
  if (!f) {
    if (/UTM|UTSC/.test(p.campus || '') && !/UTSG/.test(p.campus || '')) review.unpricedCampus.push(`${p.item} (${p.campus})`);
    else review.unpricedDegree.push(`${p.item} (${p.degree})`);
  }

  const years = 4; // U of T's honours bachelor's degrees run four years
  const annualCAD = f ? f.programFeeCAD : 0;

  rows.push({
    id: `uoft-ug-${rows.length + 1}`,
    name: p.item,
    slug,
    url: `https://future.utoronto.ca${p.alias}`,
    level: p.degree || 'Bachelor',
    studyLevel: 'Undergraduate',
    duration: `${years} years`,
    durationYears: years,
    annualCAD,
    annualUSD: Math.round(annualCAD * FX.usd),
    annualINR: Math.round(annualCAD * FX.inr),
    totalCAD: Math.round(annualCAD * years),
    livingCostCAD: LIVING_CAD,
    livingCostUSD: Math.round(LIVING_CAD * FX.usd),
    livingCostINR: Math.round(LIVING_CAD * FX.inr),
    ieltsMin: 6.5,
    toeflMin: 100,
    pteMin: 0,
    intakeMonths: ['September'],
    campus: p.campus,
    country: 'Canada',
    province: 'Ontario',
    city: 'Toronto',
    countryCode: 'CA',
    studyArea: p.study,
    programTypes: types,
    faculty: f ? f.name : null,
    pgwp: true,
    feeVerified: Boolean(f),
    feeScope: 'faculty',
    feeBasis: f
      ? `full-time international programme fee for the Fall-Winter session, 2025-26, ${f.name} — U of T prices by faculty, not by programme of study; mandatory incidental fees of C$${f.incidentalsCAD.toLocaleString('en-CA')} and UHIP of C$${f.uhipCAD} are charged on top, for C$${f.totalCAD.toLocaleString('en-CA')} in total`
      : 'not published — U of T states no annual programme fee for this campus in its own schedule',
    feeSourceUrl: 'https://studentaccount.utoronto.ca/fees-payments/tuition-fee-schedules/',
    incidentalFeesCAD: f ? f.incidentalsCAD : null,
    uhipCAD: f ? f.uhipCAD : null,
  });
}

const all = [...existing, ...rows];
const header = `// University of Toronto — postgraduate rows as previously held, plus the undergraduate
// catalogue generated from U of T's own published data.
// Regenerate the undergraduate rows with: node scripts/gen-uoft-real.js
// Evidence: data/wave-canada/uoft-undergraduate-programs.json and uoft-intl-fee-schedules.json
// ${all.length} courses (${existing.length} postgraduate, ${rows.length} undergraduate) | generated: 2026-09-23
//
// Undergraduate fees are U of T's own full-time international programme fee for 2025-26, by
// faculty, in CAD. The postgraduate rows are untouched: they all carry the same 15,150 in
// annualGBP, which is neither a real figure nor the right currency for a Canadian university.

export interface UoftCourse {
  id?: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string; country: string;
  province?: string; state?: string; city?: string; countryCode?: string;
  studyArea?: string; programTypes?: string; faculty?: string | null; pgwp?: boolean;
  annualGBP?: number; totalGBP?: number; livingCostGBP?: number;
  annualCAD: number; annualUSD?: number; annualINR?: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD?: number; livingCostINR?: number;
  feeVerified?: boolean; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  incidentalFeesCAD?: number | null; uhipCAD?: number | null;
}

export const uoftCourses: UoftCourse[] = ${JSON.stringify(all, null, 1)};

export function getUoftCoursesBySlug(slug: string): UoftCourse | undefined {
  return uoftCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/uoft-courses.ts'), header);

console.log(`data/uoft-courses.ts: ${all.length} courses`);
console.log(`  kept from before (postgraduate, unpriced): ${existing.length}`);
if (dropped.length) {
  console.log(`  duplicate postgraduate rows removed (same slug, names differing only by invisible characters): ${dropped.length}`);
  dropped.forEach((d) => console.log(`    ${d}`));
}
console.log(`  added (undergraduate): ${rows.length}`);
console.log(`  priced from U of T's own faculty schedules: ${rows.filter((r) => r.feeVerified).length}`);
const fT = new Map(); rows.forEach((r) => { if (r.feeVerified) fT.set(r.annualCAD, (fT.get(r.annualCAD) || 0) + 1); });
console.log('  fee spread:', [...fT.entries()].sort((a, b) => b[1] - a[1]).map(([f, n]) => `C$${f.toLocaleString('en-CA')} x${n}`).join(', '));
for (const [k, v] of Object.entries(review)) if (v.length) console.log(`  ${k} (${v.length}): ${v.slice(0, 3).join('; ')}${v.length > 3 ? ` …+${v.length - 3}` : ''}`);
