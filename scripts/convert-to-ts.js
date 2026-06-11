// Universal converter: crawl-output/{slug}.json → data/{outFile}.ts
// Usage: node convert-to-ts.js <slug> <outFile> <interfaceName> <arrayName> <country> <currency>
const fs = require('fs');
const path = require('path');

// ── config per university ────────────────────────────────────────────────────
const CONFIGS = {
  'university-college-london': {
    outFile: 'ucl-courses.ts',
    interfaceName: 'UclCourse',
    arrayName: 'uclCourses',
    helperName: 'getUclCourseBySlug',
    country: 'United Kingdom', state: 'England', city: 'London', countryCode: 'GB',
    currency: 'GBP',
    campus: 'Gower Street, London',
    feeGBP: { MBA: 43000, MSc: 28000, MA: 18000, MEng: 26000, MRes: 17000, MPhil: 16000, LLM: 24000, default: 25000 },
    ielts: 6.5, toefl: 90, pte: 70,
    intakes: ['September'],
    gbpUsd: 1.27, gbpInr: 107,
  },
  'university-of-edinburgh': {
    outFile: 'edinburgh-courses.ts',
    interfaceName: 'EdinburghCourse',
    arrayName: 'edinburghCourses',
    helperName: 'getEdinburghCourseBySlug',
    country: 'United Kingdom', state: 'Scotland', city: 'Edinburgh', countryCode: 'GB',
    currency: 'GBP',
    campus: 'Old College, Edinburgh',
    feeGBP: { MBA: 38000, MSc: 23000, MA: 16000, MEng: 22000, MRes: 16000, MPhil: 15000, LLM: 21000, default: 22000 },
    ielts: 6.5, toefl: 92, pte: 70,
    intakes: ['September'],
    gbpUsd: 1.27, gbpInr: 107,
  },
  'university-of-melbourne': {
    outFile: 'unimelb-courses.ts',
    interfaceName: 'UnimelbCourse',
    arrayName: 'unimelbCourses',
    helperName: 'getUnimelbCoursesBySlug',
    country: 'Australia', state: 'Victoria', city: 'Melbourne', countryCode: 'AU',
    currency: 'AUD',
    campus: 'Parkville, Melbourne',
    feeAUD: { MBA: 72000, MSc: 48000, MA: 37000, MEng: 46000, MRes: 36000, default: 42000 },
    ielts: 6.5, toefl: 94, pte: 65,
    intakes: ['March', 'July'],
    audUsd: 0.65, audInr: 54,
  },
  'mcmaster-university': {
    outFile: 'mcmaster-courses.ts',
    interfaceName: 'McmasterCourse',
    arrayName: 'mcmasterCourses',
    helperName: 'getMcmasterCoursesBySlug',
    country: 'Canada', state: 'Ontario', city: 'Hamilton', countryCode: 'CA',
    currency: 'CAD',
    campus: '1280 Main Street West, Hamilton',
    feeCAD: { MBA: 58000, MSc: 22000, MA: 20000, MEng: 24000, MPhil: 18000, default: 21000 },
    livingCostCAD: 12000,
    ielts: 6.5, toefl: 92, pte: 65,
    intakes: ['September'],
    cadUsd: 0.74, cadInr: 62,
    includeCAD: true,
  },
  'university-of-toronto': {
    outFile: 'uoft-courses.ts',
    interfaceName: 'UoftCourse',
    arrayName: 'uoftCourses',
    helperName: 'getUoftCoursesBySlug',
    country: 'Canada', state: 'Ontario', city: 'Toronto', countryCode: 'CA',
    currency: 'CAD',
    campus: 'St George Street, Toronto',
    feeCAD: { MBA: 68000, MSc: 26000, MA: 22000, MEng: 28000, MPhil: 19000, default: 24000 },
    livingCostCAD: 14000,
    ielts: 6.5, toefl: 93, pte: 65,
    intakes: ['September'],
    cadUsd: 0.74, cadInr: 62,
    includeCAD: true,
  },
  // ── Batch 2 ──────────────────────────────────────────────────────────────
  'kings-college-london': {
    outFile: 'kcl-courses.ts',
    interfaceName: 'KclCourse',
    arrayName: 'kclCourses',
    helperName: 'getKclCourseBySlug',
    country: 'United Kingdom', state: 'England', city: 'London', countryCode: 'GB',
    currency: 'GBP',
    campus: 'Strand, London',
    feeGBP: { MBA: 40000, MSc: 25000, MA: 17000, MEng: 24000, MRes: 16000, MPhil: 15000, LLM: 22000, default: 23000 },
    ielts: 6.5, toefl: 92, pte: 70,
    intakes: ['September'],
    gbpUsd: 1.27, gbpInr: 107,
  },
  'university-of-warwick': {
    outFile: 'warwick-courses.ts',
    interfaceName: 'WarwickCourse',
    arrayName: 'warwickCourses',
    helperName: 'getWarwickCourseBySlug',
    country: 'United Kingdom', state: 'England', city: 'Coventry', countryCode: 'GB',
    currency: 'GBP',
    campus: 'Gibbet Hill Road, Coventry',
    feeGBP: { MBA: 44000, MSc: 24000, MA: 16500, MEng: 23000, MRes: 16000, MPhil: 15000, default: 22000 },
    ielts: 6.5, toefl: 90, pte: 70,
    intakes: ['September', 'January'],
    gbpUsd: 1.27, gbpInr: 107,
  },
  'university-of-melbourne': {
    outFile: 'uom-courses.ts',
    interfaceName: 'UomCourse',
    arrayName: 'uomCourses',
    helperName: 'getUomCourseBySlug',
    country: 'Australia', state: 'Victoria', city: 'Melbourne', countryCode: 'AU',
    currency: 'AUD',
    campus: 'Parkville, Melbourne',
    feeAUD: { MBA: 74000, MSc: 50000, MA: 38000, MEng: 48000, MRes: 36000, default: 44000 },
    livingCostAUD: 22000,
    ielts: 6.5, toefl: 94, pte: 65,
    intakes: ['March', 'July'],
    audUsd: 0.65, audInr: 54,
    includeAUD: true,
  },
  'university-of-sydney': {
    outFile: 'usyd-courses.ts',
    interfaceName: 'UsydCourse',
    arrayName: 'usydCourses',
    helperName: 'getUsydCourseBySlug',
    country: 'Australia', state: 'New South Wales', city: 'Sydney', countryCode: 'AU',
    currency: 'AUD',
    campus: 'Camperdown, Sydney',
    feeAUD: { MBA: 72000, MSc: 47000, MA: 36000, MEng: 46000, MRes: 34000, default: 42000 },
    livingCostAUD: 24000,
    ielts: 6.5, toefl: 85, pte: 64,
    intakes: ['February', 'July'],
    audUsd: 0.65, audInr: 54,
    includeAUD: true,
  },
  'australian-national-university': {
    outFile: 'anu-courses.ts',
    interfaceName: 'AnuCourse',
    arrayName: 'anuCourses',
    helperName: 'getAnuCourseBySlug',
    country: 'Australia', state: 'Australian Capital Territory', city: 'Canberra', countryCode: 'AU',
    currency: 'AUD',
    campus: 'Acton, Canberra',
    feeAUD: { MBA: 68000, MSc: 44000, MA: 34000, MEng: 42000, MRes: 32000, default: 40000 },
    livingCostAUD: 20000,
    ielts: 6.5, toefl: 90, pte: 64,
    intakes: ['February', 'July'],
    audUsd: 0.65, audInr: 54,
    includeAUD: true,
  },
  'monash-university': {
    outFile: 'monash-courses.ts',
    interfaceName: 'MonashCourse',
    arrayName: 'monashCourses',
    helperName: 'getMonashCourseBySlug',
    country: 'Australia', state: 'Victoria', city: 'Melbourne', countryCode: 'AU',
    currency: 'AUD',
    campus: 'Clayton, Melbourne',
    feeAUD: { MBA: 68000, MSc: 44000, MA: 34000, MEng: 42000, MRes: 32000, default: 40000 },
    livingCostAUD: 22000,
    ielts: 6.5, toefl: 79, pte: 58,
    intakes: ['February', 'July'],
    audUsd: 0.65, audInr: 54,
    includeAUD: true,
  },
  'university-of-queensland': {
    outFile: 'uq-courses.ts',
    interfaceName: 'UqCourse',
    arrayName: 'uqCourses',
    helperName: 'getUqCourseBySlug',
    country: 'Australia', state: 'Queensland', city: 'Brisbane', countryCode: 'AU',
    currency: 'AUD',
    campus: 'St Lucia, Brisbane',
    feeAUD: { MBA: 65000, MSc: 43000, MA: 33000, MEng: 41000, MRes: 31000, default: 39000 },
    livingCostAUD: 21000,
    ielts: 6.5, toefl: 87, pte: 64,
    intakes: ['February', 'July', 'November'],
    audUsd: 0.65, audInr: 54,
    includeAUD: true,
  },
  'university-of-british-columbia': {
    outFile: 'ubc-courses.ts',
    interfaceName: 'UbcCourse',
    arrayName: 'ubcCourses',
    helperName: 'getUbcCoursesBySlug',
    country: 'Canada', state: 'British Columbia', city: 'Vancouver', countryCode: 'CA',
    currency: 'CAD',
    campus: 'Point Grey, Vancouver',
    feeCAD: { MBA: 62000, MSc: 24000, MA: 20000, MEng: 26000, MPhil: 18000, default: 22000 },
    livingCostCAD: 16000,
    ielts: 6.5, toefl: 90, pte: 65,
    intakes: ['September'],
    cadUsd: 0.74, cadInr: 62,
    includeCAD: true,
  },
  'mcgill-university': {
    outFile: 'mcgill-courses.ts',
    interfaceName: 'McgillCourse',
    arrayName: 'mcgillCourses',
    helperName: 'getMcgillCoursesBySlug',
    country: 'Canada', state: 'Quebec', city: 'Montreal', countryCode: 'CA',
    currency: 'CAD',
    campus: 'Sherbrooke Street, Montreal',
    feeCAD: { MBA: 55000, MSc: 22000, MA: 18000, MEng: 24000, MPhil: 17000, default: 20000 },
    livingCostCAD: 14000,
    ielts: 6.5, toefl: 90, pte: 65,
    intakes: ['September'],
    cadUsd: 0.74, cadInr: 62,
    includeCAD: true,
  },
  'university-of-waterloo': {
    outFile: 'waterloo-courses.ts',
    interfaceName: 'WaterlooCourse',
    arrayName: 'waterlooCourses',
    helperName: 'getWaterlooCoursesBySlug',
    country: 'Canada', state: 'Ontario', city: 'Waterloo', countryCode: 'CA',
    currency: 'CAD',
    campus: '200 University Avenue West, Waterloo',
    feeCAD: { MBA: 50000, MSc: 20000, MA: 17000, MEng: 22000, MPhil: 16000, default: 19000 },
    livingCostCAD: 12000,
    ielts: 6.5, toefl: 90, pte: 65,
    intakes: ['September'],
    cadUsd: 0.74, cadInr: 62,
    includeCAD: true,
  },
  'national-university-of-singapore': {
    outFile: 'nus-courses.ts',
    interfaceName: 'NusCourse',
    arrayName: 'nusCourses',
    helperName: 'getNusCoursesBySlug',
    country: 'Singapore', state: 'Singapore', city: 'Singapore', countryCode: 'SG',
    currency: 'SGD',
    campus: '21 Lower Kent Ridge Road, Singapore',
    feeSGD: { MBA: 58000, MSc: 42000, MA: 30000, MEng: 38000, MPhil: 28000, default: 36000 },
    ielts: 6.5, toefl: 85, pte: 64,
    intakes: ['August'],
    sgdUsd: 0.75, sgdInr: 62,
  },
};

function parseDuration(name) {
  const m = name.match(/\((\d+(?:\.\d+)?)\s*(year|years|month|months)\)/i);
  if (m) {
    const n = parseFloat(m[1]);
    if (m[2].toLowerCase().startsWith('month')) return { str: `${n} months`, years: Math.round(n / 12 * 10) / 10 };
    return { str: n === 1 ? '1 year' : `${n} years`, years: n };
  }
  return { str: '1 year', years: 1 };
}

const NAV_BLOCKLIST = new Set([
  'student support', 'tools', 'faculties', 'on campus', 'graduate studies', 'programs',
  'connect with us', 'start your application', 'mobile menu', 'main menu',
  'find the program', 'see our student life', 'get to know',
]);

function parseDegree(name) {
  const m = name.match(/\b(MBA|MSc|MEng|MRes|MPhil|LLM|MPH|MPA|MFA|MA)\b/);
  return m ? m[0] : 'MSc';
}

function isNavItem(name) {
  return NAV_BLOCKLIST.has(name.toLowerCase());
}

function makeSlug(prefix, name) {
  return (prefix + '-' + name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+$/, '')
  ).substring(0, 80);
}

function convertEntry(cfg, raw, idx) {
  const baseName = raw.name.replace(/\s*\(\s*\d+(?:\.\d+)?\s*(?:year|years|month|months)\s*\)/i, '').trim();
  const { str: durationStr, years: durationYears } = parseDuration(raw.name);
  const degree = parseDegree(baseName);
  const level = degree === 'MBA' ? 'MBA' : degree === 'PhD' ? 'PhD' : 'Masters';
  const studyLevel = 'Postgraduate';
  const slug = makeSlug(cfg.arrayName.replace('Courses', ''), baseName);

  // Currency-specific fee calculation
  let annualUSD, annualINR, annualLocal;
  if (cfg.currency === 'GBP') {
    const feeMap = cfg.feeGBP;
    annualLocal = feeMap[degree] || feeMap.default;
    annualUSD = Math.round(annualLocal * cfg.gbpUsd);
    annualINR = Math.round(annualLocal * cfg.gbpInr);
  } else if (cfg.currency === 'AUD') {
    const feeMap = cfg.feeAUD;
    annualLocal = feeMap[degree] || feeMap.default;
    annualUSD = Math.round(annualLocal * cfg.audUsd);
    annualINR = Math.round(annualLocal * cfg.audInr);
  } else if (cfg.currency === 'CAD') {
    const feeMap = cfg.feeCAD;
    annualLocal = feeMap[degree] || feeMap.default;
    annualUSD = Math.round(annualLocal * cfg.cadUsd);
    annualINR = Math.round(annualLocal * cfg.cadInr);
  } else if (cfg.currency === 'SGD') {
    const feeMap = cfg.feeSGD;
    annualLocal = feeMap[degree] || feeMap.default;
    annualUSD = Math.round(annualLocal * cfg.sgdUsd);
    annualINR = Math.round(annualLocal * cfg.sgdInr);
  }

  const annualGBP = cfg.currency === 'GBP' ? annualLocal : Math.round(annualUSD / 1.27);
  const livingCostGBP = cfg.currency === 'GBP' ? 14000 : Math.round(annualUSD * 0.5 / 1.27);
  const livingCostUSD = Math.round(livingCostGBP * 1.27);
  const livingCostINR = Math.round(livingCostGBP * 107);

  const entry = {
    id: `${cfg.arrayName.replace('Courses', '')}-${idx + 1}`,
    name: baseName,
    slug,
    url: raw.url || `https://${cfg.country.toLowerCase().replace(/\s/g, '')}.edu`,
    level,
    studyLevel,
    duration: durationStr,
    durationYears,
    annualGBP,
    annualUSD,
    annualINR,
    totalGBP: Math.round(annualGBP * durationYears),
    livingCostGBP,
    livingCostUSD,
    livingCostINR,
    ieltsMin: cfg.ielts,
    toeflMin: cfg.toefl,
    pteMin: cfg.pte,
    intakeMonths: cfg.intakes,
    campus: cfg.campus,
    country: cfg.country,
    state: cfg.state,
    city: cfg.city,
    countryCode: cfg.countryCode,
  };

  if (cfg.includeCAD) {
    entry.annualCAD = annualLocal;
    entry.livingCostCAD = cfg.livingCostCAD || 12000;
    entry.totalCAD = Math.round(annualLocal * durationYears);
  }

  if (cfg.includeAUD) {
    entry.annualAUD = annualLocal;
    entry.livingCostAUD = cfg.livingCostAUD || 22000;
    entry.totalAUD = Math.round(annualLocal * durationYears);
  }

  return entry;
}

function convert(slug) {
  const cfg = CONFIGS[slug];
  if (!cfg) { console.log(`No config for ${slug}`); return; }

  const jsonPath = path.join(__dirname, 'crawl-output', `${slug}.json`);
  if (!fs.existsSync(jsonPath)) { console.log(`No JSON for ${slug}`); return; }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (!data.courses || data.courses.length === 0) { console.log(`No courses in JSON for ${slug}`); return; }

  const filtered = data.courses.filter(c => !isNavItem(c.name));
  const entries = filtered.map((c, i) => convertEntry(cfg, c, i));

  const prefix = cfg.arrayName.replace('Courses', '');
  const cadFields = cfg.includeCAD
    ? `\n  annualCAD: number; livingCostCAD: number; totalCAD: number;`
    : cfg.includeAUD
    ? `\n  annualAUD: number; livingCostAUD: number; totalAUD: number;`
    : '';

  const lines = [
    `// Auto-generated — do not edit manually`,
    `// Source: Puppeteer crawl of ${data.url}`,
    `// Crawled: ${data.crawledAt}`,
    `// ${entries.length} courses`,
    ``,
    `export interface ${cfg.interfaceName} {`,
    `  id: string; name: string; slug: string; url: string;`,
    `  level: string; studyLevel: string; duration: string; durationYears: number;`,
    `  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;`,
    `  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;${cadFields}`,
    `  ieltsMin: number; toeflMin: number; pteMin: number;`,
    `  intakeMonths: string[]; campus: string;`,
    `  country: string; state: string; city: string; countryCode: string;`,
    `}`,
    ``,
    `export const ${cfg.arrayName}: ${cfg.interfaceName}[] = [`,
    ...entries.map(e => `  ${JSON.stringify(e)},`),
    `];`,
    ``,
    `export function ${cfg.helperName}(slug: string): ${cfg.interfaceName} | undefined {`,
    `  return ${cfg.arrayName}.find(c => c.slug === slug);`,
    `}`,
  ];

  const outPath = path.join(__dirname, '..', 'data', cfg.outFile);
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`✓ ${slug}: ${entries.length} courses → data/${cfg.outFile}`);
  return entries.length;
}

// Run for all slugs passed as args, or all that have JSON
const args = process.argv.slice(2);
const slugs = args.length > 0 ? args : Object.keys(CONFIGS);

let total = 0;
slugs.forEach(s => {
  const n = convert(s);
  if (n) total += n;
});
console.log(`\nTotal: ${total} courses converted`);
