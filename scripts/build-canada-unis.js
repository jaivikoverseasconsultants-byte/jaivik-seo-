/**
 * Curated program data for all 17 Canada universities & colleges.
 * Run: node scripts/build-canada-unis.js
 * Output: data/scraped/canada/<id>.json for each institution
 */

const fs = require('fs');
const path = require('path');
const OUT_DIR = path.join(__dirname, '../data/scraped/canada');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function make(id, campus, ielts, intakes, feesByLevel, programs) {
  return programs.map((p, i) => {
    const [name, level, durationYears, feeOverride] = p;
    const feeKey = level === 'PhD' ? 'phd'
      : /Masters|Master|MBA/i.test(level) ? 'masters'
      : /Graduate Certificate/i.test(level) ? 'gradCert'
      : /Advanced Diploma/i.test(level) ? 'advDip'
      : /Honours Bachelor|Bachelor \(Hon/i.test(level) ? 'bachelor'
      : /Diploma/i.test(level) ? 'diploma'
      : /Certificate/i.test(level) ? 'cert'
      : 'default';
    const annualCAD = feeOverride || feesByLevel[feeKey] || feesByLevel.default;
    const dur = durationYears === 0.5 ? '6 months'
      : durationYears < 1 ? `${Math.round(durationYears * 12)} months`
      : `${durationYears} year${durationYears !== 1 ? 's' : ''}`;
    return {
      name, level,
      slug: `${id}-${slugify(name)}`,
      url: `https://www.${id}.ca/`,
      duration: dur, durationYears,
      annualCAD,
      totalCAD: Math.round(annualCAD * durationYears),
      ieltsMin: ielts,
      intakeMonths: intakes,
      campus,
    };
  });
}

function build(id, name, campus, ielts, intakes, feesByLevel, programs) {
  const data = make(id, campus, ielts, intakes, feesByLevel, programs);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${id}.json`);
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
  const byLevel = {};
  data.forEach(c => { byLevel[c.level] = (byLevel[c.level] || 0) + 1; });
  console.log(`✅ ${name}: ${data.length} courses → ${outFile}`);
  console.log('   By level:', byLevel);
}

// ══════════════════════════════════════════════════════════════════════════════
// ONTARIO UNIVERSITIES
// ══════════════════════════════════════════════════════════════════════════════

// ── University of Windsor ───────────────────────────────────────────────────
const windsorFees = { phd: 18000, masters: 22000, gradCert: 13000, advDip: 16000, bachelor: 24000, diploma: 14000, cert: 12000, default: 22000 };
const windsorPrograms = [
  // Business
  ['Master of Business Administration (MBA)', 'Masters', 2, 28000],
  ['MSc Management', 'Masters', 1],
  ['MSc Finance', 'Masters', 1],
  ['MSc Accounting', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['MSc International Business', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['BCom Accounting', 'Honours Bachelor', 4],
  ['BCom Finance', 'Honours Bachelor', 4],
  ['BCom Marketing', 'Honours Bachelor', 4],
  ['BCom Management', 'Honours Bachelor', 4],
  ['BCom International Business', 'Honours Bachelor', 4],
  // Computer Science & Engineering
  ['MSc Computer Science', 'Masters', 2],
  ['MEng Computer Engineering', 'Masters', 1],
  ['MEng Electrical Engineering', 'Masters', 1],
  ['MEng Mechanical Engineering', 'Masters', 1],
  ['MEng Civil Engineering', 'Masters', 1],
  ['MEng Industrial Engineering', 'Masters', 1],
  ['MEng Environmental Engineering', 'Masters', 1],
  ['MSc Data Science', 'Masters', 2],
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Software Engineering', 'Honours Bachelor', 4],
  ['BEng Mechanical Engineering', 'Honours Bachelor', 4],
  ['BEng Electrical Engineering', 'Honours Bachelor', 4],
  ['BEng Civil Engineering', 'Honours Bachelor', 4],
  ['BEng Chemical Engineering', 'Honours Bachelor', 4],
  ['BEng Industrial Engineering', 'Honours Bachelor', 4],
  // Law
  ['Juris Doctor (JD)', 'Masters', 3, 24000],
  ['LLM International Business Law', 'Masters', 1],
  // Education
  ['MEd Educational Leadership', 'Masters', 2],
  ['MEd Counselling', 'Masters', 2],
  // Social Science
  ['MSW Social Work', 'Masters', 2],
  ['MA Communication', 'Masters', 1],
  ['MA Political Science', 'Masters', 2],
  ['MA History', 'Masters', 2],
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  // Science
  ['MSc Chemistry', 'Masters', 2],
  ['MSc Biology', 'Masters', 2],
  ['MSc Physics', 'Masters', 2],
  ['MSc Environmental Science', 'Masters', 2],
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Biomedical Science', 'Honours Bachelor', 4],
  // Research
  ['PhD Computer Science', 'PhD', 4],
  ['PhD Engineering', 'PhD', 4],
  ['PhD Business Administration', 'PhD', 4],
  ['PhD Chemistry', 'PhD', 4],
];

// ── Trent University ────────────────────────────────────────────────────────
const trentFees = { phd: 16000, masters: 20000, gradCert: 12500, advDip: 15000, bachelor: 22000, diploma: 13500, cert: 11000, default: 20000 };
const trentPrograms = [
  // Environment & Science
  ['MSc Environmental and Life Sciences', 'Masters', 2],
  ['MSc Biology', 'Masters', 2],
  ['MSc Chemistry', 'Masters', 2],
  ['MSc Geography', 'Masters', 2],
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  ['BSc Geography', 'Honours Bachelor', 4],
  ['BSc Forensic Science', 'Honours Bachelor', 4],
  ['BSc Biochemistry', 'Honours Bachelor', 4],
  // Business
  ['MBA (Trent-Durham GTA)', 'Masters', 2, 22000],
  ['BBA Business Administration', 'Honours Bachelor', 4],
  ['BSc Economics', 'Honours Bachelor', 4],
  ['BCom Accounting', 'Honours Bachelor', 4],
  // Computer Science
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Data Science', 'Honours Bachelor', 4],
  ['MSc Applied Modelling and Quantitative Methods', 'Masters', 2],
  // Psychology & Social Science
  ['MA Psychology', 'Masters', 2],
  ['MA Cultural Studies', 'Masters', 2],
  ['BSc Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Political Studies', 'Honours Bachelor', 4],
  ['BA Philosophy', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA English Literature', 'Honours Bachelor', 4],
  ['BA Indigenous Studies', 'Honours Bachelor', 4],
  ['MA Indigenous Studies', 'Masters', 2],
  // Education
  ['MEd Sustainability Education', 'Masters', 2],
  ['BEd Education', 'Honours Bachelor', 2],
  // Nursing
  ['BScN Nursing', 'Honours Bachelor', 4],
  // Research
  ['PhD Environmental and Life Sciences', 'PhD', 4],
  ['PhD Psychology', 'PhD', 4],
  ['PhD Indigenous Studies', 'PhD', 4],
];

// ══════════════════════════════════════════════════════════════════════════════
// ONTARIO COLLEGES
// ══════════════════════════════════════════════════════════════════════════════

// ── Conestoga College ───────────────────────────────────────────────────────
const conestogaFees = { phd: null, masters: null, gradCert: 14500, advDip: 15000, bachelor: 17000, diploma: 14000, cert: 12000, default: 14500 };
const conestogaPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Business Management', 'Graduate Certificate', 1],
  ['Accounting', 'Advanced Diploma', 3],
  ['Finance', 'Graduate Certificate', 1],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['Supply Chain and Operations Management', 'Graduate Certificate', 1],
  ['Digital Marketing Management', 'Graduate Certificate', 1],
  ['Entrepreneurship and Small Business', 'Graduate Certificate', 1],
  ['International Business Management', 'Graduate Certificate', 1],
  ['Marketing Management', 'Advanced Diploma', 3],
  ['Business — Financial Services', 'Graduate Certificate', 1],
  // IT & Technology
  ['Computer Systems Technician', 'Diploma', 2],
  ['Computer Engineering Technology', 'Advanced Diploma', 3],
  ['Software Engineering Technology', 'Advanced Diploma', 3],
  ['Network Engineering Technology', 'Advanced Diploma', 3],
  ['Cybersecurity and Threat Management', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Cloud Computing Architecture', 'Graduate Certificate', 1],
  ['Artificial Intelligence and Machine Learning', 'Graduate Certificate', 1],
  ['Internet of Things', 'Graduate Certificate', 1],
  ['Mobile Application Development', 'Graduate Certificate', 1],
  ['Game Development', 'Advanced Diploma', 3],
  // Engineering
  ['Mechanical Engineering Technology', 'Advanced Diploma', 3],
  ['Electrical Engineering Technology', 'Advanced Diploma', 3],
  ['Civil Engineering Technology', 'Advanced Diploma', 3],
  ['Environmental Engineering Technology', 'Diploma', 2],
  ['Automation and Robotics', 'Graduate Certificate', 1],
  ['Welding Engineering Technology', 'Advanced Diploma', 3],
  ['Heating, Refrigeration and Air Conditioning', 'Diploma', 2],
  // Design & Media
  ['Graphic Design', 'Advanced Diploma', 3],
  ['Interior Design', 'Advanced Diploma', 3],
  ['Interaction Design', 'Graduate Certificate', 1],
  ['Media Design', 'Graduate Certificate', 1],
  // Health
  ['Practical Nursing', 'Diploma', 2],
  ['Pharmacy Technician', 'Diploma', 2],
  ['Dental Hygiene', 'Advanced Diploma', 3],
  ['Medical Device Reprocessing Technician', 'Certificate', 1],
  ['Health Informatics', 'Graduate Certificate', 1],
  // Hospitality
  ['Culinary Management', 'Diploma', 2],
  ['Hospitality and Tourism Management', 'Diploma', 2],
  ['Event Management', 'Graduate Certificate', 1],
  // Architecture
  ['Architectural Technology', 'Advanced Diploma', 3],
  ['Construction Engineering Technology', 'Advanced Diploma', 3],
  ['Construction Project Management', 'Graduate Certificate', 1],
  // Honours Bachelor Programs
  ['Bachelor of Business Administration', 'Honours Bachelor', 4],
  ['Bachelor of Applied Computer Science', 'Honours Bachelor', 4],
  ['Bachelor of Interior Design', 'Honours Bachelor', 4],
];

// ── Humber College ──────────────────────────────────────────────────────────
const humberFees = { phd: null, masters: null, gradCert: 15000, advDip: 15500, bachelor: 18000, diploma: 14500, cert: 12500, default: 15000 };
const humberPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Accounting', 'Advanced Diploma', 3],
  ['Finance', 'Advanced Diploma', 3],
  ['Marketing', 'Advanced Diploma', 3],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Supply Chain Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['Digital Marketing', 'Graduate Certificate', 1],
  ['International Business Management', 'Graduate Certificate', 1],
  ['Event Management', 'Graduate Certificate', 1],
  ['Entrepreneurship and Innovation Management', 'Graduate Certificate', 1],
  ['Global Business Management', 'Graduate Certificate', 1],
  ['Logistics and Supply Chain Management', 'Advanced Diploma', 3],
  ['Public Relations', 'Advanced Diploma', 3],
  // IT
  ['Computer Engineering Technology', 'Advanced Diploma', 3],
  ['Computer Systems Technician', 'Diploma', 2],
  ['Software Development', 'Graduate Certificate', 1],
  ['Artificial Intelligence', 'Graduate Certificate', 1],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Science', 'Graduate Certificate', 1],
  ['Cloud Computing', 'Graduate Certificate', 1],
  ['Network and Telecommunications Engineering Technology', 'Advanced Diploma', 3],
  ['Game Programming', 'Advanced Diploma', 3],
  ['User Experience Design', 'Graduate Certificate', 1],
  // Media
  ['Media Communications', 'Graduate Certificate', 1],
  ['Broadcasting — Radio, Television and Film', 'Diploma', 2],
  ['Journalism', 'Advanced Diploma', 3],
  ['Film and Television Production', 'Advanced Diploma', 3],
  ['Advertising and Graphic Design', 'Advanced Diploma', 3],
  ['Animation', 'Advanced Diploma', 3],
  // Health
  ['Practical Nursing', 'Diploma', 2],
  ['Paramedic', 'Advanced Diploma', 3],
  ['Dental Hygiene', 'Advanced Diploma', 3],
  ['Fitness and Health Promotion', 'Diploma', 2],
  ['Personal Support Worker', 'Certificate', 1],
  ['Health Sciences', 'Graduate Certificate', 1],
  ['Healthcare Administration', 'Graduate Certificate', 1],
  // Hospitality & Tourism
  ['Tourism and Hospitality Management', 'Advanced Diploma', 3],
  ['Hotel and Restaurant Management', 'Advanced Diploma', 3],
  ['Culinary Management', 'Diploma', 2],
  ['Baking and Pastry Arts Management', 'Diploma', 2],
  // Design & Trades
  ['Interior Decoration', 'Advanced Diploma', 3],
  ['Fashion Arts', 'Advanced Diploma', 3],
  ['Carpentry and Renovation Technician', 'Diploma', 2],
  ['Electrical Engineering Technology', 'Advanced Diploma', 3],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 3],
  // Public Safety
  ['Police Foundations', 'Diploma', 2],
  ['Community and Justice Services', 'Diploma', 2],
  ['Protection, Security and Investigation', 'Diploma', 2],
  // Honours Bachelor Programs
  ['Bachelor of Creative Arts', 'Honours Bachelor', 4],
  ['Bachelor of Commerce — Financial Services', 'Honours Bachelor', 4],
  ['Bachelor of Applied Technology — Computer Systems', 'Honours Bachelor', 4],
  ['Bachelor of Nursing', 'Honours Bachelor', 4],
];

// ── Sheridan College ────────────────────────────────────────────────────────
const sheridanFees = { phd: null, masters: null, gradCert: 15000, advDip: 15500, bachelor: 18000, diploma: 14500, cert: 12500, default: 15000 };
const sheridanPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Accounting', 'Advanced Diploma', 3],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['International Business Management', 'Graduate Certificate', 1],
  ['Marketing Management', 'Advanced Diploma', 3],
  ['Supply Chain Management', 'Graduate Certificate', 1],
  ['Event Management', 'Graduate Certificate', 1],
  // Animation & Creative Arts
  ['Animation', 'Advanced Diploma', 3],
  ['Computer Animation', 'Graduate Certificate', 1],
  ['Illustration', 'Advanced Diploma', 3],
  ['Graphic Design', 'Advanced Diploma', 3],
  ['Game Design', 'Advanced Diploma', 3],
  ['Visual Effects', 'Graduate Certificate', 1],
  ['Interactive Media Design', 'Advanced Diploma', 3],
  ['Digital Photography', 'Diploma', 2],
  ['Film and Television', 'Advanced Diploma', 3],
  ['Music Theatre Performance', 'Advanced Diploma', 3],
  // IT
  ['Computer Systems Technology', 'Advanced Diploma', 3],
  ['Software Development', 'Graduate Certificate', 1],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Cloud Computing', 'Graduate Certificate', 1],
  ['User Experience Design', 'Graduate Certificate', 1],
  ['Artificial Intelligence', 'Graduate Certificate', 1],
  // Engineering
  ['Electrical Engineering Technology', 'Advanced Diploma', 3],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 3],
  ['Civil Engineering Technology', 'Advanced Diploma', 3],
  ['Chemical Engineering Technology', 'Advanced Diploma', 3],
  // Design
  ['Interior Design', 'Advanced Diploma', 3],
  ['Architectural Technology', 'Advanced Diploma', 3],
  ['Fashion Design', 'Advanced Diploma', 3],
  ['Jewellery Design and Metalsmithing', 'Advanced Diploma', 3],
  // Health & Community
  ['Social Service Worker', 'Diploma', 2],
  ['Early Childhood Education', 'Diploma', 2],
  ['Practical Nursing', 'Diploma', 2],
  // Honours Bachelor Programs
  ['Bachelor of Animation', 'Honours Bachelor', 4],
  ['Bachelor of Game Design', 'Honours Bachelor', 4],
  ['Bachelor of Business Administration', 'Honours Bachelor', 4],
  ['Bachelor of Illustration', 'Honours Bachelor', 4],
  ['Bachelor of Interior Design', 'Honours Bachelor', 4],
];

// ── George Brown College ────────────────────────────────────────────────────
const georgeBrownFees = { phd: null, masters: null, gradCert: 16000, advDip: 16500, bachelor: 18500, diploma: 15000, cert: 13000, default: 16000 };
const georgeBrownPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Accounting and Finance', 'Advanced Diploma', 3],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Marketing Management', 'Advanced Diploma', 3],
  ['Project Management', 'Graduate Certificate', 1],
  ['International Business Management', 'Graduate Certificate', 1],
  ['Financial Planning', 'Graduate Certificate', 1],
  ['Event Planning', 'Graduate Certificate', 1],
  // IT
  ['Computer Systems Technology', 'Advanced Diploma', 3],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Artificial Intelligence', 'Graduate Certificate', 1],
  ['Cloud Computing', 'Graduate Certificate', 1],
  // Health
  ['Dental Hygiene', 'Advanced Diploma', 3],
  ['Dental Assisting', 'Certificate', 1],
  ['Practical Nursing', 'Diploma', 2],
  ['Personal Support Worker', 'Certificate', 1],
  ['Pharmacy Technician', 'Diploma', 2],
  ['Medical Laboratory Technology', 'Advanced Diploma', 3],
  ['Hearing Instrument Specialist', 'Diploma', 2],
  ['Opticianry', 'Diploma', 2],
  // Hospitality & Culinary
  ['Culinary Management', 'Diploma', 2],
  ['Baking and Pastry Arts Management', 'Diploma', 2],
  ['Food and Nutrition Management', 'Graduate Certificate', 1],
  ['Hotel Operations Management', 'Advanced Diploma', 3],
  ['Tourism Management', 'Advanced Diploma', 3],
  ['Event Planning', 'Diploma', 2],
  // Construction & Trades
  ['Construction Engineering Technology', 'Advanced Diploma', 3],
  ['Architectural Technology', 'Advanced Diploma', 3],
  ['Interior Design', 'Advanced Diploma', 3],
  ['Green Architecture', 'Graduate Certificate', 1],
  // Design & Arts
  ['Graphic Design', 'Advanced Diploma', 3],
  ['Interactive Media Design', 'Advanced Diploma', 3],
  // Honours Bachelor Programs
  ['Bachelor of Applied Business — Hospitality Operations', 'Honours Bachelor', 4],
  ['Bachelor of Technology — Construction Management', 'Honours Bachelor', 4],
];

// ── Algonquin College ───────────────────────────────────────────────────────
const algonquinFees = { phd: null, masters: null, gradCert: 14500, advDip: 15000, bachelor: 17000, diploma: 14000, cert: 12000, default: 14500 };
const algonquinPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Accounting', 'Advanced Diploma', 3],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['Digital Marketing', 'Graduate Certificate', 1],
  ['International Business Management', 'Graduate Certificate', 1],
  ['Supply Chain Management', 'Graduate Certificate', 1],
  ['Financial Management', 'Graduate Certificate', 1],
  // IT
  ['Computer Engineering Technology', 'Advanced Diploma', 3],
  ['Computer Systems Technician', 'Diploma', 2],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Artificial Intelligence and Machine Learning', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Cloud Development and Operations', 'Graduate Certificate', 1],
  ['Interactive Media Design', 'Advanced Diploma', 3],
  ['Video Game Design', 'Advanced Diploma', 3],
  // Engineering
  ['Electrical Engineering Technology', 'Advanced Diploma', 3],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 3],
  ['Civil Engineering Technology', 'Advanced Diploma', 3],
  ['Electronics Engineering Technology', 'Diploma', 2],
  // Media & Communications
  ['Graphic Design', 'Advanced Diploma', 3],
  ['Journalism', 'Advanced Diploma', 3],
  ['Public Relations', 'Graduate Certificate', 1],
  ['Photography', 'Diploma', 2],
  // Health
  ['Practical Nursing', 'Diploma', 2],
  ['Pharmacy Technician', 'Diploma', 2],
  ['Health Care Admin', 'Graduate Certificate', 1],
  // Community & Social
  ['Social Service Worker', 'Diploma', 2],
  ['Early Childhood Education', 'Diploma', 2],
  ['Police Foundations', 'Diploma', 2],
  // Hospitality
  ['Culinary Management', 'Diploma', 2],
  ['Tourism Management', 'Diploma', 2],
  // Construction
  ['Architectural Technology', 'Advanced Diploma', 3],
  ['Construction Engineering Technology', 'Advanced Diploma', 3],
  ['Interior Design', 'Advanced Diploma', 3],
  ['Honours Bachelor of Architectural Studies', 'Honours Bachelor', 4],
];

// ── Mohawk College ──────────────────────────────────────────────────────────
const mohawkFees = { phd: null, masters: null, gradCert: 14000, advDip: 14500, bachelor: 16500, diploma: 13500, cert: 11500, default: 14000 };
const mohawkPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 3],
  ['Accounting', 'Advanced Diploma', 3],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['Marketing Management', 'Diploma', 2],
  ['Global Business Management', 'Graduate Certificate', 1],
  ['Supply Chain and Logistics', 'Graduate Certificate', 1],
  // IT & Technology
  ['Computer Systems Technology', 'Advanced Diploma', 3],
  ['Software Development', 'Graduate Certificate', 1],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Artificial Intelligence', 'Graduate Certificate', 1],
  // Engineering & Trades
  ['Electrical Engineering Technology', 'Advanced Diploma', 3],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 3],
  ['Civil Engineering Technology', 'Advanced Diploma', 3],
  ['Chemical Engineering Technology', 'Advanced Diploma', 3],
  ['Energy Systems Engineering Technology', 'Advanced Diploma', 3],
  ['Welding Engineering Technology', 'Diploma', 2],
  // Health
  ['Practical Nursing', 'Diploma', 2],
  ['Respiratory Therapy', 'Advanced Diploma', 3],
  ['Diagnostic Medical Sonography', 'Advanced Diploma', 3],
  ['Medical Radiation Technology', 'Advanced Diploma', 3],
  // Community
  ['Social Service Worker', 'Diploma', 2],
  ['Early Childhood Education', 'Diploma', 2],
  // Design
  ['Graphic Design', 'Advanced Diploma', 3],
  ['Interior Design', 'Advanced Diploma', 3],
  // Architecture
  ['Architectural Technology', 'Advanced Diploma', 3],
  ['Construction Engineering Technology', 'Advanced Diploma', 3],
  ['Honours Bachelor of Technology — Building Science', 'Honours Bachelor', 4],
];

// ══════════════════════════════════════════════════════════════════════════════
// BRITISH COLUMBIA
// ══════════════════════════════════════════════════════════════════════════════

// ── Thompson Rivers University ──────────────────────────────────────────────
const truFees = { phd: 16000, masters: 20000, gradCert: 13000, advDip: 16000, bachelor: 20000, diploma: 15500, cert: 12000, default: 19000 };
const truPrograms = [
  // Business
  ['Master of Business Administration (MBA)', 'Masters', 2, 22000],
  ['MSc Environmental Science', 'Masters', 2],
  ['BBA Business Administration', 'Honours Bachelor', 4],
  ['BCom Accounting', 'Honours Bachelor', 4],
  ['BSc Economics', 'Honours Bachelor', 4],
  ['BSc Finance', 'Honours Bachelor', 4],
  ['Graduate Certificate in Management', 'Graduate Certificate', 1],
  ['Graduate Certificate in Innovation and Entrepreneurship', 'Graduate Certificate', 1],
  // Computing
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Software Engineering', 'Honours Bachelor', 4],
  ['BSc Data Science', 'Honours Bachelor', 4],
  ['BSc Cybersecurity', 'Honours Bachelor', 4],
  ['Diploma in Computer Information Systems', 'Diploma', 2],
  ['Graduate Certificate in Data Analytics', 'Graduate Certificate', 1],
  // Engineering & Technology
  ['BEng Mechanical Engineering', 'Honours Bachelor', 4],
  ['BEng Electrical Engineering', 'Honours Bachelor', 4],
  ['BEng Environmental Engineering', 'Honours Bachelor', 4],
  ['Diploma in Electronic and Computer Engineering Technology', 'Diploma', 2],
  // Nursing & Health
  ['BScN Nursing', 'Honours Bachelor', 4],
  ['BSc Psychology', 'Honours Bachelor', 4],
  ['BSc Kinesiology', 'Honours Bachelor', 4],
  ['Graduate Certificate in Healthcare Management', 'Graduate Certificate', 1],
  // Arts & Social Sciences
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Environmental Studies', 'Honours Bachelor', 4],
  ['BA Communications', 'Honours Bachelor', 4],
  ['BA Indigenous Studies', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  // Science
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  // Law & Justice
  ['BSc Criminal Justice', 'Honours Bachelor', 4],
  ['Bachelor of Laws (LLB)', 'Honours Bachelor', 3, 22000],
  // Tourism
  ['BTM Tourism Management', 'Honours Bachelor', 4],
  ['Diploma in Hospitality Management', 'Diploma', 2],
  // Education
  ['BEd Education', 'Honours Bachelor', 2],
  ['MEd Educational Leadership', 'Masters', 2],
  // Trades (graduate certs)
  ['Graduate Certificate in Trades Management', 'Graduate Certificate', 1],
  ['Graduate Certificate in Supply Chain Management', 'Graduate Certificate', 1],
  ['Graduate Certificate in Digital Marketing', 'Graduate Certificate', 1],
  // Research
  ['PhD Education', 'PhD', 4],
  ['PhD Computing Science', 'PhD', 4],
];

// ── University of Northern BC ───────────────────────────────────────────────
const unbcFees = { phd: 15000, masters: 19000, gradCert: 12500, advDip: 15500, bachelor: 21000, diploma: 14500, cert: 11500, default: 19000 };
const unbcPrograms = [
  // Business
  ['MBA Global Management', 'Masters', 2, 21000],
  ['MSc Community Health Science', 'Masters', 2],
  ['BComm Business Administration', 'Honours Bachelor', 4],
  ['BSc Economics', 'Honours Bachelor', 4],
  // Science
  ['MSc Biology', 'Masters', 2],
  ['MSc Chemistry', 'Masters', 2],
  ['MSc Environmental Science', 'Masters', 2],
  ['MSc Nursing', 'Masters', 2],
  ['MSc Psychology', 'Masters', 2],
  ['MSc Mathematics', 'Masters', 2],
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Physics', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  ['BSc Biomedical Studies', 'Honours Bachelor', 4],
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Kinesiology', 'Honours Bachelor', 4],
  // Engineering
  ['BEng Environmental Engineering', 'Honours Bachelor', 4],
  ['BEng Geomatics Engineering', 'Honours Bachelor', 4],
  ['MSc Engineering', 'Masters', 2],
  // Social Sciences & Humanities
  ['BA Political Science', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA English', 'Honours Bachelor', 4],
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Gender Studies', 'Honours Bachelor', 4],
  ['BA First Nations Studies', 'Honours Bachelor', 4],
  ['MA First Nations Studies', 'Masters', 2],
  ['MA History', 'Masters', 2],
  // Nursing
  ['BScN Nursing', 'Honours Bachelor', 4],
  // Education
  ['BEd Education', 'Honours Bachelor', 2],
  ['MEd Education', 'Masters', 2],
  // Social Work
  ['BSW Social Work', 'Honours Bachelor', 4],
  ['MSW Social Work', 'Masters', 2],
  // Research
  ['PhD Community Health Science', 'PhD', 4],
  ['PhD Biology', 'PhD', 4],
  ['PhD Chemistry', 'PhD', 4],
  ['PhD Engineering', 'PhD', 4],
  ['PhD Nursing', 'PhD', 4],
];

// ── Capilano University ─────────────────────────────────────────────────────
const capilanoFees = { phd: null, masters: null, gradCert: 15000, advDip: 17000, bachelor: 20000, diploma: 16000, cert: 13000, default: 17000 };
const capilanoPrograms = [
  // Business
  ['Bachelor of Business Administration', 'Honours Bachelor', 4],
  ['Bachelor of Business Administration — Accounting', 'Honours Bachelor', 4],
  ['Graduate Certificate in Business Administration', 'Graduate Certificate', 1],
  ['Graduate Certificate in Digital Marketing', 'Graduate Certificate', 1],
  ['Graduate Certificate in Management', 'Graduate Certificate', 1],
  ['Diploma in Business Management', 'Diploma', 2],
  // Tourism
  ['Bachelor of Tourism Management', 'Honours Bachelor', 4],
  ['Diploma in Tourism Management', 'Diploma', 2],
  // Film & Arts
  ['Bachelor of Motion Picture Arts', 'Honours Bachelor', 4],
  ['Bachelor of Communication Studies', 'Honours Bachelor', 4],
  ['Bachelor of Music', 'Honours Bachelor', 4],
  ['Diploma in Music', 'Diploma', 2],
  ['Diploma in Screen Arts', 'Diploma', 2],
  ['Diploma in Visual Effects and Animation', 'Diploma', 2],
  // Computing
  ['Diploma in Computing', 'Diploma', 2],
  ['Graduate Certificate in Data Analytics', 'Graduate Certificate', 1],
  // Health
  ['Diploma in Kinesiology', 'Diploma', 2],
  ['Diploma in Health Sciences', 'Diploma', 2],
  // Education
  ['Graduate Certificate in Early Childhood Education', 'Graduate Certificate', 1],
  // Design
  ['Bachelor of Design', 'Honours Bachelor', 4],
  ['Diploma in Design', 'Diploma', 2],
  // Legal Studies
  ['Diploma in Legal Studies', 'Diploma', 2],
  ['Graduate Certificate in Legal Administration', 'Graduate Certificate', 1],
  // Language
  ['Diploma in Applied Linguistics', 'Diploma', 2],
];

// ══════════════════════════════════════════════════════════════════════════════
// ALBERTA
// ══════════════════════════════════════════════════════════════════════════════

// ── SAIT ───────────────────────────────────────────────────────────────────
const saitFees = { phd: null, masters: null, gradCert: 14500, advDip: 16000, bachelor: 18500, diploma: 14000, cert: 12000, default: 14500 };
const saitPrograms = [
  // Business
  ['Business Administration', 'Advanced Diploma', 2],
  ['Accounting', 'Advanced Diploma', 2],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Project Management', 'Graduate Certificate', 1],
  ['Digital Marketing', 'Graduate Certificate', 1],
  ['Supply Chain Management', 'Graduate Certificate', 1],
  ['International Business', 'Graduate Certificate', 1],
  ['Financial Services', 'Graduate Certificate', 1],
  ['Entrepreneurship', 'Graduate Certificate', 1],
  // IT & Technology
  ['Information Technology', 'Advanced Diploma', 2],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Artificial Intelligence', 'Graduate Certificate', 1],
  ['Cloud Computing', 'Graduate Certificate', 1],
  ['Software Development', 'Graduate Certificate', 1],
  ['Network Infrastructure', 'Diploma', 2],
  // Engineering Technology
  ['Electrical Engineering Technology', 'Advanced Diploma', 2],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 2],
  ['Civil Engineering Technology', 'Advanced Diploma', 2],
  ['Chemical Engineering Technology', 'Advanced Diploma', 2],
  ['Petroleum Engineering Technology', 'Advanced Diploma', 2],
  ['Environmental Engineering Technology', 'Diploma', 2],
  ['Architectural Technology', 'Advanced Diploma', 2],
  ['Construction Project Management', 'Graduate Certificate', 1],
  ['Welding Engineering Technology', 'Advanced Diploma', 2],
  ['Energy Management', 'Graduate Certificate', 1],
  // Healthcare
  ['Health Information Management', 'Advanced Diploma', 2],
  ['Medical Device Reprocessing', 'Diploma', 1],
  // Culinary & Hospitality
  ['Culinary Arts', 'Diploma', 2],
  ['Hospitality Management', 'Advanced Diploma', 2],
  // Design & Media
  ['Graphic Design Technology', 'Advanced Diploma', 2],
  ['Film and Video Production', 'Advanced Diploma', 2],
  // Safety
  ['Safety Management', 'Graduate Certificate', 1],
  // Honours Bachelor Programs
  ['Bachelor of Applied Business Administration', 'Honours Bachelor', 4],
  ['Bachelor of Applied Technology — Integrated Energy', 'Honours Bachelor', 4],
  ['Bachelor of Health Sciences', 'Honours Bachelor', 4],
];

// ── Concordia University of Edmonton ────────────────────────────────────────
const concordiaEdmontonFees = { phd: null, masters: 20000, gradCert: 13000, advDip: 15000, bachelor: 22000, diploma: 14000, cert: 12000, default: 20000 };
const concordiaEdmontonPrograms = [
  // Business
  ['MBA Business Administration', 'Masters', 2, 22000],
  ['BCom Accounting', 'Honours Bachelor', 4],
  ['BCom Finance', 'Honours Bachelor', 4],
  ['BCom Management', 'Honours Bachelor', 4],
  ['BCom Marketing', 'Honours Bachelor', 4],
  ['BCom International Business', 'Honours Bachelor', 4],
  ['BCom Human Resources', 'Honours Bachelor', 4],
  // Science
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Physics', 'Honours Bachelor', 4],
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  ['BSc Psychology', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  // Arts & Social Sciences
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA English', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  ['BA Philosophy', 'Honours Bachelor', 4],
  // Education
  ['BEd Education', 'Honours Bachelor', 2],
];

// ══════════════════════════════════════════════════════════════════════════════
// NOVA SCOTIA
// ══════════════════════════════════════════════════════════════════════════════

// ── Acadia University ───────────────────────────────────────────────────────
const acadiaFees = { phd: 14000, masters: 18000, gradCert: 12000, advDip: 15000, bachelor: 20000, diploma: 13500, cert: 11000, default: 18000 };
const acadiaPrograms = [
  // Business
  ['MBA Business Administration', 'Masters', 2, 20000],
  ['MSc Computer Science', 'Masters', 2],
  ['MSc Applied Geomatics', 'Masters', 2],
  ['BBA Business Administration', 'Honours Bachelor', 4],
  ['BBA Accounting', 'Honours Bachelor', 4],
  ['BBA Finance', 'Honours Bachelor', 4],
  ['BBA Marketing', 'Honours Bachelor', 4],
  ['BBA Human Resources', 'Honours Bachelor', 4],
  ['BSc Economics', 'Honours Bachelor', 4],
  // Science
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Physics', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  ['BSc Geology', 'Honours Bachelor', 4],
  ['BSc Kinesiology', 'Honours Bachelor', 4],
  ['BSc Nutrition', 'Honours Bachelor', 4],
  ['MSc Biology', 'Masters', 2],
  ['MSc Chemistry', 'Masters', 2],
  ['MSc Psychology', 'Masters', 2],
  // Arts & Social Sciences
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA English', 'Honours Bachelor', 4],
  ['BA Philosophy', 'Honours Bachelor', 4],
  ['BA Music', 'Honours Bachelor', 4],
  ['BA French', 'Honours Bachelor', 4],
  ['BA Theology', 'Honours Bachelor', 4],
  ['MA Education', 'Masters', 2],
  ['MA Social and Political Thought', 'Masters', 2],
  // Education
  ['BEd Education', 'Honours Bachelor', 2],
  // Research
  ['PhD Biology', 'PhD', 4],
  ['PhD Chemistry', 'PhD', 4],
  ['PhD Computer Science', 'PhD', 4],
  ['PhD Psychology', 'PhD', 4],
];

// ── Cape Breton University ──────────────────────────────────────────────────
const cbuFees = { phd: null, masters: 16000, gradCert: 12000, advDip: 14000, bachelor: 18000, diploma: 13000, cert: 11000, default: 16000 };
const cbuPrograms = [
  // Business
  ['MBA Global Leadership', 'Masters', 2, 18000],
  ['MSc Community Economic Development', 'Masters', 2],
  ['BBA Business Administration', 'Honours Bachelor', 4],
  ['BBA Accounting', 'Honours Bachelor', 4],
  ['BBA Finance', 'Honours Bachelor', 4],
  ['BBA Marketing', 'Honours Bachelor', 4],
  ['BBA Human Resources', 'Honours Bachelor', 4],
  ['BBA Tourism and Hospitality', 'Honours Bachelor', 4],
  // Engineering
  ['BEng Engineering', 'Honours Bachelor', 4],
  ['BTechnology — Engineering Technology', 'Honours Bachelor', 4],
  // IT
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['Diploma in Computer Information Technology', 'Diploma', 2],
  // Science
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  ['BSc Psychology', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  // Health
  ['BScN Nursing', 'Honours Bachelor', 4],
  ['BSc Kinesiology', 'Honours Bachelor', 4],
  ['MSc Public Health', 'Masters', 2],
  // Arts & Social Sciences
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA English', 'Honours Bachelor', 4],
  ['BA Indigenous Studies', 'Honours Bachelor', 4],
  ['MA Cape Breton Studies', 'Masters', 2],
  // Education
  ['BEd Education', 'Honours Bachelor', 2],
  // Social Work
  ['BSW Social Work', 'Honours Bachelor', 4],
  // Trades
  ['Diploma in Trades and Technology', 'Diploma', 2],
];

// ══════════════════════════════════════════════════════════════════════════════
// SASKATCHEWAN
// ══════════════════════════════════════════════════════════════════════════════

// ── University of Regina ────────────────────────────────────────────────────
const urFees = { phd: 14000, masters: 18000, gradCert: 12000, advDip: 14500, bachelor: 20000, diploma: 13500, cert: 11000, default: 18000 };
const urPrograms = [
  // Business
  ['MBA Business Administration', 'Masters', 2, 20000],
  ['MSc Business (Applied Economics)', 'Masters', 2],
  ['BCom Accounting', 'Honours Bachelor', 4],
  ['BCom Finance', 'Honours Bachelor', 4],
  ['BCom Marketing', 'Honours Bachelor', 4],
  ['BCom Management', 'Honours Bachelor', 4],
  ['BCom Human Resources', 'Honours Bachelor', 4],
  ['BCom International Business', 'Honours Bachelor', 4],
  ['BCom Supply Chain Management', 'Honours Bachelor', 4],
  ['BSc Economics', 'Honours Bachelor', 4],
  // Computer Science & Engineering
  ['MSc Computer Science', 'Masters', 2],
  ['MEng Systems Engineering', 'Masters', 2],
  ['BSc Computer Science', 'Honours Bachelor', 4],
  ['BSc Software Systems Engineering', 'Honours Bachelor', 4],
  ['BEng Industrial Systems Engineering', 'Honours Bachelor', 4],
  ['BEng Electronic Systems Engineering', 'Honours Bachelor', 4],
  ['BEng Environmental Systems Engineering', 'Honours Bachelor', 4],
  ['BEng Process Systems Engineering', 'Honours Bachelor', 4],
  // Science
  ['MSc Biology', 'Masters', 2],
  ['MSc Chemistry', 'Masters', 2],
  ['MSc Physics', 'Masters', 2],
  ['MSc Mathematics', 'Masters', 2],
  ['MSc Statistics', 'Masters', 2],
  ['MSc Environmental Systems Engineering', 'Masters', 2],
  ['BSc Biology', 'Honours Bachelor', 4],
  ['BSc Chemistry', 'Honours Bachelor', 4],
  ['BSc Physics', 'Honours Bachelor', 4],
  ['BSc Mathematics', 'Honours Bachelor', 4],
  ['BSc Statistics', 'Honours Bachelor', 4],
  ['BSc Environmental Science', 'Honours Bachelor', 4],
  ['BSc Geology', 'Honours Bachelor', 4],
  ['BSc Biochemistry', 'Honours Bachelor', 4],
  ['BSc Kinesiology and Health Studies', 'Honours Bachelor', 4],
  // Arts & Social Sciences
  ['MA Psychology', 'Masters', 2],
  ['MA Sociology', 'Masters', 2],
  ['MA Political Studies', 'Masters', 2],
  ['MA History', 'Masters', 2],
  ['MA English', 'Masters', 2],
  ['MA Indigenous Studies', 'Masters', 2],
  ['BA Psychology', 'Honours Bachelor', 4],
  ['BA Sociology', 'Honours Bachelor', 4],
  ['BA Political Science', 'Honours Bachelor', 4],
  ['BA History', 'Honours Bachelor', 4],
  ['BA English', 'Honours Bachelor', 4],
  ['BA Philosophy', 'Honours Bachelor', 4],
  ['BA Indigenous Studies', 'Honours Bachelor', 4],
  ['BA Geography', 'Honours Bachelor', 4],
  ['BA Media, Film, and Communications', 'Honours Bachelor', 4],
  // Health
  ['MSc Health', 'Masters', 2],
  ['MSW Social Work', 'Masters', 2],
  ['BSc Nursing', 'Honours Bachelor', 4],
  ['BSW Social Work', 'Honours Bachelor', 4],
  // Education
  ['MEd Education', 'Masters', 2],
  ['BEd Education', 'Honours Bachelor', 2],
  // Law
  ['Juris Doctor (JD)', 'Masters', 3, 22000],
  ['LLM Law', 'Masters', 1],
  // Fine Arts
  ['BFA Fine Arts', 'Honours Bachelor', 4],
  ['BFA Film Production', 'Honours Bachelor', 4],
  ['BMus Music', 'Honours Bachelor', 4],
  ['MA Visual Arts', 'Masters', 2],
  ['MA Media Studies', 'Masters', 2],
  // Research
  ['PhD Computer Science', 'PhD', 4],
  ['PhD Engineering', 'PhD', 4],
  ['PhD Business', 'PhD', 4],
  ['PhD Psychology', 'PhD', 4],
  ['PhD Chemistry', 'PhD', 4],
  ['PhD Biology', 'PhD', 4],
  ['PhD Education', 'PhD', 4],
  ['PhD Sociology', 'PhD', 4],
];

// ── Saskatchewan Polytechnic ────────────────────────────────────────────────
const saskPolyFees = { phd: null, masters: null, gradCert: 15000, advDip: 15500, bachelor: null, diploma: 14500, cert: 12500, default: 15000 };
const saskPolyPrograms = [
  ['Business Administration', 'Advanced Diploma', 2],
  ['Project Management', 'Graduate Certificate', 1],
  ['Human Resources Management', 'Graduate Certificate', 1],
  ['Supply Chain Management', 'Graduate Certificate', 1],
  ['Digital Marketing', 'Graduate Certificate', 1],
  ['Information Technology', 'Advanced Diploma', 2],
  ['Cybersecurity', 'Graduate Certificate', 1],
  ['Data Analytics', 'Graduate Certificate', 1],
  ['Electrical Engineering Technology', 'Advanced Diploma', 2],
  ['Mechanical Engineering Technology', 'Advanced Diploma', 2],
  ['Civil Engineering Technology', 'Advanced Diploma', 2],
  ['Environmental Engineering Technology', 'Diploma', 2],
  ['Practical Nursing', 'Diploma', 2],
  ['Medical Radiologic Technology', 'Advanced Diploma', 3],
  ['Culinary Arts', 'Diploma', 2],
];

// ── Build all ────────────────────────────────────────────────────────────────
build('windsor',              'University of Windsor',                     'Main Campus',                6.5, ['September', 'January', 'May'],         windsorFees,              windsorPrograms);
build('trent',                'Trent University',                          'Symons Campus',              6.5, ['September', 'January'],                 trentFees,                trentPrograms);
build('conestoga',            'Conestoga College',                         'Doon Campus',                6.0, ['September', 'January', 'May'],           conestogaFees,            conestogaPrograms);
build('humber',               'Humber College',                            'North Campus',               6.0, ['September', 'January'],                 humberFees,               humberPrograms);
build('sheridan',             'Sheridan College',                          'Hazel McCallion Campus',     6.0, ['September', 'January'],                 sheridanFees,             sheridanPrograms);
build('george-brown',         'George Brown College',                      'St. James Campus',           6.0, ['September', 'January'],                 georgeBrownFees,          georgeBrownPrograms);
build('algonquin',            'Algonquin College',                         'Woodroffe Campus',           6.0, ['September', 'January'],                 algonquinFees,            algonquinPrograms);
build('mohawk',               'Mohawk College',                            'Fennell Campus',             6.0, ['September', 'January'],                 mohawkFees,               mohawkPrograms);
build('tru',                  'Thompson Rivers University',                'Kamloops Campus',            6.5, ['September', 'January', 'May'],           truFees,                  truPrograms);
build('unbc',                 'University of Northern BC',                 'Prince George Campus',       6.5, ['September', 'January'],                 unbcFees,                 unbcPrograms);
build('capilano',             'Capilano University',                       'North Vancouver Campus',     6.0, ['September', 'January', 'May'],           capilanoFees,             capilanoPrograms);
build('sait',                 'SAIT',                                      'SAIT Campus',                6.0, ['September', 'January'],                 saitFees,                 saitPrograms);
build('concordia-edmonton',   'Concordia University of Edmonton',          'Edmonton Campus',            6.5, ['September', 'January'],                 concordiaEdmontonFees,    concordiaEdmontonPrograms);
build('acadia',               'Acadia University',                         'Wolfville Campus',           6.5, ['September', 'January'],                 acadiaFees,               acadiaPrograms);
build('cbu',                  'Cape Breton University',                    'Sydney Campus',              6.0, ['September', 'January'],                 cbuFees,                  cbuPrograms);
build('ur',                   'University of Regina',                      'Main Campus',                6.5, ['September', 'January'],                 urFees,                   urPrograms);
build('sask-poly',            'Saskatchewan Polytechnic',                  'Saskatoon Campus',           6.0, ['September', 'January'],                 saskPolyFees,             saskPolyPrograms);

console.log('\n✅ All 17 Canada institutions built.');
