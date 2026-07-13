// Build-time generator for public/search-index.json — replaces the old
// /api/search route, which cannot work under output:'export' (a route
// handler with dynamic searchParams gets frozen to one static response at
// build time). Runs as `prebuild` so the JSON is always fresh from the same
// source data the site itself renders from.
//
// Shape (kept lean — universities and courses are separate arrays so a
// course row only stores a `universitySlug` foreign key, not a repeated
// university name/country string per course; the ~20k-row course array also
// uses short keys since "name"/"universitySlug"/"courseSlug" repeated 20k
// times is real bytes even before gzip):
//   { universities: [{ name, slug, country, type: 'university' }],
//     courses: [{ n: name, u: universitySlug, c: courseSlug }] }
//
// Course list is built directly from data/university-course-registry.ts's
// REGISTRY — REAL crawled data only, never the popularCourses marketing-string
// fallback, since those don't resolve to a real course detail page (see
// components/UniversityCoursesSection.tsx's own comment on why it never
// fabricates course links either).

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const { universities } = require(path.join(ROOT, 'data/universities.ts'));

// data/university-course-registry.ts uses extensionless relative imports
// (e.g. `from './aru-courses'`), which Next.js's bundler resolves fine but
// plain node's require() cannot. Regex-parse the registry file the same way
// scripts/audit-broken-links.js does, then require() each leaf data file
// directly with an explicit .ts extension.
const registrySrc = fs.readFileSync(path.join(ROOT, 'data/university-course-registry.ts'), 'utf8');

const localNameToInfo = {};
{
  const importRe = /import\s*\{\s*([A-Za-z0-9_$]+)(?:\s+as\s+([A-Za-z0-9_$]+))?\s*\}\s*from\s*['"]\.\/([^'"]+)['"]/g;
  let im;
  while ((im = importRe.exec(registrySrc))) {
    const exportName = im[1];
    const localName = im[2] || im[1];
    localNameToInfo[localName] = { modulePath: im[3], exportName };
  }
}

const uniSlugToImportName = {};
{
  const registryBlockMatch = registrySrc.match(/const REGISTRY[^=]*=\s*\{([\s\S]*?)\n\};/);
  const block = registryBlockMatch ? registryBlockMatch[1] : '';
  const entryRe = /'([^']+)'\s*:\s*([A-Za-z0-9_$]+)\s*,/g;
  let em;
  while ((em = entryRe.exec(block))) {
    uniSlugToImportName[em[1]] = em[2];
  }
}

function getRegistryCoursesBySlug(uniSlug) {
  const localName = uniSlugToImportName[uniSlug];
  if (!localName) return [];
  const info = localNameToInfo[localName];
  if (!info) return [];
  const mod = require(path.join(ROOT, 'data', info.modulePath + '.ts'));
  const arr = mod[info.exportName];
  return Array.isArray(arr) ? arr : [];
}

// ── Build the index ──────────────────────────────────────────────────────────

const universityIndex = universities.map(u => ({
  name: u.name,
  slug: u.slug,
  country: u.country,
  type: 'university',
}));

const courseIndex = [];
for (const uniSlug of Object.keys(uniSlugToImportName)) {
  for (const c of getRegistryCoursesBySlug(uniSlug)) {
    if (!c.name || !c.slug) continue;
    courseIndex.push({ n: c.name, u: uniSlug, c: c.slug });
  }
}

const index = { universities: universityIndex, courses: courseIndex };

const outPath = path.join(ROOT, 'public', 'search-index.json');
fs.writeFileSync(outPath, JSON.stringify(index));

const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(
  `[generate-search-index] wrote ${outPath}\n` +
  `  ${universityIndex.length} universities, ${courseIndex.length} courses, ${sizeKB} KB`
);
