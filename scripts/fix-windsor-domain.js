const fs = require('fs');
const p = 'data/windsor-courses.ts';
let s = fs.readFileSync(p, 'utf8');
const before = (s.match(/https:\/\/www\.windsor\.ca\//g) || []).length;

s = s.replace(/"url": "https:\/\/www\.windsor\.ca\/"/g, '"url": "https://www.uwindsor.ca/"');

const header = `// University of Windsor — CURATED, NOT VERIFIED. Do not treat as source data.
//
// 2026-09-12: the \`url\` field on all 50 rows pointed at https://www.windsor.ca/ —
// the CITY OF WINDSOR municipal website — not the university (uwindsor.ca).
// Corrected to https://www.uwindsor.ca/. These are OUTBOUND links, not site routes:
// this file is not imported by data/university-course-registry.ts or any page, so no
// live URL changed and no vercel.json redirect is required.
//
// The domain was the only thing fixed. The 50 course names below are still generic
// placeholders, NOT crawled from uwindsor.ca, and every row now carries
// feeVerified: false so no tuition figure can publish as fact. A real crawl of
// uwindsor.ca is outstanding — future.uwindsor.ca is JS-rendered with no JSON API,
// so it needs a Puppeteer session (see BUILD-LOG, Canada wave).
`;
s = s.replace(/^\/\/ Auto-generated — do not edit manually\r?\n\/\/ Source: data\/scraped\/canada\/windsor\.json\r?\n/, header);
s = s.replace(/export interface WindsorCourse \{\r?\n/, 'export interface WindsorCourse {\n  feeVerified?: boolean;\n');
s = s.replace(/(\{\r?\n    "id": "windsor-\d+",\r?\n)/g, '$1    "feeVerified": false,\n');

fs.writeFileSync(p, s);
const after = (s.match(/https:\/\/www\.uwindsor\.ca\//g) || []).length;
console.log('city-gov URLs replaced :', before);
console.log('uwindsor.ca URLs now   :', after);
console.log('rows flagged unverified:', (s.match(/"feeVerified": false/g) || []).length);
console.log('stray windsor.ca left  :', (s.match(/\/\/www\.windsor\.ca/g) || []).length);
console.log('header applied         :', s.startsWith('// University of Windsor'));
