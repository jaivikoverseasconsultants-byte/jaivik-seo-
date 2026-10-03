// Writes data/utas-courses-real.ts from data/wave-australia/utas.json.
//
//   node scripts/crawl-utas.js && node scripts/gen-utas.js
//
// Every figure is UTAS's own, from each course page: name, course code and CRICOS (Course JSON-LD),
// "<year> annual international student tuition fee", the indicative total for international
// students, duration, and the international tab's campus/study-period pairs. No partner-platform list.
//
// Listed only if the page gives an international annual fee, a CRICOS code, and at least one campus
// (not Online) with a study period that has a month to state. "Semester 1" -> February and
// "Semester 2" -> July, from UTAS's 2027 study periods (www.utas.edu.au/key-dates/2027-study-periods:
// start dates 22 February and 5 July 2027). Other periods (AMC block periods, Spring) are not stated.
// Pages that say "This course may not be available to international students" carry no international
// fee and so drop out on their own.
// English: not published — not verified here (englishScope marks the row).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/utas.json');
const OUT = path.join(ROOT, 'data/utas-courses-real.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!crawl._complete) throw new Error('utas.json is a partial checkpoint — finish the crawl first');
const PERIOD_MONTH = { 'Semester 1': 'February', 'Semester 2': 'July' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CAMPUS_PLACE = {
  Hobart: ['Hobart', 'Tasmania'], Launceston: ['Launceston', 'Tasmania'], 'Cradle Coast': ['Burnie', 'Tasmania'],
  Sydney: ['Sydney', 'New South Wales'], 'Melbourne Study Centre': ['Melbourne', 'Victoria'], 'Ultimo Study Centre': ['Sydney', 'New South Wales'],
};
const LEVELS = [
  [/^Bachelor of Medical Science and Doctor of Medicine/, 'Bachelor', 'Undergraduate'],
  [/^Bachelor/, 'Bachelor', 'Undergraduate'], [/^Associate Degree/, 'Associate Degree', 'Undergraduate'],
  [/^Diploma/, 'Diploma', 'Undergraduate'], [/^Undergraduate Certificate/, 'Diploma', 'Undergraduate'],
  [/^Master|^Juris Doctor/, 'Master', 'Postgraduate'], [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'],
  [/^Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'], [/^Doctor/, 'Doctorate', 'Postgraduate'],
];

const rows = [];
const skipped = { noFee: [], noCricos: [], onlineOnly: [], noMonth: [], research: [] };
for (const r of crawl.results) {
  if (r.httpStatus !== 200 || !r.name) continue;
  if (!r.annualFee) { skipped.noFee.push(r.name); continue; }
  if (!r.cricos) { skipped.noCricos.push(r.name); continue; }
  if (/Doctor of Philosophy|Master of Research|by Research/i.test(r.name)) { skipped.research.push(r.name); continue; }
  const campuses = (r.internationalLocations || []).filter((l) => l.campus !== 'Online' && CAMPUS_PLACE[l.campus]);
  if (!campuses.length) { skipped.onlineOnly.push(r.name); continue; }
  const campusIntakes = campuses.map((l) => ({
    campus: l.campus,
    months: MONTHS.filter((m) => l.periods.split(/,\s*/).some((p) => PERIOD_MONTH[p.trim()] === m)),
  })).filter((c) => c.months.length);
  if (!campusIntakes.length) { skipped.noMonth.push(r.name); continue; }
  const months = MONTHS.filter((m) => campusIntakes.some((c) => c.months.includes(m)));
  const years = Number(((r.duration || '').match(/Minimum\s*([\d.]+)\s*years?/) || [])[1]) || 0;
  const level = LEVELS.find(([re]) => re.test(r.name)) || [null, 'Bachelor', 'Undergraduate'];
  const primary = campusIntakes.find((c) => c.campus === 'Hobart') || campusIntakes[0];
  const [city, state] = CAMPUS_PLACE[primary.campus];
  const slugPart = r.url.split('/').pop().replace(/^[a-z0-9]+-/, '');
  rows.push({
    id: `utas-${rows.length + 1}`,
    name: r.name,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `utas-${slugPart}`,
    url: r.url,
    level: level[1],
    studyLevel: level[2],
    duration: years ? `${years} year${years === 1 ? '' : 's'}` : (r.duration || ''),
    durationYears: years,
    annualAUD: r.annualFee,
    annualINR: Math.round(r.annualFee * RATE_TO_INR.AUD),
    annualUSD: Math.round((r.annualFee * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: r.totalFee || 0,
    feeYear: r.feeYear,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — UTAS states English requirements per course; they have not been verified here',
    intakeMonths: months,
    campus: campusIntakes.map((c) => c.campus).join(', '),
    campusIntakes,
    country: 'Australia', state, city, countryCode: 'AU',
    courseCode: r.code,
    cricos: r.cricos,
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: `UTAS's ${r.feeYear} annual international student tuition fee${r.creditPointsPerYear ? ` for a standard year of ${r.creditPointsPerYear} credit points` : ''}, including the Student Services and Amenities Fee${r.totalFee ? `; UTAS's indicative total for international students is A$${r.totalFee.toLocaleString('en-US')}` : ''}`,
    feeSourceUrl: r.url,
  });
}

const seen = new Set();
for (const r of rows) { if (seen.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); seen.add(r.slug); }

const out = `// University of Tasmania — Hobart, Launceston, Cradle Coast and Sydney campuses
// Generated by scripts/gen-utas.js from data/wave-australia/utas.json — do not edit by hand.
// Discovery: UTAS's courses sitemap (https://www.utas.edu.au/courses/sitemap.xml). No partner-platform list.
// Facts and fees: each course's own page — Course JSON-LD (code, CRICOS), the international
// "Key Information" tab (duration, campuses, study periods) and its stated ${rows[0]?.feeYear ?? ''} international fee.
// Intake months from UTAS's 2027 study periods (Semester 1 starts 22 February, Semester 2 starts 5 July).
// Verified: ${crawl._crawledOn}.
// Not listed: no international fee (${skipped.noFee.length} — UTAS says many "may not be available to international
// students"), no CRICOS (${skipped.noCricos.length}), online only (${skipped.onlineOnly.length}), no study period with a month (${skipped.noMonth.length}),
// research (${skipped.research.length}).
// ${rows.length} courses

export interface UtasCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  /** UTAS's indicative total tuition for international students. */
  totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  campusIntakes: { campus: string; months: string[] }[];
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const utasCoursesReal: UtasCourseReal[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getUtasCourseRealBySlug(slug: string): UtasCourseReal | undefined {
  return utasCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${rows.length} courses`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 4).join('; ')}` : ''}`);
