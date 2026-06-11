// Retry crawl for Edinburgh, Melbourne, McMaster, Toronto, NUS with corrected URLs
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'crawl-output');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function dismissCookieBanner(page) {
  try {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('button, a')) {
        const t = (el.textContent || '').trim().toLowerCase();
        if (['accept all', 'accept cookies', 'i agree', 'allow all', 'accept', 'ok'].includes(t)) {
          el.click(); return;
        }
      }
    });
  } catch (_) {}
  // Try by selector
  for (const sel of ['#onetrust-accept-btn-handler', '.cc-accept', '[data-cc-action="accept"]', 'button[id*="accept"]', 'button[class*="accept"]']) {
    try {
      const btn = await page.$(sel);
      if (btn) { await btn.click(); break; }
    } catch (_) {}
  }
  await wait(1500);
}

async function extractWithDegreeFallback(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MNurs|MProf|MChem|MPhys|MMath|MMus)\b/;
    const courses = [];
    const seen = new Set();
    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    // Specific selectors
    for (const sel of [
      '.programme-listing li a', '.programme-list li a',
      '.search-result h3 a', '.result-item h3 a',
      '[class*="programme"] a', '[class*="program"] h3 a',
      'li.programme a', 'li.course a',
      'h3 a[href*="programme"]', 'h3 a[href*="course"]', 'h3 a[href*="degree"]',
      '.course-title a', '.programme-title a',
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

    const headings = [];
    root.querySelectorAll('h1,h2,h3').forEach(h => {
      const t = (h.textContent || '').trim().replace(/\s+/g, ' ');
      if (t.length > 3 && headings.length < 12) headings.push(`${h.tagName}: ${t.substring(0, 90)}`);
    });

    // All links diagnostic when sparse
    const diagLinks = [];
    if (courses.length < 5) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 8 && name.length < 100 && diagLinks.length < 20)
          diagLinks.push(`${name} -> ${(a.href || '').substring(0, 70)}`);
      });
    }

    return { courses: courses.slice(0, 400), headings, diagLinks };
  });
}

const universities = [
  {
    slug: 'university-of-edinburgh',
    urls: [
      // Yii framework - try different routes for the programme listing
      'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/search&programme_type=pg_taught',
      'https://www.ed.ac.uk/studying/postgraduate/degrees',
    ],
    extraWait: 8000,
  },
  {
    slug: 'university-of-melbourne',
    urls: [
      'https://www.unimelb.edu.au/courses/find-a-course/postgraduate-coursework',
      'https://study.unimelb.edu.au/find/courses/',
      'https://www.unimelb.edu.au/study',
    ],
    extraWait: 5000,
  },
  {
    slug: 'mcmaster-university',
    urls: [
      'https://future.mcmaster.ca/academics/programs/',
      'https://gs.mcmaster.ca/programs/',
    ],
    extraWait: 6000,
    mcmasterMode: true,
  },
  {
    slug: 'university-of-toronto',
    urls: [
      'https://www.sgs.utoronto.ca/programs/',
      'https://future.utoronto.ca/academics/programs/',
      'https://www.utoronto.ca/academics/programs-and-courses',
    ],
    extraWait: 5000,
  },
  {
    slug: 'national-university-of-singapore',
    urls: [
      'https://www.nus.edu.sg/admissions/graduate-programme/coursework-programmes',
      'https://www.nus.edu.sg/admissions/graduate-programme',
      'https://www.nus.edu.sg/registrar/academic-information-and-services/graduate-students',
    ],
    extraWait: 6000,
  },
];

async function tryCrawl(page, uni) {
  for (const url of uni.urls) {
    try {
      console.log(`    Trying: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await dismissCookieBanner(page);
      await wait(uni.extraWait || 5000);

      let data;
      if (uni.mcmasterMode) {
        data = await page.evaluate(() => {
          const courses = [];
          const seen = new Set();
          // Cards where h3 is the programme name
          document.querySelectorAll('article, .card, li, .item, [class*="program"]').forEach(card => {
            const h = card.querySelector('h2, h3, h4, .title, [class*="title"]');
            const link = card.querySelector('a') || (card.parentElement && card.parentElement.querySelector('a'));
            if (h && link) {
              const name = h.textContent.trim().replace(/\s+/g, ' ');
              const href = link.href || '';
              if (name.length > 4 && name.length < 120 && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase()); courses.push({ name, url: href });
              }
            }
          });
          // Also try plain h3 in main
          if (courses.length < 5) {
            const root = document.querySelector('main, #main, [role="main"]') || document.body;
            root.querySelectorAll('h3, h4').forEach(h => {
              const name = h.textContent.trim().replace(/\s+/g, ' ');
              const link = h.querySelector('a') || h.closest('a') || (h.parentElement && h.parentElement.querySelector('a'));
              if (name.length > 4 && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                courses.push({ name, url: link ? link.href : '' });
              }
            });
          }
          const headings = [];
          document.querySelectorAll('h1,h2,h3').forEach(h => {
            const t = h.textContent.trim().replace(/\s+/g, ' ');
            if (t.length > 3 && headings.length < 10) headings.push(`${h.tagName}: ${t.substring(0, 80)}`);
          });
          return { courses: courses.slice(0, 300), headings, diagLinks: [] };
        });
      } else {
        data = await extractWithDegreeFallback(page);
      }

      if (data.courses.length >= 5) {
        return { ...data, url };
      }
      // Print diagnostic for failed attempts
      if (data.headings.length) console.log(`    Headings: ${data.headings.slice(0,2).join(' | ')}`);
      if (data.diagLinks && data.diagLinks.length) console.log(`    Links: ${data.diagLinks.slice(0,3).join(', ')}`);
    } catch (e) {
      console.log(`    Error: ${e.message.substring(0, 80)}`);
    }
  }
  return { courses: [], headings: [], diagLinks: [], url: uni.urls[0] };
}

async function main() {
  console.log('=== Retry Crawler ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const summary = [];

  for (const uni of universities) {
    console.log(`\nCrawling ${uni.slug}...`);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    try {
      const result = await tryCrawl(page, uni);
      const status = result.courses.length >= 10 ? 'OK' : result.courses.length > 0 ? 'PARTIAL' : 'FAILED';
      console.log(`  Result: ${result.courses.length} courses [${status}]`);
      if (result.courses.length > 0) {
        result.courses.slice(0, 5).forEach((c, i) => console.log(`    ${i+1}. ${c.name}`));
      }

      fs.writeFileSync(
        path.join(outDir, `${uni.slug}.json`),
        JSON.stringify({
          slug: uni.slug,
          url: result.url,
          courses: result.courses,
          headings: result.headings,
          crawledAt: new Date().toISOString(),
        }, null, 2)
      );

      summary.push({ slug: uni.slug, count: result.courses.length, status });
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
      summary.push({ slug: uni.slug, count: 0, status: 'FAILED' });
    }

    await page.close();
    await wait(2000);
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  summary.forEach(s => console.log(`  ${s.slug}: ${s.count} courses [${s.status}]`));
}

main().catch(console.error);
