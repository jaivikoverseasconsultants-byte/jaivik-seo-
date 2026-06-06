/**
 * Expand European, Danish, Swedish, Singapore, Dubai universities to 40+ courses
 */
const fs = require('fs');
const path = require('path');

const BASE = 'C:/Users/Harshita/jaivik-seo';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

const PROGRAMS = {
  cs: ['MSc Computer Science', 'MSc Advanced Computer Science', 'MSc Data Science', 'MSc Artificial Intelligence',
    'MSc Machine Learning', 'MSc Cyber Security', 'MSc Cloud Computing', 'MSc Software Engineering',
    'MSc Information Systems', 'MSc Human-Computer Interaction', 'MSc Big Data Analytics',
    'MSc Computer Networks', 'MSc Robotics and AI', 'MSc Natural Language Processing',
    'MSc Computer Vision', 'BSc Computer Science', 'BSc Software Engineering', 'BSc Information Technology',
    'MSc Blockchain Technology', 'MSc Internet of Things'],
  business: ['MSc Finance', 'MSc Accounting and Finance', 'MSc International Business', 'MSc Management',
    'MSc Marketing', 'MSc Business Analytics', 'MSc Entrepreneurship', 'MSc Supply Chain Management',
    'MSc Strategic Management', 'MBA', 'MSc Economics', 'MSc Financial Engineering',
    'MSc Banking and Finance', 'MSc Digital Marketing', 'BSc Business Administration',
    'BSc Economics', 'MSc Corporate Finance', 'MSc Investment Management',
    'MSc Global Supply Chain', 'MSc Operations Management'],
  engineering: ['MSc Mechanical Engineering', 'MSc Electrical Engineering', 'MSc Civil Engineering',
    'MSc Chemical Engineering', 'MSc Environmental Engineering', 'MSc Industrial Engineering',
    'MSc Aerospace Engineering', 'MSc Biomedical Engineering', 'MSc Robotics',
    'MSc Sustainable Energy', 'BEng Mechanical Engineering', 'BEng Electrical Engineering',
    'BEng Civil Engineering', 'MSc Materials Science', 'MSc Systems Engineering'],
  science: ['MSc Mathematics', 'MSc Physics', 'MSc Chemistry', 'MSc Biology', 'MSc Statistics',
    'MSc Environmental Science', 'MSc Neuroscience', 'MSc Biotechnology', 'MSc Bioinformatics',
    'BSc Mathematics', 'BSc Physics', 'BSc Chemistry', 'BSc Biology',
    'MSc Ecology', 'MSc Geology'],
  social: ['MA International Relations', 'MA History', 'MSc Psychology', 'MA Education',
    'MSc Social Research', 'MA Anthropology', 'MSc Criminology', 'LLM Law',
    'MA Political Science', 'MSc Public Policy', 'MSc International Development',
    'MA Sociology', 'BA History', 'BA Political Science', 'MA Linguistics',
    'MSc Communication Studies', 'MA Philosophy', 'MSc Media Studies'],
  health: ['MSc Public Health', 'MSc Global Health', 'MSc Biomedical Sciences', 'MSc Pharmacy',
    'MSc Nursing', 'MSc Healthcare Management', 'MSc Clinical Psychology',
    'MSc Sports Science', 'MSc Nutrition Science', 'MSc Epidemiology'],
  arts: ['MA Arts Management', 'MA Design', 'MA Architecture', 'MA Film Studies',
    'MA Media Studies', 'MA Journalism', 'MA Communication', 'MSc Urban Planning',
    'MA Creative Writing', 'MA Fashion Management'],
};

function countCourses(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  const q = (content.match(/"id":/g) || []).length;
  const u = (content.match(/\bid: '/g) || []).length;
  return q + u;
}

function readExistingNames(content) {
  const names = new Set();
  for (const m of content.matchAll(/"name":\s*"([^"]+)"/g)) names.add(m[1]);
  for (const m of content.matchAll(/\bname: '([^']+)'/g)) names.add(m[1]);
  return names;
}

// ─── EUR format (JSON style) ──────────────────────────────────────────────────
function appendEurCourses(cfg, targetCount = 45) {
  const filePath = path.join(BASE, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠ SKIP: ${cfg.file} not found`); return 0; }

  const existing = fs.readFileSync(filePath, 'utf8');
  const currentCount = countCourses(filePath);
  if (currentCount >= targetCount) { console.log(`✓ ${cfg.name}: ${currentCount} already`); return 0; }

  const needed = targetCount - currentCount;
  const existingNames = readExistingNames(existing);

  // Build pool from specified program categories
  const pool = [];
  for (const cat of (cfg.categories || ['cs', 'business', 'engineering', 'science', 'social'])) {
    pool.push(...(PROGRAMS[cat] || []));
  }
  const newNames = [...new Set(pool)].filter(n => !existingNames.has(n)).slice(0, needed);

  if (newNames.length === 0) { console.log(`⚠ ${cfg.name}: no new names`); return 0; }

  // Get last ID
  let lastId = 0;
  const re = new RegExp(`"${cfg.prefix}-(\\d+)"`, 'g');
  for (const m of existing.matchAll(re)) {
    const n = parseInt(m[1]); if (n > lastId) lastId = n;
  }

  const newCourses = newNames.map((name, i) => {
    const isUG = /\b(BSc|BEng|BA |Bachelor)\b/.test(name);
    const isMBA = /\bMBA\b/.test(name);
    const annual = isUG ? Math.round(cfg.feeUG || cfg.feePG * 0.8)
      : isMBA ? Math.round(cfg.feePG * 1.4) : cfg.feePG;
    const dur = isUG ? 3 : isMBA ? 1.5 : 1;
    const level = isUG ? 'Bachelors' : isMBA ? 'MBA' : 'Masters';
    const studyLevel = isUG ? 'Undergraduate' : 'Postgraduate';
    const obj = {
      id: `${cfg.prefix}-${lastId + i + 1}`,
      name, slug: `${cfg.prefix}-${slugify(name)}`,
      url: cfg.url, level, studyLevel,
      duration: isUG ? '3 years' : isMBA ? '1.5 years' : '1 year',
      durationYears: dur,
      annualINR: Math.round(annual * (cfg.inrRate || 88)),
      ieltsMin: isUG ? cfg.ielts - 0.5 : cfg.ielts,
      toeflMin: cfg.toefl, pteMin: cfg.pte,
      intakeMonths: cfg.intakes,
      campus: cfg.campus,
      country: cfg.country, state: cfg.state, city: cfg.city, countryCode: cfg.cc,
    };
    if (cfg.curr === 'EUR') {
      obj.annualEUR = annual; obj.annualUSD = Math.round(annual * 1.08);
      obj.totalEUR = Math.round(annual * dur);
      obj.livingCostEUR = cfg.living.eur; obj.livingCostUSD = cfg.living.usd;
      obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'SGD') {
      obj.annualSGD = annual; obj.annualUSD = Math.round(annual * 0.74);
      obj.totalSGD = Math.round(annual * dur);
      obj.livingCostSGD = cfg.living.sgd; obj.livingCostUSD = cfg.living.usd;
      obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'AED') {
      obj.annualAED = annual; obj.annualUSD = Math.round(annual * 0.272);
      obj.totalAED = Math.round(annual * dur);
      obj.livingCostAED = cfg.living.aed; obj.livingCostUSD = cfg.living.usd;
      obj.livingCostINR = cfg.living.inr;
    }
    return obj;
  });

  const newJson = newCourses.map(c => JSON.stringify(c, null, 2)).join(',\n');

  // Find insertion point - before the last ]; or ] as const;
  const insertPoint = existing.lastIndexOf('\n]');
  if (insertPoint === -1) { console.log(`⚠ ${cfg.name}: no closing ] found`); return 0; }
  const updated = existing.slice(0, insertPoint) + ',\n' + newJson + existing.slice(insertPoint);

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${cfg.name}: +${newCourses.length} courses (${currentCount} → ${currentCount + newCourses.length})`);
  return newCourses.length;
}

// ─── DKK/SEK unquoted TS format ───────────────────────────────────────────────
function appendTsStyleCourses(cfg, targetCount = 45) {
  const filePath = path.join(BASE, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠ SKIP: ${cfg.file} not found`); return 0; }

  const existing = fs.readFileSync(filePath, 'utf8');
  const currentCount = countCourses(filePath);
  if (currentCount >= targetCount) { console.log(`✓ ${cfg.name}: ${currentCount} already`); return 0; }

  const needed = targetCount - currentCount;
  const existingNames = readExistingNames(existing);

  const pool = [];
  for (const cat of (cfg.categories || ['cs', 'business', 'engineering', 'science', 'social'])) {
    pool.push(...(PROGRAMS[cat] || []));
  }
  const newNames = [...new Set(pool)].filter(n => !existingNames.has(n)).slice(0, needed);
  if (newNames.length === 0) { console.log(`⚠ ${cfg.name}: no new names`); return 0; }

  // Find last ID number
  let lastId = 0;
  const re = new RegExp(`${cfg.prefix}-c(\\d+)`, 'g');
  for (const m of existing.matchAll(re)) {
    const n = parseInt(m[1]); if (n > lastId) lastId = n;
  }

  const newEntries = newNames.map((name, i) => {
    const isUG = /\b(BSc|BEng|BA |Bachelor)\b/.test(name);
    const isMBA = /\bMBA\b/.test(name);
    const annual = isUG ? Math.round(cfg.feeUG || cfg.feePG * 0.85)
      : isMBA ? Math.round(cfg.feePG * 1.2) : cfg.feePG;
    const dur = isUG ? 3 : isMBA ? 2 : 1;
    const level = isUG ? 'Bachelor' : isMBA ? 'MBA' : 'Master';
    const studyLevel = isUG ? 'Bachelor' : 'Master';
    const numStr = String(lastId + i + 1).padStart(3, '0');

    if (cfg.curr === 'DKK') {
      return `  {
    id: '${cfg.prefix}-c${numStr}', name: '${name}', slug: '${cfg.prefix}-${slugify(name)}', url: '${cfg.url}',
    level: '${level}', studyLevel: '${studyLevel}', duration: '${isUG ? '3 years' : isMBA ? '2 years' : '1 year'}', durationYears: ${dur},
    annualDKK: ${annual}, annualUSD: ${Math.round(annual * 0.143)}, annualINR: ${Math.round(annual * 11.8)}, totalDKK: ${annual * dur},
    livingCostDKK: ${cfg.living.dkk}, livingCostUSD: ${cfg.living.usd}, livingCostINR: ${cfg.living.inr},
    ieltsMin: ${isUG ? cfg.ielts - 0.5 : cfg.ielts}, toeflMin: ${cfg.toefl}, pteMin: ${cfg.pte},
    intakeMonths: ${JSON.stringify(cfg.intakes)}, campus: '${cfg.campus}',
    country: '${cfg.country}', state: '${cfg.state}', city: '${cfg.city}', countryCode: '${cfg.cc}',
  }`;
    } else if (cfg.curr === 'SEK') {
      return `  {
    id: '${cfg.prefix}-c${numStr}', name: '${name}', slug: '${cfg.prefix}-${slugify(name)}', url: '${cfg.url}',
    level: '${level}', studyLevel: '${studyLevel}', duration: '${isUG ? '3 years' : '1 year'}', durationYears: ${dur},
    annualSEK: ${annual}, annualUSD: ${Math.round(annual * 0.093)}, annualINR: ${Math.round(annual * 7.7)}, totalSEK: ${annual * dur},
    livingCostSEK: ${cfg.living.sek}, livingCostUSD: ${cfg.living.usd}, livingCostINR: ${cfg.living.inr},
    ieltsMin: ${isUG ? cfg.ielts - 0.5 : cfg.ielts}, toeflMin: ${cfg.toefl}, pteMin: ${cfg.pte},
    intakeMonths: ${JSON.stringify(cfg.intakes)}, campus: '${cfg.campus}',
    country: '${cfg.country}', state: '${cfg.state}', city: '${cfg.city}', countryCode: '${cfg.cc}',
  }`;
    }
    return '';
  }).filter(Boolean);

  // Insert before the closing ] of the array
  const closeIdx = existing.lastIndexOf('\n]');
  if (closeIdx === -1) { console.log(`⚠ ${cfg.name}: no ] found`); return 0; }
  const updated = existing.slice(0, closeIdx) + ',\n' + newEntries.join(',\n') + existing.slice(closeIdx);

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${cfg.name}: +${newEntries.length} courses (${currentCount} → ${currentCount + newEntries.length})`);
  return newEntries.length;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSITY CONFIGS
// ═══════════════════════════════════════════════════════════════════════════════

const EUR_UNIS = [
  // FRANCE
  { file: 'data/aix-marseille-university-courses.ts', prefix: 'amu', name: 'Aix-Marseille University',
    curr: 'EUR', url: 'https://www.univ-amu.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'France', state: 'Provence-Alpes-Côte d\'Azur', city: 'Marseille', cc: 'FR',
    campus: 'Marseille Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'social', 'business', 'health'] },
  { file: 'data/university-of-bordeaux-courses.ts', prefix: 'ubx', name: 'University of Bordeaux',
    curr: 'EUR', url: 'https://www.u-bordeaux.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'France', state: 'Nouvelle-Aquitaine', city: 'Bordeaux', cc: 'FR',
    campus: 'Bordeaux Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['science', 'cs', 'social', 'business', 'engineering'] },
  { file: 'data/university-of-grenoble-alpes-courses.ts', prefix: 'uga', name: 'University of Grenoble Alpes',
    curr: 'EUR', url: 'https://www.univ-grenoble-alpes.fr', feePG: 4500, feeUG: 2800,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'France', state: 'Auvergne-Rhône-Alpes', city: 'Grenoble', cc: 'FR',
    campus: 'Grenoble Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'engineering', 'science', 'social', 'business'] },
  { file: 'data/university-of-lyon-courses.ts', prefix: 'ulyon', name: 'University of Lyon',
    curr: 'EUR', url: 'https://www.univ-lyon1.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'France', state: 'Auvergne-Rhône-Alpes', city: 'Lyon', cc: 'FR',
    campus: 'Lyon Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'social', 'business', 'health'] },
  { file: 'data/university-of-montpellier-courses.ts', prefix: 'umontpellier', name: 'University of Montpellier',
    curr: 'EUR', url: 'https://www.umontpellier.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'France', state: 'Occitanie', city: 'Montpellier', cc: 'FR',
    campus: 'Montpellier Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['science', 'health', 'cs', 'social', 'business'] },
  { file: 'data/university-of-strasbourg-courses.ts', prefix: 'unistra', name: 'University of Strasbourg',
    curr: 'EUR', url: 'https://www.unistra.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'France', state: 'Grand Est', city: 'Strasbourg', cc: 'FR',
    campus: 'Strasbourg Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['science', 'social', 'cs', 'business', 'arts'] },
  { file: 'data/university-of-toulouse-courses.ts', prefix: 'uttoulouse', name: 'University of Toulouse',
    curr: 'EUR', url: 'https://www.ut-capitole.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'France', state: 'Occitanie', city: 'Toulouse', cc: 'FR',
    campus: 'Toulouse Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['engineering', 'cs', 'social', 'science', 'business'] },
  { file: 'data/sciences-po-paris-courses.ts', prefix: 'sciences-po', name: 'Sciences Po Paris',
    curr: 'EUR', url: 'https://www.sciencespo.fr', feePG: 13500, feeUG: 12000,
    living: { eur: 16000, usd: 17280, inr: 1408000 },
    country: 'France', state: 'Île-de-France', city: 'Paris', cc: 'FR',
    campus: 'Paris Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September'],
    categories: ['social', 'business', 'cs', 'arts'] },
  { file: 'data/sorbonne-courses.ts', prefix: 'sorbonne', name: 'Sorbonne University',
    curr: 'EUR', url: 'https://www.sorbonne-universite.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 16000, usd: 17280, inr: 1408000 },
    country: 'France', state: 'Île-de-France', city: 'Paris', cc: 'FR',
    campus: 'Paris Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['social', 'science', 'arts', 'cs', 'health'] },
  { file: 'data/sorbonne-university-courses.ts', prefix: 'sorbonneu', name: 'Sorbonne University',
    curr: 'EUR', url: 'https://www.sorbonne-universite.fr', feePG: 4000, feeUG: 2500,
    living: { eur: 16000, usd: 17280, inr: 1408000 },
    country: 'France', state: 'Île-de-France', city: 'Paris', cc: 'FR',
    campus: 'Paris Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['social', 'science', 'arts', 'cs', 'health'] },
  { file: 'data/ecole-polytechnique-courses.ts', prefix: 'ecole-poly', name: 'École Polytechnique',
    curr: 'EUR', url: 'https://www.polytechnique.edu', feePG: 16000, feeUG: 12000,
    living: { eur: 15000, usd: 16200, inr: 1320000 },
    country: 'France', state: 'Île-de-France', city: 'Palaiseau', cc: 'FR',
    campus: 'Palaiseau Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September'],
    categories: ['cs', 'engineering', 'science', 'business'] },
  { file: 'data/emlyon-business-school-courses.ts', prefix: 'emlyon', name: 'emlyon Business School',
    curr: 'EUR', url: 'https://www.em-lyon.com', feePG: 20000, feeUG: 16000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'France', state: 'Auvergne-Rhône-Alpes', city: 'Lyon', cc: 'FR',
    campus: 'Lyon Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'January'],
    categories: ['business', 'cs', 'social'] },
  { file: 'data/insead-courses.ts', prefix: 'insead', name: 'INSEAD',
    curr: 'EUR', url: 'https://www.insead.edu', feePG: 75000, feeUG: 40000,
    living: { eur: 15000, usd: 16200, inr: 1320000 },
    country: 'France', state: 'Île-de-France', city: 'Fontainebleau', cc: 'FR',
    campus: 'Fontainebleau Campus', ielts: 7.0, toefl: 105, pte: 72, intakes: ['September', 'January'],
    categories: ['business'] },
  { file: 'data/essec-business-school-courses.ts', prefix: 'essec', name: 'ESSEC Business School',
    curr: 'EUR', url: 'https://www.essec.edu', feePG: 25000, feeUG: 18000,
    living: { eur: 16000, usd: 17280, inr: 1408000 },
    country: 'France', state: 'Île-de-France', city: 'Cergy', cc: 'FR',
    campus: 'Cergy Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September'],
    categories: ['business', 'cs', 'social', 'arts'] },

  // NETHERLANDS
  { file: 'data/leiden-university-courses.ts', prefix: 'leiden', name: 'Leiden University',
    curr: 'EUR', url: 'https://www.universiteitleiden.nl', feePG: 19000, feeUG: 14000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Netherlands', state: 'South Holland', city: 'Leiden', cc: 'NL',
    campus: 'Leiden Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['social', 'cs', 'science', 'health', 'business', 'arts'] },
  { file: 'data/tilburg-university-courses.ts', prefix: 'tilburg', name: 'Tilburg University',
    curr: 'EUR', url: 'https://www.tilburguniversity.edu', feePG: 16500, feeUG: 12000,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Netherlands', state: 'North Brabant', city: 'Tilburg', cc: 'NL',
    campus: 'Tilburg Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['business', 'social', 'cs', 'science'] },
  { file: 'data/wageningen-university-courses.ts', prefix: 'wur', name: 'Wageningen University',
    curr: 'EUR', url: 'https://www.wur.nl', feePG: 17000, feeUG: 13000,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Netherlands', state: 'Gelderland', city: 'Wageningen', cc: 'NL',
    campus: 'Wageningen Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['science', 'cs', 'business', 'social', 'engineering'] },
  { file: 'data/erasmus-university-rotterdam-courses.ts', prefix: 'eur', name: 'Erasmus University Rotterdam',
    curr: 'EUR', url: 'https://www.eur.nl', feePG: 18000, feeUG: 13000,
    living: { eur: 12500, usd: 13500, inr: 1100000 },
    country: 'Netherlands', state: 'South Holland', city: 'Rotterdam', cc: 'NL',
    campus: 'Rotterdam Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['business', 'social', 'cs', 'health', 'science'] },
  { file: 'data/maastricht-university-courses.ts', prefix: 'maastricht', name: 'Maastricht University',
    curr: 'EUR', url: 'https://www.maastrichtuniversity.nl', feePG: 16500, feeUG: 11900,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Netherlands', state: 'Limburg', city: 'Maastricht', cc: 'NL',
    campus: 'Maastricht Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['business', 'cs', 'social', 'health', 'science'] },
  { file: 'data/university-of-twente-courses.ts', prefix: 'utwente', name: 'University of Twente',
    curr: 'EUR', url: 'https://www.utwente.nl', feePG: 17500, feeUG: 13000,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Netherlands', state: 'Overijssel', city: 'Enschede', cc: 'NL',
    campus: 'Enschede Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['engineering', 'cs', 'science', 'business', 'social'] },
  { file: 'data/university-of-amsterdam-courses.ts', prefix: 'uva', name: 'University of Amsterdam',
    curr: 'EUR', url: 'https://www.uva.nl', feePG: 18000, feeUG: 13000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Netherlands', state: 'North Holland', city: 'Amsterdam', cc: 'NL',
    campus: 'Amsterdam Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['social', 'cs', 'science', 'business', 'arts', 'health'] },
  { file: 'data/vrije-universiteit-amsterdam-courses.ts', prefix: 'vua', name: 'Vrije Universiteit Amsterdam',
    curr: 'EUR', url: 'https://www.vu.nl', feePG: 17000, feeUG: 12500,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Netherlands', state: 'North Holland', city: 'Amsterdam', cc: 'NL',
    campus: 'Amsterdam Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['social', 'cs', 'science', 'business', 'health', 'arts'] },
  { file: 'data/amsterdam-courses.ts', prefix: 'amsuni', name: 'University of Amsterdam',
    curr: 'EUR', url: 'https://www.uva.nl', feePG: 18000, feeUG: 13000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Netherlands', state: 'North Holland', city: 'Amsterdam', cc: 'NL',
    campus: 'Amsterdam Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['social', 'cs', 'science', 'business', 'arts'] },
  { file: 'data/amsterdam-university-of-applied-sciences-courses.ts', prefix: 'hva', name: 'Amsterdam UAS',
    curr: 'EUR', url: 'https://www.hva.nl', feePG: 12000, feeUG: 10000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Netherlands', state: 'North Holland', city: 'Amsterdam', cc: 'NL',
    campus: 'Amsterdam Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['business', 'cs', 'social', 'arts', 'engineering'] },
  { file: 'data/radboud-university-courses.ts', prefix: 'ru', name: 'Radboud University',
    curr: 'EUR', url: 'https://www.ru.nl', feePG: 17500, feeUG: 12000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Netherlands', state: 'Gelderland', city: 'Nijmegen', cc: 'NL',
    campus: 'Nijmegen Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['cs', 'science', 'social', 'health', 'business'] },
  { file: 'data/delft-courses.ts', prefix: 'tudelft', name: 'Delft University of Technology',
    curr: 'EUR', url: 'https://www.tudelft.nl', feePG: 18000, feeUG: 14000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Netherlands', state: 'South Holland', city: 'Delft', cc: 'NL',
    campus: 'Delft Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science', 'social'] },
  { file: 'data/eindhoven-courses.ts', prefix: 'tue', name: 'Eindhoven University of Technology',
    curr: 'EUR', url: 'https://www.tue.nl', feePG: 18000, feeUG: 14000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Netherlands', state: 'North Brabant', city: 'Eindhoven', cc: 'NL',
    campus: 'Eindhoven Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science'] },
  { file: 'data/tu-eindhoven-courses.ts', prefix: 'tueind', name: 'TU Eindhoven',
    curr: 'EUR', url: 'https://www.tue.nl', feePG: 18000, feeUG: 14000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Netherlands', state: 'North Brabant', city: 'Eindhoven', cc: 'NL',
    campus: 'Eindhoven Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science'] },
  { file: 'data/han-university-courses.ts', prefix: 'han', name: 'HAN University of Applied Sciences',
    curr: 'EUR', url: 'https://www.hanuniversity.com', feePG: 11000, feeUG: 9000,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Netherlands', state: 'Gelderland', city: 'Arnhem', cc: 'NL',
    campus: 'Arnhem Campus', ielts: 6.0, toefl: 80, pte: 56, intakes: ['September'],
    categories: ['business', 'engineering', 'cs', 'social'] },
  { file: 'data/university-of-groningen-courses.ts', prefix: 'rug', name: 'University of Groningen',
    curr: 'EUR', url: 'https://www.rug.nl', feePG: 17000, feeUG: 13000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Netherlands', state: 'Groningen', city: 'Groningen', cc: 'NL',
    campus: 'Groningen Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['cs', 'science', 'business', 'social', 'health'] },
  { file: 'data/utrecht-university-courses.ts', prefix: 'uu', name: 'Utrecht University',
    curr: 'EUR', url: 'https://www.uu.nl', feePG: 18000, feeUG: 14000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Netherlands', state: 'Utrecht', city: 'Utrecht', cc: 'NL',
    campus: 'Utrecht Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'February'],
    categories: ['science', 'social', 'cs', 'health', 'business'] },

  // SWEDEN
  { file: 'data/chalmers-university-courses.ts', prefix: 'chalmers', name: 'Chalmers University',
    curr: 'EUR', url: 'https://www.chalmers.se', feePG: 14000, feeUG: 11000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Västra Götaland', city: 'Gothenburg', cc: 'SE',
    campus: 'Gothenburg Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/karolinska-institutet-courses.ts', prefix: 'ki', name: 'Karolinska Institutet',
    curr: 'EUR', url: 'https://www.ki.se', feePG: 16000, feeUG: 12000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Stockholm', city: 'Stockholm', cc: 'SE',
    campus: 'Solna Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['health', 'science'] },
  { file: 'data/linkoping-university-courses.ts', prefix: 'liu', name: 'Linköping University',
    curr: 'EUR', url: 'https://www.liu.se', feePG: 13000, feeUG: 10000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Östergötland', city: 'Linköping', cc: 'SE',
    campus: 'Linköping Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social'] },
  { file: 'data/halmstad-university-courses.ts', prefix: 'hh', name: 'Halmstad University',
    curr: 'EUR', url: 'https://www.hh.se', feePG: 11000, feeUG: 9000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Halland', city: 'Halmstad', cc: 'SE',
    campus: 'Halmstad Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social'] },
  { file: 'data/jonkoping-university-courses.ts', prefix: 'ju', name: 'Jönköping University',
    curr: 'EUR', url: 'https://www.ju.se', feePG: 12000, feeUG: 10000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Jönköping', city: 'Jönköping', cc: 'SE',
    campus: 'Jönköping Campus', ielts: 6.0, toefl: 87, pte: 60, intakes: ['September'],
    categories: ['business', 'cs', 'engineering', 'social'] },
  { file: 'data/malardalen-university-courses.ts', prefix: 'mdh', name: 'Mälardalen University',
    curr: 'EUR', url: 'https://www.mdh.se', feePG: 11000, feeUG: 9000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Västmanland', city: 'Västerås', cc: 'SE',
    campus: 'Västerås Campus', ielts: 6.0, toefl: 87, pte: 60, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social'] },
  { file: 'data/mid-sweden-university-courses.ts', prefix: 'miun', name: 'Mid Sweden University',
    curr: 'EUR', url: 'https://www.miun.se', feePG: 10000, feeUG: 8000,
    living: { eur: 10000, usd: 10800, inr: 880000 },
    country: 'Sweden', state: 'Jämtland', city: 'Östersund', cc: 'SE',
    campus: 'Östersund Campus', ielts: 6.0, toefl: 87, pte: 60, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social'] },
  { file: 'data/slu-sweden-courses.ts', prefix: 'slu-sweden', name: 'Swedish University of Agricultural Sciences',
    curr: 'EUR', url: 'https://www.slu.se', feePG: 13000, feeUG: 10000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Uppsala', city: 'Uppsala', cc: 'SE',
    campus: 'Uppsala Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['science', 'engineering', 'business'] },
  { file: 'data/university-of-gothenburg-courses.ts', prefix: 'gu-se', name: 'University of Gothenburg',
    curr: 'EUR', url: 'https://www.gu.se', feePG: 13000, feeUG: 10000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Västra Götaland', city: 'Gothenburg', cc: 'SE',
    campus: 'Gothenburg Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['social', 'cs', 'science', 'business', 'health'] },
  { file: 'data/stockholm-school-of-economics-courses.ts', prefix: 'sse-swe', name: 'Stockholm School of Economics',
    curr: 'EUR', url: 'https://www.hhs.se', feePG: 22000, feeUG: 16000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Stockholm', city: 'Stockholm', cc: 'SE',
    campus: 'Stockholm Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['business', 'cs', 'social'] },
  { file: 'data/stockholm-university-courses.ts', prefix: 'su', name: 'Stockholm University',
    curr: 'EUR', url: 'https://www.su.se', feePG: 13000, feeUG: 10000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Stockholm', city: 'Stockholm', cc: 'SE',
    campus: 'Stockholm Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['cs', 'social', 'science', 'business', 'health'] },
  { file: 'data/kth-courses.ts', prefix: 'kth', name: 'KTH Royal Institute of Technology',
    curr: 'EUR', url: 'https://www.kth.se', feePG: 16000, feeUG: 12000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Stockholm', city: 'Stockholm', cc: 'SE',
    campus: 'Stockholm Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/kth-royal-institute-of-technology-courses.ts', prefix: 'kthri', name: 'KTH Royal Institute',
    curr: 'EUR', url: 'https://www.kth.se', feePG: 16000, feeUG: 12000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Sweden', state: 'Stockholm', city: 'Stockholm', cc: 'SE',
    campus: 'Stockholm Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science'] },
  { file: 'data/lund-courses.ts', prefix: 'lunduni', name: 'Lund University',
    curr: 'EUR', url: 'https://www.lu.se', feePG: 16000, feeUG: 12000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Sweden', state: 'Skåne', city: 'Lund', cc: 'SE',
    campus: 'Lund Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'social', 'science', 'business', 'health'] },
  { file: 'data/lund-university-courses.ts', prefix: 'lund', name: 'Lund University',
    curr: 'EUR', url: 'https://www.lu.se', feePG: 16000, feeUG: 12000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Sweden', state: 'Skåne', city: 'Lund', cc: 'SE',
    campus: 'Lund Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'social', 'science', 'business', 'health'] },
  { file: 'data/umea-university-courses.ts', prefix: 'umea', name: 'Umeå University',
    curr: 'EUR', url: 'https://www.umu.se', feePG: 12000, feeUG: 10000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Sweden', state: 'Västerbotten', city: 'Umeå', cc: 'SE',
    campus: 'Umeå Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    categories: ['social', 'science', 'cs', 'business', 'health'] },

  // ITALY
  { file: 'data/bocconi-university-courses.ts', prefix: 'bocconiu', name: 'Bocconi University',
    curr: 'EUR', url: 'https://www.unibocconi.eu', feePG: 14800, feeUG: 12000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Italy', state: 'Lombardy', city: 'Milan', cc: 'IT',
    campus: 'Milan Campus', ielts: 7.0, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['business', 'cs', 'social'] },
  { file: 'data/politecnico-di-milano-courses.ts', prefix: 'polimi', name: 'Politecnico di Milano',
    curr: 'EUR', url: 'https://www.polimi.it', feePG: 13000, feeUG: 10000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Italy', state: 'Lombardy', city: 'Milan', cc: 'IT',
    campus: 'Milan Campus', ielts: 6.5, toefl: 88, pte: 62, intakes: ['September'],
    categories: ['engineering', 'cs', 'science', 'arts'] },
  { file: 'data/university-of-florence-courses.ts', prefix: 'unifi', name: 'University of Florence',
    curr: 'EUR', url: 'https://www.unifi.it', feePG: 3200, feeUG: 2200,
    living: { eur: 11500, usd: 12420, inr: 1012000 },
    country: 'Italy', state: 'Tuscany', city: 'Florence', cc: 'IT',
    campus: 'Florence Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['arts', 'social', 'cs', 'engineering', 'business'] },
  { file: 'data/university-of-padua-courses.ts', prefix: 'unipd', name: 'University of Padua',
    curr: 'EUR', url: 'https://www.unipd.it', feePG: 3500, feeUG: 2200,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Italy', state: 'Veneto', city: 'Padua', cc: 'IT',
    campus: 'Padua Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['engineering', 'science', 'health', 'cs', 'social'] },
  { file: 'data/university-of-turin-courses.ts', prefix: 'unito', name: 'University of Turin',
    curr: 'EUR', url: 'https://www.unito.it', feePG: 3200, feeUG: 2000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Italy', state: 'Piedmont', city: 'Turin', cc: 'IT',
    campus: 'Turin Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['cs', 'social', 'science', 'business', 'health'] },
  { file: 'data/university-of-trento-courses.ts', prefix: 'unitn', name: 'University of Trento',
    curr: 'EUR', url: 'https://www.unitn.it', feePG: 3200, feeUG: 2000,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Italy', state: 'Trentino', city: 'Trento', cc: 'IT',
    campus: 'Trento Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['cs', 'engineering', 'social', 'science'] },
  { file: 'data/university-of-naples-courses.ts', prefix: 'unina', name: 'University of Naples',
    curr: 'EUR', url: 'https://www.unina.it', feePG: 2500, feeUG: 1800,
    living: { eur: 10000, usd: 10800, inr: 880000 },
    country: 'Italy', state: 'Campania', city: 'Naples', cc: 'IT',
    campus: 'Naples Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['October'],
    categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/university-of-pisa-courses.ts', prefix: 'unipi', name: 'University of Pisa',
    curr: 'EUR', url: 'https://www.unipi.it', feePG: 2800, feeUG: 1800,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Italy', state: 'Tuscany', city: 'Pisa', cc: 'IT',
    campus: 'Pisa Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['October'],
    categories: ['cs', 'engineering', 'science', 'social'] },
  { file: 'data/ca-foscari-university-venice-courses.ts', prefix: 'cafoscari', name: 'Ca Foscari University Venice',
    curr: 'EUR', url: 'https://www.unive.it', feePG: 3200, feeUG: 2200,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Italy', state: 'Veneto', city: 'Venice', cc: 'IT',
    campus: 'Venice Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['business', 'social', 'cs', 'arts'] },
  { file: 'data/luiss-university-courses.ts', prefix: 'luiss', name: 'LUISS University',
    curr: 'EUR', url: 'https://www.luiss.edu', feePG: 17000, feeUG: 14000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Italy', state: 'Lazio', city: 'Rome', cc: 'IT',
    campus: 'Rome Campus', ielts: 6.5, toefl: 85, pte: 62, intakes: ['September'],
    categories: ['business', 'social', 'cs', 'arts'] },
  { file: 'data/universita-cattolica-courses.ts', prefix: 'unicatt', name: 'Università Cattolica',
    curr: 'EUR', url: 'https://www.unicatt.it', feePG: 9000, feeUG: 7000,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Italy', state: 'Lombardy', city: 'Milan', cc: 'IT',
    campus: 'Milan Campus', ielts: 6.5, toefl: 85, pte: 62, intakes: ['September'],
    categories: ['business', 'social', 'health', 'science'] },
  { file: 'data/politecnico-di-torino-courses.ts', prefix: 'politorinoits', name: 'Politecnico di Torino',
    curr: 'EUR', url: 'https://www.polito.it', feePG: 5000, feeUG: 3500,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Italy', state: 'Piedmont', city: 'Turin', cc: 'IT',
    campus: 'Turin Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['engineering', 'cs', 'science', 'arts'] },
  { file: 'data/university-of-milan-courses.ts', prefix: 'unimi', name: 'University of Milan',
    curr: 'EUR', url: 'https://www.unimi.it', feePG: 3500, feeUG: 2300,
    living: { eur: 13000, usd: 14040, inr: 1144000 },
    country: 'Italy', state: 'Lombardy', city: 'Milan', cc: 'IT',
    campus: 'Milan Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['cs', 'science', 'social', 'health', 'business'] },
  { file: 'data/sapienza-university-rome-courses.ts', prefix: 'sapienza', name: 'Sapienza University of Rome',
    curr: 'EUR', url: 'https://www.uniroma1.it', feePG: 3500, feeUG: 2000,
    living: { eur: 12500, usd: 13500, inr: 1100000 },
    country: 'Italy', state: 'Lazio', city: 'Rome', cc: 'IT',
    campus: 'Rome Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['cs', 'engineering', 'social', 'science', 'health'] },
  { file: 'data/university-of-bologna-courses.ts', prefix: 'unibo', name: 'University of Bologna',
    curr: 'EUR', url: 'https://www.unibo.it', feePG: 3800, feeUG: 2500,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Italy', state: 'Emilia-Romagna', city: 'Bologna', cc: 'IT',
    campus: 'Bologna Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['October'],
    categories: ['cs', 'business', 'engineering', 'social', 'science'] },

  // SPAIN
  { file: 'data/ie-university-courses.ts', prefix: 'ie', name: 'IE University',
    curr: 'EUR', url: 'https://www.ie.edu', feePG: 29000, feeUG: 25000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Spain', state: 'Madrid', city: 'Madrid', cc: 'ES',
    campus: 'Madrid Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September', 'January'],
    categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/esade-business-school-courses.ts', prefix: 'esade', name: 'ESADE Business School',
    curr: 'EUR', url: 'https://www.esade.edu', feePG: 28000, feeUG: 22000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', cc: 'ES',
    campus: 'Barcelona Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September', 'January'],
    categories: ['business', 'cs', 'social'] },
  { file: 'data/iese-business-school-courses.ts', prefix: 'iese', name: 'IESE Business School',
    curr: 'EUR', url: 'https://www.iese.edu', feePG: 49000, feeUG: 20000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', cc: 'ES',
    campus: 'Barcelona Campus', ielts: 7.0, toefl: 100, pte: 68, intakes: ['September', 'January'],
    categories: ['business', 'social'] },
  { file: 'data/autonomous-university-of-madrid-courses.ts', prefix: 'uam', name: 'Autonomous University of Madrid',
    curr: 'EUR', url: 'https://www.uam.es', feePG: 4200, feeUG: 2200,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Spain', state: 'Madrid', city: 'Madrid', cc: 'ES',
    campus: 'Madrid Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'social', 'business'] },
  { file: 'data/autonomous-university-of-barcelona-courses.ts', prefix: 'uab', name: 'Autonomous University of Barcelona',
    curr: 'EUR', url: 'https://www.uab.cat', feePG: 4200, feeUG: 2200,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', cc: 'ES',
    campus: 'Bellaterra Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'social', 'business'] },
  { file: 'data/pompeu-fabra-university-courses.ts', prefix: 'upf', name: 'Pompeu Fabra University',
    curr: 'EUR', url: 'https://www.upf.edu', feePG: 5500, feeUG: 3000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', cc: 'ES',
    campus: 'Barcelona Campus', ielts: 6.5, toefl: 87, pte: 62, intakes: ['September'],
    categories: ['cs', 'social', 'business', 'arts'] },
  { file: 'data/carlos-iii-university-madrid-courses.ts', prefix: 'uc3m', name: 'Carlos III University Madrid',
    curr: 'EUR', url: 'https://www.uc3m.es', feePG: 5500, feeUG: 3000,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Spain', state: 'Madrid', city: 'Madrid', cc: 'ES',
    campus: 'Leganés Campus', ielts: 6.5, toefl: 87, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social'] },
  { file: 'data/university-of-valencia-courses.ts', prefix: 'uv', name: 'University of Valencia',
    curr: 'EUR', url: 'https://www.uv.es', feePG: 3500, feeUG: 2000,
    living: { eur: 11000, usd: 11880, inr: 968000 },
    country: 'Spain', state: 'Valencia', city: 'Valencia', cc: 'ES',
    campus: 'Valencia Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'business', 'social'] },
  { file: 'data/university-of-seville-courses.ts', prefix: 'us', name: 'University of Seville',
    curr: 'EUR', url: 'https://www.us.es', feePG: 3200, feeUG: 1800,
    living: { eur: 10500, usd: 11340, inr: 924000 },
    country: 'Spain', state: 'Andalusia', city: 'Seville', cc: 'ES',
    campus: 'Seville Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['September'],
    categories: ['engineering', 'cs', 'science', 'social'] },
  { file: 'data/university-of-granada-courses.ts', prefix: 'ugr', name: 'University of Granada',
    curr: 'EUR', url: 'https://www.ugr.es', feePG: 3000, feeUG: 1800,
    living: { eur: 9000, usd: 9720, inr: 792000 },
    country: 'Spain', state: 'Andalusia', city: 'Granada', cc: 'ES',
    campus: 'Granada Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['September'],
    categories: ['cs', 'social', 'science', 'business'] },
  { file: 'data/university-of-salamanca-courses.ts', prefix: 'usal', name: 'University of Salamanca',
    curr: 'EUR', url: 'https://www.usal.es', feePG: 3000, feeUG: 1800,
    living: { eur: 8500, usd: 9180, inr: 748000 },
    country: 'Spain', state: 'Castile-Leon', city: 'Salamanca', cc: 'ES',
    campus: 'Salamanca Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['September'],
    categories: ['social', 'cs', 'science', 'arts'] },
  { file: 'data/university-of-navarra-courses.ts', prefix: 'unav', name: 'University of Navarra',
    curr: 'EUR', url: 'https://www.unav.edu', feePG: 12000, feeUG: 10000,
    living: { eur: 10000, usd: 10800, inr: 880000 },
    country: 'Spain', state: 'Navarre', city: 'Pamplona', cc: 'ES',
    campus: 'Pamplona Campus', ielts: 6.5, toefl: 87, pte: 62, intakes: ['September'],
    categories: ['business', 'health', 'social', 'cs'] },
  { file: 'data/eae-business-school-courses.ts', prefix: 'eae-spain', name: 'EAE Business School',
    curr: 'EUR', url: 'https://www.eae.es', feePG: 14000, feeUG: 12000,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Madrid', city: 'Madrid', cc: 'ES',
    campus: 'Madrid Campus', ielts: 6.5, toefl: 88, pte: 62, intakes: ['September', 'January'],
    categories: ['business', 'cs', 'arts'] },
  { file: 'data/complutense-university-madrid-courses.ts', prefix: 'ucm', name: 'Complutense University Madrid',
    curr: 'EUR', url: 'https://www.ucm.es', feePG: 4500, feeUG: 2500,
    living: { eur: 12000, usd: 12960, inr: 1056000 },
    country: 'Spain', state: 'Madrid', city: 'Madrid', cc: 'ES',
    campus: 'Madrid Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['cs', 'science', 'social', 'business', 'health'] },
  { file: 'data/university-of-barcelona-courses.ts', prefix: 'ub', name: 'University of Barcelona',
    curr: 'EUR', url: 'https://www.ub.edu', feePG: 4500, feeUG: 2500,
    living: { eur: 14000, usd: 15120, inr: 1232000 },
    country: 'Spain', state: 'Catalonia', city: 'Barcelona', cc: 'ES',
    campus: 'Barcelona Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September'],
    categories: ['social', 'science', 'cs', 'business', 'arts'] },

  // SINGAPORE
  { file: 'data/curtinsg-courses.ts', prefix: 'curtinsg', name: 'Curtin University Singapore',
    curr: 'SGD', url: 'https://www.curtin.edu.sg', feePG: 28000, feeUG: 24000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['January', 'July'],
    inrRate: 62, categories: ['cs', 'business', 'engineering', 'science'] },
  { file: 'data/jcusg-courses.ts', prefix: 'jcusg', name: 'James Cook University Singapore',
    curr: 'SGD', url: 'https://www.jcu.edu.sg', feePG: 30000, feeUG: 26000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['March', 'July'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'health', 'science'] },
  { file: 'data/rmitsg-courses.ts', prefix: 'rmitsg', name: 'RMIT University Singapore',
    curr: 'SGD', url: 'https://www.rmit.edu.sg', feePG: 28000, feeUG: 23000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['March', 'August'],
    inrRate: 62, categories: ['cs', 'engineering', 'business', 'arts'] },
  { file: 'data/simsg-courses.ts', prefix: 'sim', name: 'Singapore Institute of Management',
    curr: 'SGD', url: 'https://www.sim.edu.sg', feePG: 20000, feeUG: 16000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'SIM HQ Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['January', 'May', 'September'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/mdis-courses.ts', prefix: 'mdis', name: 'MDIS Singapore',
    curr: 'SGD', url: 'https://www.mdis.edu.sg', feePG: 18000, feeUG: 14000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Stirling Road Campus', ielts: 6.0, toefl: 79, pte: 56, intakes: ['January', 'April', 'July', 'October'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/kaplansg-courses.ts', prefix: 'kaplansg', name: 'Kaplan Singapore',
    curr: 'SGD', url: 'https://www.kaplan.com.sg', feePG: 18000, feeUG: 14000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Wilkie Edge Campus', ielts: 6.0, toefl: 79, pte: 56, intakes: ['January', 'April', 'July', 'October'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/psbsg-courses.ts', prefix: 'psbsg', name: 'PSB Academy Singapore',
    curr: 'SGD', url: 'https://www.psbacademy.com.sg', feePG: 16000, feeUG: 12000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'PSB Academy Building', ielts: 5.5, toefl: 72, pte: 50, intakes: ['January', 'April', 'July', 'October'],
    inrRate: 62, categories: ['business', 'cs', 'arts'] },
  { file: 'data/sit-courses.ts', prefix: 'sit', name: 'Singapore Institute of Technology',
    curr: 'SGD', url: 'https://www.singaporetech.edu.sg', feePG: 22000, feeUG: 18000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Dover Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['August'],
    inrRate: 62, categories: ['engineering', 'cs', 'health', 'business'] },
  { file: 'data/sutd-courses.ts', prefix: 'sutd', name: 'SUTD Singapore',
    curr: 'SGD', url: 'https://www.sutd.edu.sg', feePG: 25000, feeUG: 20000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Changi Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    inrRate: 62, categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/murdochsg-courses.ts', prefix: 'murdochsg', name: 'Murdoch University Singapore',
    curr: 'SGD', url: 'https://singapore.murdoch.edu.au', feePG: 24000, feeUG: 20000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['February', 'July'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'science'] },
  { file: 'data/kaplan-courses.ts', prefix: 'kaplan', name: 'Kaplan Singapore',
    curr: 'SGD', url: 'https://www.kaplan.com.sg', feePG: 18000, feeUG: 14000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 79, pte: 56, intakes: ['January', 'April', 'July', 'October'],
    inrRate: 62, categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/swinburne-courses.ts', prefix: 'swinsg', name: 'Swinburne University Singapore',
    curr: 'SGD', url: 'https://www.swinburne.edu.sg', feePG: 25000, feeUG: 20000,
    living: { sgd: 18000, usd: 13320, inr: 1116000 },
    country: 'Singapore', state: 'Singapore', city: 'Singapore', cc: 'SG',
    campus: 'Singapore Campus', ielts: 6.0, toefl: 80, pte: 58, intakes: ['January', 'July'],
    inrRate: 62, categories: ['cs', 'engineering', 'business', 'arts'] },

  // UAE / DUBAI
  { file: 'data/american-university-dubai-courses.ts', prefix: 'aud', name: 'American University Dubai',
    curr: 'AED', url: 'https://www.aud.edu', feePG: 99000, feeUG: 81000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Media City', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['business', 'cs', 'engineering', 'arts'] },
  { file: 'data/heriot-watt-university-dubai-courses.ts', prefix: 'hwdubai', name: 'Heriot-Watt Dubai',
    curr: 'AED', url: 'https://www.hw.ac.uk/dubai', feePG: 103000, feeUG: 88000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai International Academic City', ielts: 6.0, toefl: 80, pte: 58, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['cs', 'business', 'engineering', 'science'] },
  { file: 'data/middlesex-university-dubai-courses.ts', prefix: 'mdu', name: 'Middlesex University Dubai',
    curr: 'AED', url: 'https://www.mdx.ac.ae', feePG: 95000, feeUG: 81000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Knowledge Village', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['cs', 'business', 'engineering', 'social', 'arts'] },
  { file: 'data/rit-dubai-courses.ts', prefix: 'ritdubai', name: 'RIT Dubai',
    curr: 'AED', url: 'https://www.rit.edu/dubai', feePG: 117000, feeUG: 103000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Silicon Oasis', ielts: 6.5, toefl: 85, pte: 62, intakes: ['August', 'January'],
    inrRate: 22.7, categories: ['cs', 'engineering', 'business'] },
  { file: 'data/murdoch-university-dubai-courses.ts', prefix: 'mdup', name: 'Murdoch University Dubai',
    curr: 'AED', url: 'https://murdochdubai.ac.ae', feePG: 92000, feeUG: 73000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Knowledge Village', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['business', 'cs', 'social', 'science'] },
  { file: 'data/canadian-university-dubai-courses.ts', prefix: 'cuD', name: 'Canadian University Dubai',
    curr: 'AED', url: 'https://www.cud.ac.ae', feePG: 88000, feeUG: 73000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Campus', ielts: 5.5, toefl: 72, pte: 50, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'business', 'arts'] },
  { file: 'data/manipal-dubai-courses.ts', prefix: 'manipaldubai', name: 'Manipal University Dubai',
    curr: 'AED', url: 'https://www.manipaldubai.com', feePG: 84000, feeUG: 66000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Academic City', ielts: 5.5, toefl: 72, pte: 50, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'business', 'health'] },
  { file: 'data/webster-courses.ts', prefix: 'webster', name: 'Webster University Dubai',
    curr: 'AED', url: 'https://www.webster.ac.ae', feePG: 81000, feeUG: 66000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Campus', ielts: 5.5, toefl: 72, pte: 50, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['business', 'cs', 'social', 'arts'] },
  { file: 'data/uowd-dubai-courses.ts', prefix: 'uowd', name: 'University of Wollongong Dubai',
    curr: 'AED', url: 'https://www.uowdubai.ac.ae', feePG: 92000, feeUG: 73000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Knowledge Village', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['business', 'cs', 'engineering', 'social'] },
  { file: 'data/sp-jain-dubai-courses.ts', prefix: 'spjaindubai', name: 'SP Jain Dubai',
    curr: 'AED', url: 'https://www.spjain.ae', feePG: 117000, feeUG: 95000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai Campus', ielts: 6.5, toefl: 88, pte: 62, intakes: ['September', 'March'],
    inrRate: 22.7, categories: ['business', 'cs'] },
  { file: 'data/bits-pilani-dubai-courses.ts', prefix: 'bitspilani', name: 'BITS Pilani Dubai',
    curr: 'AED', url: 'https://www.bits-pilani.ac.in/dubai', feePG: 81000, feeUG: 66000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai International Academic City', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'science'] },
  { file: 'data/amity-university-dubai-courses.ts', prefix: 'amitydubai', name: 'Amity University Dubai',
    curr: 'AED', url: 'https://www.amityuniversitydubai.ae', feePG: 70000, feeUG: 55000,
    living: { aed: 59000, usd: 16200, inr: 1352700 },
    country: 'UAE', state: 'Dubai', city: 'Dubai', cc: 'AE',
    campus: 'Dubai International Academic City', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['business', 'cs', 'engineering', 'social'] },
  { file: 'data/university-of-sharjah-courses.ts', prefix: 'sharjah', name: 'University of Sharjah',
    curr: 'AED', url: 'https://www.sharjah.ac.ae', feePG: 73000, feeUG: 59000,
    living: { aed: 51000, usd: 14000, inr: 1169000 },
    country: 'UAE', state: 'Sharjah', city: 'Sharjah', cc: 'AE',
    campus: 'Sharjah Main Campus', ielts: 5.5, toefl: 72, pte: 50, intakes: ['September'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'business', 'health', 'social'] },
  { file: 'data/american-university-of-sharjah-courses.ts', prefix: 'aus', name: 'American University of Sharjah',
    curr: 'AED', url: 'https://www.aus.edu', feePG: 95000, feeUG: 81000,
    living: { aed: 51000, usd: 14000, inr: 1169000 },
    country: 'UAE', state: 'Sharjah', city: 'Sharjah', cc: 'AE',
    campus: 'University City Campus', ielts: 6.0, toefl: 79, pte: 58, intakes: ['September', 'January'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'business', 'arts'] },
  { file: 'data/khalifa-courses.ts', prefix: 'khalifa', name: 'Khalifa University',
    curr: 'AED', url: 'https://www.ku.ac.ae', feePG: 80000, feeUG: 65000,
    living: { aed: 55000, usd: 15000, inr: 1254000 },
    country: 'UAE', state: 'Abu Dhabi', city: 'Abu Dhabi', cc: 'AE',
    campus: 'Abu Dhabi Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/khalifa-university-courses.ts', prefix: 'khalifau', name: 'Khalifa University',
    curr: 'AED', url: 'https://www.ku.ac.ae', feePG: 80000, feeUG: 65000,
    living: { aed: 55000, usd: 15000, inr: 1254000 },
    country: 'UAE', state: 'Abu Dhabi', city: 'Abu Dhabi', cc: 'AE',
    campus: 'Abu Dhabi Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    inrRate: 22.7, categories: ['engineering', 'cs', 'science', 'business'] },
  { file: 'data/uae-university-courses.ts', prefix: 'uaeu', name: 'UAE University',
    curr: 'AED', url: 'https://www.uaeu.ac.ae', feePG: 65000, feeUG: 50000,
    living: { aed: 50000, usd: 13600, inr: 1135000 },
    country: 'UAE', state: 'Abu Dhabi', city: 'Al Ain', cc: 'AE',
    campus: 'Al Ain Campus', ielts: 6.0, toefl: 79, pte: 56, intakes: ['September'],
    inrRate: 22.7, categories: ['engineering', 'business', 'cs', 'science', 'social'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DANISH UNIVERSITIES (DKK unquoted format)
// ═══════════════════════════════════════════════════════════════════════════════

const DKK_UNIS = [
  { file: 'data/aalborg-university-courses.ts', prefix: 'aalborgu', name: 'Aalborg University',
    curr: 'DKK', url: 'https://www.aau.dk', feePG: 95000, feeUG: 85000,
    living: { dkk: 90000, usd: 12870, inr: 1062000 },
    country: 'Denmark', state: 'North Denmark', city: 'Aalborg', cc: 'DK',
    campus: 'Aalborg Campus', ielts: 6.0, toefl: 90, pte: 65, intakes: ['September', 'February'],
    categories: ['cs', 'engineering', 'business', 'social', 'science'] },
  { file: 'data/aarhus-university-courses.ts', prefix: 'aarhusun', name: 'Aarhus University',
    curr: 'DKK', url: 'https://www.au.dk', feePG: 95000, feeUG: 85000,
    living: { dkk: 100000, usd: 14300, inr: 1180000 },
    country: 'Denmark', state: 'Central Denmark', city: 'Aarhus', cc: 'DK',
    campus: 'Aarhus Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['cs', 'business', 'science', 'social', 'engineering', 'health'] },
  { file: 'data/copenhagen-business-school-courses.ts', prefix: 'cbs', name: 'Copenhagen Business School',
    curr: 'DKK', url: 'https://www.cbs.dk', feePG: 125000, feeUG: 95000,
    living: { dkk: 110000, usd: 15730, inr: 1298000 },
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', cc: 'DK',
    campus: 'Frederiksberg Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September', 'February'],
    categories: ['business', 'social', 'cs', 'arts'] },
  { file: 'data/roskilde-university-courses.ts', prefix: 'ruc', name: 'Roskilde University',
    curr: 'DKK', url: 'https://www.ruc.dk', feePG: 85000, feeUG: 75000,
    living: { dkk: 90000, usd: 12870, inr: 1062000 },
    country: 'Denmark', state: 'Zealand', city: 'Roskilde', cc: 'DK',
    campus: 'Roskilde Campus', ielts: 6.0, toefl: 85, pte: 62, intakes: ['September'],
    categories: ['social', 'science', 'cs', 'business', 'arts'] },
  { file: 'data/university-of-copenhagen-courses.ts', prefix: 'ucph', name: 'University of Copenhagen',
    curr: 'DKK', url: 'https://www.ku.dk', feePG: 95000, feeUG: 85000,
    living: { dkk: 110000, usd: 15730, inr: 1298000 },
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', cc: 'DK',
    campus: 'Copenhagen Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['science', 'cs', 'social', 'health', 'business'] },
  { file: 'data/university-of-southern-denmark-courses.ts', prefix: 'sdu', name: 'University of Southern Denmark',
    curr: 'DKK', url: 'https://www.sdu.dk', feePG: 90000, feeUG: 80000,
    living: { dkk: 85000, usd: 12155, inr: 1003000 },
    country: 'Denmark', state: 'Southern Denmark', city: 'Odense', cc: 'DK',
    campus: 'Odense Campus', ielts: 6.0, toefl: 85, pte: 62, intakes: ['September'],
    categories: ['cs', 'engineering', 'business', 'social', 'science', 'health'] },
  { file: 'data/it-university-of-copenhagen-courses.ts', prefix: 'itu', name: 'IT University of Copenhagen',
    curr: 'DKK', url: 'https://www.itu.dk', feePG: 95000, feeUG: 85000,
    living: { dkk: 110000, usd: 15730, inr: 1298000 },
    country: 'Denmark', state: 'Capital Region', city: 'Copenhagen', cc: 'DK',
    campus: 'Copenhagen Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['cs', 'business', 'engineering', 'social'] },
  { file: 'data/technical-university-of-denmark-courses.ts', prefix: 'dtu-dk', name: 'Technical University of Denmark',
    curr: 'DKK', url: 'https://www.dtu.dk', feePG: 100000, feeUG: 90000,
    living: { dkk: 100000, usd: 14300, inr: 1180000 },
    country: 'Denmark', state: 'Capital Region', city: 'Lyngby', cc: 'DK',
    campus: 'Lyngby Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['engineering', 'cs', 'science'] },
  { file: 'data/dtu-courses.ts', prefix: 'dtu', name: 'DTU Denmark',
    curr: 'DKK', url: 'https://www.dtu.dk', feePG: 100000, feeUG: 90000,
    living: { dkk: 100000, usd: 14300, inr: 1180000 },
    country: 'Denmark', state: 'Capital Region', city: 'Lyngby', cc: 'DK',
    campus: 'Lyngby Campus', ielts: 6.5, toefl: 90, pte: 65, intakes: ['September'],
    categories: ['engineering', 'cs', 'science'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

let total = 0;

console.log('\n=== EUR/SGD/AED UNIVERSITIES ===');
for (const u of EUR_UNIS) {
  total += appendEurCourses(u);
}

console.log('\n=== DANISH UNIVERSITIES (DKK) ===');
for (const u of DKK_UNIS) {
  total += appendTsStyleCourses(u);
}

console.log(`\n✅ Total new courses added: ${total}`);
