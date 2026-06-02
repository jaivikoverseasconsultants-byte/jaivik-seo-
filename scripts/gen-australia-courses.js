const fs = require('fs');
const path = require('path');

// University of Melbourne — 15 UG + 23 PG = 38 courses

const UOM_UG = [
  { id: 1,  slug: 'uom-bsc-computer-science',         name: 'BSc Computer Science',                   fee: 46304 },
  { id: 2,  slug: 'uom-bsc-data-science',             name: 'BSc Data Science',                       fee: 46304 },
  { id: 3,  slug: 'uom-bsc-mathematics-statistics',   name: 'BSc Mathematics & Statistics',            fee: 45536 },
  { id: 4,  slug: 'uom-bsc-physics',                  name: 'BSc Physics',                             fee: 45536 },
  { id: 5,  slug: 'uom-bsc-biology',                  name: 'BSc Biology',                             fee: 44504 },
  { id: 6,  slug: 'uom-bsc-biochemistry',             name: 'BSc Biochemistry & Molecular Biology',    fee: 44504 },
  { id: 7,  slug: 'uom-bsc-neuroscience',             name: 'BSc Neuroscience',                        fee: 45536 },
  { id: 8,  slug: 'uom-bsc-environmental-science',    name: 'BSc Environmental Science',               fee: 43344 },
  { id: 9,  slug: 'uom-bsc-psychology',               name: 'BSc Psychology',                          fee: 40272 },
  { id: 10, slug: 'uom-beng-civil',                   name: 'BEng Civil Engineering (Honours)',        fee: 51000 },
  { id: 11, slug: 'uom-beng-mechanical',              name: 'BEng Mechanical Engineering (Honours)',   fee: 51000 },
  { id: 12, slug: 'uom-beng-electrical',              name: 'BEng Electrical Engineering (Honours)',   fee: 51000 },
  { id: 13, slug: 'uom-beng-software',                name: 'BEng Software Engineering (Honours)',     fee: 51000 },
  { id: 14, slug: 'uom-bcom',                         name: 'Bachelor of Commerce',                    fee: 44416 },
  { id: 15, slug: 'uom-ba-arts',                      name: 'Bachelor of Arts',                        fee: 35320 },
];

const UOM_PG = [
  { id: 16, slug: 'uom-msc-computer-science',         name: 'Master of Computer Science',              fee: 47264, dur: 2 },
  { id: 17, slug: 'uom-msc-data-science',             name: 'Master of Data Science',                  fee: 47264, dur: 1.5 },
  { id: 18, slug: 'uom-msc-information-systems',      name: 'Master of Information Systems',           fee: 42384, dur: 1.5 },
  { id: 19, slug: 'uom-mba',                          name: 'Master of Business Administration (MBA)', fee: 50000, dur: 2 },
  { id: 20, slug: 'uom-msc-management',               name: 'Master of Management',                    fee: 44416, dur: 1.5 },
  { id: 21, slug: 'uom-msc-finance',                  name: 'Master of Finance',                       fee: 44416, dur: 1.5 },
  { id: 22, slug: 'uom-msc-marketing',                name: 'Master of Marketing',                     fee: 42384, dur: 1.5 },
  { id: 23, slug: 'uom-meng-civil',                   name: 'Master of Civil Engineering',             fee: 47264, dur: 2 },
  { id: 24, slug: 'uom-meng-mechanical',              name: 'Master of Mechanical Engineering',        fee: 47264, dur: 2 },
  { id: 25, slug: 'uom-meng-electrical',              name: 'Master of Electrical Engineering',        fee: 47264, dur: 2 },
  { id: 26, slug: 'uom-meng-software',                name: 'Master of Software Engineering',          fee: 47264, dur: 2 },
  { id: 27, slug: 'uom-msc-biotechnology',            name: 'Master of Biotechnology',                 fee: 43856, dur: 1.5 },
  { id: 28, slug: 'uom-msc-public-health',            name: 'Master of Public Health',                 fee: 41288, dur: 1.5 },
  { id: 29, slug: 'uom-msc-global-health',            name: 'Master of Global Health',                 fee: 40000, dur: 1.5 },
  { id: 30, slug: 'uom-msc-neuroscience',             name: 'Master of Neuroscience',                  fee: 44000, dur: 2 },
  { id: 31, slug: 'uom-msc-environmental-management', name: 'Master of Environment',                   fee: 39920, dur: 1.5 },
  { id: 32, slug: 'uom-msc-architecture',             name: 'Master of Architecture',                  fee: 44416, dur: 2 },
  { id: 33, slug: 'uom-msc-urban-planning',           name: 'Master of Urban Planning',                fee: 38168, dur: 1.5 },
  { id: 34, slug: 'uom-msc-psychology',               name: 'Master of Psychology (Organisational)',   fee: 39920, dur: 2 },
  { id: 35, slug: 'uom-msc-education',                name: 'Master of Education',                     fee: 35240, dur: 1.5 },
  { id: 36, slug: 'uom-msc-arts',                     name: 'Master of Arts',                          fee: 33320, dur: 1.5 },
  { id: 37, slug: 'uom-msc-law',                      name: 'Juris Doctor (JD)',                       fee: 57700, dur: 3 },
  { id: 38, slug: 'uom-msc-biomedical',               name: 'Master of Biomedical Science',            fee: 44000, dur: 1.5 },
];

function makeEntry(c, isUG) {
  const annualUSD = Math.round(c.fee * 0.65);
  const annualINR = Math.round(annualUSD * 84);
  const dur = isUG ? 3 : (c.dur || 1.5);
  const totalAUD = Math.round(c.fee * dur);
  return `  {
    "id": "uom-${c.id}",
    "name": "${c.name}",
    "slug": "${c.slug}",
    "url": "https://www.unimelb.edu.au/",
    "level": "${isUG ? (c.slug.includes('-beng-') ? 'Bachelor of Engineering' : (c.slug.includes('-ba-') ? 'Bachelor of Arts' : (c.slug.includes('-bcom') ? 'Bachelor of Commerce' : 'Bachelor of Science'))) : 'Masters'}",
    "studyLevel": "${isUG ? 'Undergraduate' : 'Postgraduate'}",
    "duration": "${dur === 1 ? '1 year' : dur === 1.5 ? '1.5 years' : dur === 2 ? '2 years' : dur + ' years'}",
    "durationYears": ${dur},
    "annualAUD": ${c.fee},
    "annualUSD": ${annualUSD},
    "annualINR": ${annualINR},
    "totalAUD": ${totalAUD},
    "livingCostAUD": 22000,
    "livingCostUSD": 14300,
    "livingCostINR": 1201200,
    "ieltsMin": ${isUG ? 6.5 : 6.5},
    "toeflMin": ${isUG ? 79 : 79},
    "pteMin": ${isUG ? 58 : 58},
    "intakeMonths": ["February", "July"],
    "campus": "Parkville Campus",
    "country": "Australia",
    "state": "Victoria",
    "city": "Melbourne",
    "countryCode": "AU"
  }`;
}

const entries = [
  ...UOM_UG.map(c => makeEntry(c, true)),
  ...UOM_PG.map(c => makeEntry(c, false)),
].join(',\n');

const ts = `// Auto-generated — University of Melbourne
// 15 UG + 23 PG = 38 courses

export interface UomCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const uomCourses: UomCourse[] = [
${entries}
];

export function getUomCourseBySlug(slug: string): UomCourse | undefined {
  return uomCourses.find(c => c.slug === slug);
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'data', 'uom-courses.ts'), ts, 'utf8');
console.log('Melbourne: created', UOM_UG.length + UOM_PG.length, 'courses');
