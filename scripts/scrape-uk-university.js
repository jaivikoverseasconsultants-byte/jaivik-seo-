/**
 * Universal scraper for UK universities.
 * Supports sitemap-based scraping (MDX, Portsmouth) and listing-page scraping
 * (Northumbria, ARU, Leeds, Birmingham).
 * Usage: node scripts/scrape-uk-university.js <uni-id>
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CONFIGS = require('./uk-universities-config');
const OUT_DIR = path.join(__dirname, '../data/scraped/uk');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ax = axios.create({
  timeout: 25000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
    'Accept-Language': 'en-GB,en;q=0.9',
  },
});

// ── Fee parsing (GBP) ───────────────────────────────────────────────────────
function parseAnnualFeeGBP(text) {
  // "£16,000 per year", "£16,000 per annum", "£16,000 (full-time)"
  const m = text.match(/£\s*([\d,]+)\s*(?:per\s*(?:year|annum|academic\s*year)|p\.?a\.?)/i)
    || text.match(/£\s*([\d,]+)\s*\((?:full.?time|international)/i)
    || text.match(/£\s*([\d,]+)/);
  if (m) {
    const v = parseInt(m[1].replace(/,/g, ''), 10);
    if (v > 3000 && v < 60000) return v;
  }
  return null;
}

function parseDuration(text, name) {
  const m = text.match(/([\d.]+)\s*year[s]?\s*(?:full.?time|ft)/i)
    || text.match(/([\d.]+)\s*year/i);
  if (m) return parseFloat(m[1]);
  // Fallback by level
  if (/phd|doctor/i.test(name)) return 3;
  if (/master|msc|ma\b|mba|llm|meng/i.test(name)) return 1;
  if (/pgdip|postgraduate diploma/i.test(name)) return 1;
  if (/pgcert|postgraduate certificate/i.test(name)) return 0.5;
  if (/bachelor|bsc|ba\b|beng|llb/i.test(name)) return 3;
  if (/diploma/i.test(name)) return 1;
  return 1;
}

function parseIntakes(text) {
  const months = [];
  if (/\bseptember\b|\bautumn\b|\bfall\b/i.test(text)) months.push('September');
  if (/\bjanuary\b|\bspring\b/i.test(text)) months.push('January');
  if (/\bmay\b|\bsummer\b/i.test(text)) months.push('May');
  return months.length ? months : ['September'];
}

function inferLevel(name) {
  const n = name.toLowerCase();
  if (/phd|doctor of philosophy|dphil/i.test(n)) return 'PhD';
  if (/mba|master of|msc|ma\b|mres|llm|meng\b|mpa\b/i.test(n)) return 'Masters';
  if (/pgdip|postgraduate diploma|grad dip/i.test(n)) return 'Graduate Diploma';
  if (/pgcert|postgraduate certificate|grad cert/i.test(n)) return 'Graduate Certificate';
  if (/honours|hons/i.test(n)) return 'Undergraduate (Honours)';
  if (/bachelor|bsc\b|ba\b|beng\b|llb\b|bba\b|bmid/i.test(n)) return 'Undergraduate';
  if (/foundation/i.test(n)) return 'Foundation';
  if (/diploma/i.test(n)) return 'Diploma';
  if (/certificate/i.test(n)) return 'Certificate';
  return 'Postgraduate';
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

// ── Sitemap parsing ──────────────────────────────────────────────────────────
async function fetchSitemapUrls(sitemapUrl) {
  try {
    const r = await ax.get(sitemapUrl, { responseType: 'text' });
    const urls = [];
    const $ = cheerio.load(r.data, { xmlMode: true });
    $('url loc').each((_, el) => urls.push($(el).text().trim()));
    $('sitemap loc').each((_, el) => urls.push($(el).text().trim())); // sub-sitemaps
    return urls;
  } catch (e) {
    console.error(`  Sitemap fetch failed: ${sitemapUrl} → ${e.message}`);
    return [];
  }
}

// ── Individual course page scraping ─────────────────────────────────────────
async function scrapeCourse(url, config, i, total) {
  process.stdout.write(`  [${String(i).padStart(3)}/${total}] `);
  try {
    const r = await ax.get(url);
    const $ = cheerio.load(r.data);
    const text = r.data;

    const h1 = $('h1').first();
    const name = (h1.clone().children().remove().end().text() || h1.text())
      .replace(/\s+/g, ' ').trim();

    if (!name || name.length < 5) {
      process.stdout.write('SKIP (no name)\n');
      return null;
    }

    const level = inferLevel(name);
    const durationYears = parseDuration(text.slice(0, 5000), name);
    let annualGBP = parseAnnualFeeGBP(text.slice(0, 10000));
    if (!annualGBP) {
      const feesKey = level === 'PhD' ? 'phd'
        : /masters|master|msc|ma\b|mba|llm/i.test(level) ? 'masters'
        : /graduate diploma/i.test(level) ? 'gradDip'
        : /graduate certificate/i.test(level) ? 'gradCert'
        : /undergraduate/i.test(level) ? 'bachelor'
        : /diploma/i.test(level) ? 'diploma'
        : 'default';
      annualGBP = config.fees[feesKey] || config.fees.default;
    }
    if (annualGBP > 50000 && durationYears > 1) annualGBP = Math.round(annualGBP / durationYears);

    const intakes = parseIntakes(text.slice(0, 8000));
    const urlParts = url.split('/').filter(Boolean);
    const urlSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

    process.stdout.write(`${name.slice(0, 55)}\n`);
    return buildCourse(config, name, url, urlSlug, level, durationYears, annualGBP, intakes);
  } catch (e) {
    process.stdout.write(`ERROR: ${(e.response?.status || e.message).toString().slice(0, 40)}\n`);
    return null;
  }
}

function buildCourse(config, name, url, urlSlug, level, durationYears, annualGBP, intakes) {
  const annualUSD = Math.round(annualGBP * 1.27);
  return {
    name,
    slug: `${config.id}-${slugify(urlSlug || name)}`,
    url,
    level,
    duration: durationYears === 0.5 ? '6 months' : `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
    durationYears,
    annualGBP,
    annualUSD,
    totalGBP: Math.round(annualGBP * durationYears),
    ieltsMin: config.ieltsDefault,
    intakeMonths: intakes,
    campus: config.campus,
    currency: 'GBP',
  };
}

// ── Listing-page scraping (Northumbria, ARU) ─────────────────────────────────
async function scrapeListingPage(listingUrl, config) {
  console.log(`  Fetching listing: ${listingUrl}`);
  const courseUrls = new Set();
  let page = 0;
  const baseHost = new URL(config.website);

  while (true) {
    try {
      const url = page === 0 ? listingUrl : `${listingUrl}?page=${page}`;
      const r = await ax.get(url);
      const $ = cheerio.load(r.data);
      let found = 0;

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href') || '';
        let fullUrl = href.startsWith('http') ? href : `${config.website}${href.startsWith('/') ? href : '/' + href}`;
        try {
          const parsed = new URL(fullUrl);
          if (parsed.hostname === baseHost.hostname) {
            const pathname = parsed.pathname;
            if (config.isCourseUrl(pathname)) {
              if (!courseUrls.has(fullUrl)) {
                courseUrls.add(fullUrl);
                found++;
              }
            }
          }
        } catch {}
      });

      console.log(`    Page ${page}: found ${found} new course links (total: ${courseUrls.size})`);
      if (found === 0) break;
      page++;
      await sleep(500);
      if (page > 50) break; // safety cap
    } catch (e) {
      console.error(`    Page ${page} error: ${e.message}`);
      break;
    }
  }

  return [...courseUrls];
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const uniId = process.argv[2];
  if (!uniId) { console.error('Usage: node scrape-uk-university.js <uni-id>'); process.exit(1); }

  const config = CONFIGS.find(c => c.id === uniId);
  if (!config) { console.error(`Unknown university: ${uniId}`); process.exit(1); }

  if (config.sitemaps.length === 0 && config.listingUrls.length === 0) {
    console.log(`\n⚠️  ${config.name} requires curated data — run build-blocked-uk-unis.js instead`);
    process.exit(0);
  }

  console.log(`\n🔍 Scraping ${config.name}`);
  const outFile = path.join(OUT_DIR, `${uniId}.json`);

  // Load existing progress
  let existingResults = [];
  const progressFile = outFile + '.progress.json';
  if (fs.existsSync(progressFile)) {
    existingResults = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    console.log(`  Resuming with ${existingResults.length} existing courses`);
  }
  const existingUrls = new Set(existingResults.map(c => c.url));

  // Gather all course URLs
  let courseUrls = [];

  // 1. From sitemaps
  for (const sm of config.sitemaps) {
    console.log(`  Fetching sitemap: ${sm}`);
    const urls = await fetchSitemapUrls(sm);
    const filtered = urls.filter(u => {
      try {
        const p = new URL(u).pathname;
        return config.isCourseUrl(p);
      } catch { return false; }
    });
    console.log(`  → ${filtered.length} course URLs from sitemap`);
    courseUrls.push(...filtered);
  }

  // 2. From listing pages
  for (const listingUrl of config.listingUrls) {
    const fromListing = await scrapeListingPage(listingUrl, config);
    console.log(`  → ${fromListing.length} course URLs from listing`);
    courseUrls.push(...fromListing);
  }

  // Deduplicate and skip already scraped
  courseUrls = [...new Set(courseUrls)].filter(u => !existingUrls.has(u));
  console.log(`\n  ${courseUrls.length} new URLs to scrape (${existingUrls.size} already done)\n`);

  const results = [...existingResults];
  for (let i = 0; i < courseUrls.length; i++) {
    const course = await scrapeCourse(courseUrls[i], config, i + 1, courseUrls.length);
    if (course) results.push(course);

    // Save progress every 25
    if (i % 25 === 0) {
      fs.writeFileSync(progressFile, JSON.stringify(results, null, 2), 'utf8');
    }
    if (i < courseUrls.length - 1) await sleep(600);
  }

  // Deduplicate by name
  const byName = new Map();
  results.forEach(c => { if (!byName.has(c.name)) byName.set(c.name, c); });
  const final = [...byName.values()];

  fs.writeFileSync(outFile, JSON.stringify(final, null, 2), 'utf8');
  if (fs.existsSync(progressFile)) fs.unlinkSync(progressFile);

  console.log(`\n✅ ${config.name}: ${final.length} courses saved → ${outFile}`);
  const byLevel = {};
  final.forEach(c => { byLevel[c.level] = (byLevel[c.level] || 0) + 1; });
  console.log('By level:', byLevel);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
