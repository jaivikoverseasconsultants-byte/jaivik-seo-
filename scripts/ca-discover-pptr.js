// Canada wave — Puppeteer discovery for the JS-rendered program finders.
const puppeteer = require('puppeteer');
const fs = require('fs');

const CFG = {
  redriver: { url: 'https://www.rrc.ca/explore/', keep: /rrc\.ca\/explore\/program\/[a-z0-9-]+/i,
              wait: 'a[href*="/explore/program/"]' },
  uvic:     { url: 'https://www.uvic.ca/undergraduate/programs/index.php', keep: /uvic\.ca\/(undergraduate|graduate)\/programs\/[a-z0-9-]+/i, wait: null },
  windsor:  { url: 'https://www.future.uwindsor.ca/programs/', keep: /future\.uwindsor\.ca\/programs\/[a-z0-9-]+/i, wait: 'a[href*="/programs/"]' },
  unb:      { url: 'https://www.unb.ca/academics/programs/', keep: /unb\.ca\/academics\/programs\/[a-z0-9-]+/i, wait: null },
  tmu_ug:   { url: 'https://www.torontomu.ca/programs/undergraduate/', keep: /torontomu\.ca\/programs\/undergraduate\/[a-z0-9-]+/i, wait: null },
  tmu_pg:   { url: 'https://www.torontomu.ca/graduate/programs/', keep: /torontomu\.ca\/graduate\/programs\/[a-z0-9-]+/i, wait: null },
  ubco:     { url: 'https://you.ubc.ca/programs/?campus=okanagan', keep: /you\.ubc\.ca\/ubc_program\/[a-z0-9-]+/i, wait: null },
  ualberta: { url: 'https://www.ualberta.ca/en/programs/index.html', keep: /ualberta\.ca\/[a-z0-9\/-]*programs\/[a-z0-9-]+/i, wait: null },
};

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const name of process.argv.slice(2)) {
    const cfg = CFG[name];
    if (!cfg) { console.log(`?? no config: ${name}`); continue; }
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');
    try {
      await page.goto(cfg.url, { waitUntil: 'networkidle2', timeout: 90000 });
      if (cfg.wait) { try { await page.waitForSelector(cfg.wait, { timeout: 20000 }); } catch {} }
      // scroll to trigger lazy lists
      await page.evaluate(async () => {
        for (let i = 0; i < 12; i++) { window.scrollBy(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 400)); }
      });
      const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
        .map(a => ({ href: a.href.split('#')[0], text: (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim() })));
      const seen = new Map();
      for (const l of links) {
        if (!cfg.keep.test(l.href)) continue;
        const prev = seen.get(l.href);
        if (!prev || (l.text && l.text.length > prev.length)) seen.set(l.href, l.text || '');
      }
      const rows = [...seen].map(([url, name]) => ({ name, url }));
      fs.writeFileSync(`data/wave-canada/${name}-discovery.json`, JSON.stringify(rows, null, 2));
      console.log(`${name}: ${rows.length}  (named ${rows.filter(r => r.name).length})  [total anchors ${links.length}]`);
      rows.slice(0, 3).forEach(r => console.log(`    ${r.name || '(none)'} -> ${r.url}`));
    } catch (e) { console.log(`${name}: FAILED — ${e.message.slice(0, 110)}`); }
    await page.close();
  }
  await browser.close();
})();
