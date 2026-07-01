const puppeteer = require('puppeteer');
const fs = require('fs');
const SCRATCH = 'C:/Users/Harshita/AppData/Local/Temp/claude/C--Users-Harshita-jaivik-seo/6765f57f-1488-451a-8c73-7c5e71348a66/scratchpad';

async function crawlPage(browser, url, extractFn, label) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
  page.setDefaultNavigationTimeout(50000);
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 4000));
    const result = await extractFn(page);
    console.log(`[${label}] ${result.length} results`);
    return result;
  } catch(e) {
    console.error(`[${label}] ERROR: ${e.message.slice(0,100)}`);
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

  // VU Amsterdam — extract base programme slugs from all href including curriculum links
  const vuProgs = await crawlPage(browser, 'https://vu.nl/en/education/master/programmes', async (page) => {
    for(let i=0; i<6; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));
    }
    // Get all hrefs and extract base master programme slugs
    const progs = await page.evaluate(() => {
      const all = [...document.querySelectorAll('a[href]')].map(a=>a.href);
      const slugSet = new Set();
      const result = [];
      for(const u of all) {
        // Match: /en/education/master/[slug] — capture slug only (no trailing paths)
        const m = u.match(/vu\.nl\/en\/education\/master\/([a-z0-9][a-z0-9-]+[a-z0-9])/i);
        if(m && !m[1].match(/^(programmes|master|study|curriculum|courses|overview|admission|contact)$/i)) {
          if(!slugSet.has(m[1])) {
            slugSet.add(m[1]);
            result.push({slug: m[1], url: 'https://vu.nl/en/education/master/'+m[1]});
          }
        }
      }
      return result;
    });
    // Get titles for each prog
    const titlesMap = await page.evaluate(() => {
      const map = {};
      // Look for cards with titles and links
      document.querySelectorAll('[class*="card"], [class*="item"], [class*="programme"], li, article').forEach(card => {
        const link = card.querySelector('a[href*="/education/master/"]');
        const title = card.querySelector('h2,h3,h4,h5,strong,[class*="title"],[class*="name"]');
        if(link && title) {
          const m = link.href.match(/\/education\/master\/([a-z0-9][a-z0-9-]+)/i);
          if(m) map[m[1]] = title.textContent.trim();
        }
      });
      return map;
    });
    console.log('[VU] progs:', progs.length, 'titles found:', Object.keys(titlesMap).length);
    console.log('[VU] sample progs:', progs.slice(0,8).map(p=>p.slug));
    return progs.map(p => ({...p, title: titlesMap[p.slug] || ''}));
  }, 'VU Amsterdam');

  // HWU Dubai — extract all programme URLs from redirect links
  const hwuProgs = await crawlPage(browser, 'https://www.hw.ac.uk/dubai/search/programmes', async (page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 3000));
    // Extract actual URLs from search redirect links
    const redirectLinks = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="search.hw.ac.uk"]')].map(a=>a.href)
    );
    // Also check data attributes for programme info
    const dataProgs = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-programme], [data-url], [data-href]')].map(el=>({
        url: el.dataset.programme || el.dataset.url || el.dataset.href,
        title: el.textContent.trim().slice(0,100)
      }));
    });
    console.log('[HWU] redirect links:', redirectLinks.length, 'data progs:', dataProgs.length);
    console.log('[HWU] sample redirect links:', redirectLinks.slice(0,5));

    // Decode real URLs from search redirect links
    const realUrls = redirectLinks.map(link => {
      try {
        const urlParam = new URLSearchParams(link.split('?')[1]).get('url');
        return urlParam ? decodeURIComponent(urlParam) : null;
      } catch(e) { return null; }
    }).filter(Boolean);
    console.log('[HWU] real URLs:', realUrls.length, realUrls.slice(0,6));
    return realUrls;
  }, 'HWU Dubai');

  // Hamburg — bachelor-master listing with all degree programme links
  const hamburgProgs = await crawlPage(browser, 'https://www.uni-hamburg.de/en/campuscenter/studienangebot/bachelor-master.html', async (page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 4000));
    const items = await page.evaluate(() => {
      // Get all studiengang links
      const links = [...document.querySelectorAll('a[href*="studiengang"]')].map(a=>({href:a.href, text:a.textContent.trim().slice(0,100)}));
      // Also look for links to individual programme pages
      const allLinks = [...document.querySelectorAll('a[href]')].map(a=>({href:a.href, text:a.textContent.trim().slice(0,100)}))
        .filter(o=>o.href.match(/uni-hamburg\.de\/(en\/)?campuscenter\/studienangebot\/[^#]{10,}$/) && o.text.length>3);
      return [...links, ...allLinks];
    });
    // Get list items / programme entries from the page
    const entries = await page.evaluate(() => {
      const result = [];
      // Look for list items that represent programmes
      document.querySelectorAll('ul li, ol li, table tr, [class*="programme"], [class*="course"]').forEach(el => {
        const link = el.querySelector('a[href]');
        const text = el.textContent.trim().slice(0,150);
        if(link && text.length > 5 && text.length < 150) {
          result.push({href: link.href, text});
        }
      });
      return result.filter(r => r.href.match(/uni-hamburg\.de/i)).slice(0,200);
    });
    console.log('[Hamburg] studiengang links:', items.length, 'list entries:', entries.length);
    console.log('[Hamburg] sample items:', items.slice(0,8).map(i=>({href:i.href.slice(-60), text:i.text.slice(0,50)})));
    return [...new Set([...items.map(i=>i.href), ...entries.map(e=>e.href)])].filter(u=>u.length>40);
  }, 'Hamburg bach-master');

  // Hamburg — also crawl international programmes page
  const hamburgIntl = await crawlPage(browser, 'https://www.uni-hamburg.de/en/campuscenter/studienangebot/international.html', async (page) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 3000));
    const items = await page.evaluate(() => {
      const result = [];
      document.querySelectorAll('a[href]').forEach(a => {
        if(a.href.match(/uni-hamburg\.de\/(en\/)?campuscenter\/studienangebot\/.+\.html/i) && a.textContent.trim().length > 3)
          result.push({href: a.href, text: a.textContent.trim().slice(0,100)});
      });
      return result;
    });
    console.log('[Hamburg-intl] links:', items.length, items.slice(0,10).map(i=>i.text.slice(0,50)));
    return items;
  }, 'Hamburg-intl');

  await browser.close();

  const results2 = { vuProgs, hwuProgs, hamburgProgs, hamburgIntl };
  fs.writeFileSync(SCRATCH+'/pup-results3.json', JSON.stringify(results2, null, 2));

  console.log('\n=== SUMMARY 2 ===');
  console.log('VU Amsterdam progs:', vuProgs.length);
  console.log('HWU Dubai real URLs:', hwuProgs.length);
  console.log('Hamburg programmes:', hamburgProgs.length);
  console.log('Hamburg intl:', hamburgIntl.length);
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
