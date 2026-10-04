// Writes data/cqu-courses-real.ts from data/wave-australia/cqu.json (CQU's own handbook) and the
// partner-platform list data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv.
//
//   node scripts/crawl-cqu.js && node scripts/gen-cqu.js
//
// Official facts come only from CQUniversity's handbook, newest version per course (mostly 2027):
// name, CRICOS codes, duration, and the International Availability table (campuses per term).
// Intake months: Term 1/2/3 = March/July/November, from the handbook's own key dates (Orientation
// Week 1 March, 5 July and 1 November 2027).
//
// Tuition: cqu.edu.au, where CQU publishes current fees, is behind a Cloudflare challenge that is not
// worked around, and the handbook's fee block stops at 2023-24. By user decision (2026-10-03) the
// partner-platform figure fills the tuition — ONLY as an estimate: it is stored in kcEstimate, shown
// under "Estimated via partner platform — not published by university", feeVerified is false and the
// annual fee fields stay 0, so these courses never enter budget hubs, the course matcher or price
// schema. KC programmes are matched to handbook courses by name; a KC major ("Bachelor of Business
// (Accounting)") maps to its handbook course ("Bachelor of Business"), and where majors or campuses
// carry different estimates the range is shown. Nothing else is taken from the partner list.
//
// Listed if the course has a CRICOS code and an on-campus (not Online) international term in its
// newest year of availability — i.e. it is genuinely open to international students on campus right
// now. That is everything needed to be eligible for the page; a partner-platform fee estimate is
// shown when one exists (kcEstimate) but is NOT required to be listed (fixed 2026-10-04 — the
// original version silently dropped 29 real, CRICOS-eligible courses for want of a KC fee row, which
// is a coverage gap, not a safety one: tuition is the only unverified figure here, same as every
// other CQU course, and simply reads "Fee on request" via feeDisplay()/isFeeVerified() when absent).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/cqu.json');
const KC = path.join(ROOT, 'data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv');
const OUT = path.join(ROOT, 'data/cqu-courses-real.ts');

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!crawl._complete) throw new Error('cqu.json is a partial checkpoint — finish the crawl first');
const TERM_MONTH = { 1: 'March', 2: 'July', 3: 'November' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CAMPUS_PLACE = {
  Rockhampton: ['Rockhampton', 'Queensland'], Brisbane: ['Brisbane', 'Queensland'], Cairns: ['Cairns', 'Queensland'],
  Bundaberg: ['Bundaberg', 'Queensland'], Gladstone: ['Gladstone', 'Queensland'], Mackay: ['Mackay', 'Queensland'],
  Townsville: ['Townsville', 'Queensland'], Emerald: ['Emerald', 'Queensland'], Noosa: ['Noosa', 'Queensland'],
  'Gold Coast': ['Gold Coast', 'Queensland'], Sydney: ['Sydney', 'New South Wales'], Melbourne: ['Melbourne', 'Victoria'],
  Adelaide: ['Adelaide', 'South Australia'], Perth: ['Perth', 'Western Australia'],
};
const LEVELS = [
  [/^Bachelor/, 'Bachelor', 'Undergraduate'], [/^Associate Degree/, 'Associate Degree', 'Undergraduate'], [/^Diploma/, 'Diploma', 'Undergraduate'],
  [/^Master|^Juris Doctor/, 'Master', 'Postgraduate'], [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'],
  [/^Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'], [/^Doctor/, 'Doctorate', 'Postgraduate'],
];
const norm = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
const base = (s) => s.replace(/\s*\([^()]*\)\s*$/, '').trim();
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Partner-platform rows for CQU, all four campuses merged.
const kc = fs.readFileSync(KC, 'utf8').trim().split(/\r?\n/).slice(1).map((line) => {
  const m = line.match(/^([^,]+),("[^"]*"|[^,]*),(UG|PG),([^,]*),"([^"]*)",(\d*),([^,]*),(\d*),(\d*)$/);
  if (!m) throw new Error(`unparsed partner row: ${line}`);
  return { campus: m[1], program: m[2].replace(/^"|"$/g, ''), fee: Number(m[6]) || 0, scholarship: Number(m[8]) || 0, deposit: Number(m[9]) || 0 };
}).filter((r) => r.campus.startsWith('CQUniversity'));

const courses = crawl.results.filter((r) => r.httpStatus === 200 && !r.notFound && r.name)
  .map((r) => ({ ...r, cleanName: r.name.replace(/^[A-Z]{2}\d{2}\s*-\s*/, '').trim() }));
const byNorm = new Map(courses.map((c) => [norm(c.cleanName), c]));

// Match each partner programme to a handbook course: exact name, else its base name (major stripped).
const kcFor = new Map();
const unmatched = new Set();
for (const row of kc) {
  const c = byNorm.get(norm(row.program)) || byNorm.get(norm(base(row.program)));
  if (!c) { unmatched.add(row.program); continue; }
  if (!kcFor.has(c.code)) kcFor.set(c.code, []);
  kcFor.get(c.code).push(row);
}

const rows = [];
const skipped = { noCricos: [], noOnCampusTerm: [] };
let noEstimateCount = 0;
for (const c of courses) {
  const cricos = [...new Set((c.cricos || []).map((x) => x.code))];
  if (!cricos.length) { skipped.noCricos.push(c.cleanName); continue; }
  const years = [...new Set((c.intlAvailability || []).map((a) => a.year))].sort((a, b) => b - a);
  const year = years[0];
  const terms = (c.intlAvailability || []).filter((a) => a.year === year)
    .map((a) => ({ term: a.term, campuses: a.campuses.filter((x) => CAMPUS_PLACE[x]) })).filter((a) => a.campuses.length);
  if (!terms.length) { skipped.noOnCampusTerm.push(c.cleanName); continue; }
  const est = kcFor.get(c.code);
  if (!est) noEstimateCount++;
  const months = MONTHS.filter((m) => terms.some((t) => TERM_MONTH[t.term] === m));
  const campuses = [...new Set(terms.flatMap((t) => t.campuses))];
  const fees = est ? est.map((e) => e.fee).filter(Boolean) : [];
  const deposits = est ? est.map((e) => e.deposit).filter(Boolean) : [];
  const scholarships = est ? est.map((e) => e.scholarship).filter(Boolean) : [];
  const majors = est ? [...new Set(est.map((e) => e.program).filter((p) => norm(p) !== norm(c.cleanName)))] : [];
  const durYears = Number(((c.duration || '').match(/([\d.]+)\s*years?\s*full-time/) || [])[1]) || 0;
  const level = LEVELS.find(([re]) => re.test(c.cleanName)) || [null, 'Bachelor', 'Undergraduate'];
  const primary = campuses.includes('Rockhampton') ? 'Rockhampton' : campuses[0];
  const [city, state] = CAMPUS_PLACE[primary];
  rows.push({
    id: `cqu-${rows.length + 1}`,
    name: c.cleanName,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `cqu-${slugify(c.cleanName)}`,
    url: c.url,
    level: level[1],
    studyLevel: level[2],
    duration: durYears ? `${durYears} year${durYears === 1 ? '' : 's'}` : (c.duration || '').split(' or ')[0],
    durationYears: durYears,
    // Not a verified figure: no CQU-published fee could be read, so the annual fields stay 0 and the
    // partner-platform estimate below is the only fee shown (labelled).
    annualAUD: 0, annualUSD: 0, annualINR: 0, totalAUD: 0,
    feeYear: year,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — CQUniversity states English requirements per course; they have not been verified here',
    intakeMonths: months,
    campus: campuses.join(', '),
    campusIntakes: campuses.map((x) => ({ campus: x, months: MONTHS.filter((m) => terms.some((t) => t.campuses.includes(x) && TERM_MONTH[t.term] === m)) })),
    country: 'Australia', state, city, countryCode: 'AU',
    courseCode: c.code,
    cricos: cricos.join(', '),
    handbookVersion: c.version,
    feeVerified: false,
    feeScope: 'estimate',
    feeBasis: 'CQUniversity\'s current international tuition could not be read from its own site, so no university-published fee is shown',
    feeSourceUrl: null,
    // Omitted (not a zeroed object) when the partner platform has no row for this course at all —
    // the page then shows "Fee on request" via feeDisplay()/isFeeVerified() instead of a $0 estimate.
    ...(est ? {
      kcEstimate: {
        tuitionMinAUD: Math.min(...fees), tuitionMaxAUD: Math.max(...fees),
        avgScholarshipAUD: scholarships.length ? Math.max(...scholarships) : null,
        initialDepositAUD: deposits.length ? Math.max(...deposits) : null,
        majors,
      },
    } : {}),
  });
}
const seen = new Set();
for (const r of rows) { if (seen.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); seen.add(r.slug); }

const out = `// CQUniversity — Rockhampton, Brisbane, Cairns, Melbourne, Sydney and other campuses
// Generated by scripts/gen-cqu.js from data/wave-australia/cqu.json — do not edit by hand.
// Facts: CQUniversity's own handbook (https://handbook.cqu.edu.au), newest version per course — CRICOS,
// duration, International Availability (campuses per term). Intakes: Term 1/2/3 = March/July/November
// (handbook key dates). Discovery: the handbook's course category pages.
// Tuition: NOT university-published. cqu.edu.au (where current fees live) is behind a Cloudflare challenge
// and the handbook's fees stop at 2023-24, so feeVerified is false, the annual fee fields are 0, and the
// only figure shown is a partner-platform estimate (kcEstimate), labelled as such on the page.
// Verified: ${crawl._crawledOn}.
// Not listed (genuinely not open to international students on campus right now): no CRICOS
// (${skipped.noCricos.length}), no on-campus international term (${skipped.noOnCampusTerm.length}).
// Of the ${rows.length} listed, ${noEstimateCount} have no partner-platform fee estimate (kcEstimate
// is omitted for these; the page shows "Fee on request" — see gen-cqu.js header, fixed 2026-10-04).
// ${rows.length} courses

export interface CquCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  campusIntakes: { campus: string; months: string[] }[];
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string; handbookVersion: string | null;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  /** Partner-platform figures. CQU publishes none we could read; always shown labelled as estimates.
   *  Absent when the partner platform has no row for this course — shows "Fee on request" instead. */
  kcEstimate?: { tuitionMinAUD: number; tuitionMaxAUD: number; avgScholarshipAUD: number | null; initialDepositAUD: number | null; majors: string[] };
}

export const cquCoursesReal: CquCourseReal[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getCquCourseRealBySlug(slug: string): CquCourseReal | undefined {
  return cquCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${rows.length} courses (${noEstimateCount} with no partner fee estimate — shown as "Fee on request")`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 3).join('; ')}` : ''}`);
console.log(`partner programmes with no handbook match: ${unmatched.size}${unmatched.size ? ` — ${[...unmatched].join('; ')}` : ''}`);
