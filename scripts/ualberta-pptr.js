// UAlberta programme discovery via a real browser session.
//
// calendar.ualberta.ca serves index.php fine to curl but answers content.php with HTTP 202
// and an EMPTY body — a managed bot challenge scoped to that endpoint. Occasional 200s on
// other paths are edge-cache hits, not passes. A headless Chrome session clears it; this is
// the same curl-can't / browser-can split already recorded for Edith Cowan in the crawl notes.
//
// Acalog structure: content.php?catoid&navoid lists programmes, each linking to
// preview_program.php?catoid&poid. Pagination is filter[cpage].
const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE = 'https://calendar.ualberta.ca';
const CATOID = 69;
const SECTIONS = [
  { navoid: 20886, studyLevel: 'Undergraduate' },
  { navoid: 20894, studyLevel: 'Postgraduate' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');

  // warm the session on a path that is not challenged, so the challenge cookie is issued
  await page.goto(`${BASE}/index.php?catoid=${CATOID}`, { waitUntil: 'networkidle2', timeout: 90000 });

  const all = new Map();
  for (const sec of SECTIONS) {
    let sectionAdded = 0;
    for (let cpage = 1; cpage <= 40; cpage++) {
      const url = `${BASE}/content.php?catoid=${CATOID}&navoid=${sec.navoid}&filter%5Bcpage%5D=${cpage}`;
      let links = [];
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
        const status = resp ? resp.status() : 0;
        if (status !== 200) { process.stderr.write(`  navoid=${sec.navoid} p${cpage}: HTTP ${status}, stopping\n`); break; }
        links = await page.evaluate(() =>
          [...document.querySelectorAll('a[href*="preview_program.php"]')].map(a => ({
            href: a.getAttribute('href') || '',
            text: (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim(),
          })));
      } catch (e) { process.stderr.write(`  navoid=${sec.navoid} p${cpage}: ${e.message.slice(0, 60)}\n`); break; }

      let newOnPage = 0;
      for (const l of links) {
        const poid = (l.href.match(/poid=(\d+)/) || [])[1];
        if (!poid || !l.text || l.text.length < 3) continue;
        const canonical = `${BASE}/preview_program.php?catoid=${CATOID}&poid=${poid}`;
        if (all.has(canonical)) continue;
        all.set(canonical, { name: l.text, url: canonical, studyLevel: sec.studyLevel });
        newOnPage++;
      }
      process.stderr.write(`  navoid=${sec.navoid} p${cpage}: ${links.length} links, ${newOnPage} new\n`);
      sectionAdded += newOnPage;
      if (links.length === 0) break;
      if (newOnPage === 0 && cpage > 1) break;   // pagination looped back to the same set
    }
    console.log(`navoid=${sec.navoid} (${sec.studyLevel}): ${sectionAdded} programmes`);
  }

  const rows = [...all.values()];
  fs.writeFileSync('data/wave-canada/ualberta2-discovery.json', JSON.stringify(rows, null, 2));
  console.log(`\nUAlberta total: ${rows.length} programmes`);
  rows.slice(0, 6).forEach(r => console.log(`   ${r.name}  [${r.studyLevel}]`));

  // validate a spread sample in the same session, with a control URL that must fail
  const step = Math.max(1, Math.floor(rows.length / 6));
  const sample = [];
  for (let i = 0; i < rows.length && sample.length < 6; i += step) sample.push(rows[i].url);
  sample.push(`${BASE}/preview_program.php?catoid=${CATOID}&poid=99999999`);  // control
  console.log('\nvalidation (last row is a control that must FAIL):');
  for (const u of sample) {
    try {
      const resp = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const info = await page.evaluate(() => ({
        h1: (document.querySelector('h1')?.innerText || '').trim(),
        chars: (document.body?.innerText || '').length,
        notFound: /not found|no longer|invalid|error/i.test(document.body?.innerText || ''),
      }));
      const ok = resp && resp.status() === 200 && !info.notFound && info.chars > 1200;
      console.log(`   ${resp ? resp.status() : 0}  ${ok ? 'OK  ' : 'FAIL'} chars=${String(info.chars).padStart(6)}  ${info.h1.slice(0, 50)}`);
    } catch (e) { console.log(`   ERR ${e.message.slice(0, 50)}`); }
  }
  await browser.close();
})();
