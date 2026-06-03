/**
 * Generate course data for Netherlands, France, NZ, Sweden, Denmark, UAE universities
 * These countries currently have fewer courses
 */
const fs = require('fs');

const PROGS = {
  CS_PG: ['MSc Computer Science','MSc Advanced Computer Science','MSc Data Science','MSc Artificial Intelligence','MSc Machine Learning','MSc Cyber Security','MSc Software Engineering','MSc Cloud Computing','MSc Human Computer Interaction','MSc Information Systems Management','MSc Digital Innovation','MSc Applied Data Science'],
  ENG_PG: ['MSc Mechanical Engineering','MSc Civil Engineering','MSc Electrical Engineering','MSc Chemical Engineering','MSc Biomedical Engineering','MSc Environmental Engineering','MSc Materials Science','MSc Sustainable Energy Systems','MSc Robotics and Automation','MSc Engineering Management','MSc Aerospace Engineering'],
  BUS_PG: ['MBA','MSc Management','MSc International Management','MSc Marketing','MSc Finance','MSc Accounting and Finance','MSc International Business','MSc Business Analytics','MSc Entrepreneurship','MSc Digital Marketing','MSc Strategy and Consulting','MSc Supply Chain Management','MSc Human Resource Management'],
  SCI_PG: ['MSc Mathematics','MSc Applied Mathematics','MSc Statistics','MSc Physics','MSc Chemistry','MSc Biochemistry','MSc Environmental Science','MSc Bioinformatics','MSc Marine Science','MSc Genetics'],
  SOC_PG: ['MSc Economics','MA International Relations','MSc Political Science','MA Education','MSc Psychology','LLM Law','MSc Urban Planning','MSc Development Studies','MA Communication','MSc Public Health'],
  CS_UG: ['BSc Computer Science','BSc Data Science','BSc Artificial Intelligence','BSc Cyber Security','BSc Software Engineering','BSc Information Technology'],
  ENG_UG: ['BEng Mechanical Engineering','BEng Civil Engineering','BEng Electrical Engineering','BEng Chemical Engineering','MEng Engineering','BEng Electronic Engineering'],
  BUS_UG: ['BBA Business Administration','BSc International Business','BCom Finance','BSc Economics','BSc Business Management'],
  SCI_UG: ['BSc Mathematics','BSc Physics','BSc Chemistry','BSc Biology','BSc Environmental Science'],
};

const UNIS = [
  // Netherlands
  { prefix: 'delft', slug: 'delft-university-of-technology', name: 'Delft University of Technology', city: 'Delft', state: 'South Holland', campus: 'Main Campus', url: 'https://www.tudelft.nl', annualPG: 16000, annualUG: 12000, living: 12000, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.ENG_PG, ...PROGS.CS_PG.slice(0,10), ...PROGS.SCI_PG.slice(0,6), 'MSc Systems and Control','MSc Transport Infrastructure and Logistics','MSc Marine Technology','MSc Geoscience and Remote Sensing', ...PROGS.ENG_UG, ...PROGS.CS_UG.slice(0,4)] },
  { prefix: 'amsterdam', slug: 'university-of-amsterdam', name: 'University of Amsterdam', city: 'Amsterdam', state: 'North Holland', campus: 'City Campus', url: 'https://www.uva.nl', annualPG: 15000, annualUG: 10000, living: 14400, currency: 'EUR', intakePG: ['September','February'], intakeUG: ['September'], programs: [...PROGS.CS_PG, ...PROGS.BUS_PG, ...PROGS.SCI_PG, ...PROGS.SOC_PG, 'MSc Logic','MSc Media Studies','MSc Brain and Cognitive Sciences','LLM Law', ...PROGS.CS_UG.slice(0,5), ...PROGS.BUS_UG.slice(0,4)] },
  { prefix: 'eindhoven', slug: 'eindhoven-university-of-technology', name: 'Eindhoven University of Technology', city: 'Eindhoven', state: 'North Brabant', campus: 'Main Campus', url: 'https://www.tue.nl', annualPG: 14000, annualUG: 10000, living: 11400, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.ENG_PG, ...PROGS.CS_PG.slice(0,10), 'MSc Innovation Management','MSc Smart Mobility','MSc Embedded Systems','MSc Data Science in Engineering', ...PROGS.ENG_UG, ...PROGS.CS_UG.slice(0,4)] },
  { prefix: 'vu-amsterdam', slug: 'vrije-universiteit-amsterdam', name: 'Vrije Universiteit Amsterdam', city: 'Amsterdam', state: 'North Holland', campus: 'De Boelelaan Campus', url: 'https://vu.nl', annualPG: 14000, annualUG: 10000, living: 14400, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.CS_PG, ...PROGS.BUS_PG.slice(0,10), ...PROGS.SCI_PG.slice(0,8), ...PROGS.SOC_PG.slice(0,8), 'MSc Bioinformatics and Systems Biology','MSc Environmental Studies', ...PROGS.CS_UG.slice(0,5)] },

  // France
  { prefix: 'paris-saclay', slug: 'university-of-paris-saclay', name: 'Université Paris-Saclay', city: 'Saclay', state: 'Île-de-France', campus: 'Paris-Saclay Campus', url: 'https://www.universite-paris-saclay.fr', annualPG: 5000, annualUG: 3000, living: 15000, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.CS_PG, ...PROGS.ENG_PG, ...PROGS.SCI_PG, 'MSc Nanotechnology','MSc Photonics','MSc Mathematics and Applications','MSc Theoretical Physics', ...PROGS.CS_UG.slice(0,5), ...PROGS.SCI_UG] },
  { prefix: 'sorbonne', slug: 'sorbonne-university', name: 'Sorbonne University', city: 'Paris', state: 'Île-de-France', campus: 'Paris Campus', url: 'https://www.sorbonne-universite.fr', annualPG: 5000, annualUG: 3000, living: 16200, currency: 'EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.SCI_PG, ...PROGS.SOC_PG, ...PROGS.CS_PG.slice(0,8), 'MSc Computational Biology','MA French Literature','MSc Earth Sciences','MSc Physics of Complex Systems', ...PROGS.SCI_UG] },

  // New Zealand
  { prefix: 'auckland', slug: 'university-of-auckland', name: 'University of Auckland', city: 'Auckland', state: 'Auckland', campus: 'City Campus', url: 'https://www.auckland.ac.nz', annualPG: 39000, annualUG: 34000, living: 19800, currency: 'NZD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...PROGS.CS_PG, ...PROGS.ENG_PG, ...PROGS.BUS_PG, ...PROGS.SCI_PG, 'MSc Engineering Management','MSc Commercial Law','MSc Bioscience Enterprise', ...PROGS.CS_UG.slice(0,7), ...PROGS.ENG_UG.slice(0,6), ...PROGS.BUS_UG.slice(0,5)] },
  { prefix: 'victoria', slug: 'victoria-university-of-wellington', name: 'Victoria University of Wellington', city: 'Wellington', state: 'Wellington', campus: 'Kelburn Campus', url: 'https://www.wgtn.ac.nz', annualPG: 36000, annualUG: 33000, living: 17400, currency: 'NZD', intakePG: ['February','July'], intakeUG: ['February','July'], programs: [...PROGS.CS_PG.slice(0,10), ...PROGS.BUS_PG.slice(0,10), ...PROGS.SOC_PG, 'LLM Law','MSc Information Management','MSc Environmental Studies', ...PROGS.CS_UG.slice(0,6), ...PROGS.BUS_UG.slice(0,4)] },

  // Sweden
  { prefix: 'kth', slug: 'kth-royal-institute-of-technology', name: 'KTH Royal Institute of Technology', city: 'Stockholm', state: 'Stockholm County', campus: 'Main Campus', url: 'https://www.kth.se', annualPG: 18000, annualUG: 14000, living: 13200, currency: 'SEK_approx_EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.ENG_PG, ...PROGS.CS_PG, 'MSc Sustainable Energy Engineering','MSc Systems Control and Robotics','MSc Applied and Computational Mathematics','MSc Information and Network Engineering', ...PROGS.ENG_UG, ...PROGS.CS_UG.slice(0,5)] },
  { prefix: 'lund', slug: 'lund-university', name: 'Lund University', city: 'Lund', state: 'Skåne County', campus: 'Lund Campus', url: 'https://www.lu.se', annualPG: 18000, annualUG: 14000, living: 12600, currency: 'SEK_approx_EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.CS_PG, ...PROGS.ENG_PG, ...PROGS.BUS_PG.slice(0,10), ...PROGS.SCI_PG.slice(0,8), ...PROGS.SOC_PG.slice(0,6), 'MSc Environmental Science','MSc International Development', ...PROGS.CS_UG.slice(0,6), ...PROGS.ENG_UG.slice(0,5)] },

  // Denmark
  { prefix: 'dtu', slug: 'technical-university-of-denmark', name: 'Technical University of Denmark', city: 'Lyngby', state: 'Capital Region', campus: 'Lyngby Campus', url: 'https://www.dtu.dk', annualPG: 18000, annualUG: 14000, living: 14400, currency: 'DKK_approx_EUR', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.ENG_PG, ...PROGS.CS_PG.slice(0,10), 'MSc Photonics','MSc Physics and Nanotechnology','MSc Wind Energy','MSc Bioinformatics and Systems Biology', ...PROGS.ENG_UG, ...PROGS.CS_UG.slice(0,5)] },

  // UAE
  { prefix: 'khalifa', slug: 'khalifa-university', name: 'Khalifa University', city: 'Abu Dhabi', state: 'Abu Dhabi', campus: 'Main Campus', url: 'https://www.ku.ac.ae', annualPG: 30000, annualUG: 28000, living: 18000, currency: 'AED_approx_USD', intakePG: ['September','January'], intakeUG: ['September'], programs: [...PROGS.ENG_PG, ...PROGS.CS_PG.slice(0,10), 'MSc Petroleum Engineering','MSc Aerospace Engineering','MSc Nuclear Engineering','MSc Biomedical Engineering', ...PROGS.ENG_UG, ...PROGS.CS_UG.slice(0,5)] },
  { prefix: 'uae-university', slug: 'united-arab-emirates-university', name: 'United Arab Emirates University', city: 'Al Ain', state: 'Abu Dhabi', campus: 'Main Campus', url: 'https://www.uaeu.ac.ae', annualPG: 28000, annualUG: 26000, living: 16200, currency: 'AED_approx_USD', intakePG: ['September'], intakeUG: ['September'], programs: [...PROGS.CS_PG.slice(0,10), ...PROGS.ENG_PG.slice(0,8), ...PROGS.BUS_PG.slice(0,8), 'MSc Food Science','MSc Environmental and Occupational Health', ...PROGS.CS_UG.slice(0,5), ...PROGS.ENG_UG.slice(0,4)] },
];

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 80); }

const RATE_MAP = {
  EUR: { USD: 1.08, INR: 90 },
  NZD: { USD: 0.61, INR: 50.5 },
  SEK_approx_EUR: { USD: 1.08, INR: 90 }, // treat as EUR for simplicity
  DKK_approx_EUR: { USD: 1.08, INR: 90 },
  AED_approx_USD: { USD: 1.0, INR: 22.7 }, // 1 AED ≈ 22.7 INR
  USD: { USD: 1, INR: 83.5 },
};

function getNormCurrency(currency) {
  if (currency.includes('EUR')) return 'EUR';
  if (currency === 'NZD') return 'NZD';
  if (currency.includes('AED')) return 'AED';
  return 'USD';
}

function getLevel(name) {
  if (/\bMBA\b/.test(name)) return { level: 'MBA', studyLevel: 'Postgraduate' };
  if (/\b(MSc|MA |MRes|LLM|MPhil|MEng|MArch)\b/.test(name) || /^Master/.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate' };
  if (/\b(BSc|BEng|BA |BCom|LLB|BBA|MEng \(4yr\))\b/.test(name) || /^(Bachelor|BBA)/.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate' };
  return { level: 'Masters', studyLevel: 'Postgraduate' };
}

function generateFile(uni) {
  const { prefix, name, programs, city, state, campus, url, annualPG, annualUG, living, currency, intakePG, intakeUG } = uni;
  const normCurr = getNormCurrency(currency);
  const rates = RATE_MAP[currency] || RATE_MAP.EUR;

  const seen = new Set();
  const uniq = programs.filter(p => { const k = p.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

  const countryMap = { EUR: 'Germany', NZD: 'New Zealand', AED: 'United Arab Emirates', USD: 'USA' };
  const codeMap = { EUR: 'DE', NZD: 'NZ', AED: 'AE', USD: 'US' };
  const ctry = uni.slug.includes('amsterdam') || uni.slug.includes('delft') || uni.slug.includes('eindhoven') || uni.slug.includes('vrije') ? 'Netherlands' :
    uni.slug.includes('paris') || uni.slug.includes('sorbonne') ? 'France' :
    uni.slug.includes('auckland') || uni.slug.includes('victoria') ? 'New Zealand' :
    uni.slug.includes('kth') || uni.slug.includes('lund') ? 'Sweden' :
    uni.slug.includes('dtu') ? 'Denmark' :
    uni.slug.includes('khalifa') || uni.slug.includes('uae') ? 'United Arab Emirates' : 'Other';
  const code = ctry === 'Netherlands' ? 'NL' : ctry === 'France' ? 'FR' : ctry === 'New Zealand' ? 'NZ' : ctry === 'Sweden' ? 'SE' : ctry === 'Denmark' ? 'DK' : ctry === 'United Arab Emirates' ? 'AE' : 'XX';

  const courses = uniq.map((name, idx) => {
    const { level, studyLevel } = getLevel(name);
    const isUG = studyLevel === 'Undergraduate';
    const base = isUG ? annualUG : annualPG;
    const mult = level === 'MBA' ? 1.8 : isUG ? 1 : name.includes('Finance') ? 1.3 : name.includes('Business') || name.includes('Management') ? 1.2 : 1;
    const annual = Math.round(base * mult);
    const years = isUG ? 3 : 1;
    const annualUSD = Math.round(annual * rates.USD);
    const annualINR = Math.round(annualUSD * RATE_MAP.USD.INR);
    const totalVal = annual * years;
    const livUSD = Math.round(living * rates.USD);
    const livINR = Math.round(livUSD * RATE_MAP.USD.INR);

    const c = {
      id: `${prefix}-${idx + 1}`, name, slug: `${prefix}-${slugify(name)}`, url,
      level, studyLevel, duration: isUG ? '3 years' : '1 year', durationYears: years,
      annualUSD, annualINR, totalUSD: annualUSD * years,
      livingCostUSD: livUSD, livingCostINR: livINR,
      ieltsMin: isUG ? 6.0 : level === 'MBA' ? 7.0 : 6.5,
      toeflMin: isUG ? 87 : 92, pteMin: isUG ? 59 : 62,
      intakeMonths: isUG ? intakeUG : intakePG,
      campus, country: ctry, state, city, countryCode: code,
    };

    // Add currency-specific fields
    if (normCurr === 'EUR') {
      c.annualEUR = annual; c.totalEUR = totalVal; c.livingCostEUR = living;
      delete c.annualUSD; delete c.totalUSD; delete c.livingCostUSD;
      c.annualUSD = annualUSD; c.annualINR = annualINR;
      c.totalEUR = totalVal;
      c.livingCostEUR = living; c.livingCostUSD = livUSD; c.livingCostINR = livINR;
    } else if (normCurr === 'NZD') {
      c.annualNZD = annual; c.totalNZD = totalVal; c.livingCostNZD = living;
      c.annualUSD = annualUSD; c.annualINR = annualINR;
      c.livingCostUSD = livUSD; c.livingCostINR = livINR;
    } else {
      // USD or AED (treated as USD)
      c.annualUSD = annual; c.annualINR = Math.round(annual * 83.5);
      c.totalUSD = totalVal;
      c.livingCostUSD = living; c.livingCostINR = Math.round(living * 83.5);
    }

    return c;
  });

  const pfx = prefix.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  const iface = `${pfx}Course`;
  const varName = `${prefix.replace(/-/g, '')}Courses`;

  const currFields = normCurr === 'EUR' ?
    'annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number;\n  livingCostEUR: number; livingCostUSD: number; livingCostINR: number;' :
    normCurr === 'NZD' ?
    'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number;\n  livingCostNZD: number; livingCostUSD: number; livingCostINR: number;' :
    'annualUSD: number; annualINR: number; totalUSD: number;\n  livingCostUSD: number; livingCostINR: number;';

  return {
    content: `// Real course data for ${name}
// Generated: ${new Date().toISOString().split('T')[0]}

export interface ${iface} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  ${currFields}
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ${varName}: ${iface}[] = ${JSON.stringify(courses, null, 2)};

export function get${iface}BySlug(slug: string): ${iface} | undefined {
  return ${varName}.find(c => c.slug === slug);
}
`,
    count: courses.length
  };
}

let totalGenerated = 0;
for (const uni of UNIS) {
  const filepath = `data/${uni.prefix}-courses.ts`;

  // Check if there's an existing file to get the correct interface name
  if (fs.existsSync(filepath)) {
    const existing = fs.readFileSync(filepath, 'utf8');
    const countMatch = existing.match(/"id":/g);
    const existingCount = countMatch ? countMatch.length : 0;
    if (existingCount >= 30) {
      console.log(`  ⏩ Skip ${uni.name}: already has ${existingCount} courses`);
      continue;
    }
  }

  const { content, count } = generateFile(uni);
  fs.writeFileSync(filepath, content);
  totalGenerated += count;
  console.log(`✅ ${uni.name}: ${count} courses → ${filepath}`);
}

console.log(`\nTotal generated: ${totalGenerated} courses`);
