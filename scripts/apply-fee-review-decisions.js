// Applies the hand-confirmed row-to-category matches from the fee-match review tool.
//
//   node scripts/apply-fee-review-decisions.js
//
// Waterloo, UNB and uOttawa each publish international fees against a category — a faculty, a
// degree, or a programme band — that a course row does not name. Those matches were reviewed one by
// one rather than guessed; data/wave-canada/fee-match-review-decisions.json holds the decisions.
//
// The basis differs by university and is NOT flattened into an annual number:
//   UNB      annual, so it becomes the annual fee.
//   Waterloo a first-year total over two terms including incidental fees, which is already the
//            figure the rest of the Waterloo rows carry.
//   uOttawa  per term, or per unit for a few. uOttawa publishes no annual figure, so those go into
//            their own fields and the annual fee stays unpublished — the same treatment as Windsor,
//            and the decision already taken for uOttawa: show per term, never annualise ourselves.
//
// A decision of "none" means none of the offered categories fitted. Those rows are left on request.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FX = { usd: 0.73, inr: 61 };

const review = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/wave-canada/fee-match-review-decisions.json'), 'utf8'));
const money = (s) => {
  const n = Number(String(s ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false, line = false, block = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (str) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null; continue; }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return { lit: src.slice(start, i + 1), start, end: i + 1 };
  }
  return null;
}

const load = (file) => {
  const full = path.join(ROOT, 'data', file);
  const src = fs.readFileSync(full, 'utf8');
  const a = findArray(src);
  return { full, src, a, rows: eval(`(${a.lit})`) }; // eslint-disable-line no-eval
};
const save = (doc) => {
  const out = doc.src.slice(0, doc.a.start) + JSON.stringify(doc.rows, null, 1) + doc.src.slice(doc.a.end);
  fs.writeFileSync(doc.full, out);
};

const SOURCE = 'https://claude.ai/artifact/EDFVTKdwrc9Aj8yWkJKJQy';
const report = {};

// ── UNB: the decision is an annual figure ────────────────────────────────────
function applyUnb() {
  const doc = load('unb-courses.ts');
  const by = new Map(doc.rows.map((c) => [c.slug, c]));
  let priced = 0; let onRequest = 0; let agreed = 0;
  for (const d of review.decisions.filter((x) => x.uni === 'UNB')) {
    const c = by.get(d.slug); if (!c) continue;
    const fee = money(d.fee);
    if (!fee) {
      c.feeVerified = false; c.annualCAD = 0; c.annualUSD = 0; c.annualINR = 0; c.totalCAD = 0;
      c.feeBasis = 'not published — reviewed against UNB\'s fee calculator and none of its categories covers this programme';
      c.feeSourceUrl = null; onRequest++; continue;
    }
    if (c.feeVerified && Math.abs((c.annualCAD ?? 0) - fee) < 1) agreed++;
    c.annualCAD = fee;
    c.annualUSD = Math.round(fee * FX.usd);
    c.annualINR = Math.round(fee * FX.inr);
    c.totalCAD = Math.round(fee * c.durationYears);
    c.feeVerified = true;
    c.feeScope = 'degree';
    c.feeBasis = `annual international tuition, full-time, 2026-27 — UNB prices by degree, and this programme was confirmed by hand as ${d.choice}`;
    c.feeSourceUrl = 'https://es.unb.ca/apps/tuition-calculator/';
    priced++;
  }
  save(doc);
  report.UNB = { priced, onRequest, alreadyAgreed: agreed };
}

// ── Waterloo: a first-year total across two terms, incidentals included ──────
function applyWaterloo() {
  const doc = load('waterlooug-courses.ts');
  const by = new Map(doc.rows.map((c) => [c.slug, c]));
  let priced = 0; let onRequest = 0;
  for (const d of review.decisions.filter((x) => x.uni === 'Waterloo')) {
    const c = by.get(d.slug); if (!c) continue;
    const fee = money(d.fee);
    if (!fee) {
      c.feeVerified = false; c.annualCAD = 0; c.annualUSD = 0; c.annualINR = 0; c.totalCAD = 0;
      c.feeBasis = 'not published — reviewed against Waterloo\'s first-year fee table and no faculty rate covers this programme';
      onRequest++; continue;
    }
    c.annualCAD = fee;
    c.annualUSD = Math.round(fee * FX.usd);
    c.annualINR = Math.round(fee * FX.inr);
    c.totalCAD = Math.round(fee * c.durationYears);
    c.feeVerified = true;
    c.feeScope = 'faculty';
    c.feeBasis = `first year (two terms), tuition + incidental fees, rounded — confirmed by hand as ${d.choice}`;
    c.feeSourceUrl = 'https://uwaterloo.ca/finance/student-financial-services/tuition-fee-schedules';
    priced++;
  }
  save(doc);
  report.Waterloo = { priced, onRequest };
}

// ── uOttawa: per term, or per unit. No annual figure is published. ───────────
function applyUottawa() {
  const doc = load('uottawa-courses.ts');
  const by = new Map(doc.rows.map((c) => [c.slug, c]));
  let perTerm = 0; let perUnit = 0; let onRequest = 0;
  for (const d of review.decisions.filter((x) => x.uni === 'uOttawa')) {
    const c = by.get(d.slug); if (!c) continue;
    const fee = money(d.fee);
    // the annual fields carried house figures; nothing annual is published, so they are cleared
    c.annualCAD = 0; c.annualUSD = 0; c.annualINR = 0; c.totalCAD = 0;
    c.feeVerified = false;
    c.feeSourceUrl = fee ? 'https://www.uottawa.ca/study/tuition-fees-financial-aid' : null;
    if (!fee) {
      c.termTuitionCAD = null; c.perUnitCAD = null;
      c.feeScope = 'not published';
      c.feeBasis = 'not published — reviewed against uOttawa\'s fee tool and none of its programme bands covers this course';
      onRequest++; continue;
    }
    if (d.basis === 'per unit') {
      c.perUnitCAD = fee; c.termTuitionCAD = null;
      c.feeScope = 'programme band, per unit';
      c.feeBasis = `uOttawa charges this programme by unit: C$${fee.toLocaleString('en-CA')} per unit for an international student, in the band confirmed by hand as ${d.choice}. No annual figure is published, and multiplying it out here would be our arithmetic rather than uOttawa's number.`;
      perUnit++;
    } else {
      c.termTuitionCAD = fee; c.perUnitCAD = null;
      c.termTuitionUSD = Math.round(fee * FX.usd);
      c.termTuitionINR = Math.round(fee * FX.inr);
      c.feeScope = 'programme band, per term';
      c.feeBasis = `uOttawa charges tuition per term, not per year: C$${fee.toLocaleString('en-CA')} per term for an international student, in the band confirmed by hand as ${d.choice}. No annual figure is published, so the yearly total is left out rather than doubled here.`;
      perTerm++;
    }
  }
  // uOttawa publishes NO annual figure for any programme, so no uOttawa row should carry one. The
  // rows outside the review still held house figures (C$32,000, 20,000, 19,000, 24,000, 14,500 and
  // 12,000). Display already suppressed them, but lib/find-my-course.ts matches a student to a
  // budget band on annualINR alone, so a fabricated number could still put someone in the wrong
  // price range. Cleared so the lead-gen tool cannot use them either.
  let cleared = 0;
  for (const c of doc.rows) {
    if (!(Number(c.annualCAD) > 0 || Number(c.annualINR) > 0)) continue;
    c.annualCAD = 0; c.annualUSD = 0; c.annualINR = 0; c.totalCAD = 0;
    c.feeVerified = false;
    if (!c.feeBasis) {
      c.feeScope = 'not published';
      c.feeBasis = 'not published — uOttawa states fees per term or per unit, never as an annual figure, and this programme was not part of the reviewed set';
      c.feeSourceUrl = null;
    }
    cleared++;
  }

  save(doc);
  report.uOttawa = { perTerm, perUnit, onRequest, houseFiguresCleared: cleared };
}

applyUnb();
applyWaterloo();
applyUottawa();

for (const [uni, r] of Object.entries(report)) {
  console.log(`${uni.padEnd(9)} ${Object.entries(r).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
}
