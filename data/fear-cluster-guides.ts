// Fear-cluster / high-anxiety-intent guide pages (2026-07-18).
//
// IMPORTANT PROVENANCE NOTE — read before adding a data-backed claim to any
// of these pages: `data/universities.ts`'s `requirements.backlogs` and
// `requirements.gpaMin` fields are NOT real per-university admissions data —
// they're hardcoded by institution-type bucket in generator scripts (e.g.
// `scripts/generate-uk-universities.js`: `{ russell: 1, mid: 2, post92: 3,
// specialist: 2 }`), never audited in DATA-AUDIT.md. Similarly,
// `RealCourseEntry.ieltsMin/toeflMin/pteMin` are identical across every
// course for 74 of 103 REAL-registry universities (confirmed by direct
// extraction) — blanket generator defaults, not independently crawled
// per-course English-test requirements. No `study gap` / gap-year field
// exists anywhere in the data model. None of these four fear-cluster pages
// may present a specific per-university number for backlogs, GPA/CGPA,
// study gap, or English-test waiver — general, hedged, real-world guidance
// only, per the real-data-only / no-fabrication rule.

export interface GuideRelatedLink {
  href: string;
  label: string;
}

export const COMMON_COUNTRY_HUB_LINKS: GuideRelatedLink[] = [
  { href: '/universities/country/uk', label: 'Study in UK' },
  { href: '/universities/country/australia', label: 'Study in Australia' },
  { href: '/universities/country/canada', label: 'Study in Canada' },
  { href: '/universities/country/ireland', label: 'Study in Ireland' },
  { href: '/universities/country/germany', label: 'Study in Germany' },
];

export const SUBJECT_PILLAR_LINKS: GuideRelatedLink[] = [
  { href: '/mba-abroad-for-indian-students', label: '💼 MBA Abroad' },
  { href: '/computer-science-abroad-for-indian-students', label: '💻 Computer Science Abroad' },
  { href: '/data-science-abroad-for-indian-students', label: '📊 Data Science Abroad' },
  { href: '/finance-accounting-abroad-for-indian-students', label: '💰 Finance & Accounting Abroad' },
];

export const COST_PILLAR_LINKS: GuideRelatedLink[] = [
  { href: '/cost-of-studying-in-uk', label: 'Cost of Studying in UK' },
  { href: '/cost-of-studying-in-australia', label: 'Cost of Studying in Australia' },
  { href: '/cost-of-studying-in-canada', label: 'Cost of Studying in Canada' },
];

export const CHEAPEST_HUB_LINKS: GuideRelatedLink[] = [
  { href: '/cheapest-universities-uk', label: 'Cheapest Universities in UK' },
  { href: '/cheapest-universities-australia', label: 'Cheapest Universities in Australia' },
  { href: '/cheapest-universities-canada', label: 'Cheapest Universities in Canada' },
];

export const IELTS_BAND_HUB_LINKS: GuideRelatedLink[] = [
  { href: '/ielts-6-0-universities', label: 'Universities Accepting IELTS 6.0' },
  { href: '/ielts-6-5-universities', label: 'Universities Accepting IELTS 6.5' },
];
