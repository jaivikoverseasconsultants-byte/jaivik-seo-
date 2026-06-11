// Batch-2 crawler — Australia (5) + UK (2) + Canada (3)
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function dismissCookies(page) {
  try {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('button, a')) {
        const t = (el.textContent || '').trim().toLowerCase();
        if (['accept all', 'accept cookies', 'i agree', 'allow all', 'accept', 'ok', 'got it', 'close'].includes(t)) {
          el.click(); return;
        }
      }
    });
  } catch (_) {}
  for (const sel of ['#onetrust-accept-btn-handler', '.cc-accept', 'button[id*="accept"]', '[data-cc-action="accept"]', '.cookie-banner button', '#cookieConsent button']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  await wait(1000);
}

// Generic extraction: specific selectors → degree-suffix fallback → h3/h4 heading extraction
async function genericExtract(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MNurs|MChem|MPhys|MMath|MMus|MProf|MComp|MBio)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    for (const sel of [
      '.search-result h3 a', '.search-result h2 a',
      '.result-item h3 a', '.course-item h3 a',
      '.programme-title a', '[class*="programme"] h3 a',
      '[class*="course"] h3 a', '[class*="program"] h3 a',
      'li.result a', 'li.programme a', 'li.course a',
      'h3 a[href*="programme"]', 'h3 a[href*="course"]',
      'h3 a[href*="study"]', 'h3 a[href*="degree"]',
    ]) {
      try {
        root.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
          if (name.length > 8 && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
          }
        });
      } catch (_) {}
    }

    // Degree-suffix fallback
    if (courses.length < 10) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 8 && name.length < 150 && degreePat.test(name) && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
        }
      });
    }

    // Heading-based extraction (for AUS/CA where programs don't have degree in title)
    if (courses.length < 10) {
      root.querySelectorAll('h3, h4').forEach(h => {
        const parent = h.closest('li, article, .item, .card, [class*="program"], [class*="course"]');
        const link = h.querySelector('a') || h.closest('a') || (parent && parent.querySelector('a'));
        const name = h.textContent.trim().replace(/\s+/g, ' ');
        if (name.length > 5 && name.length < 120 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase());
          courses.push({ name, url: link ? link.href : '' });
        }
      });
    }

    const headings = [];
    root.querySelectorAll('h1,h2,h3').forEach(h => {
      const t = (h.textContent || '').trim().replace(/\s+/g, ' ');
      if (t.length > 3 && headings.length < 10) headings.push(`${h.tagName}: ${t.substring(0, 90)}`);
    });

    const diagLinks = [];
    if (courses.length < 5) {
      root.querySelectorAll('a').forEach(a => {
        const n = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (n.length > 5 && diagLinks.length < 20)
          diagLinks.push(`${n.substring(0, 60)} → ${(a.href || '').substring(0, 70)}`);
      });
    }

    return { courses: courses.slice(0, 500), headings, diagLinks };
  });
}

// ── per-university crawlers ──────────────────────────────────────────────────

async function crawlKCL(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.kcl.ac.uk/study/postgraduate-taught', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(5000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'kings-college-london', url: 'https://www.kcl.ac.uk/study/postgraduate-taught', country: 'UK', ...data };
}

async function crawlWarwick(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://warwick.ac.uk/study/postgraduate/taught/', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(5000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-of-warwick', url: 'https://warwick.ac.uk/study/postgraduate/taught/', country: 'UK', ...data };
}

async function crawlMelbourne(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  // Try the correct URL for Melbourne's graduate course finder
  const urls = [
    'https://study.unimelb.edu.au/find/courses/graduate',
    'https://study.unimelb.edu.au/find/?collection=find-a-course&profile=_default&query=%21null&f.Level%7CstudyLevel=graduate',
    'https://www.unimelb.edu.au/courses/find-a-course/postgraduate-coursework',
  ];
  let best = { courses: [], headings: [], diagLinks: [] };
  let bestUrl = urls[0];
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await dismissCookies(page);
      await wait(6000);
      const d = await genericExtract(page);
      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 10) break;
    } catch (_) {}
  }
  await page.close();
  return { slug: 'university-of-melbourne', url: bestUrl, country: 'Australia', ...best };
}

async function crawlSydney(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  const urls = [
    // Sydney's course finder A-Z for postgraduate
    'https://www.sydney.edu.au/courses/search.html?search_type=course&study_level=postgraduate',
    'https://www.sydney.edu.au/study/find-a-course/postgraduate-courses.html',
    'https://www.sydney.edu.au/courses/search.html',
  ];
  let best = { courses: [], headings: [], diagLinks: [] };
  let bestUrl = urls[0];
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await dismissCookies(page);
      await wait(7000);
      const d = await genericExtract(page);
      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 10) break;
    } catch (_) {}
  }
  await page.close();
  return { slug: 'university-of-sydney', url: bestUrl, country: 'Australia', ...best };
}

async function crawlANU(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://programsandcourses.anu.edu.au/programs', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(6000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'australian-national-university', url: 'https://programsandcourses.anu.edu.au/programs', country: 'Australia', ...data };
}

async function crawlMonash(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  const urls = [
    'https://www.monash.edu/study/courses/find-a-course/postgraduate',
    'https://www.monash.edu/study/courses/find-a-course',
  ];
  let best = { courses: [], headings: [], diagLinks: [] };
  let bestUrl = urls[0];
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await dismissCookies(page);
      await wait(7000);
      const d = await genericExtract(page);
      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 10) break;
    } catch (_) {}
  }
  await page.close();
  return { slug: 'monash-university', url: bestUrl, country: 'Australia', ...best };
}

async function crawlUQ(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.uq.edu.au/study/programs.html', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(6000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-of-queensland', url: 'https://www.uq.edu.au/study/programs.html', country: 'Australia', ...data };
}

async function crawlUBC(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.grad.ubc.ca/prospective-students/graduate-degree-programs', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(5000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-of-british-columbia', url: 'https://www.grad.ubc.ca/prospective-students/graduate-degree-programs', country: 'Canada', ...data };
}

async function crawlMcGill(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.mcgill.ca/gradapplicants/programs', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(5000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'mcgill-university', url: 'https://www.mcgill.ca/gradapplicants/programs', country: 'Canada', ...data };
}

async function crawlWaterloo(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://uwaterloo.ca/future-students/programs', { waitUntil: 'networkidle2', timeout: 35000 });
  await dismissCookies(page);
  await wait(5000);
  const data = await genericExtract(page);
  await page.close();
  return { slug: 'university-of-waterloo', url: 'https://uwaterloo.ca/future-students/programs', country: 'Canada', ...data };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Batch-2 University Crawler ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const crawlers = [
    { name: 'KCL', fn: crawlKCL },
    { name: 'Warwick', fn: crawlWarwick },
    { name: 'Melbourne', fn: crawlMelbourne },
    { name: 'Sydney', fn: crawlSydney },
    { name: 'ANU', fn: crawlANU },
    { name: 'Monash', fn: crawlMonash },
    { name: 'UQ', fn: crawlUQ },
    { name: 'UBC', fn: crawlUBC },
    { name: 'McGill', fn: crawlMcGill },
    { name: 'Waterloo', fn: crawlWaterloo },
  ];

  const summary = [];

  for (const { name, fn } of crawlers) {
    console.log(`\nCrawling ${name}...`);
    try {
      const r = await fn(browser);
      const status = r.courses.length >= 20 ? 'OK' : r.courses.length >= 5 ? 'PARTIAL' : 'FAILED';
      console.log(`  Hits: ${r.courses.length} [${status}]`);
      r.headings.slice(0, 3).forEach(h => console.log(`  ${h}`));
      r.courses.slice(0, 6).forEach((c, i) => console.log(`    ${i+1}. ${c.name}`));
      if (r.diagLinks && r.diagLinks.length && r.courses.length < 5) {
        r.diagLinks.slice(0, 5).forEach(l => console.log(`  DIAG: ${l}`));
      }
      fs.writeFileSync(
        path.join(outDir, `${r.slug}.json`),
        JSON.stringify({ slug: r.slug, url: r.url, courses: r.courses, headings: r.headings, crawledAt: new Date().toISOString() }, null, 2)
      );
      summary.push({ slug: r.slug, count: r.courses.length, status });
    } catch (e) {
      console.log(`  FAILED: ${e.message.substring(0, 100)}`);
      summary.push({ slug: name, count: 0, status: 'FAILED' });
    }
    await wait(2000);
  }

  await browser.close();

  console.log('\n\n=== SUMMARY ===');
  summary.forEach(s => console.log(`  ${s.slug.padEnd(40)} ${String(s.count).padEnd(6)} [${s.status}]`));
}

main().catch(console.error);
