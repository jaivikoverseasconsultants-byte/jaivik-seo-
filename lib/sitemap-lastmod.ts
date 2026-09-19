/**
 * Per-URL lastmod from real git history, shared by app/sitemap.ts and
 * app/sitemap-courses.xml/route.ts (which used to stamp `new Date()` on every URL — a
 * freshness signal search engines learn to ignore, and the thing app/sitemap.ts was written
 * to avoid).
 *
 * Skip-on-missing: if git history can't be resolved for a path (a shallow clone, say),
 * lastModified is omitted for that URL rather than falling back to build time. Cached per
 * file path so a build touching tens of thousands of URLs shells out to git only once per
 * underlying source file.
 */
import { execSync } from 'child_process';
import path from 'path';

const gitDateCache = new Map<string, Date | null>();

export function gitLastModified(absOrRelPath: string): Date | null {
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

/**
 * Most recent git lastmod among several candidate source files — used when a page's rendered
 * content is assembled from more than one file (a route + a shared component + a data file).
 * undefined (omit lastmod) only if none of the candidates resolve to a real git history entry.
 */
export function latestOf(...paths: string[]): Date | undefined {
  let latest: Date | null = null;
  for (const p of paths) {
    const d = gitLastModified(p);
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest ?? undefined;
}
