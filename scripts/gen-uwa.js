// Writes data/uwa-courses-real.ts from data/wave-australia/uwa.json.
//
//   node scripts/crawl-uwa.js && node scripts/gen-uwa.js
//
// Every figure is UWA's. Fees, total and credit points come from UWA's fee calculator (international
// category, crawl year, starting that year); campus, delivery, CRICOS, status and intake from the
// course's own page. The two are joined on UWA's course code, or — where the page states a different
// code (Bachelor of Arts: BP001 on the page, BP021 in the calculator) or none — on the course name.
//
// A course is listed only if it has its own page with a CRICOS code, is not marked unavailable, is
// taught on campus where delivery is stated, and has a calculator fee. Intakes: "Semester 1" ->
// February and "Semester 2" -> July, from UWA's important-dates page (first day of semester 23
// February and 20 July in 2026); explicit months are used as stated. Courses that start "throughout
// the year", by trimester or by law-school unit availability have no month to state and are left out.
// Duration = course credit points / annual credit points, the same basis as UWA's total fee.
// English: not published — not verified here (englishScope marks the row).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/uwa.json');
const OUT = path.join(ROOT, 'data/uwa-courses-real.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = (v) => (v || '').replace(/\s*<div class="\s*$/, '').replace(/\s+/g, ' ').trim();
const money = (s) => Number(String(s || '').replace(/[^0-9.]/g, '')) || 0;
// Card labels vary by page template ("Intake", "COURSE INTAKE", "Intake months", "Starting dates"), so
// a label may also be matched by keyword.
const cardMatch = (p, re) => { const k = Object.keys(p.cards).find((x) => re.test(x)); return k ? clean(p.cards[k]) : ''; };
const card = (p, ...labels) => { for (const l of labels) { const k = Object.keys(p.cards).find((x) => x.toLowerCase() === l.toLowerCase()); if (k) return clean(p.cards[k]); } return ''; };
const nameOf = (label) => label.replace(/\s*\[[^\]]+\]\s*$/, '').replace(/\s+-\s+(Coursework|Undergraduate|Postgraduate)$/i, '').replace(/\s+/g, ' ').trim();

const byCode = new Map();
const bySlug = new Map();
for (const p of crawl.pages) {
  if (p.status !== 200) continue;
  bySlug.set(p.slug, p);
  const code = card(p, 'Course Code').split(/\s+/)[0];
  if (code && !byCode.has(code)) byCode.set(code, p);
}

function intakeMonths(text) {
  const t = text.replace(/Semester\s*1/gi, ' February ').replace(/Semester\s*2/gi, ' July ');
  if (/throughout|trimester|law school|non-standard teaching period\.$/i.test(text) && !/February|January|July/i.test(t)) return [];
  return MONTHS.filter((m) => new RegExp(`\\b${m}\\b`, 'i').test(t));
}

const LEVELS = [
  [/^Bachelor .* and Master /, 'Bachelor', 'Undergraduate'], [/^Bachelor/, 'Bachelor', 'Undergraduate'],
  [/^Master|^Juris Doctor|^Doctor of (Medicine|Dental|Pharmacy|Optometry|Podiatric|Physiotherapy|Clinical)/, 'Master', 'Postgraduate'],
  [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'], [/^Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'],
  [/^Diploma/, 'Diploma', 'Undergraduate'], [/^Doctor/, 'Doctorate', 'Postgraduate'],
];

const rows = [];
const skipped = { noPage: [], noCricos: [], unavailable: [], online: [], noFee: [], noMonth: [], research: [] };
for (const r of crawl.results) {
  const name = nameOf(r.label);
  if (/Higher Degree by Research|Preliminary|Doctor of Philosophy|Master of Philosophy|Non-Award|Study Abroad|\(Research\)/i.test(name)) { skipped.research.push(name); continue; }
  const page = byCode.get(r.code) || bySlug.get(slugify(name));
  if (!page) { skipped.noPage.push(name); continue; }
  const cricos = (cardMatch(page, /cricos/i).match(/\b\d{6}[0-9A-Z]\b/) || [])[0];
  if (!cricos) { skipped.noCricos.push(name); continue; }
  const status = card(page, 'Status');
  if (/unavailable|not available/i.test(status)) { skipped.unavailable.push(name); continue; }
  const delivery = card(page, 'Delivery');
  if (delivery && !/on-campus|multi-mode/i.test(delivery)) { skipped.online.push(name); continue; }
  const annual = money(r.fee?.fee);
  if (!annual) { skipped.noFee.push(name); continue; }
  const months = intakeMonths(cardMatch(page, /intake|starting date/i));
  if (!months.length) { skipped.noMonth.push(name); continue; }
  const level = LEVELS.find(([re]) => re.test(name)) || [null, 'Bachelor', 'Undergraduate'];
  const cp = money(r.fee.course_credit_point);
  const acp = money(r.fee.annual_credit_point);
  const years = cp && acp ? Math.round((cp / acp) * 10) / 10 : 0;
  rows.push({
    id: `uwa-${rows.length + 1}`,
    name,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `uwa-${page.slug}`,
    url: page.url,
    level: level[1],
    studyLevel: level[2],
    duration: years ? `${years} year${years === 1 ? '' : 's'}` : card(page, 'Full time/part time duration', 'Full time completion'),
    durationYears: years,
    annualAUD: annual,
    annualINR: Math.round(annual * RATE_TO_INR.AUD),
    annualUSD: Math.round((annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: money(r.fee.total_fee),
    feeYear: crawl._year,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — UWA states English requirements per course; they have not been verified here',
    intakeMonths: months,
    campus: /Albany/.test(cardMatch(page, /location/i)) ? 'Perth (Crawley), Albany' : 'Perth (Crawley)',
    country: 'Australia', state: 'Western Australia', city: 'Perth', countryCode: 'AU',
    courseCode: r.code,
    cricos,
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: `UWA's ${crawl._year} annual course fee for onshore international students starting in ${crawl._year}, from UWA's fee calculator: ${r.fee.annual_credit_point} credit points a year at ${r.fee.fee_per_credit_point} per point; UWA's total for the ${r.fee.course_credit_point}-point course is ${r.fee.total_fee}. Fees are subject to annual indexation`,
    feeSourceUrl: `https://www.fees.uwa.edu.au/Calculator?feeYear=${crawl._year}&feeType=${r.feeCategory}&courseCode=${encodeURIComponent(r.code)}`,
  });
}

// One page per course: if two calculator entries resolve to the same page, keep the first.
const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.slug) ? false : (seen.add(r.slug), true)));
// Two pages share a name ("Master of Public Health"); the specialisation page is named for what it is.
for (const r of unique) if (r.slug.endsWith('-specialisation') && !/Specialisation/.test(r.name)) r.name += ' (Specialisation)';

const out = `// The University of Western Australia — Perth (Crawley) campus
// Generated by scripts/gen-uwa.js from data/wave-australia/uwa.json — do not edit by hand.
// Discovery and fees: UWA's own fee calculator (https://www.fees.uwa.edu.au/Calculator), international
// undergraduate and postgraduate coursework categories, ${crawl._year} fees for students starting in ${crawl._year}.
// No partner-platform list was used. Course facts (CRICOS, delivery, status, intake): each course's own
// page at https://www.uwa.edu.au/study/courses/<slug>. Intake months for "Semester 1/2" from UWA's
// important-dates page (first day of semester 23 February and 20 July, 2026).
// Verified: ${crawl._crawledOn}.
// Not listed: no course page (${skipped.noPage.length}), no CRICOS code (${skipped.noCricos.length}), unavailable (${skipped.unavailable.length}),
// online only (${skipped.online.length}), no calculator fee (${skipped.noFee.length}), no fixed intake month (${skipped.noMonth.length}),
// research/non-award (${skipped.research.length}).
// ${unique.length} courses

export interface UwaCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  /** UWA's own total for the whole course, from its fee calculator. */
  totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const uwaCoursesReal: UwaCourseReal[] = [
${unique.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getUwaCourseRealBySlug(slug: string): UwaCourseReal | undefined {
  return uwaCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${unique.length} courses (${rows.length - unique.length} duplicate page matches dropped)`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 4).join('; ')}` : ''}`);
