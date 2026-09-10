// Quantify the title change on the dominant template.
//
// The over/under counts alone understate the work: a course title can shed 55 characters
// and still sit above the truncation point, because " | Jaivik Overseas Consultants" is
// 30 characters before the descriptive half even starts. What actually matters is how much
// of the useful text now survives truncation, so this measures the reduction directly.
//
// The "before" text is reconstructed exactly, not estimated: pass 1 removed a known literal
// (" — " + optional "Fees in INR, " + "IELTS & Requirements for Indian Students"), and the
// fee fragment is recoverable from whether the built page shows a verified fee.

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out', 'universities');
const PIXEL_LIMIT = 561;
const NARROW = "iljtfr.,;:'|!()[]-";
const WIDE = 'mwMW@%';
const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function pxWidth(s) {
  let w = 0;
  for (const ch of s) {
    if (ch === ' ') w += 4.6;
    else if (NARROW.includes(ch)) w += 4.4;
    else if (WIDE.includes(ch)) w += 15.5;
    else if (CAPS.includes(ch)) w += 12.2;
    else if (ch >= '0' && ch <= '9') w += 10.0;
    else w += 9.6;
  }
  return Math.round(w);
}

const decode = s => s.replace(/&amp;/g, '&').replace(/&#0?39;/g, "'")
  .replace(/&quot;/g, '"').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

const BRAND = ' | Jaivik Overseas Consultants';
const SUFFIX_PLAIN = ' — IELTS & Requirements for Indian Students';
const SUFFIX_FEE = ' — Fees in INR, IELTS & Requirements for Indian Students';

const after = [], before = [];
let feeCount = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.html')) continue;
    // only course-detail pages: /universities/<uni>/courses/<slug>.html
    const rel = path.relative(OUT, p).split(path.sep);
    if (rel.length !== 3 || rel[1] !== 'courses') continue;

    const html = fs.readFileSync(p, 'utf8');
    const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
    if (!m) continue;
    const now = decode(m[1]);
    after.push(now);

    // Reconstruct the pre-change title: the removed literal sat before the brand suffix.
    const head = now.endsWith(BRAND) ? now.slice(0, -BRAND.length) : now;
    const hadFee = /Fees in INR/.test(html) && !/Fee on request|On request/.test(html.slice(0, 40000));
    if (hadFee) feeCount++;
    before.push(head + (hadFee ? SUFFIX_FEE : SUFFIX_PLAIN) + BRAND);
  }
}

walk(OUT);

const stat = arr => {
  const px = arr.map(pxWidth).sort((a, b) => a - b);
  const ch = arr.map(s => s.length).sort((a, b) => a - b);
  return {
    n: arr.length,
    medianPx: px[Math.floor(px.length / 2)],
    meanPx: Math.round(px.reduce((a, b) => a + b, 0) / px.length),
    medianChars: ch[Math.floor(ch.length / 2)],
    overPx: px.filter(v => v > PIXEL_LIMIT).length,
  };
};

const b = stat(before), a = stat(after);
console.log('course-detail pages measured: ' + a.n + '\n');
console.log('                     before      after     change');
console.log('median chars   ' + String(b.medianChars).padStart(10) + String(a.medianChars).padStart(11) +
  String('-' + (b.medianChars - a.medianChars)).padStart(11));
console.log('median px      ' + String(b.medianPx).padStart(10) + String(a.medianPx).padStart(11) +
  String('-' + (b.medianPx - a.medianPx)).padStart(11));
console.log('mean px        ' + String(b.meanPx).padStart(10) + String(a.meanPx).padStart(11) +
  String('-' + (b.meanPx - a.meanPx)).padStart(11));
console.log('over 561px     ' + String(b.overPx).padStart(10) + String(a.overPx).padStart(11) +
  String('-' + (b.overPx - a.overPx)).padStart(11));
console.log('\nexample:');
console.log('  before: ' + before[0]);
console.log('  after:  ' + after[0]);
