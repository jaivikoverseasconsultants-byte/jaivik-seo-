const puppeteer = require('puppeteer');
const fs = require('fs');
const SCRATCH = 'C:/Users/Harshita/AppData/Local/Temp/claude/C--Users-Harshita-jaivik-seo/6765f57f-1488-451a-8c73-7c5e71348a66/scratchpad';

async function crawlPage(browser, url, extractFn, label) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
  page.setDefaultNavigationTimeout(45000);
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 4000));
    const result = await extractFn(page);
    console.log(`[${label}] ${result.length} items found`);
    return result;
  } catch(e) {
    console.error(`[${label}] ERROR: ${e.message.slice(0,120)}`);
    return [];
  } finally {
    await page.close().catch(()=>{});
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  });

  // Uppsala — international masters search, scroll to load all
  const uppsalaLinks = await crawlPage(browser, 'https://www.uu.se/en/study/search?category=internationalMastersProgrammes', async (page) => {
    let prevCount = 0;
    for(let i = 0; i < 15; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 1500));
      await page.evaluate(() => {
        document.querySelectorAll('button, a').forEach(el => {
          const txt = (el.textContent || '').toLowerCase().trim();
          if(txt.includes('show more') || txt.includes('load more') || txt.includes('visa fler')) el.click();
        });
      });
      await new Promise(r => setTimeout(r, 1000));
      const count = await page.evaluate(() => document.querySelectorAll('a[href*="/en/study/programme/"]').length);
      if(count === prevCount && i > 2) break;
      prevCount = count;
    }
    const links = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href*="/en/study/programme/"]')].map(a=>a.href))]
    );
    console.log('[Uppsala] links found:', links.length, links.slice(0,3));
    return links;
  }, 'Uppsala');

  // VU Amsterdam — master programmes page
  const vuLinks = await crawlPage(browser, 'https://vu.nl/en/education/master/programmes', async (page) => {
    for(let i=0; i<5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));
    }
    const links = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href)
        .filter(u=>u.match(/vu\.nl\/en\/education\/master\/[a-z]/i) && !u.match(/programmes\/?$|#/i)))]
    );
    const titles = await page.evaluate(() =>
      [...document.querySelectorAll('h2,h3,h4')].map(el=>el.textContent.trim()).filter(t=>t.length>5).slice(0,20)
    );
    console.log('[VU] titles:', titles.slice(0,10));
    console.log('[VU] links sample:', links.slice(0,5));
    return links;
  }, 'VU Amsterdam');

  // HWU Dubai — programme search
  const hwuLinks = await crawlPage(browser, 'https://www.hw.ac.uk/dubai/search/programmes', async (page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 3000));
    const links = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href)
        .filter(u=>u.match(/hw\.ac\.uk\/(dubai|uk\/dubai)\//i) && u.length>60 && !u.match(/#|search\/programmes$|\/dubai\/?$/i)))]
    );
    const allLinks = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href))].filter(u=>u.length>40)
    );
    console.log('[HWU] all links (up to 20):', allLinks.slice(0,20));
    return links;
  }, 'HWU Dubai');

  // Hamburg — study programme listing
  const hamburgLinks = await crawlPage(browser, 'https://www.uni-hamburg.de/en/campuscenter/studienangebot.html', async (page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 3000));
    const courseLinks = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href)
        .filter(u=>u.match(/uni-hamburg\.de\/en\/campuscenter\/studienangebot\/.+\.html$/i)))]
    );
    const titles = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,li a')].map(el=>el.textContent.trim()).filter(t=>t.length>3 && t.length<100).slice(0,40)
    );
    console.log('[Hamburg] course page links:', courseLinks.length);
    console.log('[Hamburg] heading/li titles:', titles.slice(0,20));
    const allEn = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href)
        .filter(u=>u.match(/uni-hamburg\.de\/en\//i) && u.length>70 && !u.match(/#/)))]
    );
    console.log('[Hamburg] all long /en/ links:', allEn.slice(0,20));
    return [...new Set([...courseLinks, ...allEn])];
  }, 'Hamburg');

  await browser.close();

  const results = { uppsalaLinks, vuLinks, hwuLinks, hamburgLinks };
  fs.writeFileSync(SCRATCH+'/pup-results2.json', JSON.stringify(results, null, 2));
  console.log('\n=== SUMMARY ===');
  console.log('Uppsala:', uppsalaLinks.length);
  console.log('VU Amsterdam:', vuLinks.length);
  console.log('HWU Dubai:', hwuLinks.length);
  console.log('Hamburg:', hamburgLinks.length);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
