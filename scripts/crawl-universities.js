const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'crawl-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const universities = [
  {
    slug: 'university-of-manchester',
    url: 'https://www.manchester.ac.uk/study/masters/courses/list/',
    country: 'UK',
    level: 'Masters',
  },
  {
    slug: 'university-of-edinburgh',
    url: 'https://www.ed.ac.uk/studying/postgraduate/degrees/index.php?r=site/search&programme_type=pg_taught&limit=200',
    country: 'UK',
    level: 'Masters',
    extraWait: 8000,
  },
  {
    slug: 'university-of-melbourne',
    url: 'https://study.unimelb.edu.au/find/courses/graduate/master-of-arts/',
    country: 'Australia',
    level: 'Graduate',
  },
  {
    slug: 'mcmaster-university',
    url: 'https://gs.mcmaster.ca/programs/',
    country: 'Canada',
    level: 'Graduate',
    mcmasterMode: true,
  },
];

async function extractCourses(page) {
  return page.evaluate(() => {
    const courses = [];
    const seen = new Set();

    const mainEl =
      document.querySelector('main, #main, #content, [role="main"]') ||
      document.body;

    // Ordered from most-specific to most-generic
    const selectors = [
      // Manchester / generic UK university result lists
      '.search-result h3 a', '.search-result h2 a',
      '.search-result__title a', '.search-result__heading a',
      // Programme/course cards
      '.course-item h3 a', '.course-card h3 a', '.course-card h2 a',
      '.programme-item h3 a', '.programme-item a',
      '.programme__title a', '.programme-title a',
      // Edinburgh
      'li.result a', 'li.result h3 a',
      'td.result-title a', '.result-title a',
      // Container-based
      '[class*="result"] h3 a', '[class*="course"] h3 a',
      '[class*="programme"] h3 a', '[class*="program"] h3 a',
      // Heading links
      '.results h3 a', '#results h3 a',
      'h3.course-title a', 'h3.programme-title a',
      // Melbourne
      '.course-search-result a', '.search-course-result a',
      // McMaster
      '.program-list a', '.program-item a',
      // Broad fallback — h3/h4 inside main that link to /course or /programme
      'h3 a[href*="course"]', 'h3 a[href*="programme"]',
      'h3 a[href*="program"]', 'h4 a[href*="course"]',
      'h4 a[href*="programme"]', 'h4 a[href*="program"]',
    ];

    for (const sel of selectors) {
      try {
        mainEl.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
          const href = a.href || '';
          if (name.length > 8 && name.length < 150 && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            courses.push({ name, url: href });
          }
        });
      } catch (_) {}
    }

    // Diagnostic: page headings
    const headings = [];
    mainEl.querySelectorAll('h1,h2,h3,h4').forEach(h => {
      const t = (h.textContent || '').trim().replace(/\s+/g, ' ');
      if (t.length > 3) headings.push(`${h.tagName}: ${t.substring(0, 100)}`);
    });

    // Fallback: any link whose text contains a recognisable degree abbreviation
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MD\b|PhD|PgDip|PgCert|BEng|BSc|BA\b|LLB|BPharm)\b/;
    if (courses.length < 10) {
      mainEl.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        const href = a.href || '';
        if (
          name.length > 8 && name.length < 150 &&
          degreePat.test(name) &&
          !seen.has(name.toLowerCase())
        ) {
          seen.add(name.toLowerCase());
          courses.push({ name, url: href });
        }
      });
    }

    // Diagnostic: all main-content links when we still found nothing
    const diagLinks = [];
    if (courses.length < 5) {
      mainEl.querySelectorAll('a').forEach(a => {
        const name = (a.textContent || '').trim().replace(/\s+/g, ' ');
        const href = a.href || '';
        if (name.length > 8 && name.length < 120 && diagLinks.length < 40) {
          diagLinks.push({ name: name.substring(0, 80), url: href.substring(0, 120) });
        }
      });
    }

    return { coursesFound: courses.length, courses: courses.slice(0, 400), headings: headings.slice(0, 20), diagLinks };
  });
}

async function crawlUniversity(uni) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setViewport({ width: 1280, height: 900 });

  let data = { coursesFound: 0, courses: [], headings: [], diagLinks: [] };

  try {
    await page.goto(uni.url, { waitUntil: 'networkidle2', timeout: 30000 });
    const wait = uni.extraWait || 5000;
    await new Promise(r => setTimeout(r, wait));

    if (uni.mcmasterMode) {
      data = await page.evaluate(() => {
        const courses = [];
        const seen = new Set();
        // McMaster: each programme is a card with h3 (subject area), h4 (degree), and an <a>
        document.querySelectorAll('.views-row, .program-item, article, .views-field').forEach(card => {
          const link = card.querySelector('a');
          const h3 = card.querySelector('h3');
          const h4 = card.querySelector('h4');
          if (link && (h3 || h4)) {
            const area = h3 ? h3.textContent.trim() : '';
            const degree = h4 ? h4.textContent.trim() : '';
            const name = [area, degree].filter(Boolean).join(' — ');
            const href = link.href || '';
            if (name.length > 5 && !seen.has(name)) {
              seen.add(name);
              courses.push({ name, url: href });
            }
          }
        });
        const headings = [];
        document.querySelectorAll('h1,h2').forEach(h => headings.push(h.textContent.trim().substring(0, 100)));
        return { coursesFound: courses.length, courses, headings, diagLinks: [] };
      });
    } else {
      data = await extractCourses(page);
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message.substring(0, 100)}`);
  }

  await browser.close();

  console.log(`\n=== ${uni.slug} (${uni.country}) ===`);
  console.log(`URL : ${uni.url}`);
  console.log(`Hits: ${data.coursesFound}`);

  if (data.headings.length) {
    console.log('Page headings (first 6):');
    data.headings.slice(0, 6).forEach(h => console.log(`  ${h}`));
  }

  if (data.courses.length) {
    console.log(`\nTop ${Math.min(15, data.courses.length)} courses:`);
    data.courses.slice(0, 15).forEach((c, i) => console.log(`  ${i + 1}. ${c.name}`));
  } else if (data.diagLinks.length) {
    console.log('\nDiagnostic — all links in main content:');
    data.diagLinks.slice(0, 15).forEach(l => console.log(`  - ${l.name}`));
  }

  fs.writeFileSync(
    path.join(outDir, `${uni.slug}.json`),
    JSON.stringify({ ...uni, ...data, crawledAt: new Date().toISOString() }, null, 2)
  );

  return data;
}

async function main() {
  console.log('=== University Course Crawler v2 ===\n');

  for (const uni of universities) {
    try {
      await crawlUniversity(uni);
    } catch (e) {
      console.log(`\n${uni.slug}: FAILED — ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n\nDone. JSON files saved to scripts/crawl-output/');
}

main();
