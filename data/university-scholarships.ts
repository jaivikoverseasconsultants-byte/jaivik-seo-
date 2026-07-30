// Manually crawled + verified university scholarships — 2026-07-30.
// Source: each entry's own official university scholarship page (sourceUrl),
// fetched live and cross-checked against the primary domain, not a secondary
// aggregator. Real-data-only / skip-on-missing:
//   - `amount` is null where the source genuinely doesn't state a fixed figure
//     (e.g. "varies by region") — never estimated or backfilled from a
//     different country's/scholarship's figure.
//   - `deadlineStatus` is honest about whether a stated deadline is still open,
//     has passed for this year's cycle (most international scholarship
//     deadlines for a Sept intake fall Feb-June, so as of any July-onward
//     crawl date most will show 'closed-recurring'), has no fixed date at
//     all, or requires no separate application — same discipline established
//     in components/DeadlineCountdown.tsx: never presented as an open,
//     actionable deadline once it has passed.
// See DATA-AUDIT.md "University scholarships (2026-07-30)" for the full
// per-university crawl log (OK/SKIPPED) and the 3 spot-checked extractions.

export type DeadlineStatus = 'open' | 'closed-recurring' | 'no-fixed-deadline' | 'automatic-no-application';

export interface UniversityScholarship {
  universitySlug: string;
  name: string;
  amount: string | null;
  amountNote?: string;
  level: string;
  eligibility: string;
  deadlineStatus: DeadlineStatus;
  deadlineDate: string | null; // ISO date, only when the source states one
  deadlineNote: string; // always human-readable and honest, shown verbatim in the UI
  sourceUrl: string;
  verifiedDate: string;
}

export const universityScholarships: UniversityScholarship[] = [
  {
    universitySlug: 'university-of-manchester',
    name: 'GREAT Scholarship',
    amount: '£15,000 (India is on the eligible-nationality list; the university\'s page states £15,000 for Bangladesh/Pakistan specifically — confirm India\'s exact figure with the university, as it was not separately broken out on the page)',
    level: 'One-year taught Master\'s programmes only',
    eligibility: 'Passport holders of a specific list of countries including India; excludes MBA, MArch, PGCE, Clinical Medicine/Dentistry, and most MSc-by-Research programmes; requires a conditional or unconditional offer.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-04-23',
    deadlineNote: 'Closed 23 April 2026 for this year\'s cycle — GREAT Scholarships run annually; confirm next cycle\'s deadline with our counsellors.',
    sourceUrl: 'https://www.manchester.ac.uk/study/international/finance-and-scholarships/funding/great-scholarships/',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'heriot-watt-university-dubai',
    name: 'International Merit Scholarship',
    amount: null,
    amountNote: 'The university states the award "varies by region" with no fixed per-student figure published; total pool cited as over £500,000/year across 400+ students.',
    level: 'Undergraduate and Postgraduate Taught, full-time only',
    eligibility: 'International (non-EU) fee-paying students; excludes online study and postgraduate research programmes; exact criteria vary by region — contact the regional office.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'No closing date stated — listed as "Open" for January & September 2026 entry.',
    sourceUrl: 'https://www.hw.ac.uk/study/fees-and-funding/scholarships-and-bursaries/international-merit-scholarship',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-birmingham',
    name: 'Postgraduate Chancellor\'s Scholarship for India',
    amount: '£10,000 (towards tuition fees, first year only)',
    level: 'Postgraduate Taught (Master\'s)',
    eligibility: 'Must be domiciled in India; hold a firm offer from Birmingham\'s UK campus for a taught Master\'s starting September; pay the £3,000 deposit by the stated deadline. Selected on academic merit and Statement of Purpose.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-05-31',
    deadlineNote: 'Closed 31 May 2026 for this year\'s cycle — this is an annual, India-specific scholarship; confirm next cycle\'s deadline with our counsellors.',
    sourceUrl: 'https://www.birmingham.ac.uk/study/scholarships-funding/india-postgraduate-chancellors-scholarship',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-leeds',
    name: 'International Excellence Scholarships (Leeds University Business School)',
    amount: '£3,000, £6,000 or £16,000 fee reduction',
    level: 'Taught Master\'s (Business School)',
    eligibility: 'High academic achievement; applicants to a taught Master\'s course at Leeds University Business School.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'No deadline stated on the source page — confirm current status with the Business School or our counsellors.',
    sourceUrl: 'https://business.leeds.ac.uk/dir-record/lubs-scholarships/2467/international-excellence-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-bristol',
    name: 'Think Big Scholarships',
    amount: 'Undergraduate: £6,500 or £13,000 (up to 4 years); Postgraduate: £6,500, £13,000 or £26,000 (first year only)',
    level: 'Undergraduate and Postgraduate (Master\'s)',
    eligibility: 'Overseas fee status; applied for an eligible undergraduate or Master\'s course. Dental and Medical School undergraduates excluded.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-04-10',
    deadlineNote: 'Closed 10 April 2026, 10:00am UK time, for September 2026 entry — recurs annually; confirm next cycle\'s dates with our counsellors.',
    sourceUrl: 'https://www.bristol.ac.uk/international/fees-finance/scholarships/',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'coventry-university',
    name: 'Coventry University Group Scholarship',
    amount: '£2,000 per year of study (£6,000 total for a 3-year Bachelor\'s)',
    level: 'Undergraduate and Postgraduate, full-time',
    eligibility: 'All countries excluding UK and EU; must clear the full CAS deposit and enrol by the date in the offer letter.',
    deadlineStatus: 'automatic-no-application',
    deadlineDate: null,
    deadlineNote: 'No separate application — awarded automatically on enrolment for the 2026/27 academic year, subject to deposit/enrolment deadlines in the individual offer letter.',
    sourceUrl: 'https://www.coventry.ac.uk/international-students-hub/apply-for-a-scholarship/coventry-university-group-scholarship/',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'northumbria-university',
    name: '2026-27 PGT UK International Scholarship',
    amount: '£3,000 tuition fee discount',
    level: 'Postgraduate Taught',
    eligibility: 'International student with Overseas/EU fee status, self-funded (not sponsored); full-time postgraduate taught programme at the Newcastle campus starting September 2026 or January 2027.',
    deadlineStatus: 'automatic-no-application',
    deadlineDate: null,
    deadlineNote: 'Applied automatically as a fee discount — no separate application required.',
    sourceUrl: 'https://www.northumbria.ac.uk/study-at-northumbria/fees-funding/international-fees-funding/2026-27-pgt-uk-international-scholarships/',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-toronto',
    name: 'Lester B. Pearson International Student Scholarship',
    amount: 'Full tuition, books, incidental fees and residence support for 4 years',
    level: 'Undergraduate (entering final year of secondary school)',
    eligibility: 'International student (non-Canadian, requiring a study permit); in final year of senior secondary school in 2026/27 or graduated no earlier than June 2026; beginning studies at U of T in September 2027; one nomination per school.',
    deadlineStatus: 'open',
    deadlineDate: '2026-11-06',
    deadlineNote: 'Scholarship application due 6 November 2026 (school nomination 9 October 2026, admission application 16 October 2026).',
    sourceUrl: 'https://future.utoronto.ca/pearson-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'mcgill-university',
    name: 'Entrance Scholarships (One-year and Major)',
    amount: 'One-year: $3,000 (non-renewable); Major: $12,000–$48,000 (the $12,000 renewable tier is Canadian citizens/permanent residents only — international students are eligible for the other tiers)',
    level: 'Undergraduate',
    eligibility: 'Automatic consideration on academic merit for the one-year award; no separate application for either tier. Major awards also weigh leadership and community involvement.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'Major Entrance Scholarship consideration opens 1 October annually; the source page does not state an exact submission cut-off — confirm current-cycle timing with our counsellors.',
    sourceUrl: 'https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-waterloo',
    name: 'International Student Entrance Scholarship',
    amount: 'CAD $10,000 (first year only)',
    level: 'Undergraduate',
    eligibility: 'International fee-paying students admitted to a full-time first-year degree starting September 2026; excludes Medical Sciences, Social Work, Optometry, Pharmacy, transfer students, and 2025 deferrals.',
    deadlineStatus: 'automatic-no-application',
    deadlineDate: null,
    deadlineNote: 'Automatic consideration on admission — no application required.',
    sourceUrl: 'https://uwaterloo.ca/future-students/financing/international-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-waterloo',
    name: 'Faculty of Mathematics International Awards: India',
    amount: 'CAD $20,000–$40,000 (up to 15 awards)',
    level: 'Undergraduate (Faculty of Mathematics)',
    eligibility: 'Indian applicants to select Faculty of Mathematics programmes — automatic consideration.',
    deadlineStatus: 'automatic-no-application',
    deadlineDate: null,
    deadlineNote: 'Automatic consideration on admission to an eligible programme — no separate application.',
    sourceUrl: 'https://uwaterloo.ca/future-students/financing/international-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-waterloo',
    name: 'Faculty of Science International Student Scholarships',
    amount: 'CAD $25,000–$80,000 (15 awards)',
    level: 'Undergraduate (Faculty of Science)',
    eligibility: 'International fee-paying students admitted to the Faculty of Science.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-02-13',
    deadlineNote: 'Closed 13 February 2026 for this year\'s cycle — recurs annually; confirm next cycle\'s date with our counsellors.',
    sourceUrl: 'https://uwaterloo.ca/future-students/financing/science',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'unsw-sydney',
    name: 'International Student Award',
    amount: '20% contribution towards tuition fees per year',
    level: 'Undergraduate, Postgraduate and UNSW College Diploma',
    eligibility: 'Citizens of eligible countries commencing 2026-2027; can be combined with other UNSW international scholarships.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'No deadline stated on the source page.',
    sourceUrl: 'https://www.unsw.edu.au/study/your-future/international-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'unsw-sydney',
    name: 'International Scientia Coursework Scholarship',
    amount: 'Full tuition OR AUD $20,000/year',
    level: 'Undergraduate and Postgraduate',
    eligibility: 'High academic achievement, demonstrated leadership, and extracurricular involvement (sport, culture, volunteering). Separate application required.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'No deadline stated on the source page — a separate application is required.',
    sourceUrl: 'https://www.unsw.edu.au/study/your-future/international-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'unsw-sydney',
    name: 'Australia\'s Global University Award',
    amount: 'AUD $10,000 one-time',
    level: 'Undergraduate and Postgraduate',
    eligibility: 'High academic achievement — automatic consideration upon UNSW application, no separate application.',
    deadlineStatus: 'automatic-no-application',
    deadlineDate: null,
    deadlineNote: 'Automatic consideration on application to UNSW — no separate application.',
    sourceUrl: 'https://www.unsw.edu.au/study/your-future/international-scholarships',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'dublin-city-university',
    name: 'Government of Ireland International Education Scholarship (GOI-IES)',
    amount: 'Full tuition fee waiver + €10,000 stipend',
    level: 'Postgraduate Taught (Master\'s, NFQ Level 9 only), one year full-time',
    eligibility: 'Non-EU/EEA students.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'The university\'s page directs applicants to the Irish Government\'s HEA website for the current cycle\'s dates, noting applications "usually" open January-March — confirm the exact current-cycle date with our counsellors.',
    sourceUrl: 'https://www.dcu.ie/global/GOI-Scholarship',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-calgary',
    name: 'University of Calgary International Entrance Scholarship',
    amount: 'CAD $20,000 (renewable)',
    level: 'Undergraduate (first year, any degree)',
    eligibility: 'International students paying international tuition (not Canadian citizens/permanent residents); must meet the university\'s English proficiency requirement. Renewable in later years with a GPA of 2.60+ over 24.00 units in the prior fall/winter terms.',
    deadlineStatus: 'no-fixed-deadline',
    deadlineDate: null,
    deadlineNote: 'No fixed deadline stated — apply via the My UCalgary Portal (High School Prestige Awards).',
    sourceUrl: 'https://www.ucalgary.ca/registrar/awards/university-calgary-international-entrance-scholarship',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-greenwich',
    name: 'International Scholarship Award',
    amount: '£2,500–£3,000 tuition fee discount',
    level: 'Undergraduate and Postgraduate',
    eligibility: 'International students with an offer to study at Greenwich for September 2026; requires a separate scholarship application.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-06-26',
    deadlineNote: 'The guaranteed-minimum-award window closed 26 June 2026 for this cycle — recurs annually; confirm next cycle\'s date with our counsellors.',
    sourceUrl: 'https://www.gre.ac.uk/bursaries/international-scholarships-award',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-greenwich',
    name: 'Early Applicant Postgraduate Scholarship',
    amount: '£3,500 automatic fee discount',
    level: 'Postgraduate Taught',
    eligibility: 'New international postgraduate taught students; must apply for the programme and accept the offer plus deposit within the stated windows.',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-03-27',
    deadlineNote: 'Application window closed 27 March 2026, 18:00 UK time, for this cycle — recurs annually; confirm next cycle\'s date with our counsellors.',
    sourceUrl: 'https://www.gre.ac.uk/bursaries/early-applicant-postgraduate-scholarship',
    verifiedDate: '2026-07-30',
  },
  {
    universitySlug: 'university-of-sussex',
    name: 'Chancellor\'s International Scholarships',
    amount: '£5,000 (first year of full-time study only)',
    level: 'Undergraduate Bachelor\'s degree',
    eligibility: 'Overseas fee status; offer to study a full-time Bachelor\'s at Sussex in 2026; self-financing; excellent academic grades (exact minimum varies by qualification/country).',
    deadlineStatus: 'closed-recurring',
    deadlineDate: '2026-04-30',
    deadlineNote: 'Closed 30 April 2026, 23:59, for this cycle — recurs annually; confirm next cycle\'s date with our counsellors.',
    sourceUrl: 'https://www.sussex.ac.uk/study/fees-funding/undergraduate-scholarships/view/1870-Chancellor-s-International-Scholarships',
    verifiedDate: '2026-07-30',
  },
];

export function getScholarshipsBySlug(slug: string): UniversityScholarship[] {
  return universityScholarships.filter(s => s.universitySlug === slug);
}
