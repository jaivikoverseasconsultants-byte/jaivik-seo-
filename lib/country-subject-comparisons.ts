import { type RealCourseEntry } from '@/data/university-course-registry';
import { SUBJECT_PILLARS, type SubjectPillarConfig } from '@/data/subject-pillars';
import { getCoursesForPillar } from '@/lib/subject-pillars';
import {
  COMPARISON_COUNTRIES, COMPARISON_COUNTRY_PAIRS, SUBJECT_SHORT_SLUGS, MIN_COURSES_PER_SIDE,
} from '@/data/country-subject-comparisons';
import { getCostGuideBySlug } from '@/data/cost-of-living';
import { courseAnnualINRLakh, courseAnnualINR } from '@/lib/currency';
import { verifiedFeeRange, isFeeVerified } from '@/lib/fee-verification';

export interface CountrySubjectSide {
  countrySlug: string;
  countryName: string;
  courses: RealCourseEntry[];
  count: number;
  /** verified-only; null when no course on this side has a verified fee */
  minFeeLakh: string | null;
  maxFeeLakh: string | null;
  verifiedCount: number;
  basisNote: string | null;
  cheapest: RealCourseEntry[]; // top 3, cheapest first
}

function buildCountrySide(countrySlug: string, pillar: SubjectPillarConfig): CountrySubjectSide | null {
  const countryName = COMPARISON_COUNTRIES.find(c => c.slug === countrySlug)?.name;
  if (!countryName) return null;
  const courses = getCoursesForPillar(pillar).filter(c => c.country === countryName).sort((a, b) => a.annualINR - b.annualINR);
  if (courses.length < MIN_COURSES_PER_SIDE) return null;
  const fees = verifiedFeeRange(courses as any);
  return {
    countrySlug,
    countryName,
    courses,
    count: courses.length,
    minFeeLakh: fees ? fees.minLakh : null,
    maxFeeLakh: fees ? fees.maxLakh : null,
    verifiedCount: fees ? fees.verifiedCount : 0,
    basisNote: fees ? fees.basisNote : null,
    // only verified rows may be ranked as "cheapest"
    cheapest: courses.filter(c => isFeeVerified(c as any) && (courseAnnualINR(c as any) ?? 0) > 0).slice(0, 3),
  };
}

export interface CountrySubjectComparisonParsed {
  slug: string;
  countryASlug: string;
  countryBSlug: string;
  pillar: SubjectPillarConfig;
}

let _allCache: CountrySubjectComparisonParsed[] | null = null;

/** Every country-pair x subject-pillar combination that clears MIN_COURSES_PER_SIDE
 * on BOTH sides — skip-on-missing, never a hardcoded list of slugs. */
export function getAllCountrySubjectComparisons(): CountrySubjectComparisonParsed[] {
  if (_allCache) return _allCache;
  const results: CountrySubjectComparisonParsed[] = [];
  for (const pillar of SUBJECT_PILLARS) {
    const shortSlug = SUBJECT_SHORT_SLUGS[pillar.slug];
    if (!shortSlug) continue;
    for (const [a, b] of COMPARISON_COUNTRY_PAIRS) {
      const sideA = buildCountrySide(a, pillar);
      const sideB = buildCountrySide(b, pillar);
      if (!sideA || !sideB) continue;
      results.push({ slug: `${a}-vs-${b}-for-${shortSlug}`, countryASlug: a, countryBSlug: b, pillar });
    }
  }
  _allCache = results;
  return results;
}

export function parseCountrySubjectSlug(slug: string): CountrySubjectComparisonParsed | undefined {
  return getAllCountrySubjectComparisons().find(c => c.slug === slug);
}

export interface CountryCostRange {
  min: number;
  max: number;
  cityCount: number;
}

function countryCostRange(countrySlug: string): CountryCostRange | null {
  const guide = getCostGuideBySlug(countrySlug);
  if (!guide || !guide.cities.length) return null;
  return {
    min: Math.min(...guide.cities.map(c => c.totalMonthlyINR.min)),
    max: Math.max(...guide.cities.map(c => c.totalMonthlyINR.max)),
    cityCount: guide.cities.length,
  };
}

// Established, previously-vetted PSW facts — matching lib/course-faqs.ts's
// pswDetails() and app/courses-with-psw/[country]/page.tsx.
export const PSW_SUMMARY: Record<string, string> = {
  UK: "UK Graduate Route visa — 2 years of full work rights after a Bachelor's or Master's, 3 years after a PhD. No job offer required.",
  Australia: 'Temporary Graduate visa (subclass 485) — around 2–3 years of full work rights depending on your course level.',
  Canada: 'Post-Graduation Work Permit (PGWP) — up to 3 years for programs of 2 years or more, tied to program length for shorter programs.',
};

export interface CountrySubjectComparisonData {
  parsed: CountrySubjectComparisonParsed;
  sideA: CountrySubjectSide;
  sideB: CountrySubjectSide;
  costA: CountryCostRange | null;
  costB: CountryCostRange | null;
  pswA: string | null;
  pswB: string | null;
}

export function getCountrySubjectComparisonData(parsed: CountrySubjectComparisonParsed): CountrySubjectComparisonData | null {
  const sideA = buildCountrySide(parsed.countryASlug, parsed.pillar);
  const sideB = buildCountrySide(parsed.countryBSlug, parsed.pillar);
  if (!sideA || !sideB) return null;
  return {
    parsed,
    sideA,
    sideB,
    costA: countryCostRange(parsed.countryASlug),
    costB: countryCostRange(parsed.countryBSlug),
    pswA: PSW_SUMMARY[sideA.countryName] ?? null,
    pswB: PSW_SUMMARY[sideB.countryName] ?? null,
  };
}
