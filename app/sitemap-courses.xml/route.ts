import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BASE = 'https://study.jaivikoverseasconsultants.com';

export const dynamic = 'force-static';

function extractSlugsFromTs(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const results: string[] = [];
    const re = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) results.push(m[1]);
    return results;
  } catch {
    return [];
  }
}

function findDataFile(coursesPagePath: string): string | null {
  try {
    const content = fs.readFileSync(coursesPagePath, 'utf-8');
    const m = content.match(/from\s+['"]@\/data\/([\w-]+-courses)['"]/);
    if (m) return path.join(process.cwd(), 'data', `${m[1]}.ts`);
  } catch {}
  return null;
}

export async function GET() {
  const appUniversitiesDir = path.join(process.cwd(), 'app', 'universities');
  const urls: string[] = [];

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
    const dataFilePath = findDataFile(coursesPagePath);
    if (dataFilePath && fs.existsSync(dataFilePath)) {
      const slugs = extractSlugsFromTs(dataFilePath);
      for (const slug of slugs) {
        urls.push(`${BASE}/universities/${uniSlug}/courses/${slug}`);
      }
    }
  }

  const lastmod = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
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
