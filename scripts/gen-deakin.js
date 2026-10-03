// Writes data/deakin-courses-real.ts from data/wave-australia/deakin.json.
//
//   node scripts/crawl-deakin.js && node scripts/gen-deakin.js
//
// Every figure is Deakin's, from each course's international page: name, course code, duration
// (timeToComplete), campuses (onsite course instances), CRICOS code, intakes and the estimated
// tuition fee with Deakin's own note on what load it covers. No partner-platform list.
//
// Fee basis, from Deakin's note under the fee:
//   "typical first-year full-time enrolment of 8 credit points" -> annual (annualAUD)
//   "typical enrolment of 4 credit points" on a Graduate Certificate (a 4-credit-point course)
//       -> the whole course (totalAUD, annualAUD 0)
//   anything else (e.g. "$N 4 CP" on a longer course) -> not listed.
// Intakes: Trimester 1 -> March, 2 -> July, 3 -> November, from Deakin's own pages ("Trimester 1
// (March) or Trimester 2 (July)", "Trimester 3, starting in November"). Courses that start by
// "Semester" are not listed — Deakin's semester start months were not verified.
// Listed only with a CRICOS code, in either format: the original 6 digits + letter (083866G) or the
// newer 7-digit numeric codes (0100304 — confirmed on the CRICOS register as Deakin's Bachelor of
// Artificial Intelligence; CQU uses the same series). Fee year: 2027 ("Year 2027 course information" on the page, confirmed on sampled pages).
// English: not published — not verified here (englishScope marks the row).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/deakin.json');
const OUT = path.join(ROOT, 'data/deakin-courses-real.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR
const FEE_YEAR = 2027;

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!crawl._complete) throw new Error('deakin.json is a partial checkpoint — finish the crawl first');
const TRIMESTER_MONTH = { 1: 'March', 2: 'July', 3: 'November' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CAMPUS_CITY = { 'Burwood (Melbourne)': 'Melbourne', 'Waurn Ponds (Geelong)': 'Geelong', 'Waterfront (Geelong)': 'Geelong', Warrnambool: 'Warrnambool' };
const LEVELS = [
  [/^Bachelor/, 'Bachelor', 'Undergraduate'], [/^Associate Degree/, 'Associate Degree', 'Undergraduate'], [/^Diploma/, 'Diploma', 'Undergraduate'],
  [/^Master|^Juris Doctor/, 'Master', 'Postgraduate'], [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'],
  [/^(Executive )?Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'], [/^Doctor/, 'Doctorate', 'Postgraduate'],
];
function years(ttc) {
  const m = (ttc || '').match(/^P(\d+)Y(?:(\d+)M)?$/);
  return m ? Math.round((Number(m[1]) + Number(m[2] || 0) / 12) * 10) / 10 : 0;
}

const rows = [];
const skipped = { notInternational: [], noFee: [], invalidCricos: [], noCricos: [], notOnCampus: [], feeBasis: [], noTrimester: [], research: [] };
for (const r of crawl.results) {
  if (r.httpStatus !== 200 || !r.name) continue;
  if (r.audience !== 'International students') { skipped.notInternational.push(r.name); continue; }
  if (/Doctor of Philosophy|by Research|Master of Research/i.test(r.name)) { skipped.research.push(r.name); continue; }
  if (!r.offerPrice) { skipped.noFee.push(r.name); continue; }
  const cricos = (r.cricos || []).filter((c) => /^(\d{6}[A-Z]|\d{7})$/.test(c.code));
  if (!cricos.length) { ((r.cricos || []).length ? skipped.invalidCricos : skipped.noCricos).push(`${r.name}${(r.cricos || []).length ? ` (${r.cricos.map((c) => c.code).join(', ')})` : ''}`); continue; }
  const campuses = [...new Set((r.instances || []).filter((i) => i.mode === 'onsite' && CAMPUS_CITY[i.location]).map((i) => i.location))];
  if (!campuses.length) { skipped.notOnCampus.push(r.name); continue; }
  const load = Number(((r.feeNote || '').match(/enrolment of (\d+) credit points/) || [])[1]) || null;
  const level = LEVELS.find(([re]) => re.test(r.name)) || [null, 'Bachelor', 'Undergraduate'];
  let annual = 0, total = 0, basis;
  if (load === 8) {
    annual = r.offerPrice;
    basis = `Deakin's estimated ${FEE_YEAR} tuition fee for international students, based on a typical first-year full-time enrolment of 8 credit points (a guide only; fees depend on the units taken)`;
  } else if (load === 4 && level[1] === 'Graduate Certificate') {
    total = r.offerPrice;
    basis = `Deakin's estimated ${FEE_YEAR} tuition fee for international students for the whole course, based on a typical enrolment of 4 credit points (a guide only)`;
  } else { skipped.feeBasis.push(`${r.name} (${r.offerDescription})`); continue; }
  const tri = [...new Set(((r.intakes || '').match(/Trimesters?\s*([\d,\s]+)/i)?.[1] || '').split(/[,\s]+/).filter(Boolean).map(Number))];
  const months = MONTHS.filter((m) => tri.some((n) => TRIMESTER_MONTH[n] === m));
  if (!months.length) { skipped.noTrimester.push(`${r.name} (${r.intakes ?? 'no intake stated'})`); continue; }
  const y = years(r.timeToComplete);
  const slug = r.url.split('/course/')[1].replace(/-international$/, '');
  const primary = campuses.includes('Burwood (Melbourne)') ? 'Burwood (Melbourne)' : campuses[0];
  rows.push({
    id: `deakin-${rows.length + 1}`,
    name: r.name,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `deakin-${slug}`,
    url: r.url,
    level: level[1],
    studyLevel: level[2],
    duration: y ? `${y} year${y === 1 ? '' : 's'}` : (r.duration || ''),
    durationYears: y,
    annualAUD: annual,
    annualINR: Math.round(annual * RATE_TO_INR.AUD),
    annualUSD: Math.round((annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: total,
    feeYear: FEE_YEAR,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — Deakin states English requirements per course; they have not been verified here',
    intakeMonths: months,
    campus: campuses.join(', '),
    country: 'Australia', state: 'Victoria', city: CAMPUS_CITY[primary], countryCode: 'AU',
    courseCode: r.code,
    cricos: cricos.map((c) => c.code).filter((v, i, a) => a.indexOf(v) === i).join(', '),
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: basis,
    feeSourceUrl: r.url,
  });
}
const seen = new Set();
for (const r of rows) { if (seen.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); seen.add(r.slug); }

const out = `// Deakin University — Burwood (Melbourne), Geelong (Waurn Ponds, Waterfront) and Warrnambool campuses
// Generated by scripts/gen-deakin.js from data/wave-australia/deakin.json — do not edit by hand.
// Discovery: Deakin's course sitemap (https://www.deakin.edu.au/footer/sitemap/xml/course.xml), the
// international version of each course (/course/<slug>-international). No partner-platform list.
// Facts and fees: each page's Course JSON-LD and key information (${FEE_YEAR} course information).
// Intakes: Trimester 1/2/3 = March/July/November, per Deakin's own international pages.
// Verified: ${crawl._crawledOn}.
// Not listed: not for international students (${skipped.notInternational.length}), research (${skipped.research.length}), no fee (${skipped.noFee.length}),
// no CRICOS (${skipped.noCricos.length}), unrecognised CRICOS (${skipped.invalidCricos.length}), not on campus (${skipped.notOnCampus.length}),
// fee not per year or per 4-credit-point graduate certificate (${skipped.feeBasis.length}), no trimester intake (${skipped.noTrimester.length}).
// ${rows.length} courses

export interface DeakinCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  /** Whole-course fee, set only for 4-credit-point graduate certificates. */
  totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const deakinCoursesReal: DeakinCourseReal[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getDeakinCourseRealBySlug(slug: string): DeakinCourseReal | undefined {
  return deakinCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${rows.length} courses (annual ${rows.filter((r) => r.annualAUD).length}, whole-course ${rows.filter((r) => r.totalAUD).length})`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 3).join('; ')}` : ''}`);
