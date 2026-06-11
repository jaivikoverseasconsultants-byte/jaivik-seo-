// Multi-university crawler — Edinburgh, Melbourne, McMaster, Toronto, UCL, NUS
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function dismissCookieBanner(page) {
  const btnSelectors = [
    'button[id*="accept"]', 'button[class*="accept"]',
    'button[id*="cookie"]', 'button[class*="cookie"]',
    'a[id*="accept"]', 'a[class*="accept"]',
    '#onetrust-accept-btn-handler',
    '.cc-accept', '.cookie-accept',
    'button[aria-label*="Accept"]',
  ];
  for (const sel of btnSelectors) {
    try {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); await wait(1500); return true; }
    } catch (_) {}
  }
  // Text-based fallback
  try {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('button, a')) {
        const t = el.textContent.trim().toLowerCase();
        if (t === 'accept all' || t === 'accept cookies' || t === 'i agree' || t === 'allow all') {
          el.click(); return true;
        }
      }
    });
    await wait(1500);
  } catch (_) {}
  return false;
}

// Generic degree-suffix extraction (worked perfectly for Manchester)
async function genericExtract(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MD\b|PhD|PgDip|PgCert|BEng|BSc|BA\b|LLB|BPharm|MArch|MEd|MNurs|MSurg)\b/;
    const navTerms = new Set(['home','back','next','previous','more','search','filter','login','apply','contact','about']);
    const courses = [];
    const seen = new Set();

    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    // Specific selectors first
    const specificSels = [
      '.search-result h3 a', '.search-result h2 a',
      '.result-item h3 a', '.result-item h2 a',
      '.programme-item h3 a', '.programme-item a',
      '.course-item h3 a', '.course-card h3 a',
      '.programme__title a', '.programme-title a',
      '[class*="result"] h3 a', '[class*="programme"] h3 a',
      '[class*="course"] h3 a',
      'li.result a', 'li.programme a',
      'h3 a[href*="programme"]', 'h3 a[href*="course"]', 'h3 a[href*="study"]',
    ];

    for (const sel of specificSels) {
      try {
        root.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
          const href = a.href || '';
          if (name.length > 8 && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            courses.push({ name, url: href });
          }
        });
      } catch (_) {}
    }

    // Degree-suffix fallback
    if (courses.length < 10) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        const href = a.href || '';
        const lower = name.toLowerCase();
        if (
          name.length > 8 && name.length < 150 &&
          degreePat.test(name) &&
          !seen.has(lower) &&
          !navTerms.has(lower)
        ) {
          seen.add(lower);
          courses.push({ name, url: href });
        }
      });
    }

    // Headings for diagnostics
    const headings = [];
    root.querySelectorAll('h1,h2,h3').forEach(h => {
      const t = (h.textContent || '').trim().replace(/\s+/g, ' ');
      if (t.length > 3) headings.push(`${h.tagName}: ${t.substring(0, 100)}`);
    });

    return { courses: courses.slice(0, 400), headings: headings.slice(0, 15) };
  });
}

// ── per-university crawlers ───────────────────────────────────────────────────

async function crawlEdinburgh(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Edinburgh taught postgraduate search (all results, no JS filter needed)
  const url = 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/search&programme_type=pg_taught&limit=500';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await dismissCookieBanner(page);
  await wait(6000);

  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-of-edinburgh', url, country: 'UK', ...data };
}

async function crawlMelbourne(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Try the search endpoint which lists all courses
  const url = 'https://study.unimelb.edu.au/find/courses/graduate/?level_type=graduate';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await dismissCookieBanner(page);
  await wait(6000);

  let data = await genericExtract(page);

  // If that 404'd, try unimelb.edu.au main domain
  if (data.courses.length < 5) {
    const url2 = 'https://www.unimelb.edu.au/courses/find-a-course/postgraduate-coursework';
    await page.goto(url2, { waitUntil: 'networkidle2', timeout: 40000 });
    await wait(5000);
    data = await genericExtract(page);
  }

  await page.close();
  return { slug: 'university-of-melbourne', url, country: 'Australia', ...data };
}

async function crawlMcMaster(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const url = 'https://future.mcmaster.ca/academics/programs/';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await wait(4000);

  const data = await page.evaluate(() => {
    const courses = [];
    const seen = new Set();
    const headings = [];

    // future.mcmaster.ca: program name is in an h3, link wraps the card
    const containers = document.querySelectorAll('article, .program-item, .card, [class*="program"], li.item, li');
    containers.forEach(card => {
      const h3 = card.querySelector('h3, h4, .title, .program-title');
      const link = card.querySelector('a');
      if (h3 && link) {
        const name = h3.textContent.trim().replace(/\s+/g, ' ');
        const href = link.href || '';
        if (name.length > 5 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          courses.push({ name, url: href });
        }
      }
    });

    // Fallback: all h3 in main with nearby links
    if (courses.length < 5) {
      const root = document.querySelector('main, #main, [role="main"]') || document.body;
      root.querySelectorAll('h3, h4').forEach(h => {
        const name = h.textContent.trim().replace(/\s+/g, ' ');
        const sibling = h.nextElementSibling;
        const parent = h.parentElement;
        const link = (parent && parent.tagName === 'A') ? parent
          : (sibling && sibling.tagName === 'A') ? sibling
          : parent && parent.querySelector('a');
        if (name.length > 5 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          courses.push({ name, url: link ? link.href : '' });
        }
      });
    }

    document.querySelectorAll('h1,h2,h3').forEach(h => {
      const t = h.textContent.trim().replace(/\s+/g, ' ');
      if (t.length > 3 && headings.length < 12) headings.push(`${h.tagName}: ${t.substring(0, 80)}`);
    });

    return { courses: courses.slice(0, 300), headings };
  });

  await page.close();
  return { slug: 'mcmaster-university', url, country: 'Canada', ...data };
}

async function crawlToronto(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const url = 'https://future.utoronto.ca/academics/programs/';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await wait(4000);

  const data = await page.evaluate(() => {
    const courses = [];
    const seen = new Set();
    const headings = [];

    // future.utoronto.ca: same card pattern as McMaster
    document.querySelectorAll('article, .card, [class*="program"], li').forEach(card => {
      const h = card.querySelector('h2, h3, h4, .title');
      const link = card.querySelector('a') || (card.tagName === 'A' ? card : null);
      if (h && link) {
        const name = h.textContent.trim().replace(/\s+/g, ' ');
        const href = link.href || '';
        if (name.length > 5 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          courses.push({ name, url: href });
        }
      }
    });

    document.querySelectorAll('h1,h2,h3').forEach(h => {
      const t = h.textContent.trim().replace(/\s+/g, ' ');
      if (t.length > 3 && headings.length < 12) headings.push(`${h.tagName}: ${t.substring(0, 80)}`);
    });

    return { courses: courses.slice(0, 400), headings };
  });

  await page.close();
  return { slug: 'university-of-toronto', url, country: 'Canada', ...data };
}

async function crawlUCL(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const url = 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await dismissCookieBanner(page);
  await wait(5000);

  // Try to click "Load more" if present to get all programmes
  try {
    const loadMore = await page.$('button[class*="load"], a[class*="load-more"], .load-more');
    if (loadMore) { await loadMore.click(); await wait(3000); }
  } catch (_) {}

  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-college-london', url, country: 'UK', ...data };
}

async function crawlNUS(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // NUS graduate taught programmes list
  const url = 'https://www.nus.edu.sg/registrar/academic-information-and-services/graduate-students';
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await dismissCookieBanner(page);
  await wait(5000);

  let data = await genericExtract(page);

  // Fallback: NUS admissions page
  if (data.courses.length < 5) {
    await page.goto('https://www.nus.edu.sg/admissions/graduate-programme', { waitUntil: 'networkidle2', timeout: 40000 });
    await wait(4000);
    data = await genericExtract(page);
  }

  await page.close();
  return { slug: 'national-university-of-singapore', url, country: 'Singapore', ...data };
}

// ── orchestrator ──────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Multi-University Crawler ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const crawlers = [
    { name: 'Edinburgh', fn: crawlEdinburgh },
    { name: 'Melbourne', fn: crawlMelbourne },
    { name: 'McMaster', fn: crawlMcMaster },
    { name: 'Toronto', fn: crawlToronto },
    { name: 'UCL', fn: crawlUCL },
    { name: 'NUS', fn: crawlNUS },
  ];

  const results = [];

  for (const { name, fn } of crawlers) {
    console.log(`\nCrawling ${name}...`);
    try {
      const result = await fn(browser);
      results.push(result);

      console.log(`  Hits: ${result.courses.length}`);
      if (result.headings && result.headings.length) {
        console.log(`  Headings: ${result.headings.slice(0, 3).join(' | ')}`);
      }
      if (result.courses.length > 0) {
        console.log(`  Top 5:`);
        result.courses.slice(0, 5).forEach((c, i) => console.log(`    ${i + 1}. ${c.name}`));
      }

      fs.writeFileSync(
        path.join(outDir, `${result.slug}.json`),
        JSON.stringify({ ...result, crawledAt: new Date().toISOString() }, null, 2)
      );
    } catch (e) {
      console.log(`  FAILED: ${e.message.substring(0, 100)}`);
    }
    await wait(2000);
  }

  await browser.close();

  // Summary table
  console.log('\n\n=== SUMMARY ===');
  console.log('University                     | Courses | Status');
  console.log('-------------------------------|---------|-------');
  results.forEach(r => {
    const status = r.courses.length > 10 ? 'OK' : r.courses.length > 0 ? 'PARTIAL' : 'FAILED';
    console.log(`${r.slug.padEnd(31)}| ${String(r.courses.length).padEnd(8)}| ${status}`);
  });
}

main().catch(console.error);
