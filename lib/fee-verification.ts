import { courseAnnualINR, inrToLakh } from '@/lib/currency';
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

/**
 * Deliberately just the one field, with no index signature: an index signature
 * would make every concrete course interface (which has none) fail to satisfy
 * this. `verifiedAvgFee` casts locally where it needs dynamic field access.
 */
export interface FeeVerifiable {
  feeVerified?: boolean;
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

/**
 * Mean annual fee across the rows that are BOTH verified and priced; 0 when none
 * are. Used by the university course-index pages, whose "Avg £24K/yr" headline
 * stat and average-tuition FAQ answer were previously averaged over the whole
 * catalogue — so a university with no verified fee at all still published a
 * confident-looking average built entirely from unverified numbers.
 *
 * Callers pass the same list they were already averaging, so each page keeps its
 * own scope (postgraduate-only, priced-only, etc.); only the verification filter
 * is added. Render 0 as "On request" rather than as a figure.
 */
export function verifiedAvgFee(
  courses: readonly FeeVerifiable[] | undefined | null,
  ...fields: string[]
): number {
  if (!Array.isArray(courses)) return 0;
  const vals: number[] = [];
  for (const c of courses) {
    if (!isFeeVerified(c)) continue;
    // first field that carries a real number wins, mirroring the
    // `c.annualEUR || c.annualUSD || 0` fallbacks these pages used inline
    const row = c as unknown as Record<string, unknown>;
    for (const f of fields) {
      const v = row?.[f];
      if (typeof v === 'number' && isFinite(v) && v > 0) { vals.push(v); break; }
    }
  }
  if (!vals.length) return 0;
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}

/**
 * A fee range built ONLY from rows whose fee has been verified against the
 * provider's own page, plus the provenance needed to state it honestly.
 *
 * Why (2026-08-26): the cost- and subject-pillar pages published sentences like
 * "Across 2,308 real courses on this site, tuition fees range from ₹4.9L to
 * ₹35.6L per year" — into the visible copy AND the FAQPage JSON-LD — computed
 * across the whole catalogue including suppressed rows. For Canada, Ireland, the
 * Netherlands, the USA and 5 more, NONE of the underlying fees were verified.
 *
 * Returns null when nothing is verified, which callers must render as "no range"
 * rather than as a zero range. Where a range does survive it is usually drawn
 * from a minority of the catalogue, so `basisNote` is not optional decoration —
 * it is the difference between a checkable claim and a misleading one. The
 * courses themselves are real; it is their fees that are unverified, and the
 * wording must keep that distinction.
 */
export interface VerifiedFeeRange {
  verifiedCount: number;
  listedCount: number;
  minLakh: string;
  medianLakh: string;
  maxLakh: string;
  /** e.g. "based on 1,294 fee-verified courses of 9,692 listed" */
  basisNote: string;
  /** true when the verified rows are a minority — callers may want to lead with it */
  isPartial: boolean;
}

export function verifiedFeeRange(
  courses: readonly FeeVerifiable[] | null | undefined,
): VerifiedFeeRange | null {
  if (!Array.isArray(courses)) return null;
  const priced: number[] = [];
  const verified: number[] = [];
  for (const c of courses) {
    const inr = courseAnnualINR(c as never);
    if (!inr || inr <= 0) continue;
    priced.push(inr);
    if (isFeeVerified(c)) verified.push(inr);
  }
  if (!verified.length) return null;
  verified.sort((a, b) => a - b);
  const lakh = (n: number) => (n / 100000).toFixed(1);
  const verifiedCount = verified.length;
  const listedCount = priced.length;
  return {
    verifiedCount,
    listedCount,
    minLakh: lakh(verified[0]),
    medianLakh: lakh(verified[Math.floor(verified.length / 2)]),
    maxLakh: lakh(verified[verified.length - 1]),
    basisNote: `based on ${verifiedCount.toLocaleString('en-IN')} fee-verified course${verifiedCount === 1 ? '' : 's'} of ${listedCount.toLocaleString('en-IN')} listed`,
    isPartial: verifiedCount < listedCount,
  };
}

/**
 * The "Fees in INR, " fragment of a course-page <title>.
 *
 * Empty when the fee is unverified or absent, so a suppressed page does not
 * promise a figure in the SERP headline that the page itself answers with
 * "On request". Same standard as the body content and the meta description.
 */
export function titleFeeFragment(
  course: FeeVerifiable,
  annualINR?: number | null,
): string {
  if (!isFeeVerified(course)) return '';
  const inr = courseAnnualINR(course as never)
    ?? (typeof annualINR === 'number' ? annualINR : null);
  if (typeof inr !== 'number' || !isFinite(inr) || inr <= 0) return '';
  return 'Fees in INR, ';
}

/**
 * The " costs ₹X.XL/year for Indian students." clause used in course-page meta
 * descriptions (and og:description).
 *
 * Returns a bare "." when the fee is unverified or absent, so the preceding
 * sentence still closes cleanly without stating a figure we cannot support.
 * This matters more than the on-page label: the meta description is what Google
 * renders in the SERP, so an unguarded figure here is a fabricated price shown
 * to searchers even when the page body correctly says "On request".
 */
export function feeSentenceINR(
  course: FeeVerifiable,
  annualINR: number | undefined | null,
): string {
  if (!isFeeVerified(course)) return '.';
  // Derive from the native fee at the central rate rather than trusting the
  // caller's baked, crawl-dated annualINR (see lib/currency.ts). The argument is
  // kept as a fallback for courses whose country has no mapped currency.
  const inr = courseAnnualINR(course as never)
    ?? (typeof annualINR === 'number' ? annualINR : null);
  const lakh = inrToLakh(inr);
  return lakh ? ` costs ₹${lakh}L/year for Indian students.` : '.';
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
