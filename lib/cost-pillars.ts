import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getCostGuideBySlug, type CostOfLivingGuide, type CityBreakdown } from '@/data/cost-of-living';
import type { CostPillarConfig } from '@/data/cost-pillars';
import { classifyLevel } from '@/lib/course-faqs';
import type { CourseForContent } from '@/lib/courseContent';
import { buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { courseAnnualINRLakh, courseAnnualINR } from '@/lib/currency';
import { verifiedFeeRange, isFeeVerified } from '@/lib/fee-verification';

// Same slug maps/thresholds used by the decision hubs — duplicated here
// rather than centralized, matching this repo's existing per-file convention.
export const BUDGET_BANDS = [10, 15, 20, 25];
export const BUDGET_MIN_MATCHES = 15;

function toCourseForContent(c: RealCourseEntry): CourseForContent {
  return {
    name: c.name, level: c.level, studyLevel: c.studyLevel, duration: c.duration,
    durationYears: c.durationYears, campus: '', intakeMonths: c.intakeMonths,
    country: c.country, ieltsMin: c.ieltsMin, toeflMin: c.toeflMin, pteMin: c.pteMin,
    annualINR: c.annualINR, annualUSD: c.annualUSD,
  };
}

export interface LevelStats {
  /** courses listed at this level (verified or not) */
  count: number;
  /** how many of those carry a fee verified against the provider's own page */
  verifiedCount: number;
  minLakh: string;
  maxLakh: string;
  medianLakh: string;
  basisNote: string;
}

export interface TuitionStats {
  /** courses listed for this country */
  count: number;
  verifiedCount: number;
  basisNote: string;
  cheapestLakh: string;
  medianLakh: string;
  maxLakh: string;
  /** the cheapest course among VERIFIED rows — safe to name in copy */
  cheapestCourse: RealCourseEntry;
  bachelor: LevelStats | null;
  master: LevelStats | null;
}

// Every figure below comes from `verifiedFeeRange`, i.e. from rows whose fee was
// read off the provider's own page. Returning null (rather than a zero range)
// where nothing is verified is deliberate — the caller drops the block entirely.
function levelStats(courses: RealCourseEntry[]): LevelStats | null {
  const r = verifiedFeeRange(courses as any);
  if (!r) return null;
  return {
    count: r.listedCount,
    verifiedCount: r.verifiedCount,
    minLakh: r.minLakh,
    maxLakh: r.maxLakh,
    medianLakh: r.medianLakh,
    basisNote: r.basisNote,
  };
}

export function getTuitionStats(registryCountry: string): TuitionStats | null {
  const courses = getAllRealCourses().filter(c => c.country === registryCountry && c.annualINR > 0);
  if (!courses.length) return null;

  const range = verifiedFeeRange(courses as any);
  if (!range) return null;                 // no verified fee for this country at all

  // name the cheapest VERIFIED course, never the cheapest unverified one
  const verifiedSorted = courses
    .filter(c => isFeeVerified(c as any) && (courseAnnualINR(c as any) ?? 0) > 0)
    .sort((a, b) => (courseAnnualINR(a as any) ?? 0) - (courseAnnualINR(b as any) ?? 0));

  const bachelorCourses = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'bachelor');
  const masterCourses = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'master');

  return {
    count: range.listedCount,
    verifiedCount: range.verifiedCount,
    basisNote: range.basisNote,
    cheapestLakh: range.minLakh,
    medianLakh: range.medianLakh,
    maxLakh: range.maxLakh,
    cheapestCourse: verifiedSorted[0],
    bachelor: levelStats(bachelorCourses),
    master: levelStats(masterCourses),
  };
}

export function getCostGuideForPillar(config: CostPillarConfig): CostOfLivingGuide | undefined {
  return getCostGuideBySlug(config.costGuideSlug);
}

export interface CombinedCityBudget {
  city: CityBreakdown;
  lowYearlyLakh: string; // cheapest tuition + this city's low monthly * 12
  highYearlyLakh: string; // most expensive tuition + this city's high monthly * 12
}

/** Combines real tuition range with a real city's real living-cost range —
 * a sum of two real ranges, never a fabricated single average. */
export function getCombinedCityBudgets(tuition: TuitionStats, guide: CostOfLivingGuide): CombinedCityBudget[] {
  return guide.cities.map(city => {
    const lowYearly = parseFloat(tuition.cheapestLakh) * 100000 + city.totalMonthlyINR.min * 12;
    const highYearly = parseFloat(tuition.maxLakh) * 100000 + city.totalMonthlyINR.max * 12;
    return {
      city,
      lowYearlyLakh: (lowYearly / 100000).toFixed(1),
      highYearlyLakh: (highYearly / 100000).toFixed(1),
    };
  });
}

export function getBudgetBandsForCountry(registryCountry: string): number[] {
  return BUDGET_BANDS.filter(b =>
    getAllRealCourses().filter(c => c.country === registryCountry && c.annualINR > 0 && c.annualINR <= b * 100000).length >= BUDGET_MIN_MATCHES
  );
}

export function buildCostPillarMetadata(config: CostPillarConfig, tuition: TuitionStats | null): Metadata {
  return buildMetadata({
    title: `Cost of Studying in ${config.displayName} for Indian Students — Tuition + Living Costs in INR 2026`,
    description: tuition
      ? `Verified tuition fees (₹${tuition.cheapestLakh}L–₹${tuition.maxLakh}L/year, ${tuition.basisNote}) combined with real city-by-city living costs for ${config.displayName}. Total budget ranges, cheapest options, and ways to reduce cost for Indian students.`
      : `Tuition and living cost guide for studying in ${config.displayName} as an Indian student.`,
    path: `/${config.slug}`,
    keywords: [`cost of studying in ${config.displayName}`, `${config.displayName} study cost for indian students`, `total cost of studying abroad in ${config.displayName}`, `${config.displayName} tuition and living cost`],
  });
}
