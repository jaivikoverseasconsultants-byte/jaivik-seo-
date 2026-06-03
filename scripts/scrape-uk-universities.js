/**
 * Scrape real UK university course listings
 * Targets: Edinburgh, Warwick, Birmingham, Sheffield, Bristol, Nottingham
 */
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function fetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
          'Accept-Language': 'en-US,en;q=0.9',
          ...opts.headers
        },
        timeout: 15000,
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : `${urlObj.protocol}//${urlObj.hostname}${res.headers.location}`;
          return fetch(loc, opts).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    } catch(e) { reject(e); }
  });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

function extractCourseType(name) {
  if (/\bMBA\b/.test(name)) return { level: 'MBA', studyLevel: 'Postgraduate' };
  if (/\bMEng\b/i.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\bMSc\b/i.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\bMA\b/.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\bMPhil\b/i.test(name)) return { level: 'MPhil', studyLevel: 'Postgraduate' };
  if (/\bLLM\b/i.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\bMRes\b/i.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\bPGDip\b/i.test(name)) return { level: 'PG Diploma', studyLevel: 'Postgraduate' };
  if (/\bPGCert\b/i.test(name)) return { level: 'PG Certificate', studyLevel: 'Postgraduate' };
  if (/\bBSc\b/i.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bBEng\b/i.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bBA\b/.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bBCom\b/i.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\b(Master|MSc|Masters)\b/i.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\b(Bachelor|BSc|BEng)\b/i.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  if (/\bPhD\b/i.test(name)) return { level: 'PhD', studyLevel: 'Postgraduate' };
  return { level: 'Masters', studyLevel: 'Postgraduate' };
}

// === UNIVERSITY OF EDINBURGH ===
async function scrapeEdinburgh() {
  console.log('\n=== University of Edinburgh ===');
  const urls = [
    'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/taught',
    'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/research',
  ];

  const allPrograms = [];

  for (const url of urls) {
    try {
      const r = await fetch(url);
      const $ = cheerio.load(r.body);
      console.log(`  ${url.split('?')[1]}: ${r.status}`);

      // Edinburgh uses a specific structure for course listings
      $('a').each((i, a) => {
        const href = $(a).attr('href') || '';
        const text = $(a).text().trim();
        if (text.length > 8 && text.length < 120 &&
          (href.includes('/degrees/') || href.includes('postgraduate')) &&
          !href.includes('index.php') &&
          !text.includes('Contact') && !text.includes('Home') && !text.includes('About')) {
          allPrograms.push({ name: text, href });
        }
      });

      // Also look in lists
      $('li a, td a, h3 a, .degree-title a, .course-name a').each((i, a) => {
        const text = $(a).text().trim();
        const href = $(a).attr('href') || '';
        if (text.length > 5 && text.length < 100) {
          allPrograms.push({ name: text, href });
        }
      });

    } catch(e) {
      console.log(`  Error: ${e.message}`);
    }
  }

  // Get program names from the first page more carefully
  try {
    const r = await fetch('https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/taught');
    const $ = cheerio.load(r.body);

    const programs = [];
    // Look for list items with degree names
    $('li, .degree, .programme, td').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 8 && text.length < 120 &&
        (text.match(/\b(MSc|MA |MEng|MBA|MPhil|LLM|MRes|PGDip)\b/) ||
          text.match(/\bMaster/i))) {
        // Clean up the text
        const cleaned = text.replace(/\s+/g, ' ').trim();
        if (!programs.includes(cleaned)) {
          programs.push(cleaned);
        }
      }
    });

    console.log(`  Programs from first page: ${programs.length}`);
    programs.slice(0, 20).forEach(p => console.log(`    ${p}`));

    return programs;
  } catch(e) {
    console.log(`  Error: ${e.message}`);
    return [];
  }
}

// === UNIVERSITY OF WARWICK ===
async function scrapeWarwick() {
  console.log('\n=== University of Warwick ===');
  const programs = [];

  try {
    const r = await fetch('https://warwick.ac.uk/study/postgraduate/courses/');
    const $ = cheerio.load(r.body);
    console.log(`  Status: ${r.status}`);

    // Warwick has a good program listing
    $('a').each((i, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim();
      // Look for MSc, MA, MBA, MRes links
      if (text.match(/\b(MSc|MA |MEng|MBA|MPhil|LLM|MRes|PGDip|PGCert|Master)\b/i) &&
        text.length > 8 && text.length < 120) {
        programs.push({ name: text.replace(/\s+/g, ' ').trim(), href });
      }
    });

    console.log(`  Programs found: ${programs.length}`);
    programs.slice(0, 25).forEach(p => console.log(`    ${p.name}`));
    return programs;

  } catch(e) {
    console.log(`  Error: ${e.message}`);
    return [];
  }
}

// === UNIVERSITY OF BIRMINGHAM ===
async function scrapeBirmingham() {
  console.log('\n=== University of Birmingham ===');
  const programs = [];

  try {
    const r = await fetch('https://www.birmingham.ac.uk/postgraduate/courses');
    const $ = cheerio.load(r.body);
    console.log(`  Status: ${r.status}`);

    $('a').each((i, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim();
      if ((href.includes('/postgraduate/') || href.includes('/courses/')) &&
        text.length > 8 && text.length < 120 &&
        (text.match(/\b(MSc|MA |MEng|MBA|MPhil|LLM|MRes|PGDip|BSc|BEng|BA )\b/i) ||
          text.match(/Master|Bachelor/i))) {
        programs.push({ name: text.replace(/\s+/g, ' ').trim(), href });
      }
    });

    // Also from list items
    $('li').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(/\b(MSc|MA |MEng|MBA|PGDip|LLM)\b/) && text.length > 8 && text.length < 100) {
        programs.push({ name: text.replace(/\s+/g, ' ').trim(), href: '' });
      }
    });

    const unique = [...new Map(programs.map(p => [p.name, p])).values()];
    console.log(`  Programs found: ${unique.length}`);
    unique.slice(0, 25).forEach(p => console.log(`    ${p.name}`));
    return unique;

  } catch(e) {
    console.log(`  Error: ${e.message}`);
    return [];
  }
}

// === GENERATE COURSE DATA FILE ===
function generateCourseData(uniConfig, programs) {
  const { slug, prefix, city, country, countryCode, annualGBP, livingCostGBP, campus } = uniConfig;

  const courses = programs.map((prog, idx) => {
    const name = typeof prog === 'string' ? prog : prog.name;
    const courseSlug = `${prefix}-${slugify(name)}`;
    const { level, studyLevel } = extractCourseType(name);

    const isPG = studyLevel === 'Postgraduate';
    const isUG = studyLevel === 'Undergraduate';
    const isMBA = level === 'MBA';

    const annual = isMBA ? annualGBP * 2 : isPG ? annualGBP : Math.round(annualGBP * 0.85);
    const duration = isMBA ? '1 year' : isPG ? '1 year' : '3 years';
    const durationYears = isMBA ? 1 : isPG ? 1 : 3;
    const total = annual * durationYears;
    const annualUSD = Math.round(annual * 1.27);
    const annualINR = Math.round(annual * 106);
    const living = livingCostGBP;
    const livingUSD = Math.round(living * 1.27);
    const livingINR = Math.round(living * 106);

    return {
      id: `${prefix}-${idx + 1}`,
      name: name.replace(/MSc$/, '').replace(/MA$/, '').trim() + (name.includes('MSc') || name.includes('MA ') ? '' : ''),
      slug: courseSlug,
      url: `https://www.${slug.replace('university-of-', '').replace('-university', '')}.ac.uk`,
      level,
      studyLevel,
      duration,
      durationYears,
      annualGBP: annual,
      annualUSD,
      annualINR,
      totalGBP: total,
      livingCostGBP: living,
      livingCostUSD: livingUSD,
      livingCostINR: livingINR,
      ieltsMin: isPG ? 6.5 : 6.0,
      toeflMin: isPG ? 92 : 87,
      pteMin: isPG ? 62 : 59,
      intakeMonths: isPG ? ['September'] : ['September'],
      campus,
      country,
      countryCode,
      city,
    };
  });

  return courses;
}

async function main() {
  // Scrape Edinburgh
  const edinburghPrograms = await scrapeEdinburgh();

  // Scrape Warwick
  const warwickPrograms = await scrapeWarwick();

  // Scrape Birmingham
  const birminghamPrograms = await scrapeBirmingham();

  console.log('\n=== Summary ===');
  console.log(`Edinburgh: ${edinburghPrograms.length} programs`);
  console.log(`Warwick: ${warwickPrograms.length} programs`);
  console.log(`Birmingham: ${birminghamPrograms.length} programs`);
}

main().catch(console.error);
