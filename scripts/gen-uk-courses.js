const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────────────────────
// UNIVERSITY OF MANCHESTER — add 34 UG courses
// (currently 48; target 77 = 39 UG + 38 PG)
// ──────────────────────────────────────────────────────────────

const MANCHESTER_UG = [
  { slug: 'manchester-bsc-computer-science',          name: 'BSc Computer Science',                      fee: 27500 },
  { slug: 'manchester-bsc-mathematics',               name: 'BSc Mathematics',                           fee: 26500 },
  { slug: 'manchester-bsc-physics',                   name: 'BSc Physics',                               fee: 27500 },
  { slug: 'manchester-bsc-chemistry',                 name: 'BSc Chemistry',                             fee: 27500 },
  { slug: 'manchester-bsc-biology',                   name: 'BSc Biology',                               fee: 27000 },
  { slug: 'manchester-bsc-biochemistry',              name: 'BSc Biochemistry',                          fee: 27500 },
  { slug: 'manchester-bsc-economics',                 name: 'BSc Economics',                             fee: 27000 },
  { slug: 'manchester-bsc-psychology',                name: 'BSc Psychology',                            fee: 27000 },
  { slug: 'manchester-bsc-neuroscience',              name: 'BSc Neuroscience',                          fee: 27500 },
  { slug: 'manchester-bsc-data-science',              name: 'BSc Data Science',                          fee: 28000 },
  { slug: 'manchester-bsc-artificial-intelligence',   name: 'BSc Artificial Intelligence',               fee: 28500 },
  { slug: 'manchester-bsc-software-engineering',      name: 'BSc Software Engineering',                  fee: 28000 },
  { slug: 'manchester-bsc-environmental-science',     name: 'BSc Environmental Science',                 fee: 26500 },
  { slug: 'manchester-bsc-materials-science',         name: 'BSc Materials Science & Engineering',       fee: 28000 },
  { slug: 'manchester-bsc-molecular-biology',         name: 'BSc Molecular Biology & Biotechnology',     fee: 27500 },
  { slug: 'manchester-bsc-geography',                 name: 'BSc Geography',                             fee: 26500 },
  { slug: 'manchester-beng-civil-engineering',        name: 'BEng Civil Engineering',                    fee: 28500 },
  { slug: 'manchester-beng-mechanical-engineering',   name: 'BEng Mechanical Engineering',               fee: 28500 },
  { slug: 'manchester-beng-chemical-engineering',     name: 'BEng Chemical Engineering',                 fee: 28500 },
  { slug: 'manchester-beng-electrical-engineering',   name: 'BEng Electrical & Electronic Engineering',  fee: 28500 },
  { slug: 'manchester-beng-aerospace-engineering',    name: 'BEng Aerospace Engineering',                fee: 29000 },
  { slug: 'manchester-beng-biomedical-engineering',   name: 'BEng Biomedical Engineering',               fee: 29000 },
  { slug: 'manchester-ba-economics',                  name: 'BA Economics',                              fee: 25500 },
  { slug: 'manchester-ba-politics',                   name: 'BA Politics & International Relations',     fee: 25000 },
  { slug: 'manchester-ba-history',                    name: 'BA History',                                fee: 25000 },
  { slug: 'manchester-ba-sociology',                  name: 'BA Sociology',                              fee: 25000 },
  { slug: 'manchester-ba-social-anthropology',        name: 'BA Social Anthropology',                    fee: 25000 },
  { slug: 'manchester-ba-english-literature',         name: 'BA English Literature',                     fee: 24500 },
  { slug: 'manchester-ba-philosophy',                 name: 'BA Philosophy',                             fee: 24500 },
  { slug: 'manchester-llb-law',                       name: 'LLB Law',                                   fee: 25500 },
  { slug: 'manchester-bsc-pharmacology',              name: 'BSc Pharmacology',                          fee: 27500 },
  { slug: 'manchester-bsc-nursing',                   name: 'BSc Nursing (Adult)',                       fee: 26000 },
  { slug: 'manchester-bsc-nutrition',                 name: 'BSc Nutrition & Dietetics',                 fee: 27000 },
  { slug: 'manchester-bsoc-criminology',              name: 'BSocSc Criminology',                        fee: 25000 },
];

function makeManEntry(c, i, offset) {
  const annualUSD = Math.round(c.fee * 1.27);
  const annualINR = Math.round(annualUSD * 84);
  const totalGBP = c.fee * 3;
  return `  {
    "id": "manchester-${offset + i + 1}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.manchester.ac.uk/",
    "level": "Bachelor of Science",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalGBP": ${totalGBP},
    "livingCostGBP": 12000,
    "livingCostUSD": 15240,
    "livingCostINR": 1280160,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 61,
    "intakeMonths": ["September"],
    "campus": "Oxford Road Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Manchester",
    "countryCode": "GB"
  }`;
}

const manchesterAdditions = MANCHESTER_UG.map((c, i) => makeManEntry(c, i, 48)).join(',\n');

const manPath = path.join(__dirname, '..', 'data', 'manchester-courses.ts');
let manContent = fs.readFileSync(manPath, 'utf8');
manContent = manContent.replace(
  /(\s*"countryCode":\s*"GB"\s*\}\s*\]\s*as\s*const;)/,
  `    "countryCode": "GB"\n  },\n${manchesterAdditions}\n] as const;`
);
fs.writeFileSync(manPath, manContent, 'utf8');
console.log('Manchester: added', MANCHESTER_UG.length, 'courses');

// ──────────────────────────────────────────────────────────────
// UCL — 29 UG + 31 PG = 60 courses (brand new)
// ──────────────────────────────────────────────────────────────

const UCL_UG = [
  { id: 1,  slug: 'ucl-bsc-computer-science',          name: 'BSc Computer Science',                         fee: 28500 },
  { id: 2,  slug: 'ucl-bsc-mathematics',               name: 'BSc Mathematics',                              fee: 27500 },
  { id: 3,  slug: 'ucl-bsc-physics',                   name: 'BSc Physics',                                  fee: 29000 },
  { id: 4,  slug: 'ucl-bsc-chemistry',                 name: 'BSc Chemistry',                                fee: 29000 },
  { id: 5,  slug: 'ucl-bsc-biology',                   name: 'BSc Biological Sciences',                      fee: 28000 },
  { id: 6,  slug: 'ucl-bsc-biochemistry',              name: 'BSc Biochemistry',                             fee: 29000 },
  { id: 7,  slug: 'ucl-bsc-economics',                 name: 'BSc Economics',                                fee: 27500 },
  { id: 8,  slug: 'ucl-bsc-psychology',                name: 'BSc Psychology',                               fee: 27000 },
  { id: 9,  slug: 'ucl-bsc-neuroscience',              name: 'BSc Neuroscience',                             fee: 29500 },
  { id: 10, slug: 'ucl-bsc-data-science',              name: 'BSc Data Science & Machine Learning',          fee: 30000 },
  { id: 11, slug: 'ucl-bsc-statistics',                name: 'BSc Statistical Science',                      fee: 27500 },
  { id: 12, slug: 'ucl-bsc-geography',                 name: 'BSc Geography',                                fee: 27000 },
  { id: 13, slug: 'ucl-bsc-medical-sciences',          name: 'BSc Medical Sciences',                         fee: 31000 },
  { id: 14, slug: 'ucl-bsc-pharmacology',              name: 'BSc Pharmacology',                             fee: 29000 },
  { id: 15, slug: 'ucl-bsc-architecture',              name: 'BSc Architecture',                             fee: 28000 },
  { id: 16, slug: 'ucl-beng-computer-science',         name: 'BEng Computer Science (Integrated)',           fee: 30000 },
  { id: 17, slug: 'ucl-beng-civil-engineering',        name: 'BEng Civil Engineering',                       fee: 29500 },
  { id: 18, slug: 'ucl-beng-mechanical-engineering',   name: 'BEng Mechanical Engineering',                  fee: 29500 },
  { id: 19, slug: 'ucl-beng-electronic-electrical',    name: 'BEng Electronic & Electrical Engineering',     fee: 29500 },
  { id: 20, slug: 'ucl-beng-chemical-engineering',     name: 'BEng Chemical Engineering',                    fee: 29500 },
  { id: 21, slug: 'ucl-beng-biomedical-engineering',   name: 'BEng Biomedical Engineering',                  fee: 30000 },
  { id: 22, slug: 'ucl-ba-economics',                  name: 'BA Economics',                                 fee: 25000 },
  { id: 23, slug: 'ucl-ba-politics',                   name: 'BA Political Science',                         fee: 25000 },
  { id: 24, slug: 'ucl-ba-history',                    name: 'BA History',                                   fee: 24500 },
  { id: 25, slug: 'ucl-ba-law',                        name: 'LLB Laws',                                     fee: 26000 },
  { id: 26, slug: 'ucl-ba-anthropology',               name: 'BA Anthropology',                              fee: 24500 },
  { id: 27, slug: 'ucl-ba-philosophy',                 name: 'BA Philosophy',                                fee: 24500 },
  { id: 28, slug: 'ucl-bsc-info-management',           name: 'BSc Information Management for Business',      fee: 28000 },
  { id: 29, slug: 'ucl-bsc-global-health',             name: 'BSc Global Health',                            fee: 28000 },
];

const UCL_PG = [
  { id: 30, slug: 'ucl-msc-computer-science',          name: 'MSc Computer Science',                fee: 29700, dur: 1 },
  { id: 31, slug: 'ucl-msc-data-science',              name: 'MSc Data Science',                    fee: 29700, dur: 1 },
  { id: 32, slug: 'ucl-msc-machine-learning',          name: 'MSc Machine Learning',                fee: 29700, dur: 1 },
  { id: 33, slug: 'ucl-msc-cybersecurity',             name: 'MSc Information Security',            fee: 29700, dur: 1 },
  { id: 34, slug: 'ucl-msc-financial-risk-management', name: 'MSc Financial Risk Management',       fee: 25000, dur: 1 },
  { id: 35, slug: 'ucl-msc-economics',                 name: 'MSc Economics',                       fee: 24500, dur: 1 },
  { id: 36, slug: 'ucl-msc-finance',                   name: 'MSc Finance',                         fee: 27500, dur: 1 },
  { id: 37, slug: 'ucl-mba-global',                    name: 'Global MBA',                          fee: 39900, dur: 1 },
  { id: 38, slug: 'ucl-msc-management',                name: 'MSc Management',                      fee: 25000, dur: 1 },
  { id: 39, slug: 'ucl-msc-marketing',                 name: 'MSc Marketing',                       fee: 24000, dur: 1 },
  { id: 40, slug: 'ucl-msc-biomedical-engineering',    name: 'MSc Biomedical Engineering',          fee: 27500, dur: 1 },
  { id: 41, slug: 'ucl-msc-neuroscience',              name: 'MSc Neuroscience',                    fee: 27000, dur: 1 },
  { id: 42, slug: 'ucl-msc-biochemistry',              name: 'MSc Biochemistry',                    fee: 24000, dur: 1 },
  { id: 43, slug: 'ucl-msc-pharmacology',              name: 'MSc Drug Discovery & Development',   fee: 25000, dur: 1 },
  { id: 44, slug: 'ucl-msc-genetics',                  name: 'MSc Genetics',                        fee: 24000, dur: 1 },
  { id: 45, slug: 'ucl-msc-architecture',              name: 'MArch Architecture (Part 2)',         fee: 28000, dur: 2 },
  { id: 46, slug: 'ucl-msc-urban-planning',            name: 'MSc Urban Development Planning',     fee: 23000, dur: 1 },
  { id: 47, slug: 'ucl-msc-environmental-change',      name: 'MSc Environmental Change & Management', fee: 23000, dur: 1 },
  { id: 48, slug: 'ucl-msc-public-policy',             name: 'MSc Public Policy',                   fee: 22500, dur: 1 },
  { id: 49, slug: 'ucl-msc-education',                 name: 'MSc Education (International)',       fee: 20000, dur: 1 },
  { id: 50, slug: 'ucl-msc-global-health',             name: 'MSc Global Health & Development',    fee: 22000, dur: 1 },
  { id: 51, slug: 'ucl-msc-psychology',                name: 'MSc Research Methods in Psychology', fee: 21000, dur: 1 },
  { id: 52, slug: 'ucl-msc-cognitive-neuroscience',    name: 'MSc Cognitive Neuroscience',         fee: 27000, dur: 1 },
  { id: 53, slug: 'ucl-msc-civil-engineering',         name: 'MSc Civil Engineering',               fee: 26500, dur: 1 },
  { id: 54, slug: 'ucl-msc-mechanical-engineering',    name: 'MSc Mechanical Engineering',         fee: 26500, dur: 1 },
  { id: 55, slug: 'ucl-msc-sustainable-energy',        name: 'MSc Sustainable Energy Systems',     fee: 25000, dur: 1 },
  { id: 56, slug: 'ucl-msc-aml',                       name: 'MSc Applied Machine Learning',       fee: 30000, dur: 1 },
  { id: 57, slug: 'ucl-msc-human-computer-interaction',name: 'MSc Human-Computer Interaction',     fee: 27000, dur: 1 },
  { id: 58, slug: 'ucl-msc-law',                       name: 'LLM Laws',                            fee: 25500, dur: 1 },
  { id: 59, slug: 'ucl-msc-anthropology',              name: 'MSc Anthropology',                    fee: 21000, dur: 1 },
  { id: 60, slug: 'ucl-msc-statistics',                name: 'MSc Statistics',                      fee: 25000, dur: 1 },
];

function makeUclEntry(c, isUG) {
  const annualUSD = Math.round(c.fee * 1.27);
  const annualINR = Math.round(annualUSD * 84);
  const dur = isUG ? 3 : (c.dur || 1);
  const totalGBP = c.fee * dur;
  return `  {
    "id": "ucl-${c.id}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.ucl.ac.uk/",
    "level": "${isUG ? (c.slug.includes('-beng-') ? 'Bachelor of Engineering' : (c.slug.includes('-ba-') || c.slug.includes('-llb-') ? 'Bachelor of Arts' : 'Bachelor of Science')) : 'Masters'}",
    "studyLevel": "${isUG ? 'Undergraduate' : 'Postgraduate'}",
    "duration": "${isUG ? '3 years' : (dur === 2 ? '2 years' : '1 year')}",
    "durationYears": ${isUG ? 3 : dur},
    "annualGBP": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalGBP": ${totalGBP},
    "livingCostGBP": 15600,
    "livingCostUSD": 19812,
    "livingCostINR": 1664208,
    "ieltsMin": ${isUG ? 6.5 : 7.0},
    "toeflMin": ${isUG ? 92 : 96},
    "pteMin": ${isUG ? 66 : 70},
    "intakeMonths": ["September"],
    "campus": "London Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  }`;
}

const uclEntries = [
  ...UCL_UG.map(c => makeUclEntry(c, true)),
  ...UCL_PG.map(c => makeUclEntry(c, false)),
].join(',\n');

const uclTs = `// Auto-generated — UCL (University College London)
// 29 UG + 31 PG = 60 courses

export interface UclCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const uclCourses: UclCourse[] = [
${uclEntries}
];

export function getUclCourseBySlug(slug: string): UclCourse | undefined {
  return uclCourses.find(c => c.slug === slug);
}
`;

const uclPath = path.join(__dirname, '..', 'data', 'ucl-courses.ts');
fs.writeFileSync(uclPath, uclTs, 'utf8');
console.log('UCL: created', UCL_UG.length + UCL_PG.length, 'courses');

// verify Manchester
const manCheck = fs.readFileSync(manPath, 'utf8');
const manSlugs = [...manCheck.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Manchester total after:', manSlugs.length);
console.log('UCL total:', [...uclTs.matchAll(/"slug":\s*"([^"]+)"/g)].length);
console.log('Done!');
