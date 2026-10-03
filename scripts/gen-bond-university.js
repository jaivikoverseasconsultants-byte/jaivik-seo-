// Writes data/bond-university-courses.ts from data/wave-australia/bond-university.json.
//
//   node scripts/crawl-bond-university.js && node scripts/gen-bond-university.js
//
// Every published figure is Bond's: name, programme code, duration and Gold Coast intakes from the
// programme's /api/program-details record; fees from the programme's own fee widget
// (/api/program-fees), international column, earliest commencement year Bond prices. KC
// (coursefinder.ai) only said which programmes to look for. Its "initial deposit" is carried
// separately as kcEstimate — Bond publishes none — and the course page labels it as a
// partner-platform estimate.
//
// Fees are kept in the shape Bond publishes them, never annualised: Bond teaches three semesters a
// year, so a semester fee times anything is our arithmetic, not Bond's. KC's "Tuition/yr" did exactly
// that (A$25,040 x 3 = A$75,120) and, for some double degrees, divided the total by four instead
// (A$250,400 / 4 = A$62,600) — which is why KC showed one programme at two fees. annualAUD is set only
// where Bond itself publishes an annual fee (Physiotherapy); everywhere else it stays 0, so these rows
// never enter annual-fee comparisons (budget hubs, the course matcher, price-band pages).
//
// English: not published per programme here — Bond's entry-requirements pages were not crawled, so
// no IELTS/TOEFL/PTE score is stated (englishScope marks the row) until they are verified.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data/wave-australia/bond-university.json');
const OUT = path.join(ROOT, 'data/bond-university-courses.ts');
const RATE_TO_INR = { AUD: 54.6, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const LEVELS = {
  'Bachelor Degree': ['Bachelor', 'Undergraduate'],
  'Bachelor Honours Degree': ['Bachelor', 'Undergraduate'],
  'Masters Degree (Coursework)': ['Master', 'Postgraduate'],
  'Masters Degree (Extended)': ['Master', 'Postgraduate'],
  'Diploma': ['Diploma', 'Undergraduate'],
  'Doctoral Degree': ['Doctorate', 'Postgraduate'],
  'Doctoral Degree (Professional)': ['Doctorate', 'Postgraduate'],
};

// "2 years 8 months (8 semesters)" -> 2.7; "92 weeks" -> 1.8; "8 months (2 semesters)" -> 0.7
function years(duration) {
  const y = Number((duration.match(/(\d+)\s*years?/) || [])[1] || 0);
  const m = Number((duration.match(/(\d+)\s*months?/) || [])[1] || 0);
  const w = Number((duration.match(/(\d+)\s*weeks?/) || [])[1] || 0);
  return Math.round((y + m / 12 + w / 52) * 10) / 10;
}

const aud = (n) => `A$${n.toLocaleString('en-US')}`;

const rows = [];
// Programmes Bond's own record gives no upcoming Gold Coast intake: nobody can apply, so no page.
// Bachelor of Exercise and Sports Science says why ("suspended from May 2026 ... no further intakes",
// replaced by the Bachelor of Clinical Exercise Physiology); the others carry no notice, just no offering.
const noIntake = [];
for (const r of crawl.results) {
  if (r.status !== 200) throw new Error(`${r.slug}: Bond page not found (${r.status}) — map it or list it in NOT_OFFERED`);
  const p = r.details?.programs?.[0];
  if (!p) throw new Error(`${r.slug}: no programme record`);
  const level = LEVELS[p.type];
  if (!level) throw new Error(`${r.slug}: unmapped programme type "${p.type}"`);
  const name = p.name.replace(/\s+-\s+[A-Z]{2}-\d+$/, '').replace(/\s+/g, ' ').trim();
  const code = p.id;

  // Gold Coast, on campus — the offering an international student on a student visa takes.
  const onCampus = (p.offerings || []).filter((o) => o.deliveryMode === 'On-Campus' && /Gold Coast/.test(o.location));
  const intakeMonths = MONTH_ORDER.filter((m) => onCampus.some((o) => o.semester.startsWith(m)));
  if (!intakeMonths.length) { noIntake.push(name); continue; }

  const priced = (r.fees?.fees || []).filter((f) => f.international?.total).sort((a, b) => a.year.localeCompare(b.year));
  const fy = priced[0];
  const intl = fy?.international;
  const row = {
    id: `bond-${rows.length + 1}`,
    name,
    // same prefix as the July 2026 file this replaces, so its URLs for the same programmes resolve again
    slug: `bond-${slugify(name)}`,
    url: r.url,
    level: level[0],
    studyLevel: level[1],
    duration: p.duration,
    durationYears: years(p.duration),
    annualAUD: 0, annualUSD: 0, annualINR: 0,
    semesterAUD: null, totalAUD: 0, feeYear: null,
    ieltsMin: 0, toeflMin: 0, pteMin: 0,
    englishScope: 'not published — Bond states English requirements on each programme\'s entry-requirements page, which has not been verified here',
    intakeMonths,
    campus: 'Gold Coast',
    country: 'Australia', state: 'Queensland', city: 'Gold Coast', countryCode: 'AU',
    courseCode: code,
    ...(/pathway/i.test(r.kcRows[0]?.note || '') || level[0] === 'Diploma' ? { pathway: true } : {}),
    feeVerified: false,
    feeScope: 'not published',
    feeBasis: 'not published — Bond\'s fee widget for this programme gives no international fee',
    feeSourceUrl: null,
  };
  if (intl) {
    Object.assign(row, {
      semesterAUD: intl.semester || null,
      totalAUD: intl.total,
      feeYear: Number(fy.year),
      feeVerified: true,
      feeScope: 'programme',
      feeBasis: `Bond's indicative international tuition for students commencing in ${fy.year}: ${[
        intl.semester ? `${aud(intl.semester)} per semester` : null,
        intl.annual ? `${aud(intl.annual)} a year` : null,
        `${aud(intl.total)} for the whole programme`,
      ].filter(Boolean).join(', ')}. Bond notes that fees vary with the subjects taken and are charged at the rate for the year of enrolment`,
      feeSourceUrl: `${r.url}/fees`,
    });
    if (intl.annual) {
      Object.assign(row, {
        annualAUD: intl.annual,
        annualINR: Math.round(intl.annual * RATE_TO_INR.AUD),
        annualUSD: Math.round((intl.annual * RATE_TO_INR.AUD) / RATE_TO_INR.USD),
      });
    }
  }
  const dep = r.kcRows.map((k) => k.initialDepositAUD).find((d) => d > 0);
  if (dep) row.kcEstimate = { avgScholarshipAUD: null, initialDepositAUD: dep };
  rows.push(row);
}

const slugs = new Set();
for (const r of rows) { if (slugs.has(r.slug)) throw new Error(`duplicate slug ${r.slug}`); slugs.add(r.slug); }

const out = `// Bond University — Gold Coast, Queensland
// Generated by scripts/gen-bond-university.js from data/wave-australia/bond-university.json — do not edit by hand.
// Discovery: KC (coursefinder.ai) listed which programmes exist; KC is not a source for any figure here.
// Bond publishes no fee schedule ("All fees are listed on each individual program page"), so each row is
// read from its own programme page:
//   facts — https://bond.edu.au/program/<slug> → /api/program-details/<id> (name, code, duration, intakes)
//   fees  — https://bond.edu.au/program/<slug>/fees → /api/program-fees/<id>/<code> (international column)
// Verified: ${crawl._crawledOn}. Fees are Bond's indicative per-semester fee and programme total for the
// earliest year it prices (2026; 2027 for programmes whose first intake is 2027) — never annualised,
// because Bond teaches three semesters a year. annualAUD is set only where Bond publishes an annual fee.
// Found on Bond's own site, not on KC's list (genuine equivalents of URLs from the July 2026 file):
//   ${crawl.results.filter((r) => r.discoveredOn && rows.some((x) => x.url === r.url)).map((r) => rows.find((x) => x.url === r.url).name).join('; ')}.
// Not offered by Bond, so not listed: ${[...new Set(crawl.dropped.map((d) => d.kcName))].join('; ')}.
// No upcoming intake on Bond's record, so not listed: ${noIntake.join('; ')}.
// ${rows.length} courses

export interface BondUniversityCourse {
  feeVerified?: boolean;
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  /** Bond's indicative fee per semester, where Bond publishes one. */
  semesterAUD: number | null;
  /** Bond's indicative total for the whole programme. */
  totalAUD: number;
  /** Commencement year the fee figures apply to. */
  feeYear: number | null;
  ieltsMin: number; toeflMin: number; pteMin: number; englishScope?: string;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
  courseCode: string; pathway?: boolean;
  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;
  /** KC partner-platform figures. Bond publishes neither; always shown labelled as estimates. */
  kcEstimate?: { avgScholarshipAUD: number | null; initialDepositAUD: number | null };
}

export const bondUniversityCourses: BondUniversityCourse[] = [
${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}
];

export function getBondUniversityCourseBySlug(slug: string): BondUniversityCourse | undefined {
  return bondUniversityCourses.find(c => c.slug === slug);
}
`;
fs.writeFileSync(OUT, out);
const by = (f) => rows.filter(f).length;
console.log(`no upcoming intake: ${noIntake.join('; ')}`);
console.log(`wrote ${rows.length} courses | fee verified ${by((r) => r.feeVerified)} | per-semester ${by((r) => r.semesterAUD)} | total only ${by((r) => r.feeVerified && !r.semesterAUD && !r.annualAUD)} | annual ${by((r) => r.annualAUD)} | 2027 fees ${by((r) => r.feeYear === 2027)} | KC deposit ${by((r) => r.kcEstimate)}`);
