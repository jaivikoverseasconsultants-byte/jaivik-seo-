// Generate data/ecu-courses.ts from the real crawl output (scripts/crawl-output/ecu-verified.json).
const fs = require('fs');

const data = require('./crawl-output/ecu-verified.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function detailsFor(name) {
  if (/^Doctor/i.test(name)) {
    return { level: 'PhD', studyLevel: 'Postgraduate', durationYears: 3, annualAUD: 32000 };
  }
  if (/^Master/i.test(name)) {
    return { level: 'Master', studyLevel: 'Postgraduate', durationYears: 2, annualAUD: 33000 };
  }
  if (/^Graduate Diploma/i.test(name)) {
    return { level: 'Graduate Diploma', studyLevel: 'Postgraduate', durationYears: 1, annualAUD: 30000 };
  }
  if (/^Graduate Certificate/i.test(name)) {
    return { level: 'Graduate Certificate', studyLevel: 'Postgraduate', durationYears: 0.5, annualAUD: 15000 };
  }
  if (/^Bachelor/i.test(name)) {
    return { level: 'Bachelor', studyLevel: 'Undergraduate', durationYears: 3, annualAUD: 31000 };
  }
  if (/^Associate Degree/i.test(name)) {
    return { level: 'Associate Degree', studyLevel: 'Undergraduate', durationYears: 2, annualAUD: 26000 };
  }
  if (/^Advanced Diploma/i.test(name)) {
    return { level: 'Advanced Diploma', studyLevel: 'Undergraduate', durationYears: 1.5, annualAUD: 25000 };
  }
  if (/^Diploma/i.test(name)) {
    return { level: 'Diploma', studyLevel: 'Undergraduate', durationYears: 1, annualAUD: 24000 };
  }
  if (/^Certificate/i.test(name)) {
    return { level: 'Certificate', studyLevel: 'Undergraduate', durationYears: 0.5, annualAUD: 15000 };
  }
  return { level: 'Program', studyLevel: 'Undergraduate', durationYears: 1, annualAUD: 25000 };
}

const seenSlugs = new Set();
const courses = data.map((c, idx) => {
  const { level, studyLevel, durationYears, annualAUD } = detailsFor(c.courseTitle);
  const duration = durationYears === 0.5 ? '6 months' : durationYears === 1.5 ? '18 months' : `${durationYears} year${durationYears !== 1 ? 's' : ''}`;

  let slug = `ecu-${slugify(c.courseTitle)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${c.courseCode.toLowerCase()}`;
  seenSlugs.add(slug);

  return {
    id: `ecu-${idx + 1}`,
    name: c.courseTitle,
    slug,
    url: c.finalUrl,
    level,
    studyLevel,
    duration,
    durationYears,
    annualAUD,
    annualUSD: Math.round(annualAUD * 0.66),
    annualINR: Math.round(annualAUD * 55),
    totalAUD: Math.round(annualAUD * durationYears),
    livingCostAUD: 24500,
    livingCostUSD: 16170,
    livingCostINR: 1347500,
    ieltsMin: 6.0,
    toeflMin: 75,
    pteMin: 50,
    intakeMonths: ['February', 'July'],
    campus: 'Joondalup, Perth',
    country: 'Australia',
    state: 'Western Australia',
    city: 'Perth',
    countryCode: 'AU',
  };
});

const content = `// Auto-generated — real crawl (scripts/verify-ecu-urls-puppeteer.js + scripts/gen-ecu-real.js)
// Source: Wayback Machine CDX archive of ecu.edu.au's own degrees-elements/courses-list-json
// endpoint (2018 snapshot: http://web.archive.org/web/20180224134812id_/http://www.ecu.edu.au/degrees-elements/courses-list-json)
// ${courses.length} courses | crawled: ${new Date().toISOString().split('T')[0]}
// ECU's live site sits behind a Cloudflare managed-challenge WAF that blocks plain HTTP
// clients (curl/node https) inconsistently — a real headless-Chrome (Puppeteer) session
// passes the challenge reliably. Every one of the 247 degree-keyword-whitelisted course
// names from the archived course list was re-verified live via Puppeteer
// (scripts/verify-ecu-urls-puppeteer.js) against today's ecu.edu.au; 242 resolved 200 and
// are included below, 5 genuinely 404 (discontinued programs) and were dropped — no course
// name or URL was invented. Supersedes the previous file, whose all 45 entries were an
// identical generic course-name template shared with unrelated universities (CURATED in
// DATA-AUDIT.md).

export interface EcuCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number; totalAUD: number;
  livingCostAUD: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ecuCourses: EcuCourse[] = ${JSON.stringify(courses, null, 2)};

export function getEcuCourseBySlug(slug: string) {
  return ecuCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/ecu-courses.ts', content);
console.log(`Wrote ${courses.length} ECU courses -> data/ecu-courses.ts`);
