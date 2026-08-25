/**
 * Interim suppression of unverified tuition figures.
 *
 * Background (Aug 2026 flat-fee scan, reports/flat-fee-scan-2026-08-18.json): 73 of
 * 101 priced universities carry the same fabricated flat-fee signature already fixed
 * for the 9 Australian files — a whole catalogue sharing a handful of round-number
 * values, e.g. Strathclyde's 561 courses on 2 values, Exeter's 394 on 2. A live check
 * confirmed the figures are wrong, not merely coarse: Birmingham's Railway Systems MSc
 * is published at £34,190 against a stored £26,000, and Leeds' Accounting and Finance
 * MSc at £35,500 against £26,000.
 *
 * Re-crawling every provider needs a bespoke extractor each and is being phased. Until
 * a university is verified, its pages must not state a precise tuition figure they
 * cannot support. `feeVerified: false` marks those rows, and the helpers here render an
 * honest placeholder instead.
 *
 * The underlying numbers are deliberately LEFT IN THE DATA rather than zeroed, so the
 * suppression is reversible the moment a provider is verified.
 */

export interface FeeVerifiable {
  feeVerified?: boolean;
  [key: string]: unknown;
}

/** Rows are treated as verified unless explicitly flagged otherwise. */
export function isFeeVerified(course: FeeVerifiable | null | undefined): boolean {
  return !course || course.feeVerified !== false;
}

export const UNVERIFIED_FEE_LABEL = 'On request';

export const UNVERIFIED_FEE_NOTE =
  'We are re-checking this course’s tuition against the university’s own published ' +
  'figures and are not showing an amount until that is confirmed. Ask us and we will get ' +
  'you the current fee in writing.';

const SYMBOL: Record<string, string> = {
  GBP: '£', EUR: '€', USD: '$', CAD: 'C$', AUD: 'A$',
  NZD: 'NZ$', SGD: 'S$', AED: 'AED ', INR: '₹',
};

/**
 * Native-currency fee for display, or the placeholder when unverified.
 * `amount` is passed in already-resolved so this stays currency-agnostic.
 */
export function feeDisplay(
  course: FeeVerifiable,
  amount: number | undefined | null,
  code: string,
): string {
  if (!isFeeVerified(course)) return UNVERIFIED_FEE_LABEL;
  if (typeof amount !== 'number' || amount <= 0) return UNVERIFIED_FEE_LABEL;
  return `${SYMBOL[code] ?? code + ' '}${amount.toLocaleString()}`;
}

/** INR-lakh fee for display, or the placeholder when unverified. */
export function feeDisplayINRLakh(
  course: FeeVerifiable,
  lakh: string | number | null | undefined,
  suffix = '/yr',
): string {
  if (!isFeeVerified(course)) return UNVERIFIED_FEE_LABEL;
  const n = typeof lakh === 'string' ? parseFloat(lakh) : lakh;
  if (typeof n !== 'number' || !isFinite(n) || n <= 0) return UNVERIFIED_FEE_LABEL;
  return `₹${n.toFixed(1)}L${suffix}`;
}
