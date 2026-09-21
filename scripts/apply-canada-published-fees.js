// Applies international tuition that Canadian universities publish OUTSIDE their programme
// pages (fee calculators, faculty tables, guarantee PDFs) onto the generated course files.
//
// Why a separate pass: data/dal-courses.ts (gen-dal-real.js) and data/waterlooug-courses.ts
// (ca-generate.js) are generated, so a hand edit would be lost on the next regeneration.
// Re-run this after either generator:   node scripts/apply-canada-published-fees.js
// It is idempotent — every value is recomputed from the evidence files below.
//
// Evidence (retrieved 2026-09-17, all from the universities' own sites):
//   data/wave-canada/dal-intl-tuition-guarantee.json    Dal international tuition guarantee
//   data/wave-canada/waterloo-intl-fees-by-faculty.json Waterloo per-term schedule + first-year table
//   data/wave-canada/waterloo-programme-faculty.json    faculty named on each Waterloo programme page
//
// Decisions (2026-09-17):
//   Waterloo — use the published first-year table (two terms, tuition + incidental fees) as-is;
//              never per-term × 2. instTuitionPerTermCAD is corrected to the programme's own
//              faculty rate (it was the Arts rate, 27,010, on all 107 rows).
//   Dalhousie — bachelor's only, where every faculty the programme belongs to is on the
//              guarantee at the same rate. The guarantee is an annual, tuition-only figure.
// Anything ambiguous is left feeVerified:false for manual review, never guessed.

// PROGRAMME-LEVEL facts checked one programme at a time against the university's own pages
// (2026-09-19, prompted by a coursefinder.ai lead list — the leads were pointers only; every number
// below was read off the university's own site, and anything its site does not state is left out).
// Each entry names the pages it came from so the next person can re-check it.
const PROGRAMME_VERIFIED = {
  'data/dal-courses.ts': [
    {
      slug: 'dal-applied-computer-science-macsc',
      // Dalhousie bills a master's international student the programme fee PLUS an international
      // tuition fee; this programme's page states the international fee is charged at the
      // thesis-option rate, so: 11,303 + 8,079 = 19,382 a year.
      annualCAD: 11303 + 8079,
      feeScope: 'programme fee + international tuition fee',
      feeBasis: 'annual — programme fee C$11,303 plus the international tuition fee C$8,079 at the thesis-option rate (payable for up to 2 years)',
      feeSourceUrl: 'https://www.dal.ca/content/dam/www/admissions/cost-and-payment/tuition-and-fee-schedules/masters-tuition-fee-schedule.pdf',
      englishVerified: {
        ielts: 7,
        toefl: 92,
        pte: 65,
        sourceUrl: 'https://www.dal.ca/study/programs/graduate-professional/applied-computer-science-macsc.html',
        verifiedOn: '2026-09-19',
      },
    },
  ],
  'data/tmu-courses.ts': [
    {
      slug: 'tmu-computer-science-bsc-hons',
      // The programme page's "Tuition and fees range 2026-2027" table gives the full-time
      // international figure as a narrow range, C$38,702–38,762. The stored 38,702 is its lower
      // bound, so the number was right and only its basis was unknown.
      annualCAD: 38702,
      feeScope: 'programme page',
      feeBasis: 'full-time tuition and fees, international, 2026-27 (TMU publishes a range, C$38,702–C$38,762)',
      feeSourceUrl: 'https://www.torontomu.ca/programs/undergraduate/computer-science/',
    },
    // These two programmes publish only a PART-TIME range (International C$4,075–C$29,835). The
    // stored 4,075 was that range's lower bound stored as an annual fee — wrong, and worse than
    // blank because hub pages filter courses on the fee field. Cleared until a full-time
    // figure exists to quote.
    { slug: 'tmu-health-administration-bha', clearFee: true, feeBasis: 'not published — TMU lists only a part-time range for this programme (international C$4,075–C$29,835)', feeSourceUrl: 'https://www.torontomu.ca/programs/undergraduate/health-administration/' },
    { slug: 'tmu-public-administration-and-governance-ba-hons', clearFee: true, feeBasis: 'not published — TMU lists only a part-time range for this programme (international C$4,075–C$29,835)', feeSourceUrl: 'https://www.torontomu.ca/programs/undergraduate/public-administration-governance/' },
  ],
  'data/guelph-courses.ts': [
    {
      slug: 'guelph-public-health',
      // Guelph's registrar publishes international tuition per graduate programme. The table is
      // headed "These amounts reflect tuition only for three semesters (unless noted)" and its
      // figures are the approved 2027-28 rates.
      annualCAD: 38808,
      feeScope: 'programme (university fee schedule)',
      feeBasis: 'tuition only for three semesters, 2027-28 rate approved by the Board of Governors',
      feeSourceUrl: 'https://www.uoguelph.ca/registrar/finances-fees/tuition-fees',
    },
  ],
  'data/algonquin-courses.ts': [
    {
      slug: 'algonquin-business-supply-chain-and-operations-ottawa-ontario-college-diploma-2-years-full',
      // The programme page states IELTS 6.0 (5.5 per band) and TOEFL iBT 80 (components 20) for
      // tests before 21 Jan 2026, plus Duolingo. It names no PTE score, and neither does
      // Algonquin's international admission requirements page — so PTE is left out and stays
      // suppressed. No fee: the page sends you to Algonquin's Tuition and Fees Estimator instead.
      englishVerified: {
        ielts: 6,
        toefl: 80,
        sourceUrl: 'https://www.algonquincollege.com/business-hospitality/program/business-supply-chain-and-operations/',
        verifiedOn: '2026-09-21',
      },
    },
  ],
};

// INSTITUTION-LEVEL English confirmed on the university's own requirements page, applied to the
// rows it actually covers. Manitoba states its scores for UNDERGRADUATE admission and says
// graduate programmes set their own, so only undergraduate rows publish; the graduate ones keep
// saying "ask us" rather than borrowing an undergraduate floor.
const INSTITUTION_ENGLISH = [
  {
    file: 'data/umanitoba-courses.ts',
    appliesTo: (c) => c.studyLevel === 'Undergraduate',
    scores: { ielts: 6.5, toefl: 86, pte: 58 },
    // the row fields too, so the stored number is right even where it is suppressed
    fields: { ieltsMin: 6.5, toeflMin: 86, pteMin: 58 },
    sourceUrl: 'https://umanitoba.ca/explore/undergraduate-admissions/requirements/english-language-proficiency-requirements',
    verifiedOn: '2026-09-21',
    note: 'IELTS 6.5 overall (6.0 per module), TOEFL iBT 86 for tests before 20 Jan 2026, Pearson Test of English 58. The stored PTE was 59, which Manitoba does not publish.',
  },
  {
    file: 'data/waterlooug-courses.ts',
    appliesTo: () => true, // every row in this file is an undergraduate programme
    scores: { ielts: 6.5, toefl: 90, pte: 63 },
    fields: { ieltsMin: 6.5, toeflMin: 90, pteMin: 63 },
    sourceUrl: 'https://uwaterloo.ca/future-students/admissions/english-language-requirements',
    verifiedOn: '2026-09-21',
    note: 'IELTS 6.5 overall (6.5 writing/speaking, 6.0 reading/listening), TOEFL iBT 90 overall (25 writing, 25 speaking) for tests before 21 Jan 2026, PTE Academic 63 overall. The stored 7.0 came from a line further down the same page offering IELTS 7.0 with no band below 6.0 as an ALTERNATIVE acceptable combination — not the minimum. The stored TOEFL 86 was a house default.',
  },
  {
    file: 'data/tmu-courses.ts',
    appliesTo: () => true,
    // TMU's table has two columns: one for "all Engineering programs and all Science programs
    // except Computer Science and Architectural Science", one for "all other TMU programs,
    // including Computer Science and Architectural Science". IELTS and PTE are identical in both;
    // only TOEFL differs, so TOEFL is published only where the column is unambiguous from the
    // programme name and left suppressed everywhere else.
    scores: { ielts: 6.5, pte: 60 },
    fields: { ieltsMin: 6.5, pteMin: 60 },
    overrides: [
      { match: /computer science|architectural science/i, scores: { ielts: 6.5, pte: 60, toefl: 92 }, why: 'named in the "all other TMU programs" column' },
      { match: /engineering/i, scores: { ielts: 6.5, pte: 60, toefl: 83 }, why: 'all Engineering programs' },
    ],
    sourceUrl: 'https://www.torontomu.ca/admissions/undergraduate/requirements/english-language/',
    verifiedOn: '2026-09-21',
    note: 'IELTS 6.5 and PTE 60 apply to every programme. TOEFL is 83 for Engineering and 92 for Computer Science and Architectural Science; for the rest it depends on whether the programme is a Science programme, which the row data does not record, so TOEFL stays suppressed there.',
  },
  {
    file: 'data/yorku-courses.ts',
    appliesTo: () => true,
    scores: { ielts: 6.5, toefl: 88, pte: 60 },
    fields: { ieltsMin: 6.5, toeflMin: 88, pteMin: 60 },
    sourceUrl: 'https://futurestudents.yorku.ca/requirements/language-tests',
    verifiedOn: '2026-09-21',
    note: 'York states one set of minimums for "most programs" — IELTS 6.5, TOEFL iBT 88 (before Jan 2026), PTE 60 — and a table of programmes that need more. The stored TOEFL 86 and PTE 70/58 were house defaults.',
    // programmes York lists separately, from the same page
    overrides: [
      { match: /nursing/i, scores: { ielts: 7, toefl: 94, pte: 67 }, why: 'Health: Nursing' },
      { match: /TESOL/i, scores: { ielts: 7, toefl: 102 }, why: 'Liberal Arts and Professional Studies: TESOL Certificate' },
    ],
    // York sends these to another site for the requirement, so nothing is published for them
    skip: { match: /consecutive education|bachelor of education|\bB\.?Ed\b/i, why: 'Education: Consecutive Education — York refers applicants to the Faculty of Education website' },
  },
];

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FX = { usd: 0.73, inr: 61 }; // same factors as scripts/ca-generate.js
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

function loadArray(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const m = src.match(/(export const \w+\s*:\s*\w+\[\]\s*=\s*)(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error(`no course array in ${file}`);
  return { src, head: m[1], arr: JSON.parse(m[2]), whole: m[0] };
}

function writeArray(file, doc, arr) {
  const out = doc.src.replace(doc.whole, `${doc.head}${JSON.stringify(arr, null, 2)};`);
  fs.writeFileSync(path.join(ROOT, file), out);
}

function setFee(c, annualCAD, fields) {
  c.annualCAD = annualCAD;
  c.annualUSD = Math.round(annualCAD * FX.usd);
  c.annualINR = Math.round(annualCAD * FX.inr);
  c.totalCAD = Math.round(annualCAD * c.durationYears);
  c.feeVerified = true;
  Object.assign(c, fields);
}

// ── Dalhousie ────────────────────────────────────────────────────────────────
function applyDal() {
  const file = 'data/dal-courses.ts';
  const ev = read('data/wave-canada/dal-intl-tuition-guarantee.json');
  const bySlug = new Map(ev.rows.map(r => [r.slug, r]));
  const doc = loadArray(file);
  let n = 0;
  for (const c of doc.arr) {
    const r = bySlug.get(c.slug);
    if (!r || !r.guaranteedAnnualCAD) continue;
    setFee(c, r.guaranteedAnnualCAD, {
      feeScope: 'faculty (international tuition guarantee)',
      feeBasis: 'annual, tuition only (excludes incidental and co-op fees)',
      feeSourceUrl: 'https://www.dal.ca/admissions/cost-and-payment/tuition/international-tuition-guarantee.html',
    });
    n++;
  }
  // The legacy DalCourse interface predates the provenance fields.
  if (!/feeBasis\?: string/.test(doc.src)) {
    doc.src = doc.src.replace('export interface DalCourse {\n  feeVerified?: boolean;',
      'export interface DalCourse {\n  feeVerified?: boolean;\n  feeScope?: string;\n  feeBasis?: string;\n  feeSourceUrl?: string | null;');
  }
  writeArray(file, doc, doc.arr);
  return n;
}

// ── Waterloo (undergraduate) ─────────────────────────────────────────────────
const UW_FIRST_YEAR_BY_NAME = [
  [/^(Accounting|Sustainability) and Financial Management$/, 58000],
  [/^Architecture$/, 75000],
  [/^Business Administration \(Laurier\) and Computer Science/, 75000],
  [/^Business Administration \(Laurier\) and Mathematics/, 64000],
  [/^Computer Science$/, 73000],
  [/^Computing and Financial Management$/, 64000],
  [/^Global Business and Digital Arts$/, 56000],
  [/^Geography and Aviation$/, 51000],
  [/^Science and Aviation$/, 54000],
  [/^Mathematics\/Financial Analysis and Risk Management$/, 63000],
  [/^Software Engineering$/, 75000],
];
const UW_FIRST_YEAR_BY_FACULTY = { Arts: 58000, Engineering: 75000, Environment: 51000, Health: 54000, Science: 54000, Mathematics: 62000 };
const UW_PER_TERM_BY_NAME = [
  [/^(Architecture|Software Engineering|Computer Science|Data Science)$|^Business Administration \(Laurier\) and Computer Science/, 34942],
  [/^Mathematics\/Financial Analysis and Risk Management$/, 29828],
  [/^Global Business and Digital Arts$/, 26378],
];
const UW_PER_TERM_BY_FACULTY = { Arts: 27010, Engineering: 34942, Environment: 23598, Health: 25296, Science: 25296, Mathematics: 29259 };
// Not in the first-year table, or the page names faculties with different rates.
const UW_REVIEW = new Set(['Data Science', 'Optometry', 'Pharmacy', 'Pre-law',
  'Double degree program in human rights and law', 'Social Development Studies and Bachelor of Social Work Double']);

function uniqueRate(faculties, table) {
  const rates = [...new Set(faculties.map(f => table[f]))];
  return faculties.length && rates.length === 1 && rates[0] ? rates[0] : null;
}

function applyWaterloo() {
  const file = 'data/waterlooug-courses.ts';
  const map = new Map(read('data/wave-canada/waterloo-programme-faculty.json').map(r => [r.slug, r.faculties]));
  const doc = loadArray(file);
  const review = [];
  let n = 0;
  for (const c of doc.arr) {
    const fac = map.get(c.slug) || [];
    const byName = (tbl) => (tbl.find(([re]) => re.test(c.name)) || [])[1];
    c.instTuitionPerTermCAD = byName(UW_PER_TERM_BY_NAME) ?? uniqueRate(fac, UW_PER_TERM_BY_FACULTY);
    const firstYear = UW_REVIEW.has(c.name) ? null : (byName(UW_FIRST_YEAR_BY_NAME) ?? uniqueRate(fac, UW_FIRST_YEAR_BY_FACULTY));
    if (!firstYear) { review.push(`${c.name} [${fac.join('+') || 'no faculty on page'}]`); continue; }
    setFee(c, firstYear, {
      feeScope: 'faculty/programme table',
      feeBasis: 'first year (two terms), tuition + incidental fees, rounded',
      feeSourceUrl: 'https://uwaterloo.ca/future-students/financing/tuition',
    });
    n++;
  }
  writeArray(file, doc, doc.arr);
  return { n, review };
}

// ── Programme-level verified facts ───────────────────────────────────────────
function applyProgrammeVerified() {
  const applied = [];
  for (const [file, rows] of Object.entries(PROGRAMME_VERIFIED)) {
    const doc = loadArray(file);
    for (const entry of rows) {
      const c = doc.arr.find((x) => x.slug === entry.slug);
      if (!c) throw new Error(`${file}: no row with slug ${entry.slug}`);
      const { slug, annualCAD, englishVerified, clearFee, ...fields } = entry;
      if (clearFee) {
        // zero rather than a wrong number: the fee surfaces guard on feeVerified, but hub filters
        // read the fee field directly, so a bogus figure would still pull the course into a
        // "cheapest" or budget-band list
        c.annualCAD = 0; c.annualUSD = 0; c.annualINR = 0; c.totalCAD = 0;
        c.feeVerified = false;
        Object.assign(c, fields);
      } else if (annualCAD) setFee(c, annualCAD, fields);
      if (englishVerified) c.englishVerified = englishVerified;
      applied.push(slug);
    }
    writeArray(file, doc, doc.arr);
  }
  return applied;
}

function applyInstitutionEnglish() {
  const out = [];
  for (const entry of INSTITUTION_ENGLISH) {
    const doc = loadArray(entry.file);
    let n = 0;
    let skipped = 0;
    let overridden = 0;
    for (const c of doc.arr) {
      if (!entry.appliesTo(c)) continue;
      if (entry.skip?.match.test(c.name)) { delete c.englishVerified; skipped++; continue; }
      const override = (entry.overrides ?? []).find((o) => o.match.test(c.name));
      const scores = override ? override.scores : entry.scores;
      Object.assign(c, entry.fields);
      if (override) {
        if (override.scores.ielts) c.ieltsMin = override.scores.ielts;
        if (override.scores.toefl) c.toeflMin = override.scores.toefl;
        if (override.scores.pte) c.pteMin = override.scores.pte;
        overridden++;
      }
      c.englishVerified = { ...scores, sourceUrl: entry.sourceUrl, verifiedOn: entry.verifiedOn };
      n++;
    }
    writeArray(entry.file, doc, doc.arr);
    out.push(`${entry.file}: ${n} rows${overridden ? `, ${overridden} programme-specific` : ''}${skipped ? `, ${skipped} left unpublished` : ''}`);
  }
  return out;
}

const dal = applyDal();
const uw = applyWaterloo();
const programme = applyProgrammeVerified();
const instEnglish = applyInstitutionEnglish();
console.log(`Dalhousie: ${dal} bachelor's rows verified from the international tuition guarantee`);
console.log(`Waterloo:  ${uw.n} rows verified from the first-year table; per-term rate corrected on all rows`);
console.log(`Institution English applied: ${instEnglish.join("; ")}`);
console.log(`Programme-level verified rows: ${programme.length} (${programme.join(", ")})`);
console.log(`Waterloo left for manual review (${uw.review.length}):\n  ${uw.review.join('\n  ')}`);
