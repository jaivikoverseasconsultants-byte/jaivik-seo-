const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────────────────────
// UNIVERSITY OF TORONTO — add 46 UG + 15 PG = 61 courses
// (currently 24; target 85)
// ──────────────────────────────────────────────────────────────

const UOFT_UG = [
  // BSc
  { slug: 'uoft-bsc-biology',              name: 'BSc Biology',                          level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-mathematics',          name: 'BSc Mathematics',                      level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-statistics',           name: 'BSc Statistics',                       level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-economics',            name: 'BSc Economics',                        level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-biochemistry',         name: 'BSc Biochemistry',                     level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-chemistry',            name: 'BSc Chemistry',                        level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-physics',              name: 'BSc Physics',                          level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-psychology',           name: 'BSc Psychology',                       level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-neuroscience',         name: 'BSc Neuroscience',                     level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-environmental-science',name: 'BSc Environmental Science',            level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-life-sciences',        name: 'BSc Life Sciences',                    level: 'Bachelor of Science', fee: 51000 },
  { slug: 'uoft-bsc-immunology',           name: 'BSc Immunology',                       level: 'Bachelor of Science', fee: 53000 },
  { slug: 'uoft-bsc-pharmacology',         name: 'BSc Pharmacology & Toxicology',        level: 'Bachelor of Science', fee: 53000 },
  { slug: 'uoft-bsc-data-science',         name: 'BSc Data Science',                     level: 'Bachelor of Science', fee: 53000 },
  { slug: 'uoft-bsc-applied-mathematics',  name: 'BSc Applied Mathematics',              level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-cognitive-science',    name: 'BSc Cognitive Science & AI',           level: 'Bachelor of Science', fee: 53000 },
  { slug: 'uoft-bsc-astronomy',            name: 'BSc Astronomy & Astrophysics',         level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-nutrition',            name: 'BSc Nutritional Sciences',             level: 'Bachelor of Science', fee: 51000 },
  { slug: 'uoft-bsc-kinesiology',          name: 'BSc Kinesiology & Physical Education', level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-materials-science',    name: 'BSc Materials Science & Engineering',  level: 'Bachelor of Science', fee: 55000 },
  { slug: 'uoft-bsc-environmental-biology',name: 'BSc Environmental Biology',            level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-molecular-genetics',   name: 'BSc Molecular Genetics',               level: 'Bachelor of Science', fee: 53000 },
  { slug: 'uoft-bsc-global-health',        name: 'BSc Global Health',                    level: 'Bachelor of Science', fee: 50000 },
  { slug: 'uoft-bsc-financial-mathematics',name: 'BSc Financial Mathematics',            level: 'Bachelor of Science', fee: 52000 },
  { slug: 'uoft-bsc-arts-science',         name: 'BSc Arts & Science (Interdisciplinary)',level: 'Bachelor of Science', fee: 48000 },
  // BA
  { slug: 'uoft-ba-economics',             name: 'BA Economics',                         level: 'Bachelor of Arts',    fee: 46000 },
  { slug: 'uoft-ba-political-science',     name: 'BA Political Science',                 level: 'Bachelor of Arts',    fee: 45000 },
  { slug: 'uoft-ba-sociology',             name: 'BA Sociology',                         level: 'Bachelor of Arts',    fee: 45000 },
  { slug: 'uoft-ba-history',               name: 'BA History',                           level: 'Bachelor of Arts',    fee: 44000 },
  { slug: 'uoft-ba-geography',             name: 'BA Geography',                         level: 'Bachelor of Arts',    fee: 44000 },
  { slug: 'uoft-ba-criminology',           name: 'BA Criminology & Sociolegal Studies',  level: 'Bachelor of Arts',    fee: 45000 },
  { slug: 'uoft-ba-international-relations',name: 'BA International Relations',          level: 'Bachelor of Arts',    fee: 46000 },
  { slug: 'uoft-ba-public-policy',         name: 'BA Public Policy',                     level: 'Bachelor of Arts',    fee: 46000 },
  { slug: 'uoft-ba-communications',        name: 'BA Communication, Culture & Information',level: 'Bachelor of Arts', fee: 45000 },
  { slug: 'uoft-ba-anthropology',          name: 'BA Anthropology',                      level: 'Bachelor of Arts',    fee: 44000 },
  { slug: 'uoft-ba-peace-conflict',        name: 'BA Peace, Conflict & Justice',         level: 'Bachelor of Arts',    fee: 45000 },
  { slug: 'uoft-ba-english',               name: 'BA English Literature',                level: 'Bachelor of Arts',    fee: 44000 },
  { slug: 'uoft-ba-management',            name: 'BBA Management',                       level: 'Bachelor of Business Administration', fee: 60000 },
  { slug: 'uoft-ba-linguistics',           name: 'BA Linguistics',                       level: 'Bachelor of Arts',    fee: 44000 },
  // BEng
  { slug: 'uoft-beng-civil-engineering',   name: 'BEng Civil Engineering',               level: 'Bachelor of Engineering', fee: 58000 },
  { slug: 'uoft-beng-mechanical-engineering',name: 'BEng Mechanical & Industrial Engineering',level: 'Bachelor of Engineering', fee: 58000 },
  { slug: 'uoft-beng-chemical-engineering',name: 'BEng Chemical Engineering',            level: 'Bachelor of Engineering', fee: 58000 },
  { slug: 'uoft-beng-electrical-engineering',name: 'BEng Electrical Engineering',        level: 'Bachelor of Engineering', fee: 58000 },
  { slug: 'uoft-beng-biomedical-engineering',name: 'BEng Biomedical Engineering',        level: 'Bachelor of Engineering', fee: 60000 },
  { slug: 'uoft-beng-industrial-engineering',name: 'BEng Industrial Engineering',        level: 'Bachelor of Engineering', fee: 58000 },
  { slug: 'uoft-beng-aerospace-engineering', name: 'BEng Aerospace Engineering',         level: 'Bachelor of Engineering', fee: 60000 },
];

const UOFT_PG = [
  { slug: 'uoft-msc-geology',               name: 'MSc Geology',                      fee: 25000, dur: 2 },
  { slug: 'uoft-master-public-health',       name: 'Master of Public Health (MPH)',    fee: 27000, dur: 2 },
  { slug: 'uoft-msc-pharmacology',           name: 'MSc Pharmacology',                 fee: 25000, dur: 2 },
  { slug: 'uoft-master-urban-planning',      name: 'Master of Urban Planning',         fee: 29000, dur: 2 },
  { slug: 'uoft-msc-mathematical-finance',   name: 'MSc Mathematical Finance',         fee: 42000, dur: 1 },
  { slug: 'uoft-master-environmental-studies',name: 'Master of Environmental Studies', fee: 25000, dur: 2 },
  { slug: 'uoft-msc-management',             name: 'MSc Management (Rotman)',          fee: 38000, dur: 1 },
  { slug: 'uoft-msc-bioinformatics',         name: 'MSc Bioinformatics',               fee: 26000, dur: 2 },
  { slug: 'uoft-meng-materials-science',     name: 'MEng Materials Science',           fee: 31000, dur: 1 },
  { slug: 'uoft-msc-immunology',             name: 'MSc Immunology',                   fee: 24000, dur: 2 },
  { slug: 'uoft-msc-nutrition',              name: 'MSc Nutritional Sciences',         fee: 23000, dur: 2 },
  { slug: 'uoft-msc-neuroscience',           name: 'MSc Neuroscience',                 fee: 24000, dur: 2 },
  { slug: 'uoft-msc-astronomy',              name: 'MSc Astronomy & Astrophysics',     fee: 23000, dur: 2 },
  { slug: 'uoft-msc-sociology',              name: 'MSc Sociology',                    fee: 22000, dur: 2 },
  { slug: 'uoft-master-public-policy',       name: 'Master of Public Policy',          fee: 30000, dur: 2 },
];

function makeUgEntry(c, i) {
  const annualUSD = Math.round(c.fee * 0.73);
  const annualINR = Math.round(annualUSD * 84);
  const totalCAD = c.fee * 4;
  return `  {
    "id": "uoft-${24 + i + 1}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.utoronto.ca",
    "level": "${c.level}",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualCAD": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalCAD": ${totalCAD},
    "livingCostCAD": 23000,
    "livingCostUSD": 16790,
    "livingCostINR": 1410360,
    "ieltsMin": 6.5,
    "toeflMin": 89,
    "pteMin": 60,
    "intakeMonths": ["September"],
    "campus": "St. George Campus",
    "country": "Canada",
    "province": "Ontario",
    "city": "Toronto",
    "countryCode": "CA",
    "pgwp": true
  }`;
}

function makePgEntry(c, i) {
  const annualUSD = Math.round(c.fee * 0.73);
  const annualINR = Math.round(annualUSD * 84);
  const totalCAD = c.fee * c.dur;
  return `  {
    "id": "uoft-${24 + UOFT_UG.length + i + 1}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.utoronto.ca",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "${c.dur === 1 ? '1 year' : '2 years'}",
    "durationYears": ${c.dur},
    "annualCAD": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalCAD": ${totalCAD},
    "livingCostCAD": 23000,
    "livingCostUSD": 16790,
    "livingCostINR": 1410360,
    "ieltsMin": 6.5,
    "toeflMin": 89,
    "pteMin": 60,
    "intakeMonths": ["September"],
    "campus": "St. George Campus",
    "country": "Canada",
    "province": "Ontario",
    "city": "Toronto",
    "countryCode": "CA",
    "pgwp": true
  }`;
}

const uoftAdditions = [
  ...UOFT_UG.map(makeUgEntry),
  ...UOFT_PG.map(makePgEntry),
].join(',\n');

const uoftPath = path.join(__dirname, '..', 'data', 'uoft-courses.ts');
let uoftContent = fs.readFileSync(uoftPath, 'utf8');
// Replace the closing `] as const;`
uoftContent = uoftContent.replace(
  /(\s*"pgwp":\s*true\s*\}\s*\]\s*as\s*const;)/,
  `    "pgwp": true
  },\n${uoftAdditions}\n] as const;`
);
fs.writeFileSync(uoftPath, uoftContent, 'utf8');
console.log('UofT: added', UOFT_UG.length + UOFT_PG.length, 'courses');

// ──────────────────────────────────────────────────────────────
// McGILL — add 21 UG + 9 PG = 30 courses
// (currently 20; target 50)
// ──────────────────────────────────────────────────────────────

const MCGILL_UG = [
  { slug: 'mcgill-bsc-biology',              name: 'BSc Biology',                       level: 'Bachelor of Science', fee: 28000 },
  { slug: 'mcgill-bsc-mathematics',          name: 'BSc Mathematics',                   level: 'Bachelor of Science', fee: 27000 },
  { slug: 'mcgill-bsc-statistics',           name: 'BSc Statistics',                    level: 'Bachelor of Science', fee: 27000 },
  { slug: 'mcgill-bsc-economics',            name: 'BSc Economics',                     level: 'Bachelor of Science', fee: 27000 },
  { slug: 'mcgill-bsc-biochemistry',         name: 'BSc Biochemistry',                  level: 'Bachelor of Science', fee: 28500 },
  { slug: 'mcgill-bsc-chemistry',            name: 'BSc Chemistry',                     level: 'Bachelor of Science', fee: 28500 },
  { slug: 'mcgill-bsc-physics',              name: 'BSc Physics',                       level: 'Bachelor of Science', fee: 28500 },
  { slug: 'mcgill-bsc-psychology',           name: 'BSc Psychology',                    level: 'Bachelor of Science', fee: 27000 },
  { slug: 'mcgill-bsc-neuroscience',         name: 'BSc Neuroscience',                  level: 'Bachelor of Science', fee: 28500 },
  { slug: 'mcgill-bsc-environmental-science',name: 'BSc Environmental Science',         level: 'Bachelor of Science', fee: 27000 },
  { slug: 'mcgill-bsc-life-sciences',        name: 'BSc Life Sciences',                 level: 'Bachelor of Science', fee: 27500 },
  { slug: 'mcgill-bsc-cognitive-science',    name: 'BSc Cognitive Science',             level: 'Bachelor of Science', fee: 28000 },
  { slug: 'mcgill-bsc-software-engineering', name: 'BSc Software Engineering',          level: 'Bachelor of Science', fee: 30000 },
  { slug: 'mcgill-ba-economics',             name: 'BA Economics',                      level: 'Bachelor of Arts',    fee: 25000 },
  { slug: 'mcgill-ba-political-science',     name: 'BA Political Science',              level: 'Bachelor of Arts',    fee: 25000 },
  { slug: 'mcgill-ba-sociology',             name: 'BA Sociology',                      level: 'Bachelor of Arts',    fee: 24500 },
  { slug: 'mcgill-ba-history',               name: 'BA History',                        level: 'Bachelor of Arts',    fee: 24500 },
  { slug: 'mcgill-ba-international-development',name: 'BA International Development',   level: 'Bachelor of Arts',    fee: 25500 },
  { slug: 'mcgill-beng-civil-engineering',   name: 'BEng Civil Engineering',            level: 'Bachelor of Engineering', fee: 33000 },
  { slug: 'mcgill-beng-mechanical-engineering',name: 'BEng Mechanical Engineering',     level: 'Bachelor of Engineering', fee: 33000 },
  { slug: 'mcgill-beng-electrical-engineering',name: 'BEng Electrical Engineering',     level: 'Bachelor of Engineering', fee: 33000 },
];

const MCGILL_PG = [
  { slug: 'mcgill-msc-geology',              name: 'MSc Geology',                       fee: 14000, dur: 2 },
  { slug: 'mcgill-master-public-health',     name: 'Master of Public Health (MPH)',     fee: 15000, dur: 2 },
  { slug: 'mcgill-msc-pharmacology',         name: 'MSc Pharmacology & Therapeutics',   fee: 14000, dur: 2 },
  { slug: 'mcgill-master-urban-planning',    name: 'Master of Urban Planning',          fee: 15500, dur: 2 },
  { slug: 'mcgill-msc-bioinformatics',       name: 'MSc Bioinformatics',                fee: 14000, dur: 2 },
  { slug: 'mcgill-msc-mathematics',          name: 'MSc Mathematics & Statistics',      fee: 13000, dur: 2 },
  { slug: 'mcgill-msc-management-analytics', name: 'MSc Management Analytics',          fee: 28000, dur: 1 },
  { slug: 'mcgill-msc-environmental-science',name: 'MSc Environmental Science',         fee: 13500, dur: 2 },
  { slug: 'mcgill-msc-psychology',           name: 'MSc Psychology',                    fee: 13000, dur: 2 },
];

function makeMcgillUgEntry(c, i) {
  const annualUSD = Math.round(c.fee * 0.73);
  const annualINR = Math.round(annualUSD * 84);
  const totalCAD = c.fee * 4;
  return `  {
    "id": "mcgill-${20 + i + 1}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.mcgill.ca",
    "level": "${c.level}",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualCAD": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalCAD": ${totalCAD},
    "livingCostCAD": 18000,
    "livingCostUSD": 13140,
    "livingCostINR": 1103760,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 62,
    "intakeMonths": ["September"],
    "campus": "Downtown Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  }`;
}

function makeMcgillPgEntry(c, i) {
  const annualUSD = Math.round(c.fee * 0.73);
  const annualINR = Math.round(annualUSD * 84);
  const totalCAD = c.fee * c.dur;
  return `  {
    "id": "mcgill-${20 + MCGILL_UG.length + i + 1}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.mcgill.ca",
    "level": "Masters",
    "studyLevel": "Postgraduate",
    "duration": "${c.dur === 1 ? '1 year' : '2 years'}",
    "durationYears": ${c.dur},
    "annualCAD": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalCAD": ${totalCAD},
    "livingCostCAD": 18000,
    "livingCostUSD": 13140,
    "livingCostINR": 1103760,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 62,
    "intakeMonths": ["September"],
    "campus": "Downtown Campus",
    "country": "Canada",
    "province": "Quebec",
    "city": "Montreal",
    "countryCode": "CA",
    "pgwp": true
  }`;
}

const mcgillAdditions = [
  ...MCGILL_UG.map(makeMcgillUgEntry),
  ...MCGILL_PG.map(makeMcgillPgEntry),
].join(',\n');

const mcgillPath = path.join(__dirname, '..', 'data', 'mcgill-courses.ts');
let mcgillContent = fs.readFileSync(mcgillPath, 'utf8');
mcgillContent = mcgillContent.replace(
  /(\s*"pgwp":\s*true\s*\}\s*\]\s*as\s*const;)/,
  `    "pgwp": true
  },\n${mcgillAdditions}\n] as const;`
);
fs.writeFileSync(mcgillPath, mcgillContent, 'utf8');
console.log('McGill: added', MCGILL_UG.length + MCGILL_PG.length, 'courses');
console.log('Done!');
