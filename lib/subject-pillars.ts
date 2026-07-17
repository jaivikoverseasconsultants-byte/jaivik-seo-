import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { SUBJECT_PILLARS, type SubjectPillarConfig } from '@/data/subject-pillars';
import { buildMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

// Same slug maps used by the decision hubs (app/[decisionSlug]/page.tsx,
// components/IeltsBandHub.tsx, app/courses-with-psw/[country]/page.tsx) —
// duplicated here rather than centralized, matching this repo's existing
// per-file convention for these maps.
export const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', 'New Zealand': 'new-zealand',
  Netherlands: 'netherlands', Ireland: 'ireland', USA: 'usa', Germany: 'germany',
  Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland', Singapore: 'singapore',
  'United Arab Emirates': 'united-arab-emirates',
};
export const PSW_COUNTRY_SLUGS: Record<string, string> = {
  Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
  Germany: 'germany', 'New Zealand': 'new-zealand',
};
export const BUDGET_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', Ireland: 'ireland',
  Netherlands: 'netherlands', 'New Zealand': 'new-zealand', USA: 'usa',
  Germany: 'germany', Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland',
  Singapore: 'singapore', 'United Arab Emirates': 'united-arab-emirates', Italy: 'italy',
};
const BUDGET_BANDS = [10, 15, 20, 25];
const BUDGET_MIN_MATCHES = 15;

export const COUNTRY_FLAGS: Record<string, string> = {
  UK: '🇬🇧', Australia: '🇦🇺', Canada: '🇨🇦', Ireland: '🇮🇪', Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿', USA: '🇺🇸', Germany: '🇩🇪', Denmark: '🇩🇰', Sweden: '🇸🇪',
  Finland: '🇫🇮', Singapore: '🇸🇬', 'United Arab Emirates': '🇦🇪', Italy: '🇮🇹',
};

let _cache: Map<string, RealCourseEntry[]> | null = null;

/** All real courses (with a real fee) whose name matches this pillar's subject. */
export function getCoursesForPillar(config: SubjectPillarConfig): RealCourseEntry[] {
  if (!_cache) _cache = new Map();
  const cached = _cache.get(config.slug);
  if (cached) return cached;
  const matches = getAllRealCourses().filter(c => config.matcher.test(c.name) && c.annualINR > 0);
  _cache.set(config.slug, matches);
  return matches;
}

export interface CountryBreakdown {
  country: string;
  courses: RealCourseEntry[];
  minFeeLakh: string;
  maxFeeLakh: string;
  minIelts: number;
  cheapestHubSlug?: string;
  pswHubSlug?: string;
  budgetLink?: { slug: string; band: number };
}

export function getCountryBreakdown(courses: RealCourseEntry[]): CountryBreakdown[] {
  const byCountry = new Map<string, RealCourseEntry[]>();
  for (const c of courses) {
    if (!byCountry.has(c.country)) byCountry.set(c.country, []);
    byCountry.get(c.country)!.push(c);
  }

  const rows: CountryBreakdown[] = [];
  for (const [country, list] of Array.from(byCountry.entries())) {
    const sorted = list.slice().sort((a, b) => a.annualINR - b.annualINR);
    const ieltsValues = list.map(c => c.ieltsMin).filter(v => v > 0);
    const budgetSlug = BUDGET_COUNTRY_SLUGS[country];
    const budgetBand = budgetSlug
      ? BUDGET_BANDS.find(b =>
          getAllRealCourses().filter(c => c.country === country && c.annualINR > 0 && c.annualINR <= b * 100000).length >= BUDGET_MIN_MATCHES)
      : undefined;

    rows.push({
      country,
      courses: sorted,
      minFeeLakh: (sorted[0].annualINR / 100000).toFixed(1),
      maxFeeLakh: (sorted[sorted.length - 1].annualINR / 100000).toFixed(1),
      minIelts: ieltsValues.length ? Math.min(...ieltsValues) : 0,
      cheapestHubSlug: CHEAPEST_COUNTRY_SLUGS[country],
      pswHubSlug: PSW_COUNTRY_SLUGS[country],
      budgetLink: budgetBand ? { slug: budgetSlug, band: budgetBand } : undefined,
    });
  }

  return rows.sort((a, b) => b.courses.length - a.courses.length);
}

export function getCheapestOverall(courses: RealCourseEntry[], limit = 20): RealCourseEntry[] {
  return courses.slice().sort((a, b) => a.annualINR - b.annualINR).slice(0, limit);
}

/** Subject pillars that actually have ≥1 real course in this country — used so
 * decision hubs (country-scoped) only ever link to a pillar with real content there. */
export function getPillarsWithCoverageInCountry(country: string): SubjectPillarConfig[] {
  return SUBJECT_PILLARS.filter(p => getCoursesForPillar(p).some(c => c.country === country));
}

export function buildPillarMetadata(config: SubjectPillarConfig, courses: RealCourseEntry[]): Metadata {
  const countries = new Set(courses.map(c => c.country)).size;
  return buildMetadata({
    title: `${config.name} Abroad for Indian Students — Fees in INR, IELTS & Top Universities 2026`,
    description: `${courses.length} real ${config.introLabel} courses across ${countries} countries, with tuition fees converted to INR, IELTS requirements, and direct links to every course. Real data, crawled from each university's own course pages.`,
    path: `/${config.slug}`,
    keywords: [`${config.name} abroad for indian students`, `${config.name} abroad fees in INR`, `study ${config.name} abroad`, `${config.name} universities for indian students`],
  });
}
