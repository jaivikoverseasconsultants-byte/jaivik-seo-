// Targeted crawl for Imperial and Birmingham
// Both show real courses but SPA needs longer wait + aggressive scroll
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, 'crawl-output');
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function dismissCookies(page) {
  for (const sel of ['#onetrust-accept-btn-handler', 'button[id*="accept"]', '.cc-accept']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  try {
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('button')) {
        const t = (el.textContent || '').trim().toLowerCase();
        if (['accept all', 'accept cookies', 'ok'].includes(t)) el.click();
      }
    });
  } catch (_) {}
  await wait(800);
}

// ── IMPERIAL ──────────────────────────────────────────────────────────────────
async function crawlImperial(page) {
  console.log('\n[Imperial College London]');
  await page.goto('https://www.imperial.ac.uk/study/courses/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await dismissCookies(page);
  await wait(8000);

  // Scroll multiple times to trigger lazy loading
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await wait(2500);
  }
  await wait(3000);

  const data = await page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|PhD|PGDip|PGCert)\b/i;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, [role="main"]') || document.body;

    // Try all heading-based links and anchors
    for (const sel of ['h3 a', 'h2 a', 'h4 a', '.course-title a', '[class*="course"] a', 'li a', 'article a']) {
      root.querySelectorAll(sel).forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 8 && name.length < 150 && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
        }
      });
    }

    // Degree-suffix fallback
    if (courses.length < 30) {
      root.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (name.length > 8 && name.length < 150 && degreePat.test(name) && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
        }
      });
    }

    const headings = [...document.querySelectorAll('h1,h2,h3')].slice(0, 6)
      .map(h => `${h.tagName}: ${h.textContent.trim().replace(/\s+/g, ' ').substring(0, 80)}`);

    const diagLinks = [];
    if (courses.length < 10) {
      root.querySelectorAll('a').forEach(a => {
        const n = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (n.length > 5 && diagLinks.length < 15)
          diagLinks.push(`${n.substring(0, 60)} → ${(a.href || '').substring(0, 80)}`);
      });
    }

    return { courses: courses.slice(0, 500), headings, diagLinks };
  });

  console.log(`  Hits: ${data.courses.length}`);
  data.headings.slice(0, 3).forEach(h => console.log(`  ${h}`));
  data.courses.slice(0, 8).forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
  if (data.courses.length < 5) data.diagLinks.forEach(l => console.log(`  DIAG: ${l}`));
  return data;
}

// ── BIRMINGHAM ────────────────────────────────────────────────────────────────
async function crawlBirmingham(page) {
  console.log('\n[University of Birmingham]');
  await page.goto('https://www.birmingham.ac.uk/postgraduate/courses', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await dismissCookies(page);
  await wait(15000); // Birmingham SPA needs long initial wait

  // Multiple scroll passes
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await wait(2000);
  }
  await wait(5000);

  const data = await page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MPH|MPA|MNurs)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main, [role="main"]') || document.body;

    // Birmingham uses h2 for each course card
    root.querySelectorAll('h2 a, h3 a, h4 a').forEach(a => {
      const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
      if (name.length > 8 && name.length < 150 && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
      }
    });

    // Also try all links with degree suffixes
    root.querySelectorAll('a').forEach(a => {
      const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
      if (name.length > 8 && name.length < 150 && degreePat.test(name) && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase()); courses.push({ name, url: a.href || '' });
      }
    });

    const headings = [...document.querySelectorAll('h1,h2')].slice(0, 6)
      .map(h => `${h.tagName}: ${h.textContent.trim().replace(/\s+/g, ' ').substring(0, 80)}`);

    const diagLinks = [];
    if (courses.length < 10) {
      root.querySelectorAll('a').forEach(a => {
        const n = (a.textContent || '').trim().replace(/\s+/g, ' ');
        if (n.length > 5 && diagLinks.length < 15)
          diagLinks.push(`${n.substring(0, 60)} → ${(a.href || '').substring(0, 80)}`);
      });
    }

    return { courses: courses.slice(0, 500), headings, diagLinks };
  });

  console.log(`  Hits: ${data.courses.length}`);
  data.headings.slice(0, 4).forEach(h => console.log(`  ${h}`));
  data.courses.slice(0, 8).forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
  if (data.courses.length < 5) data.diagLinks.forEach(l => console.log(`  DIAG: ${l}`));
  return data;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const targets = [
    { slug: 'imperial-college-london', crawlFn: crawlImperial },
    { slug: 'university-of-birmingham', crawlFn: crawlBirmingham },
  ];

  for (const { slug, crawlFn } of targets) {
    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1440, height: 1024 });

      const data = await crawlFn(page);
      await page.close();

      if (data.courses.length > 0) {
        const existing = (() => {
          try { return JSON.parse(fs.readFileSync(path.join(outDir, `${slug}.json`), 'utf8')); } catch { return { courses: [] }; }
        })();
        if (data.courses.length > existing.courses.length) {
          const url = slug === 'imperial-college-london'
            ? 'https://www.imperial.ac.uk/study/courses/'
            : 'https://www.birmingham.ac.uk/postgraduate/courses';
          fs.writeFileSync(path.join(outDir, `${slug}.json`),
            JSON.stringify({ slug, url, courses: data.courses, headings: data.headings, crawledAt: new Date().toISOString() }, null, 2));
          console.log(`  Saved: ${data.courses.length} (was ${existing.courses.length})`);
        } else {
          console.log(`  Not better: ${data.courses.length} vs existing ${existing.courses.length}`);
        }
      }
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
}

main().catch(console.error);
