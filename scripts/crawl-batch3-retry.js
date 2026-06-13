// Retry crawl for KCL, Imperial, Birmingham, McGill, Monash, Sydney
// with better URLs and extraction strategies
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'crawl-output');
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
  for (const sel of ['#onetrust-accept-btn-handler', '.cc-accept', 'button[id*="accept"]', '[data-cc-action="accept"]', '#cookie-accept']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  await wait(800);
}

const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MChem|MMath|MPhys|MMus|MNurs|MTech)\b/;

async function extractAll(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MChem|MMath|MPhys|MMus|MTech)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    // Specific selectors
    for (const sel of [
      'h3 a', 'h4 a',
      '.course-title a', '.programme-title a',
      '[class*="course"] a', '[class*="programme"] a',
      'table td a', 'li a',
      '.search-result a', '.result a',
    ]) {
      try {
        root.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
          if (name.length > 8 && name.length < 150 && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
          }
        });
      } catch (_) {}
    }

    // Degree suffix fallback
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
      if (t && headings.length < 6) headings.push(`${h.tagName}: ${t.substring(0, 80)}`);
    });

    const diagLinks = [];
    if (courses.length < 5) {
      root.querySelectorAll('a').forEach(a => {
        const n = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (n.length > 5 && diagLinks.length < 15)
          diagLinks.push(`${n.substring(0, 60)} → ${(a.href || '').substring(0, 80)}`);
      });
    }

    return { courses: courses.slice(0, 500), headings, diagLinks };
  });
}

const TARGETS = [
  {
    slug: 'kings-college-london',
    urls: [
      // KCL renders courses via JS after search — try the search API directly
      'https://www.kcl.ac.uk/study/postgraduate-taught?page=1',
      'https://www.kcl.ac.uk/study/postgraduate/taught-courses',
      'https://www.kcl.ac.uk/study/postgraduate',
    ],
    extraWait: 12000,
    scrollToLoad: true,
    postScrollWait: 3000,
  },
  {
    slug: 'imperial-college-london',
    urls: [
      'https://www.imperial.ac.uk/study/courses/',
      'https://www.imperial.ac.uk/computing/prospective-students/pg/',
      'https://www.imperial.ac.uk/business-school/programmes/mba/',
    ],
    extraWait: 10000,
    scrollToLoad: true,
  },
  {
    slug: 'university-of-birmingham',
    urls: [
      // Birmingham's search SPA — try with hash parameters
      'https://www.birmingham.ac.uk/postgraduate/courses#/search?query=&page=1&pageSize=100',
      'https://www.birmingham.ac.uk/postgraduate/courses',
      'https://www.birmingham.ac.uk/search?q=MSc+Masters&content_type=course',
    ],
    extraWait: 15000,
    scrollToLoad: true,
    postScrollWait: 5000,
  },
  {
    slug: 'mcgill-university',
    urls: [
      // McGill has a program finder with accessible data
      'https://www.mcgill.ca/gradapplicants/programs/list',
      'https://www.mcgill.ca/aps/programs',
      'https://www.mcgill.ca/gradapplicants/programs',
    ],
    extraWait: 8000,
    scrollToLoad: true,
  },
  {
    slug: 'monash-university',
    urls: [
      // Monash handbook has a course list that's static
      'https://handbook.monash.edu/current/courses?types=postgraduate&layout=list',
      'https://www.monash.edu/study/courses/find-a-course/2024/all?collection=monash-courses-meta&keyword=master&clive=monash-course-tabs-postgraduate',
      'https://www.monash.edu/study/courses/find-a-course/2025/all',
    ],
    extraWait: 12000,
    scrollToLoad: true,
    postScrollWait: 4000,
  },
  {
    slug: 'university-of-sydney',
    urls: [
      // Sydney's course search — try with different params
      'https://www.sydney.edu.au/courses/search.html?search_type=course&level=postgraduate-coursework&faculty=all',
      'https://www.sydney.edu.au/courses/',
      'https://www.sydney.edu.au/handbooks/2025/postgraduate/',
    ],
    extraWait: 10000,
    scrollToLoad: true,
  },
];

async function crawl(browser, target) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 1024 });

  let best = { courses: [], headings: [], diagLinks: [] };
  let bestUrl = target.urls[0];

  for (const url of target.urls) {
    console.log(`  Trying: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await dismissCookies(page);
      await wait(target.extraWait || 8000);

      if (target.scrollToLoad) {
        for (let i = 0; i < 3; i++) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await wait(2000);
        }
        if (target.postScrollWait) await wait(target.postScrollWait);
      }

      const d = await extractAll(page);
      console.log(`  Hits: ${d.courses.length}`);
      d.headings.slice(0, 3).forEach(h => console.log(`    ${h}`));
      if (d.courses.length < 5) d.diagLinks.slice(0, 6).forEach(l => console.log(`    DIAG: ${l}`));
      else d.courses.slice(0, 4).forEach((c, i) => console.log(`    ${i + 1}. ${c.name}`));

      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 20) break;
    } catch (e) {
      console.log(`  Error: ${e.message.substring(0, 80)}`);
    }
    await wait(1500);
  }

  await page.close();
  return { ...best, url: bestUrl };
}

async function main() {
  console.log('=== Batch 3 Retry ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const summary = [];

  for (const target of TARGETS) {
    console.log(`\n[${target.slug}]`);
    try {
      const r = await crawl(browser, target);
      const status = r.courses.length >= 30 ? 'OK' : r.courses.length >= 10 ? 'PARTIAL' : 'FAILED';
      console.log(`\n  → ${r.courses.length} courses [${status}]`);
      summary.push({ slug: target.slug, count: r.courses.length, status, url: r.url });

      if (r.courses.length > 0) {
        const existing = JSON.parse(fs.readFileSync(path.join(outDir, `${target.slug}.json`), 'utf8').replace(/^\s*$/, '{}') || '{}');
        if (r.courses.length > (existing.courses || []).length) {
          fs.writeFileSync(path.join(outDir, `${target.slug}.json`),
            JSON.stringify({ slug: target.slug, url: r.url, courses: r.courses, headings: r.headings, crawledAt: new Date().toISOString() }, null, 2));
          console.log(`  Saved (${r.courses.length} > ${(existing.courses || []).length})`);
        }
      }
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
      summary.push({ slug: target.slug, count: 0, status: 'FAILED', url: '' });
    }
    await wait(2000);
  }

  await browser.close();
  console.log('\n=== RETRY SUMMARY ===');
  summary.forEach(s => console.log(`  ${s.slug.padEnd(40)} ${String(s.count).padEnd(6)} [${s.status}]`));
}

main().catch(console.error);
