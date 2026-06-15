// Batch 4 crawl: University of Bath + University of Southampton via sitemap
// Run: node scripts/crawl-bath-soton.js
// Writes: data/bath-courses.ts  data/soton-courses.ts

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 350;
const PAGE_TIMEOUT = 12000;
const SITEMAP_TIMEOUT = 20000;
const DATA_DIR = path.join(__dirname, '..', 'data');

// ── Shared constants ─────────────────────────────────────────────────────────
const GBP_USD = 1.27;
const GBP_INR = 107;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

// ── University configs ────────────────────────────────────────────────────────
const CONFIGS = {
  bath: {
    uniName: 'University of Bath',
    slug: 'university-of-bath',
    sitemapUrl: 'https://www.bath.ac.uk/sitemap.xml',
    // Tight filter: /courses/{level}-{year}/{dept}/{course-slug}/ — exactly 4 path segments after /courses/
    courseFilter: (url) => /\/courses\/(postgraduate|undergraduate)-\d{4}\/[^/]+\/[^/]+\//i.test(url),
    // Exclude listing pages / non-course pages that slip through
    excludeFilter: (url) => /\/(apply|careers|scholarships|open-day|alumni|research|news|events|staff|entry-requirements)\b/i.test(url),
    campus: 'Claverton Down, Bath',
    country: 'United Kingdom',
    state: 'England',
    city: 'Bath',
    countryCode: 'GB',
    defaultIelts: 6.5,
    toeflMin: 92,
    pteMin: 66,
    intakeMonths: ['September'],
    livingCostGBP: 14000,
    // Fallback fees (GBP/year) for international students if extraction fails
    fees: {
      MBA: 34000, MSc: 27500, MEng: 27500, MRes: 22000, MPhil: 20000,
      MA: 20000, MPH: 24000, MPA: 24000, LLM: 23000,
      BSc: 25200, BEng: 25200, BA: 24000, BArch: 25200,
      default: 25000,
    },
    interfaceName: 'BathCourse',
    arrayName: 'bathCourses',
    helperName: 'getBathCourseBySlug',
    outFile: 'bath-courses.ts',
  },
  soton: {
    uniName: 'University of Southampton',
    slug: 'university-of-southampton',
    sitemapUrl: 'https://www.southampton.ac.uk/sitemap.xml',
    // Will be determined dynamically after URL pattern analysis
    courseFilter: null,
    excludeFilter: (url) => /\/(apply|careers|scholarships|open-day|alumni|news|events|staff|contact|about|governance|regulations|fees-funding)\b/i.test(url),
    campus: 'Highfield Campus, Southampton',
    country: 'United Kingdom',
    state: 'England',
    city: 'Southampton',
    countryCode: 'GB',
    defaultIelts: 6.5,
    toeflMin: 91,
    pteMin: 66,
    intakeMonths: ['September'],
    livingCostGBP: 13500,
    fees: {
      MBA: 32000, MSc: 27000, MEng: 26500, MRes: 22000, MPhil: 20000,
      MA: 20000, MPH: 24000, MPA: 24000, LLM: 22000,
      BSc: 23000, BEng: 23000, BA: 21000, BArch: 23000, BNurs: 22000,
      default: 24000,
    },
    interfaceName: 'SotonCourse',
    arrayName: 'sotonCourses',
    helperName: 'getSotonCourseBySlug',
    outFile: 'soton-courses.ts',
  },
};

// ── HTTP helpers ──────────────────────────────────────────────────────────────
async function get(url, timeout = PAGE_TIMEOUT) {
  try {
    const r = await axios.get(url, { headers: HEADERS, timeout, maxRedirects: 4 });
    return { ok: true, status: r.status, data: r.data };
  } catch (e) {
    return { ok: false, status: e.response?.status ?? 0, data: '', err: e.message };
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Sequential fetch with delay
async function fetchAll(urls, label) {
  const results = [];
  let ok = 0, fail = 0;
  for (let i = 0; i < urls.length; i++) {
    if (i > 0) await sleep(DELAY_MS);
    const res = await get(urls[i]);
    if (res.ok) {
      ok++;
      results.push({ url: urls[i], html: res.data });
    } else {
      fail++;
      if (fail <= 5) console.log(`  [skip] HTTP ${res.status}: ${urls[i].split('/').slice(-2).join('/')}`);
    }
    if ((i + 1) % 25 === 0) process.stdout.write(`\r  ${label}: ${i+1}/${urls.length} done (${ok} ok, ${fail} fail)...`);
  }
  process.stdout.write(`\r  ${label}: ${urls.length}/${urls.length} done (${ok} ok, ${fail} fail)\n`);
  return results;
}

// ── Sitemap fetching ──────────────────────────────────────────────────────────
function extractUrlsFromXml(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const urls = [];
  $('url loc, sitemap loc').each((_, el) => urls.push($(el).text().trim()));
  if (urls.length === 0) {
    (xml.match(/<loc>(.*?)<\/loc>/g) || []).forEach(m =>
      urls.push(m.replace(/<\/?loc>/g, '').trim()));
  }
  return [...new Set(urls)];
}

async function fetchSitemapUrls(sitemapUrl) {
  console.log(`  Fetching sitemap: ${sitemapUrl}`);
  const res = await get(sitemapUrl, SITEMAP_TIMEOUT);
  if (!res.ok) { console.log(`  ✗ HTTP ${res.status}`); return []; }

  const allUrls = extractUrlsFromXml(res.data);
  const isIndex = res.data.includes('<sitemapindex') || res.data.includes('<sitemap>');

  if (!isIndex) {
    console.log(`  ✓ Direct sitemap: ${allUrls.length} URLs`);
    return allUrls;
  }

  // Sitemap index — follow child sitemaps
  console.log(`  Sitemap index: ${allUrls.length} children — fetching all...`);
  const allPageUrls = [];
  for (const childUrl of allUrls) {
    await sleep(300);
    const childRes = await get(childUrl, SITEMAP_TIMEOUT);
    if (!childRes.ok) continue;
    const childUrls = extractUrlsFromXml(childRes.data);
    allPageUrls.push(...childUrls);
  }
  console.log(`  ✓ Total sitemap URLs: ${allPageUrls.length}`);
  return [...new Set(allPageUrls)];
}

// ── Southampton URL pattern analysis ─────────────────────────────────────────
function analyzeSotonPatterns(allUrls) {
  // Count path structures to find course page patterns
  const counts = {};
  for (const url of allUrls) {
    try {
      const p = new URL(url).pathname;
      const segs = p.split('/').filter(Boolean);
      if (segs.length < 2) continue;
      // Group by first 2 segments
      const key = segs.slice(0, 2).join('/');
      counts[key] = (counts[key] || 0) + 1;
    } catch {}
  }

  // Find .page URLs that contain course indicators
  const dotPageUrls = allUrls.filter(u => u.endsWith('.page'));
  const studyCourseUrls = allUrls.filter(u => /\/study\/.*(postgraduate|undergraduate).*course/i.test(u));
  const taughtCourseUrls = allUrls.filter(u => /\/taught[_-]course/i.test(u));
  const programUrls = allUrls.filter(u => /\/programme|\/program/i.test(u));
  const courseSlugUrls = allUrls.filter(u => /\/courses?\/[a-z0-9-]{5,}\.?page?$/i.test(u));

  console.log(`\n  Southampton URL pattern analysis:`);
  console.log(`  Total sitemap URLs : ${allUrls.length}`);
  console.log(`  *.page URLs        : ${dotPageUrls.length}`);
  console.log(`  /study/...courses  : ${studyCourseUrls.length}`);
  console.log(`  /taught_courses/   : ${taughtCourseUrls.length}`);
  console.log(`  /programme(s)/     : ${programUrls.length}`);
  console.log(`  /courses/{slug}    : ${courseSlugUrls.length}`);

  // Sample each type
  const samples = [
    { label: '.page URLs', urls: dotPageUrls.slice(0, 5) },
    { label: '/study/ courses', urls: studyCourseUrls.slice(0, 5) },
    { label: '/taught_courses/', urls: taughtCourseUrls.slice(0, 5) },
    { label: '/programme/', urls: programUrls.slice(0, 5) },
  ];
  for (const s of samples) {
    if (s.urls.length > 0) {
      console.log(`\n  ${s.label}:`);
      s.urls.forEach(u => console.log(`    ${u}`));
    }
  }

  // Top path prefixes
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log('\n  Top path prefixes (by count):');
  sorted.forEach(([k, v]) => console.log(`    /${k}/... (${v} URLs)`));

  // Determine best filter
  // Priority: specific course page patterns over generic ones
  if (taughtCourseUrls.length > 20) {
    // e.g. /{dept}/postgraduate/taught_courses/{slug}.page
    const filter = (url) => /\/taught[_-]courses?\/[^/?#]+\.page/i.test(url);
    console.log(`\n  → Using filter: /taught_courses/{slug}.page (${taughtCourseUrls.filter(filter).length} matches)`);
    return filter;
  }
  if (studyCourseUrls.length > 20) {
    const filter = (url) => /\/study\/.*(postgraduate|undergraduate).*\/courses?\/[^/?#]+/i.test(url);
    console.log(`\n  → Using filter: /study/.../courses/{slug} (${studyCourseUrls.filter(filter).length} matches)`);
    return filter;
  }
  if (programUrls.length > 20) {
    const filter = (url) => /\/programmes?\/[^/?#]{5,}/i.test(url) && !/\/(about|news|events|staff)\b/.test(url);
    console.log(`\n  → Using filter: /programme(s)/{slug} (${allUrls.filter(filter).length} matches)`);
    return filter;
  }
  if (dotPageUrls.length > 50) {
    // Use .page URLs that look like content (not admin/nav)
    const filter = (url) => url.endsWith('.page')
      && /\/(postgraduate|undergraduate|msc|bsc|beng|meng|ma|ba|llm|phd|doctorate)/i.test(url)
      && !/\/(apply|careers|contact|news|events|staff|about|governance)\b/i.test(url);
    const count = allUrls.filter(filter).length;
    console.log(`\n  → Using filter: *.page with level keywords (${count} matches)`);
    return filter;
  }

  // Fallback: broad postgraduate/undergraduate filter with depth constraint
  const filter = (url) => {
    try {
      const segs = new URL(url).pathname.split('/').filter(Boolean);
      return segs.length >= 3 && segs.length <= 5
        && /postgraduate|undergraduate|graduate/i.test(url)
        && !/\/(apply|careers|contact|news|events|staff|about|governance|research|alumni|scholarships)\b/i.test(url);
    } catch { return false; }
  };
  console.log(`\n  → Using fallback filter (depth 3-5, level keyword)`);
  return filter;
}

// ── Course data extraction from HTML ─────────────────────────────────────────
function parseDegreeFromName(name) {
  const m = name.match(/\b(MBA|MSc|MEng|MRes|MPhil|MFA|MPA|MPH|LLM|MA|BSc|BEng|BArch|BA|BNurs|BEd|BMusl|MNurs|MChem|MPhys|MMath)\b/i);
  return m ? m[0].toUpperCase() : null;
}

function parseLevelFromUrl(url) {
  if (/\bphd\b|doctorate|doctoral/i.test(url)) return { studyLevel: 'Postgraduate', level: 'PhD' };
  if (/undergraduate|ug-/i.test(url)) return { studyLevel: 'Undergraduate', level: 'Undergraduate' };
  if (/postgraduate|pg-|msc-|ma-|meng-|mres-|llm-|mba-/i.test(url)) return { studyLevel: 'Postgraduate', level: 'Masters' };
  return { studyLevel: 'Postgraduate', level: 'Masters' };
}

function extractCourseName($) {
  // Priority: h1, then og:title, then title tag
  const h1 = $('h1').first().text().replace(/\s+/g, ' ').trim();
  if (h1 && h1.length > 3 && h1.length < 120) return h1;
  const og = $('meta[property="og:title"]').attr('content') || '';
  if (og) return og.split('|')[0].split(' - ')[0].trim();
  return $('title').text().split('|')[0].split(' - ')[0].trim();
}

function extractDuration($, bodyText) {
  // Look near specific duration sections, avoid false matches
  const durationSection = bodyText.match(
    /(?:duration|length of (?:course|programme|study)|course (?:length|duration))[:\s]*([1-9]\d?\s*(?:year|month|week)s?(?:[^<\n]{0,20})?)/i
  );
  if (durationSection) {
    const raw = durationSection[1].trim().slice(0, 60);
    const yMatch = raw.match(/(\d+(?:\.\d+)?)\s*year/i);
    const mMatch = raw.match(/(\d+)\s*month/i);
    if (yMatch) {
      const y = parseFloat(yMatch[1]);
      return { str: y === 1 ? '1 year' : `${y} years`, years: y };
    }
    if (mMatch) {
      const m = parseInt(mMatch[1]);
      return { str: `${m} months`, years: Math.round(m / 12 * 10) / 10 };
    }
  }
  // Check for common patterns in the name or nearby text
  const body2k = bodyText.slice(0, 3000);
  const m1 = body2k.match(/(\d+(?:\.\d+)?)\s*year(?:s)?\s*(?:full[- ]time|part[- ]time)?/i);
  if (m1) {
    const y = parseFloat(m1[1]);
    if (y >= 1 && y <= 5) return { str: y === 1 ? '1 year' : `${y} years`, years: y };
  }
  return { str: '1 year', years: 1 };
}

function extractFeeGBP($, bodyText) {
  // Look for international fee patterns near "international" keyword
  const intlSection = bodyText.match(/internati[^\n]{0,200}/i)?.[0] || '';
  const feeInIntl = intlSection.match(/£\s*([\d,]+)/);
  if (feeInIntl) {
    const val = parseInt(feeInIntl[1].replace(/,/g, ''));
    if (val >= 10000 && val <= 80000) return val;
  }

  // Structured fee table extraction
  const feePatterns = [
    /£\s*([\d,]+)\s*(?:per\s*year|per\s*annum|p\.?a\.?|annually)/gi,
    /tuition[^£\n]{0,50}£\s*([\d,]+)/gi,
    /fees?[^£\n]{0,50}£\s*([\d,]+)/gi,
  ];
  for (const p of feePatterns) {
    const matches = [...bodyText.matchAll(p)].map(m => parseInt(m[1].replace(/,/g, ''))).filter(v => v >= 10000 && v <= 80000);
    if (matches.length > 0) return Math.max(...matches); // take highest (likely international fee)
  }
  return null;
}

function extractIelts($, bodyText) {
  // Look for IELTS scores near "IELTS" keyword
  const m = bodyText.match(/IELTS[^<\n]{0,80}(\d\.\d)/i) || bodyText.match(/(\d\.\d)[^<\n]{0,40}IELTS/i);
  if (m) {
    const val = parseFloat(m[1]);
    if (val >= 5.0 && val <= 9.0) return val;
  }
  // Also check for overall IELTS requirement like "Overall: 6.5"
  const m2 = bodyText.match(/overall[:\s]+(\d\.\d)/i);
  if (m2) {
    const val = parseFloat(m2[1]);
    if (val >= 5.0 && val <= 9.0) return val;
  }
  return null;
}

function extractIntakes($, bodyText) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const found = [];
  const startSection = bodyText.match(/(?:start|intake|entry|commencement)[^<\n]{0,200}/gi) || [];
  for (const section of startSection) {
    for (const m of months) {
      if (section.includes(m) && !found.includes(m)) found.push(m);
    }
  }
  return found.length > 0 ? found : ['September'];
}

function makeSlug(prefix, name) {
  return (prefix + '-' + name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  ).slice(0, 80);
}

function buildCourseEntry(cfg, url, html, idx) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text().replace(/\s+/g, ' ');

  const name = extractCourseName($);
  if (!name || name.length < 3) return null;

  const degree = parseDegreeFromName(name);
  const { studyLevel, level: levelFallback } = parseLevelFromUrl(url);
  const level = degree || levelFallback;
  const studyLevelFinal = (level === 'BSc' || level === 'BEng' || level === 'BA' || level === 'BArch' || level === 'BNurs')
    ? 'Undergraduate' : studyLevel;

  const duration = extractDuration($, bodyText);
  const extractedFeeGBP = extractFeeGBP($, bodyText);
  const feeKey = degree && cfg.fees[degree] ? degree : 'default';
  const annualGBP = extractedFeeGBP || cfg.fees[feeKey] || cfg.fees.default;
  const annualUSD = Math.round(annualGBP * GBP_USD);
  const annualINR = Math.round(annualGBP * GBP_INR);
  const totalGBP = Math.round(annualGBP * duration.years);
  const livingCostGBP = cfg.livingCostGBP;
  const livingCostUSD = Math.round(livingCostGBP * GBP_USD);
  const livingCostINR = Math.round(livingCostGBP * GBP_INR);

  const extractedIelts = extractIelts($, bodyText);
  const ieltsMin = extractedIelts || cfg.defaultIelts;
  const intakeMonths = extractIntakes($, bodyText);

  const slugPrefix = cfg.slug.split('-').filter(s => !['university', 'of'].includes(s)).join('-');
  const slug = makeSlug(slugPrefix, name);

  return {
    id: `${slugPrefix}-${idx + 1}`,
    name,
    slug,
    url,
    level,
    studyLevel: studyLevelFinal,
    duration: duration.str,
    durationYears: duration.years,
    annualGBP,
    annualUSD,
    annualINR,
    totalGBP,
    livingCostGBP,
    livingCostUSD,
    livingCostINR,
    ieltsMin,
    toeflMin: cfg.toeflMin,
    pteMin: cfg.pteMin,
    intakeMonths,
    campus: cfg.campus,
    country: cfg.country,
    state: cfg.state,
    city: cfg.city,
    countryCode: cfg.countryCode,
  };
}

// ── TypeScript file generation ────────────────────────────────────────────────
function generateTs(cfg, courses) {
  const lines = [
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
  ];
  return lines.join('\n');
}

// ── De-duplicate by name ──────────────────────────────────────────────────────
function dedup(courses) {
  const seen = new Set();
  const out = [];
  const slugSeen = new Set();
  for (const c of courses) {
    const key = c.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    // Ensure unique slugs
    let slug = c.slug;
    let n = 2;
    while (slugSeen.has(slug)) slug = `${c.slug}-${n++}`;
    slugSeen.add(slug);
    out.push({ ...c, slug });
  }
  return out;
}

// ── Process one university ────────────────────────────────────────────────────
async function processUniversity(cfgKey) {
  const cfg = CONFIGS[cfgKey];
  console.log('\n' + '═'.repeat(70));
  console.log(`UNIVERSITY: ${cfg.uniName}`);
  console.log('═'.repeat(70));

  // Step 1: Fetch sitemap URLs
  const allSitemapUrls = await fetchSitemapUrls(cfg.sitemapUrl);
  if (allSitemapUrls.length === 0) { console.log('✗ No sitemap URLs'); return null; }

  // Step 2: Determine course filter
  let courseFilter = cfg.courseFilter;
  if (!courseFilter) {
    // Dynamic analysis for Southampton
    courseFilter = analyzeSotonPatterns(allSitemapUrls);
    cfg.courseFilter = courseFilter;
  }

  // Step 3: Filter to course URLs
  const courseUrls = allSitemapUrls
    .filter(courseFilter)
    .filter(url => !cfg.excludeFilter(url));

  console.log(`\n  Course URLs after filtering: ${courseUrls.length}`);
  console.log(`  Sample (first 8):`);
  courseUrls.slice(0, 8).forEach(u => console.log(`    ${u}`));

  if (courseUrls.length === 0) {
    console.log('  ✗ No course URLs matched — check filter patterns');
    return null;
  }
  if (courseUrls.length > 800) {
    console.log(`  ⚠ Capping at 800 to avoid timeout (${courseUrls.length} found)`);
  }
  const urlsToFetch = courseUrls.slice(0, 800);

  // Step 4: Crawl all course pages
  console.log(`\n  Crawling ${urlsToFetch.length} course pages...`);
  const fetched = await fetchAll(urlsToFetch, cfg.uniName);

  // Step 5: Extract course data
  console.log(`  Extracting course data from ${fetched.length} pages...`);
  const raw = [];
  for (let i = 0; i < fetched.length; i++) {
    const { url, html } = fetched[i];
    const entry = buildCourseEntry(cfg, url, html, i);
    if (entry && entry.name.length > 3) raw.push(entry);
  }

  // Step 6: De-duplicate
  const courses = dedup(raw);
  console.log(`  Extracted: ${raw.length} entries → ${courses.length} unique courses`);

  if (courses.length === 0) { console.log('  ✗ No courses extracted'); return null; }

  // Step 7: Print summary
  console.log(`\n  Sample extractions (first 5):`);
  courses.slice(0, 5).forEach((c, i) => {
    console.log(`  [${i+1}] ${c.name}`);
    console.log(`       Level: ${c.studyLevel} | Duration: ${c.duration} | Fee: £${c.annualGBP.toLocaleString()} | IELTS: ${c.ieltsMin}`);
    console.log(`       URL: ${c.url.split('/').slice(-3).join('/')}`);
  });

  // Step 8: Write TypeScript file
  const ts = generateTs(cfg, courses);
  const outPath = path.join(DATA_DIR, cfg.outFile);
  fs.writeFileSync(outPath, ts, 'utf8');
  console.log(`\n  ✓ Written: data/${cfg.outFile} (${courses.length} courses, ${Buffer.byteLength(ts).toLocaleString()} bytes)`);

  return { name: cfg.uniName, count: courses.length, outFile: cfg.outFile, samples: courses.slice(0, 3) };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log('Batch 4 — Sitemap Crawl: Bath + Southampton');
  console.log(`Started: ${new Date().toISOString()}\n`);

  const results = [];

  for (const key of ['bath', 'soton']) {
    const r = await processUniversity(key);
    if (r) results.push(r);
    await sleep(3000); // pause between universities
  }

  const elapsed = Math.round((Date.now() - t0) / 1000);
  console.log('\n\n' + '═'.repeat(70));
  console.log(`FINAL SUMMARY  (${elapsed}s elapsed)`);
  console.log('═'.repeat(70));
  results.forEach(r => {
    console.log(`\n✅ ${r.name}: ${r.count} courses → data/${r.outFile}`);
    r.samples.forEach((s, i) => console.log(`   [${i+1}] ${s.name} | ${s.studyLevel} | £${s.annualGBP.toLocaleString()}/yr | IELTS ${s.ieltsMin}`));
  });

  if (results.length === 2) {
    console.log('\n✓ Both files ready — next: npx tsc --noEmit && npm run build');
  } else {
    console.log('\n⚠ One or more universities failed — check output above');
  }
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
