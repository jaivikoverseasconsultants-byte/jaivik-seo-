/**
 * Suppression of English-test scores a university does not actually publish.
 *
 * Background (2026-09-18): every course row carries `ieltsMin`, `toeflMin` and `pteMin`, but for
 * many universities only some of those came from the provider. The rest are house defaults applied
 * at generation time. Pages printed all three as requirements — "PTE Academic 58+ also accepted"
 * on Algonquin, which publishes no PTE score; a TOEFL figure for Durham, TMU and Waterloo, which
 * publish none; an IELTS floor for York and Queen's, whose own pages are tiered with no stated
 * institution-wide default. Unlike tuition, nothing gated these numbers.
 *
 * This is the English analogue of `lib/fee-verification`: the numbers stay in the data (so the
 * suppression is reversible the moment a provider is checked), and these helpers decide what may
 * be shown.
 *
 * THE SAME DELIBERATE DEFAULT AS FEES: a university with no entry in `ENGLISH_PUBLISHED` is
 * treated as publishing all three tests. Defaulting the other way would blank out the ~42
 * universities whose genuinely per-course IELTS varies. So an unchecked university keeps printing
 * what it printed before — add it to the map (via scripts/gen-english-published.js or by hand)
 * once its English-requirements page has been read.
 */
import { ENGLISH_PUBLISHED, type EnglishPublication } from '@/data/english-published';

export type EnglishTest = 'ielts' | 'toefl' | 'pte';

export interface EnglishBearingCourse {
  ieltsMin?: number;
  toeflMin?: number;
  pteMin?: number;
  /** per-row provenance written by the Canada-wave generator */
  englishScope?: string;
}

const LABELS: Record<EnglishTest, string> = {
  ielts: 'IELTS Academic',
  toefl: 'TOEFL iBT',
  pte: 'PTE Academic',
};

const FIELDS: Record<EnglishTest, keyof EnglishBearingCourse> = {
  ielts: 'ieltsMin',
  toefl: 'toeflMin',
  pte: 'pteMin',
};

/** What we know about this university, or null when it has never been checked. */
export function englishPublication(universitySlug: string | undefined): EnglishPublication | null {
  if (!universitySlug) return null;
  return ENGLISH_PUBLISHED[universitySlug] ?? null;
}

/** True when the university's own page states a score for this test (unknown universities: true). */
export function isTestPublished(universitySlug: string | undefined, test: EnglishTest): boolean {
  const p = englishPublication(universitySlug);
  if (!p) return true;
  return p[test];
}

/**
 * True when a row's own scope marks its scores as house defaults — the Canada-wave generator
 * records this per row, and it overrides the university-level answer.
 */
function rowIsHouseDefault(course: EnglishBearingCourse | null | undefined): boolean {
  return !!course?.englishScope && /house default|not published/i.test(course.englishScope);
}

/** The tests that may be shown for this course, with their values. Empty = say nothing specific. */
export function publishedEnglishTests(
  universitySlug: string | undefined,
  course: EnglishBearingCourse | null | undefined,
): Array<{ test: EnglishTest; label: string; value: number }> {
  if (!course || rowIsHouseDefault(course)) return [];
  return (Object.keys(LABELS) as EnglishTest[])
    .map((test) => ({ test, label: LABELS[test], value: Number(course[FIELDS[test]] ?? 0) }))
    .filter((t) => t.value > 0 && isTestPublished(universitySlug, t.test));
}

/** Convenience: may this course page state an IELTS minimum at all? */
export function hasPublishedIelts(
  universitySlug: string | undefined,
  course: EnglishBearingCourse | null | undefined,
): boolean {
  return publishedEnglishTests(universitySlug, course).some((t) => t.test === 'ielts');
}

/** Score for one test when it may be shown, else null. */
export function publishedScore(
  universitySlug: string | undefined,
  course: EnglishBearingCourse | null | undefined,
  test: EnglishTest,
): number | null {
  const hit = publishedEnglishTests(universitySlug, course).find((t) => t.test === test);
  return hit ? hit.value : null;
}

/** Honest replacement text when nothing may be stated. */
export function englishOnRequestNote(universityName: string): string {
  return `${universityName} does not publish a single English-language score that applies to this programme. Ask us and we will confirm the IELTS, TOEFL or PTE score you need before you apply.`;
}

/** Where the published figures came from, for a source link under the scores. */
export function englishScopeNote(universitySlug: string | undefined, course?: EnglishBearingCourse | null): string {
  const scope = course?.englishScope ?? englishPublication(universitySlug)?.scope ?? '';
  return /institution/i.test(scope)
    ? 'University-wide minimum — some programmes set a higher score.'
    : 'Published on the programme page.';
}

export function englishSourceUrl(universitySlug: string | undefined): string | null {
  return englishPublication(universitySlug)?.sourceUrl ?? null;
}
