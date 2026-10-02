// Applies the University of Copenhagen's own tuition figures, read by scripts/crawl-copenhagen-fees.js.
//
//   node scripts/apply-copenhagen-fees.js
//
// UCPH states an annual fee in DKK per programme (the fee for 60 ECTS, one year of full-time study)
// for citizens outside the EU, EEA and Switzerland. It is stored as annualDKK, UCPH's own figure.
// The old EUR fields held house figures (EUR 15,000 on every master's row) and are removed. INR and
// USD are derived at the central rates in lib/currency.ts.
//
// Rows are joined to UCPH's fee list by programme name. Exact matches are applied as they are; the
// rows below needed a decision, made from each programme's own ku.dk page title:
const MANUAL = {
  // same programme, the fee list names the campus
  'ku-medicine-copenhagen': 'Medicine (Copenhagen)',
  'ku-medicine-koege': 'Medicine (Køge)',
  // ku.dk/.../pharmaceutical-sciences is titled "Pharmaceutical Sciences (GB)", the English-taught line
  'ku-pharmaceutical-sciences-dk': 'Pharmaceutical Sciences (DK)',
  'ku-pharmaceutical-sciences': 'Pharmaceutical Sciences (GB)',
  // the fee list shortens "International Business Communication – Intercultural Market Studies"
  'ku-international-business-communication-intercultural-market-studies': 'Intercultural Market',
  // a specialisation line of the bachelor's the fee list names
  'ku-bach-middle-eastern-language-and-society-archaeology-of-the-middle-east': 'Middle Eastern Language and Society',
};
// Left on request, deliberately: Nanoscience and Technology and Water and Environment are Sino-Danish
// Center programmes taught in Beijing, and the fee list sends those to the programme's own website;
// Archaeology of the Middle East, Mesoamerican Studies and the Asian Studies (India) bachelor's are
// not in the fee list at all.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'data/university-of-copenhagen-courses.ts');
const RATE_TO_INR = { DKK: 12.1, USD: 83.5 }; // must match lib/currency.ts RATE_TO_INR
const crawl = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wave-europe/copenhagen-fees.json'), 'utf8'));

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
const matchBySlug = new Map(crawl.matches.map((m) => [m.slug, m]));
const report = { priced: 0, onRequest: [] };

for (const c of rows) {
  delete c.annualEUR; delete c.totalEUR; delete c.annualDKK;
  const m = matchBySlug.get(c.slug);
  const levelKey = c.level === 'Bachelor' ? 'BA' : 'KA';
  let entry = m?.match === 'exact' ? m.picker : null;
  if (MANUAL[c.slug]) {
    entry = crawl.pickerEntries.find((e) => e.level === levelKey && e.name === MANUAL[c.slug]);
    if (!entry) throw new Error(`${c.slug}: manual match "${MANUAL[c.slug]}" is not in the fee list`);
  }
  if (!entry || !entry.feeDKK) {
    c.annualUSD = 0; c.annualINR = 0;
    c.feeVerified = false;
    c.feeScope = 'not published';
    c.feeBasis = entry
      ? 'not published — UCPH\'s fee list refers this programme to its own website for the tuition fee'
      : 'not published — this programme is not in UCPH\'s tuition fee list';
    c.feeSourceUrl = null;
    report.onRequest.push(c.slug);
    continue;
  }
  c.annualDKK = entry.feeDKK;
  c.annualINR = Math.round(entry.feeDKK * RATE_TO_INR.DKK);
  c.annualUSD = Math.round((entry.feeDKK * RATE_TO_INR.DKK) / RATE_TO_INR.USD);
  c.feeVerified = true;
  c.feeScope = 'programme';
  c.feeBasis = `annual tuition fee (60 ECTS, one year of full-time study) for citizens outside the EU, EEA or Switzerland, as stated in UCPH's tuition fee list for "${entry.name}"`;
  c.feeSourceUrl = crawl._source;
  report.priced++;
}

src = src.slice(0, a.start) + JSON.stringify(rows, null, 2) + src.slice(a.end);
src = src.replace(
  'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;',
  'annualDKK?: number; annualUSD: number; annualINR: number; feeScope?: string; feeBasis?: string; feeSourceUrl?: string | null;',
);
if (!src.includes('annualDKK?: number;')) throw new Error('interface not updated — check its fee fields');
fs.writeFileSync(FILE, src);

console.log(`priced ${report.priced} | on request ${report.onRequest.length}:\n  ${report.onRequest.join('\n  ')}`);
