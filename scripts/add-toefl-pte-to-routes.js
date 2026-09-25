// Makes TOEFL and PTE visible on the course pages whose templates only ever rendered IELTS.
//
//   node scripts/add-toefl-pte-to-routes.js [--write]
//
// 93 of 124 course routes showed an IELTS row and nothing else, so verified TOEFL and PTE scores
// were stored, correctly gated, and invisible — McMaster's corrected TOEFL 86 and TMU's
// column-split TOEFL never reached a page. The other 31 routes already render all three through
// publishedScore(), so this propagates an idiom that exists rather than inventing one.
//
// Nothing about the gating changes. publishedScore() returns null unless that university publishes
// that test, so a suppressed score stays suppressed; this only gives the ones that pass the gate
// somewhere to appear.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');

const ROUTES = fs.readdirSync(path.join(ROOT, 'app/universities'))
  .map((u) => ({ uni: u, file: path.join('app/universities', u, 'courses/[slug]/page.tsx') }))
  .filter((r) => fs.existsSync(path.join(ROOT, r.file)));

// These templates express the IELTS fact in three ways, so match the entry itself rather than one
// predicate: a spread that yields an array, or a ternary that yields an object or null. The
// condition differs between them and is irrelevant here — what matters is the shape being added to.
// The label is 'IELTS' in some templates and 'IELTS Minimum' in others, and the course variable is
// `course` in most but `c` in a few — so both are read off the matched line rather than assumed.
const IELTS_SPREAD = /^([ \t]*)\.\.\.\([^\n]*?\?\s*\[\{ label: 'IELTS(?: Min(?:imum)?)?',[^\n]*\}\]\s*:\s*\[\]\),$/m;
const IELTS_TERNARY = /^([ \t]*)[^\n]*?\?\s*\{ label: 'IELTS(?: Min(?:imum)?)?',[^\n]*\}\s*:\s*null,$/m;

const spreadEntry = (indent, v, test, label, field) =>
  `${indent}...(publishedScore(UNIVERSITY_SLUG, ${v} as never, '${test}') ? [{ label: '${label}', value: \`\${${v}.${field}}+\` }] : []),`;
const ternaryEntry = (indent, v, test, label, field) =>
  `${indent}publishedScore(UNIVERSITY_SLUG, ${v} as never, '${test}') ? { label: '${label}', value: \`\${${v}.${field}}+\` } : null,`;

// Not every university's course type carries all three scores — 13 have no pteMin at all. Adding a
// row for a field the data does not have is a type error, so each university is asked what it holds
// before an entry is written for it.
const registrySrc = fs.readFileSync(path.join(ROOT, 'data/university-course-registry.ts'), 'utf8');
const fileOf = new Map();
for (const m of registrySrc.matchAll(/import \{\s*\w+ as (m_\w+)\s*\} from '\.\/([\w-]+)';/g)) fileOf.set(m[1], `${m[2]}.ts`);
const dataFileFor = new Map();
for (const m of registrySrc.matchAll(/^\s*'([a-z0-9-]+)':\s*([^,\n]+),/gm)) {
  const f = (m[2].match(/m_\w+/g) || []).map((x) => fileOf.get(x)).filter(Boolean)[0];
  if (f) dataFileFor.set(m[1], f);
}
function fieldsPresent(uni) {
  const f = dataFileFor.get(uni);
  if (!f) return { toeflMin: true, pteMin: true }; // unregistered: leave as-is and let tsc judge
  let src;
  try { src = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'); } catch { return { toeflMin: true, pteMin: true }; }
  const iface = src.match(/export interface \w+ \{[\s\S]*?\n\}/);
  const scope = iface ? iface[0] : src.slice(0, 4000);
  return { toeflMin: /\btoeflMin\b/.test(scope), pteMin: /\bpteMin\b/.test(scope) };
}

const changed = []; const skipped = []; const already = []; const partial = [];

for (const r of ROUTES) {
  const full = path.join(ROOT, r.file);
  let src = fs.readFileSync(full, 'utf8');

  if (/publishedScore\(UNIVERSITY_SLUG, course as never, 'toefl'\)/.test(src)) { already.push(r.uni); continue; }

  const spread = src.match(IELTS_SPREAD);
  const ternary = spread ? null : src.match(IELTS_TERNARY);
  const m = spread || ternary;
  if (!m) { skipped.push({ uni: r.uni, why: 'renders no IELTS row to sit beside (description only)' }); continue; }

  const indent = m[1];
  const v = (m[0].match(/\$\{(\w+)\.ieltsMin\}/) || [])[1];
  if (!v) { skipped.push({ uni: r.uni, why: 'could not tell which variable holds the course' }); continue; }
  const make = spread ? spreadEntry : ternaryEntry;
  const has = fieldsPresent(r.uni);
  const lines = [m[0]];
  if (has.toeflMin) lines.push(make(indent, v, 'toefl', 'TOEFL', 'toeflMin'));
  if (has.pteMin) lines.push(make(indent, v, 'pte', 'PTE', 'pteMin'));
  if (lines.length === 1) { skipped.push({ uni: r.uni, why: 'its course type carries neither toeflMin nor pteMin' }); continue; }
  if (!has.toeflMin || !has.pteMin) partial.push(`${r.uni} (no ${[!has.toeflMin && 'toeflMin', !has.pteMin && 'pteMin'].filter(Boolean).join(' or ')})`);
  src = src.replace(m[0], lines.join('\n'));

  // make sure publishedScore is imported from the English lib
  if (!/\bpublishedScore\b/.test(src.split('\n').filter((l) => l.startsWith('import')).join('\n'))) {
    const imp = src.match(/^import \{([^}]*)\} from '@\/lib\/english-verification';$/m);
    if (!imp) { skipped.push({ uni: r.uni, why: 'no english-verification import to extend' }); continue; }
    src = src.replace(imp[0], `import {${imp[1].replace(/\s*$/, '')}, publishedScore } from '@/lib/english-verification';`);
  }

  if (WRITE) fs.writeFileSync(full, src);
  changed.push(r.uni);
}

console.log(WRITE ? 'WRITING\n' : 'DRY RUN — pass --write to apply\n');
console.log(`course routes:                 ${ROUTES.length}`);
console.log(`already showed TOEFL/PTE:      ${already.length}`);
console.log(`TOEFL + PTE rows added:        ${changed.length}`);
console.log(`left for individual handling:  ${skipped.length}`);
skipped.forEach((s) => console.log(`   ${s.uni.padEnd(42)} ${s.why}`));
if (partial.length) {
  console.log(`
added only the test their data carries: ${partial.length}`);
  partial.forEach((p) => console.log(`   ${p}`));
}
