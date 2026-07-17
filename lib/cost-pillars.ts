import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getCostGuideBySlug, type CostOfLivingGuide, type CityBreakdown } from '@/data/cost-of-living';
import type { CostPillarConfig } from '@/data/cost-pillars';
import { classifyLevel } from '@/lib/course-faqs';
import type { CourseForContent } from '@/lib/courseContent';
import { buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

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
  count: number;
  minLakh: string;
  maxLakh: string;
  medianLakh: string;
}

export interface TuitionStats {
  count: number;
  cheapestLakh: string;
  medianLakh: string;
  maxLakh: string;
  cheapestCourse: RealCourseEntry;
  bachelor: LevelStats | null;
  master: LevelStats | null;
}

function levelStats(courses: RealCourseEntry[]): LevelStats | null {
  if (!courses.length) return null;
  const sorted = courses.slice().sort((a, b) => a.annualINR - b.annualINR);
  return {
    count: sorted.length,
    minLakh: (sorted[0].annualINR / 100000).toFixed(1),
    maxLakh: (sorted[sorted.length - 1].annualINR / 100000).toFixed(1),
    medianLakh: (sorted[Math.floor(sorted.length / 2)].annualINR / 100000).toFixed(1),
  };
}

export function getTuitionStats(registryCountry: string): TuitionStats | null {
  const courses = getAllRealCourses().filter(c => c.country === registryCountry && c.annualINR > 0);
  if (!courses.length) return null;
  const sorted = courses.slice().sort((a, b) => a.annualINR - b.annualINR);

  const bachelorCourses = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'bachelor');
  const masterCourses = courses.filter(c => classifyLevel(toCourseForContent(c)) === 'master');

  return {
    count: sorted.length,
    cheapestLakh: (sorted[0].annualINR / 100000).toFixed(1),
    medianLakh: (sorted[Math.floor(sorted.length / 2)].annualINR / 100000).toFixed(1),
    maxLakh: (sorted[sorted.length - 1].annualINR / 100000).toFixed(1),
    cheapestCourse: sorted[0],
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
      ? `Real tuition fees (₹${tuition.cheapestLakh}L–₹${tuition.maxLakh}L/year from ${tuition.count} real courses) combined with real city-by-city living costs for ${config.displayName}. Total budget ranges, cheapest options, and ways to reduce cost for Indian students.`
      : `Tuition and living cost guide for studying in ${config.displayName} as an Indian student.`,
    path: `/${config.slug}`,
    keywords: [`cost of studying in ${config.displayName}`, `${config.displayName} study cost for indian students`, `total cost of studying abroad in ${config.displayName}`, `${config.displayName} tuition and living cost`],
  });
}
