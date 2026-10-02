// Applies the University of Helsinki's own tuition figures, read by scripts/crawl-helsinki-fees.js.
//
//   node scripts/apply-helsinki-fees.js
//
// helsinki.fi states the fee per programme as "Tuition fee per year (only non-EU/EEA citizens)" in
// EUR, the portal's native currency for Finland, so it goes straight into annualEUR. The previous
// figures (EUR 13,000 on every row) were house figures. totalEUR held the same house figure times two
// and Helsinki states no programme total, so it is removed. INR and USD are derived at the central
// rates in lib/currency.ts.
//
// A page with no fee item is left on request. Most of these are programmes taught in Finnish or
// Swedish, which carry no fee item at all; nothing is inferred from that.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data/university-of-helsinki-courses.ts');
const RATE_TO_INR = { EUR: 90.8, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR
const crawl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wave-europe/helsinki-fees.json'), 'utf8'));
const bySlug = new Map(crawl.results.map((r) => [r.slug, r]));

function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return { lit: src.slice(start, i + 1), start, end: i + 1 };
  }
  return null;
}

let src = fs.readFileSync(FILE, 'utf8');
const a = findArray(src);
const rows = eval(`(${a.lit})`); // eslint-disable-line no-eval
const report = { priced: 0, onRequest: 0, missing: [] };

for (const c of rows) {
  const r = bySlug.get(c.slug);
  if (!r || r.error || r.status !== 200) report.missing.push(c.slug);
  delete c.totalEUR;
  // two pages give the label in Finnish: "Lukuvuosimaksu muille kuin EU/ETA-kansalaisille",
  // the academic-year fee for non-EU/EEA citizens — the same basis
  const ok = r && r.status === 200 && !r.redirected && r.feeEUR > 0 && /per year|lukuvuosimaksu/i.test(r.feeLabel ?? '');
  if (!ok) {
    c.annualEUR = 0; c.annualUSD = 0; c.annualINR = 0;
    c.feeVerified = false;
    c.feeScope = 'not published';
    c.feeBasis = 'not published — the programme\'s helsinki.fi page states no tuition fee';
    c.feeSourceUrl = null;
    report.onRequest++;
    continue;
  }
  c.annualEUR = r.feeEUR;
  c.annualINR = Math.round(r.feeEUR * RATE_TO_INR.EUR);
  c.annualUSD = Math.round((r.feeEUR * RATE_TO_INR.EUR) / RATE_TO_INR.USD);
  c.feeVerified = true;
  c.feeScope = 'programme';
  c.feeBasis = 'tuition fee per year for non-EU/EEA citizens, as stated on the programme page';
  c.feeSourceUrl = c.url;
  report.priced++;
}
if (report.missing.length) throw new Error(`no usable crawl result for: ${report.missing.join(', ')}`);

src = src.slice(0, a.start) + JSON.stringify(rows, null, 2) + src.slice(a.end);
src = src.replace(
  'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;',
  'annualEUR: number; annualUSD: number; annualINR: number; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;',
);
if (!src.includes('feeSourceUrl?: string | null;')) throw new Error('interface not updated — check its fee fields');
fs.writeFileSync(FILE, src);
console.log(`priced ${report.priced} | on request ${report.onRequest}`);
