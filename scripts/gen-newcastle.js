// Writes data/newcastle-courses-real.ts from the partner-platform list
// data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv (University of Newcastle rows only).
//
//   node scripts/gen-newcastle.js
//
// 2026-10-04: unlike every other Australia Bucket-A university, the University of Newcastle has NO
// accessible official source at all. Its degree pages sit behind a Cloudflare challenge, its
// handbook's robots.txt allows only Googlebot, the CRICOS register disallows crawling /Course, and
// this project's own egress proxy refuses newcastle.edu.au outright (connect_rejected, confirmed
// 2026-10-04) — so CRICOS, duration, intake and fee cannot be independently checked against the
// university's own page for a single course here.
//
// First version of this file (same day) treated every field as an unverified estimate, matching the
// CQU/Bond convention. By a SEPARATE, explicit user decision made afterwards — specifically that
// KC/coursefinder.ai is a large, established partner platform working directly with universities,
// not a casual scrape, and its FEE data is trusted to be accurate here — fee is now shown as the
// real figure, not hedged behind a dashed "estimate" box:
//   - feeVerified: true, annualAUD/annualUSD/annualINR carry the partner-platform fee (so these
//     courses now join the budget hubs, course matcher and price schema, same as any other verified
//     Australia course). Where a programme had two conflicting partner fees for the same name, the
//     midpoint of the range is used (see kcEstimate.tuitionMinAUD/MaxAUD for the original range).
//   - This is a trust decision about the SOURCE, not a claim that the university's own page was
//     read. Keep that distinction in any future BUILD-LOG entry.
//
// CRICOS is a SEPARATE problem, unrelated to the fee-trust decision above: it is not a trust
// question at all, because the source CSV simply has no CRICOS column for Newcastle — there is
// nothing to trust or distrust, the field does not exist. So CRICOS/course code are still left ''
// and NOT invented, and `pswEligible: false` stays on every row — lib/course-faqs.ts checks
// `course.pswEligible === false` first and suppresses any post-study-work visa claim, because an
// unconfirmed CRICOS status means international/visa eligibility itself still cannot be asserted
// (see lib/psw-eligibility.ts's own history: a PTE exam once advertised "~2 years post-study work").
// `url` stays the university's general homepage, never claimed as the specific official course page.
//
// Source CSV columns: campus,program,level,duration,intakes,fee,appFee,scholarship,deposit.
// 149 raw rows → 146 distinct programmes (1 exact duplicate collapsed after normalising a stray
// trailing space; 1 same-name pair with two different fees — kept as a kcEstimate range, with the
// midpoint used for the now-trusted annualAUD).
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KC = path.join(ROOT, 'data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv');
const OUT = path.join(ROOT, 'data/newcastle-courses-real.ts');

const MONTH_MAP = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
const LEVELS = [
  [/^Bachelor/, 'Bachelor', 'Undergraduate'], [/^Associate Degree/, 'Associate Degree', 'Undergraduate'], [/^Diploma/, 'Diploma', 'Undergraduate'],
  [/^Master|^Juris Doctor/, 'Master', 'Postgraduate'], [/^Graduate Diploma/, 'Graduate Diploma', 'Postgraduate'],
  [/^Graduate Certificate/, 'Graduate Certificate', 'Postgraduate'], [/^Doctor|^PhD/, 'Doctorate', 'Postgraduate'],
];
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const raw = fs.readFileSync(KC, 'utf8').trim().split(/\r?\n/).slice(1);
const re = /^([^,]+),("[^"]*"|[^,]*),(UG|PG),([^,]*),"([^"]*)",(\d*),([^,]*),(\d*),(\d*)$/;
const rows = raw.map((line) => {
  const m = line.match(re);
  if (!m) throw new Error(`unparsed partner row: ${line}`);
  return {
    campus: m[1], program: m[2].replace(/^"|"$/g, '').replace(/\s+/g, ' ').replace(/\s+\)/g, ')').trim(), level: m[3], duration: m[4], intakes: m[5],
    fee: Number(m[6]) || 0, appFeeRaw: m[7], scholarship: Number(m[8]) || 0, deposit: Number(m[9]) || 0,
  };
}).filter((r) => r.campus === 'University of Newcastle');

const byName = new Map();
for (const r of rows) {
  if (!byName.has(r.program)) byName.set(r.program, []);
  byName.get(r.program).push(r);
}

const courses = [];
for (const [program, group] of byName) {
  const g = group[0];
  const durMonths = Number((g.duration.match(/(\d+)\s*Month/) || [])[1]) || 0;
  const durYears = durMonths ? Math.round((durMonths / 12) * 100) / 100 : 0;
  const months = [...new Set(
    g.intakes.split(',').map((s) => s.trim()).map((s) => MONTH_MAP[s]).filter(Boolean)
  )];
  const rollingIntake = /\bOpen\b/.test(g.intakes);
  const level = LEVELS.find(([re2]) => re2.test(program)) || [null, g.level === 'PG' ? 'Master' : 'Bachelor', g.level === 'PG' ? 'Postgraduate' : 'Undergraduate'];
  const fees = group.map((r) => r.fee).filter(Boolean);
  const scholarships = group.map((r) => r.scholarship).filter(Boolean);
  const deposits = group.map((r) => r.deposit).filter(Boolean);
  const appFeeWaived = group.every((r) => /No Application Fee|waived/i.test(r.appFeeRaw));
  // Midpoint of the partner fee range (equal to the single value when there's no range).
  const feeMidAUD = fees.length ? Math.round((Math.min(...fees) + Math.max(...fees)) / 2) : 0;
  courses.push({
    id: `newcastle-${courses.length + 1}`,
    name: program,
    slug: `newcastle-${slugify(program)}`,
    // General homepage only — no course-specific official URL is reachable; never shown as "Official Course Page".
    url: 'https://www.newcastle.edu.au/',
    level: level[1],
    studyLevel: level[2],
    duration: durYears ? `${durYears} year${durYears === 1 ? '' : 's'}` : g.duration,
    durationYears: durYears,
    // Fee-trust decision (2026-10-04, by user): KC/coursefinder.ai is treated as an accurate source
    // for fee specifically, so this is shown as a real figure, not a hedged "estimate" box. Midpoint
    // of the partner range where a programme had two differing fees (kcEstimate keeps the raw range).
    annualAUD: feeMidAUD,
    annualINR: Math.round(feeMidAUD * RATE_TO_INR.AUD),
    annualUSD: Math.round((feeMidAUD * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
    totalAUD: durYears ? Math.round(feeMidAUD * durYears) : feeMidAUD,
    feeYear: 2027,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — not independently verified for the University of Newcastle; confirm directly',
    intakeMonths: months,
    rollingIntake,
    campus: 'Newcastle (Callaghan) / Sydney (CBD)',
    country: 'Australia', state: 'New South Wales', city: 'Newcastle', countryCode: 'AU',
    courseCode: '',
    cricos: '',
    feeVerified: true,
    // The one load-bearing safety flag for this file: see the header comment. Checked first by
    // lib/course-faqs.ts's pswDetails(), which suppresses any post-study-work visa claim entirely.
    // UNCHANGED by the fee-trust decision — CRICOS is a missing field, not a trust question, and
    // international/visa eligibility cannot be asserted without it regardless of how reliable the
    // fee figure is.
    pswEligible: false,
    feeScope: 'partner-verified',
    feeBasis: 'University of Newcastle\'s own fee pages are not publicly readable (Cloudflare-protected, Googlebot-only handbook robots.txt). By explicit decision this fee is taken from our partner platform (KC/coursefinder.ai), which works directly with universities on admissions data; CRICOS and course code remain unavailable from any source and are not shown.',
    feeSourceUrl: null,
    kcEstimate: {
      tuitionMinAUD: fees.length ? Math.min(...fees) : 0,
      tuitionMaxAUD: fees.length ? Math.max(...fees) : 0,
      avgScholarshipAUD: scholarships.length ? Math.max(...scholarships) : null,
      initialDepositAUD: deposits.length ? Math.max(...deposits) : null,
      appFeeWaived,
    },
  });
}
courses.sort((a, b) => a.name.localeCompare(b.name));

const seen = new Set();
for (const c of courses) { if (seen.has(c.slug)) throw new Error(`duplicate slug ${c.slug}`); seen.add(c.slug); }

const out = `// University of Newcastle (Australia) — tenth Australia Bucket-A university
// Generated by scripts/gen-newcastle.js from data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv —
// do not edit by hand.
//
// NO OFFICIAL UNIVERSITY SOURCE IS ACCESSIBLE for this university (see the script's header comment:
// Cloudflare-protected degree pages, a Googlebot-only handbook robots.txt, and this project's own
// egress policy refusing newcastle.edu.au, confirmed 2026-10-04).
//
// FEE (2026-10-04, explicit user decision): KC/coursefinder.ai is trusted as an accurate partner
// source for fee specifically, so feeVerified is true and annualAUD/annualUSD/annualINR carry a real
// figure (the midpoint of kcEstimate's range where one programme had two differing partner fees) —
// these courses join budget hubs, the course matcher and price schema like any other verified course.
//
// CRICOS / course code (UNCHANGED by the fee decision — a missing field, not a trust question): the
// source CSV has no CRICOS column for Newcastle at all, so both stay '' and are never invented; the
// course detail page has no "Course code / CRICOS" row. pswEligible is false on every row for the same
// reason: lib/course-faqs.ts checks this first and suppresses any post-study-work visa claim, because
// unconfirmed CRICOS means international/visa eligibility itself cannot be asserted — regardless of
// how reliable the fee figure is. \`url\` is the university's general homepage, never presented as the
// specific official course page.
//
// 149 raw partner rows → ${courses.length} distinct programmes (1 exact duplicate collapsed; 1 same-name
// pair with two different fees — kcEstimate keeps the raw range, annualAUD uses its midpoint).

export interface NewcastleCourseReal {
  feeVerified?: boolean;
  pswEligible?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  feeYear: number;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; rollingIntake: boolean; campus: string;
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; cricos: string;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  /** Partner-platform figures. annualAUD above is this range's midpoint, trusted as the real fee. */
  kcEstimate: { tuitionMinAUD: number; tuitionMaxAUD: number; avgScholarshipAUD: number | null; initialDepositAUD: number | null; appFeeWaived: boolean };
}

export const newcastleCoursesReal: NewcastleCourseReal[] = [
${courses.map((c) => `  ${JSON.stringify(c)}`).join(',\n')}
];

export function getNewcastleCourseRealBySlug(slug: string): NewcastleCourseReal | undefined {
  return newcastleCoursesReal.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
console.log(`wrote ${courses.length} courses (from ${rows.length} raw rows)`);
