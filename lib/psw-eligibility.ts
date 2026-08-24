/**
 * Post-study-work eligibility gate.
 *
 * Background (Aug 2026): the course registry contains real, accredited offerings that
 * are NOT degree programmes — Australian VET qualifications and skill sets, English
 * tests, safety/licence short courses, standalone study-abroad semesters. Every one of
 * them was publishing a post-study work claim, because the per-university course
 * templates hardcoded a "Post-Study Visa" row with no check at all, and because
 * classifyLevel() in lib/course-faqs.ts falls through to a degree classification for
 * anything tagged studyLevel Undergraduate/Postgraduate.
 *
 * A PTE exam sat on the site advertising "~2 years post-study work". That is a false
 * claim about immigration entitlement, so this module gates it in one place.
 *
 * Two layers, deliberately:
 *   1. `pswEligible: false` on the data row — an explicit, reviewed decision.
 *   2. `isNonDegreeOffering()` — a name-based check so a FUTURE crawl that imports
 *      non-degree rows without the flag still cannot publish a post-study work claim.
 *      Layer 2 is the one that makes this not recur.
 */

export interface PswCandidate {
  name: string;
  level?: string;
  studyLevel?: string;
  /** the provider's own course URL — its path often declares the tier explicitly */
  url?: string;
  /** false = reviewed and confirmed not a degree programme for post-study-work purposes */
  pswEligible?: boolean;
}

/**
 * URL paths where the PROVIDER itself declares the offering is below degree level.
 * Deliberately narrow. A name-based rule was tried for English-language courses and
 * rejected: most "english-language" entries in the registry are real degrees
 * (BA English Language and Linguistics, MA TESOL), and only the ones the university
 * files under a pre-university path are actually non-degree.
 */
const NON_DEGREE_URL_PATHS: ReadonlyArray<RegExp> = [
  /\/pre-university-study\//i,
  /\/elicos\//i,
];

/**
 * Award tokens that mark a real degree. Checked first, so a legitimate degree whose
 * name happens to contain a flagged word ("MSc Occupational Health and Safety",
 * "BSc Economics with Study Abroad") is never misclassified.
 */
const DEGREE_AWARD =
  /\b(bachelor|master|doctor|phd|dphil|b[a-z]{0,6}sc|bsc|ba|beng|bcom|bbus|llb|llm|m[a-z]{0,7}sc|msc|msci|mcomp|ma|mba|meng|mres|mphil|mphys|mmath|mchem|mbiol|mbiomed|mbiochem|march|mpharm|mnurs|moptom|bmus|mus|bvsc|pgce|pgcert|pgdip)\b/i;

const NON_DEGREE_PATTERNS: ReadonlyArray<RegExp> = [
  // the offering IS an English/admissions test
  /^(PTE|IELTS|TOEFL|GMAT|GRE)\b/i,
  /Pearson Test of English|Mock Test/i,
  // Australian VET training-package codes: RII30820, BSB30120, CHCSS00070, FNSSS00005
  /^([A-Z]{3}\d{5}|[A-Z]{5,6}\d{5})\b/,
  // state-accredited course codes, e.g. 22582VIC Certificate IV in Tertiary Preparation
  /^\d{4,5}[A-Z]{2,4}\b/,
  // provider short-course codes seen in the registry
  /^(VTP\d{3}|TNSCF|TNA[A-Z]{2}|CONISS\d+|ZSCV\d+)\b/,
  // a cluster of units, explicitly not a qualification
  /\bSkill\s?Sets?\b|Statement of Attainment/i,
  // standalone study-abroad / exchange / non-award enrolment
  /^(Study Abroad|Student Exchange|International Exchange|Non[- ]Award|Visiting Student)\b/i,
  /Study Abroad (Program|Programme)\b|\(Student Exchange\)/i,
  // safety / licence / induction short courses
  /Prepare to Work Safely|White Card|Licence to Operate|Working at Heights|Confined Space|Elevating Work Platform|Food Safety Supervis|Basic Scaffolding|Operate and Maintain Chainsaws/i,
  // CPD and standalone professional practice courses
  /^CPD\b|^Continuing Professional Development\b|^Professional Course in\b|Notarial Practice/i,
];

/** True when the entry is not a degree programme (so no post-study work claim). */
export function isNonDegreeOffering(course: PswCandidate): boolean {
  const name = String(course.name ?? '');
  if (!name) return true;
  // an explicit award always wins — never strip a real degree
  if (DEGREE_AWARD.test(name)) return false;
  const url = String(course.url ?? '');
  if (url && NON_DEGREE_URL_PATHS.some((re) => re.test(url))) return true;
  return NON_DEGREE_PATTERNS.some((re) => re.test(name));
}

/**
 * Whether it is honest to show post-study work rights for this entry.
 *
 * Mirrors the policy classifyLevel() already applies in lib/course-faqs.ts: certificate
 * and diploma awards carry distinct (often less generous) post-study work rights that
 * are not safe to generalise from Bachelor's/Master's rules, so they get no generic
 * claim either. Without this the hardcoded template rows would still assert a degree's
 * PSW entitlement for a Certificate III.
 */
export function isPswEligible(course: PswCandidate): boolean {
  if (course.pswEligible === false) return false;
  if (isNonDegreeOffering(course)) return false;
  const text = `${course.level ?? ''} ${course.name ?? ''}`.toLowerCase();
  if (/certificate|diploma/.test(text)) return false;
  return true;
}
