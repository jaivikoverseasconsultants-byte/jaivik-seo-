// UAlberta, final approach: its programme finder is backed by Coveo.
//
// Why not the other routes: calendar.ualberta.ca/content.php answers HTTP 202 with an empty
// body to BOTH curl and a headless browser session (the challenge is not clearing), and the
// marketing listing at /en/undergraduate-programs/ is JS-paginated — a scroll-and-harvest
// pass surfaced only 25 of its programmes.
//
// Coveo needs a short-lived token that the page fetches at load. Rather than guess the query
// shape, this captures the page's OWN search POST (url + headers + body), then replays it with
// a larger numberOfResults and a moving firstResult until the result set is exhausted.
const puppeteer = require('puppeteer');
const fs = require('fs');

const LISTING = 'https://www.ualberta.ca/en/undergraduate-programs/index.html';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');

  let captured = null;
  page.on('request', req => {
    const u = req.url();
    if (!/coveo.*\/rest\/search/i.test(u)) return;
    if (req.method() !== 'POST') return;
    if (captured) return;
    captured = { url: u, headers: req.headers(), body: req.postData() || '' };
  });

  await page.goto(LISTING, { waitUntil: 'networkidle2', timeout: 120000 });
  // nudge the widget so it issues its query if it hasn't
  await page.evaluate(async () => {
    for (let i = 0; i < 10; i++) { window.scrollBy(0, 1500); await new Promise(r => setTimeout(r, 400)); }
  });
  await new Promise(r => setTimeout(r, 3000));

  if (!captured) {
    console.log('No Coveo search POST captured — the widget did not query, or it uses a different transport.');
    await browser.close();
    return;
  }
  console.log('captured Coveo POST:', captured.url.slice(0, 110));
  console.log('body sample:', captured.body.slice(0, 220));

  // Replay from inside the page so the token/cookies stay valid.
  const all = await page.evaluate(async (cap) => {
    const out = [];
    const seen = new Set();
    const parseBody = b => { try { return JSON.parse(b); } catch { return null; } };
    const asJson = parseBody(cap.body);

    for (let first = 0; first < 3000; first += 200) {
      let resp;
      try {
        let body;
        if (asJson) { body = JSON.stringify({ ...asJson, numberOfResults: 200, firstResult: first }); }
        else {
          const p = new URLSearchParams(cap.body);
          p.set('numberOfResults', '200'); p.set('firstResult', String(first));
          body = p.toString();
        }
        resp = await fetch(cap.url, {
          method: 'POST',
          headers: { 'Content-Type': cap.headers['content-type'] || 'application/json',
                     ...(cap.headers.authorization ? { Authorization: cap.headers.authorization } : {}) },
          body,
        });
      } catch (e) { out.push({ _error: String(e).slice(0, 80) }); break; }
      if (!resp.ok) { out.push({ _status: resp.status }); break; }
      const j = await resp.json();
      const results = j.results || [];
      if (!results.length) break;
      for (const r of results) {
        const url = r.clickUri || r.uri || '';
        if (!url || seen.has(url)) continue;
        seen.add(url);
        out.push({ name: (r.title || '').trim(), url });
      }
      if (results.length < 200) break;
    }
    return out;
  }, captured);

  const errors = all.filter(x => x._error || x._status);
  const rows = all.filter(x => x.url && x.name);
  errors.forEach(e => console.log('  replay issue:', JSON.stringify(e)));
  console.log(`\nUAlberta via Coveo: ${rows.length} results`);

  // keep only real programme pages
  const progs = rows.filter(r => /ualberta\.ca\/.*\/(undergraduate-programs|graduate-programs|programs)\/[a-z0-9-]+\.html$/i.test(r.url));
  console.log(`  of which programme pages: ${progs.length}`);
  progs.slice(0, 6).forEach(p => console.log(`   ${p.name.slice(0, 55)}  |  ${p.url.replace('https://www.ualberta.ca', '')}`));

  fs.writeFileSync('data/wave-canada/ualberta2-discovery.json', JSON.stringify(progs, null, 2));
  await browser.close();
})();
