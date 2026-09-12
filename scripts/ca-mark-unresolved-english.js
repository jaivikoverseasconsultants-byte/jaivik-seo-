// Queen's, York and KPU published TIERED English tables (multiple bands by programme group
// / pathway, no stated default). Taking min() off those yields a conditional-or-pathway floor
// — Queen's 5.5, York 5.0, KPU 5.5 — which would publish as a direct-entry minimum and
// understate real entry requirements.
//
// data/english-requirements-verified.ts already rejects exactly this shape for Aston and
// Birmingham (see DATA-AUDIT REJECTED_ROWS). Same treatment here: mark unresolved, keep the
// evidence, ship nothing.
const fs = require('fs');
const p = 'data/wave-canada/institution-english.json';
const store = JSON.parse(fs.readFileSync(p, 'utf8'));

const TIERED = {
  "Queen's University": 'Tiered by faculty/programme group (bands seen: 6.5 / 6.0 / 5.5). No stated institution-wide default.',
  'York University':    'Tiered, and the low bands belong to the ESL/pathway route (bands seen: 6.5 / 5.5 / 6 / 5).',
  'Kwantlen (KPU)':     'Page reached was a PATHWAY page, not the direct-entry requirement (bands seen: 5.5 / 6.0).',
};

for (const [uni, why] of Object.entries(TIERED)) {
  if (!store[uni]) { console.log(`${uni}: absent from store, skipped`); continue; }
  const prev = store[uni];
  store[uni] = {
    ...prev,
    resolved: false,
    unresolvedReason: why,
    doNotPublish: true,
    bandsSeen: { ielts: prev.ielts || [], toefl: prev.toefl || [], pte: prev.pte || [] },
    // blank the scalar fields so the generator falls through to its house default
    // and never silently adopts a pathway floor as a programme minimum
    ielts: [], toefl: [], pte: [],
  };
  console.log(`${uni.padEnd(22)} marked UNRESOLVED — was IELTS ${Math.min(...(prev.ielts || [9]).map(Number))}`);
  console.log(`   ${why}`);
}
fs.writeFileSync(p, JSON.stringify(store, null, 2));
console.log('\nupdated ' + p);
