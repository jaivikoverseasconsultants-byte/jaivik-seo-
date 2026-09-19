// UAlberta, sitemap route. Every www.ualberta.ca path answers curl with HTTP 202 and an
// empty body (robots.txt and sitemap.xml included), so enumeration has to happen inside a
// browser session that clears the challenge.
const puppeteer = require('puppeteer');
const fs = require('fs');

const CANDIDATES = [
  'https://www.ualberta.ca/sitemap.xml',
  'https://www.ualberta.ca/sitemap_index.xml',
  'https://www.ualberta.ca/en/sitemap.xml',
  'https://www.ualberta.ca/robots.txt',
];
const PROGRAM_RE = /ualberta\.ca\/(en\/)?(undergraduate-programs|graduate-programs)\/[a-z0-9-]+\.html$/i;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');
  // warm the session so the challenge cookie is issued
  await page.goto('https://www.ualberta.ca/en/index.html', { waitUntil: 'networkidle2', timeout: 120000 });

  async function fetchText(u) {
    try {
      return await page.evaluate(async url => {
        const r = await fetch(url, { credentials: 'include' });
        return r.ok ? await r.text() : `@@STATUS ${r.status}@@`;
      }, u);
    } catch (e) { return `@@ERR ${String(e).slice(0, 60)}@@`; }
  }

  const locs = new Set();
  const queue = [];
  for (const c of CANDIDATES) {
    const t = await fetchText(c);
    console.log(`${c}  ->  ${t.startsWith('@@') ? t.slice(0, 40) : t.length + ' bytes'}`);
    if (t.startsWith('@@')) continue;
    if (/robots\.txt$/.test(c)) {
      for (const m of t.matchAll(/^sitemap:\s*(\S+)/gim)) queue.push(m[1]);
    } else {
      for (const m of t.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
        (/\.xml(\.gz)?$/i.test(m[1]) ? queue : locs).add ? null : null;
        if (/\.xml(\.gz)?$/i.test(m[1])) queue.push(m[1]); else locs.add(m[1]);
      }
    }
  }

  const visited = new Set();
  while (queue.length && visited.size < 60) {
    const u = queue.shift();
    if (!u || visited.has(u)) continue;
    visited.add(u);
    const t = await fetchText(u);
    if (t.startsWith('@@')) { console.log(`  sub ${u} -> ${t.slice(0, 30)}`); continue; }
    let added = 0;
    for (const m of t.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      if (/\.xml(\.gz)?$/i.test(m[1])) queue.push(m[1]);
      else { locs.add(m[1]); added++; }
    }
    console.log(`  sub ${u.slice(-60)} -> ${added} urls`);
  }

  const progs = [...locs].filter(u => PROGRAM_RE.test(u));
  console.log(`\ntotal sitemap urls: ${locs.size}  |  programme pages: ${progs.length}`);
  const rows = progs.map(url => ({
    url,
    name: '',
    studyLevel: /graduate-programs/.test(url) && !/undergraduate/.test(url) ? 'Postgraduate' : 'Undergraduate',
  }));
  fs.writeFileSync('data/wave-canada/ualberta2-discovery.json', JSON.stringify(rows, null, 2));
  rows.slice(0, 6).forEach(r => console.log(`   ${r.url.replace('https://www.ualberta.ca', '')}  [${r.studyLevel}]`));
  await browser.close();
})();
