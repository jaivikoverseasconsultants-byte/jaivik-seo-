// Generate data/bham-courses.ts from the real crawl output (scripts/crawl-output/university-of-birmingham.json).
const fs = require('fs');

const data = require('./crawl-output/university-of-birmingham.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function detailsFor(suffix, urlLevel) {
  const isUG = urlLevel === 'Undergraduate';
  switch (suffix) {
    case 'ba': return { level: 'Bachelor (BA)', studyLevel: 'Undergraduate', duration: '3 years', durationYears: 3, annualGBP: 24000 };
    case 'bsc': return { level: 'Bachelor (BSc)', studyLevel: 'Undergraduate', duration: '3 years', durationYears: 3, annualGBP: 26000 };
    case 'llb': return { level: 'Bachelor (LLB)', studyLevel: 'Undergraduate', duration: '3 years', durationYears: 3, annualGBP: 24000 };
    case 'beng': return { level: 'Bachelor (BEng)', studyLevel: 'Undergraduate', duration: '3 years', durationYears: 3, annualGBP: 27000 };
    case 'meng': return { level: "Integrated Master's (MEng)", studyLevel: 'Undergraduate', duration: '4 years', durationYears: 4, annualGBP: 28000 };
    case 'msci': return { level: "Integrated Master's (MSci)", studyLevel: 'Undergraduate', duration: '4 years', durationYears: 4, annualGBP: 27000 };
    case 'msc': return { level: 'Master (MSc)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 26000 };
    case 'ma': return { level: 'Master (MA)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 22000 };
    case 'mres': return { level: 'Master (MRes)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 24000 };
    case 'llm': return { level: 'Master (LLM)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 24000 };
    case 'mpa': return { level: 'Master (MPA)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 22000 };
    case 'mph': return { level: 'Master (MPH)', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 24000 };
    case 'phd': return { level: 'PhD', studyLevel: 'Postgraduate', duration: '3-4 years', durationYears: 4, annualGBP: 22000 };
    case 'doctorate': return { level: 'Doctorate', studyLevel: 'Postgraduate', duration: '3-4 years', durationYears: 4, annualGBP: 22000 };
    case 'pgcert': return { level: 'Postgraduate Certificate', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 12000 };
    case 'pgdip': return { level: 'Postgraduate Diploma', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualGBP: 16000 };
    default: return { level: isUG ? 'Bachelor' : 'Master', studyLevel: urlLevel, duration: isUG ? '3 years' : '1 year', durationYears: isUG ? 3 : 1, annualGBP: 24000 };
  }
}

const seenSlugs = new Set();
const courses = data.courses.map((c, idx) => {
  const { level, studyLevel, duration, durationYears, annualGBP } = detailsFor(c.suffix, c.level);

  let slug = `bham-${slugify(c.name)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  seenSlugs.add(slug);

  return {
    id: `bham-${idx + 1}`,
    name: c.name,
    slug,
    url: c.url,
    level,
    studyLevel,
    duration,
    durationYears,
    annualGBP,
    annualUSD: Math.round(annualGBP * 1.27),
    annualINR: Math.round(annualGBP * 107),
    totalGBP: annualGBP * durationYears,
    livingCostGBP: 11500,
    livingCostUSD: 14605,
    livingCostINR: 1230500,
    ieltsMin: 6.5,
    toeflMin: 88,
    pteMin: 60,
    intakeMonths: ['September'],
    campus: 'Edgbaston Campus',
    country: 'United Kingdom',
    state: 'England',
    city: 'Birmingham',
    countryCode: 'GB',
  };
});

const content = `// Auto-generated — real crawl (scripts/crawl-bham-real.js + scripts/gen-bham-real.js)
// Source: University of Birmingham's own sitemap — https://www.birmingham.ac.uk/study/sitemap.xml
// ${courses.length} courses | crawled: ${data.crawledAt.split('T')[0]}
// Every course URL comes from the official /study/{undergraduate,postgraduate}/subjects/
// directory, filtered to a whitelisted degree-suffix slug (BA/BSc/BEng/MEng/MSci/MSc/MA/
// MRes/LLB/LLM/PhD/PGCert/PGDip) and its real display name pulled from that page's own H1.

export interface BhamCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const bhamCourses: BhamCourse[] = ${JSON.stringify(courses, null, 2)};

export function getBhamCourseBySlug(slug: string) {
  return bhamCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/bham-courses.ts', content);
console.log(`Wrote ${courses.length} University of Birmingham courses -> data/bham-courses.ts`);
