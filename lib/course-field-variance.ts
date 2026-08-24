/**
 * Which "course facts" are actually facts about the COURSE, and which are the same
 * for every course at that university?
 *
 * Background (Aug 2026 differentiation audit, reports/course-page-differentiation-
 * 2026-08-18.json): a course page was presenting IELTS/TOEFL/PTE, intake months,
 * campus and living cost as course-specific, when for most universities they are a
 * single value repeated across the entire catalogue — all 523 Adelaide courses share
 * one IELTS score, one TOEFL score and one intake pattern. That made ~47% of a course
 * page byte-identical to its ~500 siblings.
 *
 * The fix is NOT to delete these fields everywhere: IELTS genuinely varies at 42 of
 * 116 universities, and dropping it there would destroy real information. So decide
 * per university, from the data: show the field on the course page when it varies,
 * otherwise show it once on the university page and link to it.
 */
import { REGISTRY_FOR_VARIANCE } from '@/data/university-course-registry';

export type VarianceField = 'ieltsMin' | 'toeflMin' | 'pteMin' | 'intakeMonths' | 'campus';

export interface FieldVariance {
  /** true when the value differs between courses at this university */
  varies: boolean;
  /** the single shared value, when it does not vary */
  constantValue?: unknown;
  /** how many distinct values exist across the catalogue */
  distinct: number;
  /** how many courses were considered */
  courses: number;
}

const cache = new Map<string, Record<VarianceField, FieldVariance>>();

const FIELDS: VarianceField[] = ['ieltsMin', 'toeflMin', 'pteMin', 'intakeMonths', 'campus'];

/** Variance profile for one university, computed once and memoised. */
export function getFieldVariance(universitySlug: string): Record<VarianceField, FieldVariance> {
  const hit = cache.get(universitySlug);
  if (hit) return hit;

  const courses = (REGISTRY_FOR_VARIANCE[universitySlug] ?? []) as Array<Record<string, unknown>>;
  const out = {} as Record<VarianceField, FieldVariance>;

  for (const field of FIELDS) {
    const values = courses
      .map((c) => c[field])
      .filter((v) => v !== undefined && v !== null && v !== '')
      .map((v) => JSON.stringify(v));
    const distinct: string[] = [];
    for (const v of values) if (distinct.indexOf(v) === -1) distinct.push(v);
    out[field] = {
      varies: distinct.length > 1,
      constantValue: distinct.length === 1 ? JSON.parse(distinct[0]) : undefined,
      distinct: distinct.length,
      courses: values.length,
    };
  }

  cache.set(universitySlug, out);
  return out;
}

/**
 * Should this field be shown as a fact on an individual COURSE page?
 * True only when it actually differs between that university's courses. With fewer
 * than 2 courses there is nothing to compare, so keep showing it.
 */
export function showOnCoursePage(universitySlug: string, field: VarianceField): boolean {
  const v = getFieldVariance(universitySlug)[field];
  if (!v) return true;
  if (v.courses < 2) return true;
  return v.varies;
}

/** True when at least one of the entry-requirement fields varies per course. */
export function entryRequirementsVaryByCourse(universitySlug: string): boolean {
  return (['ieltsMin', 'toeflMin', 'pteMin'] as VarianceField[])
    .some((f) => showOnCoursePage(universitySlug, f));
}
