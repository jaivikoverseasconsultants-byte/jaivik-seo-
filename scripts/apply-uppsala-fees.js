// Applies Uppsala University's own tuition figures, read by scripts/crawl-uppsala-fees.js.
//
//   node scripts/apply-uppsala-fees.js
//
// Uppsala charges students outside the EU/EEA and Switzerland per semester, and each programme page
// states two figures in SEK: the first-semester fee and the fee for the whole programme. For every
// priced programme the total is exactly the semester fee times the number of semesters, so the fee
// does not change during the programme. Uppsala publishes no annual figure; the annual fee stored
// here is two of its semester fees (one academic year), and feeBasis says so. Both of Uppsala's own
// figures are kept alongside it.
//
// The fee is stored in SEK, Uppsala's currency. The old EUR fields held house figures (EUR 14,000 or
// 13,000 on every row) and are removed. INR and USD are derived at the central rates in
// lib/currency.ts so they agree with every other surface.
//
// A programme whose page states no fee (joint and consortium programmes) is left on request.
// Seven programmes are two semesters long by Uppsala's own figures but carried a two-year duration;
// their duration is corrected from the same source.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data/uppsala-university-courses.ts');
const RATE_TO_INR = { SEK: 8.0, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR

const crawl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wave-europe/uppsala-fees.json'), 'utf8'));
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

const sek = (n) => `SEK ${n.toLocaleString('en-US')}`;

let src = fs.readFileSync(FILE, 'utf8');
const a = findArray(src);
const rows = eval(`(${a.lit})`); // eslint-disable-line no-eval
const report = { priced: 0, onRequest: 0, durationFixed: [], notCrawled: 0 };

for (const c of rows) {
  const r = bySlug.get(c.slug);
  delete c.annualEUR; delete c.totalEUR;
  delete c.semesterTuitionSEK; delete c.totalSEK; delete c.annualSEK;
  const inst = (r?.instances ?? []).find((i) => i.firstFeeSEK && i.totalFeeSEK && !i.cancelled);
  if (!r) report.notCrawled++;
  if (!inst) {
    c.annualUSD = 0; c.annualINR = 0;
    c.feeVerified = false;
    c.feeScope = 'not published';
    c.feeBasis = 'not published — Uppsala\'s programme page states no tuition fee for this programme';
    c.feeSourceUrl = null;
    report.onRequest++;
    continue;
  }
  const semesters = inst.totalFeeSEK / inst.firstFeeSEK;
  if (!Number.isInteger(semesters)) throw new Error(`${c.slug}: total ${inst.totalFeeSEK} is not a whole number of semesters of ${inst.firstFeeSEK}`);
  if (semesters === 2 && c.durationYears !== 1) {
    report.durationFixed.push(`${c.slug}: ${c.durationYears}y -> 1y`);
    c.durationYears = 1; c.duration = '1 year';
  }
  const annual = inst.firstFeeSEK * 2;
  c.annualSEK = annual;
  c.semesterTuitionSEK = inst.firstFeeSEK;
  c.totalSEK = inst.totalFeeSEK;
  c.annualINR = Math.round(annual * RATE_TO_INR.SEK);
  c.annualUSD = Math.round((annual * RATE_TO_INR.SEK) / RATE_TO_INR.USD);
  c.feeVerified = true;
  c.feeScope = 'programme';
  c.feeBasis = `tuition for one academic year (two semesters), ${inst.semester} intake, for students outside the EU/EEA and Switzerland — Uppsala states ${sek(inst.firstFeeSEK)} per semester and ${sek(inst.totalFeeSEK)} for the whole programme`;
  c.feeSourceUrl = c.url;
  report.priced++;
}

// the interface: EUR fee fields go, the SEK ones Uppsala states come in
// one course per line, as the file was written
src = src.slice(0, a.start) + `[\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n]` + src.slice(a.end);
src = src.replace(
  /  annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\r?\n/,
  '  annualSEK?: number; semesterTuitionSEK?: number; totalSEK?: number;\n  annualUSD: number; annualINR: number;\n  feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;\n',
);
if (!src.includes('semesterTuitionSEK?: number')) throw new Error('interface not updated — check its fee line');
fs.writeFileSync(FILE, src);

console.log(`priced ${report.priced} | on request ${report.onRequest} | not in crawl ${report.notCrawled}`);
console.log(`duration corrected (${report.durationFixed.length}):\n  ${report.durationFixed.join('\n  ')}`);
