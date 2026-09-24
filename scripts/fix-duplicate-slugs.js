// Gives every course its own slug, so courses that currently share one stop shadowing each other.
//
//   node scripts/fix-duplicate-slugs.js [--write]
//
// The problem: 22 data files contain slugs used by two or more rows. A course page resolves its
// slug with .find(), so only the FIRST row of each group ever renders — the others hold real,
// crawled data that nothing on the site can reach. Nearly all of them are the same subject at two
// study levels (Groningen teaches American Studies as both a Bachelor and a Master).
//
// URL stability: the first row of each group keeps its slug untouched, because that is the row
// currently answering that URL. Only the shadowed rows are renamed, and a shadowed row has no URL
// today, so nothing that exists is moved or removed and no redirect is owed.
//
// The new slug is descriptive, not a counter: the suffix comes from whichever field actually
// separates the rows — award, study level, duration, campus, the distinguishing words of the name,
// or a segment of the course's own URL. A numeric suffix is the last resort.
//
// Rows that are identical in every field are true duplicates: a second URL for them would be
// duplicate content, so they are reported for removal rather than renamed.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');

// same reader the coverage audit uses: balance brackets, then evaluate
function findArray(src) {
  const m = src.match(/export const \w+(?:\s*:\s*[\w[\]<>]+)?\s*=\s*\[/);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  let depth = 0, str = null, esc = false, line = false, block = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (str) {
      if (esc) esc = false; else if (c === '\\') esc = true; else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { str = c; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return src.slice(start, i + 1);
  }
  return null;
}

const SLUG_LITERAL = /(["']?)slug\1\s*:\s*(["'])((?:[^"'\\]|\\.)*)\2/g;

// Some rows are not courses at all: a crawler picked up page furniture and campus-life links.
// Unshadowing those would publish thin pages, so they keep their current state — invisible — and
// are reported instead. Deliberately narrow: it names what was actually found, and a URL that is
// only a fragment of another page is never a course in its own right.
const NOT_A_COURSE = [
  /^skip to /i, /^search for a course/i, /^frequently asked questions/i,
  /^enrolling$/i, /^orientation$/i, /intakes$/i, /^study levels/i, /^course delivery/i,
  /^living (in residence|off campus)$/i,
];
const isNotACourse = (row) => NOT_A_COURSE.some((re) => re.test(String(row.name || '')))
  || /#/.test(String(row.url || ''));
const tok = (s) => String(s ?? '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Suffix candidates, best first. Only fields that actually differ inside the group are considered —
// appending "postgraduate" to rows that are all postgraduate would say nothing.
const MAX_SUFFIX_WORDS = 3;
const MAX_SLUG = 80;

function candidates(row, group, base) {
  const differs = (k) => new Set(group.map((r) => JSON.stringify(r[k]))).size > 1;
  const have = new Set(base.split('-'));
  const out = [];
  // Keep only words the base does not already carry, and keep it short: repeating the course name
  // back at itself produced slugs like "...-anatomy-developmental-and-human-biology-".
  const push = (v) => {
    const words = tok(v).split('-').filter((w) => w && !have.has(w));
    if (!words.length) return;
    const t = words.slice(0, MAX_SUFFIX_WORDS).join('-');
    if (t) out.push(t);
  };

  if (differs('level')) push(row.level);
  if (differs('studyLevel')) push(row.studyLevel);
  if (differs('duration')) push(row.duration);
  if (differs('campus')) push(row.campus);
  if (differs('name')) push(row.name);
  if (differs('url') && row.url) {
    const segs = String(row.url).split(/[?#]/)[0].replace(/\/+$/, '').split('/').filter(Boolean);
    for (const s of segs.slice(-2).reverse()) {
      const t = tok(s).split('-').filter((w) => w && !have.has(w)).slice(0, MAX_SUFFIX_WORDS).join('-');
      if (t && t.length > 2) { out.push(t); break; }
    }
  }
  return [...new Set(out)].filter(Boolean);
}

const summary = [];
let totalRenamed = 0; let totalDuplicates = 0; let totalNotCourses = 0;
const duplicateRows = []; const notCourseRows = []; const allChanges = [];

for (const file of fs.readdirSync(path.join(ROOT, 'data')).filter((f) => /-courses\.ts$/.test(f))) {
  const full = path.join(ROOT, 'data', file);
  const src = fs.readFileSync(full, 'utf8');
  const lit = findArray(src);
  if (!lit) continue;
  let rows;
  try { rows = eval(`(${lit})`); } catch { continue; } // eslint-disable-line no-eval
  if (!Array.isArray(rows) || !rows.length) continue;

  const counts = new Map();
  rows.forEach((r) => counts.set(r.slug, (counts.get(r.slug) || 0) + 1));
  if (![...counts.values()].some((n) => n > 1)) continue;

  // positional rewrite: the Nth slug literal in the file is the Nth row
  const matches = [...src.matchAll(SLUG_LITERAL)];
  if (matches.length !== rows.length || rows.some((r, i) => r.slug !== matches[i][3])) {
    summary.push({ file, skipped: 'slug literals do not line up with rows; not safe to rewrite positionally' });
    continue;
  }

  const taken = new Set(rows.map((r) => r.slug));
  const seen = new Map();
  const changes = [];
  const dupes = [];
  const notCourses = [];

  rows.forEach((row, i) => {
    const base = row.slug;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    if (n === 1) return; // the row that owns this URL today

    const group = rows.filter((r) => r.slug === base);
    const keys = [...new Set(group.flatMap(Object.keys))].filter((k) => k !== 'id' && k !== 'slug');
    const identical = keys.every((k) => new Set(group.map((r) => JSON.stringify(r[k]))).size === 1);
    if (identical) { dupes.push({ index: i, slug: base, name: row.name }); return; }
    if (isNotACourse(row)) { notCourses.push({ index: i, slug: base, name: row.name, url: row.url }); return; }

    let next = null;
    for (const c of candidates(row, group, base)) {
      const cand = `${base}-${c}`.replace(/-+/g, '-').replace(/-+$/, '');
      if (cand.length <= MAX_SLUG && !taken.has(cand)) { next = cand; break; }
    }
    if (!next) {
      // nothing descriptive fit; fall back to a counter, and keep the result well formed
      const stem = base.replace(/-+$/, '').slice(0, MAX_SLUG - 3).replace(/-+$/, '');
      let k = n;
      while (taken.has(`${stem}-${k}`)) k++;
      next = `${stem}-${k}`;
    }
    taken.add(next);
    changes.push({ index: i, from: base, to: next, name: row.name });
  });

  if (changes.length && WRITE) {
    let out = src;
    // back to front, so earlier offsets stay valid
    for (const ch of [...changes].sort((a, b) => b.index - a.index)) {
      const m = matches[ch.index];
      out = out.slice(0, m.index) + m[0].replace(`${m[2]}${m[3]}${m[2]}`, `${m[2]}${ch.to}${m[2]}`) + out.slice(m.index + m[0].length);
    }
    fs.writeFileSync(full, out);
  }

  totalRenamed += changes.length;
  totalDuplicates += dupes.length;
  totalNotCourses += notCourses.length;
  dupes.forEach((d) => duplicateRows.push({ file, ...d }));
  notCourses.forEach((d) => notCourseRows.push({ file, ...d }));
  allChanges.push(...changes.map((c) => ({ file, ...c })));
  summary.push({ file, rows: rows.length, renamed: changes.length, identicalRows: dupes.length, notCourses: notCourses.length, examples: changes.slice(0, 3) });
}

console.log(WRITE ? 'REWRITING FILES\n' : 'DRY RUN — pass --write to apply\n');
for (const s of summary) {
  if (s.skipped) { console.log(`  ${s.file}: SKIPPED — ${s.skipped}`); continue; }
  console.log(`  ${s.file.padEnd(38)} ${String(s.renamed).padStart(3)} renamed${s.identicalRows ? `, ${s.identicalRows} identical` : ''}${s.notCourses ? `, ${s.notCourses} not a course` : ''}`);
  s.examples.forEach((e) => console.log(`      ${e.from}  ->  ${e.to}`));
}
console.log(`\nslugs renamed: ${totalRenamed}`);
console.log(`identical rows (a second URL would be duplicate content — remove instead): ${totalDuplicates}`);
duplicateRows.forEach((d) => console.log(`   ${d.file}: ${d.slug} — "${d.name}"`));
console.log(`
rows left shadowed because they are not courses (crawled page furniture): ${totalNotCourses}`);
notCourseRows.forEach((d) => console.log(`   ${d.file}: "${d.name}"  ${String(d.url || '').slice(0, 64)}`));

fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports/slug-collision-fix-2026-09-24.json'), JSON.stringify({
  generated: '2026-09-24',
  applied: WRITE,
  note: 'The first row of each colliding group keeps its slug, so no URL that exists today moves. Only shadowed rows — which have no URL — are renamed.',
  renamed: allChanges,
  identicalRowsToRemove: duplicateRows,
  notCoursesLeftShadowed: notCourseRows,
}, null, 1));
console.log('\nwrote reports/slug-collision-fix-2026-09-24.json');
