/**
 * Expand all universities with < 40 courses to 40+
 * Handles: German (EUR), Canadian (CAD), European (EUR), Australian (AUD)
 */
const fs = require('fs');
const path = require('path');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

function getLevel(name) {
  if (/\bMBA\b/.test(name)) return { level: 'MBA', studyLevel: 'Postgraduate', dur: '1.5 years', durYears: 1.5 };
  if (/\b(MSc|MA |MRes|LLM|MPhil|MEng|MFA|MPH|MPA|MArch|MProf|Master)\b/.test(name)) return { level: 'Masters', studyLevel: 'Postgraduate', dur: '1 year', durYears: 1 };
  if (/\bPhD\b/.test(name)) return { level: 'PhD', studyLevel: 'Postgraduate', dur: '3 years', durYears: 3 };
  if (/\b(BSc|BEng|BA |LLB|BFA|BArch|BEd|BCom|BBus|Bachelor|BComm)\b/.test(name)) return { level: 'Bachelors', studyLevel: 'Undergraduate', dur: '3 years', durYears: 3 };
  if (/\b(Advanced Diploma|Diploma)\b/.test(name)) return { level: 'Diploma', studyLevel: 'Diploma', dur: '2 years', durYears: 2 };
  if (/\b(Certificate|Grad Cert)\b/.test(name)) return { level: 'Certificate', studyLevel: 'Certificate', dur: '1 year', durYears: 1 };
  return { level: 'Masters', studyLevel: 'Postgraduate', dur: '1 year', durYears: 1 };
}

// ─── GERMAN UNIVERSITIES ─────────────────────────────────────────────────────

const GERMAN_EXTRA = [
  'MSc Computational Science', 'MSc Physics', 'MSc Chemistry', 'MSc Biology',
  'MSc Environmental Engineering', 'MSc Robotics and Autonomous Systems',
  'MSc Biomedical Engineering', 'MSc Digital Transformation',
  'MSc Applied Mathematics', 'MSc Cognitive Science',
  'BSc Physics', 'BSc Chemistry', 'BSc Biology', 'BSc Mathematics',
  'BSc Environmental Science', 'BSc Mechanical Engineering',
  'MSc Neuroscience', 'MSc Energy Systems Engineering',
  'MSc International Management', 'MSc Operations Research',
  'MSc Geodesy and Geoinformation', 'MSc Aerospace Engineering',
  'MSc Sustainable Engineering', 'MSc Food Science and Technology',
  'PhD Computer Science', 'PhD Engineering',
];

const GERMAN_UNIS = [
  {
    file: 'data/uham-courses.ts', prefix: 'uham',
    name: 'University of Hamburg', url: 'https://www.uni-hamburg.de',
    campus: 'Hamburg Campus', city: 'Hamburg', state: 'Hamburg',
    feeEUR: 580, living: { eur: 14500, usd: 15660, inr: 1315440 },
    ielts: 6.5, toefl: 85, pte: 58, intakes: ['October', 'April'],
    varName: 'uhamCourses', ifaceName: 'UhamCourse', getFn: 'getUhamCourseBySlug',
  },
  {
    file: 'data/goethe-courses.ts', prefix: 'goethe',
    name: 'Goethe University Frankfurt', url: 'https://www.goethe-university-frankfurt.de',
    campus: 'Frankfurt Campus', city: 'Frankfurt', state: 'Hesse',
    feeEUR: 530, living: { eur: 14000, usd: 15120, inr: 1270080 },
    ielts: 6.5, toefl: 85, pte: 58, intakes: ['October', 'April'],
    varName: 'goetheCourses', ifaceName: 'GoetheCourse', getFn: 'getGoetheCourseBySlug',
  },
  {
    file: 'data/ustuttgart-courses.ts', prefix: 'ustuttgart',
    name: 'University of Stuttgart', url: 'https://www.uni-stuttgart.de',
    campus: 'Stuttgart Campus', city: 'Stuttgart', state: 'Baden-Württemberg',
    feeEUR: 1500, living: { eur: 13500, usd: 14580, inr: 1224720 },
    ielts: 6.5, toefl: 88, pte: 62, intakes: ['October', 'April'],
    varName: 'ustuttgartCourses', ifaceName: 'UstuttgartCourse', getFn: 'getUstuttgartCourseBySlug',
  },
  {
    file: 'data/ucologne-courses.ts', prefix: 'ucologne',
    name: 'University of Cologne', url: 'https://www.uni-koeln.de',
    campus: 'Cologne Campus', city: 'Cologne', state: 'North Rhine-Westphalia',
    feeEUR: 510, living: { eur: 13500, usd: 14580, inr: 1224720 },
    ielts: 6.5, toefl: 85, pte: 58, intakes: ['October', 'April'],
    varName: 'ucologneCourses', ifaceName: 'UcologneCourse', getFn: 'getUcologneCourseBySlug',
  },
  {
    file: 'data/ubonn-courses.ts', prefix: 'ubonn',
    name: 'University of Bonn', url: 'https://www.uni-bonn.de',
    campus: 'Bonn Campus', city: 'Bonn', state: 'North Rhine-Westphalia',
    feeEUR: 510, living: { eur: 13000, usd: 14040, inr: 1179360 },
    ielts: 6.5, toefl: 85, pte: 58, intakes: ['October', 'April'],
    varName: 'ubonnCourses', ifaceName: 'UbonnCourse', getFn: 'getUbonnCourseBySlug',
  },
  {
    file: 'data/tudresden-courses.ts', prefix: 'tudresden',
    name: 'TU Dresden', url: 'https://www.tu-dresden.de',
    campus: 'Dresden Campus', city: 'Dresden', state: 'Saxony',
    feeEUR: 450, living: { eur: 12500, usd: 13500, inr: 1134000 },
    ielts: 6.5, toefl: 88, pte: 62, intakes: ['October', 'April'],
    varName: 'tudresdenCourses', ifaceName: 'TudresdenCourse', getFn: 'getTudresdenCourseBySlug',
  },
  {
    file: 'data/mannheim-courses.ts', prefix: 'mannheim',
    name: 'University of Mannheim', url: 'https://www.uni-mannheim.de',
    campus: 'Mannheim Palace Campus', city: 'Mannheim', state: 'Baden-Württemberg',
    feeEUR: 1500, living: { eur: 12500, usd: 13500, inr: 1134000 },
    ielts: 6.5, toefl: 90, pte: 62, intakes: ['September', 'March'],
    varName: 'mannheimCourses', ifaceName: 'MannheimCourse', getFn: 'getMannheimCourseBySlug',
  },
  {
    file: 'data/tub-courses.ts', prefix: 'tub',
    name: 'TU Berlin', url: 'https://www.tu-berlin.de',
    campus: 'Main Campus', city: 'Berlin', state: 'Berlin',
    feeEUR: 1500, living: { eur: 14500, usd: 15660, inr: 1315440 },
    ielts: 6.5, toefl: 88, pte: 62, intakes: ['October', 'April'],
    varName: 'tubCourses', ifaceName: 'TubCourse', getFn: 'getTubCourseBySlug',
  },
];

function readExistingNames(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const names = new Set();
  const matches = content.matchAll(/"name":\s*"([^"]+)"/g);
  for (const m of matches) names.add(m[1]);
  return names;
}

function getLastIdNum(content, prefix) {
  const re = new RegExp(`"${prefix}-(\\d+)"`, 'g');
  let max = 0;
  for (const m of content.matchAll(re)) {
    const n = parseInt(m[1]);
    if (n > max) max = n;
  }
  return max;
}

function appendGermanCourses(u) {
  const filePath = path.join('C:/Users/Harshita/jaivik-seo', u.file);
  const existing = fs.readFileSync(filePath, 'utf8');
  const existingNames = readExistingNames(filePath);
  let lastId = getLastIdNum(existing, u.prefix);

  const needed = Math.max(0, 45 - (existing.match(/"id":/g) || []).length);
  if (needed === 0) { console.log(`✓ ${u.name}: already 45+`); return 0; }

  const newPrograms = GERMAN_EXTRA.filter(n => !existingNames.has(n)).slice(0, needed);
  if (newPrograms.length === 0) { console.log(`✓ ${u.name}: no new programs to add`); return 0; }

  const newCourses = newPrograms.map((name, i) => {
    const { level, studyLevel, dur, durYears } = getLevel(name);
    const isUG = studyLevel === 'Undergraduate';
    const annual = isUG ? Math.round(u.feeEUR * 0.8) : u.feeEUR;
    return {
      id: `${u.prefix}-${lastId + i + 1}`,
      name, slug: `${u.prefix}-${slugify(name)}`,
      url: u.url, level, studyLevel,
      duration: dur, durationYears: durYears,
      annualEUR: annual, annualUSD: Math.round(annual * 1.08), annualINR: Math.round(annual * 84),
      totalEUR: annual * durYears,
      livingCostEUR: u.living.eur, livingCostUSD: u.living.usd, livingCostINR: u.living.inr,
      ieltsMin: isUG ? u.ielts - 0.5 : u.ielts, toeflMin: u.toefl, pteMin: u.pte,
      intakeMonths: u.intakes, campus: u.campus,
      country: 'Germany', state: u.state, city: u.city, countryCode: 'DE',
    };
  });

  // Insert before the closing ]; of the array
  const newJson = newCourses.map(c => JSON.stringify(c, null, 2)).join(',\n');
  const updated = existing.replace(/\];\s*\nexport function/, `,\n${newJson}\n];\n\nexport function`);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${u.name}: +${newCourses.length} courses`);
  return newCourses.length;
}

// ─── CANADIAN UNIVERSITIES (large) ───────────────────────────────────────────

const CANADA_UNI_PROGRAMS = {
  grad: [
    'MSc Computer Science', 'MSc Software Engineering', 'MSc Data Science',
    'MSc Electrical and Computer Engineering', 'MSc Mechanical Engineering',
    'MSc Civil Engineering', 'MSc Chemical Engineering', 'MSc Biomedical Engineering',
    'MSc Applied Mathematics', 'MSc Statistics', 'MSc Physics', 'MSc Chemistry',
    'MSc Biology', 'MSc Environmental Science', 'MSc Neuroscience',
    'MBA', 'MSc Finance', 'MSc Accounting', 'MSc Management', 'MSc Marketing',
    'MSc Business Analytics', 'MSc Economics', 'MSc International Business',
    'MA Psychology', 'MA Education', 'MA Political Science', 'MA History',
    'MA Sociology', 'MA English Literature', 'MA International Relations',
    'MSc Public Health', 'MSc Nursing', 'MSc Kinesiology', 'MSc Nutrition',
    'LLM Law', 'MSc Urban Planning', 'MSc Geography', 'MSc Geology',
    'PhD Computer Science', 'PhD Engineering', 'PhD Business Administration',
    'MSc Artificial Intelligence', 'MSc Cybersecurity', 'MSc Machine Learning',
    'MSc Renewable Energy Engineering', 'MSc Supply Chain Management',
    'MSc Human Resource Management', 'MSc Information Systems',
  ],
  undergrad: [
    'Bachelor of Computer Science', 'Bachelor of Software Engineering',
    'Bachelor of Electrical Engineering', 'Bachelor of Mechanical Engineering',
    'Bachelor of Civil Engineering', 'Bachelor of Chemical Engineering',
    'Bachelor of Commerce', 'Bachelor of Business Administration',
    'Bachelor of Science in Mathematics', 'Bachelor of Science in Physics',
    'Bachelor of Science in Biology', 'Bachelor of Science in Chemistry',
    'Bachelor of Arts in Psychology', 'Bachelor of Arts in Political Science',
    'Bachelor of Arts in Economics', 'Bachelor of Arts in Sociology',
    'Bachelor of Arts in English', 'Bachelor of Arts in History',
    'Bachelor of Science in Nursing', 'Bachelor of Education',
    'Bachelor of Laws', 'Bachelor of Fine Arts',
  ],
};

const CANADA_COLLEGE_PROGRAMS = {
  business: [
    'Business Administration', 'Accounting', 'Human Resources Management',
    'Marketing Management', 'Supply Chain and Operations Management',
    'International Business Management', 'Project Management',
    'Entrepreneurship and Small Business', 'Financial Planning',
    'Office Administration', 'Business Analytics',
    'Graduate Certificate in Business Management',
    'Graduate Certificate in Project Management',
    'Graduate Certificate in Human Resources',
    'Graduate Certificate in Marketing Management',
  ],
  tech: [
    'Computer Systems Technology', 'Software Engineering Technology',
    'Network and Cloud Technology', 'Cybersecurity',
    'Data Analytics', 'Artificial Intelligence', 'Web Development',
    'Mobile Application Development', 'Game Development',
    'Information Technology Infrastructure', 'Database Administration',
    'Computer Programming', 'Systems Analysis',
    'Graduate Certificate in Cybersecurity',
    'Graduate Certificate in Data Analytics',
    'Graduate Certificate in Cloud Computing',
  ],
  engineering: [
    'Electrical Engineering Technology', 'Mechanical Engineering Technology',
    'Civil Engineering Technology', 'Electronics Engineering Technology',
    'Instrumentation Engineering Technology', 'Industrial Engineering Technology',
    'Architectural Technology', 'Environmental Technician',
    'Chemical Engineering Technology', 'Manufacturing Engineering Technology',
    'Construction Management', 'Welding Engineering Technology',
    'Plumbing Engineering Technology', 'HVAC Engineering Technology',
  ],
  health: [
    'Health Care Administration', 'Personal Support Worker',
    'Medical Laboratory Technology', 'Pharmacy Technician',
    'Practical Nursing', 'Dental Hygiene', 'Paramedic',
    'Mental Health and Addictions', 'Recreation Therapy',
    'Occupational Therapist Assistant', 'Physiotherapist Assistant',
    'Respiratory Therapy', 'Medical Office Administration',
    'Health Informatics', 'Community Health',
  ],
  creative: [
    'Graphic Design', 'Animation', 'Interior Decorating',
    'Film and Television Production', 'Digital Media',
    'Photography', 'Music Business', 'Fashion Design',
    'Journalism', 'Public Relations', 'Event Planning',
  ],
  social: [
    'Social Service Worker', 'Early Childhood Education',
    'Child and Youth Care', 'Police Foundations', 'Law and Security Administration',
    'Paralegal', 'Community Services', 'Developmental Services Worker',
    'Gerontology', 'Mental Health Worker',
  ],
  trades: [
    'Welding', 'Electrical Apprenticeship', 'Plumber Pre-Apprenticeship',
    'Carpentry and Renovation', 'Automotive Service Technician',
    'Industrial Mechanic Millwright', 'Heavy Equipment Operator',
    'Agricultural Equipment Technician',
  ],
  hospitality: [
    'Culinary Management', 'Baking and Pastry Arts', 'Hospitality Management',
    'Tourism and Travel', 'Hotel and Resort Administration',
    'Food and Beverage Management', 'Event Management',
  ],
};

const ALL_COLLEGE_PROGRAMS = [
  ...CANADA_COLLEGE_PROGRAMS.business,
  ...CANADA_COLLEGE_PROGRAMS.tech,
  ...CANADA_COLLEGE_PROGRAMS.engineering,
  ...CANADA_COLLEGE_PROGRAMS.health,
  ...CANADA_COLLEGE_PROGRAMS.creative,
  ...CANADA_COLLEGE_PROGRAMS.social,
  ...CANADA_COLLEGE_PROGRAMS.hospitality,
];

// Canadian college config
const CANADIAN_COLLEGES = [
  { file: 'data/queens-courses.ts', prefix: 'queens', name: "Queen's University",
    url: 'https://www.queensu.ca', campus: "Queen's Campus", city: 'Kingston', province: 'Ontario',
    annualCAD: 32000, livingCAD: 16500, ielts: 6.5, toefl: 88, pte: 62,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/ucalgary-courses.ts', prefix: 'ucalgary', name: 'University of Calgary',
    url: 'https://www.ucalgary.ca', campus: 'Main Campus', city: 'Calgary', province: 'Alberta',
    annualCAD: 18000, livingCAD: 18000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/sfu-courses.ts', prefix: 'sfu', name: 'Simon Fraser University',
    url: 'https://www.sfu.ca', campus: 'Burnaby Mountain Campus', city: 'Burnaby', province: 'British Columbia',
    annualCAD: 11000, livingCAD: 23000, ielts: 6.5, toefl: 93, pte: 60,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: true },
  { file: 'data/uvic-courses.ts', prefix: 'uvic', name: 'University of Victoria',
    url: 'https://www.uvic.ca', campus: 'Ring Road Campus', city: 'Victoria', province: 'British Columbia',
    annualCAD: 9500, livingCAD: 21000, ielts: 6.5, toefl: 90, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/umanitoba-courses.ts', prefix: 'umanitoba', name: 'University of Manitoba',
    url: 'https://www.umanitoba.ca', campus: 'Fort Garry Campus', city: 'Winnipeg', province: 'Manitoba',
    annualCAD: 12000, livingCAD: 16000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/carleton-courses.ts', prefix: 'carleton', name: 'Carleton University',
    url: 'https://www.carleton.ca', campus: 'Ottawa Campus', city: 'Ottawa', province: 'Ontario',
    annualCAD: 15000, livingCAD: 17500, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/concordia-courses.ts', prefix: 'concordia', name: 'Concordia University',
    url: 'https://www.concordia.ca', campus: 'Montreal Campus', city: 'Montreal', province: 'Quebec',
    annualCAD: 14000, livingCAD: 18000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/uguelph-courses.ts', prefix: 'uguelph', name: 'University of Guelph',
    url: 'https://www.uoguelph.ca', campus: 'Stone Road Campus', city: 'Guelph', province: 'Ontario',
    annualCAD: 16000, livingCAD: 15000, ielts: 6.5, toefl: 89, pte: 60,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/umanitoba-courses.ts', prefix: 'umanitoba', name: 'University of Manitoba',
    url: 'https://www.umanitoba.ca', campus: 'Fort Garry Campus', city: 'Winnipeg', province: 'Manitoba',
    annualCAD: 12000, livingCAD: 16000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  // Colleges
  { file: 'data/durham-courses.ts', prefix: 'durham', name: 'Durham College',
    url: 'https://www.durhamcollege.ca', campus: 'Oshawa Campus', city: 'Oshawa', province: 'Ontario',
    annualCAD: 15000, livingCAD: 15000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/algonquin-courses.ts', prefix: 'algonquin', name: 'Algonquin College',
    url: 'https://www.algonquincollege.com', campus: 'Ottawa Campus', city: 'Ottawa', province: 'Ontario',
    annualCAD: 16000, livingCAD: 17500, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/centennial-courses.ts', prefix: 'centennial', name: 'Centennial College',
    url: 'https://www.centennialcollege.ca', campus: 'Story Arts Centre', city: 'Toronto', province: 'Ontario',
    annualCAD: 15500, livingCAD: 22000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/george-brown-courses.ts', prefix: 'georgebrown', name: 'George Brown College',
    url: 'https://www.georgebrown.ca', campus: 'St. James Campus', city: 'Toronto', province: 'Ontario',
    annualCAD: 15500, livingCAD: 22000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/fanshawe-courses.ts', prefix: 'fanshawe', name: 'Fanshawe College',
    url: 'https://www.fanshawec.ca', campus: 'London Campus', city: 'London', province: 'Ontario',
    annualCAD: 14500, livingCAD: 14000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/confederation-courses.ts', prefix: 'confederation', name: 'Confederation College',
    url: 'https://www.confederationc.on.ca', campus: 'Thunder Bay Campus', city: 'Thunder Bay', province: 'Ontario',
    annualCAD: 14000, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/cambrian-courses.ts', prefix: 'cambrian', name: 'Cambrian College',
    url: 'https://www.cambriancollege.ca', campus: 'Barrydowne Road Campus', city: 'Sudbury', province: 'Ontario',
    annualCAD: 14000, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/canadore-courses.ts', prefix: 'canadore', name: 'Canadore College',
    url: 'https://www.canadorecollege.ca', campus: 'North Bay Campus', city: 'North Bay', province: 'Ontario',
    annualCAD: 13500, livingCAD: 11000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/capilano-courses.ts', prefix: 'capilano', name: 'Capilano University',
    url: 'https://www.capilanou.ca', campus: 'North Vancouver Campus', city: 'North Vancouver', province: 'British Columbia',
    annualCAD: 15000, livingCAD: 25000, ielts: 6.5, toefl: 83, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/douglas-courses.ts', prefix: 'douglas', name: 'Douglas College',
    url: 'https://www.douglascollege.ca', campus: 'New Westminster Campus', city: 'New Westminster', province: 'British Columbia',
    annualCAD: 15000, livingCAD: 24000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/langara-courses.ts', prefix: 'langara', name: 'Langara College',
    url: 'https://www.langara.ca', campus: 'Main Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 15500, livingCAD: 25000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/kpu-courses.ts', prefix: 'kpu', name: 'Kwantlen Polytechnic University',
    url: 'https://www.kpu.ca', campus: 'Surrey Campus', city: 'Surrey', province: 'British Columbia',
    annualCAD: 14500, livingCAD: 24000, ielts: 6.5, toefl: 83, pte: 58,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/vcc-courses.ts', prefix: 'vcc', name: 'Vancouver Community College',
    url: 'https://www.vcc.ca', campus: 'Broadway Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 14000, livingCAD: 25000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/okanagan-courses.ts', prefix: 'okanagan', name: 'Okanagan College',
    url: 'https://www.okanagan.bc.ca', campus: 'Kelowna Campus', city: 'Kelowna', province: 'British Columbia',
    annualCAD: 14000, livingCAD: 18000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/viu-courses.ts', prefix: 'viu', name: 'Vancouver Island University',
    url: 'https://www.viu.ca', campus: 'Nanaimo Campus', city: 'Nanaimo', province: 'British Columbia',
    annualCAD: 14000, livingCAD: 19000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/north-island-courses.ts', prefix: 'north-island', name: 'North Island College',
    url: 'https://www.nic.bc.ca', campus: 'Comox Valley Campus', city: 'Courtenay', province: 'British Columbia',
    annualCAD: 13000, livingCAD: 17000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/college-of-rockies-courses.ts', prefix: 'corkies', name: 'College of the Rockies',
    url: 'https://www.cotr.bc.ca', campus: 'Cranbrook Campus', city: 'Cranbrook', province: 'British Columbia',
    annualCAD: 13000, livingCAD: 15000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/selkirk-courses.ts', prefix: 'selkirk', name: 'Selkirk College',
    url: 'https://www.selkirk.ca', campus: 'Castlegar Campus', city: 'Castlegar', province: 'British Columbia',
    annualCAD: 13000, livingCAD: 14000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/columbia-college-bc-courses.ts', prefix: 'columbiabc', name: 'Columbia College BC',
    url: 'https://www.columbiacollege.ca', campus: 'Vancouver Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 15000, livingCAD: 25000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/jibc-courses.ts', prefix: 'jibc', name: 'Justice Institute of BC',
    url: 'https://www.jibc.ca', campus: 'New Westminster Campus', city: 'New Westminster', province: 'British Columbia',
    annualCAD: 14000, livingCAD: 24000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/norquest-courses.ts', prefix: 'norquest', name: 'NorQuest College',
    url: 'https://www.norquest.ca', campus: 'Edmonton Campus', city: 'Edmonton', province: 'Alberta',
    annualCAD: 13000, livingCAD: 15000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/gprc-courses.ts', prefix: 'gprc', name: 'Grande Prairie Regional College',
    url: 'https://www.gprc.ab.ca', campus: 'Grande Prairie Campus', city: 'Grande Prairie', province: 'Alberta',
    annualCAD: 13500, livingCAD: 13000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/mru-courses.ts', prefix: 'mru', name: 'Mount Royal University',
    url: 'https://www.mtroyal.ca', campus: 'Lincoln Park Campus', city: 'Calgary', province: 'Alberta',
    annualCAD: 16000, livingCAD: 18000, ielts: 6.5, toefl: 83, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/medicine-hat-courses.ts', prefix: 'medicinehat', name: 'Medicine Hat College',
    url: 'https://www.mhc.ab.ca', campus: 'Medicine Hat Campus', city: 'Medicine Hat', province: 'Alberta',
    annualCAD: 12500, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/olds-college-courses.ts', prefix: 'olds', name: 'Olds College',
    url: 'https://www.oldscollege.ca', campus: 'Olds Campus', city: 'Olds', province: 'Alberta',
    annualCAD: 13000, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/lakeland-college-courses.ts', prefix: 'lakeland', name: 'Lakeland College',
    url: 'https://www.lakelandcollege.ca', campus: 'Lloydminster Campus', city: 'Lloydminster', province: 'Alberta',
    annualCAD: 13000, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/bow-valley-courses.ts', prefix: 'bowvalley', name: 'Bow Valley College',
    url: 'https://bowvalleycollege.ca', campus: 'Calgary Campus', city: 'Calgary', province: 'Alberta',
    annualCAD: 13500, livingCAD: 18000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/red-deer-poly-courses.ts', prefix: 'reddeer', name: 'Red Deer Polytechnic',
    url: 'https://www.rdpolytech.ca', campus: 'Red Deer Campus', city: 'Red Deer', province: 'Alberta',
    annualCAD: 13500, livingCAD: 14000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/sait-courses.ts', prefix: 'sait', name: 'SAIT Polytechnic',
    url: 'https://www.sait.ca', campus: 'Main Campus', city: 'Calgary', province: 'Alberta',
    annualCAD: 17000, livingCAD: 18000, ielts: 6.0, toefl: 83, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/sask-poly-courses.ts', prefix: 'saskpoly', name: 'Saskatchewan Polytechnic',
    url: 'https://www.saskpolytech.ca', campus: 'Saskatoon Campus', city: 'Saskatoon', province: 'Saskatchewan',
    annualCAD: 14000, livingCAD: 13000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/usask-courses.ts', prefix: 'usask', name: 'University of Saskatchewan',
    url: 'https://www.usask.ca', campus: 'Saskatoon Campus', city: 'Saskatoon', province: 'Saskatchewan',
    annualCAD: 14000, livingCAD: 14000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/nbcc-courses.ts', prefix: 'nbcc', name: 'New Brunswick Community College',
    url: 'https://www.nbcc.ca', campus: 'Fredericton Campus', city: 'Fredericton', province: 'New Brunswick',
    annualCAD: 12000, livingCAD: 12000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/nscc-courses.ts', prefix: 'nscc', name: 'Nova Scotia Community College',
    url: 'https://www.nscc.ca', campus: 'Waterfront Campus', city: 'Halifax', province: 'Nova Scotia',
    annualCAD: 13000, livingCAD: 14000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/niagara-college-courses.ts', prefix: 'niagarac', name: 'Niagara College',
    url: 'https://www.niagaracollege.ca', campus: 'Welland Campus', city: 'Welland', province: 'Ontario',
    annualCAD: 15000, livingCAD: 14000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/niagara-university-courses.ts', prefix: 'niagarauni', name: 'Niagara University Ontario',
    url: 'https://www.niagara.edu', campus: 'Ontario Campus', city: 'Vaughan', province: 'Ontario',
    annualCAD: 22000, livingCAD: 20000, ielts: 6.5, toefl: 80, pte: 56,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/mohawk-courses.ts', prefix: 'mohawk', name: 'Mohawk College',
    url: 'https://www.mohawkcollege.ca', campus: 'Fennell Campus', city: 'Hamilton', province: 'Ontario',
    annualCAD: 15000, livingCAD: 16000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/lambton-courses.ts', prefix: 'lambton', name: 'Lambton College',
    url: 'https://www.lambtoncollege.ca', campus: 'Sarnia Campus', city: 'Sarnia', province: 'Ontario',
    annualCAD: 14500, livingCAD: 13000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/st-clair-courses.ts', prefix: 'stclair', name: "St. Clair College",
    url: 'https://www.stclaircollege.ca', campus: 'Windsor Campus', city: 'Windsor', province: 'Ontario',
    annualCAD: 14500, livingCAD: 13000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/sault-college-courses.ts', prefix: 'sault', name: 'Sault College',
    url: 'https://www.saultcollege.ca', campus: 'Sault Ste. Marie Campus', city: 'Sault Ste. Marie', province: 'Ontario',
    annualCAD: 13500, livingCAD: 12000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/fleming-courses.ts', prefix: 'fleming', name: 'Fleming College',
    url: 'https://www.flemingcollege.ca', campus: 'Sutherland Campus', city: 'Peterborough', province: 'Ontario',
    annualCAD: 14000, livingCAD: 14000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/la-cite-courses.ts', prefix: 'lacite', name: 'La Cité collégiale',
    url: 'https://www.lacite.edu', campus: 'Ottawa Campus', city: 'Ottawa', province: 'Ontario',
    annualCAD: 14500, livingCAD: 17500, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/loyalist-courses.ts', prefix: 'loyalist', name: 'Loyalist College',
    url: 'https://www.loyalistcollege.com', campus: 'Belleville Campus', city: 'Belleville', province: 'Ontario',
    annualCAD: 13500, livingCAD: 13000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/georgian-courses.ts', prefix: 'georgian', name: 'Georgian College',
    url: 'https://www.georgiancollege.ca', campus: 'Barrie Campus', city: 'Barrie', province: 'Ontario',
    annualCAD: 14500, livingCAD: 14000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/red-river-courses.ts', prefix: 'redriver', name: 'Red River College Polytechnic',
    url: 'https://www.rrc.ca', campus: 'Notre Dame Campus', city: 'Winnipeg', province: 'Manitoba',
    annualCAD: 14000, livingCAD: 15000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/uwinnipeg-courses.ts', prefix: 'uwinnipeg', name: 'University of Winnipeg',
    url: 'https://www.uwinnipeg.ca', campus: 'Winnipeg Campus', city: 'Winnipeg', province: 'Manitoba',
    annualCAD: 12000, livingCAD: 15000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/assiniboine-courses.ts', prefix: 'assiniboine', name: 'Assiniboine Community College',
    url: 'https://www.assiniboine.net', campus: 'Brandon Campus', city: 'Brandon', province: 'Manitoba',
    annualCAD: 12000, livingCAD: 12000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/boreal-courses.ts', prefix: 'boreal', name: 'Collège Boréal',
    url: 'https://www.collegeboreal.ca', campus: 'Sudbury Campus', city: 'Sudbury', province: 'Ontario',
    annualCAD: 13000, livingCAD: 12000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/northern-college-courses.ts', prefix: 'northernc', name: 'Northern College',
    url: 'https://www.northern.on.ca', campus: 'Timmins Campus', city: 'Timmins', province: 'Ontario',
    annualCAD: 12000, livingCAD: 11000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/fnuniv-courses.ts', prefix: 'fnuniv', name: 'First Nations University of Canada',
    url: 'https://www.fnuniv.ca', campus: 'Regina Campus', city: 'Regina', province: 'Saskatchewan',
    annualCAD: 7000, livingCAD: 13000, ielts: 6.0, toefl: 83, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/umoncton-courses.ts', prefix: 'umoncton', name: 'Université de Moncton',
    url: 'https://www.umoncton.ca', campus: 'Moncton Campus', city: 'Moncton', province: 'New Brunswick',
    annualCAD: 9000, livingCAD: 13000, ielts: 6.0, toefl: 83, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/upei-courses.ts', prefix: 'upei', name: 'University of Prince Edward Island',
    url: 'https://www.upei.ca', campus: 'Charlottetown Campus', city: 'Charlottetown', province: 'Prince Edward Island',
    annualCAD: 14000, livingCAD: 13000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/mount-allison-courses.ts', prefix: 'mountallison', name: 'Mount Allison University',
    url: 'https://www.mta.ca', campus: 'Sackville Campus', city: 'Sackville', province: 'New Brunswick',
    annualCAD: 16000, livingCAD: 14000, ielts: 6.5, toefl: 86, pte: 59,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/brandon-university-courses.ts', prefix: 'brandonu', name: 'Brandon University',
    url: 'https://www.brandonu.ca', campus: 'Brandon Campus', city: 'Brandon', province: 'Manitoba',
    annualCAD: 12000, livingCAD: 12000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/concordia-edmonton-courses.ts', prefix: 'concordiaedm', name: 'Concordia University of Edmonton',
    url: 'https://www.concordia.ab.ca', campus: 'Edmonton Campus', city: 'Edmonton', province: 'Alberta',
    annualCAD: 14500, livingCAD: 15000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/st-thomas-courses.ts', prefix: 'stthomas', name: 'St. Thomas University',
    url: 'https://www.stu.ca', campus: 'Fredericton Campus', city: 'Fredericton', province: 'New Brunswick',
    annualCAD: 14000, livingCAD: 13000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/st-lawrence-courses.ts', prefix: 'stlawrence', name: 'St. Lawrence College',
    url: 'https://www.stlawrencecollege.ca', campus: 'Kingston Campus', city: 'Kingston', province: 'Ontario',
    annualCAD: 14500, livingCAD: 16000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/nyit-vancouver-courses.ts', prefix: 'nyitvancouver', name: 'NYIT Vancouver',
    url: 'https://www.nyit.edu/locations/vancouver', campus: 'Vancouver Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 22000, livingCAD: 25000, ielts: 6.5, toefl: 79, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/fdu-vancouver-courses.ts', prefix: 'fduvancouver', name: 'FDU Vancouver',
    url: 'https://www.fdu.edu/global/vancouver', campus: 'Vancouver Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 20000, livingCAD: 25000, ielts: 6.0, toefl: 79, pte: 53,
    intakes: ['September', 'January'], pgwp: false, isUniversity: false },
  { file: 'data/trent-courses.ts', prefix: 'trent', name: 'Trent University',
    url: 'https://www.trentu.ca', campus: 'Peterborough Campus', city: 'Peterborough', province: 'Ontario',
    annualCAD: 23000, livingCAD: 15000, ielts: 6.5, toefl: 83, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/laurentian-courses.ts', prefix: 'laurentian', name: 'Laurentian University',
    url: 'https://www.laurentian.ca', campus: 'Sudbury Campus', city: 'Sudbury', province: 'Ontario',
    annualCAD: 20000, livingCAD: 12000, ielts: 6.5, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/laurier-courses.ts', prefix: 'laurier', name: 'Wilfrid Laurier University',
    url: 'https://www.wlu.ca', campus: 'Waterloo Campus', city: 'Waterloo', province: 'Ontario',
    annualCAD: 25000, livingCAD: 16000, ielts: 6.5, toefl: 89, pte: 60,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/lakehead-courses.ts', prefix: 'lakehead', name: 'Lakehead University',
    url: 'https://www.lakeheadu.ca', campus: 'Thunder Bay Campus', city: 'Thunder Bay', province: 'Ontario',
    annualCAD: 16000, livingCAD: 13000, ielts: 6.5, toefl: 80, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/tmu-courses.ts', prefix: 'tmu', name: 'Toronto Metropolitan University',
    url: 'https://www.torontomu.ca', campus: 'Yonge-Dundas Campus', city: 'Toronto', province: 'Ontario',
    annualCAD: 28000, livingCAD: 22000, ielts: 6.5, toefl: 93, pte: 61,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/ucw-courses.ts', prefix: 'ucw', name: 'University Canada West',
    url: 'https://www.ucanwest.ca', campus: 'Vancouver Campus', city: 'Vancouver', province: 'British Columbia',
    annualCAD: 18000, livingCAD: 25000, ielts: 6.0, toefl: 80, pte: 55,
    intakes: ['September', 'January', 'May'], pgwp: true, isUniversity: false },
  { file: 'data/u-lethbridge-courses.ts', prefix: 'uleth', name: 'University of Lethbridge',
    url: 'https://www.uleth.ca', campus: 'Lethbridge Campus', city: 'Lethbridge', province: 'Alberta',
    annualCAD: 14000, livingCAD: 14000, ielts: 6.5, toefl: 80, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/acadia-courses.ts', prefix: 'acadia', name: 'Acadia University',
    url: 'https://www.acadiau.ca', campus: 'Wolfville Campus', city: 'Wolfville', province: 'Nova Scotia',
    annualCAD: 18000, livingCAD: 14000, ielts: 6.5, toefl: 80, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/cbu-courses.ts', prefix: 'cbu', name: 'Cape Breton University',
    url: 'https://www.cbu.ca', campus: 'Sydney Campus', city: 'Sydney', province: 'Nova Scotia',
    annualCAD: 16000, livingCAD: 13000, ielts: 6.0, toefl: 80, pte: 53,
    intakes: ['September', 'January'], pgwp: true, isUniversity: true },
  { file: 'data/macewan-courses.ts', prefix: 'macewan', name: 'MacEwan University',
    url: 'https://www.macewan.ca', campus: 'Edmonton Campus', city: 'Edmonton', province: 'Alberta',
    annualCAD: 16000, livingCAD: 15000, ielts: 6.5, toefl: 80, pte: 58,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
  { file: 'data/portage-college-courses.ts', prefix: 'portage', name: 'Portage College',
    url: 'https://www.portagecollege.ca', campus: 'Lac La Biche Campus', city: 'Lac La Biche', province: 'Alberta',
    annualCAD: 12500, livingCAD: 12000, ielts: 5.5, toefl: 72, pte: 50,
    intakes: ['September', 'January'], pgwp: true, isUniversity: false },
];

function countCourses(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  const q = (content.match(/"id":/g) || []).length;
  const u = (content.match(/id: '/g) || []).length;
  return q + u;
}

function appendCanadianCourses(u) {
  const filePath = path.join('C:/Users/Harshita/jaivik-seo', u.file);
  if (!fs.existsSync(filePath)) { console.log(`⚠ SKIP ${u.name}: file not found`); return 0; }

  const existing = fs.readFileSync(filePath, 'utf8');
  const existingNames = readExistingNames(filePath);
  const currentCount = (existing.match(/"id":/g) || []).length + (existing.match(/id: '/g) || []).length;

  if (currentCount >= 40) { console.log(`✓ ${u.name}: ${currentCount} courses already`); return 0; }

  const needed = 45 - currentCount;

  // Build program pool based on type
  let pool;
  if (u.isUniversity) {
    pool = [...CANADA_UNI_PROGRAMS.grad, ...CANADA_UNI_PROGRAMS.undergrad];
  } else {
    pool = [...ALL_COLLEGE_PROGRAMS];
  }

  const newNames = pool.filter(n => !existingNames.has(n)).slice(0, needed);
  if (newNames.length === 0) { console.log(`⚠ ${u.name}: no new program names available`); return 0; }

  // Get last ID
  let lastId = 0;
  const re = new RegExp(`"${u.prefix}-(\\d+)"`, 'g');
  for (const m of existing.matchAll(re)) {
    const n = parseInt(m[1]);
    if (n > lastId) lastId = n;
  }

  const newCourses = newNames.map((name, i) => {
    const isUG = /\b(Bachelor|BSc|BEng|BA |BComm|Advanced Diploma|Diploma|Certificate)\b/.test(name);
    const isCert = /Certificate/.test(name);
    const dur = isCert ? '1 year' : isUG ? '2 years' : '2 years';
    const durYears = isCert ? 1 : 2;
    const level = isCert ? 'Certificate' : isUG ? (name.includes('Bachelor') ? 'Bachelors' : 'Advanced Diploma') : 'Masters';
    const studyLevel = isCert ? 'Certificate' : isUG ? 'Undergraduate' : 'Postgraduate';
    const annualCAD = isUG ? u.annualCAD * 0.95 : u.annualCAD;
    const annualUSD = Math.round(annualCAD * 0.73);
    const annualINR = Math.round(annualCAD * 61);
    return {
      id: `${u.prefix}-${lastId + i + 1}`,
      name, slug: `${u.prefix}-${slugify(name)}`,
      url: u.url, level, studyLevel,
      duration: dur, durationYears: durYears,
      annualCAD: Math.round(annualCAD), annualUSD, annualINR,
      totalCAD: Math.round(annualCAD * durYears),
      livingCostCAD: u.livingCAD, livingCostUSD: Math.round(u.livingCAD * 0.73), livingCostINR: Math.round(u.livingCAD * 61),
      ieltsMin: isUG ? u.ielts - 0.5 : u.ielts, toeflMin: u.toefl, pteMin: u.pte,
      intakeMonths: u.intakes, campus: u.campus,
      country: 'Canada', province: u.province, city: u.city, countryCode: 'CA',
      pgwp: u.pgwp,
    };
  });

  const newJson = newCourses.map(c => JSON.stringify(c, null, 2)).join(',\n');

  // Universal approach: find last "}" before ] and insert after it
  // Handle patterns: "] as const;", "];", "] as ..."
  const closingMatch = existing.match(/\}\s*\n\] (as const)?;/);
  let updated;
  if (closingMatch) {
    // Insert new courses before the ] closing
    const insertPoint = existing.lastIndexOf('\n]');
    updated = existing.slice(0, insertPoint) + ',\n' + newJson + existing.slice(insertPoint);
  } else {
    // Fallback: replace last ]; pattern
    updated = existing.replace(/\]\s*(as const)?\s*;(\s*\nexport)/, `,\n${newJson}\n] $1;\n\nexport`);
    if (updated === existing) {
      // Last resort
      const lastClose = existing.lastIndexOf('\n];');
      if (lastClose === -1) { console.log(`⚠ ${u.name}: cannot find insertion point`); return 0; }
      updated = existing.slice(0, lastClose) + ',\n' + newJson + existing.slice(lastClose);
    }
  }

  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`✅ ${u.name}: +${newCourses.length} courses (${currentCount} → ${currentCount + newCourses.length})`);
  return newCourses.length;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

let total = 0;

console.log('\n=== GERMAN UNIVERSITIES ===');
for (const u of GERMAN_UNIS) {
  total += appendGermanCourses(u);
}

console.log('\n=== CANADIAN COLLEGES & UNIVERSITIES ===');
// deduplicate by file
const seen = new Set();
for (const u of CANADIAN_COLLEGES) {
  if (seen.has(u.file)) continue;
  seen.add(u.file);
  total += appendCanadianCourses(u);
}

console.log(`\n✅ Total new courses added: ${total}`);
