// Reads the University of Copenhagen's own tuition figures and matches them to the portal's rows.
//
//   node scripts/crawl-copenhagen-fees.js
//
// UCPH programme pages carry no fee. The figures live on
// ku.dk/studies/admission/application-deposit-fee-and-tuition-fees, in a programme picker whose
// data is an inline object (`const uddannelser = { BA: [...], KA: [...] }`), one entry per
// programme: "The annual tuition fee for citizens outside the EU, EEA or Switzerland is: DKK n".
// The page defines it as the fee for 60 ECTS, one year of full-time study.
//
// The picker names programmes but does not link them, so rows are matched on the programme name
// within the same level. Only exact (normalised) name matches are applied; everything else is
// written out for review. Output: data/wave-europe/copenhagen-fees.json.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-europe/copenhagen-fees.json');
const PAGE = 'https://www.ku.dk/studies/admission/application-deposit-fee-and-tuition-fees';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

const norm = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();

function picker(html) {
  const i = html.indexOf('const uddannelser');
  if (i < 0) throw new Error('programme picker not found on the fee page');
  const body = html.slice(i, html.indexOf('function visBeskrivelse', i));
  const out = [];
  let level = null;
  const re = /(?:^|\n)\s*(BA|KA|[A-Z]{2,3})\s*:\s*\[|navn:\s*"([^"]+)"\s*,\s*beskrivelse:\s*`([\s\S]*?)`/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[1]) { level = m[1]; continue; }
    const text = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const fee = text.match(/annual tuition fee for citizens outside the EU, EEA or Switzerland is:\s*DKK\s*([\d,.]+)/i);
    out.push({ level, name: m[2], feeDKK: fee ? Number(fee[1].replace(/[,.]/g, '')) : null, text: text.slice(0, 240) });
  }
  return out;
}

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

(async () => {
  const res = await fetch(PAGE, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' } });
  if (!res.ok) throw new Error(`fee page HTTP ${res.status}`);
  const entries = picker(await res.text());

  const src = fs.readFileSync(path.join(ROOT, 'data/university-of-copenhagen-courses.ts'), 'utf8');
  const rows = eval(`(${findArray(src)})`); // eslint-disable-line no-eval

  const levelKey = (r) => (r.level === 'Bachelor' ? 'BA' : 'KA');
  const matches = rows.map((r) => {
    const pool = entries.filter((e) => e.level === levelKey(r));
    const exact = pool.filter((e) => norm(e.name) === norm(r.name));
    const rec = { slug: r.slug, name: r.name, level: r.level, url: r.url };
    if (exact.length === 1) return { ...rec, match: 'exact', picker: exact[0] };
    if (exact.length > 1) return { ...rec, match: 'ambiguous', candidates: exact };
    // candidates for review: picker names that contain, or are contained in, the row name
    const loose = pool.filter((e) => norm(e.name).includes(norm(r.name)) || norm(r.name).includes(norm(e.name)));
    return { ...rec, match: 'none', candidates: loose };
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    _source: PAGE,
    _basis: 'annual tuition fee (60 ECTS) for citizens outside the EU, EEA or Switzerland, as stated in the page\'s programme picker',
    _crawledOn: new Date().toISOString().slice(0, 10),
    pickerEntries: entries,
    matches,
  }, null, 1));

  const count = (k) => matches.filter((x) => x.match === k).length;
  const lv = entries.reduce((a, e) => ({ ...a, [e.level]: (a[e.level] || 0) + 1 }), {});
  console.log(`picker entries ${entries.length} ${JSON.stringify(lv)} | without a DKK figure ${entries.filter((e) => !e.feeDKK).length}`);
  console.log(`rows ${rows.length} | exact ${count('exact')} | ambiguous ${count('ambiguous')} | unmatched ${count('none')}`);
})();
