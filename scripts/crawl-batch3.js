// Batch 3 crawl — 8 universities with specific A-Z/listing URLs
// Proven degree-suffix pattern + static list extraction
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
        if (['accept all', 'accept cookies', 'accept', 'ok', 'got it', 'allow all', 'i agree', 'close', 'accept & close'].includes(t)) {
          el.click(); return;
        }
      }
    });
  } catch (_) {}
  for (const sel of ['#onetrust-accept-btn-handler', '.cc-accept', 'button[id*="accept"]', '[data-cc-action="accept"]', '.cookie-btn', '#acceptAllCookies', 'button[aria-label*="Accept"]']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  await wait(1000);
}

async function extractCourses(page, uniSlug) {
  return page.evaluate((slug) => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MChem|MMath|MPhys|MMus|MNurs|MTech|MClinRes)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    // Try specific known selectors first
    const specificSelectors = [
      // A-Z list pages: usually <li><a>Course Name MSc</a></li>
      '.az-list a', '.a-z-list a', '[class*="az"] a', '[class*="a-z"] a',
      // Course cards / programme items
      '.programme-item a', '.course-item a', '.programme-card a', '.course-card a',
      '.programme__title a', '.course__title a',
      '.programme-title a', '.course-title a',
      // Result lists
      '.search-result a', '.search-result h3 a', '.result-item a',
      // Table-based (Glasgow, Birmingham often use tables)
      'table td a', 'table tr td:first-child a',
      // List items with links
      'ul.courses li a', 'ol.courses li a',
      '.courses-list li a', '.programme-list li a',
      // Generic heading links
      'h3 a', 'h4 a',
    ];

    for (const sel of specificSelectors) {
      try {
        root.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
          if (name.length > 8 && name.length < 150 && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
          }
        });
      } catch (_) {}
    }

    // Degree-suffix fallback — proven to work for UK universities
    if (courses.length < 10) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 8 && name.length < 150 && degreePat.test(name) && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
        }
      });
    }

    const headings = [];
    root.querySelectorAll('h1, h2, h3').forEach(h => {
      const t = (h.textContent || '').trim().replace(/\s+/g, ' ');
      if (t.length > 3 && headings.length < 8) headings.push(`${h.tagName}: ${t.substring(0, 90)}`);
    });

    const diagLinks = [];
    if (courses.length < 5) {
      root.querySelectorAll('a').forEach(a => {
        const n = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (n.length > 5 && diagLinks.length < 20)
          diagLinks.push(`${n.substring(0, 60)} → ${(a.href || '').substring(0, 80)}`);
      });
    }

    return { courses: courses.slice(0, 500), headings, diagLinks };
  }, uniSlug);
}

const TARGETS = [
  {
    slug: 'kings-college-london',
    urls: [
      'https://www.kcl.ac.uk/study/postgraduate/taught-courses/a-z',
      'https://www.kcl.ac.uk/study/postgraduate-taught',
    ],
    extraWait: 8000,
  },
  {
    slug: 'imperial-college-london',
    urls: [
      'https://www.imperial.ac.uk/study/courses/postgraduate/courses-a-z/',
      'https://www.imperial.ac.uk/study/courses/postgraduate/',
    ],
    extraWait: 8000,
  },
  {
    slug: 'university-of-glasgow',
    urls: [
      'https://www.gla.ac.uk/postgraduate/taught/a-z/',
      'https://www.gla.ac.uk/postgraduate/taught/',
    ],
    extraWait: 6000,
  },
  {
    slug: 'university-of-birmingham',
    urls: [
      'https://www.birmingham.ac.uk/postgraduate/courses',
      'https://www.birmingham.ac.uk/study/postgraduate/courses',
    ],
    extraWait: 8000,
    scrollToLoad: true,
  },
  {
    slug: 'mcgill-university',
    urls: [
      'https://www.mcgill.ca/study/2025-2026/programs',
      'https://www.mcgill.ca/gradapplicants/programs/az',
      'https://www.mcgill.ca/gradapplicants/programs',
    ],
    extraWait: 7000,
  },
  {
    slug: 'university-of-waterloo',
    urls: [
      'https://uwaterloo.ca/future-grad-students/programs',
      'https://uwaterloo.ca/future-students/programs',
      'https://uwaterloo.ca/graduate-studies-postdoctoral-affairs/future-students/programs',
    ],
    extraWait: 7000,
    scrollToLoad: true,
  },
  {
    slug: 'monash-university',
    urls: [
      'https://www.monash.edu/study/courses/find-a-course?keywords=master',
      'https://handbook.monash.edu/current/courses?types=postgraduate',
      'https://www.monash.edu/study/courses/find-a-course',
    ],
    extraWait: 10000,
    scrollToLoad: true,
  },
  {
    slug: 'university-of-sydney',
    urls: [
      'https://www.sydney.edu.au/courses/courses-by-area-of-study.html',
      'https://www.sydney.edu.au/courses/search.html?search_type=course&level=postgraduate-coursework',
      'https://www.sydney.edu.au/study/find-a-course/postgraduate-courses.html',
    ],
    extraWait: 8000,
    scrollToLoad: true,
  },
];

async function crawl(browser, target) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  let best = { courses: [], headings: [], diagLinks: [] };
  let bestUrl = target.urls[0];

  for (const url of target.urls) {
    console.log(`  Trying: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 35000 });
      await dismissCookies(page);
      await wait(target.extraWait || 5000);

      if (target.scrollToLoad) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await wait(2000);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await wait(2000);
      }

      const d = await extractCourses(page, target.slug);
      console.log(`  Hits: ${d.courses.length} | Headings: ${d.headings.slice(0, 2).join(' | ')}`);
      if (d.courses.length < 5) d.diagLinks.slice(0, 5).forEach(l => console.log(`  DIAG: ${l}`));

      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 20) break;
    } catch (e) {
      console.log(`  Error: ${e.message.substring(0, 80)}`);
    }
  }

  await page.close();
  return { ...best, url: bestUrl };
}

async function main() {
  console.log('=== Batch 3 Crawler ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  const summary = [];

  for (const target of TARGETS) {
    console.log(`\n[${target.slug}]`);
    try {
      const r = await crawl(browser, target);
      const status = r.courses.length >= 30 ? 'OK' : r.courses.length >= 10 ? 'PARTIAL' : 'FAILED';
      console.log(`  → ${r.courses.length} courses [${status}] from ${r.url}`);
      r.courses.slice(0, 6).forEach((c, i) => console.log(`     ${i + 1}. ${c.name}`));

      fs.writeFileSync(
        path.join(outDir, `${target.slug}.json`),
        JSON.stringify({ slug: target.slug, url: r.url, courses: r.courses, headings: r.headings, crawledAt: new Date().toISOString() }, null, 2)
      );
      summary.push({ slug: target.slug, count: r.courses.length, status });
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
      summary.push({ slug: target.slug, count: 0, status: 'FAILED' });
    }
    await wait(2000);
  }

  await browser.close();

  console.log('\n\n=== SUMMARY ===');
  summary.forEach(s => console.log(`  ${s.slug.padEnd(40)} ${String(s.count).padEnd(6)} [${s.status}]`));
}

main().catch(console.error);
