// Reads the University of Helsinki's own tuition figure for every programme on the portal.
//
//   node scripts/crawl-helsinki-fees.js
//
// Each helsinki.fi degree-programme page has a fact box with a labelled fee item:
//   <span class="degree-programme__factbox--item__label">Tuition fee per year (only non-EU/EEA citizens)</span>
//   <span class="degree-programme__factbox--item__value">15 000 EUR</span>
// The label is kept with the value so the basis is recorded as the university words it, not assumed.
// Pages that announce no intake ("There will be no intake for ... in 2026") are flagged too.
// Redirects are checked against the requested URL. Output: data/wave-europe/helsinki-fees.json.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-europe/helsinki-fees.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return src.slice(start, i + 1);
  }
  return null;
}

const clean = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;| | /g, ' ').replace(/\s+/g, ' ').trim();

async function read(course) {
  const res = await fetch(course.url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, redirect: 'follow' });
  const rec = { slug: course.slug, name: course.name, url: course.url, status: res.status, finalUrl: res.url };
  if (!res.ok) return rec;
  if (res.url.replace(/\/$/, '') !== course.url.replace(/\/$/, '')) rec.redirected = true;
  const html = await res.text();
  const fee = html.match(/factbox--fee[\s\S]*?item__label">([\s\S]*?)<\/span>[\s\S]*?item__value">([\s\S]*?)<\/span>/);
  if (fee) {
    rec.feeLabel = clean(fee[1]);
    rec.feeText = clean(fee[2]);
    const m = rec.feeText.match(/^([\d ]+)\s*EUR$/);
    rec.feeEUR = m ? Number(m[1].replace(/ /g, '')) : null;
  }
  const noIntake = clean(html).match(/There will be no intake[^.]*\./i);
  if (noIntake) rec.noIntake = noIntake[0];
  const title = html.match(/<title>([^<]*)/);
  rec.title = title ? clean(title[1]) : null;
  return rec;
}

(async () => {
  const src = fs.readFileSync(path.join(ROOT, 'data/university-of-helsinki-courses.ts'), 'utf8');
  const rows = eval(`(${findArray(src)})`); // eslint-disable-line no-eval
  const results = [];
  const queue = [...rows];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const c = queue.shift();
      try { results.push(await read(c)); } catch (e) { results.push({ slug: c.slug, url: c.url, error: String(e.message || e) }); }
    }
  }));
  results.sort((a, b) => rows.findIndex((r) => r.slug === a.slug) - rows.findIndex((r) => r.slug === b.slug));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    _source: 'helsinki.fi degree-programme pages, fact-box fee item',
    _crawledOn: new Date().toISOString().slice(0, 10),
    results,
  }, null, 1));
  const labels = results.reduce((a, r) => (r.feeLabel ? { ...a, [r.feeLabel]: (a[r.feeLabel] || 0) + 1 } : a), {});
  console.log(`pages ${results.length} | ok ${results.filter((r) => r.status === 200).length} | redirected ${results.filter((r) => r.redirected).length} | fee ${results.filter((r) => r.feeEUR).length} | fee text unparsed ${results.filter((r) => r.feeText && !r.feeEUR).length} | no intake ${results.filter((r) => r.noIntake).length} | errors ${results.filter((r) => r.error || (r.status && r.status !== 200)).length}`);
  console.log('fee labels:', labels);
  console.log('distinct fees:', [...new Set(results.map((r) => r.feeEUR).filter(Boolean))].sort((a, b) => a - b).join(', '));
})();
