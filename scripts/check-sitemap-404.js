// Checks for sitemap URLs that point to non-existent course pages.
// Mimics sitemap.ts logic: reads courses/page.tsx → finds data file → extracts slugs.
// Cross-checks with courses/[slug]/page.tsx → finds its own data file → extracts slugs.
// Reports URLs in sitemap that the detail page would never generate (→ 404).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP_UNI = path.join(ROOT, 'app', 'universities');
const DATA_DIR = path.join(ROOT, 'data');
const BASE = 'https://study.jaivikoverseasconsultants.com';

/** Extract all slug values from a TS file using regex. */
function extractSlugs(filePath) {
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const slugs = new Set();
    const re = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(src)) !== null) slugs.add(m[1]);
    return [...slugs];
  } catch { return []; }
}

/** Find a data file import from a page.tsx source: looks for @/data/xxx-courses */
function findDataFileImport(pageSrc) {
  // Primary: explicit -courses import
  let m = pageSrc.match(/from\s+['"]@\/data\/([\w-]+-courses)['"]/);
  if (m) return m[1];
  // Fallback: any @/data/ import that isn't a utility
  m = pageSrc.match(/from\s+['"]@\/data\/([\w-]+)['"]/);
  if (m && !['universities','courses','canada-cities','university-course-registry'].includes(m[1])) return m[1];
  return null;
}

const uniDirs = fs.readdirSync(APP_UNI, { withFileTypes: true }).filter(d =>
  d.isDirectory() &&
  !d.name.startsWith('[') &&
  d.name !== 'country' &&
  d.name !== 'city'
);

const mismatches = [];
const summaryRows = [];

for (const d of uniDirs) {
  const uniSlug = d.name;
  const listingPage  = path.join(APP_UNI, uniSlug, 'courses', 'page.tsx');
  const detailPage   = path.join(APP_UNI, uniSlug, 'courses', '[slug]', 'page.tsx');

  if (!fs.existsSync(listingPage) || !fs.existsSync(detailPage)) continue;

  const listingSrc = fs.readFileSync(listingPage, 'utf8');
  const detailSrc  = fs.readFileSync(detailPage, 'utf8');

  const listingDataKey = findDataFileImport(listingSrc);
  const detailDataKey  = findDataFileImport(detailSrc);

  // Sitemap perspective: slugs from what courses/page.tsx imports
  const listingDataFile = listingDataKey ? path.join(DATA_DIR, `${listingDataKey}.ts`) : null;
  const sitemapSlugs = listingDataFile && fs.existsSync(listingDataFile)
    ? new Set(extractSlugs(listingDataFile))
    : new Set();

  // Detail page perspective: slugs from what [slug]/page.tsx imports
  const detailDataFile = detailDataKey ? path.join(DATA_DIR, `${detailDataKey}.ts`) : null;
  const detailSlugs = detailDataFile && fs.existsSync(detailDataFile)
    ? new Set(extractSlugs(detailDataFile))
    : new Set();

  // Find slugs the sitemap claims exist but the detail page can't serve
  const ghost = [...sitemapSlugs].filter(s => !detailSlugs.has(s));

  // Also check: does the sitemap point to a data file at all?
  if (!listingDataFile || !fs.existsSync(listingDataFile)) {
    summaryRows.push({ uniSlug, status: 'NO_LISTING_DATA', sitemapCount: 0, detailCount: 0, ghostCount: 0 });
    continue;
  }

  if (ghost.length > 0) {
    ghost.forEach(slug => {
      mismatches.push({
        url: `${BASE}/universities/${uniSlug}/courses/${slug}`,
        uniSlug,
        courseSlug: slug,
        reason: detailDataKey !== listingDataKey
          ? `listing uses ${listingDataKey}, detail uses ${detailDataKey}`
          : 'slug in listing data but missing from detail data',
      });
    });
  }

  summaryRows.push({
    uniSlug,
    listingData: listingDataKey,
    detailData: detailDataKey,
    sitemapCount: sitemapSlugs.size,
    detailCount: detailSlugs.size,
    ghostCount: ghost.length,
    sameFile: listingDataKey === detailDataKey,
  });
}

// ── Report ────────────────────────────────────────────────────────────────────
console.log('=== SITEMAP 404 CHECK ===\n');

if (mismatches.length === 0) {
  console.log('✅ No ghost URLs found — sitemap and detail pages are in sync.\n');
} else {
  console.log(`❌ Found ${mismatches.length} ghost URL(s) in sitemap:\n`);
  mismatches.forEach((m, i) => {
    console.log(`${i + 1}. ${m.url}`);
    console.log(`   Reason: ${m.reason}\n`);
  });
}

// Show universities where listing vs detail use different data files
const diffFile = summaryRows.filter(r => r.sameFile === false);
if (diffFile.length > 0) {
  console.log(`\n⚠️  ${diffFile.length} university(ies) use DIFFERENT data files for listing vs detail page:`);
  diffFile.forEach(r => console.log(`  ${r.uniSlug}: listing=${r.listingData} | detail=${r.detailData} | ghosts=${r.ghostCount}`));
}

console.log(`\nTotal universities scanned: ${summaryRows.length}`);
console.log(`Universities with ghost URLs: ${summaryRows.filter(r => r.ghostCount > 0).length}`);
console.log(`Total ghost URLs: ${mismatches.length}`);
