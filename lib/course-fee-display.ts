/**
 * Tuition display helpers for course data where an exact per-course fee is not
 * always published by the university.
 *
 * Background: in Aug 2026 the fabricated flat tuition values across the nine
 * Australian data files were replaced with real figures crawled from each
 * university's own site. Most courses now carry an exact published fee. A
 * minority genuinely have no international fee published (non-award, pathway
 * and VET-style courses, or programs withdrawn from the provider's course
 * finder). Those carry `annualAUD: 0` plus `tuitionMinAUD`/`tuitionMaxAUD`,
 * which are the real observed min/max of that university's own published fees
 * for the same study level.
 *
 * Rule: never render a precise figure we do not have. Show the range instead.
 */

export interface FeeBearingCourse {
  annualAUD: number;
  annualUSD?: number;
  annualINR?: number;
  totalAUD?: number;
  tuitionMinAUD?: number;
  tuitionMaxAUD?: number;
  durationYears?: number;
}

export const FEE_RANGE_NOTE =
  'Exact fee varies by program — confirmed during counselling.';

/** True when the university publishes an exact fee for this specific course. */
export function hasExactFee(c: FeeBearingCourse): boolean {
  return typeof c.annualAUD === 'number' && c.annualAUD > 0;
}

/** True when we can show at least a real published range. */
export function hasFeeRange(c: FeeBearingCourse): boolean {
  return !hasExactFee(c) && !!c.tuitionMinAUD && !!c.tuitionMaxAUD;
}

const aud = (n: number) => `A$${Math.round(n).toLocaleString()}`;

/** Annual tuition for display: exact figure, real range, or an honest fallback. */
export function annualFeeLabel(c: FeeBearingCourse): string {
  if (hasExactFee(c)) return aud(c.annualAUD);
  if (hasFeeRange(c)) return `${aud(c.tuitionMinAUD!)}–${aud(c.tuitionMaxAUD!)}`;
  return 'Fee on request';
}

/** Total course tuition for display (annual × duration), or a range/fallback. */
export function totalFeeLabel(c: FeeBearingCourse): string {
  const years = c.durationYears || 0;
  if (hasExactFee(c)) return aud(c.totalAUD ?? c.annualAUD * years);
  if (hasFeeRange(c) && years > 0) {
    return `${aud(c.tuitionMinAUD! * years)}–${aud(c.tuitionMaxAUD! * years)}`;
  }
  return 'Fee on request';
}

/** Annual tuition in INR lakh, e.g. "29.9" — null when no exact fee is published. */
export function annualFeeINRLakh(c: FeeBearingCourse): string | null {
  if (!hasExactFee(c) || !c.annualINR) return null;
  return (c.annualINR / 100000).toFixed(1);
}

/** Annual fee in INR for display: "₹29.9L/yr", a range, or an honest fallback. */
export function annualFeeINRLabel(c: FeeBearingCourse, audToInr = 55): string {
  const lakh = annualFeeINRLakh(c);
  if (lakh) return `₹${lakh}L/yr`;
  if (hasFeeRange(c)) {
    const lo = (c.tuitionMinAUD! * audToInr) / 100000;
    const hi = (c.tuitionMaxAUD! * audToInr) / 100000;
    return `₹${lo.toFixed(1)}–${hi.toFixed(1)}L/yr`;
  }
  return 'On request';
}

/**
 * Fee sentence for meta descriptions. Avoids emitting "₹0.0L/year" for courses
 * with no published fee.
 */
export function feeMetaPhrase(c: FeeBearingCourse, audToInr = 55): string {
  const lakh = annualFeeINRLakh(c);
  if (lakh) return `costs ₹${lakh}L/year for Indian students`;
  if (hasFeeRange(c)) {
    const lo = (c.tuitionMinAUD! * audToInr) / 100000;
    const hi = (c.tuitionMaxAUD! * audToInr) / 100000;
    return `costs about ₹${lo.toFixed(1)}–${hi.toFixed(1)}L/year for Indian students`;
  }
  return 'has fees confirmed at offer stage';
}

/** Tuition + living for the whole course, as an exact figure or a real range. */
export function totalEstimatedCostLabel(c: FeeBearingCourse, livingCostAUD: number): string {
  const years = c.durationYears || 0;
  const living = livingCostAUD * years;
  if (hasExactFee(c)) return aud((c.totalAUD ?? c.annualAUD * years) + living);
  if (hasFeeRange(c) && years > 0) {
    return `${aud(c.tuitionMinAUD! * years + living)}–${aud(c.tuitionMaxAUD! * years + living)}`;
  }
  return `${aud(living)} living + tuition on request`;
}

/** The same total in INR lakh, as an exact figure or a real range. */
export function totalEstimatedCostINRLabel(
  c: FeeBearingCourse,
  livingCostAUD: number,
  audToInr = 0.65 * 84,
): string {
  const years = c.durationYears || 0;
  const living = livingCostAUD * years;
  const lakh = (audAmount: number) => ((audAmount * audToInr) / 100000).toFixed(1);
  if (hasExactFee(c)) return `₹${lakh((c.totalAUD ?? c.annualAUD * years) + living)} Lakh`;
  if (hasFeeRange(c) && years > 0) {
    return `₹${lakh(c.tuitionMinAUD! * years + living)}–${lakh(c.tuitionMaxAUD! * years + living)} Lakh`;
  }
  return `₹${lakh(living)} Lakh living + tuition on request`;
}

/** Average annual fee across courses that actually publish one (0 when none do). */
export function averageAnnualFee(courses: FeeBearingCourse[]): number {
  const withFee = courses.filter(hasExactFee);
  if (!withFee.length) return 0;
  return Math.round(withFee.reduce((s, c) => s + c.annualAUD, 0) / withFee.length);
}
