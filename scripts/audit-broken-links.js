// INVESTIGATION-ONLY audit script (read-only). Does not modify any app code.
//
// Compares:
//   (A) "listing links" — every /universities/<uni>/courses/<slug> href that the
//       university profile page (app/universities/[slug]/page.tsx +
//       UniversityCoursesSection.tsx) would actually render.
//   (B) "generated pages" — every {universitySlug, courseSlug} pair that some
//       generateStaticParams() in the repo would actually build a static page for.
//
// Prints counts and the first 20 listing links with no matching generated page.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── 1. Load canonical data sources ──────────────────────────────────────────
const { universities } = require(path.join(ROOT, 'data/universities.ts'));

// data/university-course-registry.ts itself does extensionless relative imports
// (e.g. `from './uts-courses'`), which Node's native TS/ESM loader can't resolve
// when require()'d directly (Next.js's bundler handles this fine; plain node
// does not). So instead of requiring that module, we regex-parse it the same
// way it's authored — pulling {uniSlug: localImportName} out of the REGISTRY
// object literal and {localImportName: modulePath} out of the import lines —
// then require() each leaf data file directly with an explicit .ts extension,
// which does work. This reproduces exactly what getCoursesBySlug() would return.
const registrySrc = fs.readFileSync(path.join(ROOT, 'data/university-course-registry.ts'), 'utf8');

// Maps the local identifier used inside REGISTRY (the alias, if any) to the
// { modulePath, exportName } needed to actually require() the leaf data file
// and pull the right array out of it.
const localNameToInfo = {};
{
  // Handles both `import { X } from './mod'` and the aliased
  // `import { X as Y } from './mod'` form the registry now uses.
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
  let mod;
  try {
    mod = require(path.join(ROOT, 'data', info.modulePath + '.ts'));
  } catch (e) {
    console.error(`[WARN] Failed to require data/${info.modulePath}.ts for registry entry ${uniSlug}: ${e.message}`);
    return [];
  }
  const arr = mod[info.exportName];
  return Array.isArray(arr) ? arr : [];
}

// ── 2. Build "listing links" — what the university profile page would render ─
// components/UniversityCoursesSection.tsx no longer falls back to popularCourses:
// a university with no registry entry renders the empty state (zero links) instead
// of fabricated links, so listing links now come from REGISTRY only.
const listingLinks = []; // { href, uniSlug, courseSlug, source }

for (const u of universities) {
  const registryCourses = getRegistryCoursesBySlug(u.slug); // [] if not in REGISTRY
  for (const c of registryCourses) {
    listingLinks.push({
      href: `/universities/${u.slug}/courses/${c.slug}`,
      uniSlug: u.slug,
      courseSlug: c.slug,
      source: 'registry',
    });
  }
}

// ── 3. Build "generated pages" — every generateStaticParams in courses/[slug] routes ─
const generatedPages = new Set(); // "uniSlug::courseSlug"
const uniFoldersWithCourseRoute = new Set();

function findCourseSlugRouteFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const uniSlug = entry.name;
    const routeFile = path.join(dir, uniSlug, 'courses', '[slug]', 'page.tsx');
    if (fs.existsSync(routeFile)) {
      results.push({ uniSlug, routeFile });
    }
  }
  return results;
}

const universitiesDir = path.join(ROOT, 'app', 'universities');
const routeFiles = findCourseSlugRouteFiles(universitiesDir);

for (const { uniSlug, routeFile } of routeFiles) {
  uniFoldersWithCourseRoute.add(uniSlug);
  const text = fs.readFileSync(routeFile, 'utf8');

  // Grab every `import { a, b } from '@/data/xyz'` line.
  const importRe = /import\s*\{([^}]+)\}\s*from\s*['"]@\/data\/([^'"]+)['"]/g;
  const dataImports = [];
  let m;
  while ((m = importRe.exec(text))) {
    const names = m[1].split(',').map(s => s.trim()).filter(Boolean);
    dataImports.push({ names, modulePath: m[2] });
  }

  // Isolate the generateStaticParams function body.
  const gspMatch = text.match(/generateStaticParams[\s\S]*?\{([\s\S]*?)\n\}/);
  const gspBody = gspMatch ? gspMatch[1] : '';

  // Find which imported course-array identifier is referenced inside it.
  let courseArrayName = null;
  let modulePath = null;
  for (const imp of dataImports) {
    for (const name of imp.names) {
      if (gspBody.includes(name)) {
        courseArrayName = name;
        modulePath = imp.modulePath;
        break;
      }
    }
    if (courseArrayName) break;
  }

  if (!courseArrayName || !modulePath) {
    console.error(`[WARN] Could not resolve course array for ${routeFile}`);
    continue;
  }

  let mod;
  try {
    mod = require(path.join(ROOT, 'data', modulePath + '.ts'));
  } catch (e) {
    console.error(`[WARN] Failed to require data/${modulePath}.ts for ${uniSlug}: ${e.message}`);
    continue;
  }

  const arr = mod[courseArrayName];
  if (!Array.isArray(arr)) {
    console.error(`[WARN] ${courseArrayName} not found/array in data/${modulePath}.ts (uni: ${uniSlug})`);
    continue;
  }

  for (const c of arr) {
    if (!c || !c.slug) continue;
    generatedPages.add(`${uniSlug}::${c.slug}`);
  }
}

// ── 4. Diff ──────────────────────────────────────────────────────────────────
const broken = listingLinks.filter(l => !generatedPages.has(`${l.uniSlug}::${l.courseSlug}`));

console.log('=== Audit: University course listing links vs generated static pages ===');
console.log(`Universities in data/universities.ts:        ${universities.length}`);
console.log(`University folders with courses/[slug] route: ${uniFoldersWithCourseRoute.size}`);
console.log(`Total LISTING links (rendered on profile page): ${listingLinks.length}`);
console.log(`Total GENERATED pages (generateStaticParams):   ${generatedPages.size}`);
console.log(`BROKEN listing links (no generated page):       ${broken.length}`);
console.log('');

const bySource = broken.reduce((acc, l) => {
  acc[l.source] = (acc[l.source] || 0) + 1;
  return acc;
}, {});
console.log('Broken links by source:', bySource);
console.log('');

console.log('First 20 broken examples:');
for (const l of broken.slice(0, 20)) {
  console.log(`  [${l.source}] ${l.href}`);
}

// ── Extra breakdown: why each broken uni is broken (only relevant if broken.length > 0) ──
const brokenUniSlugs = [...new Set(broken.map(l => l.uniSlug))];
const noRouteAtAll = brokenUniSlugs.filter(s => !uniFoldersWithCourseRoute.has(s));
const hasRouteButMismatch = brokenUniSlugs.filter(s => uniFoldersWithCourseRoute.has(s));
console.log('');
console.log(`Broken universities: ${brokenUniSlugs.length} total`);
console.log(`  - No course route folder at all (100% of that uni's links would 404): ${noRouteAtAll.length}`);
console.log(`  - Has a real course route folder, but REGISTRY slug doesn't match a generated page (partial 404s): ${hasRouteButMismatch.length}`);
