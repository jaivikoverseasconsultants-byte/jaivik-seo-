// Corrective pass on institution-facts.json.
// The first pass hit two known traps (fee-crawl-traps #1 and a residence-fee lookalike):
//   - Manitoba's $100 is the DOMESTIC application fee; international is $130.
//   - Dalhousie's and TMU's $50 came from a RESIDENCE application fee page, not admissions.
//   - TMU's $500 deposit is explicitly the DOMESTIC amount.
// This re-fetches the authoritative fee pages and only keeps a value whose evidence
// sentence also names the international/undergraduate context.
const { execFileSync } = require('child_process');
const fs = require('fs');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function get(u) {
  try { return execFileSync('curl', ['-sL','-A',UA,'-m','35','--compressed','-w','\n@@%{http_code}@@',u],
    { maxBuffer: 6e7, encoding: 'utf8' }); } catch { return ''; }
}
const plain = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  .replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ').trim();

const TARGETS = [
  ['University of Manitoba', 'applicationFee', [
    'https://umanitoba.ca/admissions/undergraduate/how-to-apply',
    'https://umanitoba.ca/admissions/undergraduate/international',
  ]],
  ['Dalhousie University', 'applicationFee', [
    'https://www.dal.ca/study/admissions/undergraduate/how-to-apply.html',
    'https://www.dal.ca/admissions/undergraduate/apply.html',
    'https://www.dal.ca/study/admissions/undergraduate.html',
  ]],
  ['Toronto Metropolitan', 'applicationFee', [
    'https://www.torontomu.ca/admissions/undergraduate/how-to-apply/',
    'https://www.torontomu.ca/undergraduate/admission/apply/',
  ]],
  ['Toronto Metropolitan', 'deposit', [
    'https://www.torontomu.ca/admissions/undergraduate/after-applying/admitted-students/international/',
    'https://www.torontomu.ca/student-fees/tuition-deposit/',
  ]],
];

const store = JSON.parse(fs.readFileSync('data/wave-canada/institution-facts.json', 'utf8'));

// Anything matching a residence/housing context is never an admission application fee.
const RESIDENCE = /residence|housing|dormitory|meal plan/i;

for (const [uni, field, urls] of TARGETS) {
  let best = null;
  for (const u of urls) {
    const raw = get(u);
    if (!/@@200@@/.test(raw)) continue;
    const t = plain(raw.replace(/@@\d{3}@@\s*$/, ''));
    const word = field === 'deposit' ? 'deposit' : 'application fee';
    const re = new RegExp('([^.]{0,140}' + word + '[^.]{0,140})', 'gi');
    for (const m of t.matchAll(re)) {
      const sent = m[1];
      if (RESIDENCE.test(sent)) continue;
      const amounts = [...sent.matchAll(/\$\s?([\d,]{2,8})/g)].map(x => parseInt(x[1].replace(/,/g, ''), 10));
      const intl = /international|non-?canadian|visa student/i.test(sent);
      for (const n of amounts) {
        const lo = field === 'deposit' ? 100 : 20, hi = field === 'deposit' ? 25000 : 500;
        if (n < lo || n > hi) continue;
        const cand = { amountCAD: n, sourceUrl: u, international: intl, evidence: sent.slice(0, 200) };
        if (!best || (intl && !best.international)) best = cand;
      }
    }
    if (best && best.international) break;
  }
  const prev = store[uni] && store[uni][field];
  if (best) {
    store[uni][field] = best;
    console.log(`${uni} · ${field}: ${prev ? prev.amountCAD : '—'} -> ${best.amountCAD}  (intl-context: ${best.international})`);
    console.log(`   ${best.sourceUrl}`);
    console.log(`   «${best.evidence.slice(0, 150)}»`);
  } else {
    store[uni][field] = { unresolved: true, note: 'first-pass value was a residence/domestic figure; no international admissions figure located', previous: prev || null };
    console.log(`${uni} · ${field}: DROPPED (was ${prev ? prev.amountCAD : '—'}) — no verifiable international figure`);
  }
}

// Scholarships: the first pass matched named/domestic-only/niche awards. Not shippable.
for (const uni of Object.keys(store)) {
  if (store[uni].scholarship) {
    store[uni].scholarship = { ...store[uni].scholarship, verified: false,
      note: 'auto-extracted; may be a domestic-only or niche award. Needs manual confirmation before publishing.' };
  }
}
fs.writeFileSync('data/wave-canada/institution-facts.json', JSON.stringify(store, null, 2));
console.log('\nupdated data/wave-canada/institution-facts.json');
