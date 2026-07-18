// University-vs-university comparison pages (2026-07-18) — config-driven,
// same pattern as SUBJECT_PILLARS/COST_PILLARS. Every pair is two REAL-registry
// universities (both have entries in getAllRealCourses()) in the SAME country,
// picked because they're realistic head-to-head choices for Indian students
// (same city or same tier/region, both popular study destinations) — never an
// arbitrary combination. See BUILD-LOG.md for the data-support rationale per pair.

export interface UniversityComparisonPair {
  slug: string; // route: /compare/[slug]
  universityASlug: string;
  universityBSlug: string;
  country: string; // matches RealCourseEntry.country (post COUNTRY_NORM)
  countrySlug: string; // matches /universities/country/<slug>
}

export const UNIVERSITY_COMPARISONS: UniversityComparisonPair[] = [
  // ── UK ───────────────────────────────────────────────────────────────────
  {
    slug: 'university-of-birmingham-vs-university-of-leeds',
    universityASlug: 'university-of-birmingham',
    universityBSlug: 'university-of-leeds',
    country: 'UK',
    countrySlug: 'uk',
  },
  {
    slug: 'university-of-manchester-vs-university-of-sheffield',
    universityASlug: 'university-of-manchester',
    universityBSlug: 'university-of-sheffield',
    country: 'UK',
    countrySlug: 'uk',
  },
  {
    slug: 'university-of-glasgow-vs-university-of-edinburgh',
    universityASlug: 'university-of-glasgow',
    universityBSlug: 'university-of-edinburgh',
    country: 'UK',
    countrySlug: 'uk',
  },
  {
    slug: 'coventry-university-vs-de-montfort-university',
    universityASlug: 'coventry-university',
    universityBSlug: 'de-montfort-university',
    country: 'UK',
    countrySlug: 'uk',
  },
  // ── Australia ────────────────────────────────────────────────────────────
  {
    slug: 'university-of-queensland-vs-griffith-university',
    universityASlug: 'university-of-queensland',
    universityBSlug: 'griffith-university',
    country: 'Australia',
    countrySlug: 'australia',
  },
  {
    slug: 'university-of-sydney-vs-uts-sydney',
    universityASlug: 'university-of-sydney',
    universityBSlug: 'uts-sydney',
    country: 'Australia',
    countrySlug: 'australia',
  },
  {
    slug: 'university-of-melbourne-vs-rmit-university',
    universityASlug: 'university-of-melbourne',
    universityBSlug: 'rmit-university',
    country: 'Australia',
    countrySlug: 'australia',
  },
  // ── Canada ───────────────────────────────────────────────────────────────
  {
    slug: 'simon-fraser-university-vs-university-of-manitoba',
    universityASlug: 'simon-fraser-university',
    universityBSlug: 'university-of-manitoba',
    country: 'Canada',
    countrySlug: 'canada',
  },
  {
    slug: 'university-of-toronto-vs-university-of-waterloo',
    universityASlug: 'university-of-toronto',
    universityBSlug: 'university-of-waterloo',
    country: 'Canada',
    countrySlug: 'canada',
  },
  {
    slug: 'university-of-british-columbia-vs-university-of-calgary',
    universityASlug: 'university-of-british-columbia',
    universityBSlug: 'university-of-calgary',
    country: 'Canada',
    countrySlug: 'canada',
  },
];

export function getUniversityComparisonBySlug(slug: string): UniversityComparisonPair | undefined {
  return UNIVERSITY_COMPARISONS.find(p => p.slug === slug);
}
