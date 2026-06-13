// Fixes broken courseSlug entries in course-index.ts by mapping to real slugs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const APP_UNI = path.join(ROOT, 'app', 'universities');

function getSlugMap(file) {
  const fp = path.join(DATA, file);
  if (!fs.existsSync(fp)) return {};
  const src = fs.readFileSync(fp, 'utf8');
  const slugRe = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
  const nameRe = /["']?name["']?\s*:\s*["']([^"']+)["']/g;
  const slugs = [], names = []; let m;
  while ((m = slugRe.exec(src)) !== null) slugs.push(m[1]);
  while ((m = nameRe.exec(src)) !== null) names.push(m[1]);
  const map = {};
  slugs.forEach((s, i) => { map[s] = names[i] || ''; });
  return map;
}

function findBestSlug(slugMap, keywords) {
  const kws = keywords.map(k => k.toLowerCase());
  const keys = Object.keys(slugMap);
  let best = null, bestScore = 0;
  for (const slug of keys) {
    const name = (slugMap[slug] || '').toLowerCase();
    const score = kws.filter(kw => slug.includes(kw) || name.includes(kw)).length;
    if (score > bestScore) { bestScore = score; best = slug; }
  }
  return bestScore > 0 ? best : (keys[0] || null);
}

const dataFiles = {
  'university-of-toronto': 'uoft-courses.ts',
  'university-college-london': 'ucl-courses.ts',
  'university-of-manchester': 'manchester-courses.ts',
  'university-of-edinburgh': 'edinburgh-courses.ts',
  'mcmaster-university': 'mcmaster-courses.ts',
  'university-of-british-columbia': 'ubc-courses.ts',
  'national-university-of-singapore': 'nus-courses.ts',
  'nanyang-technological-university': 'ntu-courses.ts',
  'university-college-dublin': 'ucd-courses.ts',
  'university-of-auckland': 'auckland-courses.ts',
  'northumbria-university': 'northumbria-courses.ts',
  'griffith-university': 'griffith-courses.ts',
  'monash-university': 'monash-courses.ts',
  'unsw-sydney': 'unsw-courses.ts',
  'kings-college-london': 'kcl-courses.ts',
  'university-of-melbourne': 'uom-courses.ts',
};

const slugMaps = {};
for (const [uni, file] of Object.entries(dataFiles)) {
  slugMaps[uni] = getSlugMap(file);
}

// All 59 broken entries with keyword hints for finding best real slug
const broken = [
  { uni: 'university-of-toronto', old: 'uoft-msc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-of-toronto', old: 'uoft-msc-applied-computing', kws: ['computing', 'applied'] },
  { uni: 'university-of-toronto', old: 'uoft-meng-electrical-computer-engineering', kws: ['electrical', 'engineering'] },
  { uni: 'university-college-london', old: 'ucl-msc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-of-edinburgh', old: 'edinburgh-msc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-of-auckland', old: 'uoa-msc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-college-london', old: 'ucl-bsc-computer-science', kws: ['computer', 'science'] },
  { uni: 'university-of-toronto', old: 'uoft-msc-data-science', kws: ['data', 'science'] },
  { uni: 'university-college-london', old: 'ucl-msc-data-science', kws: ['data', 'science'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-data-science', kws: ['data', 'science'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-artificial-intelligence', kws: ['artificial', 'intelligence'] },
  { uni: 'university-of-edinburgh', old: 'edinburgh-msc-data-science', kws: ['data', 'science'] },
  { uni: 'university-of-toronto', old: 'uoft-msc-statistics', kws: ['statistics'] },
  { uni: 'university-of-toronto', old: 'uoft-mba-rotman', kws: ['business', 'administration', 'mba'] },
  { uni: 'university-of-manchester', old: 'manchester-master-of-business-administration-mba', kws: ['business', 'administration', 'mba'] },
  { uni: 'university-college-london', old: 'ucl-mba-global', kws: ['business', 'administration', 'mba'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-management', kws: ['management'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-international-business', kws: ['international', 'business'] },
  { uni: 'university-of-toronto', old: 'uoft-meng-mechanical-industrial', kws: ['mechanical', 'industrial', 'engineering'] },
  { uni: 'university-college-london', old: 'ucl-beng-mechanical-engineering', kws: ['mechanical', 'engineering'] },
  { uni: 'university-college-london', old: 'ucl-beng-civil-engineering', kws: ['civil', 'engineering'] },
  { uni: 'university-of-auckland', old: 'uoa-msc-structural-engineering', kws: ['engineering'] },
  { uni: 'northumbria-university', old: 'northumbria-bsc-nursing', kws: ['nursing'] },
  { uni: 'monash-university', old: 'monash-master-of-nursing', kws: ['nursing'] },
  { uni: 'unsw-sydney', old: 'unsw-master-of-nursing', kws: ['nursing'] },
  { uni: 'griffith-university', old: 'griffith-bsc-nursing', kws: ['nursing'] },
  { uni: 'university-of-auckland', old: 'uoa-bsc-nursing', kws: ['nursing'] },
  { uni: 'university-college-london', old: 'ucl-msc-neuroscience', kws: ['neuroscience'] },
  { uni: 'university-of-toronto', old: 'uoft-llm-international-business-law', kws: ['law'] },
  { uni: 'university-college-london', old: 'ucl-ba-law', kws: ['law'] },
  { uni: 'kings-college-london', old: 'kcl-llm', kws: ['law', 'llm'] },
  { uni: 'university-of-edinburgh', old: 'edinburgh-llm', kws: ['law', 'llm'] },
  { uni: 'university-of-melbourne', old: 'uom-llm', kws: ['law', 'llm'] },
  { uni: 'national-university-of-singapore', old: 'nus-llm', kws: ['law', 'llm'] },
  { uni: 'university-college-dublin', old: 'ucd-llm-international-commercial-law', kws: ['law', 'llm'] },
  { uni: 'university-college-london', old: 'ucl-bsc-psychology', kws: ['psychology'] },
  { uni: 'university-of-edinburgh', old: 'edinburgh-msc-psychology', kws: ['psychology'] },
  { uni: 'monash-university', old: 'monash-msc-psychology', kws: ['psychology'] },
  { uni: 'university-college-dublin', old: 'ucd-msc-psychology', kws: ['psychology'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-psychology', kws: ['psychology'] },
  { uni: 'university-of-auckland', old: 'uoa-bsc-psychology', kws: ['psychology'] },
  { uni: 'university-of-toronto', old: 'uoft-master-of-finance', kws: ['finance'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-finance', kws: ['finance'] },
  { uni: 'university-college-london', old: 'ucl-msc-finance', kws: ['finance'] },
  { uni: 'university-college-london', old: 'ucl-msc-financial-risk-management', kws: ['financial', 'risk'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-accounting', kws: ['accounting'] },
  { uni: 'university-college-london', old: 'ucl-msc-economics', kws: ['economics'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-marketing', kws: ['marketing'] },
  { uni: 'university-college-london', old: 'ucl-msc-public-policy', kws: ['public', 'policy'] },
  { uni: 'university-college-london', old: 'ucl-msc-architecture', kws: ['architecture'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-digital-marketing', kws: ['digital', 'marketing'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-project-management', kws: ['project', 'management'] },
  { uni: 'university-of-toronto', old: 'uoft-grad-dip-business-analytics', kws: ['business', 'analytics'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-cybersecurity', kws: ['cyber'] },
  { uni: 'university-of-manchester', old: 'manchester-msc-human-resource-management', kws: ['human', 'resource'] },
  { uni: 'university-of-toronto', old: 'uoft-master-global-affairs', kws: ['global', 'affairs'] },
  { uni: 'university-college-london', old: 'ucl-msc-education', kws: ['education'] },
];

// Build the replacement map
const replacements = new Map();
for (const b of broken) {
  const sm = slugMaps[b.uni] || {};
  const best = findBestSlug(sm, b.kws);
  if (best && best !== b.old) {
    replacements.set(b.old, best);
    console.log(`FIX: ${b.old}`);
    console.log(`  → ${best}`);
  } else if (!best) {
    console.log(`REMOVE (no data): ${b.uni}/${b.old}`);
    replacements.set(b.old, null); // null = remove entry
  }
}

// Apply replacements to course-index.ts
const indexFile = path.join(DATA, 'course-index.ts');
let src = fs.readFileSync(indexFile, 'utf8');

// Replace each broken courseSlug with the fixed one
for (const [oldSlug, newSlug] of replacements.entries()) {
  if (newSlug === null) {
    // Remove the entire entry block containing this slug
    // Match from the opening { to the closing },
    const escapedOld = oldSlug.replace(/[-]/g, '\\-');
    const blockRe = new RegExp(`\\s*\\{[^{}]*courseSlug:\\s*'${escapedOld}'[^{}]*\\},?`, 'g');
    src = src.replace(blockRe, '');
  } else {
    // Replace the courseSlug value
    src = src.replace(
      new RegExp(`(courseSlug:\\s*')${oldSlug.replace(/[-]/g, '\\-')}(')`,'g'),
      `$1${newSlug}$2`
    );
  }
}

fs.writeFileSync(indexFile, src, 'utf8');
console.log('\nDone. Updated course-index.ts');

// Verify: re-check broken count
const updated = fs.readFileSync(indexFile, 'utf8');
const stillBroken = broken.filter(b => {
  const sm = slugMaps[b.uni] || {};
  const currentRe = new RegExp(`courseSlug:\\s*'${b.old.replace(/[-]/g, '\\-')}'`);
  return currentRe.test(updated);
});
console.log('Still broken after fix:', stillBroken.length);
