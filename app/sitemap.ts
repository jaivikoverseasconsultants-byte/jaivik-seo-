import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { universities, countries } from '@/data/universities';
import { courses, courseCategories } from '@/data/courses';
import { CANADA_CITY_SLUGS } from '@/data/canada-cities';

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
    { url: `${BASE}/universities`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/courses`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/course-finder`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/book-counselling`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/compare`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/ielts-mock-test`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  // ── University overview pages ────────────────────────────────────────────────
  const universityPages = universities.map(u => ({
    url: `${BASE}/universities/${u.slug}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
  }));

  // ── Country pages ────────────────────────────────────────────────────────────
  const countryPages = countries.map(c => ({
    url: `${BASE}/universities/country/${c.toLowerCase().replace(/ /g, '-')}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
  }));

  // ── General course + category pages ─────────────────────────────────────────
  const coursePages = courses.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
  }));

  const categoryPages = courseCategories.map(cat => ({
    url: `${BASE}/courses/category/${encodeURIComponent(
      cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
    )}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
  }));

  // ── Canada city pages ────────────────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = CANADA_CITY_SLUGS.map(city => ({
    url: `${BASE}/universities/city/${city}`,
    lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8,
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

    // Course listing page
    courseIndexPages.push({
      url: `${BASE}/universities/${uniSlug}/courses`,
      lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8,
    });

    // Find the data file via the import in courses/page.tsx
    const coursesPagePath = path.join(appUniversitiesDir, uniSlug, 'courses', 'page.tsx');
    const dataFilePath = findDataFile(coursesPagePath);

    if (dataFilePath && fs.existsSync(dataFilePath)) {
      const slugs = extractSlugsFromTs(dataFilePath);
      for (const slug of slugs) {
        courseDetailPages.push({
          url: `${BASE}/universities/${uniSlug}/courses/${slug}`,
          lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
        });
      }
    }
  }

  return [
    ...staticPages,       // 7
    ...universityPages,   // ~135
    ...countryPages,      // ~8
    ...coursePages,       // ~20
    ...categoryPages,     // ~20
    ...cityPages,         // 28
    ...courseIndexPages,  // 107
    ...courseDetailPages, // ~3,700–4,000+
  ];
}
