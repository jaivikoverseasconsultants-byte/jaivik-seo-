// Targeted crawl for Edinburgh (correct domain) + Melbourne (correct URL) + Toronto (calendar)
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
        if (['accept all', 'accept cookies', 'i agree', 'allow all', 'accept', 'ok', 'got it'].includes(t)) {
          el.click(); return;
        }
      }
    });
  } catch (_) {}
  for (const sel of ['#onetrust-accept-btn-handler', '.cc-accept', 'button[id*="accept"]', '[data-cc-action="accept"]']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  await wait(1500);
}

async function degreeExtract(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MNurs)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, #main, #content, [role="main"]') || document.body;

    for (const sel of [
      '.programme-listing a', '.programme-list a', '.programme-list li a',
      '.search-result h3 a', '.result-item h3 a', '.programme-title a',
      'li.programme a', '[class*="programme"] a',
      'h3 a[href*="programme"]', 'h3 a[href*="course"]',
      'td a', 'li a',
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
      if (t.length > 3 && headings.length < 10) headings.push(`${h.tagName}: ${t.substring(0,90)}`);
    });

    const diagLinks = [];
    if (courses.length < 5) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 5 && diagLinks.length < 20)
          diagLinks.push(`${name.substring(0,60)} -> ${(a.href||'').substring(0,70)}`);
      });
    }

    return { courses: courses.slice(0, 400), headings, diagLinks };
  });
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const targets = [
    {
      slug: 'university-of-edinburgh',
      // Edinburgh moved their programme listing to study.ed.ac.uk
      url: 'https://study.ed.ac.uk/programmes/postgraduate-taught-a-z',
      wait: 8000,
    },
    {
      slug: 'university-of-melbourne',
      url: 'https://study.unimelb.edu.au/study-with-us/graduate-courses',
      wait: 7000,
    },
    {
      slug: 'university-of-toronto',
      // SGS calendar A-Z has all graduate programs
      url: 'https://sgs.calendar.utoronto.ca/graduate-programs-at-a-glance',
      wait: 6000,
    },
  ];

  for (const t of targets) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    console.log(`\n=== ${t.slug} ===`);
    console.log(`URL: ${t.url}`);

    try {
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 35000 });
      await dismissCookies(page);
      await wait(t.wait);

      const data = await degreeExtract(page);
      console.log(`Hits: ${data.courses.length}`);
      data.headings.slice(0, 4).forEach(h => console.log(' ', h));
      if (data.courses.length > 0) {
        data.courses.slice(0, 8).forEach((c, i) => console.log(`  ${i+1}. ${c.name}`));
      } else if (data.diagLinks.length) {
        console.log('Diagnostic links:');
        data.diagLinks.slice(0, 8).forEach(l => console.log(' ', l));
      }

      fs.writeFileSync(
        path.join(outDir, `${t.slug}.json`),
        JSON.stringify({ slug: t.slug, url: t.url, courses: data.courses, headings: data.headings, crawledAt: new Date().toISOString() }, null, 2)
      );
    } catch (e) {
      console.log(`FAILED: ${e.message.substring(0, 100)}`);
    }

    await page.close();
    await wait(2000);
  }

  await browser.close();
}

main().catch(console.error);
