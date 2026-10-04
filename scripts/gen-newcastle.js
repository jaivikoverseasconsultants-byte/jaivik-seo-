// Writes data/newcastle-courses-real.ts from the partner-platform list
// data/wave-australia/kc/newcastle-cqu-courses-KC-raw.csv (University of Newcastle rows only).
//
//   node scripts/gen-newcastle.js
//
// 2026-10-04, by user decision: unlike every other Australia Bucket-A university, the University of
// Newcastle has NO accessible official source at all. Its degree pages sit behind a Cloudflare
// challenge, its handbook's robots.txt allows only Googlebot, the CRICOS register disallows crawling
// /Course, and this project's own egress proxy refuses newcastle.edu.au outright (connect_rejected,
// confirmed 2026-10-04) — so there is no way to independently verify CRICOS, duration, intake or fee
// for a single course here. By explicit user decision, the partner-platform list is used as the ONLY
// source for these 147 courses, with every fact (not just fee, unlike CQU/Bond) labelled an estimate:
//   - feeVerified: false, annualAUD/annualINR/totalAUD stay 0 (same convention as every other
//     partner-estimate course — keeps these out of budget hubs, the course matcher and price schema).
//   - pswEligible: false on every row. This is the one load-bearing safety flag: lib/course-faqs.ts
//     checks `course.pswEligible === false` before anything else and suppresses any post-study-work
//     visa claim. Without a confirmed CRICOS code we cannot assert a course is genuinely open to
//     international students at all, so no visa/PSW claim may be shown — see lib/psw-eligibility.ts's
//     own history (a PTE exam once advertised "~2 years post-study work").
//   - No CRICOS code and no course code are invented. Both fields are left '' and the course detail
//     page does not render a "Course code / CRICOS" row at all (CQU/Bond's template does — Newcastle's
//     template deliberately omits it; see app/universities/university-of-newcastle-australia/courses).
//   - `url` is the university's general homepage (https://www.newcastle.edu.au/), never claimed as
//     "the official course page" — Newcastle's template labels the outbound link "Search the
//     University's Website" rather than CQU/Bond's "Official Course Page".
//
// Source CSV columns: campus,program,level,duration,intakes,fee,appFee,scholarship,deposit.
// 149 raw rows → 147 distinct programmes (1 exact duplicate collapsed; 1 same-name pair with two
// different fees kept as a min–max range, same as CQU's cross-campus range handling).
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
    annualAUD: 0, annualUSD: 0, annualINR: 0, totalAUD: 0,
    feeYear: 2027,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — not independently verified for the University of Newcastle; confirm directly',
    intakeMonths: months,
    rollingIntake,
    campus: 'Newcastle (Callaghan) / Sydney (CBD)',
    country: 'Australia', state: 'New South Wales', city: 'Newcastle', countryCode: 'AU',
    courseCode: '',
    cricos: '',
    feeVerified: false,
    // The one load-bearing safety flag for this file: see the header comment. Checked first by
    // lib/course-faqs.ts's pswDetails(), which suppresses any post-study-work visa claim entirely.
    pswEligible: false,
    feeScope: 'estimate',
    feeBasis: 'No official University of Newcastle source is accessible (Cloudflare-protected degree pages, Googlebot-only handbook robots.txt, and this project’s own network policy refuses newcastle.edu.au). Every figure below, including duration and intakes, comes only from a partner-platform list and has not been independently verified.',
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
// NO OFFICIAL SOURCE IS ACCESSIBLE for this university (see the script's header comment for the full
// reasoning: Cloudflare-protected degree pages, a Googlebot-only handbook robots.txt, and this
// project's own egress policy refusing newcastle.edu.au, confirmed 2026-10-04). By explicit user
// decision, every field here — not just fee, unlike CQU/Bond — comes from the partner-platform list
// only and is unverified. feeVerified is false and annualAUD/annualINR/totalAUD stay 0, so these
// courses never enter budget hubs, the course matcher or price schema. pswEligible is false on every
// row: lib/course-faqs.ts checks this first and suppresses any post-study-work visa claim, because an
// unconfirmed CRICOS status means international eligibility itself cannot be asserted. No CRICOS code
// or course code is invented (both ''); the course detail page has no "Course code / CRICOS" row.
// \`url\` is the university's general homepage, never presented as the specific official course page.
//
// 149 raw partner rows → ${courses.length} distinct programmes (1 exact duplicate collapsed; 1 same-name
// pair with two different fees kept as a tuitionMin–MaxAUD range).

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
  /** Partner-platform figures — the ONLY source for this university. Always shown labelled as estimates. */
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
