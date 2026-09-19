// UAlberta per-programme detail, in-browser.
//
// Every www.ualberta.ca path answers curl with HTTP 202 and an 8-byte body, so the shared
// curl-based scripts/ca-detail.js cannot be used here. This runs the same extraction rules
// inside one reused browser session.
//
// Fee rule is identical to ca-detail.js and for the same reason (fee-crawl-traps #1): match
// the international LABEL first, then the amount, bounded so the match can never skip past
// another dollar figure and pick up the domestic column.
const puppeteer = require('puppeteer');
const fs = require('fs');

const IN = 'data/wave-canada/ualberta2-discovery.json';
const OUT = 'data/wave-canada/ualberta2-detail.json';

const EXTRACT = () => {
  const txt = (document.body ? document.body.innerText : '').replace(/\s+/g, ' ').trim();
  const h1 = (document.querySelector('h1') || {}).innerText || '';
  const og = document.querySelector('meta[property="og:title"]');

  const feeRe = /(international|intl|non-?canadian|visa student)[^$]{0,60}?\$\s?([\d,]{4,12})/gi;
  const fees = [];
  let m;
  while ((m = feeRe.exec(txt))) {
    const n = parseInt(m[2].replace(/[,\s]/g, ''), 10);
    if (!(n >= 2000 && n <= 200000)) continue;
    const ctx = txt.slice(Math.max(0, m.index - 110), m.index + 200);
    const basis = /per year|per annum|annually|\/ ?year|\bannual\b|year one|first year/i.test(ctx) ? 'annual'
                : /\btotal\b|entire program|full program/i.test(ctx) ? 'total' : 'unknown';
    fees.push({ amountCAD: n, basis, evidence: ctx.slice(0, 190) });
  }
  const dedup = []; const seenAmt = new Set();
  for (const f of fees) { if (seenAmt.has(f.amountCAD)) continue; seenAmt.add(f.amountCAD); dedup.push(f); }

  const pick = (re, lo, hi) => {
    const v = [...txt.matchAll(re)].map(x => parseFloat(x[1])).filter(n => n >= lo && n <= hi);
    return v.length ? Math.min(...v) : null;
  };
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const intakes = MONTHS.filter(mo =>
    new RegExp('\\b' + mo + '\\b[^.]{0,60}?(intake|start|entry|admission|term)|(intake|start|entry|admission|term)[^.]{0,60}?\\b' + mo + '\\b', 'i').test(txt));

  let duration = null;
  const y = txt.match(/\b(\d(?:\.\d)?)\s*[-–]?\s*(year|yr)s?\b/i);
  if (y) duration = { text: y[0].trim(), years: parseFloat(y[1]) };

  return {
    officialName: (h1 || (og ? og.content : '') || document.title || '').replace(/\s+/g, ' ').trim(),
    chars: txt.length,
    duration,
    intakes,
    ielts: pick(/IELTS[^.]{0,110}?\b([5-9](?:\.\d)?)\b/gi, 5, 9),
    toefl: pick(/TOEFL[^.]{0,130}?\b(\d{2,3})\b/gi, 50, 120),
    pte: pick(/PTE[^.]{0,110}?\b(\d{2})\b/gi, 40, 90),
    tuitionIntl: dedup.slice(0, 3),
  };
};

(async () => {
  const rows = JSON.parse(fs.readFileSync(IN, 'utf8'));
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36');
  // block images/fonts/media — 365 pages, none of it needed for text extraction
  await page.setRequestInterception(true);
  page.on('request', r => (/^(image|font|media|stylesheet)$/.test(r.resourceType()) ? r.abort() : r.continue()));
  await page.goto('https://www.ualberta.ca/en/index.html', { waitUntil: 'domcontentloaded', timeout: 120000 });

  const out = [];
  let i = 0, feeHits = 0, fails = 0;
  for (const r of rows) {
    i++;
    try {
      const resp = await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      const status = resp ? resp.status() : 0;
      if (status !== 200) { out.push({ ...r, fetch: 'FAIL', status }); fails++; continue; }
      const info = await page.evaluate(EXTRACT);
      if (info.tuitionIntl.length) feeHits++;
      out.push({ sourceName: r.name || '', url: r.url, studyLevel: r.studyLevel, ...info });
    } catch (e) { out.push({ ...r, fetch: 'FAIL', error: e.message.slice(0, 60) }); fails++; }
    if (i % 25 === 0) process.stderr.write(`  ${i}/${rows.length} (fees ${feeHits}, fails ${fails})\n`);
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  const ok = out.filter(x => x.fetch !== 'FAIL');
  console.log(`${OUT}: ${ok.length}/${out.length} fetched | tuition ${out.filter(x => x.tuitionIntl && x.tuitionIntl.length).length} | duration ${out.filter(x => x.duration).length} | intake ${out.filter(x => x.intakes && x.intakes.length).length} | IELTS ${out.filter(x => x.ielts).length}`);
  await browser.close();
})();
