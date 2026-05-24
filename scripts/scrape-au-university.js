/**
 * Universal Australian University Scraper
 * Usage: node scripts/scrape-au-university.js <uni-id>
 * Saves to: data/scraped/australia/<uni-id>.json
 *
 * Strategy:
 *  1. Fetch sitemap(s) → collect course-like URLs
 *  2. Scrape each URL for name, level, duration, fees, IELTS, intakes
 *  3. Fallback: infer from URL slug when page scrape fails
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CONFIGS = require('./au-universities-config');
const DELAY = 800; // ms between requests
const OUT_DIR = path.join(__dirname, '../data/scraped/australia');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const ax = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    'Accept-Language': 'en-AU,en;q=0.9',
  },
});

// ── Level inference ───────────────────────────────────────────────────────────

function inferLevel(name) {
  const n = name.toLowerCase();
  if (/doctor of philosophy|phd/i.test(n)) return 'PhD';
  if (/juris doctor/i.test(n)) return 'Masters';
  if (/master of|masters|mba/i.test(n)) return 'Masters';
  if (/graduate diploma/i.test(n)) return 'Graduate Diploma';
  if (/graduate certificate/i.test(n)) return 'Graduate Certificate';
  if (/honours/i.test(n) && /bachelor/i.test(n)) return 'Undergraduate (Honours)';
  if (/bachelor of|bachelor's/i.test(n)) return 'Undergraduate';
  if (/diploma of|diploma in/i.test(n)) return 'Diploma';
  if (/certificate iv|certificate iii/i.test(n)) return 'Certificate';
  return 'Postgraduate';
}

function inferDurationYears(name) {
  const n = name.toLowerCase();
  if (/phd|doctor of philosophy/i.test(n)) return 3;
  if (/graduate certificate/i.test(n)) return 0.5;
  if (/graduate diploma/i.test(n)) return 1;
  if (/master of|masters|juris doctor|mba/i.test(n)) return 2;
  if (/honours/i.test(n)) return 1;
  if (/bachelor of/i.test(n)) return 3;
  if (/diploma/i.test(n)) return 1;
  return 2;
}

function inferAnnualAUD(name, config) {
  const n = name.toLowerCase();
  const f = config.fees;
  if (/phd|doctor of philosophy/i.test(n)) return f.phd || f.default;
  if (/graduate certificate/i.test(n)) return f.gradCert || f.default;
  if (/graduate diploma/i.test(n)) return f.gradDip || f.default;
  if (/master of engineering|master of professional engineering/i.test(n)) return Math.round((f.masters || f.default) * 1.1);
  if (/master of information technology|master of data science|master of computing/i.test(n)) return f.masters || f.default;
  if (/master of|mba|juris doctor/i.test(n)) return f.masters || f.default;
  if (/bachelor of engineering/i.test(n)) return Math.round((f.bachelor || f.default) * 1.1);
  if (/bachelor of/i.test(n)) return f.bachelor || f.default;
  if (/diploma/i.test(n)) return f.diploma || f.default;
  return f.default;
}

// ── Sitemap fetching ──────────────────────────────────────────────────────────

async function getCourseUrlsFromSitemap(config) {
  const courseUrls = new Set();

  for (const sitemapUrl of config.sitemaps) {
    try {
      console.log(`  Fetching sitemap: ${sitemapUrl}`);
      const r = await ax.get(sitemapUrl, { timeout: 30000 });
      const xml = r.data;

      // Handle sitemap index (multiple sitemaps)
      const subSitemaps = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
      if (subSitemaps.length > 0) {
        console.log(`  Sitemap index with ${subSitemaps.length} sub-sitemaps`);
        // Fetch each sub-sitemap (limit to first 10 to avoid too many requests)
        for (const sub of subSitemaps.slice(0, 10)) {
          try {
            const sr = await ax.get(sub, { timeout: 20000 });
            const allLocs = [...sr.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
            allLocs.forEach(url => {
              try {
                const pathname = new URL(url).pathname;
                if (config.isCourseUrl(pathname)) courseUrls.add(url);
              } catch {}
            });
            await sleep(200);
          } catch (e) {
            console.log(`  Sub-sitemap error: ${e.message.slice(0, 50)}`);
          }
        }
      } else {
        // Regular sitemap
        const allLocs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
        console.log(`  Sitemap has ${allLocs.length} URLs`);
        allLocs.forEach(url => {
          try {
            const pathname = new URL(url).pathname;
            if (config.isCourseUrl(pathname)) courseUrls.add(url);
          } catch {}
        });
      }
    } catch (e) {
      console.log(`  Sitemap fetch failed: ${e.message.slice(0, 60)}`);
    }
  }

  return [...courseUrls];
}

// ── Page scraper ──────────────────────────────────────────────────────────────

function parseDuration(text) {
  const m = text.match(/([\d.]+)\s*years?\s*full[\s-]*time/i)
    || text.match(/([\d.]+)\s*year/i)
    || text.match(/(\d+)\s*semester/i);
  if (m) {
    const n = parseFloat(m[1]);
    // Convert semesters to years
    if (/semester/i.test(m[0])) return n / 2;
    return n;
  }
  return null;
}

function parseIelts(text) {
  const m = text.match(/IELTS[^:]*:\s*overall\s*([\d.]+)/i)
    || text.match(/IELTS[^0-9]*([\d.]+)/i)
    || text.match(/overall\s*band\s*score\s*of\s*([\d.]+)/i);
  return m ? parseFloat(m[1]) : null;
}

function parseIntakes(text) {
  const months = [];
  if (/\bfebruary\b|\bautumn\b|\bsemester\s*1\b/i.test(text)) months.push('February');
  if (/\bjuly\b|\bspring\b|\bsemester\s*2\b/i.test(text)) months.push('July');
  if (/\bjanuary\b/i.test(text)) months.push('January');
  if (/\bjune\b/i.test(text) && !months.includes('July')) months.push('June');
  if (/\boctober\b|\bnovember\b/i.test(text)) months.push('October');
  if (/\bmarch\b/i.test(text)) months.push('March');
  return months.length ? months : null;
}

function parseFeeAUD(text) {
  // Look for total course fee first
  const totalMatch = text.match(/(?:total\s+)?(?:course\s+)?(?:indicative\s+)?(?:international\s+)?(?:tuition\s+)?fee[^$\d]*\$\s*([\d,]+)/i)
    || text.match(/\$\s*([\d,]+)\s*per\s*year/i)
    || text.match(/\$\s*([\d,]+)\s*\/\s*year/i);
  if (totalMatch) {
    const val = parseInt(totalMatch[1].replace(/,/g,''), 10);
    if (val > 5000 && val < 200000) return val;
  }
  // Fallback: any dollar amount in fee range
  const amounts = [...text.matchAll(/\$\s*([\d,]+)/g)]
    .map(m => parseInt(m[1].replace(/,/g,''), 10))
    .filter(n => n > 8000 && n < 120000);
  return amounts.length ? amounts[0] : null;
}

async function scrapePage(url, config, index, total) {
  process.stdout.write(`  [${String(index).padStart(3)}/${total}] `);
  try {
    const r = await ax.get(url, { timeout: 15000 });
    const $ = cheerio.load(r.data);
    const text = r.data;

    // Name from h1
    const h1 = $('h1').first();
    const nameRaw = h1.clone().children().remove().end().text().trim()
      || h1.text().trim();
    const name = nameRaw
      .replace(/\s+/g, ' ')
      .split(/(?=[A-Z][a-z]+\s+degree\s+research)/)[0]
      .replace(/\s+$/,'')
      .trim();

    if (!name || name.length < 5 || /not\s+found|page\s+not|error/i.test(name)) {
      process.stdout.write('SKIP (bad name)\n');
      return null;
    }
    // Skip if it looks like a staff/student portal page
    if (/log\s*in|sign\s*in|hello|welcome\s+to/i.test(name)) {
      process.stdout.write('SKIP (login page)\n');
      return null;
    }

    const level = inferLevel(name);
    const durationYears = parseDuration(text) || inferDurationYears(name);
    const feeAUD = parseFeeAUD(text) || inferAnnualAUD(name, config);

    // Determine if fee is annual or total
    let annualAUD = feeAUD;
    if (feeAUD && durationYears && feeAUD > 60000 && durationYears > 1) {
      annualAUD = Math.round(feeAUD / durationYears);
    }
    if (annualAUD > 80000) {
      const guess = /phd/i.test(name) ? 3 : /master/i.test(name) ? 2 : 4;
      annualAUD = Math.round(annualAUD / guess);
    }

    const ielts = parseIelts(text) || config.ieltsDefault;
    const rawIntakes = parseIntakes(text.slice(0, 8000));
    const intakeMonths = rawIntakes || config.intakes;

    const urlSlug = url.split('/').pop().replace(/\/$/, '').replace(/[?#].*$/, '');
    const slug = config.id + '-' + urlSlug;

    process.stdout.write(`${name.slice(0, 55)}\n`);
    return {
      name, slug, url, level,
      duration: `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
      durationYears,
      annualAUD,
      annualUSD: Math.round(annualAUD * 0.65),
      totalAUD: Math.round(annualAUD * durationYears),
      ieltsMin: ielts,
      intakeMonths,
      campus: config.campus,
    };
  } catch (err) {
    process.stdout.write(`ERROR: ${(err.response?.status || err.message).toString().slice(0, 40)}\n`);
    return null;
  }
}

// ── Fallback: build from slugs only ──────────────────────────────────────────

function buildFromSlug(url, config) {
  const urlSlug = url.split('/').pop().replace(/\/$/, '').replace(/[?#].*$/, '');
  const name = urlSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const level = inferLevel(name);
  const durationYears = inferDurationYears(name);
  const annualAUD = inferAnnualAUD(name, config);
  return {
    name, slug: config.id + '-' + urlSlug, url, level,
    duration: `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
    durationYears,
    annualAUD,
    annualUSD: Math.round(annualAUD * 0.65),
    totalAUD: Math.round(annualAUD * durationYears),
    ieltsMin: config.ieltsDefault,
    intakeMonths: config.intakes,
    campus: config.campus,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function scrapeUniversity(uniId) {
  const config = CONFIGS.find(c => c.id === uniId);
  if (!config) {
    console.error(`Unknown university ID: ${uniId}`);
    console.error(`Available: ${CONFIGS.map(c => c.id).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scraping: ${config.name}`);
  console.log(`${'='.repeat(60)}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${config.id}.json`);

  // Load existing progress if any
  let existing = [];
  if (fs.existsSync(outFile)) {
    existing = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    console.log(`Resuming: ${existing.length} courses already saved`);
  }
  const existingSlugs = new Set(existing.map(c => c.slug));

  // 1. Get course URLs
  let courseUrls = await getCourseUrlsFromSitemap(config);
  console.log(`Found ${courseUrls.length} course URLs from sitemap`);

  // Filter already scraped
  courseUrls = courseUrls.filter(url => {
    const urlSlug = url.split('/').pop().replace(/\/$/, '');
    return !existingSlugs.has(config.id + '-' + urlSlug);
  });
  console.log(`${courseUrls.length} new URLs to scrape`);

  // 2. Scrape each course page
  const results = [...existing];

  if (courseUrls.length === 0 && existing.length === 0) {
    console.log('No course URLs found from sitemap — building from slug fallback');
    // If we got no URLs, save empty and exit
    fs.writeFileSync(outFile, JSON.stringify([], null, 2), 'utf8');
    console.log(`⚠️  ${config.name}: 0 courses found`);
    return 0;
  }

  for (let i = 0; i < courseUrls.length; i++) {
    const course = await scrapePage(courseUrls[i], config, existing.length + i + 1, existing.length + courseUrls.length);
    if (course) results.push(course);

    // Save progress every 20 courses
    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf8');
    }

    if (i < courseUrls.length - 1) await sleep(DELAY);
  }

  // Deduplicate by name
  const byName = new Map();
  results.forEach(c => { if (!byName.has(c.name)) byName.set(c.name, c); });
  const final = [...byName.values()];

  fs.writeFileSync(outFile, JSON.stringify(final, null, 2), 'utf8');
  console.log(`\n✅ ${config.name}: ${final.length} courses → ${outFile}`);

  const byLevel = {};
  final.forEach(c => { byLevel[c.level] = (byLevel[c.level]||0)+1; });
  console.log('  By level:', JSON.stringify(byLevel));

  return final.length;
}

// Run if called directly
const uniId = process.argv[2];
if (!uniId) {
  console.error('Usage: node scripts/scrape-au-university.js <uni-id>');
  console.error(`IDs: ${require('./au-universities-config').map(c => c.id).join(', ')}`);
  process.exit(1);
}

scrapeUniversity(uniId).catch(e => {
  console.error('\n❌', e.message);
  process.exit(1);
});
