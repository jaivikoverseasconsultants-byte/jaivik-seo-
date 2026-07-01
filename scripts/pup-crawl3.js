const puppeteer = require('puppeteer');
const fs = require('fs');
const SCRATCH = 'C:/Users/Harshita/AppData/Local/Temp/claude/C--Users-Harshita-jaivik-seo/6765f57f-1488-451a-8c73-7c5e71348a66/scratchpad';

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  });

  // ===== HWU Dubai: paginate through all 81 results =====
  console.log('[HWU] Crawling all 81 programmes...');
  const page1 = await browser.newPage();
  await page1.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
  await page1.goto('https://www.hw.ac.uk/dubai/search/programmes', {waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,4000));

  // Accept cookies if shown
  try {
    const cookieBtn = await page1.$('[class*="accept"],[class*="cookie"] button');
    if(cookieBtn) { await cookieBtn.click(); await new Promise(r=>setTimeout(r,1000)); }
  } catch(e){}

  const hwuProgs = [];
  let pageNum = 1;
  while(true) {
    const items = await page1.evaluate(() => {
      const cards = [...document.querySelectorAll('[class*="search-result"], [class*="result-item"], article, .c-card, [class*="programme"]')];
      const results = [];
      cards.forEach(card => {
        const link = card.querySelector('a[href*="hw.ac.uk"]') || card.querySelector('a[href]');
        const title = card.querySelector('h2,h3,h4,strong,[class*="title"]');
        const level = card.querySelector('[class*="level"],[class*="type"],[class*="badge"]');
        if(link) {
          const href = link.href;
          if(href.match(/hw\.ac\.uk\/(dubai|uk\/dubai)\/study\//i)) {
            results.push({
              url: href,
              title: (title?.textContent||link.textContent||'').trim().replace(/\s+/g,' ').slice(0,100),
              level: (level?.textContent||'').trim().slice(0,30)
            });
          }
        }
      });
      return results;
    });

    // Also extract from redirect links
    const redirectItems = await page1.evaluate(() => {
      return [...document.querySelectorAll('a[href*="search.hw.ac.uk"]')].map(a => {
        try {
          const urlParam = new URLSearchParams(a.href.split('?')[1]).get('url');
          const realUrl = urlParam ? decodeURIComponent(urlParam) : null;
          const card = a.closest('article, [class*=result], [class*=card], li') || a.parentElement;
          const title = (card?.querySelector('h2,h3,h4,strong') || a).textContent.trim().replace(/\s+/g,' ').slice(0,100);
          return realUrl ? {url: realUrl, title} : null;
        } catch(e) { return null; }
      }).filter(Boolean);
    });

    const combined = [...items, ...redirectItems].filter(i=>i.url.match(/hw\.ac\.uk\/(dubai|uk\/dubai)\/study\/[a-z]/i));
    console.log(`[HWU] page ${pageNum}: ${combined.length} items (${items.length} direct, ${redirectItems.length} redirect)`);
    hwuProgs.push(...combined);

    // Try clicking next page
    const nextBtn = await page1.$('[aria-label="Next page"], [class*="next"]:not([disabled]), a[rel="next"]');
    if(!nextBtn || pageNum >= 8) break;
    await nextBtn.click();
    await new Promise(r=>setTimeout(r,3000));
    pageNum++;
  }
  await page1.close();

  const hwuUniq = [...new Map(hwuProgs.map(p=>[p.url,p])).values()];
  console.log('[HWU] Total unique:', hwuUniq.length);

  // ===== Hamburg: extract all programme names from listing page =====
  console.log('\n[Hamburg] Crawling studienangebot page for programme names...');
  const page2 = await browser.newPage();
  await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
  await page2.goto('https://www.uni-hamburg.de/en/campuscenter/studienangebot.html', {waitUntil:'networkidle2'});
  await new Promise(r=>setTimeout(r,5000));
  await page2.evaluate(()=>window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r=>setTimeout(r,3000));

  const hamburgItems = await page2.evaluate(() => {
    const results = [];
    const seen = new Set();
    // Get all studiengang links with their surrounding text
    document.querySelectorAll('a[href*="studiengang"]').forEach(a => {
      const href = a.href;
      if(seen.has(href) || !href.match(/studiengang\.html\?\d+/)) return;
      seen.add(href);
      // Get the closest container that might have the programme title
      const container = a.closest('li, tr, [class*=programme], article, .content-item') || a.parentElement;
      const title = (a.textContent || container?.textContent || '').trim().replace(/\s+/g,' ').slice(0,150);
      results.push({url: href, title});
    });
    return results;
  });

  // If that didn't give good names, get all links with text context
  const hamburgRich = await page2.evaluate(() => {
    const results = [];
    const seen = new Set();
    document.querySelectorAll('a[href*="studiengang.html?"]').forEach(a => {
      if(seen.has(a.href)) return;
      seen.add(a.href);
      // Look at surrounding paragraph or list item for the programme name
      let title = a.textContent.trim();
      if(title.length < 3) {
        const nearby = a.parentElement?.textContent.trim() || '';
        title = nearby.replace(/\s+/g,' ').slice(0,100);
      }
      results.push({url: a.href, rawTitle: title});
    });
    return results;
  });

  console.log(`[Hamburg] Links with text: ${hamburgItems.length}, Rich: ${hamburgRich.length}`);
  console.log('[Hamburg] Sample:', hamburgItems.slice(0,5).map(i=>({url:i.url.split('?')[1], t:i.title.slice(0,60)})));

  await page2.close();

  // ===== VU Amsterdam: parse sitemap programmatically =====
  const https = require('https');
  function get(url){return new Promise(resolve=>{https.get(url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/120'}},res=>{let b='';res.on('data',d=>b+=d);res.on('end',()=>resolve(b))}).on('error',()=>resolve(''))});}
  console.log('\n[VU] Parsing sitemap...');
  const sitemapXml = await get('https://vu.nl/sitemap.xml');
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  const masters = locs.filter(u=>u.match(/vu\.nl\/en\/education\/master\/[a-z]/i) && !u.match(/curriculum|overview\/|admission\/|contact\/|study-guide|\.pdf/i));
  // Deduplicate by base slug
  const mastersMap = new Map();
  masters.forEach(u => {
    const m = u.match(/\/en\/education\/master\/([a-z0-9][a-z0-9-]+)/i);
    if(m && !mastersMap.has(m[1])) mastersMap.set(m[1], u);
  });
  const vuMasters = [...mastersMap.entries()].map(([slug,url])=>({slug, url: 'https://vu.nl/en/education/master/'+slug}));
  console.log('[VU] Total master programmes:', vuMasters.length, 'sample:', vuMasters.slice(0,10).map(v=>v.slug));

  await browser.close();

  const results = { hwuProgs: hwuUniq, hamburgItems, hamburgRich, vuMasters };
  fs.writeFileSync(SCRATCH+'/pup-results4.json', JSON.stringify(results, null, 2));

  console.log('\n=== FINAL SUMMARY ===');
  console.log('HWU Dubai:', hwuUniq.length);
  console.log('Hamburg:', hamburgItems.length);
  console.log('VU Amsterdam (masters):', vuMasters.length);
}

main().catch(e=>{console.error('FATAL:',e.message,e.stack?.slice(0,300)); process.exit(1);});
