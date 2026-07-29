// Real-data-only matching engine for /find-my-course. Filters
// getAllRealCourses() (the 103-university REAL course registry) — never
// the curated/estimated datasets used elsewhere (data/course-index.ts,
// data/compare.ts, data/universities.ts's acceptanceRate-style fields).
// Skip-on-missing throughout: a course only counts as a "match" for a
// filter we can honestly evaluate; nothing is guessed.

import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { getUniversityBySlug } from '@/data/universities';
import { englishReqsVerified } from '@/data/english-requirements-verified';
import { classifyLevel } from '@/lib/course-faqs';
import type { CourseForContent } from '@/lib/courseContent';

export type DegreeLevel = 'bachelor' | 'master';

export interface SubjectOption {
  value: string;
  label: string;
  matcher: RegExp | null; // null = "Any / Other", no subject filter
}

// Reuses the same 4 regexes as data/subject-pillars.ts where they overlap,
// plus a few more common student-searched fields on the same literal
// name-match pattern already trusted site-wide (see getAllNursingCourses()
// in data/university-course-registry.ts for the identical precedent).
export const SUBJECT_OPTIONS: SubjectOption[] = [
  { value: 'any', label: 'Any / Other', matcher: null },
  { value: 'mba', label: 'MBA', matcher: /\b(mba|business administration)\b/i },
  { value: 'cs', label: 'Computer Science', matcher: /\b(computer science|computing)\b/i },
  { value: 'ds', label: 'Data Science', matcher: /\b(data science|data analytics|business analytics)\b/i },
  { value: 'finance', label: 'Finance & Accounting', matcher: /\b(finance|accounting)\b/i },
  { value: 'engineering', label: 'Engineering', matcher: /\bengineering\b/i },
  { value: 'nursing', label: 'Nursing', matcher: /\bnursing\b/i },
  { value: 'law', label: 'Law', matcher: /\bllm\b|\blaw\b/i },
  { value: 'psychology', label: 'Psychology', matcher: /\bpsycholog/i },
];

export interface BudgetBand {
  value: string;
  label: string;
  maxINR: number; // Infinity = no upper limit
}

export const BUDGET_BANDS: BudgetBand[] = [
  { value: '10l', label: 'Under ₹10L/yr', maxINR: 1_000_000 },
  { value: '15l', label: '₹10L – 15L/yr', maxINR: 1_500_000 },
  { value: '20l', label: '₹15L – 20L/yr', maxINR: 2_000_000 },
  { value: '25l', label: '₹20L – 25L/yr', maxINR: 2_500_000 },
  { value: 'any', label: 'Above ₹25L/yr', maxINR: Infinity },
];

export const IELTS_OPTIONS = ['Below 6.0', '6.0', '6.5', '7.0', '7.5+', 'Not given yet'] as const;

export const COUNTRY_OPTIONS = [
  'UK', 'USA', 'Canada', 'Australia', 'Germany', 'Ireland', 'New Zealand',
  'Netherlands', 'Singapore', 'UAE', 'Denmark', 'Sweden', 'Finland', 'Italy',
];

export interface MatchProfile {
  countries: string[]; // empty = any country
  level: DegreeLevel | '';
  subject: string; // SubjectOption.value
  budget: string; // BudgetBand.value
  ielts: string; // one of IELTS_OPTIONS, or ''
  percentage: string; // lead context only, never used to filter
  backlogs: string; // 'no' | a count, lead context only
  studyGap: 'yes' | 'no' | ''; // lead context only
}

export interface MatchedCourse extends RealCourseEntry {
  universityName: string;
  ieltsVerified: boolean;
  ieltsDisplay: string;
}

function ieltsToNumber(val: string): number | null {
  if (val === 'Below 6.0') return 5.5;
  if (val === '7.5+') return 7.5;
  if (val === 'Not given yet' || val === '') return null;
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : null;
}

function toCourseForContent(c: RealCourseEntry): CourseForContent {
  return {
    name: c.name, level: c.level, studyLevel: c.studyLevel, duration: c.duration,
    durationYears: c.durationYears, campus: '', intakeMonths: c.intakeMonths,
    country: c.country, ieltsMin: c.ieltsMin, toeflMin: c.toeflMin, pteMin: c.pteMin,
    annualINR: c.annualINR, annualUSD: c.annualUSD,
  };
}

/**
 * Filters the REAL course registry against a student profile. Only fields
 * we can honestly evaluate are used to filter/rank:
 *   - country, level (classifyLevel(), same classifier trusted site-wide),
 *     subject (literal name regex match), fee (annualINR, only courses with
 *     a verified fee > 0 are matched at all — a course with no verified fee
 *     can't honestly be judged against a budget).
 *   - IELTS is NEVER a hard filter. A course's own `ieltsMin` is a known
 *     generator-formula default for 95-100% of entries (see BUILD-LOG
 *     2026-07-18 finding) and is not read here at all for matching. Instead,
 *     each result is cross-checked against the 8 manually-verified
 *     universities in data/english-requirements-verified.ts — verified
 *     universities get a real number and a soft ranking boost if the
 *     student's own IELTS clears it; every other course is honestly
 *     labelled "Confirm with counsellor", never asserted pass/fail.
 * Ranking is transparent, not a fabricated match percentage: verified
 * IELTS fit first, then real fee ascending (best budget fit).
 */
export function matchCourses(profile: MatchProfile): MatchedCourse[] {
  const all = getAllRealCourses();
  let filtered = all.filter(c => c.annualINR > 0);

  if (profile.countries.length > 0) {
    filtered = filtered.filter(c => profile.countries.includes(c.country));
  }

  if (profile.level) {
    filtered = filtered.filter(c => classifyLevel(toCourseForContent(c)) === profile.level);
  }

  const subjectOption = SUBJECT_OPTIONS.find(s => s.value === profile.subject);
  if (subjectOption?.matcher) {
    const matcher = subjectOption.matcher;
    filtered = filtered.filter(c => matcher.test(c.name));
  }

  const band = BUDGET_BANDS.find(b => b.value === profile.budget);
  if (band) {
    filtered = filtered.filter(c => c.annualINR <= band.maxINR);
  }

  const studentIelts = ieltsToNumber(profile.ielts);

  const matched: (MatchedCourse & { _ieltsFit: number })[] = filtered.map(c => {
    const verified = englishReqsVerified.find(r => r.universitySlug === c.universitySlug);
    const uni = getUniversityBySlug(c.universitySlug);
    const ieltsVerified = !!verified;
    const ieltsDisplay = verified
      ? `${verified.ieltsOverall}+ (verified)`
      : 'Confirm with counsellor';
    let ieltsFit = 0.5; // neutral — no verified data to judge against
    if (verified && studentIelts !== null) {
      ieltsFit = studentIelts >= verified.ieltsOverall ? 1 : 0;
    }
    return {
      ...c,
      universityName: uni?.name ?? c.universitySlug,
      ieltsVerified,
      ieltsDisplay,
      _ieltsFit: ieltsFit,
    };
  });

  matched.sort((a, b) => {
    if (a._ieltsFit !== b._ieltsFit) return b._ieltsFit - a._ieltsFit;
    return a.annualINR - b.annualINR;
  });

  return matched.map(({ _ieltsFit, ...rest }) => rest);
}

export function uniqueUniversityCount(matches: MatchedCourse[]): number {
  return new Set(matches.map(m => m.universitySlug)).size;
}
