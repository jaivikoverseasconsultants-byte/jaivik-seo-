import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { universities, countries } from '@/data/universities';
import { courses, courseCategories } from '@/data/courses';
import { CANADA_CITY_SLUGS } from '@/data/canada-cities';
import { getAllRealCourses } from '@/data/university-course-registry';
import { SUBJECT_PILLARS } from '@/data/subject-pillars';
import { COST_PILLARS } from '@/data/cost-pillars';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/universities`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/courses`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/course-finder`,    lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/book-counselling`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/compare`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/ielts-mock-test`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/nursing-abroad`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/terms`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy-policy`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    ...SUBJECT_PILLARS.map(p => ({
      url: `${BASE}/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8,
    })),
    ...COST_PILLARS.map(p => ({
      url: `${BASE}/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8,
    })),
  ];

  // ── University overview pages ────────────────────────────────────────────────
  const universityPages = universities.map(u => ({
    url: `${BASE}/universities/${u.slug}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9,
  }));

  // ── Country pages ────────────────────────────────────────────────────────────
  const countryPages = countries.map(c => ({
    url: `${BASE}/universities/country/${c.toLowerCase().replace(/ /g, '-')}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  // ── General course + category pages ─────────────────────────────────────────
  const coursePages = courses.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  const categoryPages = courseCategories.map(cat => ({
    url: `${BASE}/courses/category/${encodeURIComponent(
      cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
    )}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
  }));

  // ── Canada city pages ────────────────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = CANADA_CITY_SLUGS.map(city => ({
    url: `${BASE}/universities/city/${city}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
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

    // Course listing page (all universities)
    courseIndexPages.push({
      url: `${BASE}/universities/${uniSlug}/courses`,
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6,
    });

    // Stub detection: no real data file → skip course detail pages
    const coursesPagePath = path.join(appUniversitiesDir, uniSlug, 'courses', 'page.tsx');
    const dataFilePath = findDataFile(coursesPagePath);

    if (dataFilePath && fs.existsSync(dataFilePath)) {
      const slugs = extractSlugsFromTs(dataFilePath);
      for (const slug of slugs) {
        courseDetailPages.push({
          url: `${BASE}/universities/${uniSlug}/courses/${slug}`,
          lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
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
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  const CHEAPEST_COUNTRY_SLUGS: Record<string, string> = {
    UK: 'uk', Australia: 'australia', Canada: 'canada', 'New Zealand': 'new-zealand',
    Netherlands: 'netherlands', Ireland: 'ireland', USA: 'usa', Germany: 'germany',
    Denmark: 'denmark', Sweden: 'sweden', Finland: 'finland', Singapore: 'singapore',
    'United Arab Emirates': 'united-arab-emirates',
  };
  const cheapestHubPages: MetadataRoute.Sitemap = Object.values(CHEAPEST_COUNTRY_SLUGS).map(slug => ({
    url: `${BASE}/cheapest-universities-${slug}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  const PSW_COUNTRY_SLUGS: Record<string, string> = {
    Canada: 'canada', Australia: 'australia', UK: 'uk', Ireland: 'ireland',
    Germany: 'germany', 'New Zealand': 'new-zealand',
  };
  const pswHubPages: MetadataRoute.Sitemap = Object.values(PSW_COUNTRY_SLUGS).map(slug => ({
    url: `${BASE}/courses-with-psw/${slug}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
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
          lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
        });
      }
    }
  }

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
  ];
}
