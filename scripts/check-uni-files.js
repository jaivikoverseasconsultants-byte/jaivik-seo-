/**
 * Map university slugs to their actual file prefixes
 */
const fs = require('fs');
const path = require('path');

// Read all course data files
const dataFiles = fs.readdirSync('data').filter(f => f.endsWith('-courses.ts'));
const appUnis = fs.readdirSync('app/universities').filter(f => !f.startsWith('['));

console.log('\n=== Course data files ===');
console.log(dataFiles.length, 'files');

// Check which unis are missing a data file
const missingData = [];
for (const uniDir of appUnis) {
  // Extract prefix from the uni directory name
  const possiblePrefixes = [
    uniDir, // exact match
    uniDir.replace('university-of-', ''),
    uniDir.replace('-university', ''),
    uniDir.replace(/-/g, '').toLowerCase(),
    uniDir.split('-')[0],
    uniDir.split('-').slice(0, 2).join('-'),
  ];

  let found = false;
  for (const prefix of possiblePrefixes) {
    if (dataFiles.includes(prefix + '-courses.ts')) {
      found = true;
      break;
    }
  }

  if (!found) {
    // Find closest match
    const closest = dataFiles.filter(f => {
      const base = f.replace('-courses.ts', '');
      return uniDir.includes(base) || base.includes(uniDir) ||
        uniDir.split('-').some(part => base.includes(part));
    }).slice(0, 3);
    missingData.push({ dir: uniDir, closest: closest.join(', ') });
  }
}

if (missingData.length > 0) {
  console.log('\n=== App dirs with no obvious data file ===');
  missingData.slice(0, 30).forEach(m => console.log(`  ${m.dir} -> closest: ${m.closest || 'none'}`));
}

// Check specific universities
const toCheck = [
  'university-of-edinburgh',
  'university-of-southampton',
  'university-of-glasgow',
  'university-of-birmingham',
  'university-of-sheffield',
  'university-of-nottingham',
  'university-of-bristol',
  'university-of-leeds',
  'university-of-exeter',
  'university-of-british-columbia',
  'university-of-alberta',
  'university-of-waterloo',
  'mcmaster-university',
  'western-university',
  'national-university-of-singapore',
  'nanyang-technological-university',
];

console.log('\n=== Checking specific universities ===');
for (const slug of toCheck) {
  const appDir = `app/universities/${slug}`;
  const hasAppDir = fs.existsSync(appDir);

  // Find the data file
  const possible = dataFiles.filter(f => {
    const base = f.replace('-courses.ts', '');
    const parts = slug.split('-');
    return parts.some(p => p.length > 3 && base.includes(p));
  });

  console.log(`${slug}:`);
  console.log(`  App dir: ${hasAppDir ? '✅' : '❌'}`);
  console.log(`  Data files: ${possible.join(', ') || '❌ none'}`);

  if (hasAppDir) {
    const coursePage = `${appDir}/courses/[slug]/page.tsx`;
    if (fs.existsSync(coursePage)) {
      const content = fs.readFileSync(coursePage, 'utf8');
      const importMatch = content.match(/from ['"]@\/data\/([^'"]+)['"]/);
      if (importMatch) console.log(`  Imports from: ${importMatch[1]}`);
    }
  }
}
