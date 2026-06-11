// Converts crawl-output/university-of-manchester.json → data/manchester-courses.ts
const fs = require('fs');
const path = require('path');

const data = require('./crawl-output/university-of-manchester.json');

// Default fees by degree type (based on Manchester averages)
const FEE_GBP = {
  MBA: 42000,
  MSc: 26000,
  MA: 17500,
  MEng: 23000,
  MRes: 16000,
  MPhil: 15000,
  LLM: 22000,
  MPH: 21000,
  MPA: 20000,
  default: 26000,
};

const GBP_USD = 1.27;
const GBP_INR = 107;

function parseCourse(raw, idx) {
  // Extract duration: "(1 year)", "(2 years)", "(18 months)"
  const durMatch = raw.name.match(/\(\s*(\d+(?:\.\d+)?)\s*(year|years|month|months)\s*\)/i);
  let durationStr = '1 year';
  let durationYears = 1;
  if (durMatch) {
    const num = parseFloat(durMatch[1]);
    const unit = durMatch[2].toLowerCase();
    if (unit.startsWith('month')) {
      durationYears = Math.round(num / 12 * 10) / 10;
      durationStr = `${num} months`;
    } else {
      durationYears = num;
      durationStr = num === 1 ? '1 year' : `${num} years`;
    }
  }

  // Base name without duration parenthetical
  const baseName = raw.name.replace(/\s*\(\s*\d+(?:\.\d+)?\s*(?:year|years|month|months)\s*\)/i, '').trim();

  // Degree type
  const degMatch = baseName.match(/\b(MBA|MSc|MEng|MRes|MPhil|LLM|MPH|MPA|MFA|MA)\b/);
  const degree = degMatch ? degMatch[0] : 'MSc';
  const annualGBP = FEE_GBP[degree] || FEE_GBP.default;

  // Level
  const level = degree === 'MBA' ? 'MBA' : 'Masters';
  const studyLevel = 'Postgraduate';

  // Slug
  const slug = ('manchester-' + baseName.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+$/, '')
  ).substring(0, 80);

  return {
    id: `manchester-${idx + 1}`,
    name: baseName,
    slug,
    url: raw.url,
    level,
    studyLevel,
    duration: durationStr,
    durationYears,
    annualGBP,
    annualUSD: Math.round(annualGBP * GBP_USD),
    annualINR: Math.round(annualGBP * GBP_INR),
    totalGBP: Math.round(annualGBP * durationYears),
    livingCostGBP: 12000,
    livingCostUSD: Math.round(12000 * GBP_USD),
    livingCostINR: Math.round(12000 * GBP_INR),
    ieltsMin: 6.5,
    toeflMin: 92,
    pteMin: 70,
    intakeMonths: ['September'],
    campus: 'Oxford Road, Manchester',
    country: 'United Kingdom',
    state: 'England',
    city: 'Manchester',
    countryCode: 'GB',
  };
}

const courses = data.courses.map((c, i) => parseCourse(c, i));

const lines = [
  '// Auto-generated — do not edit manually',
  `// Source: Puppeteer crawl of ${data.url}`,
  `// Crawled: ${data.crawledAt}`,
  '',
  'export interface ManchesterCourse {',
  '  id: string; name: string; slug: string; url: string;',
  '  level: string; studyLevel: string; duration: string; durationYears: number;',
  '  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;',
  '  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;',
  '  ieltsMin: number; toeflMin: number; pteMin: number;',
  '  intakeMonths: string[]; campus: string;',
  '  country: string; state: string; city: string; countryCode: string;',
  '}',
  '',
  'export const manchesterCourses: ManchesterCourse[] = [',
  ...courses.map(c => '  ' + JSON.stringify(c) + ','),
  '];',
  '',
  'export function getManchesterCoursesBySlug(slug: string): ManchesterCourse | undefined {',
  '  return manchesterCourses.find(c => c.slug === slug);',
  '}',
];

const outPath = path.join(__dirname, '../data/manchester-courses.ts');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');

console.log(`Written ${courses.length} courses to data/manchester-courses.ts`);
console.log('Sample:');
courses.slice(0, 3).forEach(c =>
  console.log(`  ${c.name} | ${c.level} | £${c.annualGBP} | ${c.duration} | ${c.url.substring(0, 60)}`)
);
