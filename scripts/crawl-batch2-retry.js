// Targeted retry for KCL, ANU, McGill, Waterloo, Sydney, Monash
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
        if (['accept all','accept cookies','accept','ok','got it','allow all','i agree','close'].includes(t)) {
          el.click(); return;
        }
      }
    });
  } catch (_) {}
  for (const sel of ['#onetrust-accept-btn-handler','.cc-accept','button[id*="accept"]','[data-cc-action="accept"]','.cookie-btn']) {
    try { const b = await page.$(sel); if (b) { await b.click(); break; } } catch (_) {}
  }
  await wait(1200);
}

async function degreeAndHeadingExtract(page) {
  return page.evaluate(() => {
    const degreePat = /\b(MSc|MA\b|MBA|MPhil|MEng|MRes|LLM|MFA|MPH|MPA|MArch|MEd|MNurs|MChem|MPhys|MMath|MMus|MProf|MClinRes|MCD|MBChB|MSurg|MBiomed)\b/;
    const courses = [], seen = new Set();
    const root = document.querySelector('main,#main,#content,[role="main"]') || document.body;

    // Specific selectors first
    for (const sel of [
      '.search-result h3 a','.result-item h3 a','.course-item h3 a',
      '.programme-title a','[class*="programme"] h3 a','[class*="course"] h3 a',
      'li.result a','li.programme a',
      'h3 a[href*="programme"]','h3 a[href*="course"]','h3 a[href*="study"]',
      'table td:first-child a','tr td a',
    ]) {
      try {
        root.querySelectorAll(sel).forEach(a => {
          const name = (a.textContent||'').trim().replace(/\s+/g,' ');
          if (name.length>8&&!seen.has(name.toLowerCase())){
            seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
          }
        });
      } catch(_) {}
    }

    // Degree-suffix fallback
    if (courses.length<10) {
      root.querySelectorAll('a').forEach(a => {
        const name=(a.textContent||'').trim().replace(/\s+/g,' ');
        if (name.length>8&&name.length<150&&degreePat.test(name)&&!seen.has(name.toLowerCase())){
          seen.add(name.toLowerCase()); courses.push({name,url:a.href||''});
        }
      });
    }

    // h3/h4 heading extraction (for sites without degree suffixes in titles)
    if (courses.length<10) {
      root.querySelectorAll('h3,h4').forEach(h => {
        const parent = h.closest('li,article,.item,.card,[class*="program"],[class*="course"],[class*="result"]');
        const link = h.querySelector('a')||h.closest('a')||(parent&&parent.querySelector('a'));
        const name = h.textContent.trim().replace(/\s+/g,' ');
        if (name.length>5&&name.length<120&&!seen.has(name.toLowerCase())){
          seen.add(name.toLowerCase());
          courses.push({name,url:link?link.href:''});
        }
      });
    }

    const headings=[];
    root.querySelectorAll('h1,h2,h3').forEach(h=>{
      const t=(h.textContent||'').trim().replace(/\s+/g,' ');
      if(t.length>3&&headings.length<8) headings.push(`${h.tagName}: ${t.substring(0,90)}`);
    });

    const diagLinks=[];
    if(courses.length<5){
      root.querySelectorAll('a').forEach(a=>{
        const n=(a.textContent||'').trim().replace(/\s+/g,' ');
        if(n.length>5&&diagLinks.length<15)
          diagLinks.push(`${n.substring(0,55)} → ${(a.href||'').substring(0,65)}`);
      });
    }

    return {courses:courses.slice(0,500),headings,diagLinks};
  });
}

const targets = [
  {
    slug: 'kings-college-london',
    // Try KCL's course search with postgraduate filter or direct programme list
    urls: [
      'https://www.kcl.ac.uk/study/courses/postgraduate-taught-courses',
      'https://www.kcl.ac.uk/search/results?q=MSc&type=coursesPostgraduate',
      'https://www.kcl.ac.uk/study/postgraduate-taught',
    ],
    wait: 8000,
  },
  {
    slug: 'australian-national-university',
    // ANU Catalogue URL from their own diagnostic link
    urls: [
      'https://programsandcourses.anu.edu.au/Catalogue',
      'https://programsandcourses.anu.edu.au/catalog',
    ],
    wait: 7000,
  },
  {
    slug: 'mcgill-university',
    // McGill grad programs list page
    urls: [
      'https://www.mcgill.ca/gradapplicants/programs/list',
      'https://www.mcgill.ca/gradapplicants/programs/all',
      'https://www.mcgill.ca/gradapplicants/programs',
    ],
    wait: 6000,
  },
  {
    slug: 'university-of-waterloo',
    // Waterloo A-Z programs
    urls: [
      'https://uwaterloo.ca/future-students/programs/all',
      'https://uwaterloo.ca/future-students/programs/graduate',
      'https://uwaterloo.ca/future-students/programs',
    ],
    wait: 6000,
    scrollToLoad: true,
  },
  {
    slug: 'university-of-sydney',
    // Sydney postgraduate course list
    urls: [
      'https://www.sydney.edu.au/courses/search.html?search_type=course&level=postgraduate',
      'https://www.sydney.edu.au/study/find-a-course/postgraduate-courses.html',
      'https://www.sydney.edu.au/courses/search.html',
    ],
    wait: 8000,
  },
  {
    slug: 'monash-university',
    // Monash handbook has a course list
    urls: [
      'https://handbook.monash.edu/current/courses/',
      'https://www.monash.edu/study/courses/find-a-course?keywords=master',
    ],
    wait: 7000,
  },
  {
    slug: 'university-of-queensland',
    // UQ - bypass bot check with a different entry
    urls: [
      'https://www.uq.edu.au/study/programs.html#postgraduate',
      'https://my.uq.edu.au/programs-courses/browse.html?level=pg',
      'https://www.uq.edu.au/study/programs.html',
    ],
    wait: 8000,
  },
];

async function tryCrawl(browser, target) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({width:1280,height:900});

  let best = {courses:[],headings:[],diagLinks:[]};
  let bestUrl = target.urls[0];

  for (const url of target.urls) {
    try {
      console.log(`    Trying: ${url}`);
      await page.goto(url, {waitUntil:'networkidle2',timeout:30000});
      await dismissCookies(page);
      await wait(target.wait||5000);

      if (target.scrollToLoad) {
        // Scroll to trigger lazy-loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await wait(2000);
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(1000);
      }

      const d = await degreeAndHeadingExtract(page);
      console.log(`    Hits: ${d.courses.length}`);
      if (d.headings.length) console.log(`    Headings: ${d.headings.slice(0,2).join(' | ')}`);
      if (d.courses.length < 5 && d.diagLinks.length)
        d.diagLinks.slice(0,5).forEach(l => console.log(`    DIAG: ${l}`));

      if (d.courses.length > best.courses.length) { best = d; bestUrl = url; }
      if (best.courses.length >= 10) break;
    } catch (e) {
      console.log(`    Error: ${e.message.substring(0,80)}`);
    }
  }

  await page.close();
  return {...best, url: bestUrl};
}

async function main() {
  console.log('=== Batch-2 Retry Crawler ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });

  const summary = [];

  for (const target of targets) {
    console.log(`\nCrawling ${target.slug}...`);
    try {
      const r = await tryCrawl(browser, target);
      const status = r.courses.length>=20?'OK':r.courses.length>=5?'PARTIAL':'FAILED';
      console.log(`  Final: ${r.courses.length} courses [${status}]`);
      r.courses.slice(0,5).forEach((c,i)=>console.log(`    ${i+1}. ${c.name}`));

      fs.writeFileSync(
        path.join(outDir, `${target.slug}.json`),
        JSON.stringify({slug:target.slug,url:r.url,courses:r.courses,headings:r.headings,crawledAt:new Date().toISOString()},null,2)
      );
      summary.push({slug:target.slug,count:r.courses.length,status});
    } catch(e) {
      console.log(`  FAILED: ${e.message}`);
      summary.push({slug:target.slug,count:0,status:'FAILED'});
    }
    await wait(2000);
  }

  await browser.close();

  console.log('\n\n=== SUMMARY ===');
  summary.forEach(s => console.log(`  ${s.slug.padEnd(42)} ${String(s.count).padEnd(6)} [${s.status}]`));
}

main().catch(console.error);
