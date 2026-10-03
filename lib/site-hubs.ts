import { universities, countries } from '@/data/universities';
import { getAllRealCourses, type RealCourseEntry } from '@/data/university-course-registry';
import { isRedirected } from '@/lib/sitemap-courses';

/**
 * The single source of truth for which country hubs and budget/cheapest hubs exist.
 *
 * Why this module exists (2026-10-03, after a Search Console audit): only 564 of ~22,900 sitemap
 * URLs were indexed. The country and budget hubs were generated from data, but every list that
 * LINKED to them was typed by hand — the navbar, the homepage, the footer, the country pages'
 * sidebars and the sitemap each kept their own copy. The first countries (UK, Australia) were
 * linked by hand; every country added after that got a page and a sitemap entry but no
 * homepage/nav link (Finland's hub had no nav or homepage link at all, and the UAE country page
 * looked budget hubs up as "UAE" while course data says "United Arab Emirates", so it linked none).
 *
 * Every page that generates, lists or links a hub now reads it from here, so a new country or
 * budget band appears in navigation the moment its data does.
 */

export const COUNTRY_FLAGS: Record<string, string> = {
  UK: '🇬🇧', USA: '🇺🇸', Canada: '🇨🇦', Australia: '🇦🇺', Germany: '🇩🇪', Ireland: '🇮🇪',
  Singapore: '🇸🇬', 'New Zealand': '🇳🇿', France: '🇫🇷', Netherlands: '🇳🇱', Sweden: '🇸🇪',
  UAE: '🇦🇪', 'United Arab Emirates': '🇦🇪', Denmark: '🇩🇰', Italy: '🇮🇹', Spain: '🇪🇸', Finland: '🇫🇮',
};

/** Universities are tagged "UAE"; course rows say "United Arab Emirates". */
const COURSE_COUNTRY: Record<string, string> = { UAE: 'United Arab Emirates' };
export const courseCountryOf = (universityCountry: string) => COURSE_COUNTRY[universityCountry] ?? universityCountry;
const UNIVERSITY_COUNTRY = Object.fromEntries(Object.entries(COURSE_COUNTRY).map(([u, c]) => [c, u]));
export const universityCountryOf = (courseCountry: string) => UNIVERSITY_COUNTRY[courseCountry] ?? courseCountry;

export const slugOfCountry = (name: string) => name.toLowerCase().replace(/ /g, '-');

// ─── Country hubs: /universities/country/<slug> ──────────────────────────────

export interface CountryHub {
  /** Name as tagged on university records ("UK", "UAE"). */
  name: string;
  slug: string;
  flag: string;
  universityCount: number;
}

/** Every country with at least one university, most universities first. */
export function getCountryHubs(): CountryHub[] {
  return countries
    .map((name) => ({
      name,
      slug: slugOfCountry(name),
      flag: COUNTRY_FLAGS[name] ?? '🌍',
      universityCount: universities.filter((u) => u.country === name).length,
    }))
    .filter((c) => c.universityCount > 0)
    .sort((a, b) => b.universityCount - a.universityCount || a.name.localeCompare(b.name));
}

// ─── Budget and cheapest hubs: /<country>-under-<band>-lakh, /cheapest-universities-<country> ───

export const BUDGET_BANDS = [10, 15, 20, 25];
/** A budget page needs at least this many courses at or under its band... */
export const BUDGET_MIN_MATCHES = 15;
/**
 * ...and at least this many that are new at its band (priced above the next lower band that has a
 * page). Below that it repeats the lower page almost row for row: until 2026-10-03 Germany's four
 * bands were the same 239 courses, and Sweden's, Italy's, Denmark's and the USA's higher bands
 * copied a lower one exactly — the near-duplicates Google declined to index.
 */
export const BUDGET_MIN_NEW_IN_BAND = 10;

/** Countries with budget and cheapest hubs, keyed by course-data country name. */
export const BUDGET_COUNTRY_SLUGS: Record<string, string> = {
  UK: 'uk', Australia: 'australia', Canada: 'canada', Ireland: 'ireland',
  Netherlands: 'netherlands', 'New Zealand': 'new-zealand', USA: 'usa',
  Germany: 'germany', Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland',
  Singapore: 'singapore', 'United Arab Emirates': 'united-arab-emirates', Italy: 'italy',
};
export const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = Object.fromEntries(
  Object.entries(BUDGET_COUNTRY_SLUGS).filter(([c]) => c !== 'Italy'),
);
export const PSW_COUNTRY_SLUGS: Record<string, string> = {
  Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
  Germany: 'germany', 'New Zealand': 'new-zealand',
};

export function getCheapestCourses(country: string): RealCourseEntry[] {
  return getAllRealCourses().filter((c) => c.country === country && c.annualINR > 0).sort((a, b) => a.annualINR - b.annualINR);
}

/** Every course at or under the band (the cumulative list the old pages showed). */
export function getBudgetCourses(country: string, band: number): RealCourseEntry[] {
  return getCheapestCourses(country).filter((c) => c.annualINR <= band * 100000);
}

export interface BudgetHub {
  country: string;
  countrySlug: string;
  /** Slug of the matching /universities/country/<slug> page ("uae" for United Arab Emirates). */
  countryHubSlug: string;
  band: number;
  slug: string;
  /** Next lower band that has a page, or 0 for the country's first page. */
  lowerBand: number;
  /** Courses at or under the band. */
  total: RealCourseEntry[];
  /** Courses priced above `lowerBand` and at or under `band` — what this page adds. */
  inBand: RealCourseEntry[];
}

let budgetHubCache: BudgetHub[] | null = null;

/** The budget hubs that get a page, in country then band order. */
export function getBudgetHubs(): BudgetHub[] {
  if (budgetHubCache) return budgetHubCache;
  const hubs: BudgetHub[] = [];
  for (const [country, countrySlug] of Object.entries(BUDGET_COUNTRY_SLUGS)) {
    let lowerBand = 0;
    for (const band of BUDGET_BANDS) {
      const total = getBudgetCourses(country, band);
      const inBand = total.filter((c) => c.annualINR > lowerBand * 100000);
      if (total.length < BUDGET_MIN_MATCHES || inBand.length < BUDGET_MIN_NEW_IN_BAND) continue;
      // A band dropped for being a near-copy gets a 301 to the band below in vercel.json. If new course
      // data makes it qualify again, that redirect would silently hide the new page — so stop the build.
      if (isRedirected(`/${countrySlug}-under-${band}-lakh`)) {
        throw new Error(`/${countrySlug}-under-${band}-lakh now qualifies for a page, but vercel.json still redirects it — remove that redirect`);
      }
      hubs.push({ country, countrySlug, countryHubSlug: slugOfCountry(universityCountryOf(country)), band, slug: `${countrySlug}-under-${band}-lakh`, lowerBand, total, inBand });
      lowerBand = band;
    }
  }
  budgetHubCache = hubs;
  return hubs;
}

export function getBudgetHub(slug: string): BudgetHub | undefined {
  return getBudgetHubs().find((h) => h.slug === slug);
}

export function getBudgetHubsForCountry(country: string): BudgetHub[] {
  const c = courseCountryOf(country);
  return getBudgetHubs().filter((h) => h.country === c);
}

export interface CheapestHub { country: string; slug: string; count: number }

/** Cheapest-universities hubs with at least one priced course. */
export function getCheapestHubs(): CheapestHub[] {
  return Object.entries(CHEAPEST_COUNTRY_SLUGS)
    .map(([country, s]) => ({ country, slug: `cheapest-universities-${s}`, count: getCheapestCourses(country).length }))
    .filter((h) => h.count > 0);
}

export function getCheapestHubForCountry(country: string): CheapestHub | undefined {
  const c = courseCountryOf(country);
  return getCheapestHubs().find((h) => h.country === c);
}
