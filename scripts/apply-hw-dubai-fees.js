// Applies Heriot-Watt University Dubai's own tuition figures, read by scripts/crawl-hw-dubai-fees.js.
//
//   node scripts/apply-hw-dubai-fees.js
//
// Each programme page states a full-time fee in AED for "UAE and International" students, VAT
// included, per intake. Heriot-Watt states the basis on its fees page: the first-year fee is the
// amount paid each year until graduation — an annual fee, stored as annualAED. The earliest intake
// that states a full-time fee is used and named in feeBasis (three programmes show only a part-time
// fee for January 2027 and a full-time fee from September 2027). A part-time fee is never used as an
// annual one.
//
// The old figures (AED 72,000 on every undergraduate row) were house figures. totalAED held that
// figure times the duration and Heriot-Watt states no programme total, so it is removed.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data/heriot-watt-university-dubai-courses.ts');
const RATE_TO_INR = { AED: 22.7, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR
const crawl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wave-uae/hw-dubai-fees.json'), 'utf8'));
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

function fullTime(r) {
  for (const t of r?.tables ?? []) {
    const col = t.columns.indexOf('Full Time');
    if (col < 0) continue;
    const row = t.rows.find((x) => x[0] === 'UAE and International');
    const m = row?.[col]?.match(/^AED\s*([\d,]+)$/);
    if (m) return { fee: Number(m[1].replace(/,/g, '')), intake: t.intake };
  }
  return null;
}

let src = fs.readFileSync(FILE, 'utf8');
const a = findArray(src);
const rows = eval(`(${a.lit})`); // eslint-disable-line no-eval
const report = { priced: 0, onRequest: [] };

for (const c of rows) {
  const r = bySlug.get(c.slug);
  delete c.totalAED;
  const ft = r && r.status === 200 && !r.redirected ? fullTime(r) : null;
  if (!ft) {
    c.annualAED = 0; c.annualUSD = 0; c.annualINR = 0;
    c.feeVerified = false;
    c.feeScope = 'not published';
    c.feeBasis = r?.status === 404
      ? 'not published — the programme page no longer exists on hw.ac.uk'
      : 'not published — the programme page states no full-time tuition fee';
    c.feeSourceUrl = null;
    report.onRequest.push(`${c.slug} (${r?.status ?? 'no crawl'})`);
    continue;
  }
  c.annualAED = ft.fee;
  c.annualINR = Math.round(ft.fee * RATE_TO_INR.AED);
  c.annualUSD = Math.round((ft.fee * RATE_TO_INR.AED) / RATE_TO_INR.USD);
  c.feeVerified = true;
  c.feeScope = 'programme';
  c.feeBasis = `annual full-time tuition for UAE and international students, VAT included${ft.intake ? `, ${ft.intake} intake` : ''} — Heriot-Watt charges the first-year fee each year until graduation`;
  c.feeSourceUrl = c.url;
  report.priced++;
}

// one course per line, as the file was written
src = src.slice(0, a.start) + `[\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n]` + src.slice(a.end);
src = src.replace(
  /  annualAED: number; annualUSD: number; annualINR: number; totalAED: number;\r?\n/,
  '  annualAED: number; annualUSD: number; annualINR: number;\n  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;\n',
);
if (!src.includes('feeSourceUrl?: string | null;')) throw new Error('interface not updated — check its fee line');
fs.writeFileSync(FILE, src);
console.log(`priced ${report.priced} | on request ${report.onRequest.length}:\n  ${report.onRequest.join('\n  ')}`);
