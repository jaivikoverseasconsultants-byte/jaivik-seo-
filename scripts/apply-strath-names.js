// Apply the crawled real names from reports/strath-real-names.json to data/strath-courses.ts.
//
// Split from the crawl on purpose: the crawl only reads, this only writes, and it writes
// nothing it did not read off Strathclyde's own page. Entries whose page 404s keep their
// existing name — a withdrawn course is not a licence to invent a title for it.
//
// Records are anchored by `id`, resolved from the record's `url`.
// NOT by slug: 22 Strathclyde slugs are shared by 2-3 genuinely different courses
// (strath-accountingfinance is both the BA Joint Hons and the PhD/MPhil/MRes), so a
// slug-anchored edit silently rewrites the wrong record and leaves the rest stale.
// `id` and `url` are both unique across the file; slug is not.
//
// Slugs are NOT touched, so no live URL changes and no vercel.json redirects are needed.
//
// Usage: node scripts/apply-strath-names.js [--apply]   (default is a dry run)

const fs = require('fs');
const path = require('path');
const { parseCourseFile } = require('./parse-course-data-file');

const DATA = path.join(__dirname, '..', 'data', 'strath-courses.ts');
const REPORT = path.join(__dirname, '..', 'reports', 'strath-real-names.json');

function main() {
  const write = process.argv.includes('--apply');
  const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  const courses = parseCourseFile('strath-courses');
  let src = fs.readFileSync(DATA, 'utf8');

  // url -> record, so a crawl result lands on exactly the course that was crawled.
  const byUrl = new Map(courses.map(c => [c.url, c]));

  const todo = [];
  const unresolved = [];
  for (const r of report.results) {
    if (!r.newName) continue;
    const rec = byUrl.get(r.url);
    if (!rec) { unresolved.push(r.url); continue; }
    if (rec.name === r.newName) continue;
    todo.push({ id: rec.id, oldName: rec.name, newName: r.newName, slug: rec.slug });
  }

  const skipped = report.results.filter(r => !r.newName);
  console.log('names to apply: ' + todo.length);
  console.log('left untouched (page 404s on strath.ac.uk): ' + skipped.length);
  if (unresolved.length) console.log('crawl results with no matching record: ' + unresolved.length);

  if (!write) {
    console.log('\nDRY RUN - first 12:');
    todo.slice(0, 12).forEach(r => console.log('  [' + r.id + '] ' + r.oldName.padEnd(40) + ' -> ' + r.newName));
    const dupSlug = todo.filter(r => todo.filter(x => x.slug === r.slug).length > 1);
    if (dupSlug.length) {
      console.log('\n  ' + dupSlug.length + ' of these sit on a shared slug — anchoring by id keeps them distinct:');
      dupSlug.slice(0, 6).forEach(r => console.log('    ' + r.slug + ' [' + r.id + '] -> ' + r.newName));
    }
    console.log('\nrun with --apply to write');
    return;
  }

  let applied = 0; const missed = [];
  for (const r of todo) {
    // Anchor on the unique id, then rewrite the name field inside that one record object.
    const idNeedle = '{"id":' + JSON.stringify(r.id) + ',';
    const at = src.indexOf(idNeedle);
    if (at === -1) { missed.push(r.id + ' (id not found)'); continue; }
    const nameNeedle = '"name":' + JSON.stringify(r.oldName);
    const rel = src.indexOf(nameNeedle, at);
    // The name must sit inside this record, i.e. before the record's closing brace.
    const recEnd = src.indexOf('}', at);
    if (rel === -1 || rel > recEnd) { missed.push(r.id + ' (name not inside record)'); continue; }
    src = src.slice(0, rel) + '"name":' + JSON.stringify(r.newName) + src.slice(rel + nameNeedle.length);
    applied++;
  }

  fs.writeFileSync(DATA, src);
  console.log('\napplied ' + applied + ' of ' + todo.length);
  if (missed.length) {
    console.log('could not place ' + missed.length + ':');
    missed.slice(0, 20).forEach(m => console.log('  ' + m));
  }
}

main();
