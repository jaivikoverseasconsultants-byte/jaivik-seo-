/**
 * The single source of truth for native-currency -> INR conversion.
 *
 * Why this file exists (2026-08-26): conversion used to happen three different
 * ways at once, and they disagreed with each other on the same page.
 *
 *   1. a rate table private to lib/course-sections.ts (used by getFeesBreakdown only)
 *   2. ~180 hardcoded multipliers inlined in templates — `* 107 / 100000` for GBP,
 *      `* 61` for CAD, `* 0.65 * 84` for AUD, `* 0.60 * 84` for NZD, `* 84` for USD,
 *      `* 90` for EUR — none of which read table 1
 *   3. an `annualINR` value baked into every course record at crawl time, using
 *      whatever rate was current on the crawl date (June–July 2026)
 *
 * The visible symptom: leeds-courses.ts, auckland-courses.ts and strath-courses.ts
 * each carry TWO different baked rates internally (GBP 105.0–107.0, NZD 49.5–51.0),
 * because the phase-1 fee crawl recomputed derived fields for the rows it verified
 * and left the rest on their original rate. Two courses on the same university page
 * could be converted at different rates.
 *
 * Rule going forward: never inline a conversion multiplier and never render a baked
 * `annualINR`. Call a helper here, so one edit to RATE_TO_INR moves every figure on
 * the site at once.
 *
 * These are pinned indicative rates, not a live feed — the UI labels them as
 * indicative with RATE_AS_OF, and CurrencyConverter offers a live estimate.
 *
 * Deliberately NOT shared with components/CurrencyConverter.tsx: that one fetches
 * live rates and only falls back to a USD-relative table, a different shape. The
 * two agree today (its 83.5 INR/USD over GBP 0.79 = 105.7, CAD 1.36 = 61.4,
 * AUD 1.53 = 54.6, matching the values below) — if you change a rate here,
 * re-check that fallback so the static figures and the converter don't disagree.
 */

/** INR per 1 unit of the named currency. */
export const RATE_TO_INR: Record<string, number> = {
  USD: 83.5,
  CAD: 61.4,
  GBP: 105.7,
  AUD: 54.6,
  EUR: 90.8,
  SGD: 62.3,
  NZD: 51.2,
  AED: 22.7,
  DKK: 12.1,
  SEK: 8.0,
};

export const RATE_AS_OF = 'July 2026';

/** Country -> native currency. Kept here so conversion has one home. */
export const COUNTRY_CURRENCY: Record<string, string> = {
  Australia: 'AUD',
  Canada: 'CAD',
  'United Kingdom': 'GBP',
  UK: 'GBP',
  'New Zealand': 'NZD',
  Germany: 'EUR',
  Ireland: 'EUR',
  Netherlands: 'EUR',
  France: 'EUR',
  Italy: 'EUR',
  Spain: 'EUR',
  Finland: 'EUR',
  Denmark: 'DKK',
  Sweden: 'SEK',
  Singapore: 'SGD',
  UAE: 'AED',
  'United Arab Emirates': 'AED',
  USA: 'USD',
  'United States': 'USD',
};

export function rateFor(code: string | null | undefined): number | null {
  if (!code) return null;
  return RATE_TO_INR[code] ?? null;
}

/** Convert a native amount to whole INR. Null when the currency is unknown. */
export function toINR(amount: number | null | undefined, code: string | null | undefined): number | null {
  const rate = rateFor(code);
  if (rate == null) return null;
  if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * rate);
}

/** Convert a native amount straight to a "12.3" lakh string. Null when not convertible. */
export function toINRLakh(
  amount: number | null | undefined,
  code: string | null | undefined,
  digits = 1,
): string | null {
  const inr = toINR(amount, code);
  return inr == null ? null : (inr / 100000).toFixed(digits);
}

/** Format an already-INR amount as a lakh string. */
export function inrToLakh(amountINR: number | null | undefined, digits = 1): string | null {
  if (typeof amountINR !== 'number' || !isFinite(amountINR) || amountINR <= 0) return null;
  return (amountINR / 100000).toFixed(digits);
}

type AnyCourse = Record<string, unknown> & { country?: string };

/** The course's native currency code, from its country. */
export function courseCurrency(course: AnyCourse | null | undefined): string | null {
  const c = course?.country;
  return typeof c === 'string' ? COUNTRY_CURRENCY[c] ?? null : null;
}

/**
 * Annual tuition in INR, computed live from the native fee at the central rate.
 *
 * Prefers native x RATE_TO_INR. Falls back to the record's baked `annualINR` ONLY
 * when the country has no known native currency — otherwise a handful of
 * non-mapped countries would lose their INR figure entirely. The fallback is the
 * legacy path being retired; `annualINRIsStale()` reports where it still applies.
 */
export function courseAnnualINR(course: AnyCourse | null | undefined): number | null {
  if (!course) return null;
  const code = courseCurrency(course);
  if (code) {
    const native = course[`annual${code}`];
    const converted = toINR(typeof native === 'number' ? native : null, code);
    if (converted != null) return converted;
  }
  const baked = course.annualINR;
  return typeof baked === 'number' && baked > 0 ? baked : null;
}

/** Annual tuition as a "12.3" lakh string, via the central rate. */
export function courseAnnualINRLakh(course: AnyCourse | null | undefined, digits = 1): string | null {
  return inrToLakh(courseAnnualINR(course), digits);
}

/**
 * True when this row would still fall back to its baked `annualINR` — i.e. the
 * central rate cannot be applied because the country has no mapped currency.
 * Used by scripts/audit-fee-verification.js to keep the fallback visible.
 */
export function annualINRIsStale(course: AnyCourse | null | undefined): boolean {
  if (!course) return false;
  const code = courseCurrency(course);
  if (!code) return typeof course.annualINR === 'number' && course.annualINR > 0;
  const native = course[`annual${code}`];
  return !(typeof native === 'number' && native > 0)
    && typeof course.annualINR === 'number' && course.annualINR > 0;
}
