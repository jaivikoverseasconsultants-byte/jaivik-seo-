import { NextResponse } from 'next/server';
import { courseSitemapUniversities } from '@/lib/sitemap-courses';
import { latestOf } from '@/lib/sitemap-lastmod';

const BASE = 'https://study.jaivikoverseasconsultants.com';

export const dynamic = 'force-static';

/**
 * Course-only sitemap, submitted to Search Console alongside /sitemap.xml.
 *
 * URLs come from lib/sitemap-courses — the course registry, the same source each route's
 * generateStaticParams uses — so this file and app/sitemap.ts always list the same set. It
 * previously walked app/universities itself and regexed slugs out of one data file per
 * university, which missed Waterloo's 107 undergraduate pages and could list slugs that were
 * never routes. lastmod is git-derived per university rather than the build date.
 */
export async function GET() {
  const entries: { url: string; lastmod?: string }[] = [];

  for (const uni of courseSitemapUniversities()) {
    const lastmod = latestOf(
      `app/universities/${uni.uniSlug}/courses/[slug]/page.tsx`,
      ...uni.dataFiles,
      'components/CourseRichContent.tsx',
    );
    for (const slug of uni.slugs) {
      entries.push({
        url: `${BASE}/universities/${uni.uniSlug}/courses/${slug}`,
        lastmod: lastmod?.toISOString().split('T')[0],
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(({ url, lastmod }) => `  <url>
    <loc>${url}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
