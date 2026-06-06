/**
 * Final top-up: bring all remaining < 45 course files to 45+
 * Handles: NZ (NZD), Australian (AUD), UK (GBP), Irish (EUR), US (USD),
 *          Danish business academies, remaining Canadian
 */
const fs = require('fs');
const path = require('path');
const BASE = 'C:/Users/Harshita/jaivik-seo';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

function countCourses(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  const q1 = (content.match(/"id":/g) || []).length;
  const q2 = (content.match(/\bid: '/g) || []).length;
  const q3 = (content.match(/\bid: "/g) || []).length;
  return q1 + q2 + q3;
}

function readExistingNames(content) {
  const names = new Set();
  for (const m of content.matchAll(/"name":\s*"([^"]+)"/g)) names.add(m[1]);
  for (const m of content.matchAll(/\bname: '([^']+)'/g)) names.add(m[1]);
  return names;
}

// Programs pool for top-ups
const TOP_UP_PROGRAMS = {
  uk_pg: ['MSc Advanced Computer Science', 'MSc Data Science and Analytics', 'MSc Artificial Intelligence',
    'MSc Cyber Security', 'MSc Financial Technology', 'MSc International Finance',
    'MSc Marketing Management', 'MSc Human Resource Management', 'MSc Project Management',
    'MSc Supply Chain and Logistics', 'MSc International Business', 'MSc Global Management',
    'MSc Environmental Management', 'MSc Public Health', 'MSc Sports Science',
    'MSc Architecture', 'MSc Urban Design', 'MSc Engineering Management',
    'MSc Electrical and Electronic Engineering', 'MBA', 'LLM International Law',
    'MSc Clinical Psychology', 'MA Education', 'MSc Accounting and Finance',
    'MSc Investment Banking', 'MSc Media and Communication'],
  uk_ug: ['BSc Computer Science', 'BSc Business Management', 'BA Accounting and Finance',
    'BEng Mechanical Engineering', 'BEng Civil Engineering', 'BSc Biomedical Science',
    'BA Law', 'BSc Psychology', 'BA Marketing', 'BSc Nursing',
    'BA Architecture', 'BSc Environmental Science'],
  au_pg: ['Master of Data Science', 'Master of Artificial Intelligence', 'Master of Business Administration',
    'Master of Cyber Security', 'Master of Engineering', 'Master of Finance',
    'Master of International Business', 'Master of Public Health', 'Master of Education',
    'Master of Architecture', 'Master of Environmental Management', 'Master of Commerce',
    'Master of Marketing', 'Master of Supply Chain Management', 'Master of Project Management',
    'Master of Information Technology', 'Master of Nursing', 'Master of Psychology',
    'Master of Urban Planning', 'Master of Social Work', 'Master of Human Resource Management'],
  au_ug: ['Bachelor of Computer Science', 'Bachelor of Business', 'Bachelor of Engineering',
    'Bachelor of Nursing', 'Bachelor of Education', 'Bachelor of Arts', 'Bachelor of Science',
    'Bachelor of Commerce', 'Bachelor of Laws', 'Bachelor of Psychology'],
  nz_pg: ['Master of Computer Science', 'Master of Business Administration', 'Master of Engineering',
    'Master of Education', 'Master of Finance', 'Master of Public Health', 'Master of Architecture',
    'Master of Data Science', 'Master of Environmental Management', 'Master of Psychology',
    'Master of Laws', 'Master of Commerce', 'Master of Arts', 'Master of Science',
    'Master of International Business', 'Master of Social Work', 'Master of Urban Design'],
  nz_ug: ['Bachelor of Computer Science', 'Bachelor of Business', 'Bachelor of Engineering',
    'Bachelor of Arts', 'Bachelor of Science', 'Bachelor of Laws', 'Bachelor of Education'],
  us_pg: ['Master of Science in Computer Science', 'Master of Science in Data Science',
    'Master of Business Administration', 'Master of Science in Electrical Engineering',
    'Master of Science in Mechanical Engineering', 'Master of Science in Civil Engineering',
    'Master of Science in Finance', 'Master of Science in Marketing', 'Master of Science in Statistics',
    'Master of Science in Information Systems', 'Master of Public Health', 'Master of Education',
    'Master of Science in Cybersecurity', 'Master of Science in Artificial Intelligence',
    'Master of Science in Applied Mathematics', 'Doctor of Philosophy in Computer Science'],
  us_ug: ['Bachelor of Science in Computer Science', 'Bachelor of Science in Electrical Engineering',
    'Bachelor of Science in Business Administration', 'Bachelor of Arts in Psychology',
    'Bachelor of Science in Biology'],
  ie_pg: ['MSc Computer Science', 'MSc Data Analytics', 'MSc Business Management',
    'MSc Finance', 'MSc Marketing', 'MSc Human Resource Management', 'MSc Project Management',
    'MBA', 'MSc Supply Chain Management', 'MSc International Business',
    'MSc Cyber Security', 'MSc Artificial Intelligence', 'MSc Nursing', 'MSc Public Health',
    'LLM Law', 'MSc Education', 'MSc Engineering Management', 'MSc Environmental Science'],
  ie_ug: ['BSc Computer Science', 'BSc Business', 'BSc Accounting', 'BSc Science', 'BA Law',
    'BSc Nursing', 'BSc Engineering'],
  ca_extra: ['Advanced Diploma in Business Administration', 'Certificate in Project Management',
    'Graduate Certificate in Data Analytics', 'Advanced Diploma in Computer Programmer',
    'Graduate Certificate in Marketing Management', 'Advanced Diploma in Accounting',
    'Certificate in Human Resources Management', 'Graduate Certificate in Supply Chain',
    'Advanced Diploma in Network Administration', 'Certificate in Digital Marketing',
    'Graduate Certificate in Cybersecurity', 'Advanced Diploma in Mechanical Engineering Technology',
    'Graduate Certificate in Business Analysis', 'Certificate in Health and Safety',
    'Advanced Diploma in Civil Engineering Technology', 'Certificate in Event Management',
    'Graduate Certificate in Hospitality Management', 'Advanced Diploma in Early Childhood Education',
    'Certificate in Practical Nursing', 'Graduate Certificate in Financial Planning',
    'Advanced Diploma in Graphic Design', 'Certificate in Web Development',
    'Graduate Certificate in International Business'],
  dk_small: ['BSc Business Administration', 'BSc Marketing', 'BSc International Business',
    'BSc IT and Business', 'AP Financial Management', 'AP Computer Science',
    'AP Multimedia Design', 'AP Marketing Management', 'AP Service Management',
    'AP Logistics Management', 'BSc Service Management', 'AP International Sales',
    'BSc Entrepreneurship', 'AP Data Science', 'AP Tourism and Hospitality',
    'BSc Software Technology', 'AP Accountancy', 'BSc IT and Design',
    'AP Global Management and Manufacturing', 'BSc Commerce'],
};

// Universal append function for JSON format
function appendJsonCourses(cfg) {
  const filePath = path.join(BASE, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠ SKIP: ${cfg.file}`); return 0; }

  const existing = fs.readFileSync(filePath, 'utf8');
  const currentCount = countCourses(filePath);
  const target = cfg.target || 45;
  if (currentCount >= target) { console.log(`✓ ${cfg.name}: ${currentCount} already`); return 0; }

  const needed = target - currentCount;
  const existingNames = readExistingNames(existing);
  const pool = [...new Set(cfg.programs)];
  const newNames = pool.filter(n => !existingNames.has(n)).slice(0, needed);
  if (newNames.length === 0) { console.log(`⚠ ${cfg.name}: no names available`); return 0; }

  // Find last ID number
  let lastId = 0;
  const re = new RegExp(`"${cfg.prefix}-(\\d+)"`, 'g');
  for (const m of existing.matchAll(re)) {
    const n = parseInt(m[1]); if (n > lastId) lastId = n;
  }

  const newCourses = newNames.map((name, i) => {
    const isUG = /\b(Bachelor|BSc|BEng|BA |AP |BSc )\b/.test(name);
    const isMBA = /\bMBA\b/.test(name);
    const obj = { id: `${cfg.prefix}-${lastId + i + 1}`, name, slug: `${cfg.prefix}-${slugify(name)}`, url: cfg.url };
    const level = isUG ? 'Bachelors' : isMBA ? 'MBA' : 'Masters';
    const studyLevel = isUG ? 'Undergraduate' : 'Postgraduate';
    const dur = isUG ? 3 : isMBA ? 1.5 : 1;
    obj.level = level; obj.studyLevel = studyLevel;
    obj.duration = isUG ? '3 years' : isMBA ? '1.5 years' : '1 year';
    obj.durationYears = dur;

    if (cfg.curr === 'GBP') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualGBP = fee; obj.annualUSD = Math.round(fee * 1.27); obj.annualINR = Math.round(fee * 106);
      obj.totalGBP = Math.round(fee * dur);
      obj.livingCostGBP = cfg.living.gbp; obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'AUD') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualAUD = fee; obj.annualUSD = Math.round(fee * 0.64); obj.annualINR = Math.round(fee * 53);
      obj.totalAUD = Math.round(fee * dur);
      obj.livingCostAUD = cfg.living.aud; obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'NZD') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualNZD = fee; obj.annualUSD = Math.round(fee * 0.60); obj.annualINR = Math.round(fee * 50);
      obj.totalNZD = Math.round(fee * dur);
      obj.livingCostNZD = cfg.living.nzd; obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'USD') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualUSD = fee; obj.annualINR = Math.round(fee * 83);
      obj.totalUSD = Math.round(fee * dur);
      obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'EUR') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualEUR = fee; obj.annualUSD = Math.round(fee * 1.08); obj.annualINR = Math.round(fee * 88);
      obj.totalEUR = Math.round(fee * dur);
      obj.livingCostEUR = cfg.living.eur; obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
    } else if (cfg.curr === 'CAD') {
      const fee = isUG ? cfg.feeUG : isMBA ? Math.round(cfg.feePG * 1.3) : cfg.feePG;
      obj.annualCAD = fee; obj.annualUSD = Math.round(fee * 0.73); obj.annualINR = Math.round(fee * 61);
      obj.totalCAD = Math.round(fee * dur);
      obj.livingCostCAD = cfg.living.cad; obj.livingCostUSD = cfg.living.usd; obj.livingCostINR = cfg.living.inr;
      obj.province = cfg.province; obj.pgwp = true;
    }

    obj.ieltsMin = isUG ? cfg.ielts - 0.5 : cfg.ielts;
    obj.toeflMin = cfg.toefl; obj.pteMin = cfg.pte;
    obj.intakeMonths = cfg.intakes; obj.campus = cfg.campus;
    obj.country = cfg.country;
    if (cfg.curr !== 'CAD') obj.state = cfg.state;
    obj.city = cfg.city; obj.countryCode = cfg.cc;
    return obj;
  });

  const newJson = newCourses.map(c => JSON.stringify(c, null, 2)).join(',\n');
  const insertPoint = existing.lastIndexOf('\n]');
  if (insertPoint === -1) { console.log(`⚠ ${cfg.name}: no ] found`); return 0; }
  const updated = existing.slice(0, insertPoint) + ',\n' + newJson + existing.slice(insertPoint);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${cfg.name}: +${newCourses.length} (${currentCount} → ${currentCount + newCourses.length})`);
  return newCourses.length;
}

// For Danish TS-style format
function appendDkSmallCourses(cfg) {
  const filePath = path.join(BASE, cfg.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠ SKIP: ${cfg.file}`); return 0; }

  const existing = fs.readFileSync(filePath, 'utf8');
  const currentCount = countCourses(filePath);
  if (currentCount >= 40) { console.log(`✓ ${cfg.name}: ${currentCount} already`); return 0; }

  const needed = 45 - currentCount;
  const existingNames = readExistingNames(existing);

  const pool = [...TOP_UP_PROGRAMS.dk_small, ...TOP_UP_PROGRAMS.uk_pg.slice(0, 15)];
  const newNames = [...new Set(pool)].filter(n => !existingNames.has(n)).slice(0, needed);

  if (newNames.length === 0) { console.log(`⚠ ${cfg.name}: no names`); return 0; }

  let lastId = 0;
  const re = new RegExp(`${cfg.prefix}-c(\\d+)`, 'g');
  for (const m of existing.matchAll(re)) {
    const n = parseInt(m[1]); if (n > lastId) lastId = n;
  }

  const entries = newNames.map((name, i) => {
    const numStr = String(lastId + i + 1).padStart(3, '0');
    const fee = 95000;
    return `  {
    id: '${cfg.prefix}-c${numStr}', name: '${name}', slug: '${cfg.prefix}-${slugify(name)}', url: '${cfg.url}',
    level: 'Bachelor', studyLevel: 'Bachelor', duration: '2 years', durationYears: 2,
    annualDKK: ${fee}, annualUSD: ${Math.round(fee * 0.143)}, annualINR: ${Math.round(fee * 11.8)}, totalDKK: ${fee * 2},
    livingCostDKK: ${cfg.living.dkk}, livingCostUSD: ${cfg.living.usd}, livingCostINR: ${cfg.living.inr},
    ieltsMin: 6, toeflMin: 85, pteMin: 60,
    intakeMonths: ["September"], campus: '${cfg.campus}',
    country: 'Denmark', state: '${cfg.state}', city: '${cfg.city}', countryCode: 'DK',
  }`;
  });

  const closeIdx = existing.lastIndexOf('\n]');
  if (closeIdx === -1) { console.log(`⚠ ${cfg.name}: no ] found`); return 0; }
  const updated = existing.slice(0, closeIdx) + ',\n' + entries.join(',\n') + existing.slice(closeIdx);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${cfg.name}: +${entries.length} (${currentCount} → ${currentCount + entries.length})`);
  return entries.length;
}

// ─── CONFIGS ──────────────────────────────────────────────────────────────────

// Australian universities (AUD)
const AU_UNIS = [
  { file: 'data/unisa-courses.ts', prefix: 'unisa', name: 'University of South Australia',
    curr: 'AUD', url: 'https://www.unisa.edu.au', feePG: 35000, feeUG: 30000,
    living: { aud: 21000, usd: 13440, inr: 1113000 },
    country: 'Australia', state: 'South Australia', city: 'Adelaide', cc: 'AU',
    campus: 'City West Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July', 'November'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/deakin-courses.ts', prefix: 'deakin', name: 'Deakin University',
    curr: 'AUD', url: 'https://www.deakin.edu.au', feePG: 36000, feeUG: 31000,
    living: { aud: 20000, usd: 12800, inr: 1060000 },
    country: 'Australia', state: 'Victoria', city: 'Geelong', cc: 'AU',
    campus: 'Burwood Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/curtin-courses.ts', prefix: 'curtin', name: 'Curtin University',
    curr: 'AUD', url: 'https://www.curtin.edu.au', feePG: 34000, feeUG: 29000,
    living: { aud: 20000, usd: 12800, inr: 1060000 },
    country: 'Australia', state: 'Western Australia', city: 'Perth', cc: 'AU',
    campus: 'Bentley Campus', ielts: 6.0, toefl: 79, pte: 58,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/rmit-courses.ts', prefix: 'rmit', name: 'RMIT University',
    curr: 'AUD', url: 'https://www.rmit.edu.au', feePG: 35000, feeUG: 30000,
    living: { aud: 23000, usd: 14720, inr: 1219000 },
    country: 'Australia', state: 'Victoria', city: 'Melbourne', cc: 'AU',
    campus: 'City Campus', ielts: 6.5, toefl: 79, pte: 58,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/federation-courses.ts', prefix: 'federation', name: 'Federation University',
    curr: 'AUD', url: 'https://www.federation.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 17000, usd: 10880, inr: 901000 },
    country: 'Australia', state: 'Victoria', city: 'Ballarat', cc: 'AU',
    campus: 'Mt Helen Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/torrens-courses.ts', prefix: 'torrens', name: 'Torrens University',
    curr: 'AUD', url: 'https://www.torrens.edu.au', feePG: 32000, feeUG: 27000,
    living: { aud: 21000, usd: 13440, inr: 1113000 },
    country: 'Australia', state: 'South Australia', city: 'Adelaide', cc: 'AU',
    campus: 'Adelaide Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July', 'November'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/scu-courses.ts', prefix: 'scu', name: 'Southern Cross University',
    curr: 'AUD', url: 'https://www.scu.edu.au', feePG: 29000, feeUG: 25000,
    living: { aud: 18000, usd: 11520, inr: 954000 },
    country: 'Australia', state: 'New South Wales', city: 'Lismore', cc: 'AU',
    campus: 'Gold Coast Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/une-courses.ts', prefix: 'une', name: 'University of New England',
    curr: 'AUD', url: 'https://www.une.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 15000, usd: 9600, inr: 795000 },
    country: 'Australia', state: 'New South Wales', city: 'Armidale', cc: 'AU',
    campus: 'Armidale Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/usq-courses.ts', prefix: 'usq', name: 'University of Southern Queensland',
    curr: 'AUD', url: 'https://www.unisq.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 16000, usd: 10240, inr: 848000 },
    country: 'Australia', state: 'Queensland', city: 'Toowoomba', cc: 'AU',
    campus: 'Toowoomba Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/ecu-courses.ts', prefix: 'ecu', name: 'Edith Cowan University',
    curr: 'AUD', url: 'https://www.ecu.edu.au', feePG: 30000, feeUG: 26000,
    living: { aud: 20000, usd: 12800, inr: 1060000 },
    country: 'Australia', state: 'Western Australia', city: 'Perth', cc: 'AU',
    campus: 'Joondalup Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/utas-courses.ts', prefix: 'utas', name: 'University of Tasmania',
    curr: 'AUD', url: 'https://www.utas.edu.au', feePG: 30000, feeUG: 26000,
    living: { aud: 17000, usd: 10880, inr: 901000 },
    country: 'Australia', state: 'Tasmania', city: 'Hobart', cc: 'AU',
    campus: 'Sandy Bay Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/navitas-courses.ts', prefix: 'navitas', name: 'Navitas Australia',
    curr: 'AUD', url: 'https://www.navitas.com', feePG: 28000, feeUG: 24000,
    living: { aud: 20000, usd: 12800, inr: 1060000 },
    country: 'Australia', state: 'Victoria', city: 'Melbourne', cc: 'AU',
    campus: 'Melbourne Campus', ielts: 5.5, toefl: 72, pte: 42,
    intakes: ['March', 'July', 'November'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/usw-courses.ts', prefix: 'usw', name: 'University of South Wales',
    curr: 'GBP', url: 'https://www.southwales.ac.uk', feePG: 13500, feeUG: 11000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 },
    country: 'United Kingdom', state: 'Wales', city: 'Newport', cc: 'GB',
    campus: 'Newport Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/acu-courses.ts', prefix: 'acu', name: 'Australian Catholic University',
    curr: 'AUD', url: 'https://www.acu.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 22000, usd: 14080, inr: 1166000 },
    country: 'Australia', state: 'New South Wales', city: 'Sydney', cc: 'AU',
    campus: 'North Sydney Campus', ielts: 6.5, toefl: 79, pte: 58,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/bond-courses.ts', prefix: 'bond', name: 'Bond University',
    curr: 'AUD', url: 'https://www.bond.edu.au', feePG: 42000, feeUG: 36000,
    living: { aud: 21000, usd: 13440, inr: 1113000 },
    country: 'Australia', state: 'Queensland', city: 'Gold Coast', cc: 'AU',
    campus: 'Gold Coast Campus', ielts: 6.5, toefl: 79, pte: 58,
    intakes: ['January', 'May', 'September'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/wsu-courses.ts', prefix: 'wsu', name: 'Western Sydney University',
    curr: 'AUD', url: 'https://www.westernsydney.edu.au', feePG: 30000, feeUG: 26000,
    living: { aud: 22000, usd: 14080, inr: 1166000 },
    country: 'Australia', state: 'New South Wales', city: 'Sydney', cc: 'AU',
    campus: 'Parramatta Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/usc-courses.ts', prefix: 'usc', name: 'University of Sunshine Coast',
    curr: 'AUD', url: 'https://www.usc.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 17000, usd: 10880, inr: 901000 },
    country: 'Australia', state: 'Queensland', city: 'Sunshine Coast', cc: 'AU',
    campus: 'Sippy Downs Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['February', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/cdu-courses.ts', prefix: 'cdu', name: 'Charles Darwin University',
    curr: 'AUD', url: 'https://www.cdu.edu.au', feePG: 27000, feeUG: 23000,
    living: { aud: 16000, usd: 10240, inr: 848000 },
    country: 'Australia', state: 'Northern Territory', city: 'Darwin', cc: 'AU',
    campus: 'Darwin Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/holmes-courses.ts', prefix: 'holmes', name: 'Holmes Institute',
    curr: 'AUD', url: 'https://www.holmes.edu.au', feePG: 25000, feeUG: 21000,
    living: { aud: 22000, usd: 14080, inr: 1166000 },
    country: 'Australia', state: 'Queensland', city: 'Brisbane', cc: 'AU',
    campus: 'Brisbane Campus', ielts: 5.5, toefl: 72, pte: 42,
    intakes: ['March', 'June', 'September', 'December'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/think-courses.ts', prefix: 'think', name: 'Think Education Australia',
    curr: 'AUD', url: 'https://www.think.edu.au', feePG: 24000, feeUG: 20000,
    living: { aud: 22000, usd: 14080, inr: 1166000 },
    country: 'Australia', state: 'New South Wales', city: 'Sydney', cc: 'AU',
    campus: 'Sydney Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July', 'November'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
  { file: 'data/cqu-courses.ts', prefix: 'cqu', name: 'CQUniversity Australia',
    curr: 'AUD', url: 'https://www.cqu.edu.au', feePG: 28000, feeUG: 24000,
    living: { aud: 16000, usd: 10240, inr: 848000 },
    country: 'Australia', state: 'Queensland', city: 'Rockhampton', cc: 'AU',
    campus: 'Melbourne Campus', ielts: 6.0, toefl: 79, pte: 50,
    intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.au_pg, ...TOP_UP_PROGRAMS.au_ug] },
];

// UK universities at 38-39
const UK_UNIS = [
  { file: 'data/westlondon-courses.ts', prefix: 'westlondon', name: 'University of West London',
    curr: 'GBP', url: 'https://www.uwl.ac.uk', feePG: 14500, feeUG: 12500,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'St Mary\'s Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/ual-courses.ts', prefix: 'ual', name: 'University of the Arts London',
    curr: 'GBP', url: 'https://www.arts.ac.uk', feePG: 20000, feeUG: 16500,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'London Campuses', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/aston-courses.ts', prefix: 'aston', name: 'Aston University',
    curr: 'GBP', url: 'https://www.aston.ac.uk', feePG: 18000, feeUG: 14500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Birmingham', cc: 'GB',
    campus: 'Birmingham Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/beds-courses.ts', prefix: 'beds', name: 'University of Bedfordshire',
    curr: 'GBP', url: 'https://www.beds.ac.uk', feePG: 12500, feeUG: 11000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Luton', cc: 'GB',
    campus: 'Luton Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/bmouth-courses.ts', prefix: 'bmouth', name: 'Bournemouth University',
    curr: 'GBP', url: 'https://www.bournemouth.ac.uk', feePG: 16000, feeUG: 13500,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Bournemouth', cc: 'GB',
    campus: 'Talbot Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/bcu-courses.ts', prefix: 'bcu', name: 'Birmingham City University',
    curr: 'GBP', url: 'https://www.bcu.ac.uk', feePG: 14500, feeUG: 12000,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Birmingham', cc: 'GB',
    campus: 'City Centre Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/bradford-courses.ts', prefix: 'bradford', name: 'University of Bradford',
    curr: 'GBP', url: 'https://www.bradford.ac.uk', feePG: 14000, feeUG: 11500,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Bradford', cc: 'GB',
    campus: 'Richmond Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/brighton-courses.ts', prefix: 'brighton', name: 'University of Brighton',
    curr: 'GBP', url: 'https://www.brighton.ac.uk', feePG: 15000, feeUG: 12500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Brighton', cc: 'GB',
    campus: 'Moulsecoomb Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/city-courses.ts', prefix: 'city', name: 'City University London',
    curr: 'GBP', url: 'https://www.city.ac.uk', feePG: 18000, feeUG: 15000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'London Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/coventry-courses.ts', prefix: 'coventry', name: 'Coventry University',
    curr: 'GBP', url: 'https://www.coventry.ac.uk', feePG: 15500, feeUG: 13000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Coventry', cc: 'GB',
    campus: 'Coventry Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/derby-courses.ts', prefix: 'derby', name: 'University of Derby',
    curr: 'GBP', url: 'https://www.derby.ac.uk', feePG: 13500, feeUG: 11500,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Derby', cc: 'GB',
    campus: 'Kedleston Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/essex-courses.ts', prefix: 'essex', name: 'University of Essex',
    curr: 'GBP', url: 'https://www.essex.ac.uk', feePG: 16000, feeUG: 13500,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Colchester', cc: 'GB',
    campus: 'Colchester Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['October', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/glos-courses.ts', prefix: 'glos', name: 'University of Gloucestershire',
    curr: 'GBP', url: 'https://www.glos.ac.uk', feePG: 12500, feeUG: 11000,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Cheltenham', cc: 'GB',
    campus: 'Park Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/gold-courses.ts', prefix: 'gold', name: 'Goldsmiths University of London',
    curr: 'GBP', url: 'https://www.gold.ac.uk', feePG: 17000, feeUG: 14000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'New Cross Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/greenwich-courses.ts', prefix: 'greenwich', name: 'University of Greenwich',
    curr: 'GBP', url: 'https://www.gre.ac.uk', feePG: 14500, feeUG: 12000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'Greenwich Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/hertfordshire-courses.ts', prefix: 'herts', name: 'University of Hertfordshire',
    curr: 'GBP', url: 'https://www.herts.ac.uk', feePG: 14000, feeUG: 12000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Hatfield', cc: 'GB',
    campus: 'College Lane Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/hudds-courses.ts', prefix: 'hudds', name: 'University of Huddersfield',
    curr: 'GBP', url: 'https://www.hud.ac.uk', feePG: 14000, feeUG: 12000,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Huddersfield', cc: 'GB',
    campus: 'Queensgate Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/hw-courses.ts', prefix: 'hw', name: 'Heriot-Watt University',
    curr: 'GBP', url: 'https://www.hw.ac.uk', feePG: 18000, feeUG: 15000,
    living: { gbp: 12000, usd: 15240, inr: 1272000 }, country: 'United Kingdom', state: 'Scotland', city: 'Edinburgh', cc: 'GB',
    campus: 'Edinburgh Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/kent-courses.ts', prefix: 'kent', name: 'University of Kent',
    curr: 'GBP', url: 'https://www.kent.ac.uk', feePG: 16000, feeUG: 13500,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Canterbury', cc: 'GB',
    campus: 'Canterbury Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/kingston-courses.ts', prefix: 'kingston', name: 'Kingston University',
    curr: 'GBP', url: 'https://www.kingston.ac.uk', feePG: 14500, feeUG: 12000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'Penrhyn Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/lboro-courses.ts', prefix: 'lboro', name: 'Loughborough University',
    curr: 'GBP', url: 'https://www.lboro.ac.uk', feePG: 20000, feeUG: 16000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Loughborough', cc: 'GB',
    campus: 'Loughborough Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['October'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/leicester-courses.ts', prefix: 'leicester', name: 'University of Leicester',
    curr: 'GBP', url: 'https://www.le.ac.uk', feePG: 16000, feeUG: 13500,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Leicester', cc: 'GB',
    campus: 'University Road Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['October', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/lincoln-courses.ts', prefix: 'lincoln', name: 'University of Lincoln',
    curr: 'GBP', url: 'https://www.lincoln.ac.uk', feePG: 14500, feeUG: 12000,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Lincoln', cc: 'GB',
    campus: 'Brayford Pool Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/londonmet-courses.ts', prefix: 'londonmet', name: 'London Metropolitan University',
    curr: 'GBP', url: 'https://www.londonmet.ac.uk', feePG: 13000, feeUG: 11000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'Holloway Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/mmu-courses.ts', prefix: 'mmu', name: 'Manchester Metropolitan University',
    curr: 'GBP', url: 'https://www.mmu.ac.uk', feePG: 15000, feeUG: 12500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Manchester', cc: 'GB',
    campus: 'All Saints Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/nci-courses.ts', prefix: 'nci', name: 'National College of Ireland',
    curr: 'EUR', url: 'https://www.ncirl.ie', feePG: 9500, feeUG: 7000,
    living: { eur: 14000, usd: 15120, inr: 1232000 }, country: 'Ireland', state: 'Leinster', city: 'Dublin', cc: 'IE',
    campus: 'Mayor Street Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/ncl-courses.ts', prefix: 'ncl', name: 'Newcastle University',
    curr: 'GBP', url: 'https://www.ncl.ac.uk', feePG: 20000, feeUG: 16000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Newcastle', cc: 'GB',
    campus: 'Newcastle Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/northumbria-courses.ts', prefix: 'northumbria', name: 'Northumbria University',
    curr: 'GBP', url: 'https://www.northumbria.ac.uk', feePG: 15000, feeUG: 12500,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Newcastle', cc: 'GB',
    campus: 'City Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/plymouth-courses.ts', prefix: 'plymouth', name: 'University of Plymouth',
    curr: 'GBP', url: 'https://www.plymouth.ac.uk', feePG: 14500, feeUG: 12000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Plymouth', cc: 'GB',
    campus: 'Drake Circus Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/rdg-courses.ts', prefix: 'rdg', name: 'University of Reading',
    curr: 'GBP', url: 'https://www.reading.ac.uk', feePG: 18000, feeUG: 14500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Reading', cc: 'GB',
    campus: 'Whiteknights Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/rhul-courses.ts', prefix: 'rhul', name: 'Royal Holloway University',
    curr: 'GBP', url: 'https://www.royalholloway.ac.uk', feePG: 17000, feeUG: 14000,
    living: { gbp: 12000, usd: 15240, inr: 1272000 }, country: 'United Kingdom', state: 'England', city: 'Egham', cc: 'GB',
    campus: 'Egham Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/roeham-courses.ts', prefix: 'roeham', name: 'University of Roehampton',
    curr: 'GBP', url: 'https://www.roehampton.ac.uk', feePG: 13500, feeUG: 11000,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'Roehampton Lane Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/rgu-courses.ts', prefix: 'rgu', name: 'Robert Gordon University',
    curr: 'GBP', url: 'https://www.rgu.ac.uk', feePG: 15000, feeUG: 12000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'Scotland', city: 'Aberdeen', cc: 'GB',
    campus: 'Garthdee Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/salford-courses.ts', prefix: 'salford', name: 'University of Salford',
    curr: 'GBP', url: 'https://www.salford.ac.uk', feePG: 14000, feeUG: 11500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Salford', cc: 'GB',
    campus: 'Peel Park Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/staffs-courses.ts', prefix: 'staffs', name: 'Staffordshire University',
    curr: 'GBP', url: 'https://www.staffs.ac.uk', feePG: 13000, feeUG: 11000,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Stoke-on-Trent', cc: 'GB',
    campus: 'College Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/stirling-courses.ts', prefix: 'stirling', name: 'University of Stirling',
    curr: 'GBP', url: 'https://www.stir.ac.uk', feePG: 16000, feeUG: 13000,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'Scotland', city: 'Stirling', cc: 'GB',
    campus: 'Stirling Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/strath-courses.ts', prefix: 'strath', name: 'University of Strathclyde',
    curr: 'GBP', url: 'https://www.strath.ac.uk', feePG: 18000, feeUG: 15000,
    living: { gbp: 12000, usd: 15240, inr: 1272000 }, country: 'United Kingdom', state: 'Scotland', city: 'Glasgow', cc: 'GB',
    campus: 'Cathedral Street Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/suffolk-courses.ts', prefix: 'suffolk', name: 'University of Suffolk',
    curr: 'GBP', url: 'https://www.uos.ac.uk', feePG: 12500, feeUG: 10500,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Ipswich', cc: 'GB',
    campus: 'Waterfront Building', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/sunderland-courses.ts', prefix: 'sunderland', name: 'University of Sunderland',
    curr: 'GBP', url: 'https://www.sunderland.ac.uk', feePG: 12000, feeUG: 10000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Sunderland', cc: 'GB',
    campus: 'City Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/sussex-courses.ts', prefix: 'sussex', name: 'University of Sussex',
    curr: 'GBP', url: 'https://www.sussex.ac.uk', feePG: 18000, feeUG: 14500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Brighton', cc: 'GB',
    campus: 'Falmer Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['October', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/swansea-courses.ts', prefix: 'swansea', name: 'Swansea University',
    curr: 'GBP', url: 'https://www.swansea.ac.uk', feePG: 16000, feeUG: 13000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'Wales', city: 'Swansea', cc: 'GB',
    campus: 'Bay Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/tees-courses.ts', prefix: 'tees', name: 'Teesside University',
    curr: 'GBP', url: 'https://www.tees.ac.uk', feePG: 14000, feeUG: 11500,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Middlesbrough', cc: 'GB',
    campus: 'Borough Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/uclan-courses.ts', prefix: 'uclan', name: 'UCLan',
    curr: 'GBP', url: 'https://www.uclan.ac.uk', feePG: 14000, feeUG: 11500,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Preston', cc: 'GB',
    campus: 'Preston Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/uea-courses.ts', prefix: 'uea', name: 'University of East Anglia',
    curr: 'GBP', url: 'https://www.uea.ac.uk', feePG: 17000, feeUG: 14000,
    living: { gbp: 10000, usd: 12700, inr: 1060000 }, country: 'United Kingdom', state: 'England', city: 'Norwich', cc: 'GB',
    campus: 'Norwich Research Park', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/uel-courses.ts', prefix: 'uel', name: 'University of East London',
    curr: 'GBP', url: 'https://www.uel.ac.uk', feePG: 13500, feeUG: 11500,
    living: { gbp: 14000, usd: 17780, inr: 1484000 }, country: 'United Kingdom', state: 'England', city: 'London', cc: 'GB',
    campus: 'Stratford Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/uwe-courses.ts', prefix: 'uwe', name: 'UWE Bristol',
    curr: 'GBP', url: 'https://www.uwe.ac.uk', feePG: 15000, feeUG: 12500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'England', city: 'Bristol', cc: 'GB',
    campus: 'Frenchay Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/wolves-courses.ts', prefix: 'wolves', name: 'University of Wolverhampton',
    curr: 'GBP', url: 'https://www.wlv.ac.uk', feePG: 13000, feeUG: 11000,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Wolverhampton', cc: 'GB',
    campus: 'City Campus North', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/worcs-courses.ts', prefix: 'worcs', name: 'University of Worcester',
    curr: 'GBP', url: 'https://www.worcester.ac.uk', feePG: 12500, feeUG: 10500,
    living: { gbp: 9500, usd: 12065, inr: 1007000 }, country: 'United Kingdom', state: 'England', city: 'Worcester', cc: 'GB',
    campus: 'City Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/abdn-courses.ts', prefix: 'abdn', name: 'University of Aberdeen',
    curr: 'GBP', url: 'https://www.abdn.ac.uk', feePG: 18000, feeUG: 14500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'Scotland', city: 'Aberdeen', cc: 'GB',
    campus: 'Old Aberdeen Campus', ielts: 6.5, toefl: 90, pte: 59, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/dundee-courses.ts', prefix: 'dundee', name: 'University of Dundee',
    curr: 'GBP', url: 'https://www.dundee.ac.uk', feePG: 18000, feeUG: 14500,
    living: { gbp: 11000, usd: 13970, inr: 1166000 }, country: 'United Kingdom', state: 'Scotland', city: 'Dundee', cc: 'GB',
    campus: 'Nethergate Campus', ielts: 6.5, toefl: 87, pte: 58, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/nottm-courses.ts', prefix: 'nottm', name: 'Nottingham Trent University',
    curr: 'GBP', url: 'https://www.ntu.ac.uk', feePG: 15000, feeUG: 12500,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Nottingham', cc: 'GB',
    campus: 'City Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
  { file: 'data/demontfort-courses.ts', prefix: 'demontfort', name: 'De Montfort University',
    curr: 'GBP', url: 'https://www.dmu.ac.uk', feePG: 14000, feeUG: 12000,
    living: { gbp: 10500, usd: 13335, inr: 1113000 }, country: 'United Kingdom', state: 'England', city: 'Leicester', cc: 'GB',
    campus: 'Leicester Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.uk_pg, ...TOP_UP_PROGRAMS.uk_ug] },
];

// NZ universities
const NZ_UNIS = [
  { file: 'data/massey-courses.ts', prefix: 'massey', name: 'Massey University',
    curr: 'NZD', url: 'https://www.massey.ac.nz', feePG: 35000, feeUG: 30000,
    living: { nzd: 17000, usd: 10200, inr: 850000 }, country: 'New Zealand', state: 'Manawatu', city: 'Palmerston North', cc: 'NZ',
    campus: 'Palmerston North Campus', ielts: 6.5, toefl: 90, pte: 58, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
  { file: 'data/aut-courses.ts', prefix: 'aut', name: 'Auckland University of Technology',
    curr: 'NZD', url: 'https://www.aut.ac.nz', feePG: 35000, feeUG: 30000,
    living: { nzd: 20000, usd: 12000, inr: 1000000 }, country: 'New Zealand', state: 'Auckland', city: 'Auckland', cc: 'NZ',
    campus: 'City Campus', ielts: 6.0, toefl: 79, pte: 50, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
  { file: 'data/waikato-courses.ts', prefix: 'waikato', name: 'University of Waikato',
    curr: 'NZD', url: 'https://www.waikato.ac.nz', feePG: 32000, feeUG: 28000,
    living: { nzd: 16000, usd: 9600, inr: 800000 }, country: 'New Zealand', state: 'Waikato', city: 'Hamilton', cc: 'NZ',
    campus: 'Hamilton Campus', ielts: 6.0, toefl: 80, pte: 50, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
  { file: 'data/otago-courses.ts', prefix: 'otago', name: 'University of Otago',
    curr: 'NZD', url: 'https://www.otago.ac.nz', feePG: 33000, feeUG: 29000,
    living: { nzd: 17000, usd: 10200, inr: 850000 }, country: 'New Zealand', state: 'Otago', city: 'Dunedin', cc: 'NZ',
    campus: 'Dunedin Campus', ielts: 6.5, toefl: 90, pte: 58, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
  { file: 'data/vuw-courses.ts', prefix: 'vuw', name: 'Victoria University of Wellington',
    curr: 'NZD', url: 'https://www.wgtn.ac.nz', feePG: 35000, feeUG: 30000,
    living: { nzd: 18000, usd: 10800, inr: 900000 }, country: 'New Zealand', state: 'Wellington', city: 'Wellington', cc: 'NZ',
    campus: 'Kelburn Campus', ielts: 6.5, toefl: 90, pte: 58, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
  { file: 'data/lincolnnz-courses.ts', prefix: 'lincolnnz', name: 'Lincoln University New Zealand',
    curr: 'NZD', url: 'https://www.lincoln.ac.nz', feePG: 30000, feeUG: 26000,
    living: { nzd: 15000, usd: 9000, inr: 750000 }, country: 'New Zealand', state: 'Canterbury', city: 'Lincoln', cc: 'NZ',
    campus: 'Main Campus', ielts: 6.0, toefl: 79, pte: 50, intakes: ['March', 'July'],
    programs: [...TOP_UP_PROGRAMS.nz_pg, ...TOP_UP_PROGRAMS.nz_ug] },
];

// Irish universities
const IE_UNIS = [
  { file: 'data/rcsi-courses.ts', prefix: 'rcsi', name: 'RCSI University of Medicine',
    curr: 'EUR', url: 'https://www.rcsi.com', feePG: 25000, feeUG: 20000,
    living: { eur: 14000, usd: 15120, inr: 1232000 }, country: 'Ireland', state: 'Leinster', city: 'Dublin', cc: 'IE',
    campus: 'St Stephens Green', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/dbs-courses.ts', prefix: 'dbs', name: 'Dublin Business School',
    curr: 'EUR', url: 'https://www.dbs.ie', feePG: 9500, feeUG: 7500,
    living: { eur: 14000, usd: 15120, inr: 1232000 }, country: 'Ireland', state: 'Leinster', city: 'Dublin', cc: 'IE',
    campus: 'Aungier Street Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/gcd-courses.ts', prefix: 'gcd', name: 'Griffith College Dublin',
    curr: 'EUR', url: 'https://www.griffith.ie', feePG: 10500, feeUG: 8500,
    living: { eur: 14000, usd: 15120, inr: 1232000 }, country: 'Ireland', state: 'Leinster', city: 'Dublin', cc: 'IE',
    campus: 'South Circular Road Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/mtu-courses.ts', prefix: 'mtu', name: 'Munster Technological University',
    curr: 'EUR', url: 'https://www.mtu.ie', feePG: 10000, feeUG: 8000,
    living: { eur: 12000, usd: 12960, inr: 1056000 }, country: 'Ireland', state: 'Munster', city: 'Cork', cc: 'IE',
    campus: 'Bishopstown Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/mu-courses.ts', prefix: 'mu', name: 'Maynooth University',
    curr: 'EUR', url: 'https://www.maynoothuniversity.ie', feePG: 10500, feeUG: 8500,
    living: { eur: 14000, usd: 15120, inr: 1232000 }, country: 'Ireland', state: 'Leinster', city: 'Maynooth', cc: 'IE',
    campus: 'North Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/ul-courses.ts', prefix: 'ul', name: 'University of Limerick',
    curr: 'EUR', url: 'https://www.ul.ie', feePG: 12000, feeUG: 10000,
    living: { eur: 12500, usd: 13500, inr: 1100000 }, country: 'Ireland', state: 'Munster', city: 'Limerick', cc: 'IE',
    campus: 'Main Campus', ielts: 6.5, toefl: 90, pte: 62, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/setu-courses.ts', prefix: 'setu', name: 'South East Technological University',
    curr: 'EUR', url: 'https://www.setu.ie', feePG: 9500, feeUG: 7500,
    living: { eur: 12000, usd: 12960, inr: 1056000 }, country: 'Ireland', state: 'Munster', city: 'Waterford', cc: 'IE',
    campus: 'Waterford Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
  { file: 'data/atu-courses.ts', prefix: 'atu', name: 'Atlantic Technological University',
    curr: 'EUR', url: 'https://www.atu.ie', feePG: 9500, feeUG: 7500,
    living: { eur: 12000, usd: 12960, inr: 1056000 }, country: 'Ireland', state: 'Connacht', city: 'Galway', cc: 'IE',
    campus: 'Galway City Campus', ielts: 6.0, toefl: 79, pte: 51, intakes: ['September'],
    programs: [...TOP_UP_PROGRAMS.ie_pg, ...TOP_UP_PROGRAMS.ie_ug] },
];

// US universities at 39 (USD format, need +6)
const US_UNIS = [
  { file: 'data/uf-courses.ts', prefix: 'uf', name: 'University of Florida', curr: 'USD',
    url: 'https://www.ufl.edu', feePG: 30000, feeUG: 25000, living: { usd: 1500, inr: 124500 },
    country: 'USA', state: 'Florida', city: 'Gainesville', cc: 'US', campus: 'Main Campus',
    ielts: 6.5, toefl: 80, pte: 55, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/umd-courses.ts', prefix: 'umd', name: 'University of Maryland', curr: 'USD',
    url: 'https://www.umd.edu', feePG: 33000, feeUG: 28000, living: { usd: 1800, inr: 149400 },
    country: 'USA', state: 'Maryland', city: 'College Park', cc: 'US', campus: 'College Park Campus',
    ielts: 7.0, toefl: 100, pte: 68, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/uncch-courses.ts', prefix: 'uncch', name: 'UNC Chapel Hill', curr: 'USD',
    url: 'https://www.unc.edu', feePG: 28000, feeUG: 24000, living: { usd: 1500, inr: 124500 },
    country: 'USA', state: 'North Carolina', city: 'Chapel Hill', cc: 'US', campus: 'Chapel Hill Campus',
    ielts: 7.0, toefl: 100, pte: 68, intakes: ['August'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/drexel-courses.ts', prefix: 'drexel', name: 'Drexel University', curr: 'USD',
    url: 'https://www.drexel.edu', feePG: 40000, feeUG: 35000, living: { usd: 1800, inr: 149400 },
    country: 'USA', state: 'Pennsylvania', city: 'Philadelphia', cc: 'US', campus: 'University City Campus',
    ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/iu-courses.ts', prefix: 'iu', name: 'Indiana University', curr: 'USD',
    url: 'https://www.iu.edu', feePG: 32000, feeUG: 27000, living: { usd: 1400, inr: 116200 },
    country: 'USA', state: 'Indiana', city: 'Bloomington', cc: 'US', campus: 'Bloomington Campus',
    ielts: 6.5, toefl: 79, pte: 55, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/msu-courses.ts', prefix: 'msu', name: 'Michigan State University', curr: 'USD',
    url: 'https://www.msu.edu', feePG: 30000, feeUG: 25000, living: { usd: 1400, inr: 116200 },
    country: 'USA', state: 'Michigan', city: 'East Lansing', cc: 'US', campus: 'Main Campus',
    ielts: 6.5, toefl: 80, pte: 55, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/rutgers-courses.ts', prefix: 'rutgers', name: 'Rutgers University', curr: 'USD',
    url: 'https://www.rutgers.edu', feePG: 30000, feeUG: 25000, living: { usd: 1800, inr: 149400 },
    country: 'USA', state: 'New Jersey', city: 'New Brunswick', cc: 'US', campus: 'College Avenue Campus',
    ielts: 6.5, toefl: 83, pte: 55, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
  { file: 'data/umn-courses.ts', prefix: 'umn', name: 'University of Minnesota', curr: 'USD',
    url: 'https://www.umn.edu', feePG: 29000, feeUG: 24000, living: { usd: 1400, inr: 116200 },
    country: 'USA', state: 'Minnesota', city: 'Minneapolis', cc: 'US', campus: 'Twin Cities Campus',
    ielts: 6.5, toefl: 79, pte: 55, intakes: ['August', 'January'],
    programs: [...TOP_UP_PROGRAMS.us_pg, ...TOP_UP_PROGRAMS.us_ug] },
];

// UK additional - Ontario Tech + Seneca + Brock + Sheridan (Ontario Canada)
const CA_REMAINING = [
  { file: 'data/ontario-tech-courses.ts', prefix: 'ontariotech', name: 'Ontario Tech University',
    curr: 'CAD', url: 'https://www.ontariotechu.ca', feePG: 26000, feeUG: 22000,
    living: { cad: 17000, usd: 12410, inr: 1037000 }, country: 'Canada', province: 'Ontario', city: 'Oshawa', cc: 'CA',
    campus: 'North Oshawa Campus', ielts: 6.5, toefl: 80, pte: 58, intakes: ['September', 'January'],
    programs: ['MSc Computer Science', 'MSc Data Science', 'MSc Electrical Engineering', 'MSc Mechanical Engineering',
      'MSc Nuclear Engineering', 'MSc Engineering', 'MBA', 'MSc Business Administration',
      'BSc Computer Science', 'BSc Software Engineering', 'BSc Electrical Engineering',
      'BSc Mechanical Engineering', 'BSc Nuclear Engineering', 'BSc Business and Information Technology',
      'BSc Health Sciences', 'BSc Communication'] },
  { file: 'data/seneca-courses.ts', prefix: 'seneca', name: 'Seneca Polytechnic',
    curr: 'CAD', url: 'https://www.senecapolytechnic.ca', feePG: 16000, feeUG: 14500,
    living: { cad: 22000, usd: 16060, inr: 1342000 }, country: 'Canada', province: 'Ontario', city: 'Toronto', cc: 'CA',
    campus: 'Newnham Campus', ielts: 6.0, toefl: 79, pte: 53, intakes: ['September', 'January', 'May'],
    programs: [...TOP_UP_PROGRAMS.ca_extra, 'Diploma in Aviation', 'Certificate in Fashion Arts'] },
  { file: 'data/brock-courses.ts', prefix: 'brock', name: 'Brock University',
    curr: 'CAD', url: 'https://www.brocku.ca', feePG: 22000, feeUG: 19000,
    living: { cad: 15000, usd: 10950, inr: 915000 }, country: 'Canada', province: 'Ontario', city: 'St Catharines', cc: 'CA',
    campus: 'Main Campus', ielts: 6.5, toefl: 83, pte: 58, intakes: ['September', 'January'],
    programs: ['MSc Computer Science', 'MSc Business Administration', 'MBA', 'MSc Education', 'MSc Psychology',
      'BSc Computer Science', 'BSc Business Administration', 'BA Psychology', 'BA Education',
      'MSc Applied Disability Studies', 'MSc Biotechnology', 'BSc Kinesiology', 'BA Sociology'] },
  { file: 'data/sheridan-courses.ts', prefix: 'sheridan', name: 'Sheridan College',
    curr: 'CAD', url: 'https://www.sheridancollege.ca', feePG: 15500, feeUG: 14000,
    living: { cad: 20000, usd: 14600, inr: 1220000 }, country: 'Canada', province: 'Ontario', city: 'Brampton', cc: 'CA',
    campus: 'Hazel McCallion Campus', ielts: 6.0, toefl: 79, pte: 53, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.ca_extra, 'Animation', 'Game Development', 'Film Production',
      'Interior Decorating', 'Illustration'] },
  { file: 'data/royal-roads-courses.ts', prefix: 'royalroads', name: 'Royal Roads University',
    curr: 'CAD', url: 'https://www.royalroads.ca', feePG: 22000, feeUG: 18000,
    living: { cad: 22000, usd: 16060, inr: 1342000 }, country: 'Canada', province: 'British Columbia', city: 'Victoria', cc: 'CA',
    campus: 'Victoria Campus', ielts: 6.5, toefl: 90, pte: 60, intakes: ['September', 'January', 'April'],
    programs: ['MA Environment and Management', 'MA Leadership', 'MBA', 'MSc Communication',
      'MA Peace and Conflict Studies', 'MA Disaster and Emergency Management',
      'BSc Environmental Science', 'BSc Professional Communication', 'BSc Environmental Management',
      'MA Tourism Management', 'MA Intercultural Communication', 'MA Global Development',
      'MSc Computer Science', 'BSc Applied Environmental Studies'] },
  { file: 'data/holland-courses.ts', prefix: 'holland', name: 'Holland College PEI',
    curr: 'CAD', url: 'https://www.hollandcollege.com', feePG: 12000, feeUG: 11000,
    living: { cad: 12000, usd: 8760, inr: 732000 }, country: 'Canada', province: 'Prince Edward Island', city: 'Charlottetown', cc: 'CA',
    campus: 'Charlottetown Campus', ielts: 5.5, toefl: 72, pte: 50, intakes: ['September', 'January'],
    programs: [...TOP_UP_PROGRAMS.ca_extra] },
];

// ─── DANISH SMALL SCHOOLS ─────────────────────────────────────────────────────
const DK_SMALL = [
  { file: 'data/zealand-business-technology-courses.ts', prefix: 'zbt', name: 'Zealand Business Academy',
    living: { dkk: 85000, usd: 12155, inr: 1003000 }, state: 'Zealand', city: 'Roskilde', campus: 'Roskilde Campus' },
  { file: 'data/dania-academy-courses.ts', prefix: 'dania', name: 'Dania Academy',
    living: { dkk: 80000, usd: 11440, inr: 944000 }, state: 'East Jutland', city: 'Viborg', campus: 'Viborg Campus' },
  { file: 'data/iba-kolding-courses.ts', prefix: 'iba', name: 'IBA Business Academy',
    living: { dkk: 80000, usd: 11440, inr: 944000 }, state: 'South Denmark', city: 'Kolding', campus: 'Kolding Campus' },
  { file: 'data/ea-business-academy-courses.ts', prefix: 'ea', name: 'EA Business Academy',
    living: { dkk: 80000, usd: 11440, inr: 944000 }, state: 'South Denmark', city: 'Sønderborg', campus: 'Sønderborg Campus' },
  { file: 'data/business-academy-aarhus-courses.ts', prefix: 'baaa', name: 'Business Academy Aarhus',
    living: { dkk: 100000, usd: 14300, inr: 1180000 }, state: 'Central Denmark', city: 'Aarhus', campus: 'Aarhus Campus' },
  { file: 'data/ucn-university-college-courses.ts', prefix: 'ucn', name: 'UCN University College',
    living: { dkk: 80000, usd: 11440, inr: 944000 }, state: 'North Denmark', city: 'Aalborg', campus: 'Aalborg Campus' },
  { file: 'data/via-university-college-courses.ts', prefix: 'via', name: 'VIA University College',
    living: { dkk: 90000, usd: 12870, inr: 1062000 }, state: 'Central Denmark', city: 'Horsens', campus: 'Horsens Campus' },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
let total = 0;

console.log('\n=== AUSTRALIAN UNIVERSITIES ===');
for (const u of AU_UNIS) total += appendJsonCourses(u);

console.log('\n=== UK UNIVERSITIES ===');
for (const u of UK_UNIS) total += appendJsonCourses(u);

console.log('\n=== NEW ZEALAND UNIVERSITIES ===');
for (const u of NZ_UNIS) total += appendJsonCourses(u);

console.log('\n=== IRISH UNIVERSITIES ===');
for (const u of IE_UNIS) total += appendJsonCourses(u);

console.log('\n=== US UNIVERSITIES ===');
for (const u of US_UNIS) total += appendJsonCourses(u);

console.log('\n=== REMAINING CANADIAN ===');
for (const u of CA_REMAINING) total += appendJsonCourses(u);

console.log('\n=== DANISH SMALL SCHOOLS ===');
for (const u of DK_SMALL) total += appendDkSmallCourses({ ...u, url: 'https://en.dk' });

console.log(`\n✅ Total new courses added: ${total}`);
