// Fix script — Bath (URL-slug extraction, no re-crawl) + Southampton (correct filter)
// Run: node scripts/fix-bath-soton.js

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 400;
const PAGE_TIMEOUT = 12000;
const SITEMAP_TIMEOUT = 20000;
const DATA_DIR = path.join(__dirname, '..', 'data');
const GBP_USD = 1.27;
const GBP_INR = 107;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

async function get(url, timeout = PAGE_TIMEOUT) {
  try {
    const r = await axios.get(url, { headers: HEADERS, timeout, maxRedirects: 4 });
    return { ok: true, status: r.status, data: r.data };
  } catch (e) {
    return { ok: false, status: e.response?.status ?? 0, data: '' };
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Sitemap fetch ─────────────────────────────────────────────────────────────
function extractUrlsFromXml(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const urls = [];
  $('url loc, sitemap loc').each((_, el) => urls.push($(el).text().trim()));
  if (!urls.length) {
    (xml.match(/<loc>(.*?)<\/loc>/g) || []).forEach(m =>
      urls.push(m.replace(/<\/?loc>/g, '').trim()));
  }
  return [...new Set(urls)];
}

async function getSitemapUrls(sitemapUrl) {
  console.log(`  Fetching: ${sitemapUrl}`);
  const res = await get(sitemapUrl, SITEMAP_TIMEOUT);
  if (!res.ok) { console.log(`  ✗ HTTP ${res.status}`); return []; }
  const urls = extractUrlsFromXml(res.data);
  const isIndex = res.data.includes('<sitemapindex') || res.data.includes('<sitemap>');
  if (!isIndex) { console.log(`  ✓ ${urls.length} URLs`); return urls; }

  const all = [];
  for (const child of urls) {
    await sleep(300);
    const r = await get(child, SITEMAP_TIMEOUT);
    if (r.ok) all.push(...extractUrlsFromXml(r.data));
  }
  const deduped = [...new Set(all)];
  console.log(`  ✓ ${deduped.length} URLs (from index)`);
  return deduped;
}

// ── TS generator ──────────────────────────────────────────────────────────────
function generateTs(cfg, courses) {
  return [
    `// Auto-generated — do not edit manually`,
    `// Source: Sitemap crawl of ${cfg.sitemapUrl}`,
    `// Generated: ${new Date().toISOString()}`,
    `// ${courses.length} courses`,
    ``,
    `export interface ${cfg.interfaceName} {`,
    `  id: string; name: string; slug: string; url: string;`,
    `  level: string; studyLevel: string; duration: string; durationYears: number;`,
    `  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;`,
    `  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;`,
    `  ieltsMin: number; toeflMin: number; pteMin: number;`,
    `  intakeMonths: string[]; campus: string;`,
    `  country: string; state: string; city: string; countryCode: string;`,
    `}`,
    ``,
    `export const ${cfg.arrayName}: ${cfg.interfaceName}[] = [`,
    ...courses.map(c => `  ${JSON.stringify(c)},`),
    `];`,
    ``,
    `export function ${cfg.helperName}(slug: string): ${cfg.interfaceName} | undefined {`,
    `  return ${cfg.arrayName}.find(c => c.slug === slug);`,
    `}`,
  ].join('\n');
}

// ══════════════════════════════════════════════════════════════════════════════
// BATH — URL slug extraction (zero HTTP requests for course pages)
// ══════════════════════════════════════════════════════════════════════════════

const BATH_CFG = {
  sitemapUrl: 'https://www.bath.ac.uk/sitemap.xml',
  interfaceName: 'BathCourse',
  arrayName: 'bathCourses',
  helperName: 'getBathCourseBySlug',
  outFile: 'bath-courses.ts',
  campus: 'Claverton Down, Bath',
  country: 'United Kingdom', state: 'England', city: 'Bath', countryCode: 'GB',
  ieltsMin: 6.5, toeflMin: 92, pteMin: 66,
  intakeMonths: ['September'],
  livingCostGBP: 14000,
  fees: {
    MBA: 34000, MSc: 27500, MEng: 27500, MRes: 22000, MPhil: 20000,
    MA: 20000, MPH: 24000, MPA: 24000, LLM: 23000,
    BSc: 25200, BEng: 25200, BA: 24000, BArch: 25200,
    // Integrated masters
    MMath: 25200, MChem: 25200, MPhys: 25200, MBiol: 25200,
    default: 25000,
  },
  // UG fees differ from PG
  ugFees: {
    BSc: 25200, BEng: 25200, BA: 24000, BArch: 25200, default: 25000,
  },
};

// Degree abbreviations we recognise in URL slugs (longest first to avoid prefix collision)
const DEGREE_TOKENS = [
  'mbiomed', 'mbiochem', 'mbiol', 'mchem', 'mphys', 'mmath', 'mcomp',
  'meng', 'mres', 'mphil', 'mpa', 'mph', 'msc', 'mba', 'llm', 'mfa', 'mmus',
  'beng', 'barch', 'bnurs', 'bsc', 'ba',
  'phd', 'dphil',
  'pgcert', 'pgdip',
];

function titleCase(str) {
  const LOWER = new Set(['of', 'and', 'in', 'for', 'the', 'with', 'by', 'at', 'to', 'a', 'an', 'or']);
  return str.split(' ').map((w, i) => {
    if (i === 0) return w.charAt(0).toUpperCase() + w.slice(1);
    if (LOWER.has(w.toLowerCase())) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function parseBathUrl(url) {
  // /courses/{level}-{year}/{dept}/{course-slug}/
  const m = url.match(/\/courses\/(postgraduate|undergraduate)-(\d{4})\/([^/]+)\/([^/]+)\/?$/i);
  if (!m) return null;
  const [, levelType, , , rawSlug] = m;

  // Find degree token at start of slug
  let degreeToken = null;
  let restSlug = rawSlug;
  for (const dt of DEGREE_TOKENS) {
    if (rawSlug.startsWith(dt + '-') || rawSlug === dt) {
      degreeToken = dt;
      restSlug = rawSlug.slice(dt.length).replace(/^-/, '');
      break;
    }
  }

  // Build human-readable name
  const degreeLabel = degreeToken
    ? degreeToken
        .replace('mbiomed', 'MBiomed').replace('mbiochem', 'MBiochem')
        .replace('mbiol', 'MBiol').replace('mchem', 'MChem').replace('mphys', 'MPhys')
        .replace('mmath', 'MMath').replace('mcomp', 'MComp')
        .replace('meng', 'MEng').replace('mres', 'MRes').replace('mphil', 'MPhil')
        .replace('mpa', 'MPA').replace('mph', 'MPH').replace('msc', 'MSc')
        .replace('mba', 'MBA').replace('llm', 'LLM').replace('mfa', 'MFA').replace('mmus', 'MMus')
        .replace('beng', 'BEng').replace('barch', 'BArch').replace('bnurs', 'BNurs')
        .replace('bsc', 'BSc').replace('ba', 'BA')
        .replace('phd', 'PhD').replace('dphil', 'DPhil')
        .replace('pgcert', 'PGCert').replace('pgdip', 'PGDip')
    : null;

  const coursePart = restSlug.replace(/-/g, ' ');
  const name = degreeLabel
    ? `${degreeLabel} ${titleCase(coursePart)}`
    : titleCase(rawSlug.replace(/-/g, ' '));

  // Study level from URL path
  const studyLevel = levelType === 'undergraduate' ? 'Undergraduate' : 'Postgraduate';

  // Degree level
  const dl = degreeToken?.toLowerCase() ?? '';
  const UG_MAP = { bsc: 'BSc', beng: 'BEng', ba: 'BA', barch: 'BArch', bnurs: 'BNurs' };
  const level = dl === 'mba' ? 'MBA'
    : UG_MAP[dl] ? UG_MAP[dl]
    : ['phd', 'dphil'].includes(dl) ? 'PhD'
    : degreeLabel ?? 'Masters';

  // Duration: UG is 3 years (4 with placement), PG is 1 year (check for part-time)
  let durationYears = studyLevel === 'Undergraduate' ? 3 : 1;
  if (/integrated/.test(rawSlug)) durationYears = 4;
  if (/part-time|distance-learning/.test(rawSlug)) durationYears = 2;
  if (/with-professional-placement/.test(rawSlug)) durationYears = studyLevel === 'Undergraduate' ? 4 : 2;
  if (/meng/.test(dl)) durationYears = 4; // integrated masters at Bath
  const duration = durationYears === 1 ? '1 year' : `${durationYears} years`;

  // Fee
  const feeKey = degreeLabel && BATH_CFG.fees[degreeLabel] ? degreeLabel : 'default';
  const annualGBP = studyLevel === 'Undergraduate'
    ? (BATH_CFG.ugFees[degreeLabel] ?? BATH_CFG.ugFees.default)
    : (BATH_CFG.fees[feeKey] ?? BATH_CFG.fees.default);

  return { name, level, studyLevel, duration, durationYears, annualGBP, rawSlug, url };
}

function makeSlug(prefix, name) {
  return (prefix + '-' + name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  ).slice(0, 80);
}

async function processBath() {
  console.log('\n' + '═'.repeat(70));
  console.log('BATH — URL-slug extraction (no re-crawl)');
  console.log('═'.repeat(70));

  const allUrls = await getSitemapUrls(BATH_CFG.sitemapUrl);

  // Apply tight filter
  const courseUrls = allUrls.filter(url =>
    /\/courses\/(postgraduate|undergraduate)-\d{4}\/[^/]+\/[^/]+\//i.test(url)
    && !/\/(apply|careers|scholarships|alumni|news|events|staff|entry-requirements)\b/i.test(url)
  );
  console.log(`  Tight-filtered course URLs: ${courseUrls.length}`);

  // Parse from URL slugs — no crawling!
  const raw = courseUrls.map((url, idx) => {
    const parsed = parseBathUrl(url);
    if (!parsed) return null;
    const { name, level, studyLevel, duration, durationYears, annualGBP } = parsed;
    if (name.length < 4) return null;

    const annualUSD = Math.round(annualGBP * GBP_USD);
    const annualINR = Math.round(annualGBP * GBP_INR);
    const totalGBP = Math.round(annualGBP * durationYears);
    const lcGBP = BATH_CFG.livingCostGBP;

    return {
      id: `bath-${idx + 1}`,
      name,
      slug: makeSlug('bath', name),
      url,
      level,
      studyLevel,
      duration,
      durationYears,
      annualGBP,
      annualUSD,
      annualINR,
      totalGBP,
      livingCostGBP: lcGBP,
      livingCostUSD: Math.round(lcGBP * GBP_USD),
      livingCostINR: Math.round(lcGBP * GBP_INR),
      ieltsMin: BATH_CFG.ieltsMin,
      toeflMin: BATH_CFG.toeflMin,
      pteMin: BATH_CFG.pteMin,
      intakeMonths: BATH_CFG.intakeMonths,
      campus: BATH_CFG.campus,
      country: BATH_CFG.country,
      state: BATH_CFG.state,
      city: BATH_CFG.city,
      countryCode: BATH_CFG.countryCode,
    };
  }).filter(Boolean);

  // De-dupe by name
  const seen = new Set();
  const slugSeen = new Set();
  const courses = [];
  for (const c of raw) {
    const key = c.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    let slug = c.slug;
    let n = 2;
    while (slugSeen.has(slug)) slug = `${c.slug}-${n++}`;
    slugSeen.add(slug);
    courses.push({ ...c, slug });
  }

  console.log(`  Parsed: ${raw.length} entries → ${courses.length} unique courses`);
  console.log('\n  Sample (first 8):');
  courses.slice(0, 8).forEach((c, i) =>
    console.log(`  [${i+1}] ${c.name} | ${c.studyLevel} | £${c.annualGBP.toLocaleString()} | ${c.duration}`));

  const ts = generateTs(BATH_CFG, courses);
  fs.writeFileSync(path.join(DATA_DIR, BATH_CFG.outFile), ts, 'utf8');
  console.log(`\n  ✓ Written: data/${BATH_CFG.outFile} (${courses.length} courses)`);
  return courses;
}

// ══════════════════════════════════════════════════════════════════════════════
// SOUTHAMPTON — Correct filter: /courses/{slug} programme pages
// ══════════════════════════════════════════════════════════════════════════════

const SOTON_CFG = {
  sitemapUrl: 'https://www.southampton.ac.uk/sitemap.xml',
  interfaceName: 'SotonCourse',
  arrayName: 'sotonCourses',
  helperName: 'getSotonCourseBySlug',
  outFile: 'soton-courses.ts',
  campus: 'Highfield Campus, Southampton',
  country: 'United Kingdom', state: 'England', city: 'Southampton', countryCode: 'GB',
  ieltsMin: 6.5, toeflMin: 91, pteMin: 66,
  intakeMonths: ['September'],
  livingCostGBP: 13500,
  fees: {
    MBA: 32000, MSc: 27000, MEng: 26500, MRes: 22000, MPhil: 20000,
    MA: 20000, MPH: 24000, MPA: 24000, LLM: 22000,
    BSc: 23000, BEng: 23000, BA: 21000, BArch: 23000,
    MEd: 21000, MNurs: 22000,
    default: 24000,
  },
};

function extractSotonCourse($, url) {
  // Try title tag first — Southampton's h1 can be a section heading too
  const title = $('title').text().trim();
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const h1 = $('h1').first().text().replace(/\s+/g, ' ').trim();

  // Pick best name
  let name = '';
  for (const candidate of [h1, ogTitle.split('|')[0].trim(), title.split('|')[0].trim()]) {
    if (candidate.length > 5 && candidate.length < 120
      && !/university of southampton|home|error|404/i.test(candidate)) {
      name = candidate;
      break;
    }
  }
  if (!name) return null;

  const bodyText = $('body').text().replace(/\s+/g, ' ');

  // Level from URL or name
  const dl = name.match(/\b(MBA|MSc|MEng|MRes|MPhil|MA|MPH|MPA|LLM|BSc|BEng|BA|BArch|MNurs|MEd)\b/i)?.[1]?.toUpperCase();
  const isUG = /undergraduate|bsc|beng|ba\b|barch/i.test(url + name);
  const studyLevel = isUG ? 'Undergraduate' : 'Postgraduate';
  const level = dl ?? (isUG ? 'Undergraduate' : 'Masters');

  // Duration
  const durMatch = bodyText.match(/(?:duration|length)[:\s]+(\d+(?:\.\d+)?)\s*(year|month)/i)
    || bodyText.match(/(\d+(?:\.\d+)?)\s*year[s]?\s*(?:full[- ]time)?/i);
  let durationYears = 1;
  if (durMatch) {
    const val = parseFloat(durMatch[1]);
    if (/month/i.test(durMatch[2] ?? '')) durationYears = Math.round(val / 12 * 10) / 10;
    else if (val >= 1 && val <= 5) durationYears = val;
  }
  const duration = durationYears === 1 ? '1 year' : `${durationYears} years`;

  // Fee
  const feeM = bodyText.match(/£\s*([\d,]+)\s*(?:per\s*year|p\.?a\.?)/i);
  const feeVal = feeM ? parseInt(feeM[1].replace(/,/g, '')) : null;
  const feeKey = dl && SOTON_CFG.fees[dl] ? dl : 'default';
  const annualGBP = (feeVal && feeVal >= 10000 && feeVal <= 60000) ? feeVal : SOTON_CFG.fees[feeKey];

  // IELTS
  const ieltsM = bodyText.match(/IELTS[^0-9]{0,30}(\d\.\d)/i);
  const ieltsMin = ieltsM ? parseFloat(ieltsM[1]) : SOTON_CFG.ieltsMin;

  // Intakes
  const monthsFound = [];
  for (const m of ['January', 'February', 'September', 'October']) {
    if (bodyText.includes(m)) monthsFound.push(m);
  }

  return { name, level, studyLevel, duration, durationYears, annualGBP, ieltsMin, intakeMonths: monthsFound.length ? monthsFound : ['September'] };
}

async function processSoton() {
  console.log('\n' + '═'.repeat(70));
  console.log('SOUTHAMPTON — Correct programme filter');
  console.log('═'.repeat(70));

  const allUrls = await getSitemapUrls(SOTON_CFG.sitemapUrl);

  // ── Strategy: try multiple filters in priority order ──
  // 1. /courses/{programme-slug}  — modern URL structure (no year, no .page)
  // 2. /{dept}/postgraduate/{level}-{slug}.page — older Drupal structure
  // 3. /study/postgraduate-taught/courses/{slug}

  const filter1 = allUrls.filter(u => {
    try {
      const p = new URL(u).pathname;
      const segs = p.split('/').filter(Boolean);
      // /courses/{one-slug-only} — no sub-paths, no year
      return segs.length === 2
        && segs[0] === 'courses'
        && segs[1].length >= 5
        && !segs[1].includes('.')  // exclude .page files
        && !/^\d{4}-\d{2}$/.test(segs[1]); // exclude year segments
    } catch { return false; }
  });

  // Broader: /courses/{year-range}/{module} pages — Southampton module catalog
  const filter2 = allUrls.filter(u =>
    /\/courses\/\d{4}-\d{2}\/[^/]+\/[^/]+$/i.test(u)
    && !/\/(research|staff|news|events|about)\b/i.test(u)
  );

  // Older dept structure: /{dept}/postgraduate/{slug}.page  (depth 3, ends .page)
  const filter3 = allUrls.filter(u => {
    try {
      const p = new URL(u).pathname;
      const segs = p.split('/').filter(Boolean);
      return segs.length === 3
        && /postgraduate|graduate/i.test(segs[1])
        && segs[2].endsWith('.page')
        && /msc|ma|mba|meng|llm|phd|bsc|beng|ba/i.test(segs[2])
        && !/apply|careers|contact|news|events/i.test(segs[2]);
    } catch { return false; }
  });

  console.log(`\n  Filter 1 (/courses/{slug}):     ${filter1.length} URLs`);
  console.log(`  Filter 2 (/courses/{year}/{mod}): ${filter2.length} URLs`);
  console.log(`  Filter 3 (dept/pg/{slug}.page):  ${filter3.length} URLs`);
  console.log('\n  Filter 1 samples:'); filter1.slice(0,5).forEach(u => console.log(`    ${u}`));
  console.log('  Filter 2 samples:'); filter2.slice(0,5).forEach(u => console.log(`    ${u}`));
  console.log('  Filter 3 samples:'); filter3.slice(0,5).forEach(u => console.log(`    ${u}`));

  // Pick the filter with most results (but cap at 400 to avoid timeout)
  let chosen = filter1;
  let filterLabel = 'filter 1';
  if (filter2.length > chosen.length) { chosen = filter2; filterLabel = 'filter 2 (module catalog)'; }
  if (filter3.length > chosen.length) { chosen = filter3; filterLabel = 'filter 3 (dept .page)'; }
  if (chosen.length === 0) {
    // Last resort: any URL with a degree keyword in last segment
    chosen = allUrls.filter(u => /\/(msc|ma|mba|meng|llm|bsc|beng)-[a-z]+/i.test(u)).slice(0, 400);
    filterLabel = 'last resort (degree keyword in slug)';
  }

  const urlsToFetch = chosen.slice(0, 400);
  console.log(`\n  Using ${filterLabel}: ${urlsToFetch.length} URLs to crawl`);

  // Crawl
  const fetched = [];
  let ok = 0, fail = 0;
  for (let i = 0; i < urlsToFetch.length; i++) {
    if (i > 0) await sleep(DELAY_MS);
    const res = await get(urlsToFetch[i], PAGE_TIMEOUT);
    if (res.ok) { fetched.push({ url: urlsToFetch[i], html: res.data }); ok++; }
    else fail++;
    if ((i + 1) % 25 === 0) process.stdout.write(`\r  Southampton: ${i+1}/${urlsToFetch.length} (${ok} ok, ${fail} fail)...`);
  }
  process.stdout.write(`\r  Southampton: ${urlsToFetch.length}/${urlsToFetch.length} (${ok} ok, ${fail} fail)\n`);

  // Extract
  const raw = [];
  for (let i = 0; i < fetched.length; i++) {
    const { url, html } = fetched[i];
    const $ = cheerio.load(html);
    const entry = extractSotonCourse($, url);
    if (!entry || entry.name.length < 5) continue;
    const lcGBP = SOTON_CFG.livingCostGBP;
    const annualGBP = entry.annualGBP;
    raw.push({
      id: `soton-${i+1}`,
      name: entry.name,
      slug: makeSlug('soton', entry.name),
      url,
      level: entry.level,
      studyLevel: entry.studyLevel,
      duration: entry.duration,
      durationYears: entry.durationYears,
      annualGBP,
      annualUSD: Math.round(annualGBP * GBP_USD),
      annualINR: Math.round(annualGBP * GBP_INR),
      totalGBP: Math.round(annualGBP * entry.durationYears),
      livingCostGBP: lcGBP,
      livingCostUSD: Math.round(lcGBP * GBP_USD),
      livingCostINR: Math.round(lcGBP * GBP_INR),
      ieltsMin: entry.ieltsMin,
      toeflMin: SOTON_CFG.toeflMin,
      pteMin: SOTON_CFG.pteMin,
      intakeMonths: entry.intakeMonths,
      campus: SOTON_CFG.campus,
      country: SOTON_CFG.country,
      state: SOTON_CFG.state,
      city: SOTON_CFG.city,
      countryCode: SOTON_CFG.countryCode,
    });
  }

  // De-dupe
  const seen = new Set();
  const slugSeen = new Set();
  const courses = [];
  for (const c of raw) {
    const key = c.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    let slug = c.slug;
    let n = 2;
    while (slugSeen.has(slug)) slug = `${c.slug}-${n++}`;
    slugSeen.add(slug);
    courses.push({ ...c, slug });
  }

  console.log(`  Extracted: ${raw.length} → ${courses.length} unique courses`);
  console.log('\n  Sample (first 5):');
  courses.slice(0, 5).forEach((c, i) =>
    console.log(`  [${i+1}] ${c.name} | ${c.studyLevel} | £${c.annualGBP.toLocaleString()} | IELTS ${c.ieltsMin}`));

  if (courses.length < 10) {
    console.log('\n  ⚠ Very few courses — Southampton URL structure may need manual inspection');
    console.log('  Printing all 5 filter URLs for diagnosis:');
    [filter1, filter2, filter3].forEach((f, i) =>
      console.log(`  Filter ${i+1} (${f.length}): ${f.slice(0,3).join(', ')}`));
  }

  const ts = generateTs(SOTON_CFG, courses);
  fs.writeFileSync(path.join(DATA_DIR, SOTON_CFG.outFile), ts, 'utf8');
  console.log(`\n  ✓ Written: data/${SOTON_CFG.outFile} (${courses.length} courses)`);
  return courses;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log('Fix script — Bath (URL slugs) + Southampton (correct filter)');
  console.log(`Started: ${new Date().toISOString()}`);

  const bathCourses = await processBath();
  await sleep(2000);
  const sotonCourses = await processSoton();

  const elapsed = Math.round((Date.now() - t0) / 1000);
  console.log('\n\n' + '═'.repeat(70));
  console.log(`SUMMARY  (${elapsed}s)`);
  console.log('═'.repeat(70));
  console.log(`Bath       : ${bathCourses?.length ?? 0} courses → data/bath-courses.ts`);
  console.log(`Southampton: ${sotonCourses?.length ?? 0} courses → data/soton-courses.ts`);

  if (bathCourses?.length > 100 && sotonCourses?.length > 20) {
    console.log('\n✓ Ready for: npx tsc --noEmit && npm run build');
  } else {
    console.log('\n⚠ Check course counts above before proceeding');
  }
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
