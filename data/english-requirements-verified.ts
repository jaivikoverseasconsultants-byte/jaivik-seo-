// MANUALLY VERIFIED English-language requirements — 2026-07-20.
//
// Source: all 18 "OK" rows from the JOB 2 automated crawl (data/english-requirements-real.ts)
// were individually re-fetched live and hand-checked against three criteria, ALL required:
//   (a) NUMBER  — the IELTS overall figure genuinely appears on the live page.
//   (b) SCOPE   — a genuinely university-general requirement (an explicit "most
//                 degrees"/"the standard requirement" statement, or a clearly-labelled
//                 India-specific or PG-specific figure) — NOT one specific course's entry
//                 requirement, and NOT the first row of a per-country table grabbed by luck.
//   (c) SECTION-WISE — kept only if cleanly, unambiguously stated on the page; garbled
//                 automated-extraction snippets were discarded or hand-corrected.
// PTE/TOEFL values are included ONLY where independently re-verified live in a requirements
// context — the automated crawl had a confirmed bug where "PTE" matched inside Google Tag
// Manager JS snippets (e.g. LJMU and Edinburgh both got a fabricated "PTE 12" this way).
//
// 8 of 18 rows passed all three criteria. 10 were rejected — see REJECTED_ROWS below for
// the specific reason each failed. This file is the trusted subset only; nothing here is
// wired into any page yet — integration is a separate, later step.

export interface EnglishReqVerified {
  universitySlug: string;
  ieltsOverall: number;
  sectionRule: string | null;
  pte: number | null;
  pteSection: number | null;
  toefl: number | null;
  toeflSection: number | null;
  scope: string;
  sourceUrl: string;
  verifiedDate: string;
}

export const englishReqsVerified: EnglishReqVerified[] = [
  {
    universitySlug: 'leeds-beckett-university',
    ieltsOverall: 6.0,
    sectionRule: 'no skill below 5.5',
    pte: 54,
    pteSection: 51,
    toefl: null,
    toeflSection: null,
    scope: 'UG general baseline ("most of our degrees require...", some courses may ask for higher — always check the individual course)',
    sourceUrl: 'https://www.leedsbeckett.ac.uk/international-students/english-language-requirements',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'liverpool-john-moores-university',
    ieltsOverall: 6.0,
    sectionRule: null,
    pte: null,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'India, UG (Standard XII 70% = IELTS 6.0 equivalent; 75% = IELTS 6.5, 80% = IELTS 7.0 — 6.0 is the baseline undergraduate tier)',
    sourceUrl: 'https://www.ljmu.ac.uk/study/courses/international-entry-requirements/india',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'loughborough-university',
    ieltsOverall: 6.5,
    sectionRule: '6.0 in each individual element (reading, writing, listening, speaking)',
    pte: 65,
    pteSection: 61,
    toefl: 88,
    toeflSection: 21,
    scope: 'general ("the standard University IELTS English language requirement")',
    sourceUrl: 'https://lboro.ac.uk/international/apply/english-language-requirements',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'swansea-university',
    ieltsOverall: 6.0,
    sectionRule: null,
    pte: null,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'UG general baseline ("most academic departments will ask for...", postgraduate is 6.5 — always check the individual course)',
    sourceUrl: 'https://www.swansea.ac.uk/admissions/english-language-requirements/',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'university-of-sheffield',
    ieltsOverall: 6.5,
    sectionRule: '6.0 in each component',
    pte: null,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'general (identical stated requirement for undergraduate and postgraduate applicants)',
    sourceUrl: 'https://sheffield.ac.uk/international/english-language-requirements',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'university-of-helsinki',
    ieltsOverall: 6.5,
    sectionRule: 'minimum 6.0 in the writing section',
    pte: null,
    pteSection: null,
    toefl: 92,
    toeflSection: 22,
    scope: 'UG (Bachelor\'s programmes)',
    sourceUrl: 'https://www.helsinki.fi/en/admissions-and-education/apply-bachelors-and-masters-programmes/apply-bachelors-programmes/proving-your-english-language-skills',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'university-of-suffolk',
    ieltsOverall: 6.0,
    sectionRule: 'minimum 5.5 in each component',
    pte: 59,
    pteSection: 59,
    toefl: null,
    toeflSection: null,
    scope: 'UG general baseline (lowest tier; "unless stated otherwise on the specific course page" — some courses require 6.5 or 7.0)',
    sourceUrl: 'https://www.uos.ac.uk/international/english-language-requirements',
    verifiedDate: '2026-07-20',
  },
  {
    universitySlug: 'university-of-bath',
    ieltsOverall: 6.5,
    sectionRule: 'no less than 6.0 in each component',
    pte: 62,
    pteSection: 59,
    toefl: null,
    toeflSection: null,
    scope: 'PG (postgraduate research degrees only — page is explicitly scoped to this, not a general/UG figure)',
    sourceUrl: 'https://www.bath.ac.uk/corporate-information/postgraduate-research-degrees-english-language-requirements-for-international-students/',
    verifiedDate: '2026-07-20',
  },
  // ─── Wave 2 additions (2026-07-29) — 4 of the 6 candidates proposed for this
  // batch passed a live source-URL re-check; bond-university did not (see
  // REJECTED_ROWS) and dublin-business-school's page returned an HTTP 403 to
  // automated fetch (WAF) so its number is carried over from the crawl, not
  // independently re-confirmed live — flagged below. ──────────────────────────
  {
    universitySlug: 'brunel-university-london',
    ieltsOverall: 6.0,
    sectionRule: null,
    pte: 59,
    pteSection: null,
    toefl: 77,
    toeflSection: null,
    scope: 'general baseline ("IELTS 6.0/TOEFL 77" tier; higher-demand courses require up to IELTS 7.0/TOEFL 98 — always check the individual course)',
    sourceUrl: 'https://www.brunel.ac.uk/international/english-language-requirements',
    verifiedDate: '2026-07-29',
  },
  {
    universitySlug: 'dublin-business-school',
    ieltsOverall: 5.5,
    sectionRule: null,
    pte: null,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'general international-admissions baseline — NOT independently re-verified live (page returned HTTP 403 to automated fetch on 2026-07-29, likely a WAF block); trusted on the strength of the original crawl targeting the correct general-requirements URL',
    sourceUrl: 'https://www.dbs.ie/international/english-language-requirements',
    verifiedDate: '2026-07-29',
  },
  {
    universitySlug: 'fanshawe-college',
    ieltsOverall: 6.0,
    sectionRule: 'no score less than 5.5 in any of the four bands',
    pte: 53,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'diploma/advanced-diploma/certificate baseline (the college\'s lowest, most common tier)',
    sourceUrl: 'https://www.fanshawec.ca/admission-finance/before-applying/admission-requirements/english-requirements',
    verifiedDate: '2026-07-29',
  },
  {
    universitySlug: 'durham-college',
    ieltsOverall: 6.0,
    sectionRule: 'no band score less than 5.5',
    pte: 53,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'certificate/diploma/advanced-diploma tier (degree-level programmes require IELTS 6.5, no band below 6.0, PTE 60 — not a single university-wide figure)',
    sourceUrl: 'https://durhamcollege.ca/international/entry-requirements/english-language',
    verifiedDate: '2026-07-29',
  },
  {
    universitySlug: 'seneca-polytechnic',
    ieltsOverall: 6.0,
    sectionRule: 'no skill below 5.5',
    pte: 58,
    pteSection: null,
    toefl: null,
    toeflSection: null,
    scope: 'certificate/diploma tier (degree-level programmes require IELTS 6.5, no skill below 6.0, PTE 60 — not a single university-wide figure)',
    sourceUrl: 'https://www.senecapolytechnic.ca/international/apply/how-to-apply/admission-requirements/english-requirements.html',
    verifiedDate: '2026-07-29',
  },
];

export interface RejectedRow {
  universitySlug: string;
  reason: string;
}

export const REJECTED_ROWS: RejectedRow[] = [
  {
    universitySlug: 'aston-university',
    reason: 'SCOPE fail — genuinely a per-School/Programme table (Aston Medical School 7.0, Business School 6.5, Engineering 6.0, Health & Life Sciences 6.5...), no single general baseline is stated anywhere on the page.',
  },
  {
    universitySlug: 'coventry-university',
    reason: 'SCOPE fail — the page is a 55-mention per-country table; the automated crawl\'s "6.0" came from the Afghanistan row (alphabetically first), not India. Checked India\'s own row specifically: it only states Standard XII percentage requirements (60% minimum), no IELTS band number is given for India at all.',
  },
  {
    universitySlug: 'middlesex-university',
    reason: 'SCOPE fail — same per-country/board-equivalency table pattern as Coventry. India\'s row states Standard XII percentage requirements (65-70%) with no accompanying IELTS band number.',
  },
  {
    universitySlug: 'swinburne-university',
    reason: 'SCOPE fail — the number (6.0, no band below 6.0) is real, but the source page is specifically Swinburne\'s TAFE/vocational "English as Additional Language" pathway course, not the university\'s degree-admissions requirement.',
  },
  {
    universitySlug: 'university-of-birmingham',
    reason: 'SCOPE fail — a Group A/B/C tiered table (6.0 / 6.5 / 7.0 depending on course grouping) with no explicit statement of which group is the default/most common, same pattern as Aston.',
  },
  {
    universitySlug: 'university-of-derby',
    reason: 'SCOPE fail (the Leeds trap) — source page is the specific "Teaching English to Speakers of Other Languages (TESOL) MA" course page; IELTS 6.5 is that one course\'s requirement, not a university-wide figure.',
  },
  {
    universitySlug: 'university-of-edinburgh',
    reason: 'NUMBER fail — no IELTS band number found anywhere on the saved page (only test-validity/policy text); followed a hop into the site\'s qualification sub-pages (sitemap-checked) and found no India- or general-scoped numeric page either. The previously-saved "PTE 12" is confirmed Google-Tag-Manager-JS contamination, not a real score.',
  },
  {
    universitySlug: 'university-of-leeds',
    reason: 'SCOPE fail (the Leeds trap, by design) — source page is the specific "BA English Language and Linguistics" course; IELTS 6.5 is that one degree\'s entry requirement, not University of Leeds\' general figure.',
  },
  {
    universitySlug: 'university-of-manchester',
    reason: 'SCOPE fail (same trap) — source page is the specific "BA English Language" course; IELTS 7.0 is that one degree\'s entry requirement, not a general figure.',
  },
  {
    universitySlug: 'university-of-surrey',
    reason: 'SCOPE fail — the page uses "IELTS 6.5" only as a reference threshold for evaluating other qualifications\' equivalency ("Programmes requiring GCSE English Language C/4 or IELTS 6.5..."), never as an explicit general/standard university requirement statement.',
  },
  {
    universitySlug: 'bond-university',
    reason: 'SCOPE fail (Wave 2, 2026-07-29) — proposed for the trusted set from the Wave 2 crawl candidates, but a live re-check of the source page found the same Aston/Birmingham pattern: a tiered table (IELTS 6.5 no band <6.0 for some programmes; IELTS 7.0 no band <6.5/7.0 for others, plus separate AHPRA-registered-programme rules) with no statement of which tier is the default/most common. The crawl\'s "6.5" is only one of the tiers, not a general figure.',
  },
];
