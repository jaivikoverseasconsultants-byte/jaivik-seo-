import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { universities, countries } from '@/data/universities';
import { courses, courseCategories } from '@/data/courses';
import { CANADA_CITY_SLUGS } from '@/data/canada-cities';
import { getAllRealCourses } from '@/data/university-course-registry';
import { SUBJECT_PILLARS } from '@/data/subject-pillars';
import { COST_PILLARS } from '@/data/cost-pillars';
import { UNIVERSITY_COMPARISONS } from '@/data/university-comparisons';
import { getUniversityComparisonData } from '@/lib/university-comparisons';
import { getAllCountrySubjectComparisons } from '@/lib/country-subject-comparisons';
import { englishReqsVerified } from '@/data/english-requirements-verified';

const BASE = 'https://study.jaivikoverseasconsultants.com';

/** Extract course slugs from a TypeScript data file using regex. */
function extractSlugsFromTs(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const results: string[] = [];
    // Matches both: slug: 'foo'  and  "slug": "foo"
    const re = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) results.push(m[1]);
    return results;
  } catch {
    return [];
  }
}

/**
 * Read a university's courses/page.tsx and return the path to its data file.
 * Looks for the first import from '@/data/...-courses'.
 */
function findDataFile(coursesPagePath: string): string | null {
  try {
    const content = fs.readFileSync(coursesPagePath, 'utf-8');
    const m = content.match(/from\s+['"]@\/data\/([\w-]+-courses)['"]/);
    if (m) return path.join(process.cwd(), 'data', `${m[1]}.ts`);
  } catch {}
  return null;
}

// ── Per-page lastmod: real git history, not build time ──────────────────────
// A single `new Date()` stamped on every URL at build time is a freshness
// signal search engines learn to ignore entirely — it never differentiates a
// just-added page from one that's sat unchanged for months. Instead, derive
// each URL's lastModified from the actual git commit history of the source
// file(s) that page's content comes from (its data file, its route file, any
// shared component it renders). Skip-on-missing: if git history can't be
// resolved for a path (e.g. a shallow clone with no history for that file),
// lastModified is omitted for that URL entirely — never fall back to build
// time or invent a date. Cached per unique file path so a build touching
// thousands of URLs only shells out to git once per underlying source file
// (on the order of a few hundred, not tens of thousands).
const gitDateCache = new Map<string, Date | null>();

function gitLastModified(absOrRelPath: string): Date | null {
  const relPath = (path.isAbsolute(absOrRelPath) ? path.relative(process.cwd(), absOrRelPath) : absOrRelPath)
    .split(path.sep).join('/');
  if (gitDateCache.has(relPath)) return gitDateCache.get(relPath)!;
  let result: Date | null = null;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    }).toString().trim();
    if (out) {
      const d = new Date(out);
      if (!isNaN(d.getTime())) result = d;
    }
  } catch {
    result = null;
  }
  gitDateCache.set(relPath, result);
  return result;
}

/** Most recent git lastmod among several candidate source files — used when a
 * page's rendered content is assembled from more than one file (a route +
 * a shared component + a data file). undefined (omit lastmod) only if none
 * of the candidates resolve to a real git history entry. */
function latestOf(...paths: string[]): Date | undefined {
  let latest: Date | null = null;
  for (const p of paths) {
    const d = gitLastModified(p);
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest ?? undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: latestOf('app/page.tsx'), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/universities`,     lastModified: latestOf('app/universities/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/courses`,          lastModified: latestOf('app/courses/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/course-finder`,    lastModified: latestOf('app/course-finder/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/book-counselling`, lastModified: latestOf('app/book-counselling/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/compare`,          lastModified: latestOf('app/compare/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/ielts-mock-test`,  lastModified: latestOf('app/ielts-mock-test/page.tsx'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/nursing-abroad`,   lastModified: latestOf('app/nursing-abroad/page.tsx'), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/terms`,            lastModified: latestOf('app/terms/page.tsx'), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy-policy`,   lastModified: latestOf('app/privacy-policy/page.tsx'), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/universities-accepting-backlogs`,  lastModified: latestOf('app/universities-accepting-backlogs/page.tsx'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/study-gap-accepted-universities`,  lastModified: latestOf('app/study-gap-accepted-universities/page.tsx'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/study-abroad-without-ielts`,       lastModified: latestOf('app/study-abroad-without-ielts/page.tsx'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/low-cgpa-universities-abroad`,     lastModified: latestOf('app/low-cgpa-universities-abroad/page.tsx'), changeFrequency: 'weekly', priority: 0.7 },
    ...SUBJECT_PILLARS.map(p => ({
      url: `${BASE}/${p.slug}`,
      lastModified: latestOf(`app/${p.slug}/page.tsx`, 'components/SubjectPillarPage.tsx', 'data/subject-pillars.ts', 'lib/subject-pillars.ts'),
      changeFrequency: 'weekly' as const, priority: 0.8,
    })),
    ...COST_PILLARS.map(p => ({
      url: `${BASE}/${p.slug}`,
      lastModified: latestOf(`app/${p.slug}/page.tsx`, 'components/CostPillarPage.tsx', 'data/cost-pillars.ts', 'lib/cost-pillars.ts'),
      changeFrequency: 'weekly' as const, priority: 0.8,
    })),
  ];

  // ── University overview pages ────────────────────────────────────────────────
  const verifiedSlugs = new Set(englishReqsVerified.map(r => r.universitySlug));
  const universityPages = universities.map(u => ({
    url: `${BASE}/universities/${u.slug}`,
    lastModified: latestOf(
      'data/universities.ts',
      'app/universities/[slug]/page.tsx',
      ...(verifiedSlugs.has(u.slug) ? ['data/english-requirements-verified.ts', 'components/VerifiedEnglishRequirements.tsx'] : []),
    ),
    changeFrequency: 'weekly' as const, priority: 0.9,
  }));

  // ── Country pages ────────────────────────────────────────────────────────────
  const countryPages = countries.map(c => ({
    url: `${BASE}/universities/country/${c.toLowerCase().replace(/ /g, '-')}`,
    lastModified: latestOf('data/universities.ts', 'app/universities/country/[country]/page.tsx'),
    changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  // ── General course + category pages ─────────────────────────────────────────
  const coursePages = courses.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: latestOf('data/courses.ts', 'app/courses/[slug]/page.tsx'),
    changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  const categoryPages = courseCategories.map(cat => ({
    url: `${BASE}/courses/category/${encodeURIComponent(
      cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
    )}`,
    lastModified: latestOf('data/courses.ts', 'app/courses/category/[category]/page.tsx'),
    changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  // ── Canada city pages ────────────────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = CANADA_CITY_SLUGS.map(city => ({
    url: `${BASE}/universities/city/${city}`,
    lastModified: latestOf('data/canada-cities.ts', 'app/universities/city/[city]/page.tsx'),
    changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  // ── University course index + detail pages (fully dynamic) ───────────────────
  const appUniversitiesDir = path.join(process.cwd(), 'app', 'universities');
  const courseIndexPages: MetadataRoute.Sitemap = [];
  const courseDetailPages: MetadataRoute.Sitemap = [];

  const uniDirs = fs.readdirSync(appUniversitiesDir, { withFileTypes: true }).filter(d =>
    d.isDirectory() &&
    !d.name.startsWith('[') &&
    d.name !== 'country' &&
    d.name !== 'city' &&
    fs.existsSync(path.join(appUniversitiesDir, d.name, 'courses'))
  );

  for (const d of uniDirs) {
    const uniSlug = d.name;
    const coursesPagePath = path.join(appUniversitiesDir, uniSlug, 'courses', 'page.tsx');
    const courseDetailPagePath = path.join(appUniversitiesDir, uniSlug, 'courses', '[slug]', 'page.tsx');
    const dataFilePath = findDataFile(coursesPagePath);

    // Course listing page (all universities)
    courseIndexPages.push({
      url: `${BASE}/universities/${uniSlug}/courses`,
      lastModified: latestOf(coursesPagePath, ...(dataFilePath ? [dataFilePath] : [])),
      changeFrequency: 'monthly' as const, priority: 0.6,
    });

    // Stub detection: no real data file → skip course detail pages
    if (dataFilePath && fs.existsSync(dataFilePath)) {
      const slugs = extractSlugsFromTs(dataFilePath);
      // Same underlying data + route files for every course at this university —
      // resolve once per university, not once per course.
      const detailLastmod = latestOf(dataFilePath, courseDetailPagePath, 'components/CourseRichContent.tsx');
      for (const slug of slugs) {
        courseDetailPages.push({
          url: `${BASE}/universities/${uniSlug}/courses/${slug}`,
          lastModified: detailLastmod,
          changeFrequency: 'monthly' as const, priority: 0.8,
        });
      }
    }
  }

  // ── Decision hub pages (filter/answer hubs over real course data) ────────────
  // Slug maps + thresholds mirrored from each hub's own page.tsx — keep in sync
  // if those thresholds ever change.
  const realCourses = getAllRealCourses();

  const ieltsHubPages: MetadataRoute.Sitemap = ['ielts-6-0-universities', 'ielts-6-5-universities', 'ielts-7-0-universities'].map(slug => ({
    url: `${BASE}/${slug}`,
    lastModified: latestOf(
      `app/${slug}/page.tsx`,
      'components/IeltsBandHub.tsx', 'data/ielts-band-guides.ts',
      'components/VerifiedEnglishRequirements.tsx', 'data/english-requirements-verified.ts',
    ),
    changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = {
    UK: 'uk', Australia: 'australia', Canada: 'canada', 'New Zealand': 'new-zealand',
    Netherlands: 'netherlands', Ireland: 'ireland', USA: 'usa', Germany: 'germany',
    Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland', Singapore: 'singapore',
    'United Arab Emirates': 'united-arab-emirates',
  };
  const decisionSlugLastmod = latestOf('app/[decisionSlug]/page.tsx', 'data/university-course-registry.ts');
  const cheapestHubPages: MetadataRoute.Sitemap = Object.values(CHEAPEST_COUNTRY_SLUGS).map(slug => ({
    url: `${BASE}/cheapest-universities-${slug}`,
    lastModified: decisionSlugLastmod,
    changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  const PSW_COUNTRY_SLUGS: Record<string, string> = {
    Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
    Germany: 'germany', 'New Zealand': 'new-zealand',
  };
  const pswHubLastmod = latestOf('app/courses-with-psw/[country]/page.tsx', 'data/university-course-registry.ts');
  const pswHubPages: MetadataRoute.Sitemap = Object.values(PSW_COUNTRY_SLUGS).map(slug => ({
    url: `${BASE}/courses-with-psw/${slug}`,
    lastModified: pswHubLastmod,
    changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  const BUDGET_COUNTRY_SLUGS: Record<string, string> = {
    UK: 'uk', Australia: 'australia', Canada: 'canada', Ireland: 'ireland',
    Netherlands: 'netherlands', 'New Zealand': 'new-zealand', USA: 'usa',
    Germany: 'germany', Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland',
    Singapore: 'singapore', 'United Arab Emirates': 'united-arab-emirates', Italy: 'italy',
  };
  const BUDGET_BANDS = [10, 15, 20, 25];
  const BUDGET_MIN_MATCHES = 15;
  const budgetHubPages: MetadataRoute.Sitemap = [];
  for (const [country, slug] of Object.entries(BUDGET_COUNTRY_SLUGS)) {
    for (const band of BUDGET_BANDS) {
      const n = realCourses.filter(c => c.country === country && c.annualINR > 0 && c.annualINR <= band * 100000).length;
      if (n >= BUDGET_MIN_MATCHES) {
        budgetHubPages.push({
          url: `${BASE}/${slug}-under-${band}-lakh`,
          lastModified: decisionSlugLastmod,
          changeFrequency: 'weekly' as const, priority: 0.7,
        });
      }
    }
  }

  // ── Comparison pages (real-data-only, skip-on-missing) ───────────────────
  const uniComparisonLastmod = latestOf(
    'app/compare/[slug]/page.tsx', 'components/UniversityComparisonPage.tsx',
    'data/university-comparisons.ts', 'lib/university-comparisons.ts',
  );
  const universityComparisonPages: MetadataRoute.Sitemap = UNIVERSITY_COMPARISONS
    .filter(pair => getUniversityComparisonData(pair) !== null)
    .map(pair => ({
      url: `${BASE}/compare/${pair.slug}`,
      lastModified: uniComparisonLastmod,
      changeFrequency: 'monthly' as const, priority: 0.7,
    }));

  const countrySubjectComparisonLastmod = latestOf(
    'app/[decisionSlug]/page.tsx', 'components/CountrySubjectComparisonPage.tsx',
    'data/country-subject-comparisons.ts', 'lib/country-subject-comparisons.ts',
  );
  const countrySubjectComparisonPages: MetadataRoute.Sitemap = getAllCountrySubjectComparisons().map(c => ({
    url: `${BASE}/${c.slug}`,
    lastModified: countrySubjectComparisonLastmod,
    changeFrequency: 'monthly' as const, priority: 0.7,
  }));

  return [
    ...staticPages,       // 8
    ...universityPages,   // ~135
    ...countryPages,      // ~8
    ...coursePages,       // ~20
    ...categoryPages,     // ~20
    ...cityPages,         // 28
    ...courseIndexPages,  // ~447
    ...courseDetailPages, // ~5,400+ (real-data only)
    ...ieltsHubPages,      // 3
    ...cheapestHubPages,   // 13
    ...pswHubPages,        // 6
    ...budgetHubPages,     // 45
    ...universityComparisonPages,     // ~10
    ...countrySubjectComparisonPages, // ~12
  ];
}
