// Builds data/ucc-courses.ts from University College Cork's OWN published data.
//
//   node scripts/gen-ucc-real.js
//
// Evidence (data/wave-ireland/, retrieved 2026-09-22, all from ucc.ie):
//   ucc-course-catalogue.json     UCC's course finder array — what UCC teaches and calls it
//   ucc-noneu-fees-2027-28.json   the Non-EU fee schedules; course pages carry no fee figure
//   ucc-english-requirements.json the undergraduate and postgraduate proficiency tables
//
// What this replaces: 75 hand-curated rows whose 55 undergraduate entries had real CK codes but
// unverified fees, and whose 20 postgraduate entries pointed at a generic /study/postgrad/ landing
// page rather than a course. None of it was reachable — UCC was missing from the registry and
// vercel.json redirected its course URLs to the profile page.
//
// Scope: UCC's Undergraduate and Postgraduate courses only. The finder also lists Continuing
// Professional Development, Adult Continuing Education, Micro-Credentials and International Office
// entries; those are not degree programmes an international student applies for and are skipped.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const catalogue = read('data/wave-ireland/ucc-course-catalogue.json');
const fees = read('data/wave-ireland/ucc-noneu-fees-2027-28.json');
const english = read('data/wave-ireland/ucc-english-requirements.json');

// Ireland: EUR. Same rates the rest of the portal uses (lib/currency.ts).
const FX = { usd: 1.08, inr: 90.8 };
const LIVING_EUR = 12000;

const slugify = (s) => `ucc-${s.toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')}`;

const norm = (s) => (s || '').toLowerCase()
  .replace(/&/g, 'and').replace(/\(.*?\)/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ').trim();

// ── fees ─────────────────────────────────────────────────────────────────────
const ckOf = (s) => (s || '').match(/\bck\s?([0-9]{3,4}[a-z]?)\b/i)?.[1]?.toLowerCase() ?? null;
const ugFeeByCk = new Map();
for (const r of fees.undergraduate) if (r.ck) ugFeeByCk.set(r.ck.replace(/^ck/, ''), r);

// The schedule names a programme as "<name> - <award>", but not consistently: some rows use an
// en dash ("Microbiome Science – MSc") and some carry a trailing qualifier after the award
// ("… - MSc - January Intake"). Splitting on " - " and taking the last part as the award misreads
// both. Instead find the part that IS an award and treat everything before it as the name.
const AWARD = /^(msc|ma|mba|mres|md|mch|msw|med|mph|mplan|mengsc|msocsc|mmedsc|pme|llm|llb|hdip|pg ?dip|pg ?cert|dip|cert|phd|dclindent|thematic phd)\b/;
const splitAward = (name) => {
  const parts = name.replace(/[–—]/g, ' - ').split(' - ').map((s) => s.trim()).filter(Boolean);
  const i = parts.findIndex((p) => AWARD.test(norm(p)));
  if (i <= 0) return { base: norm(name), award: '' };
  return { base: norm(parts.slice(0, i).join(' - ')), award: norm(parts[i]).split(' ')[0] };
};
const pgFees = fees.postgraduateNonEu.map((r) => ({ ...r, ...splitAward(r.name) }));

// ── English ──────────────────────────────────────────────────────────────────
const englishFor = (type, title) => {
  const table = type === 'Undergraduate' ? english.undergraduate : english.postgraduate;
  const t = norm(title);
  const hit = table.exceptions.find((e) => t.includes(norm(e.match)));
  const s = hit || table.standard;
  return {
    ielts: s.ielts,
    toefl: s.toefl,
    pte: s.pte,
    sourceUrl: `https://www.ucc.ie/en/study/comparison/english/${type === 'Undergraduate' ? 'undergraduate' : 'postgraduate'}/`,
    verifiedOn: '2026-09-22',
  };
};

// ── duration ─────────────────────────────────────────────────────────────────
// UCC writes durations as "4 Yr FT", "12 Months", "3 or 4 Yr FT", "2 Years (Part-time)".
function durationYears(text) {
  const s = String(text || '');
  const months = s.match(/(\d+)\s*months?/i);
  if (months) return Math.max(1, Math.round(Number(months[1]) / 12));
  const years = [...s.matchAll(/(\d+(?:\.\d+)?)\s*(?:yr|years?)/gi)].map((m) => Number(m[1]));
  if (years.length) return Math.min(...years); // "3 or 4 Yr" — quote the shorter, standard route
  return null;
}

// ── build ────────────────────────────────────────────────────────────────────
const rows = [];
const review = { unpricedUG: [], unpricedPG: [], ambiguousPG: [], noDuration: [], subjectPages: [] };
const seen = new Set();

// Reuse the slugs the previous hand-curated file used, so the URLs stay put from here on. This
// reads a checked-in record rather than the generated file — reading the output meant a second run
// took its own slugs as the baseline and quietly lost the original ones.
const legacySlugs = new Map(read('data/wave-ireland/ucc-legacy-slugs.json').pairs.map((p) => [norm(p.name), p.slug]));
const usedLegacy = new Set();

for (const c of catalogue.rows) {
  if (c.type !== 'Undergraduate' && c.type !== 'Postgraduate') continue;
  if (!c.link || !c.title) continue;
  // A link nested under a course code page (/en/ck101/folklore/) is a SUBJECT you can take within
  // that degree, not a degree of its own. UCC lists 52 of them; each would otherwise become its own
  // page describing the same BA, competing with the real one.
  if (/\/en\/ck[0-9]{3,4}[a-z]?\/[a-z0-9-]+\/?$/i.test(c.link)) { review.subjectPages.push(`${c.title} — ${c.link}`); continue; }
  // UCC marks a few entries as a subject rather than a course in the code field itself
  if (/subject available/i.test(c.code || '')) { review.subjectPages.push(`${c.title} — ${c.code}`); continue; }

  const isUG = c.type === 'Undergraduate';
  const legacy = legacySlugs.get(norm(c.title));
  let slug = legacy && !usedLegacy.has(legacy) ? legacy : slugify(c.title);
  if (slug === legacy) usedLegacy.add(legacy);
  // UCC lists some titles more than once (different award or intake); disambiguate with the course
  // code, then a counter — appending the code repeatedly produced ucc-arts-international-ck101-ck101
  if (seen.has(slug)) {
    const code = (c.code || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const withCode = code ? `${slug}-${code}` : slug;
    slug = withCode;
    for (let n = 2; seen.has(slug); n++) slug = `${withCode}-${n}`;
  }
  seen.add(slug);

  // fee
  let fee = null; let feeBasis = null; let feeSourceUrl = null; let feeScope = null;
  if (isUG) {
    const ck = ckOf(c.code) || ckOf(c.link);
    const hit = ck && ugFeeByCk.get(ck);
    if (hit) {
      fee = hit.fee;
      feeScope = 'programme (university fee schedule)';
      feeBasis = 'total annual Non-EU fee for 2027-28, including the capitation fee';
      feeSourceUrl = 'https://www.ucc.ie/en/financeoffice/fees/schedules/internationalundergraduatefees202728/';
    } else review.unpricedUG.push(`${c.title} [${c.code}]`);
  } else {
    const base = norm(c.title); const award = norm(c.qualification).split(' ')[0];
    let cands = pgFees.filter((r) => r.base === base && (!award || r.award === award));
    if (cands.length > 1) {
      const ft = cands.filter((r) => /full.?time/i.test(r.mode));
      if (ft.length) cands = ft;
    }
    // several distinct prices left for one programme — never pick one
    const prices = new Set(cands.map((r) => r.fee));
    if (prices.size === 1) {
      fee = cands[0].fee;
      feeScope = 'programme (university fee schedule)';
      feeBasis = 'total annual Non-EU fee for 2027-28, including the capitation fee';
      feeSourceUrl = 'https://www.ucc.ie/en/financeoffice/fees/schedules/postgraduateeuandinternationalfees202728/';
    } else if (prices.size > 1) review.ambiguousPG.push(`${c.title} [${c.qualification}] — ${[...prices].map((p) => `EUR ${p}`).join(' / ')}`);
    else review.unpricedPG.push(`${c.title} [${c.qualification || 'no award'}]`);
  }

  const yrs = durationYears(c.duration);
  if (!yrs) review.noDuration.push(`${c.title} — "${c.duration}"`);
  const years = yrs ?? (isUG ? 4 : 1);

  const eng = englishFor(c.type, c.title);

  rows.push({
    id: `ucc-${rows.length + 1}`,
    name: c.title,
    slug,
    url: c.link.startsWith('http') ? c.link : `https://www.ucc.ie${c.link}`,
    level: c.qualification || (isUG ? 'Bachelor' : 'Masters'),
    studyLevel: c.type,
    duration: yrs ? `${years} year${years > 1 ? 's' : ''}` : String(c.duration || ''),
    durationYears: years,
    annualEUR: fee ?? 0,
    annualUSD: fee ? Math.round(fee * FX.usd) : 0,
    annualINR: fee ? Math.round(fee * FX.inr) : 0,
    totalEUR: fee ? Math.round(fee * years) : 0,
    livingCostEUR: LIVING_EUR,
    livingCostUSD: Math.round(LIVING_EUR * FX.usd),
    livingCostINR: Math.round(LIVING_EUR * FX.inr),
    ieltsMin: eng.ielts,
    toeflMin: eng.toefl,
    pteMin: eng.pte,
    intakeMonths: ['September'],
    campus: 'Cork',
    country: 'Ireland',
    state: 'Munster',
    city: 'Cork',
    countryCode: 'IE',
    nfqLevel: c.nfqlevel || '',
    college: c.college || '',
    // an absent feeVerified reads as VERIFIED in lib/fee-verification.ts, so it is always written
    feeVerified: Boolean(fee),
    feeScope: feeScope ?? 'not published',
    feeBasis: feeBasis ?? 'not published — UCC lists no Non-EU fee for this programme in its 2027-28 schedule',
    feeSourceUrl,
    englishVerified: eng,
    englishScope: 'institution-wide',
  });
}

const header = `// University College Cork — generated from UCC's own published data.
// Source of record: data/wave-ireland/ucc-course-catalogue.json (UCC's course finder),
// ucc-noneu-fees-2027-28.json (UCC's Non-EU fee schedules) and ucc-english-requirements.json.
// Regenerate with: node scripts/gen-ucc-real.js — do not edit by hand.
// ${rows.length} courses | generated: 2026-09-22
//
// Fees are UCC's published total annual Non-EU fee for 2027-28 including capitation. Every row
// carries an explicit feeVerified: a programme UCC does not price in that schedule is false, and
// the fee fields are 0 rather than an estimate.

export interface UccCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;
  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[];
  campus: string; country: string; state: string; city: string; countryCode: string;
  nfqLevel: string; college: string;
  feeVerified: boolean; feeScope: string; feeBasis: string; feeSourceUrl: string | null;
  englishVerified: { ielts?: number; toefl?: number; pte?: number; sourceUrl: string; verifiedOn: string };
  englishScope: string;
}

export const uccCourses: UccCourse[] = ${JSON.stringify(rows, null, 1)};

export function getUccCourseBySlug(slug: string): UccCourse | undefined {
  return uccCourses.find((c) => c.slug === slug);
}
`;

fs.writeFileSync(path.join(ROOT, 'data/ucc-courses.ts'), header);

const priced = rows.filter((r) => r.feeVerified).length;
const ug = rows.filter((r) => r.studyLevel === 'Undergraduate');
const pg = rows.filter((r) => r.studyLevel === 'Postgraduate');
console.log(`data/ucc-courses.ts: ${rows.length} courses (${ug.length} undergraduate, ${pg.length} postgraduate)`);
console.log(`  priced from UCC's own schedule: ${priced}  (UG ${ug.filter((r) => r.feeVerified).length}/${ug.length}, PG ${pg.filter((r) => r.feeVerified).length}/${pg.length})`);
console.log(`  English published on all ${rows.length} rows; ${rows.filter((r) => r.ieltsMin >= 7).length} at UCC's higher tier`);
console.log(`  slugs carried over from the previous file: ${rows.filter((r) => legacySlugs.get(norm(r.name)) === r.slug).length}`);
for (const [k, v] of Object.entries(review)) {
  if (!v.length) continue;
  console.log(`\n  ${k} (${v.length}):`);
  v.slice(0, 12).forEach((x) => console.log(`    ${x}`));
  if (v.length > 12) console.log(`    …and ${v.length - 12} more`);
}
