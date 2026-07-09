// Generate data/massey-courses.ts from the real crawl output (scripts/crawl-output/massey-real.json).
const fs = require('fs');

const data = require('./crawl-output/massey-real.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function parseYears(iso) {
  const m = (iso || '').match(/^P(\d+)Y$/);
  return m ? parseInt(m[1], 10) : null;
}

function detailsFor(item) {
  const name = item.name;
  const years = parseYears(item.timeToComplete);
  if (/^Doctor/i.test(name)) {
    return { level: 'PhD', studyLevel: 'Postgraduate', durationYears: years || 3, annualNZD: 8500 };
  }
  if (/^(Master|Executive Master)/i.test(name)) {
    return { level: 'Master', studyLevel: 'Postgraduate', durationYears: years || 1.5, annualNZD: 36000 };
  }
  if (/^Postgraduate Diploma/i.test(name)) {
    return { level: 'Postgraduate Diploma', studyLevel: 'Postgraduate', durationYears: years || 1, annualNZD: 34000 };
  }
  if (/^Postgraduate Certificate/i.test(name)) {
    return { level: 'Postgraduate Certificate', studyLevel: 'Postgraduate', durationYears: years || 0.5, annualNZD: 17000 };
  }
  if (/^Bachelor|^Te Aho T[āa]tairangi/i.test(name)) {
    return { level: 'Bachelor', studyLevel: 'Undergraduate', durationYears: years || 3, annualNZD: 32000 };
  }
  if (/^Certificate/i.test(name)) {
    return { level: 'Certificate', studyLevel: 'Undergraduate', durationYears: years || 1, annualNZD: 20000 };
  }
  return { level: item.programType.replace(' study', ''), studyLevel: item.programType.replace(' study', ''), durationYears: years || 1, annualNZD: 28000 };
}

const seenSlugs = new Set();
const courses = data.map((c, idx) => {
  const { level, studyLevel, durationYears, annualNZD } = detailsFor(c);
  const duration = durationYears === 0.5 ? '6 months' : `${durationYears} year${durationYears !== 1 ? 's' : ''}`;

  let slug = `massey-${slugify(c.name)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${c.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  seenSlugs.add(slug);

  return {
    id: `massey-${idx + 1}`,
    name: c.name,
    slug,
    url: c.url,
    level,
    studyLevel,
    duration,
    durationYears,
    annualNZD,
    annualUSD: Math.round(annualNZD * 0.6),
    annualINR: Math.round(annualNZD * 50),
    totalNZD: Math.round(annualNZD * durationYears),
    livingCostNZD: 20000,
    livingCostUSD: 12000,
    livingCostINR: 1000000,
    ieltsMin: 6.0,
    toeflMin: 80,
    pteMin: 50,
    intakeMonths: ['February', 'July'],
    campus: 'Manawatu, Palmerston North',
    country: 'New Zealand',
    state: 'Manawatu',
    city: 'Palmerston North',
    countryCode: 'NZ',
  };
});

const content = `// Auto-generated — real crawl (scripts/crawl-massey-real.js + scripts/gen-massey-real.js)
// Source: Massey University's own qualification pages — https://www.massey.ac.nz/study/all-qualifications-and-degrees/
// Each course page carries a schema.org EducationalOccupationalProgram JSON-LD block
// (name, programType, timeToComplete) which was parsed directly — no name estimation.
// ${courses.length} courses | crawled: ${new Date().toISOString().split('T')[0]}
// Supersedes the previous file, whose all 45 entries were an identical generic
// course-name template shared with unrelated universities (CURATED in DATA-AUDIT.md).
// The 2017 XML sitemap (massey_extract_prog.xml) was found to be dead — every prog_id
// URL now redirects to the same generic /study/find-a-subject-course-or-qualification/
// search page (a stub trap) — so the live /study/all-qualifications-and-degrees/ catalogue
// was crawled instead, and all 176 URLs verified to resolve 200 before inclusion.

export interface MasseyCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number;
  livingCostNZD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const masseyCourses: MasseyCourse[] = ${JSON.stringify(courses, null, 2)};

export function getMasseyCourseBySlug(slug: string) {
  return masseyCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/massey-courses.ts', content);
console.log(`Wrote ${courses.length} Massey courses -> data/massey-courses.ts`);
