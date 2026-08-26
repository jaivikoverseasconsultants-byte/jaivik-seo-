// Regression guard for the interim tuition-fee suppression (BUILD-LOG §2 item 16).
//
// Why this exists: `isFeeVerified()` in lib/fee-verification.ts treats a MISSING
// `feeVerified` field as verified. That is deliberate — it keeps the ~28 universities
// whose fees were confirmed real (the 9 Australian files re-crawled in Aug 2026,
// Hamburg's genuine flat €800 semester contribution, etc.) showing their real figures
// instead of blanket-suppressing them. The corollary is a footgun: a NEW data file
// added without the flag silently publishes its fees as if they had been verified,
// and a new course template that prints a fee without going through the helpers
// re-opens exactly the surfaces closed on 2026-08-25.
//
// So this script fails on:
//   1. a live-route data file with priced rows, no feeVerified flags, and no allowlist entry
//   2. a course template that does not import lib/fee-verification at all
//   3. a template that hardcodes "Fees in INR" instead of calling titleFeeFragment()
//   4. a template that prints "costs ₹${...}" instead of calling feeSentenceINR()
//   5. a single-quoted string containing ${...} (renders as literal source text —
//      this bug has now shipped twice, see BUILD-LOG §2 items 15 and 16)
//   6. an index page emitting JSON-LD offers.price without an isFeeVerified guard
//
// Read-only. Run from the repo root:  node scripts/audit-fee-verification.js
// Exit code 1 means something regressed.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app', 'universities');
const DATA = path.join(ROOT, 'data');
const NATIVE = ['annualGBP', 'annualAUD', 'annualNZD', 'annualCAD',
  'annualEUR', 'annualSGD', 'annualAED', 'annualUSD'];

// ── Allowlist ───────────────────────────────────────────────────────────────
// Data files that legitimately carry NO feeVerified flag, i.e. whose fees are
// trusted as-is. Adding a file here is a deliberate claim that its fees are real.
// If you are adding a new university and reached for this list to make the audit
// pass — that is the wrong fix. Flag the rows `feeVerified: false` instead until
// the fees are confirmed against the provider's own pages.
const UNFLAGGED_OK = {
  // Nine Australian files re-crawled with real per-course fees, Aug 2026
  // (high distinct-value counts are the evidence — see reports/flat-fee-scan-2026-08-18.json)
  'adelaide-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'usyd-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'uom-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'uts-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'vu-sydney-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'flinders-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'rmit-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'anu-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'cdu-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'griffith-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'uow-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'ecu-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'unisc-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',
  'murdoch-courses.ts': 'AU re-crawl 2026-08 — real per-course fees',

  // Genuinely uniform, and genuinely real
  'uham-courses.ts':
    'all 46 courses cost €800/yr — Hamburg charges no tuition, only a semester ' +
    'contribution. Uniform because it is true, not because it was fabricated.',

  // Judged clean by the 2026-08-18 flat-fee scan; Wave 2 integration additionally
  // nulled implausible fees in these at integration time (BUILD-LOG §3).
  'londonmet-courses.ts': 'scan-clean 2026-08-18',
  'derby-courses.ts': 'scan-clean 2026-08-18',
  'bmouth-courses.ts': 'scan-clean 2026-08-18',
  'uea-courses.ts': 'scan-clean 2026-08-18',
  'glos-courses.ts': 'scan-clean 2026-08-18',
  'hertfordshire-courses.ts': 'scan-clean 2026-08-18',
  'westlondon-courses.ts': 'scan-clean 2026-08-18',
  'nottinghamtrent-courses.ts': 'scan-clean 2026-08-18',
  'uwe-courses.ts': 'scan-clean 2026-08-18',
  'chester-courses.ts': 'scan-clean 2026-08-18',
  'suffolk-courses.ts': 'scan-clean 2026-08-18',
  'roeham-courses.ts': 'scan-clean 2026-08-18',
  'bocconi-university-courses.ts': 'scan-clean 2026-08-18',
  'greenwich-courses.ts': 'Wave 2 — fees reviewed at integration',
  'qmul-courses.ts': 'Wave 2 — fees reviewed at integration',
  'aston-courses.ts': 'Wave 2 — fees reviewed at integration',
  'kaplan-courses.ts': 'Wave 2 — fees reviewed at integration',
  'uclan-courses.ts': 'Wave 2 — implausible fees nulled at integration',
  'brunel-w2-courses.ts': 'Wave 2 — fees reviewed at integration',
  'plymouth-w2-courses.ts': 'Wave 2 — fees reviewed at integration',
  'unsw-w2-courses.ts': 'Wave 2 — fees reviewed at integration',
};

const failures = [];
const notes = [];

// ── Collect live course routes and the data file each imports ───────────────
const routes = [];
for (const uni of fs.readdirSync(APP)) {
  const slugPage = path.join(APP, uni, 'courses', '[slug]', 'page.tsx');
  if (!fs.existsSync(slugPage)) continue;
  const src = fs.readFileSync(slugPage, 'utf8');
  const dataFiles = [...src.matchAll(/from\s+['"]@\/data\/([\w.-]+)['"]/g)]
    .map(m => m[1] + '.ts')
    .filter(f => fs.existsSync(path.join(DATA, f)));
  routes.push({ uni, slugPage, src, dataFiles });
}

// ── 1. data files: priced but unflagged and not allowlisted ─────────────────
const seen = new Set();
for (const r of routes) {
  for (const f of r.dataFiles) {
    if (seen.has(f)) continue;
    seen.add(f);
    let mod;
    try { mod = require(path.join(DATA, f)); }
    catch (e) { failures.push(`[data] ${f}: could not load — ${e.message.split('\n')[0]}`); continue; }

    let arr = null;
    for (const k of Object.keys(mod)) {
      const v = mod[k];
      if (Array.isArray(v) && v.length && v[0] && 'slug' in v[0] && (!arr || v.length > arr.length)) arr = v;
    }
    if (!arr) continue;

    const cur = NATIVE.find(k => arr.some(c => typeof c[k] === 'number' && c[k] > 0));
    if (!cur) continue;                                     // no priced catalogue, nothing to claim
    const priced = arr.filter(c => c[cur] > 0);
    if (!priced.length) continue;
    const flagged = arr.filter(c => c.feeVerified !== undefined).length;

    if (flagged === 0 && !UNFLAGGED_OK[f]) {
      failures.push(
        `[data] ${f} (${r.uni}): ${priced.length} priced courses, ` +
        `${new Set(priced.map(c => c[cur])).size} distinct ${cur} values, and NO feeVerified flag — ` +
        `these fees will publish as verified. Flag them \`feeVerified: false\` until confirmed ` +
        `against the provider's own pages, or add an allowlist entry in this script explaining why they are real.`);
    }
    if (flagged > 0 && UNFLAGGED_OK[f]) {
      notes.push(`[data] ${f} is allowlisted but now carries ${flagged} flags — the allowlist entry can be removed.`);
    }
  }
}

// ── helper: single-quoted strings on a line, ignoring backtick literals ─────
function singleQuotedStrings(line) {
  const out = [];
  let i = 0, mode = null, buf = '';
  while (i < line.length) {
    const ch = line[i];
    if (mode === null) {
      if (ch === '`') mode = '`';
      else if (ch === '"') mode = '"';
      else if (ch === "'") { mode = "'"; buf = ''; }
    } else if (ch === '\\') { i += 2; continue; }
    else if (ch === mode) {
      if (mode === "'") out.push(buf);
      mode = null;
    } else if (mode === "'") buf += ch;
    i++;
  }
  return out;
}

// ── 2-5. course templates ───────────────────────────────────────────────────
for (const r of routes) {
  const rel = `app/universities/${r.uni}/courses/[slug]/page.tsx`;

  if (!/from\s+['"]@\/lib\/fee-verification['"]/.test(r.src))
    failures.push(`[template] ${rel}: does not import lib/fee-verification — any fee it prints is unguarded.`);

  if (/Fees in INR/.test(r.src))
    failures.push(`[template] ${rel}: hardcodes "Fees in INR" in the title or <h1>. Use titleFeeFragment().`);

  if (/costs\s*₹\$\{/.test(r.src))
    failures.push(`[template] ${rel}: prints "costs ₹\${...}" in the meta description. Use feeSentenceINR().`);

  r.src.split('\n').forEach((line, i) => {
    for (const s of singleQuotedStrings(line)) {
      if (s.includes('${'))
        failures.push(`[template] ${rel}:${i + 1}: single-quoted string contains \${...} — renders as literal ` +
          `source text, not a value. Use a backtick template literal.  ${s.slice(0, 70)}`);
    }
  });
}

// ── 6. index pages: JSON-LD offers.price must be guarded ────────────────────
for (const uni of fs.readdirSync(APP)) {
  const p = path.join(APP, uni, 'courses', 'page.tsx');
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  const rel = `app/universities/${uni}/courses/page.tsx`;
  src.split('\n').forEach((line, i) => {
    if (!/'@type':\s*'Offer'/.test(line) && !/"@type":\s*"Offer"/.test(line)) return;
    // the guard may sit on this line or the one opening the conditional above it
    const ctx = src.split('\n').slice(Math.max(0, i - 2), i + 1).join(' ');
    if (!/isFeeVerified/.test(ctx))
      failures.push(`[index] ${rel}:${i + 1}: JSON-LD offers.price is emitted without an isFeeVerified guard — ` +
        `this publishes a machine-readable price to Google for an unverified fee.`);
  });
}

// ── 7. shared components that render a fee must import the helpers ──────────
//
// Added 2026-08-25 after the first sweep checked only app/universities/** and
// missed components/ entirely — CourseRichContent and CourseKeyFacts were shipping
// "GBP 27,500 / ₹29.4 lakh/year" and a JSON-LD offers.price on suppressed pages.
// A shared component leaks on EVERY course page at once, so it matters more than
// any single template.
//
// Known-outstanding: aggregate pages that quote a fee RANGE or median across many
// courses (min/max/median over a mixed verified+unverified set). Those need a
// decision about what an honest range over partially-verified data even means,
// which is tracked as backlog, not silently ignored.
const AGGREGATE_BACKLOG = {
  'components/SubjectPillarPage.tsx': 'fee range/median across many courses — backlog',
  'components/CourseMatcherClient.tsx': 'fee in a generated shortlist export — backlog',
  'lib/cost-pillars.ts': 'min/max/median fee bands — backlog',
  'lib/country-subject-comparisons.ts': 'min/max fee range — backlog',
  'lib/courseContent.ts': 'prose fee mention — backlog',
  'lib/find-my-course.ts': 'matcher scoring over fees — backlog',
  'lib/subject-pillars.ts': 'pillar fee aggregates — backlog',
  'lib/university-comparisons.ts': 'comparison fee aggregates — backlog',
  'lib/generate-shortlist-pdf.ts': 'PDF shortlist fees — backlog',
};
const PER_COURSE_FEE = /\b(?:annual|total)(?:GBP|USD|INR|AUD|NZD|CAD|EUR|SGD|AED)\b/;
const RENDERS = /`|toLocaleString\(|toFixed\(|value:|text:|label:|price:/;

for (const dir of ['components', 'lib']) {
  for (const file of fs.readdirSync(path.join(ROOT, dir))) {
    if (!/\.tsx?$/.test(file)) continue;
    const rel = `${dir}/${file}`;
    if (AGGREGATE_BACKLOG[rel]) { notes.push(`[backlog] ${rel}: ${AGGREGATE_BACKLOG[rel]}`); continue; }
    const src = fs.readFileSync(path.join(ROOT, dir, file), 'utf8');
    if (rel === 'lib/fee-verification.ts') continue;               // the helpers themselves
    if (!PER_COURSE_FEE.test(src)) continue;

    const rendersAFee = src.split('\n').some(ln =>
      PER_COURSE_FEE.test(ln) && RENDERS.test(ln) &&
      !/^\s*(\/\/|\*)/.test(ln.trim()) &&
      !/^\s*\w+\??\s*:\s*(number|string|null)/.test(ln.trim()));
    if (!rendersAFee) continue;

    if (!/from\s+['"](@\/lib\/fee-verification|\.\/fee-verification)['"]/.test(src))
      failures.push(`[shared] ${rel}: renders a per-course fee but does not import lib/fee-verification. ` +
        `A shared component leaks on every course page at once — gate it with isFeeVerified()/feeDisplay*(), ` +
        `or add it to AGGREGATE_BACKLOG in this script if it only quotes an aggregate range.`);
  }
}

// ── 8. currency conversion must go through lib/currency.ts ──────────────────
//
// Added 2026-08-26. Conversion used to happen three ways at once — a private rate
// table, ~180 multipliers inlined in templates (`* 107 / 100000` for GBP, `* 84`
// for USD, `* 0.65 * 84` for AUD), and an `annualINR` baked into each record at
// crawl time. They disagreed: leeds/auckland/strath each carried TWO different
// baked rates internally, so two courses on one page converted differently.
//
// Now everything reads RATE_TO_INR from lib/currency.ts. These checks keep it that
// way: an inlined multiplier or a raw baked-annualINR read is a regression.
const CONVERSION_DIRS = ['app', 'components', 'lib'];
const INLINE_RATE = /\*\s*(?:0\.\d+\s*\*\s*)?\d{2,3}(?:\.\d+)?\s*\/\s*100000/;
const BAKED_INR = /\bannualINR\s*\/\s*100000\s*\)?\s*\.toFixed/;

function walkTs(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // exact directory names — a substring match here would skip bournem-OUT-h,
    // s-OUT-hampton, portsm-OUT-h and friends, which is exactly how the first
    // pass of this refactor silently missed 16 files.
    if (e.isDirectory()) { if (!['node_modules', '.next', 'out'].includes(e.name)) walkTs(p, fn); continue; }
    if (/\.tsx?$/.test(e.name)) fn(p);
  }
}

for (const d of CONVERSION_DIRS) {
  const abs = path.join(ROOT, d);
  if (!fs.existsSync(abs)) continue;
  walkTs(abs, (p) => {
    const rel = path.relative(ROOT, p).replace(/\\/g, '/');
    if (rel === 'lib/currency.ts') return;                 // the table's own docs
    const src = fs.readFileSync(p, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;         // comments
      if (INLINE_RATE.test(line) && !/RATE_TO_INR/.test(line))
        failures.push(`[currency] ${rel}:${i + 1}: inlined conversion multiplier — use RATE_TO_INR from lib/currency.ts.  ${line.trim().slice(0, 90)}`);
      else if (BAKED_INR.test(line) && !/courseAnnualINR/.test(line))
        failures.push(`[currency] ${rel}:${i + 1}: reads the baked annualINR — use courseAnnualINRLakh() from lib/currency.ts.  ${line.trim().slice(0, 90)}`);
    });
  });
}

// ── report ──────────────────────────────────────────────────────────────────
console.log('=== Audit: tuition-fee verification guards ===');
console.log(`Live course routes checked:      ${routes.length}`);
console.log(`Data files behind them:          ${seen.size}`);
console.log(`Allowlisted as genuinely real:   ${Object.keys(UNFLAGGED_OK).length}`);
console.log('');

if (notes.length) {
  console.log('Notes (not failures):');
  notes.forEach(n => console.log('  ' + n));
  console.log('');
}

if (!failures.length) {
  console.log('PASS — no unguarded fee surface found.');
  process.exit(0);
}
console.log(`FAIL — ${failures.length} problem(s):`);
failures.forEach(f => console.log('  ' + f));
console.log('');
console.log('See BUILD-LOG.md §2 item 16 for what each guard protects and why.');
process.exit(1);
