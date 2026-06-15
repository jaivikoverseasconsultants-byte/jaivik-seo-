const fs = require('fs');
const unis = [
  ['charles-darwin-university', 'cdu'],
  ['uts-sydney', 'uts'],
  ['northumbria-university', 'northumbria'],
  ['victoria-university-sydney', 'vu_sydney'],
  ['flinders-university', 'flinders'],
  ['anglia-ruskin-university', 'aru'],
  ['middlesex-university', 'middlesex'],
  ['university-of-leeds', 'leeds'],
  ['la-trobe-university', 'latrobe'],
  ['monash-university', 'monash'],
  ['national-university-of-singapore', 'nus'],
  ['university-of-birmingham', 'birmingham'],
  ['university-of-sheffield', 'sheffield'],
  ['university-of-michigan', 'umich'],
  ['university-of-queensland', 'uq'],
];

const dataDir = 'C:/Users/Harshita/jaivik-seo/data';
const files = fs.readdirSync(dataDir);

for (const [slug, short] of unis) {
  const candidates = [slug + '-courses.ts', short + '-courses.ts'];
  const match = files.find(f => candidates.includes(f));
  if (!match) { console.log(slug + ': FILE NOT FOUND'); continue; }
  const content = fs.readFileSync(dataDir + '/' + match, 'utf8');
  const firstEntry = content.match(/\{[^{}]{100,600}\}/)?.[0] || '';
  const urlM = firstEntry.match(/"url"\s*:\s*"([^"]+)"/);
  const nameM = firstEntry.match(/"name"\s*:\s*"([^"]+)"/);
  const feeM = firstEntry.match(/"annualUSD"\s*:\s*(\d+)/);
  const url = urlM ? urlM[1] : 'N/A';
  const isReal = url.length > 40 && !url.includes('example') && url !== 'https://www.uts.edu.au';
  console.log(slug.padEnd(40) + (isReal ? 'REAL' : 'STUB') + ' | name: ' + (nameM ? nameM[1].slice(0,40) : 'N/A') + ' | url: ' + url.slice(0,60));
}
