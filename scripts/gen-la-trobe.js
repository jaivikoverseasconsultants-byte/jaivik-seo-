// Writes data/la-trobe-university-courses.ts from data/wave-australia/la-trobe-university.json.
//
//   node scripts/crawl-la-trobe.js && node scripts/gen-la-trobe.js
//
// Every published figure is La Trobe's, from each course's international overview data for the
// crawl year: name, CRICOS code, duration, campus start dates and the "Onshore International
// Applicants" fee. Only campus offerings with a CRICOS code are kept (La Trobe Online carries none,
// and a student visa needs one); a course with no such offering is not listed. Domestic fee rows in
// the same files are ignored.
//
// Fee basis, as La Trobe states it:
//   "per 120 credit points" / "per EFTSL" — the full-time annual load, so it is an annual fee.
//   "full course duration (per 60 credit points)" — the whole course (six-month graduate
//   certificates), so it goes in totalAUD and annualAUD stays 0.
// Professional doctorates that start "anytime" are left out too (no intake month to state).
// Research degrees (PhD, MPhil, "(research)" masters) are left out: supervised research, not
// coursework, and La Trobe gives the PhD and MPhil two unlabelled fees (A$46,200 and A$40,200) that
// cannot be attributed.
//
// English: not published — La Trobe's entry-requirements data was not verified here, so no
// IELTS/TOEFL/PTE score is stated (englishScope marks the row).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/la-trobe-university.json');
const OUT = path.join(ROOT, 'data/la-trobe-university-courses.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const RESEARCH = /^(doctor-of-philosophy|master-of-philosophy)$|-research$/;
const CAMPUS_PLACE = {
  Melbourne: ['Melbourne', 'Victoria'], City: ['Melbourne', 'Victoria'], Bendigo: ['Bendigo', 'Victoria'],
  'Albury-Wodonga': ['Wodonga', 'Victoria'], Mildura: ['Mildura', 'Victoria'], Shepparton: ['Shepparton', 'Victoria'],
  Sydney: ['Sydney', 'New South Wales'],
};
const LEVELS = [
  [/^bachelor-/, 'Bachelor', 'Undergraduate'], [/^associate-degree-/, 'Associate Degree', 'Undergraduate'],
  [/^diploma-/, 'Diploma', 'Undergraduate'], [/^master-|^juris-doctor/, 'Master', 'Postgraduate'],
  [/^graduate-diploma-/, 'Graduate Diploma', 'Postgraduate'], [/^graduate-certificate-/, 'Graduate Certificate', 'Postgraduate'],
  [/^doctor-/, 'Doctorate', 'Postgraduate'],
];

/** "Semester 1 (March 2027), 22 February 2027, LTU Term 4 (July 2027)" -> months in calendar order. */
function months(startDates) {
  const found = new Set();
  for (const m of MONTHS) if (new RegExp(`\\b${m}\\b`).test(startDates || '')) found.add(m);
  return MONTHS.filter((m) => found.has(m));
}

const rows = [];
const skipped = { research: [], noCampus: [], flexibleStart: [] };
for (const r of crawl.results) {
  const campus = r.locations.filter((l) => l.cricos && l.loc !== 'on' && l.internationalFees.length);
  if (!campus.length) { skipped.noCampus.push(r.slug); continue; }
  if (RESEARCH.test(r.slug)) { skipped.research.push(r.slug); continue; }
  const level = LEVELS.find(([re]) => re.test(r.slug));
  if (!level) throw new Error(`${r.slug}: unmapped level`);

  const fees = new Set(campus.flatMap((l) => l.internationalFees.map((f) => f.amount)));
  if (fees.size !== 1) throw new Error(`${r.slug}: ${fees.size} distinct international fees`);
  const fee = campus[0].internationalFees[0];
  const wholeCourse = /full course/i.test(fee.basis);
  const durationText = campus[0].duration.split(';')[0].trim(); // "3 years full-time; 2.5 years accelerated"
  const years = Number((durationText.match(/([\d.]+)\s*years?/) || [])[1]) || 0;
  const primary = campus.find((l) => l.location === 'Melbourne') || campus[0];
  const intakeMonths = months(campus.map((l) => l.startDates).join(', '));
  // "Anytime (2027), preferably aligned with Semester intake" — the professional doctorates. No month
  // to state, and the shared course templates are written around fixed intakes, so they are left out.
  if (!intakeMonths.length) { skipped.flexibleStart.push(r.slug); continue; }
  const [city, state] = CAMPUS_PLACE[primary.location] || ['Melbourne', 'Victoria'];

  const annual = wholeCourse ? 0 : fee.amount;
  rows.push({
    id: `latrobe-${rows.length + 1}`,
    name: campus[0].advertisedTitle || campus[0].name,
    // same prefix as the files this replaces, so their URLs for the same courses resolve again
    slug: `latrobe-${r.slug}`,
    url: r.url,
    level: level[1],
    studyLevel: level[2],
    duration: durationText.replace(/ full-time$/, ''),
    durationYears: years,
    annualAUD: annual,
    annualINR: Math.round(annual * RATE_TO_INR.AUD),
    annualUSD: Math.round((annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: wholeCourse ? fee.amount : 0,
    feeYear: crawl._year,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — La Trobe states English requirements per course; they have not been verified here',
    intakeMonths,
    campus: campus.map((l) => l.location === 'City' ? 'Melbourne City' : l.location).join(', '),
    campusIntakes: campus.map((l) => ({ campus: l.location === 'City' ? 'Melbourne City' : l.location, months: months(l.startDates) })),
    country: 'Australia', state, city, countryCode: 'AU',
    cricos: campus[0].cricos,
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: wholeCourse
      ? `La Trobe's indicative ${crawl._year} tuition for onshore international applicants, A$${fee.amount.toLocaleString('en-US')} for the whole course (${fee.basis.replace(/\.$/, '')})`
      : `La Trobe's indicative ${crawl._year} annual tuition for onshore international applicants, ${fee.basis.replace(/\.$/, '')} (the full-time annual load); La Trobe may raise fees each year, typically by no more than 7%`,
    feeSourceUrl: r.url,
  });
}

const slugs = new Set();
for (const r of rows) { if (slugs.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); slugs.add(r.slug); }

const out = `// La Trobe University — Melbourne, Bendigo, Albury-Wodonga, Mildura, Shepparton and Sydney campuses
// Generated by scripts/gen-la-trobe.js from data/wave-australia/la-trobe-university.json — do not edit by hand.
// Discovery: La Trobe's own sitemap (every /courses/<award> page). No partner-platform list was used.
// Facts and fees: each course's international overview data,
//   https://www.latrobe.edu.au/courses/data/${crawl._year}/international/<campus>/<course>
// — La Trobe publishes no fee schedule; its fees page points to each course's overview instead.
// Verified: ${crawl._crawledOn}. ${crawl._year} fees for onshore international applicants, per full-time year
// (120 credit points / EFTSL), or for the whole course where La Trobe prices it that way.
// Not listed — no on-campus offering with a CRICOS code for international students (${skipped.noCampus.length}), e.g. the MBA,
// which La Trobe offers internationally online only. Research degrees left out: ${skipped.research.join(', ')}.
// Flexible-start professional doctorates left out ("Anytime ... preferably aligned with Semester intake"): ${skipped.flexibleStart.join(', ')}.
// ${rows.length} courses

export interface LaTrobeUniversityCourse {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  /** Whole-course fee, set only where La Trobe prices the course as a whole. */
  totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  campusIntakes: { campus: string; months: string[] }[];
  country: string; state: string; city: string; countryCode: string;
  cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const laTrobeUniversityCourses: LaTrobeUniversityCourse[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getLaTrobeUniversityCourseBySlug(slug: string): LaTrobeUniversityCourse | undefined {
  return laTrobeUniversityCourses.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
const by = (f) => rows.filter(f).length;
console.log(`wrote ${rows.length} courses | annual ${by((r) => r.annualAUD > 0)} | whole-course ${by((r) => r.totalAUD > 0)} | research left out ${skipped.research.length} | flexible-start ${skipped.flexibleStart.length} | no international campus offering ${skipped.noCampus.length}`);
