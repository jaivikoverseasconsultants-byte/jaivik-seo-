import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import type { University } from '@/types';
import { classifyLevel } from '@/lib/course-faqs';
import type { CourseForContent } from '@/lib/courseContent';
import type { UniversityComparisonPair } from '@/data/university-comparisons';
import { getCostGuideBySlug } from '@/data/cost-of-living';
import { courseAnnualINRLakh, courseAnnualINR } from '@/lib/currency';
import { verifiedFeeRange, isFeeVerified } from '@/lib/fee-verification';

function toCourseForContent(c: RealCourseEntry): CourseForContent {
  return {
    name: c.name, level: c.level, studyLevel: c.studyLevel, duration: c.duration,
    durationYears: c.durationYears, campus: '', intakeMonths: c.intakeMonths,
    country: c.country, ieltsMin: c.ieltsMin, toeflMin: c.toeflMin, pteMin: c.pteMin,
    annualINR: c.annualINR, annualUSD: c.annualUSD,
  };
}

export interface UniversitySide {
  university: University;
  courses: RealCourseEntry[];
  count: number;
  bachelorCount: number;
  masterCount: number;
  /** verified-only; null when this university has no verified fee */
  minFeeLakh: string | null;
  maxFeeLakh: string | null;
  verifiedCount: number;
  basisNote: string | null;
  cheapest: RealCourseEntry[]; // top 3, cheapest first
}

function buildSide(universitySlug: string): UniversitySide | null {
  const university = getUniversityBySlug(universitySlug);
  if (!university) return null;
  const courses = getAllRealCourses()
    .filter(c => c.universitySlug === universitySlug && c.annualINR > 0)
    .sort((a, b) => a.annualINR - b.annualINR);
  if (!courses.length) return null;

  const bachelorCount = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'bachelor').length;
  const masterCount = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'master').length;
  const fees = verifiedFeeRange(courses as any);

  return {
    university,
    courses,
    count: courses.length,
    bachelorCount,
    masterCount,
    minFeeLakh: fees ? fees.minLakh : null,
    maxFeeLakh: fees ? fees.maxLakh : null,
    verifiedCount: fees ? fees.verifiedCount : 0,
    basisNote: fees ? fees.basisNote : null,
    // only verified rows may be ranked as "cheapest"
    cheapest: courses.filter(c => isFeeVerified(c as any) && (courseAnnualINR(c as any) ?? 0) > 0).slice(0, 3),
  };
}

export interface UniversityComparisonData {
  pair: UniversityComparisonPair;
  sideA: UniversitySide;
  sideB: UniversitySide;
  sameCity: boolean;
  cityCostOfLiving: { city: string; totalMonthlyINR: { min: number; max: number } } | null;
}

/** Returns null if either side is missing real course data — skip-on-missing. */
export function getUniversityComparisonData(pair: UniversityComparisonPair): UniversityComparisonData | null {
  const sideA = buildSide(pair.universityASlug);
  const sideB = buildSide(pair.universityBSlug);
  if (!sideA || !sideB) return null;

  const sameCity = sideA.university.city === sideB.university.city;
  let cityCostOfLiving: UniversityComparisonData['cityCostOfLiving'] = null;

  if (sameCity) {
    const guide = getCostGuideBySlug(pair.countrySlug);
    const cityMatch = guide?.cities.find(c => c.city.toLowerCase() === sideA.university.city.toLowerCase());
    if (cityMatch) {
      cityCostOfLiving = { city: cityMatch.city, totalMonthlyINR: cityMatch.totalMonthlyINR };
    }
  }

  return { pair, sideA, sideB, sameCity, cityCostOfLiving };
}

// Established, previously-vetted PSW facts (matching lib/course-faqs.ts's
// pswDetails() and app/courses-with-psw/[country]/page.tsx's COUNTRY_HEADLINE)
// — repeated here as a single shared line since Type 1 pages compare two
// universities in the SAME country, so the PSW rule is identical for both.
export const PSW_ONE_LINER: Record<string, string> = {
  UK: 'Both universities lead to the same UK Graduate Route visa: 2 years of full work rights after a Bachelor\'s or Master\'s, 3 years after a PhD — no job offer required.',
  Australia: 'Both universities lead to the same Temporary Graduate visa (subclass 485): around 2–3 years of full work rights depending on your course level.',
  Canada: 'Both universities lead to the same Post-Graduation Work Permit (PGWP): up to 3 years for programs of 2 years or more, tied to your program length for shorter programs.',
};
