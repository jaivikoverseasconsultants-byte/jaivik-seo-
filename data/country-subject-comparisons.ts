// Country-vs-country-for-subject comparison pages (2026-07-18) — generated
// from the 4 SUBJECT_PILLARS × the 3 country pairs where BOTH countries have
// real cost-of-living data (data/cost-of-living.ts covers only Canada/UK/
// Australia) AND clear the 15+ real-course threshold on both sides for every
// subject (verified per-subject per-country counts, see BUILD-LOG.md).
// Route: reuses app/[decisionSlug]/page.tsx's merged dynamic segment —
// slug shape 'countryA-vs-countryB-for-subject', e.g. 'canada-vs-uk-for-mba'.

export interface ComparisonCountry {
  slug: string; // e.g. 'uk'
  name: string; // registry country string, e.g. 'UK'
}

// Alphabetical by slug — canonical ordering avoids duplicate-content pairs
// (australia-vs-canada, not canada-vs-australia).
export const COMPARISON_COUNTRIES: ComparisonCountry[] = [
  { slug: 'australia', name: 'Australia' },
  { slug: 'canada', name: 'Canada' },
  { slug: 'uk', name: 'UK' },
];

export const COMPARISON_COUNTRY_PAIRS: [string, string][] = [
  ['australia', 'canada'],
  ['australia', 'uk'],
  ['canada', 'uk'],
];

// Short URL slugs for each subject pillar (data/subject-pillars.ts's SUBJECT_PILLARS
// slugs minus the '-abroad-for-indian-students' suffix).
export const SUBJECT_SHORT_SLUGS: Record<string, string> = {
  'mba-abroad-for-indian-students': 'mba',
  'computer-science-abroad-for-indian-students': 'computer-science',
  'data-science-abroad-for-indian-students': 'data-science',
  'finance-accounting-abroad-for-indian-students': 'finance-accounting',
};

export const MIN_COURSES_PER_SIDE = 15;
