// Reads Heriot-Watt University Dubai's own tuition figures for every programme on the portal.
//
//   node scripts/crawl-hw-dubai-fees.js
//
// Each hw.ac.uk/dubai programme page has a "Fees and funding" section with one table per intake:
//   <caption><time dateTime="2027-01">January 2027</time> intake tuition fees</caption>
//   Status | Full Time            (sometimes Part Time too)
//   UAE and International | AED 76,505
// Heriot-Watt's fees page states the basis: "what you pay in your first year of study will be the
// amount you pay each year until you graduate", fees inclusive of VAT. Every table is recorded with
// its intake and column headings, so nothing is chosen here. Output: data/wave-uae/hw-dubai-fees.json.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-uae/hw-dubai-fees.json');
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

const clean = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim();
const cells = (row) => (row.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/g) || []).map(clean);

function feeTables(html) {
  const out = [];
  for (const t of html.match(/<table>[\s\S]*?<\/table>/g) || []) {
    // some pages (most of engineering) carry the same table with no intake caption
    const cap = t.match(/<caption[^>]*>([\s\S]*?)<\/caption>/);
    const head = cells((t.match(/<thead>([\s\S]*?)<\/thead>/) || [, ''])[1]);
    const body = ((t.match(/<tbody>([\s\S]*?)<\/tbody>/) || [, ''])[1].match(/<tr>[\s\S]*?<\/tr>/g) || []).map(cells);
    if (head[0] !== 'Status' || !body.some((r) => /AED/.test(r.join(' ')))) continue;
    if (cap && !/intake tuition fees/i.test(clean(cap[1]))) continue;
    const when = cap ? cap[1].match(/dateTime="([\d-]+)"/) : null;
    out.push({ intake: cap ? clean(cap[1]).replace(/ intake tuition fees$/i, '') : null, intakeDate: when ? when[1] : null, columns: head, rows: body });
  }
  return out;
}

async function read(course) {
  const res = await fetch(course.url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, redirect: 'follow', signal: AbortSignal.timeout(60000) });
  const rec = { slug: course.slug, name: course.name, url: course.url, status: res.status, finalUrl: res.url };
  if (!res.ok) return rec;
  if (res.url.replace(/[/#].*$/, '') && res.url.split('#')[0].replace(/\/$/, '') !== course.url.split('#')[0].replace(/\/$/, '')) rec.redirected = true;
  const html = await res.text();
  const title = html.match(/<title>([^<]*)/);
  rec.title = title ? clean(title[1]) : null;
  rec.tables = feeTables(html);
  rec.vatInclusive = /tuition fees inclusive of VAT/i.test(html);
  return rec;
}

(async () => {
  const src = fs.readFileSync(path.join(ROOT, 'data/heriot-watt-university-dubai-courses.ts'), 'utf8');
  const rows = eval(`(${findArray(src)})`); // eslint-disable-line no-eval
  const results = [];
  const queue = [...rows];
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const c = queue.shift();
      let rec;
      for (let attempt = 1; attempt <= 3 && !rec; attempt++) {
        try { rec = await read(c); } catch (e) { if (attempt === 3) rec = { slug: c.slug, url: c.url, error: String(e.cause?.code || e.message || e) }; }
      }
      results.push(rec);
    }
  }));
  results.sort((a, b) => rows.findIndex((r) => r.slug === a.slug) - rows.findIndex((r) => r.slug === b.slug));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    _source: 'hw.ac.uk/dubai programme pages, "Fees and funding" intake tables',
    _basis: 'Heriot-Watt: "what you pay in your first year of study will be the amount you pay each year until you graduate"; fees inclusive of VAT',
    _crawledOn: new Date().toISOString().slice(0, 10),
    results,
  }, null, 1));
  const withFee = results.filter((r) => r.tables?.some((t) => t.rows.some((x) => /AED/.test(x.join(' ')))));
  const shapes = results.reduce((a, r) => { for (const t of r.tables || []) { const k = `${t.columns.join('/')} :: ${t.rows.map((x) => x[0]).join('/')}`; a[k] = (a[k] || 0) + 1; } return a; }, {});
  console.log(`pages ${results.length} | ok ${results.filter((r) => r.status === 200).length} | redirected ${results.filter((r) => r.redirected).length} | with an AED fee ${withFee.length} | errors ${results.filter((r) => r.error || (r.status && r.status !== 200)).length}`);
  console.log('table shapes:', shapes);
  console.log('intakes:', results.reduce((a, r) => { for (const t of r.tables || []) a[t.intake] = (a[t.intake] || 0) + 1; return a; }, {}));
})();
