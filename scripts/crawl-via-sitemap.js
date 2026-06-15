// Sitemap-first university course crawler — feasibility test
// Run: node scripts/crawl-via-sitemap.js
// Uses axios + cheerio only (no puppeteer). Sitemaps bypass WAF/Cloudflare.

const axios = require('axios');
const cheerio = require('cheerio');

// ── Config ─────────────────────────────────────────────────────────────────
const DELAY_MS = 800;          // polite delay between HTTP requests
const SAMPLE_PAGES = 10;       // course pages to crawl per uni for extraction test
const SITEMAP_TIMEOUT = 15000;
const PAGE_TIMEOUT = 12000;

const UNIVERSITIES = [
  {
    name: 'Durham University',
    slug: 'durham-university',
    country: 'United Kingdom',
    sitemapCandidates: [
      'https://www.durham.ac.uk/sitemap.xml',
      'https://www.durham.ac.uk/sitemap_index.xml',
      'https://www.durham.ac.uk/sitemaps/sitemap.xml',
    ],
    coursePatterns: [/\/study\//, /\/courses?\//, /\/programmes?\//, /postgraduate/, /undergraduate/],
    excludePatterns: [/\.(pdf|jpg|png|gif|css|js)$/i, /\/news\//, /\/events\//, /\/staff\//, /\/research\//, /\/about\//],
  },
  {
    name: 'University of Bath',
    slug: 'university-of-bath',
    country: 'United Kingdom',
    sitemapCandidates: [
      'https://www.bath.ac.uk/sitemap.xml',
      'https://www.bath.ac.uk/sitemap_index.xml',
    ],
    coursePatterns: [/\/courses?\//, /\/programmes?\//, /\/study\//, /postgraduate/, /undergraduate/, /msc-/, /bsc-/, /meng-/, /ba-/, /ma-/],
    excludePatterns: [/\.(pdf|jpg|png|gif|css|js)$/i, /\/news\//, /\/events\//, /\/staff\//, /\/research\//],
  },
  {
    name: 'University of Southampton',
    slug: 'university-of-southampton',
    country: 'United Kingdom',
    sitemapCandidates: [
      'https://www.southampton.ac.uk/sitemap.xml',
      'https://www.southampton.ac.uk/sitemap_index.xml',
      'https://www.southampton.ac.uk/sitemaps/sitemap.xml',
    ],
    coursePatterns: [/\/courses?\//, /\/programmes?\//, /postgraduate/, /undergraduate/, /\/study\//],
    excludePatterns: [/\.(pdf|jpg|png|gif|css|js)$/i, /\/news\//, /\/events\//, /\/research\//, /\/staff\//],
  },
  {
    name: 'University of Ottawa',
    slug: 'university-of-ottawa',
    country: 'Canada',
    sitemapCandidates: [
      'https://www.uottawa.ca/sitemap.xml',
      'https://www.uottawa.ca/sitemap_index.xml',
      'https://www.uottawa.ca/en/sitemap.xml',
    ],
    coursePatterns: [/\/programs?\//, /\/courses?\//, /\/graduate\//, /\/undergraduate\//, /\/faculty\/.*\/programs?/],
    excludePatterns: [/\.(pdf|jpg|png|gif|css|js)$/i, /\/news\//, /\/events\//, /\/research\//],
  },
  {
    name: 'Dalhousie University',
    slug: 'dalhousie-university',
    country: 'Canada',
    sitemapCandidates: [
      'https://www.dal.ca/sitemap.xml',
      'https://www.dal.ca/sitemap_index.xml',
    ],
    coursePatterns: [/\/programs?\//, /\/courses?\//, /\/graduate\//, /\/undergraduate\//, /academics/],
    excludePatterns: [/\.(pdf|jpg|png|gif|css|js)$/i, /\/news\//, /\/events\//, /\/research\//, /\/faculty\/[a-z-]+\/(about|contact|news)/],
  },
];

// ── HTTP helpers ────────────────────────────────────────────────────────────
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-GB,en;q=0.9',
};

async function get(url, timeout = SITEMAP_TIMEOUT) {
  try {
    const r = await axios.get(url, { headers: HEADERS, timeout, maxRedirects: 5 });
    return { ok: true, status: r.status, data: r.data, contentType: r.headers['content-type'] ?? '' };
  } catch (e) {
    return { ok: false, status: e.response?.status ?? 0, data: '', contentType: '', err: e.message };
  }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Sitemap parsing ─────────────────────────────────────────────────────────
function extractUrlsFromXml(xmlText) {
  // Use cheerio XML mode to parse sitemap XML
  const $ = cheerio.load(xmlText, { xmlMode: true });
  const urls = [];

  // Standard sitemap: <url><loc>...</loc></url>
  $('url loc').each((_, el) => urls.push($(el).text().trim()));
  // Sitemap index: <sitemap><loc>...</loc></sitemap>
  $('sitemap loc').each((_, el) => urls.push($(el).text().trim()));

  // Fallback: regex extraction if cheerio misses (rare malformed sitemaps)
  if (urls.length === 0) {
    const matches = xmlText.match(/<loc>(.*?)<\/loc>/g) ?? [];
    matches.forEach(m => urls.push(m.replace(/<\/?loc>/g, '').trim()));
  }

  return [...new Set(urls)];
}

function isSitemapIndex(xmlText) {
  return xmlText.includes('<sitemapindex') || xmlText.includes('<sitemap>');
}

function filterCourseUrls(urls, coursePatterns, excludePatterns) {
  return urls.filter(url => {
    if (excludePatterns.some(p => p.test(url))) return false;
    return coursePatterns.some(p => p.test(url));
  });
}

// ── Sitemap discovery ───────────────────────────────────────────────────────
async function fetchSitemap(uni) {
  for (const candidate of uni.sitemapCandidates) {
    process.stdout.write(`  Trying sitemap: ${candidate} ... `);
    const res = await get(candidate);
    if (!res.ok) { console.log(`HTTP ${res.status}`); await sleep(300); continue; }
    console.log(`OK (${res.data.length.toLocaleString()} chars)`);
    return { url: candidate, data: res.data };
  }

  // Try robots.txt for Sitemap: directive
  const baseUrl = new URL(uni.sitemapCandidates[0]).origin;
  process.stdout.write(`  Trying robots.txt: ${baseUrl}/robots.txt ... `);
  const robotsRes = await get(`${baseUrl}/robots.txt`, 8000);
  if (robotsRes.ok) {
    const m = robotsRes.data.match(/^Sitemap:\s*(.+)$/im);
    if (m) {
      const sitemapUrl = m[1].trim();
      console.log(`found Sitemap directive: ${sitemapUrl}`);
      const sitemapRes = await get(sitemapUrl);
      if (sitemapRes.ok) return { url: sitemapUrl, data: sitemapRes.data };
    } else {
      console.log('no Sitemap directive in robots.txt');
    }
  } else {
    console.log('robots.txt not found');
  }

  return null;
}

// If sitemap index, follow child sitemaps that contain course-related keywords
async function resolveAllCourseUrls(sitemapData, sitemapUrl, uni) {
  const allUrls = extractUrlsFromXml(sitemapData);

  if (!isSitemapIndex(sitemapData)) {
    // Direct sitemap — filter and return
    return { courseUrls: filterCourseUrls(allUrls, uni.coursePatterns, uni.excludePatterns), sitemapType: 'direct', childSitemaps: [] };
  }

  // It's a sitemap index — find child sitemaps worth following
  console.log(`  → Sitemap index detected. Found ${allUrls.length} child sitemaps.`);
  const courseChildKeywords = ['course', 'programme', 'program', 'study', 'academic', 'undergraduate', 'postgraduate', 'graduate', 'degree'];
  const prioritySitemaps = allUrls.filter(u => courseChildKeywords.some(k => u.toLowerCase().includes(k)));
  const fallbackSitemaps = allUrls.filter(u => !prioritySitemaps.includes(u)).slice(0, 3); // also check first 3 generic ones
  const toCheck = [...prioritySitemaps, ...fallbackSitemaps].slice(0, 8); // cap at 8 child sitemaps

  console.log(`  → Checking ${toCheck.length} child sitemaps (${prioritySitemaps.length} course-priority + ${Math.min(fallbackSitemaps.length,3)} generic)`);

  const allCourseUrls = [];
  for (const childUrl of toCheck) {
    process.stdout.write(`    ↳ ${childUrl.split('/').slice(-2).join('/')} ... `);
    const res = await get(childUrl);
    if (!res.ok) { console.log(`HTTP ${res.status}`); await sleep(300); continue; }
    const childUrls = extractUrlsFromXml(res.data);
    const filtered = filterCourseUrls(childUrls, uni.coursePatterns, uni.excludePatterns);
    console.log(`${childUrls.length} URLs → ${filtered.length} course matches`);
    allCourseUrls.push(...filtered);
    await sleep(400);
  }

  return { courseUrls: [...new Set(allCourseUrls)], sitemapType: 'index', childSitemaps: toCheck };
}

// ── Course page extraction ──────────────────────────────────────────────────
function extractCourseData(html, url) {
  const $ = cheerio.load(html);

  // ── Title / Course name ──────────────────────────────────────────────────
  const h1 = $('h1').first().text().trim();
  const titleTag = $('title').text().trim().split('|')[0].trim().split('-')[0].trim();
  const courseName = h1 || titleTag || '';

  // ── Study level ──────────────────────────────────────────────────────────
  const pageText = $('body').text().toLowerCase();
  let level = 'Unknown';
  if (/\bphd\b|doctorate|doctoral/.test(pageText)) level = 'PhD';
  else if (/\bmaster|msc\b|meng\b|mres\b|mphil\b|pgcert|pgdip|postgraduate/.test(pageText)) level = 'Postgraduate';
  else if (/\bbachelor|bsc\b|beng\b|ba\b|undergraduate/.test(pageText)) level = 'Undergraduate';

  // ── Duration ─────────────────────────────────────────────────────────────
  let duration = '';
  const durationPatterns = [
    /(\d+(?:\.\d+)?)\s*years?/i,
    /(\d+)\s*months?/i,
    /duration[:\s]+([^\n<]{5,40})/i,
    /(full[- ]time|part[- ]time)[^<]{0,30}(\d+\s*years?|\d+\s*months?)/i,
  ];
  for (const p of durationPatterns) {
    const m = $('body').text().match(p);
    if (m) { duration = m[0].replace(/\s+/g, ' ').trim().slice(0, 60); break; }
  }

  // ── Fees ─────────────────────────────────────────────────────────────────
  let fee = '';
  const feePatterns = [
    /£[\d,]+(?:\s*per\s*year)?/i,
    /\$[\d,]+(?:CAD|USD)?(?:\s*per\s*year)?/i,
    /tuition[^<\n]{0,60}(?:£|\$)[\d,]+/i,
    /(?:£|\$)[\d,]+[^<\n]{0,30}(?:per year|annually|tuition)/i,
  ];
  for (const p of feePatterns) {
    const m = $('body').text().match(p);
    if (m) { fee = m[0].replace(/\s+/g, ' ').trim().slice(0, 80); break; }
  }

  // ── IELTS ────────────────────────────────────────────────────────────────
  let ielts = '';
  const ieltsM = $('body').text().match(/IELTS[^<\n]{0,60}(\d\.\d|\d{1})/i);
  if (ieltsM) ielts = ieltsM[0].replace(/\s+/g, ' ').trim().slice(0, 80);

  // ── Intake ───────────────────────────────────────────────────────────────
  let intake = '';
  const intakeM = $('body').text().match(/(start|intake|entry)[^<\n]{0,30}(january|february|march|april|may|june|july|august|september|october|november|december)/i);
  if (intakeM) intake = intakeM[0].replace(/\s+/g, ' ').trim().slice(0, 80);

  // ── Has data? ────────────────────────────────────────────────────────────
  const hasContent = courseName.length > 3 && $('body').text().length > 500;

  return { courseName, level, duration, fee, ielts, intake, hasContent, bodyLen: $('body').text().length };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function testUniversity(uni) {
  console.log('\n' + '═'.repeat(72));
  console.log(`UNIVERSITY: ${uni.name} (${uni.country})`);
  console.log('═'.repeat(72));

  // Step 1: Find sitemap
  const sitemap = await fetchSitemap(uni);
  if (!sitemap) {
    console.log('\n  ✗ No sitemap found via any candidate URL or robots.txt');
    return { uni: uni.name, sitemapFound: false };
  }
  console.log(`\n  ✓ Sitemap found: ${sitemap.url}`);

  // Step 2: Resolve all course URLs (handles index sitemaps)
  await sleep(DELAY_MS);
  const { courseUrls, sitemapType, childSitemaps } = await resolveAllCourseUrls(sitemap.data, sitemap.url, uni);

  console.log(`\n  Sitemap type    : ${sitemapType}`);
  console.log(`  Total course URLs: ${courseUrls.length}`);

  if (courseUrls.length === 0) {
    console.log('  ✗ No course URLs matched filtering patterns');
    // Show a sample of what URLs ARE in the sitemap to help debug
    const allRaw = extractUrlsFromXml(sitemap.data);
    console.log(`  (Sitemap had ${allRaw.length} total URLs. Sample of 10:)`);
    allRaw.slice(0, 10).forEach(u => console.log(`    ${u}`));
    return { uni: uni.name, sitemapFound: true, courseUrlCount: 0, sitemapUrl: sitemap.url };
  }

  // Show sample of course URLs found
  console.log('\n  Sample course URLs (first 10):');
  courseUrls.slice(0, 10).forEach(u => console.log(`    ${u}`));
  if (courseUrls.length > 10) console.log(`    ... and ${courseUrls.length - 10} more`);

  // Step 3: Crawl first SAMPLE_PAGES course URLs
  const toSample = courseUrls.slice(0, SAMPLE_PAGES);
  console.log(`\n  Sampling ${toSample.length} course pages for data extraction...`);

  const extractions = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toSample.length; i++) {
    const url = toSample[i];
    process.stdout.write(`  [${i + 1}/${toSample.length}] ${url.split('/').slice(-3).join('/')} ... `);
    await sleep(DELAY_MS);
    const res = await get(url, PAGE_TIMEOUT);
    if (!res.ok) {
      console.log(`HTTP ${res.status} ✗`);
      failCount++;
      extractions.push({ url, ok: false, status: res.status });
      continue;
    }
    const data = extractCourseData(res.data, url);
    if (data.hasContent) {
      successCount++;
      console.log(`✓ "${data.courseName.slice(0, 60)}" | ${data.level}`);
    } else {
      failCount++;
      console.log(`⚠ low content (${data.bodyLen} chars)`);
    }
    extractions.push({ url, ok: true, ...data });
  }

  // Step 4: Print extraction results
  const successful = extractions.filter(e => e.ok && e.hasContent);
  console.log(`\n  ── Extraction Results ──────────────────────────────────────────`);
  console.log(`  Success: ${successCount}/${toSample.length} | Fail/block: ${failCount}/${toSample.length}`);

  if (successful.length > 0) {
    console.log('\n  Detailed extractions (first 3 successful):');
    successful.slice(0, 3).forEach((e, i) => {
      console.log(`\n  [${i + 1}] ${e.url}`);
      console.log(`      Name    : ${e.courseName || '—'}`);
      console.log(`      Level   : ${e.level}`);
      console.log(`      Duration: ${e.duration || '—'}`);
      console.log(`      Fee     : ${e.fee || '—'}`);
      console.log(`      IELTS   : ${e.ielts || '—'}`);
      console.log(`      Intake  : ${e.intake || '—'}`);
    });
  }

  return {
    uni: uni.name,
    sitemapFound: true,
    sitemapUrl: sitemap.url,
    sitemapType,
    courseUrlCount: courseUrls.length,
    successCount,
    failCount,
    sampleSize: toSample.length,
  };
}

async function main() {
  console.log('Sitemap-First University Course Crawl — Feasibility Test');
  console.log(`Testing ${UNIVERSITIES.length} universities\n`);

  const results = [];
  for (const uni of UNIVERSITIES) {
    const r = await testUniversity(uni);
    results.push(r);
    await sleep(2000);
  }

  // ── Summary table ──────────────────────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(72));
  console.log('SUMMARY TABLE');
  console.log('═'.repeat(72));
  console.log(
    'University'.padEnd(32) +
    'Sitemap?'.padEnd(10) +
    'Type'.padEnd(10) +
    'Course URLs'.padEnd(14) +
    'Extract OK'
  );
  console.log('─'.repeat(72));
  results.forEach(r => {
    console.log(
      r.uni.slice(0, 31).padEnd(32) +
      (r.sitemapFound ? 'YES' : 'NO').padEnd(10) +
      (r.sitemapType ?? '—').padEnd(10) +
      (r.courseUrlCount != null ? String(r.courseUrlCount) : '—').padEnd(14) +
      (r.successCount != null ? `${r.successCount}/${r.sampleSize}` : '—')
    );
  });

  console.log('\nFeasibility verdict:');
  results.forEach(r => {
    if (!r.sitemapFound) console.log(`  ✗ ${r.uni}: No sitemap`);
    else if (r.courseUrlCount === 0) console.log(`  ⚠ ${r.uni}: Sitemap found but no course URL patterns matched`);
    else if (r.successCount >= 7) console.log(`  ✅ ${r.uni}: READY — ${r.courseUrlCount} course URLs, ${r.successCount}/${r.sampleSize} pages extractable`);
    else if (r.successCount >= 4) console.log(`  🟡 ${r.uni}: PARTIAL — ${r.courseUrlCount} URLs, low extraction rate — needs selector tuning`);
    else console.log(`  ✗ ${r.uni}: Blocked or extraction failed`);
  });
}

main().catch(console.error);
