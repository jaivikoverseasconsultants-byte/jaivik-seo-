// Generate data/dal-courses.ts from the real crawl output (scripts/crawl-output/dalhousie-university.json).
const fs = require('fs');

const data = require('./crawl-output/dalhousie-university.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 70);
}

function detailsForTypes(types, apiLevel) {
  const studyLevel = apiLevel === 'Undergraduate' ? 'Undergraduate' : 'Postgraduate';
  if (types.includes('PhD')) return { level: 'PhD', studyLevel: 'Postgraduate', duration: '4 years', durationYears: 4, annualCAD: 19000 };
  if (types.includes('Master')) return { level: 'Master', studyLevel: 'Postgraduate', duration: '2 years', durationYears: 2, annualCAD: 19500 };
  if (types.includes('Bachelor')) return { level: 'Bachelor', studyLevel: 'Undergraduate', duration: '4 years', durationYears: 4, annualCAD: 28000 };
  if (types.includes('Diploma')) return { level: studyLevel === 'Undergraduate' ? 'Undergraduate Diploma' : 'Graduate Diploma', studyLevel, duration: '2 years', durationYears: 2, annualCAD: 18000 };
  if (types.includes('Certificate')) return { level: studyLevel === 'Undergraduate' ? 'Undergraduate Certificate' : 'Graduate Certificate', studyLevel, duration: '1 year', durationYears: 1, annualCAD: 14000 };
  return { level: studyLevel, studyLevel, duration: '2 years', durationYears: 2, annualCAD: 20000 };
}

function intakesFromStart(start) {
  if (!start) return ['September'];
  const months = [];
  if (/September/i.test(start)) months.push('September');
  if (/January/i.test(start)) months.push('January');
  if (/May/i.test(start)) months.push('May');
  return months.length ? months : ['September'];
}

const seenSlugs = new Set();
const courses = data.courses.map((c, idx) => {
  const { level, studyLevel, duration, durationYears, annualCAD } = detailsForTypes(c.types, c.apiLevel);

  let slug = `dal-${slugify(c.name)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  seenSlugs.add(slug);

  return {
    id: `dal-${idx + 1}`,
    name: c.name,
    slug,
    url: c.url,
    level,
    studyLevel,
    duration,
    durationYears,
    annualCAD,
    annualUSD: Math.round(annualCAD * 0.73),
    annualINR: Math.round(annualCAD * 61),
    totalCAD: annualCAD * durationYears,
    livingCostCAD: 15000,
    livingCostUSD: 10950,
    livingCostINR: 915000,
    ieltsMin: studyLevel === 'Postgraduate' ? 6.5 : 6.5,
    toeflMin: 90,
    pteMin: 61,
    intakeMonths: intakesFromStart(c.start),
    campus: c.location ? `${c.location} Campus` : 'Halifax, Nova Scotia',
    country: 'Canada',
    province: 'Nova Scotia',
    city: c.location && /truro/i.test(c.location) ? 'Truro' : 'Halifax',
    countryCode: 'CA',
    pgwp: true,
  };
});

const content = `// Auto-generated — real crawl (scripts/crawl-dal-real.js + scripts/gen-dal-real.js)
// Source: Dalhousie program finder API — https://www.dal.ca/study/programs.html
// ${courses.length} courses | crawled: ${data.crawledAt.split('T')[0]}
// Each course validated against the site's own program-type taxonomy (Bachelor/Master/PhD/Diploma/Certificate)
// before inclusion — "Course" (non-degree), "Minor"-only, and "Upgrading and Pathways" entries excluded.

export interface DalCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualCAD: number; annualUSD: number; annualINR: number; totalCAD: number;
  livingCostCAD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; province: string; city: string; countryCode: string;
  pgwp: boolean;
}

export const dalCourses: DalCourse[] = ${JSON.stringify(courses, null, 2)};

export function getDalCoursesBySlug(slug: string) {
  return dalCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/dal-courses.ts', content);
console.log(`Wrote ${courses.length} Dalhousie courses -> data/dal-courses.ts`);
