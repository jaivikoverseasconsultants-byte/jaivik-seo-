// Writes data/scu-courses-real.ts from data/wave-australia/scu.json.
//
//   node scripts/crawl-scu.js && node scripts/gen-scu.js
//
// Every figure is Southern Cross University's own, from each course's YEAR page: name, the
// "International snapshot" start months and duration, and the international availability table —
// per campus, the annual fee (with SCU's per-unit rate) and CRICOS code. No partner-platform list.
//
// Listed only if at least one on-campus row (not Online/SCU Online, not an offshore partner campus,
// which SCU marks N/A) has an annual fee and a CRICOS code (old 6-digit+letter or newer 7-digit), and
// the international snapshot gives at least one start month. Campus names drop SCU's bracketed
// specialisation ("Gold Coast (Accounting)" -> Gold Coast).
// English: not published — not verified here (englishScope marks the row).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/scu.json');
const OUT = path.join(ROOT, 'data/scu-courses-real.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!crawl._complete) throw new Error('scu.json is a partial checkpoint — finish the crawl first');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CAMPUS_PLACE = {
  'Gold Coast': ['Gold Coast', 'Queensland'], Brisbane: ['Brisbane', 'Queensland'], Lismore: ['Lismore', 'New South Wales'],
  'Coffs Harbour': ['Coffs Harbour', 'New South Wales'], 'National Marine Science Centre Coffs Harbour': ['Coffs Harbour', 'New South Wales'],
  Sydney: ['Sydney', 'New South Wales'], Melbourne: ['Melbourne', 'Victoria'], Perth: ['Perth', 'Western Australia'],
};
const LEVELS = [
  [/^Bachelor/, 'Bachelor', 'Undergraduate'], [/^Associate Degree/, 'Associate Degree', 'Undergraduate'], [/^Diploma/, 'Diploma', 'Undergraduate'],
  [/^Master|^Juris Doctor/, 'Master', 'Postgraduate'], [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'],
  [/^Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'], [/^Doctor/, 'Doctorate', 'Postgraduate'],
];
const money = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || 0;

const rows = [];
const skipped = { noIntlFee: [], onlineOnly: [], noCricos: [], noMonth: [], research: [] };
for (const r of crawl.results) {
  if (r.httpStatus !== 200 || !r.name) continue;
  if (/Doctor of Philosophy|by Research|Master of Philosophy/i.test(r.name)) { skipped.research.push(r.name); continue; }
  const priced = (r.intlRows || []).filter((x) => /\$/.test(x.fee));
  if (!priced.length) { skipped.noIntlFee.push(r.name); continue; }
  const onCampus = priced.map((x) => ({ ...x, campus: x.campus.replace(/\s*\([^)]*\)\s*$/, '').trim() })).filter((x) => CAMPUS_PLACE[x.campus]);
  if (!onCampus.length) { skipped.onlineOnly.push(r.name); continue; }
  const withCricos = onCampus.filter((x) => /^(\d{6}[A-Z]|\d{7})$/.test(x.cricos));
  if (!withCricos.length) { skipped.noCricos.push(r.name); continue; }
  const months = MONTHS.filter((m) => new RegExp(`\\b${m}\\b`).test(r.intlStart || ''));
  if (!months.length) { skipped.noMonth.push(r.name); continue; }
  const annual = money(withCricos[0].fee.split('(')[0]);
  const perUnit = money((withCricos[0].fee.match(/\(([^)]*) per unit\)/) || [])[1]);
  const years = Number(((r.intlDuration || '').match(/([\d.]+)\s*years?\s*full-time/) || [])[1]) || 0;
  const level = LEVELS.find(([re]) => re.test(r.name)) || [null, 'Bachelor', 'Undergraduate'];
  const campuses = [...new Set(withCricos.map((x) => x.campus))];
  const primary = campuses.includes('Gold Coast') ? 'Gold Coast' : campuses[0];
  const [city, state] = CAMPUS_PLACE[primary];
  const slugPart = r.base.split('/courses/')[1].replace(/\/$/, '').replace(/-\d+$/, '');
  rows.push({
    id: `scu-${rows.length + 1}`,
    name: r.name,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `scu-${slugPart}`,
    url: r.url,
    level: level[1],
    studyLevel: level[2],
    duration: years ? `${years} year${years === 1 ? '' : 's'}` : (r.intlDuration || '').split(';')[0],
    durationYears: years,
    annualAUD: annual,
    annualINR: Math.round(annual * RATE_TO_INR.AUD),
    annualUSD: Math.round((annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: 0,
    feeYear: crawl._year,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — SCU states English requirements per course; they have not been verified here',
    intakeMonths: months,
    campus: campuses.join(', '),
    country: 'Australia', state, city, countryCode: 'AU',
    cricos: [...new Set(withCricos.map((x) => x.cricos))].join(', '),
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: `SCU's ${crawl._year} annual fee for international students${perUnit ? `, A$${perUnit.toLocaleString('en-US')} per unit` : ''}, from the course's own availability and fees table`,
    feeSourceUrl: r.url,
    abbreviation: r.abbreviation || null, // used below to tell same-named courses apart, then dropped
  });
}
// SCU runs some courses under two course codes with the same name; its own abbreviation tells them
// apart ("BN" vs "BN(EN)", the Enrolled Nurse pathway). The plain abbreviation keeps the plain slug.
const ABBREV_LABEL = { EN: 'Enrolled Nurse pathway' };
const bySlug = new Map();
for (const r of rows) (bySlug.get(r.slug) || bySlug.set(r.slug, []).get(r.slug)).push(r);
for (const group of bySlug.values()) {
  if (group.length < 2) continue;
  for (const r of group) {
    const tag = (r.abbreviation || '').match(/\(([^)]+)\)/)?.[1];
    if (!tag) continue; // the plain-abbreviation course keeps the base name and slug
    const label = ABBREV_LABEL[tag] || tag;
    r.name = `${r.name} (${label})`;
    r.slug = `${r.slug}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  }
}
for (const r of rows) delete r.abbreviation;
const seen = new Set();
for (const r of rows) { if (seen.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); seen.add(r.slug); }

const out = `// Southern Cross University — Gold Coast, Lismore, Coffs Harbour and its Brisbane, Melbourne, Perth and Sydney campuses
// Generated by scripts/gen-scu.js from data/wave-australia/scu.json — do not edit by hand.
// Discovery: SCU's sitemap (https://www.scu.edu.au/google-sitemap/index.xml). No partner-platform list.
// Facts and fees: each course's ${crawl._year} page — International snapshot (start months, duration) and the
// international availability table (per-campus annual fee and CRICOS code).
// Verified: ${crawl._crawledOn}.
// Not listed: no international fee (${skipped.noIntlFee.length}), online/offshore only (${skipped.onlineOnly.length}), no CRICOS (${skipped.noCricos.length}),
// no start month (${skipped.noMonth.length}), research (${skipped.research.length}).
// ${rows.length} courses

export interface ScuCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
  cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const scuCoursesReal: ScuCourseReal[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getScuCourseRealBySlug(slug: string): ScuCourseReal | undefined {
  return scuCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${rows.length} courses`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 3).join('; ')}` : ''}`);
