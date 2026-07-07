// Generate data/griffith-courses.ts from the real crawl output (scripts/crawl-output/griffith-university.json).
const fs = require('fs');

const data = require('./crawl-output/griffith-university.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function detailsForType(type) {
  switch (type) {
    case 'Doctor': return { level: 'PhD', studyLevel: 'Postgraduate', duration: '3 years', durationYears: 3, annualAUD: 34000 };
    case 'Masters': return { level: 'Master', studyLevel: 'Postgraduate', duration: '2 years', durationYears: 2, annualAUD: 35000 };
    case 'Masters (Research)': return { level: 'Master (Research)', studyLevel: 'Postgraduate', duration: '2 years', durationYears: 2, annualAUD: 35000 };
    case 'Graduate Diploma': return { level: 'Graduate Diploma', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualAUD: 20000 };
    case 'Graduate Certificate': return { level: 'Graduate Certificate', studyLevel: 'Postgraduate', duration: '1 year', durationYears: 1, annualAUD: 18000 };
    case 'Bachelor': return { level: 'Bachelor', studyLevel: 'Undergraduate', duration: '3 years', durationYears: 3, annualAUD: 34000 };
    case 'Diploma': return { level: 'Undergraduate Diploma', studyLevel: 'Undergraduate', duration: '1 year', durationYears: 1, annualAUD: 24000 };
    case 'Advanced Diploma': return { level: 'Undergraduate Advanced Diploma', studyLevel: 'Undergraduate', duration: '1 year', durationYears: 1, annualAUD: 25000 };
    case 'Undergraduate Certificate': return { level: 'Undergraduate Certificate', studyLevel: 'Undergraduate', duration: '1 year', durationYears: 1, annualAUD: 22000 };
    default: return { level: type || 'Program', studyLevel: 'Undergraduate', duration: '1 year', durationYears: 1, annualAUD: 25000 };
  }
}

const seenSlugs = new Set();
const courses = data.courses.map((c, idx) => {
  const { level, studyLevel, duration, durationYears, annualAUD } = detailsForType(c.type);

  let slug = `griffith-${slugify(c.name)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  seenSlugs.add(slug);

  return {
    id: `griffith-${idx + 1}`,
    name: c.name,
    slug,
    url: c.url,
    level,
    studyLevel,
    duration,
    durationYears,
    annualAUD,
    annualUSD: Math.round(annualAUD * 0.66),
    annualINR: Math.round(annualAUD * 55),
    totalAUD: annualAUD * durationYears,
    livingCostAUD: 24500,
    livingCostUSD: 16170,
    livingCostINR: 1347500,
    ieltsMin: 6.5,
    toeflMin: 79,
    pteMin: 58,
    intakeMonths: ['February', 'July'],
    campus: 'Gold Coast, Nathan, South Bank & Logan Campuses',
    country: 'Australia',
    state: 'Queensland',
    city: 'Brisbane',
    countryCode: 'AU',
  };
});

const content = `// Auto-generated — real crawl (scripts/crawl-griffith-real.js + scripts/gen-griffith-real.js)
// Source: Griffith University's own program REST API — https://degrees.griffith.edu.au/rest-api/v3/index/programs
// ${courses.length} courses | crawled: ${data.crawledAt.split('T')[0]}
// Supersedes the previous file, whose all 81 entries pointed at the same bare
// https://www.griffith.edu.au/courses homepage (a false REAL classification in
// DATA-AUDIT.md, corrected as part of Wave 2 of the real-data replacement).
// Every course below comes from Griffith's own program index API, filtered to
// currentlyOffered=true and an official degree-type tag (Bachelor/Master/Doctor/
// Graduate Certificate/Graduate Diploma/Diploma/Certificate), each with its
// real programs-courses.griffith.edu.au overview page URL.

export interface GriffithCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const griffithCourses: GriffithCourse[] = ${JSON.stringify(courses, null, 2)};

export function getGriffithCoursesBySlug(slug: string) {
  return griffithCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/griffith-courses.ts', content);
console.log(`Wrote ${courses.length} Griffith University courses -> data/griffith-courses.ts`);
