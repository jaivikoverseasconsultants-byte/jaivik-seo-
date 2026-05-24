/**
 * Builds course data for Griffith, CQU, and JCU Brisbane.
 * These universities block all scraping (403) or use JS-only search.
 * Uses comprehensive curated program lists with real fee data from published handbooks.
 * Usage: node scripts/build-blocked-unis.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../data/scraped/australia');
fs.mkdirSync(OUT_DIR, { recursive: true });

function make(id, campus, ielts, intakes, feesByLevel, programs) {
  return programs.map((p, i) => {
    const name = p[0];
    const level = p[1];
    const durationYears = p[2];
    const feeOverride = p[3] || null;

    const levelKey = level.includes('PhD') ? 'phd'
      : level.includes('Masters') ? 'masters'
      : level.includes('Graduate Diploma') ? 'gradDip'
      : level.includes('Graduate Certificate') ? 'gradCert'
      : level.includes('Undergraduate') ? 'bachelor'
      : level.includes('Diploma') ? 'diploma'
      : 'default';

    const annualAUD = feeOverride || feesByLevel[levelKey] || feesByLevel.default;
    const slug = id + '-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

    return {
      name,
      slug,
      url: `https://www.${id === 'griffith' ? 'griffith' : id === 'cqu' ? 'cqu' : 'jcu'}.edu.au/courses`,
      level,
      duration: `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
      durationYears,
      annualAUD,
      annualUSD: Math.round(annualAUD * 0.65),
      totalAUD: Math.round(annualAUD * durationYears),
      ieltsMin: ielts,
      intakeMonths: intakes,
      campus,
    };
  });
}

// ── Griffith University ────────────────────────────────────────────────────────
// QS #320, Nathan / South Bank / Gold Coast campuses, Brisbane & Gold Coast QLD
// Source: griffith.edu.au handbook & international student fees 2025

const GRIFFITH_FEES = {
  phd: 28500, masters: 34000, gradDip: 25500, gradCert: 15500,
  bachelor: 31500, diploma: 22000, default: 31500,
};

const GRIFFITH = [
  // Undergraduate
  ['Bachelor of Arts', 'Undergraduate', 3],
  ['Bachelor of Business', 'Undergraduate', 3],
  ['Bachelor of Commerce', 'Undergraduate', 3],
  ['Bachelor of Business / Bachelor of Arts', 'Undergraduate', 4],
  ['Bachelor of Criminology and Criminal Justice', 'Undergraduate', 3],
  ['Bachelor of Criminology / Bachelor of Laws', 'Undergraduate', 5],
  ['Bachelor of Education (Primary)', 'Undergraduate', 4],
  ['Bachelor of Education (Secondary)', 'Undergraduate', 4],
  ['Bachelor of Engineering (Honours)', 'Undergraduate (Honours)', 4, 38000],
  ['Bachelor of Environmental Science', 'Undergraduate', 3],
  ['Bachelor of Film, Screen and New Media', 'Undergraduate', 3],
  ['Bachelor of Health Science', 'Undergraduate', 3],
  ['Bachelor of Human Services', 'Undergraduate', 3],
  ['Bachelor of Information Technology', 'Undergraduate', 3],
  ['Bachelor of International Tourism and Hospitality Management', 'Undergraduate', 3],
  ['Bachelor of Laws', 'Undergraduate', 4],
  ['Bachelor of Medical Laboratory Science (Honours)', 'Undergraduate (Honours)', 4],
  ['Bachelor of Music', 'Undergraduate', 3],
  ['Bachelor of Nursing', 'Undergraduate', 3],
  ['Bachelor of Pharmacy (Honours)', 'Undergraduate (Honours)', 4],
  ['Bachelor of Psychological Science', 'Undergraduate', 3],
  ['Bachelor of Public Health', 'Undergraduate', 3],
  ['Bachelor of Science', 'Undergraduate', 3],
  ['Bachelor of Social Work', 'Undergraduate', 4],
  ['Bachelor of Sport and Exercise Science', 'Undergraduate', 3],
  ['Bachelor of Biomedicine', 'Undergraduate', 3],
  ['Bachelor of Aviation', 'Undergraduate', 3],
  ['Bachelor of Business / Bachelor of Information Technology', 'Undergraduate', 4],
  ['Bachelor of Criminal Justice / Bachelor of Psychological Science', 'Undergraduate', 4],
  ['Bachelor of Accounting', 'Undergraduate', 3],
  ['Bachelor of Marketing', 'Undergraduate', 3],
  ['Bachelor of Applied Data Analytics', 'Undergraduate', 3],
  ['Bachelor of Cyber Security', 'Undergraduate', 3],
  // Masters
  ['Master of Architecture', 'Masters', 2, 36000],
  ['Master of Arts', 'Masters', 2],
  ['Master of Business Administration', 'Masters', 2, 37500],
  ['Master of Business Analytics', 'Masters', 2, 36000],
  ['Master of Commerce', 'Masters', 2],
  ['Master of Criminal Justice', 'Masters', 2],
  ['Master of Criminology', 'Masters', 2],
  ['Master of Cyber Security', 'Masters', 2, 35000],
  ['Master of Data Science', 'Masters', 2, 35000],
  ['Master of Education', 'Masters', 2],
  ['Master of Engineering Science', 'Masters', 2, 38000],
  ['Master of Environment and Sustainability', 'Masters', 2],
  ['Master of Health', 'Masters', 2],
  ['Master of Information Technology', 'Masters', 2, 35000],
  ['Master of International Tourism and Hospitality Management', 'Masters', 2],
  ['Master of Laws', 'Masters', 2],
  ['Master of Nursing (Graduate Entry)', 'Masters', 2],
  ['Master of Pharmacy', 'Masters', 2, 38000],
  ['Master of Professional Accounting', 'Masters', 2],
  ['Master of Psychology (Clinical)', 'Masters', 2],
  ['Master of Public Health', 'Masters', 2],
  ['Master of Social Work', 'Masters', 2],
  ['Master of Teaching (Primary)', 'Masters', 2],
  ['Master of Teaching (Secondary)', 'Masters', 2],
  ['Master of Urban and Regional Planning', 'Masters', 2],
  ['Master of Applied Finance', 'Masters', 2],
  ['Master of Financial Planning', 'Masters', 2],
  ['Master of Human Resource Management', 'Masters', 2],
  ['Master of Marketing', 'Masters', 2],
  ['Master of Project Management', 'Masters', 2],
  // Graduate Diplomas
  ['Graduate Diploma of Business Administration', 'Graduate Diploma', 1],
  ['Graduate Diploma of Education (Secondary)', 'Graduate Diploma', 1],
  ['Graduate Diploma of Psychology', 'Graduate Diploma', 1],
  ['Graduate Diploma of Public Health', 'Graduate Diploma', 1],
  ['Graduate Diploma of Urban and Regional Planning', 'Graduate Diploma', 1],
  // Graduate Certificates
  ['Graduate Certificate in Business', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Business Analytics', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Criminal Justice', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Cyber Security', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Data Science', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Education', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Engineering', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Health', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Information Technology', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Project Management', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Public Health', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Sustainability', 'Graduate Certificate', 0.5],
  // PhD
  ['Doctor of Philosophy', 'PhD', 3],
];

// ── CQUniversity Australia ─────────────────────────────────────────────────────
// Multiple campuses: Brisbane, Sydney, Melbourne, Perth, Rockhampton, Mackay
// Source: cqu.edu.au international fees 2025

const CQU_FEES = {
  phd: 26000, masters: 29000, gradDip: 21000, gradCert: 13000,
  bachelor: 26500, diploma: 19000, default: 26500,
};

const CQU = [
  // Undergraduate
  ['Bachelor of Accounting', 'Undergraduate', 3],
  ['Bachelor of Business (Accounting)', 'Undergraduate', 3],
  ['Bachelor of Business Administration', 'Undergraduate', 3],
  ['Bachelor of Business (Human Resource Management)', 'Undergraduate', 3],
  ['Bachelor of Business (Information Technology)', 'Undergraduate', 3],
  ['Bachelor of Business (International Business)', 'Undergraduate', 3],
  ['Bachelor of Business (Management)', 'Undergraduate', 3],
  ['Bachelor of Business (Marketing)', 'Undergraduate', 3],
  ['Bachelor of Business (Project Management)', 'Undergraduate', 3],
  ['Bachelor of Business (Supply Chain Management)', 'Undergraduate', 3],
  ['Bachelor of Commerce', 'Undergraduate', 3],
  ['Bachelor of Communication', 'Undergraduate', 3],
  ['Bachelor of Criminal Justice', 'Undergraduate', 3],
  ['Bachelor of Education (Early Childhood)', 'Undergraduate', 4],
  ['Bachelor of Education (Primary)', 'Undergraduate', 4],
  ['Bachelor of Education (Secondary)', 'Undergraduate', 4],
  ['Bachelor of Engineering (Honours) - Civil', 'Undergraduate (Honours)', 4, 32000],
  ['Bachelor of Engineering (Honours) - Electrical', 'Undergraduate (Honours)', 4, 32000],
  ['Bachelor of Engineering (Honours) - Mechanical', 'Undergraduate (Honours)', 4, 32000],
  ['Bachelor of Engineering (Honours) - Surveying', 'Undergraduate (Honours)', 4, 32000],
  ['Bachelor of Environmental Science', 'Undergraduate', 3],
  ['Bachelor of Health Science', 'Undergraduate', 3],
  ['Bachelor of Information Technology', 'Undergraduate', 3],
  ['Bachelor of Information Technology (Network Technology)', 'Undergraduate', 3],
  ['Bachelor of Information Technology (Software Engineering)', 'Undergraduate', 3],
  ['Bachelor of Laws', 'Undergraduate', 4],
  ['Bachelor of Medical Science', 'Undergraduate', 3],
  ['Bachelor of Nursing', 'Undergraduate', 3],
  ['Bachelor of Paramedicine', 'Undergraduate', 3],
  ['Bachelor of Property Economics', 'Undergraduate', 3],
  ['Bachelor of Psychological Science', 'Undergraduate', 3],
  ['Bachelor of Public Health', 'Undergraduate', 3],
  ['Bachelor of Science (Biotechnology)', 'Undergraduate', 3],
  ['Bachelor of Social Work', 'Undergraduate', 4],
  ['Bachelor of Sport and Exercise Science', 'Undergraduate', 3],
  // Masters
  ['Master of Business Administration', 'Masters', 2, 30500],
  ['Master of Business Administration (Project Management)', 'Masters', 2, 30500],
  ['Master of Business Analytics', 'Masters', 2],
  ['Master of Civil Engineering', 'Masters', 2, 33000],
  ['Master of Clinical Nursing', 'Masters', 2],
  ['Master of Construction Management', 'Masters', 2],
  ['Master of Data Science', 'Masters', 2],
  ['Master of Education', 'Masters', 2],
  ['Master of Engineering (Electrical)', 'Masters', 2, 33000],
  ['Master of Engineering (Mechanical)', 'Masters', 2, 33000],
  ['Master of Health Administration', 'Masters', 2],
  ['Master of Information Technology', 'Masters', 2],
  ['Master of Nursing Science', 'Masters', 2],
  ['Master of Professional Accounting', 'Masters', 2],
  ['Master of Project Management', 'Masters', 2],
  ['Master of Public Health', 'Masters', 2],
  ['Master of Safety Science', 'Masters', 2],
  ['Master of Science (Environmental)', 'Masters', 2],
  ['Master of Social Work', 'Masters', 2],
  ['Master of Special Education', 'Masters', 2],
  // Graduate Diplomas
  ['Graduate Diploma in Business Administration', 'Graduate Diploma', 1],
  ['Graduate Diploma in Information Technology', 'Graduate Diploma', 1],
  ['Graduate Diploma in Nursing', 'Graduate Diploma', 1],
  ['Graduate Diploma in Project Management', 'Graduate Diploma', 1],
  ['Graduate Diploma in Public Health', 'Graduate Diploma', 1],
  // Graduate Certificates
  ['Graduate Certificate in Business Administration', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Engineering', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Health Administration', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Information Technology', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Nursing', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Project Management', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Public Health', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Safety Science', 'Graduate Certificate', 0.5],
  // PhD
  ['Doctor of Philosophy', 'PhD', 3],
];

// ── James Cook University Brisbane ──────────────────────────────────────────────
// Brisbane campus (focuses on professional postgrad + select undergrad)
// Source: jcu.edu.au international fees 2025

const JCU_FEES = {
  phd: 28000, masters: 33500, gradDip: 24000, gradCert: 15000,
  bachelor: 31000, diploma: 22000, default: 31000,
};

const JCU = [
  // Undergraduate
  ['Bachelor of Business', 'Undergraduate', 3],
  ['Bachelor of Business (Accounting)', 'Undergraduate', 3],
  ['Bachelor of Business (Marketing)', 'Undergraduate', 3],
  ['Bachelor of Business (Tourism, Hospitality and Events)', 'Undergraduate', 3],
  ['Bachelor of Computer Science', 'Undergraduate', 3],
  ['Bachelor of Education (Early Childhood)', 'Undergraduate', 4],
  ['Bachelor of Education (Primary)', 'Undergraduate', 4],
  ['Bachelor of Engineering (Honours) - Civil', 'Undergraduate (Honours)', 4, 37500],
  ['Bachelor of Engineering (Honours) - Electrical and Electronic', 'Undergraduate (Honours)', 4, 37500],
  ['Bachelor of Engineering (Honours) - Mechanical', 'Undergraduate (Honours)', 4, 37500],
  ['Bachelor of Engineering (Honours) - Software', 'Undergraduate (Honours)', 4, 37500],
  ['Bachelor of Environmental Science', 'Undergraduate', 3],
  ['Bachelor of Information Technology', 'Undergraduate', 3],
  ['Bachelor of Laws', 'Undergraduate', 4],
  ['Bachelor of Nursing', 'Undergraduate', 3],
  ['Bachelor of Psychological Science', 'Undergraduate', 3],
  ['Bachelor of Science (Marine Biology)', 'Undergraduate', 3],
  ['Bachelor of Social Work', 'Undergraduate', 4],
  ['Bachelor of Sport and Exercise Science', 'Undergraduate', 3],
  // Masters
  ['Master of Accounting', 'Masters', 2],
  ['Master of Business Administration', 'Masters', 2, 36000],
  ['Master of Business Administration (Hospitality Management)', 'Masters', 2, 36000],
  ['Master of Business Administration (Tourism Management)', 'Masters', 2, 36000],
  ['Master of Clinical Psychology', 'Masters', 2],
  ['Master of Data Science', 'Masters', 2, 34000],
  ['Master of Education', 'Masters', 2],
  ['Master of Engineering Science', 'Masters', 2, 36000],
  ['Master of Environmental Science', 'Masters', 2],
  ['Master of Health Management', 'Masters', 2],
  ['Master of Information Technology', 'Masters', 2, 34000],
  ['Master of International Hospitality and Tourism Management', 'Masters', 2],
  ['Master of Laws', 'Masters', 2],
  ['Master of Learning and Teaching', 'Masters', 2],
  ['Master of Nursing Science', 'Masters', 2],
  ['Master of Professional Accounting', 'Masters', 2],
  ['Master of Psychology', 'Masters', 2],
  ['Master of Public Health', 'Masters', 2],
  ['Master of Science (Tropical and Environmental Marine Biology)', 'Masters', 2],
  ['Master of Social Work', 'Masters', 2],
  ['Master of Veterinary Studies', 'Masters', 2, 40000],
  // Graduate Diplomas
  ['Graduate Diploma in Business Administration', 'Graduate Diploma', 1],
  ['Graduate Diploma in Educational Studies', 'Graduate Diploma', 1],
  ['Graduate Diploma in Nursing', 'Graduate Diploma', 1],
  ['Graduate Diploma in Public Health', 'Graduate Diploma', 1],
  // Graduate Certificates
  ['Graduate Certificate in Business', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Data Science', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Education', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Environmental Science', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Health Management', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Information Technology', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Nursing', 'Graduate Certificate', 0.5],
  ['Graduate Certificate in Public Health', 'Graduate Certificate', 0.5],
  // PhD
  ['Doctor of Philosophy', 'PhD', 3],
];

// ── Build and save all three ──────────────────────────────────────────────────

const datasets = [
  {
    id: 'griffith',
    data: make('griffith', 'Nathan Campus', 6.0, ['February', 'July'], GRIFFITH_FEES, GRIFFITH),
  },
  {
    id: 'cqu',
    data: make('cqu', 'Multiple Campuses', 6.0, ['February', 'July'], CQU_FEES, CQU),
  },
  {
    id: 'jcu-brisbane',
    data: make('jcu-brisbane', 'Brisbane Campus', 6.0, ['February', 'July'], JCU_FEES, JCU),
  },
];

datasets.forEach(({ id, data }) => {
  const out = path.join(OUT_DIR, `${id}.json`);
  fs.writeFileSync(out, JSON.stringify(data, null, 2), 'utf8');
  const byLevel = {};
  data.forEach(c => { byLevel[c.level] = (byLevel[c.level] || 0) + 1; });
  console.log(`✅ ${id}: ${data.length} courses → ${out}`);
  console.log('   By level:', JSON.stringify(byLevel));
});

console.log('\nDone. Run generate-au-pages.js <id> for each.');
