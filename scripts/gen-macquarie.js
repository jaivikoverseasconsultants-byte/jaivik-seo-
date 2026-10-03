// Writes data/macquarie-courses-real.ts from data/wave-australia/macquarie.json.
//
//   node scripts/crawl-macquarie.js && node scripts/gen-macquarie.js
//
// Every figure is Macquarie's, from each course's own record (embedded in its page data) and page:
// the "International Fee-paying" estimated annual fee and per-credit-point rate, CRICOS code,
// duration, and the sessions international students apply for. Intake months come from the commence
// date the course page itself gives for each of those sessions; a session with no commence date on
// the page (often Session 3) is not stated. No partner-platform list was used.
//
// Listed only if Macquarie marks the course offered to international students, gives it an
// international fee, a CRICOS code and an on-campus location (North Ryde or City), and at least one
// international session with a commence date on the page. Research degrees (Masters by Research,
// research graduate certificates/diplomas) and non-AQF programmes are left out.
// English: not published — Macquarie's per-course IELTS scores were not verified here (englishScope).
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/macquarie.json');
const OUT = path.join(ROOT, 'data/macquarie-courses-real.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!crawl._complete) throw new Error('macquarie.json is a partial checkpoint — finish the crawl first');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function level(r) {
  const t = `${r.type || ''} ${r.title}`;
  if (/^Bachelor/.test(r.title)) return ['Bachelor', 'Undergraduate'];
  if (/^Diploma/.test(r.title)) return ['Diploma', 'Undergraduate'];
  if (/^Graduate Diploma/.test(r.title)) return ['Graduate Diploma', 'Postgraduate'];
  if (/^Graduate Certificate/.test(r.title)) return ['Graduate Certificate', 'Postgraduate'];
  if (/^Master|^Juris Doctor/.test(r.title) || /Masters/.test(t)) return ['Master', 'Postgraduate'];
  if (/^Doctor/.test(r.title)) return ['Doctorate', 'Postgraduate'];
  return [r.studyLevel === 'Undergraduate' ? 'Bachelor' : 'Master', r.studyLevel || 'Postgraduate'];
}

const rows = [];
const skipped = { notInternational: [], noFee: [], noCricos: [], research: [], notOnCampus: [], noIntake: [] };
for (const r of crawl.results) {
  // A fetched course record has a title. (Crawls before the field rename stored the course status,
  // e.g. "Active", in `status`; current ones keep it in `courseStatus`.)
  if (!r.title) continue;
  const courseStatus = r.courseStatus ?? r.status;
  if (courseStatus && courseStatus !== 'Active') { skipped.notInternational.push(r.slug); continue; }
  const fee = r.internationalFees?.[0];
  if (!r.offeredToInternational) { skipped.notInternational.push(r.slug); continue; }
  if (!fee?.annual) { skipped.noFee.push(r.slug); continue; }
  if (/Research|Non AQF/i.test(r.type || '') || /qualifying|uniready/i.test(r.slug)) { skipped.research.push(r.slug); continue; }
  if (!r.cricos) { skipped.noCricos.push(r.slug); continue; }
  const campuses = r.locations.filter((l) => /North Ryde|City/.test(l));
  if (!campuses.length) { skipped.notOnCampus.push(r.slug); continue; }
  // Months for the sessions international students apply for, from the page's own commence dates.
  const sessions = (r.internationalSessions || []).map((s) => {
    const row = (r.startTable || []).find((t) => t.session === s);
    return row ? { session: s, commences: row.commences, month: row.commences.split(' ')[1] } : null;
  }).filter(Boolean);
  const months = MONTHS.filter((m) => sessions.some((s) => s.month === m));
  if (!months.length) { skipped.noIntake.push(r.slug); continue; }
  const years = Number(((r.duration || '').match(/([\d.]+)\s*years?/) || [])[1]) || 0;
  const [lvl, study] = level(r);
  rows.push({
    id: `macquarie-${rows.length + 1}`,
    name: r.title,
    // same prefix as the July 2026 file this replaces, so its URLs for the same courses resolve again
    slug: `macquarie-${r.slug}`,
    url: r.url,
    level: lvl,
    studyLevel: study,
    duration: years ? `${years} year${years === 1 ? '' : 's'}` : (r.duration || '').replace(/^Full time:\s*/, ''),
    durationYears: years,
    annualAUD: fee.annual,
    annualINR: Math.round(fee.annual * RATE_TO_INR.AUD),
    annualUSD: Math.round((fee.annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: 0,
    feeYear: Number(r.year),
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — Macquarie states English requirements per course; they have not been verified here',
    intakeMonths: months,
    sessionStarts: sessions.map((s) => `${s.session}: ${s.commences}`),
    campus: campuses.map((c) => (c === 'North Ryde' ? 'Macquarie Park (North Ryde)' : 'Sydney City')).join(', '),
    country: 'Australia', state: 'New South Wales', city: 'Sydney', countryCode: 'AU',
    courseCode: r.code,
    cricos: r.cricos,
    feeVerified: true,
    feeScope: 'programme',
    feeBasis: `Macquarie's estimated annual fee for international fee-paying students in ${r.year}, A$${fee.perCreditPoint} per credit point${fee.perCreditPoint ? ` (${Math.round(fee.annual / fee.perCreditPoint)} credit points a full-time year)` : ''}${fee.note ? `. ${fee.note.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().replace(/\.$/, '')}` : ''}`,
    feeSourceUrl: r.url,
  });
}

const out = `// Macquarie University — Macquarie Park (North Ryde) and Sydney City campuses
// Generated by scripts/gen-macquarie.js from data/wave-australia/macquarie.json — do not edit by hand.
// Discovery: Macquarie's study sitemap (https://www.mq.edu.au/study/sitemap-0.xml). No partner-platform list.
// Facts and fees: each course's own record, https://www.mq.edu.au/study/page-data/find-a-course/courses/<slug>/page-data.json
// ("International Fee-paying" estimated annual fee), and the course page's own session start dates.
// Verified: ${crawl._crawledOn}.
// Not listed: not offered to international students (${skipped.notInternational.length}), no international fee (${skipped.noFee.length}),
// research/non-AQF (${skipped.research.length}), no CRICOS (${skipped.noCricos.length}), not on campus (${skipped.notOnCampus.length}),
// no international session with a commence date on the page (${skipped.noIntake.length}).
// ${rows.length} courses

export interface MacquarieCourseReal {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; sessionStarts: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
}

export const macquarieCoursesReal: MacquarieCourseReal[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getMacquarieCourseRealBySlug(slug: string): MacquarieCourseReal | undefined {
  return macquarieCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${rows.length} courses`);
for (const [k, v] of Object.entries(skipped)) console.log(`  skipped ${k}: ${v.length}${v.length ? ` — e.g. ${v.slice(0, 4).join('; ')}` : ''}`);
