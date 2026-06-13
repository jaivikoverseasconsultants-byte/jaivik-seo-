// Adds noIndex: true to buildMetadata in all stub university course page templates.
// Real-data universities (with crawled individual course URLs) are excluded.
// This concentrates crawl budget on the 1,520 verified real-data course pages.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP_UNI = path.join(ROOT, 'app', 'universities');

// These 7 have real individually crawled course URLs — keep fully indexable
const REAL_DATA = new Set([
  'university-of-manchester',
  'university-college-london',
  'university-of-edinburgh',
  'university-of-toronto',
  'mcmaster-university',
  'university-of-warwick',
  'university-of-british-columbia',
]);

const uniDirs = fs.readdirSync(APP_UNI, { withFileTypes: true }).filter(d =>
  d.isDirectory() &&
  !d.name.startsWith('[') &&
  d.name !== 'country' &&
  d.name !== 'city' &&
  !REAL_DATA.has(d.name) // exclude real-data universities
);

let updated = 0;
let skipped = 0;
let alreadyHas = 0;

for (const d of uniDirs) {
  const detailPage = path.join(APP_UNI, d.name, 'courses', '[slug]', 'page.tsx');
  if (!fs.existsSync(detailPage)) { skipped++; continue; }

  let src = fs.readFileSync(detailPage, 'utf8');

  // Skip if already has noIndex
  if (src.includes('noIndex:')) { alreadyHas++; continue; }

  // Find the buildMetadata({ ... }) call inside generateMetadata
  const buildMetaIdx = src.indexOf('buildMetadata({');
  if (buildMetaIdx === -1) { skipped++; continue; }

  // Find the path: property and add noIndex after it
  // Also try adding before the closing })
  // Strategy: add noIndex: true before the closing }) of buildMetadata
  let depth = 0;
  let end = -1;
  for (let i = buildMetaIdx; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  if (end === -1) { skipped++; continue; }

  // Insert noIndex: true before the closing }
  // Find the last non-whitespace position before end
  let insertPos = end;
  // Walk back past whitespace/newlines to find the last character of the last property
  while (insertPos > buildMetaIdx && /\s/.test(src[insertPos - 1])) insertPos--;

  const before = src.slice(0, insertPos);
  const after = src.slice(insertPos);

  // Check if the last character is a comma already
  const needsComma = before[before.length - 1] !== ',';
  const insertion = (needsComma ? ',\n    noIndex: true' : '\n    noIndex: true');

  src = before + insertion + after;
  fs.writeFileSync(detailPage, src, 'utf8');
  updated++;

  if (updated <= 3 || updated % 100 === 0) {
    console.log(`[${updated}] ${d.name}`);
  }
}

console.log(`\n=== DONE ===`);
console.log(`Updated (noIndex added): ${updated}`);
console.log(`Already had noIndex:     ${alreadyHas}`);
console.log(`Skipped (no page/meta):  ${skipped}`);
console.log(`\nRealData (untouched):    ${REAL_DATA.size} universities`);
console.log(`Total noindexed pages:   ~${updated * 60} (avg 60 courses/uni)`);
