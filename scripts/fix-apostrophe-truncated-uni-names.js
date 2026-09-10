// Repair two generated course templates where the university name was truncated at an
// apostrophe.
//
// A generator wrote the display name into a template literal and cut it at the escaped
// quote, leaving `at King\` instead of `at King's College London` (same for Queen's
// University). The result shipped live: the <title>, the meta description and the visible
// <h1> on every King's College London and Queen's University course page all read
// "... at King " with the university name missing.
//
// It stayed invisible because `\` followed by a space is a legal identity escape inside a
// template literal — it compiles clean and just renders a space. It only became a build
// error once the trailing boilerplate was trimmed and the `\` landed against the closing
// backtick.
//
// data/universities.ts is NOT affected: it holds 'King\'s College London' and
// "Queen's University" correctly. Only these two generated files were damaged.
//
// Usage: node scripts/fix-apostrophe-truncated-uni-names.js [--apply]

const fs = require('fs');
const path = require('path');

const BS = String.fromCharCode(92);
const BT = String.fromCharCode(96);
const APPLY = process.argv.includes('--apply');

const JOBS = [
  {
    file: 'app/universities/kings-college-london/courses/[slug]/page.tsx',
    broken: 'at King' + BS,
    // Inside a template literal an apostrophe needs no escape.
    inTemplate: "at King's College London",
    // In JSX text, use an entity — the same line already writes &amp;.
    inJsx: 'at King&apos;s College London',
  },
  {
    file: 'app/universities/queens-university/courses/[slug]/page.tsx',
    broken: 'at Queen' + BS,
    inTemplate: "at Queen's University",
    inJsx: 'at Queen&apos;s University',
  },
];

let changed = 0;
for (const job of JOBS) {
  const p = path.join(__dirname, '..', job.file);
  let src = fs.readFileSync(p, 'utf8');
  const before = src;

  // title:  `... at King\`,      -> `... at King's College London`,
  src = src.split(job.broken + BT).join(job.inTemplate + BT);
  // description: `... at King\, ...` -> `... at King's College London, ...`
  src = src.split(job.broken + ',').join(job.inTemplate + ',');
  // h1 JSX text: {course.name} at King\ — ... -> ... at King&apos;s College London — ...
  src = src.split(job.broken + ' —').join(job.inJsx + ' —');

  const remaining = src.split(job.broken).length - 1;
  if (src === before) {
    console.log('no change needed: ' + job.file);
    continue;
  }
  console.log((APPLY ? 'fixed   ' : 'would fix ') + job.file + '  (damaged fragments left: ' + remaining + ')');
  if (APPLY) fs.writeFileSync(p, src);
  changed++;
}

console.log('\n' + (APPLY ? 'wrote ' : 'would write ') + changed + ' file(s)');
if (!APPLY) console.log('run with --apply to write');
