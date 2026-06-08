/**
 * fetch-courses.js
 *
 * Fetches course data from university websites and writes to data/courses/[slug].json
 *
 * REALITY CHECK — this script works for:
 *   ✅ Sites that serve server-rendered HTML without bot-blocking
 *   ❌ Sites returning 403 (Melbourne, UCL, Toronto) — need a real browser + proxy
 *   ❌ JavaScript SPAs — courses only exist after JS executes
 *
 * Usage:
 *   node scripts/fetch-courses.js <slug> <url>
 *   node scripts/fetch-courses.js tu-munich https://www.tum.de/en/studies/degree-programs
 *
 * For blocked sites: see bottom of file for Puppeteer upgrade path.
 */

const axios  = require('axios');
const cheerio = require('cheerio');
const fs     = require('fs');
const path   = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function deriveLevel(name) {
  const n = name.toLowerCase();
  if (/phd|doctorate|d\.phil|doctor of/.test(n)) return 'phd';
  if (/\bmba\b|executive mba|master of business admin/.test(n)) return 'mba';
  if (/master|msc\b|ms\b|meng\b|mphil|mres|llm|mpa|mfa/.test(n)) return 'postgraduate';
  if (/bachelor|bsc\b|ba\b|beng\b|bba|llb|bfa/.test(n)) return 'undergraduate';
  // infer from common patterns
  if (/^b\./.test(n)) return 'undergraduate';
  if (/^m\./.test(n)) return 'postgraduate';
  return 'postgraduate'; // safe default for most uni listings
}

function deriveDuration(level) {
  return { phd: '3-4 years', mba: '1-2 years', undergraduate: '3-4 years', postgraduate: '1-2 years' }[level] || '1-2 years';
}

// ── University-specific parsers ───────────────────────────────────────────────
// Add a parser here for each university. Each receives a cheerio $ object
// and returns Course[] or null if the page structure isn't recognised.

const PARSERS = {

  // TU Munich — server-rendered Typo3 CMS
  'tu-munich': ($) => {
    const courses = [];

    // TUM program pages use tx_sfitsjobboard or similar — scan all <a> inside
    // the main content area that look like degree names
    $('main a, .main-content a, #content a, .ce-bodytext a, table a').each((_, el) => {
      const name = $(el).text().replace(/\s+/g, ' ').trim();
      const href = $(el).attr('href') || '';
      if (
        name.length > 8 && name.length < 120 &&
        /bachelor|master|phd|engineering|science|management|informatics|medicine|architecture|finance|mathematics|physics|chemistry|biology|economics|law|education|design|arts|aerospace|mechanical|electrical|civil|computer/i.test(name) &&
        !/(see more|apply|overview|here|click|pdf|link|back|next|menu)/i.test(name)
      ) {
        courses.push({
          name,
          slug: toSlug(name),
          level: deriveLevel(name),
          department: guessDepartment(name),
          duration: deriveDuration(deriveLevel(name)),
          link: href.startsWith('http') ? href : `https://www.tum.de${href}`,
          annualFeeUSD: 0, // TUM is free for EU; ~€3K/yr for non-EU
          ieltsMin: 6.5,
          intakes: ['October', 'April'],
          source: 'scraped',
        });
      }
    });

    return courses;
  },

  // Aalborg University — TYPO3 CMS, generally accessible
  'aalborg-university': ($) => {
    const courses = [];
    $('h2 a, h3 a, .programme a, .study-programme a, ul.programmes li a').each((_, el) => {
      const name = $(el).text().replace(/\s+/g, ' ').trim();
      if (name.length > 5 && name.length < 100) {
        courses.push({
          name,
          slug: toSlug(name),
          level: deriveLevel(name),
          department: guessDepartment(name),
          duration: deriveDuration(deriveLevel(name)),
          link: $(el).attr('href') || '',
          annualFeeUSD: 11000,
          ieltsMin: 6.5,
          intakes: ['September', 'February'],
          source: 'scraped',
        });
      }
    });
    return courses;
  },

  // Generic parser — tries several common patterns seen on university sites
  'generic': ($) => {
    const courses = [];
    const seen = new Set();

    // Pattern 1: Labelled headings inside a listing container
    $([
      '.course-item h3', '.programme-item h3', '.degree-item h2',
      '.search-result__title', '.course-title', '.programme-title',
      '.listing__title', 'article h2', 'article h3',
      'table td:first-child', '.card__title',
    ].join(', ')).each((_, el) => {
      const name = $(el).text().replace(/\s+/g, ' ').trim();
      if (name.length > 5 && name.length < 120 && !seen.has(name)) {
        seen.add(name);
        courses.push({
          name,
          slug: toSlug(name),
          level: deriveLevel(name),
          department: guessDepartment(name),
          duration: deriveDuration(deriveLevel(name)),
          link: $(el).closest('a').attr('href') || $(el).find('a').attr('href') || '',
          annualFeeUSD: null,
          ieltsMin: null,
          intakes: [],
          source: 'scraped-generic',
        });
      }
    });

    // Pattern 2: All <a> tags that look like degree names (fallback)
    if (courses.length < 5) {
      $('a').each((_, el) => {
        const name = $(el).text().replace(/\s+/g, ' ').trim();
        if (
          name.length > 10 && name.length < 100 && !seen.has(name) &&
          /bachelor|master|phd|mba|msc|bsc|engineering|science|medicine|law|arts|design|management|informatics|economics|finance|nursing|health/i.test(name)
        ) {
          seen.add(name);
          courses.push({
            name,
            slug: toSlug(name),
            level: deriveLevel(name),
            department: guessDepartment(name),
            duration: deriveDuration(deriveLevel(name)),
            link: $(el).attr('href') || '',
            annualFeeUSD: null,
            ieltsMin: null,
            intakes: [],
            source: 'scraped-fallback',
          });
        }
      });
    }

    return courses;
  },
};

function guessDepartment(name) {
  const n = name.toLowerCase();
  if (/computer|software|data|ai|machine learning|cyber|information technology|informatics/.test(n)) return 'Computer Science & IT';
  if (/business|management|mba|commerce|marketing|accounting|finance|economics/.test(n)) return 'Business & Management';
  if (/engineering|mechanical|electrical|civil|chemical|aerospace|structural/.test(n)) return 'Engineering';
  if (/medicine|nursing|health|pharmacy|dentistry|biomedical|physiotherapy/.test(n)) return 'Health Sciences';
  if (/law|llb|llm|legal/.test(n)) return 'Law';
  if (/psychology|sociology|political|international|social/.test(n)) return 'Social Sciences';
  if (/mathematics|physics|chemistry|biology|statistics|science/.test(n)) return 'Natural Sciences';
  if (/art|design|architecture|fashion|film|music|media/.test(n)) return 'Arts & Design';
  if (/education|teaching/.test(n)) return 'Education';
  return 'Other';
}

// ── Main fetch function ───────────────────────────────────────────────────────

async function fetchCourses(slug, url) {
  console.log(`\n[fetch-courses] ${slug}`);
  console.log(`  URL: ${url}`);

  // Ensure output directory exists
  const outDir = path.join(__dirname, '..', 'data', 'courses');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${slug}.json`);

  let html;
  try {
    const res = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      maxRedirects: 5,
    });
    html = res.data;
    console.log(`  ✅ Fetched ${html.length.toLocaleString()} bytes (HTTP ${res.status})`);
  } catch (err) {
    const status = err.response?.status;
    if (status === 403 || status === 401) {
      console.error(`  ❌ BLOCKED (HTTP ${status}) — ${slug} uses bot protection.`);
      console.error(`     Solution: Use Puppeteer with stealth plugin (see README at bottom of script).`);
    } else if (status === 404) {
      console.error(`  ❌ URL not found (404) — check the URL is correct.`);
    } else if (err.code === 'ECONNABORTED') {
      console.error(`  ❌ Timeout — site too slow or unreachable.`);
    } else {
      console.error(`  ❌ Network error: ${err.message}`);
    }
    process.exit(1);
  }

  const $ = cheerio.load(html);

  // Remove script/style/nav/footer noise
  $('script, style, nav, footer, header, .cookie-banner, .modal').remove();

  // Detect if this is a JavaScript SPA (empty body)
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  if (bodyText.length < 200) {
    console.error(`  ⚠️  Page appears to be a JavaScript SPA — body has < 200 chars of text.`);
    console.error(`     The courses are loaded via XHR after JS executes.`);
    console.error(`     Solution: Use Puppeteer (see README at bottom of script).`);
    process.exit(1);
  }

  // Pick parser: university-specific first, then generic
  const parserFn = PARSERS[slug] || PARSERS['generic'];
  let courses = parserFn($);

  // Deduplicate by name
  const seen = new Set();
  courses = courses.filter(c => {
    if (seen.has(c.name)) return false;
    seen.add(c.name);
    return true;
  });

  // Warn if very few courses found (likely wrong page or SPA)
  if (courses.length < 5) {
    console.warn(`  ⚠️  Only ${courses.length} courses extracted — page may be a navigation page, not a listing.`);
    console.warn(`     Try a more specific URL, e.g. the bachelor's or master's programs list directly.`);
  }

  const output = {
    slug,
    sourceUrl: url,
    fetchedAt: new Date().toISOString(),
    totalCourses: courses.length,
    courses,
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
  console.log(`  📁 Saved ${courses.length} courses → ${outFile}`);

  if (courses.length > 0) {
    console.log('\n  First 20 courses:');
    courses.slice(0, 20).forEach((c, i) => {
      console.log(`  ${String(i + 1).padStart(2)}. [${c.level.toUpperCase().padEnd(14)}] ${c.name}`);
    });
  }

  return output;
}

// ── CLI entry point ───────────────────────────────────────────────────────────

const [,, slug, url] = process.argv;

if (!slug || !url) {
  console.log('Usage: node scripts/fetch-courses.js <university-slug> <url>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/fetch-courses.js tu-munich https://www.tum.de/en/studies/degree-programs');
  console.log('  node scripts/fetch-courses.js aalborg-university https://www.aau.dk/education');
  console.log('');
  console.log('BLOCKED sites (need Puppeteer):');
  console.log('  University of Melbourne  — 403');
  console.log('  UCL London               — 403');
  console.log('  University of Toronto    — SPA');
  process.exit(0);
}

fetchCourses(slug, url).catch(e => {
  console.error('Unexpected error:', e.message);
  process.exit(1);
});

/*
 * ══════════════════════════════════════════════════════════════════════════════
 * PUPPETEER UPGRADE (for blocked/SPA sites)
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Install:
 *   npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth --save-dev
 *
 * Then replace the axios.get block with:
 *
 *   const puppeteer = require('puppeteer-extra');
 *   const StealthPlugin = require('puppeteer-extra-plugin-stealth');
 *   puppeteer.use(StealthPlugin());
 *
 *   const browser = await puppeteer.launch({ headless: 'new' });
 *   const page = await browser.newPage();
 *   await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
 *   // For SPAs, wait for the course list to render:
 *   await page.waitForSelector('.course-item, .programme-title, article h2', { timeout: 10000 });
 *   html = await page.content();
 *   await browser.close();
 *
 * Note: Even with Puppeteer, some sites (Melbourne, UCL) use Cloudflare or
 * DataDome which blocks headless browsers. At that point you need residential
 * proxies, which cost money and violate university ToS.
 *
 * ── BETTER ALTERNATIVE ──────────────────────────────────────────────────────
 *
 * Many universities publish their course data through official channels:
 *
 *   Melbourne:  https://study.unimelb.edu.au/api/courses (check their sitemap)
 *   Toronto:    https://degreeexplorer.utoronto.ca/api (public REST API exists)
 *   UCL:        https://www.ucl.ac.uk/module-catalogue/api (documented API)
 *   TU Munich:  https://campus.tum.de/tumonline (TUMOnline has XML data)
 *
 * Using official APIs is faster, more reliable, and doesn't violate ToS.
 * ══════════════════════════════════════════════════════════════════════════════
 */
