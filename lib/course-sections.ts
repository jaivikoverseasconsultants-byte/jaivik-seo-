import { costOfLivingGuides } from '@/data/cost-of-living';
import type { CourseForContent } from '@/lib/courseContent';
import { isFeeVerified } from '@/lib/fee-verification';
import {
  nativeFee,
  nativeLivingCost,
  pswDetails,
  careerOutcomeDetails,
  type PswDetails,
  type CareerOutcomeDetails,
} from '@/lib/course-faqs';

// Rates now live in lib/currency.ts — the single source of truth. Re-exported
// here so existing importers of RATE_AS_OF keep working.
import { RATE_TO_INR, RATE_AS_OF, courseAnnualINR, inrToLakh } from '@/lib/currency';
export { RATE_AS_OF };

// ─── Overview ────────────────────────────────────────────────────────────────

export function getOverview(course: CourseForContent, universityName: string): string {
  const city = course.city ? `${course.city}, ${course.country}` : course.country;
  const level = course.studyLevel || course.level;
  const intakes = course.intakeMonths.join(' and ');

  return `${course.name} at ${universityName} is a ${level} programme for Indian students, delivered over ${course.duration} at the ${course.campus} campus in ${city}. The programme runs a ${intakes} intake${course.intakeMonths.length > 1 ? 's' : ''} and leads to a ${course.level} qualification recognised by employers in ${course.country} and internationally.`;
}

// ─── Fees breakdown ──────────────────────────────────────────────────────────

export interface FeesBreakdown {
  native: { amount: number; code: string } | null;
  annualINR: number | null;
  annualINRLakh: string | null;
  livingCostNative: { amount: number; code: string } | null;
  livingCostINR: number | null;
  livingCostINRLakh: string | null;
  rate: number | null;
  rateAsOf: string;
}

export function getFeesBreakdown(course: CourseForContent): FeesBreakdown | null {
  // Tuition flagged unverified (Aug 2026 flat-fee scan) must not be shown as a
  // precise figure; skip the whole breakdown until the provider is re-crawled.
  if (!isFeeVerified(course as any)) return null;
  // Derived from the native fee at the central rate (lib/currency.ts), NOT the
  // record's baked annualINR — that was written at crawl time and differs between
  // rows in the same file wherever the phase-1 fee crawl recomputed only some.
  const annualINR = courseAnnualINR(course as never);
  const native = nativeFee(course);
  if (!annualINR && !native) return null;

  const livingCostNative = nativeLivingCost(course);
  const livingCostINRRaw = (course as Record<string, unknown>).livingCostINR;
  const livingCostINR = typeof livingCostINRRaw === 'number' && livingCostINRRaw > 0 ? livingCostINRRaw : null;

  const rate = native ? RATE_TO_INR[native.code] ?? null : null;

  return {
    native,
    annualINR,
    annualINRLakh: inrToLakh(annualINR),
    livingCostNative,
    livingCostINR,
    livingCostINRLakh: inrToLakh(livingCostINR),
    rate,
    rateAsOf: RATE_AS_OF,
  };
}

// ─── Entry requirements ──────────────────────────────────────────────────────

export interface EntryRequirements {
  academic: string;
  ielts: { min: number; toefl: number | null; pte: number | null } | null;
}

export function getEntryRequirements(course: CourseForContent): EntryRequirements | null {
  const level = course.level.toLowerCase();
  const isMasters = /master|msc|mba|meng|llm|mres|mphil/.test(level) || course.studyLevel === 'Postgraduate';
  const isPhD = /phd|doctorate|doctoral/.test(level);
  const isBachelors = /bachelor|bsc|beng|bcom|llb/.test(level) || course.studyLevel === 'Undergraduate';

  let academic: string;
  if (isPhD) {
    academic = `A relevant Master's degree (or equivalent research qualification) is generally required for admission to this ${course.level} programme.`;
  } else if (isMasters) {
    academic = `A relevant Bachelor's degree is required for admission to this ${course.level} programme. Exact minimum percentage/GPA requirements vary by department — Jaivik Overseas can confirm the current threshold for your subject.`;
  } else if (isBachelors) {
    academic = `Completion of 10+2 (Higher Secondary) is required for admission to this ${course.level} programme, in subjects relevant to the course. Exact minimum percentage requirements vary by department — Jaivik Overseas can confirm the current threshold for your subject.`;
  } else {
    academic = `Academic eligibility for this ${course.level} programme is set by the department. Contact Jaivik Overseas for a personalised eligibility check.`;
  }

  const hasIelts = typeof course.ieltsMin === 'number' && course.ieltsMin > 0;
  const ielts = hasIelts
    ? {
        min: course.ieltsMin,
        toefl: typeof course.toeflMin === 'number' && course.toeflMin > 0 ? course.toeflMin : null,
        pte: typeof course.pteMin === 'number' && course.pteMin > 0 ? course.pteMin : null,
      }
    : null;

  return { academic, ielts };
}

// ─── Post-study work & PR pathway ────────────────────────────────────────────

export function getPswPathway(course: CourseForContent, universityName: string): PswDetails | null {
  return pswDetails(course, universityName);
}

// ─── Career outcomes ─────────────────────────────────────────────────────────

export function getCareerOutcomes(course: CourseForContent, universitySlug: string): CareerOutcomeDetails | null {
  return careerOutcomeDetails(course, universitySlug);
}

// ─── Living cost fallback (city-level guide, for countries without per-course data) ──

export function getCityLivingCost(course: CourseForContent) {
  const detailed = costOfLivingGuides.find(g => g.country === course.country);
  if (!detailed || detailed.cities.length === 0) return null;
  const city =
    detailed.cities.find(c => course.city && c.city.toLowerCase() === course.city!.toLowerCase()) ||
    detailed.cities[0];
  return { city: city.city, currencySymbol: detailed.currencySymbol, totalMonthly: city.totalMonthly, totalMonthlyINR: city.totalMonthlyINR };
}
