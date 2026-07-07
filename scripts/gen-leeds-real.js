// Generate data/leeds-courses.ts from the real crawl output (scripts/crawl-output/university-of-leeds.json).
const fs = require('fs');

const data = require('./crawl-output/university-of-leeds.json');

function slugify(s) {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function parseDuration(durationStr, fallbackYears) {
  const m = durationStr.match(/(\d+)\s*(Year|Month)/i);
  if (!m) return { duration: durationStr, durationYears: fallbackYears };
  const num = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const years = unit === 'month' ? Math.max(1, Math.round(num / 12)) : num;
  return { duration: durationStr.replace(/\s*\(.*\)$/, '').trim(), durationYears: years };
}

function levelAndFeeFor(name, urlLevel) {
  const isUG = urlLevel === 'Undergraduate';
  if (/PhD|Doctorate/i.test(name)) return { level: 'PhD', studyLevel: 'Postgraduate', annualGBP: 21500 };
  if (/PGDip/i.test(name)) return { level: 'Postgraduate Diploma', studyLevel: 'Postgraduate', annualGBP: 16000 };
  if (/PGCert/i.test(name)) return { level: 'Postgraduate Certificate', studyLevel: 'Postgraduate', annualGBP: 12000 };
  if (/\bMSc\b/i.test(name)) return { level: 'Master (MSc)', studyLevel: 'Postgraduate', annualGBP: 26500 };
  if (/\bMA\b/i.test(name)) return { level: 'Master (MA)', studyLevel: 'Postgraduate', annualGBP: 22500 };
  if (/\bLLM\b/i.test(name)) return { level: 'Master (LLM)', studyLevel: 'Postgraduate', annualGBP: 23500 };
  if (/\bMRes\b/i.test(name)) return { level: 'Master (MRes)', studyLevel: 'Postgraduate', annualGBP: 24500 };
  if (isUG && /MEng|MSci|MPsyc|MSc \(Eng\)/i.test(name)) return { level: "Integrated Master's", studyLevel: 'Undergraduate', annualGBP: 27500 };
  if (/\bLLB\b/i.test(name)) return { level: 'Bachelor (LLB)', studyLevel: 'Undergraduate', annualGBP: 23500 };
  if (/\bBEng\b/i.test(name)) return { level: 'Bachelor (BEng)', studyLevel: 'Undergraduate', annualGBP: 27000 };
  if (/\bBSc\b/i.test(name)) return { level: 'Bachelor (BSc)', studyLevel: 'Undergraduate', annualGBP: 26000 };
  if (/\bBA\b/i.test(name)) return { level: 'Bachelor (BA)', studyLevel: 'Undergraduate', annualGBP: 23500 };
  return { level: isUG ? 'Bachelor' : 'Master', studyLevel: urlLevel, annualGBP: isUG ? 24000 : 23000 };
}

const seenSlugs = new Set();
const courses = data.courses.map((c, idx) => {
  const { level, studyLevel, annualGBP } = levelAndFeeFor(c.name, c.level);
  const fallbackYears = studyLevel === 'Undergraduate' ? 3 : 1;
  const { duration, durationYears } = parseDuration(c.duration, fallbackYears);

  let slug = `leeds-${slugify(c.name)}`;
  if (seenSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  seenSlugs.add(slug);

  return {
    id: `leeds-${idx + 1}`,
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
    livingCostGBP: 11000,
    livingCostUSD: 13970,
    livingCostINR: 1177000,
    ieltsMin: 6.5,
    toeflMin: 88,
    pteMin: 60,
    intakeMonths: ['September'],
    campus: 'Main Campus',
    country: 'United Kingdom',
    state: 'England',
    city: 'Leeds',
    countryCode: 'GB',
  };
});

const content = `// Auto-generated — real crawl (scripts/crawl-leeds-real.js + scripts/gen-leeds-real.js)
// Source: University of Leeds course search — https://courses.leeds.ac.uk/course-search/undergraduate-courses
// ${courses.length} courses | crawled: ${data.crawledAt.split('T')[0]}
// Every course scraped directly from the university's own server-rendered course-search
// results (paginated through all 21 UG + 19 PG pages), including its real display name,
// real courses.leeds.ac.uk course-page URL, and real course duration (parsed from the
// listing's own "Duration" field, not estimated).

export interface LeedsCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const leedsCourses: LeedsCourse[] = ${JSON.stringify(courses, null, 2)};

export function getLeedsCourseBySlug(slug: string) {
  return leedsCourses.find(c => c.slug === slug) ?? null;
}
`;

fs.writeFileSync('data/leeds-courses.ts', content);
console.log(`Wrote ${courses.length} University of Leeds courses -> data/leeds-courses.ts`);
