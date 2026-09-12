const puppeteer = require('puppeteer');
const TARGETS = {
  redriver: 'https://www.rrc.ca/explore/',
  uvic:     'https://www.uvic.ca/programs/index.php',
  windsor:  'https://www.future.uwindsor.ca/programs/',
  ubco:     'https://you.ubc.ca/programs/',
  ualberta: 'https://www.ualberta.ca/en/undergraduate-programs/index.html',
};
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  for (const name of process.argv.slice(2)) {
    const page = await b.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');
    const hits = [];
    page.on('response', async r => {
      const u = r.url(); const ct = (r.headers()['content-type'] || '');
      if (!/json|graphql/i.test(ct)) return;
      if (/analytics|gtm|googletag|doubleclick|hotjar|siteimprove|cookie/i.test(u)) return;
      let len = 0; try { len = (await r.buffer()).length; } catch {}
      if (len > 1500) hits.push({ u: u.slice(0, 150), len, status: r.status() });
    });
    try {
      await page.goto(TARGETS[name], { waitUntil: 'networkidle2', timeout: 90000 });
      await page.evaluate(async () => { for (let i=0;i<8;i++){window.scrollBy(0,2000);await new Promise(r=>setTimeout(r,350));} });
      await new Promise(r => setTimeout(r, 2500));
    } catch (e) { console.log(`${name}: nav error ${e.message.slice(0,70)}`); }
    console.log(`═══ ${name} — ${hits.length} JSON responses >1.5KB`);
    hits.sort((a,b)=>b.len-a.len).slice(0,7).forEach(h => console.log(`   ${String(h.len).padStart(9)}  ${h.status}  ${h.u}`));
    await page.close();
  }
  await b.close();
})();
