/**
 * The single source of truth for which course URLs belong in a sitemap.
 *
 * Why this module exists (2026-09-19, after a Search Console audit): both sitemaps used to
 * derive course URLs by reading a data file off disk and regexing every `slug:` string out of
 * it — `app/sitemap.ts` and `app/sitemap-courses.xml/route.ts` each had their own copy of that
 * logic, so they could drift from each other and from the pages Next.js actually builds. Two
 * faults came out of it:
 *
 *   * The data file was found by taking the FIRST `@/data/…-courses` import on the index page.
 *     University of Waterloo serves two files (graduate + undergraduate), so 107 real
 *     `waterlooug-*` course pages were missing from both sitemaps.
 *   * A regex over the file text picks up any `slug:` it finds, including nested ones
 *     (`alternatives: [{ slug }]`), which is how URLs that were never routes got listed.
 *
 * The pages come from `getAllRealCourses()` (the course registry) via each route's
 * `generateStaticParams`, so the sitemap now comes from exactly the same place. Two rules keep
 * it honest, both of which a sitemap should enforce anyway:
 *
 *   1. A university is included only if its `courses/[slug]/page.tsx` route exists — the
 *      registry can contain a university before its route is generated (KPU, Sept 2026), and
 *      listing those URLs would put 247 guaranteed 404s in the sitemap.
 *   2. A URL a redirect rule sends somewhere else is never listed. `vercel.json` carries
 *      per-university catch-alls (`/universities/<uni>/courses/:path*`) for universities with
 *      no course data; when one of those universities later gains real pages, the stale rule
 *      turns its sitemap entries into redirects. Imperial College London's 8 pages sat in that
 *      state, reported by Search Console as duplicates without a clear canonical.
 */
import fs from 'fs';
import path from 'path';
import { getAllRealCourses } from '@/data/university-course-registry';

export interface CourseSitemapUniversity {
  uniSlug: string;
  /** course slugs, in registry order, deduped */
  slugs: string[];
  /** data files behind this university's courses — for a git-derived lastmod */
  dataFiles: string[];
  hasIndexRoute: boolean;
}

const UNI_DIR = () => path.join(process.cwd(), 'app', 'universities');
const indexRoute = (uniSlug: string) => path.join(UNI_DIR(), uniSlug, 'courses', 'page.tsx');
const detailRoute = (uniSlug: string) => path.join(UNI_DIR(), uniSlug, 'courses', '[slug]', 'page.tsx');

/**
 * Data files each registry university's courses come from, read out of the registry's own
 * import list so a university served by several files (Waterloo) reports all of them. Used
 * only for lastmod — never to decide which URLs exist.
 */
let dataFileCache: Record<string, string[]> | null = null;
function dataFilesByUniversity(): Record<string, string[]> {
  if (dataFileCache) return dataFileCache;
  const out: Record<string, string[]> = {};
  try {
    const src = fs.readFileSync(path.join(process.cwd(), 'data', 'university-course-registry.ts'), 'utf-8');
    const fileOf = new Map<string, string>();
    const importRe = /import \{\s*\w+ as (m_\w+)\s*\} from '\.\/([\w-]+)';/g;
    let im: RegExpExecArray | null;
    while ((im = importRe.exec(src)) !== null) {
      fileOf.set(im[1], path.join('data', `${im[2]}.ts`));
    }
    const entryRe = /^\s*'([a-z0-9-]+)':\s*([^,\n]+),/gm;
    let en: RegExpExecArray | null;
    while ((en = entryRe.exec(src)) !== null) {
      const refs = en[2].match(/m_\w+/g) ?? [];
      const files: string[] = [];
      for (const ref of refs) {
        const file = fileOf.get(ref);
        if (file && files.indexOf(file) === -1) files.push(file);
      }
      if (files.length) out[en[1]] = files;
    }
  } catch {
    /* lastmod is optional — never let it decide URLs */
  }
  dataFileCache = out;
  return out;
}

/** True when vercel.json redirects this path somewhere else. */
let redirectMatchers: { exact: Set<string>; prefixes: string[] } | null = null;
export function isRedirected(pathname: string): boolean {
  if (!redirectMatchers) {
    const exact = new Set<string>();
    const prefixes: string[] = [];
    try {
      const vercel = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf-8')) as {
        redirects?: { source: string }[];
      };
      for (const r of vercel.redirects ?? []) {
        if (r.source.endsWith('/:path*')) prefixes.push(r.source.slice(0, -'/:path*'.length));
        else if (!r.source.includes(':')) exact.add(r.source);
      }
    } catch {
      /* no vercel.json in this context — fall through with nothing to match */
    }
    redirectMatchers = { exact, prefixes };
  }
  if (redirectMatchers.exact.has(pathname)) return true;
  return redirectMatchers.prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Registry universities whose course pages exist and are reachable, with their course slugs. */
export function courseSitemapUniversities(): CourseSitemapUniversity[] {
  const dataFiles = dataFilesByUniversity();
  const byUni = new Map<string, string[]>();
  for (const c of getAllRealCourses()) {
    if (!c.universitySlug || !c.slug) continue;
    const list = byUni.get(c.universitySlug) ?? [];
    list.push(c.slug);
    byUni.set(c.universitySlug, list);
  }

  const out: CourseSitemapUniversity[] = [];
  for (const [uniSlug, slugs] of Array.from(byUni.entries())) {
    if (!fs.existsSync(detailRoute(uniSlug))) continue; // rule 1: no route, no URL
    const reachable = Array.from(new Set(slugs)).filter(
      (slug) => !isRedirected(`/universities/${uniSlug}/courses/${slug}`), // rule 2
    );
    if (!reachable.length) continue;
    out.push({
      uniSlug,
      slugs: reachable,
      dataFiles: dataFiles[uniSlug] ?? [],
      hasIndexRoute: fs.existsSync(indexRoute(uniSlug)) && !isRedirected(`/universities/${uniSlug}/courses`),
    });
  }
  return out.sort((a, b) => a.uniSlug.localeCompare(b.uniSlug));
}
