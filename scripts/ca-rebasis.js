// Re-derive the annual/total basis for already-crawled fees from their stored evidence.
// Durham publishes "Year one international: $19,194 (CAD)" — an explicitly annual basis
// that the first basis regex ("per year"/"annual") did not recognise. TMU publishes
// "International: $44,476" with no basis stated anywhere in the sentence, so it stays
// 'unknown' and therefore unverified. The distinction is the whole point: we only mark a
// fee verified where the source itself asserts the basis.
const fs = require('fs');

const ANNUAL = /\byear one\b|\byear 1\b|\bfirst year\b|per year|per annum|per academic year|annually|\/ ?year|\bannual\b|each year/i;
const TOTAL  = /\btotal\b|entire program|full program|program fee|whole program|over the program/i;

const files = fs.readdirSync('data/wave-canada').filter(f => f.endsWith('-detail.json'));
for (const f of files) {
  const p = 'data/wave-canada/' + f;
  const rows = JSON.parse(fs.readFileSync(p, 'utf8'));
  const before = {};
  const after = {};
  let changed = 0;
  for (const r of rows) {
    for (const t of (r.tuitionIntl || [])) {
      before[t.basis] = (before[t.basis] || 0) + 1;
      const ev = t.evidence || '';
      // TOTAL wins only if annual is absent — "total" often appears in nav text nearby.
      const next = ANNUAL.test(ev) ? 'annual' : (TOTAL.test(ev) ? 'total' : 'unknown');
      if (next !== t.basis) { t.basis = next; changed++; }
      after[next] = (after[next] || 0) + 1;
    }
  }
  fs.writeFileSync(p, JSON.stringify(rows, null, 2));
  console.log(`${f.padEnd(28)} changed=${String(changed).padStart(4)}  now ${JSON.stringify(after)}`);
}
