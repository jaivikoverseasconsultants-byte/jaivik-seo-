/**
 * Curated course data for UK universities that block scraping
 * (Manchester, Brunel, Hertfordshire).
 * Run: node scripts/build-blocked-uk-unis.js
 */

const fs = require('fs');
const path = require('path');
const OUT_DIR = path.join(__dirname, '../data/scraped/uk');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function make(id, campus, ielts, intakes, feesByLevel, programs) {
  return programs.map((p, i) => {
    const [name, level, durationYears, feeOverride] = p;
    const feeKey = level === 'PhD' ? 'phd'
      : /masters|master/i.test(level) ? 'masters'
      : /graduate diploma/i.test(level) ? 'gradDip'
      : /graduate certificate/i.test(level) ? 'gradCert'
      : /undergraduate/i.test(level) ? 'bachelor'
      : /diploma/i.test(level) ? 'diploma'
      : 'default';
    const annualGBP = feeOverride || feesByLevel[feeKey] || feesByLevel.default;
    const annualUSD = Math.round(annualGBP * 1.27);
    const dur = durationYears === 0.5 ? '6 months' : `${durationYears} year${durationYears !== 1 ? 's' : ''}`;
    return {
      name, level,
      slug: `${id}-${slugify(name)}`,
      url: `https://www.${id === 'manchester' ? 'manchester' : id === 'brunel' ? 'brunel' : 'herts'}.ac.uk/`,
      duration: dur, durationYears,
      annualGBP, annualUSD,
      totalGBP: Math.round(annualGBP * durationYears),
      ieltsMin: ielts,
      intakeMonths: intakes,
      campus,
      currency: 'GBP',
    };
  });
}

// ── University of Manchester ────────────────────────────────────────────────
const manchesterFees = { phd: 16000, masters: 26000, gradDip: 19000, gradCert: 13000, bachelor: 21000, diploma: 15000, default: 24000 };
const manchesterPrograms = [
  // Business & Management
  ['Master of Business Administration (MBA)', 'Masters', 1, 33000],
  ['MSc Management', 'Masters', 1],
  ['MSc Finance', 'Masters', 1],
  ['MSc Accounting', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  ['MSc International Business', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['MSc Digital Marketing', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  // Computer Science & IT
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Advanced Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Software Engineering', 'Masters', 1],
  ['MSc Data Engineering', 'Masters', 1],
  // Engineering
  ['MSc Electrical and Electronic Engineering', 'Masters', 1],
  ['MSc Mechanical Engineering Design', 'Masters', 1],
  ['MSc Chemical Engineering', 'Masters', 1],
  ['MSc Civil Engineering', 'Masters', 1],
  ['MSc Aerospace Engineering', 'Masters', 1],
  ['MEng Electrical and Electronic Engineering', 'Undergraduate (Honours)', 4, 21000],
  ['BEng Mechanical Engineering', 'Undergraduate', 3, 21000],
  ['BSc Computer Science', 'Undergraduate', 3, 21000],
  // Health Sciences
  ['MSc Public Health', 'Masters', 1],
  ['MSc Nursing (Advanced Practice)', 'Masters', 1],
  ['MSc Global Health', 'Masters', 1],
  ['MSc Nutrition and Dietetics', 'Masters', 1],
  // Law
  ['LLM International Law', 'Masters', 1, 25000],
  ['LLM Corporate Law', 'Masters', 1, 25000],
  ['LLB Law', 'Undergraduate', 3, 21000],
  // Social Sciences
  ['MSc Economics', 'Masters', 1],
  ['MA Education', 'Masters', 1],
  ['MSc Psychology', 'Masters', 1],
  ['MA Social Work', 'Masters', 2],
  ['MA Linguistics', 'Masters', 1],
  // Natural Sciences
  ['MSc Chemistry', 'Masters', 1],
  ['MSc Physics', 'Masters', 1],
  ['MSc Biotechnology', 'Masters', 1],
  ['MSc Environmental Science', 'Masters', 1],
  ['BSc Biomedical Sciences', 'Undergraduate', 3, 21000],
  // Arts & Humanities
  ['MA Art History', 'Masters', 1],
  ['MA Media and Cultural Studies', 'Masters', 1],
  ['MA Creative Writing', 'Masters', 1],
  // Research
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business and Management', 'PhD', 3],
  ['PhD Biomedical Sciences', 'PhD', 3],
];

// ── Brunel University London ────────────────────────────────────────────────
const brunelFees = { phd: 14500, masters: 20000, gradDip: 16000, gradCert: 10000, bachelor: 19000, diploma: 13000, default: 18000 };
const brunelPrograms = [
  // Engineering
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Electronic and Electrical Engineering', 'Undergraduate', 3],
  ['BEng Chemical Engineering', 'Undergraduate', 3],
  ['BEng Aerospace Engineering', 'Undergraduate', 3],
  ['BEng Computer Science', 'Undergraduate', 3],
  ['MEng Mechanical Engineering', 'Undergraduate (Honours)', 4],
  ['MEng Civil Engineering', 'Undergraduate (Honours)', 4],
  ['MSc Advanced Mechanical Engineering', 'Masters', 1],
  ['MSc Advanced Engineering Management', 'Masters', 1],
  ['MSc Structural Engineering with Management', 'Masters', 1],
  ['MSc Electronic and Electrical Engineering', 'Masters', 1],
  ['MSc Aerospace Engineering', 'Masters', 1],
  // Business
  ['BSc Business and Management', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc Economics and Finance', 'Undergraduate', 3],
  ['MSc Finance and Accounting', 'Masters', 1],
  ['MSc International Business', 'Masters', 1],
  ['MSc Marketing Management', 'Masters', 1],
  ['MBA Master of Business Administration', 'Masters', 1, 24000],
  // Computing
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Cyber Security', 'Undergraduate', 3],
  ['BSc Data Science and Analytics', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Data Science and Analytics', 'Masters', 1],
  // Design
  ['BA Design', 'Undergraduate', 3],
  ['BA Industrial Design and Technology', 'Undergraduate', 3],
  ['MA Design Strategy and Innovation', 'Masters', 1],
  ['MA Digital Media', 'Masters', 1],
  // Health
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['MSc Advanced Clinical Practice', 'Masters', 1],
  ['MSc Public Health', 'Masters', 1],
  // Law & Social Sciences
  ['LLB Law', 'Undergraduate', 3],
  ['LLM International Law', 'Masters', 1],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Psychology', 'Masters', 1],
  ['BSc Sport Sciences', 'Undergraduate', 3],
  // Research
  ['PhD Engineering', 'PhD', 3],
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

// ── University of Hertfordshire ─────────────────────────────────────────────
const hertsFees = { phd: 12000, masters: 14500, gradDip: 11500, gradCert: 7500, bachelor: 13500, diploma: 10000, default: 13500 };
const hertsPrograms = [
  // Computing & IT
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cyber Security', 'Undergraduate', 3],
  ['BSc Data Science', 'Undergraduate', 3],
  ['BSc Artificial Intelligence', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Cybersecurity and Digital Forensics', 'Masters', 1],
  ['MSc IT Management', 'Masters', 1],
  // Engineering
  ['BEng Aerospace Engineering', 'Undergraduate', 3],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Electronic Engineering', 'Undergraduate', 3],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Automotive Engineering', 'Undergraduate', 3],
  ['MSc Aerospace Engineering', 'Masters', 1],
  ['MSc Advanced Mechanical Engineering', 'Masters', 1],
  // Business
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 17500],
  ['MSc International Management', 'Masters', 1],
  ['MSc Finance and Accounting', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  // Health
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Pharmacy', 'Undergraduate', 4],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['BSc Paramedic Science', 'Undergraduate', 3],
  ['MSc Advanced Clinical Practice', 'Masters', 1],
  ['MSc Pharmaceutical Sciences', 'Masters', 1],
  // Social Sciences & Humanities
  ['BSc Psychology', 'Undergraduate', 3],
  ['BA Law', 'Undergraduate', 3],
  ['BA Criminology', 'Undergraduate', 3],
  ['BA Education Studies', 'Undergraduate', 3],
  ['MSc Psychology', 'Masters', 1],
  ['LLM Law', 'Masters', 1],
  // Creative Arts
  ['BA Animation', 'Undergraduate', 3],
  ['BA Graphic Design', 'Undergraduate', 3],
  ['BA Film and Television Production', 'Undergraduate', 3],
  ['MA Animation', 'Masters', 1],
  // Research
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

function build(id, name, website, campus, ielts, intakes, feesByLevel, programs) {
  const data = make(id, campus, ielts, intakes, feesByLevel, programs);
  const outFile = path.join(OUT_DIR, `${id}.json`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
  const byLevel = {};
  data.forEach(c => { byLevel[c.level] = (byLevel[c.level] || 0) + 1; });
  console.log(`✅ ${name}: ${data.length} courses → ${outFile}`);
  console.log('   By level:', byLevel);
}

// ── University of Birmingham ────────────────────────────────────────────────
const birminghamFees = { phd: 15500, masters: 25000, gradDip: 18000, gradCert: 12500, bachelor: 20000, diploma: 14000, default: 22000 };
const birminghamPrograms = [
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Software Engineering', 'Masters', 1],
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BEng Electronic Engineering', 'Undergraduate', 3],
  ['MEng Mechanical Engineering', 'Undergraduate (Honours)', 4],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['MSc Advanced Chemical Engineering', 'Masters', 1],
  ['MBA Master of Business Administration', 'Masters', 1, 30000],
  ['MSc International Business', 'Masters', 1],
  ['MSc Finance', 'Masters', 1],
  ['MSc Accounting and Finance', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['BSc Business Management', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc Economics', 'Undergraduate', 3],
  ['MSc Economics', 'Masters', 1],
  ['LLM International Law', 'Masters', 1],
  ['LLM Commercial Law', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['MSc Global Health', 'Masters', 1],
  ['MSc Nursing (Advanced Practice)', 'Masters', 1],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['MSc Biosciences', 'Masters', 1],
  ['MSc Chemistry', 'Masters', 1],
  ['MSc Physics', 'Masters', 1],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Psychology', 'Masters', 1],
  ['MA Education', 'Masters', 1],
  ['MA English Literature', 'Masters', 1],
  ['MA Social Policy', 'Masters', 1],
  ['MSc Environmental Management', 'Masters', 1],
  ['MEng Chemical Engineering', 'Undergraduate (Honours)', 4],
  ['MSc Project Management', 'Masters', 1],
  ['MSc Construction Management', 'Masters', 1],
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
  ['PhD Biomedical Sciences', 'PhD', 3],
  ['PhD Law', 'PhD', 3],
];

// ── University of Leeds ─────────────────────────────────────────────────────
const leedsFees = { phd: 15000, masters: 26000, gradDip: 19000, gradCert: 13000, bachelor: 19000, diploma: 14000, default: 22000 };
const leedsPrograms = [
  ['MSc Data Science and Analytics', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['MEng Mechanical Engineering', 'Undergraduate (Honours)', 4],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['MEng Civil Engineering', 'Undergraduate (Honours)', 4],
  ['BEng Electrical and Electronic Engineering', 'Undergraduate', 3],
  ['MSc Structural Engineering', 'Masters', 1],
  ['MSc Advanced Mechanical Engineering', 'Masters', 1],
  ['MBA Master of Business Administration', 'Masters', 1, 31000],
  ['MSc International Business', 'Masters', 1],
  ['MSc Finance', 'Masters', 1],
  ['MSc Accounting and Finance', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  ['MSc Supply Chain Management', 'Masters', 1],
  ['BSc Business Management', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc Economics', 'Undergraduate', 3],
  ['MSc Economics', 'Masters', 1],
  ['LLM International Law', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['MSc Global Health', 'Masters', 1],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['MSc Biosciences', 'Masters', 1],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Psychology', 'Masters', 1],
  ['MA Education', 'Masters', 1],
  ['MA TESOL', 'Masters', 1],
  ['MSc Environmental Management', 'Masters', 1],
  ['MSc Sustainability', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['MA Media and Communications', 'Masters', 1],
  ['MA Translation Studies', 'Masters', 1],
  ['MSc Chemistry', 'Masters', 1],
  ['MSc Physics', 'Masters', 1],
  ['MSc Food Science', 'Masters', 1],
  ['MSc Textile Engineering', 'Masters', 1],
  ['MSc Healthcare Management', 'Masters', 1],
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
  ['PhD Biomedical Sciences', 'PhD', 3],
];

// ── Coventry University ─────────────────────────────────────────────────────
const coventryFees = { phd: 13000, masters: 15500, gradDip: 12500, gradCert: 8500, bachelor: 15000, diploma: 11000, default: 14500 };
const coventryPrograms = [
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cybersecurity', 'Undergraduate', 3],
  ['BSc Data Science', 'Undergraduate', 3],
  ['BSc Artificial Intelligence', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Data Science and Computational Intelligence', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc IT Management', 'Masters', 1],
  ['BEng Automotive Engineering', 'Undergraduate', 3],
  ['BEng Aerospace Engineering', 'Undergraduate', 3],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Electrical Engineering', 'Undergraduate', 3],
  ['MSc Mechanical Engineering', 'Masters', 1],
  ['MSc Aerospace Engineering', 'Masters', 1],
  ['MSc Construction Project Management', 'Masters', 1],
  ['MSc Structural Engineering', 'Masters', 1],
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['BSc Business Economics', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 18000],
  ['MSc International Business Management', 'Masters', 1],
  ['MSc Finance and Investment', 'Masters', 1],
  ['MSc Marketing Management', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Paramedic Science', 'Undergraduate', 3],
  ['BSc Midwifery', 'Undergraduate', 3],
  ['BSc Physiotherapy', 'Undergraduate', 3],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['MSc Health and Social Care Management', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['LLM International Commercial Law', 'Masters', 1],
  ['BA Criminology', 'Undergraduate', 3],
  ['BA English', 'Undergraduate', 3],
  ['MSc Architecture', 'Masters', 1],
  ['BA Interior Design', 'Undergraduate', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
  ['PhD Computing', 'PhD', 3],
];

// ── University of Portsmouth ────────────────────────────────────────────────
const portsmouthFees = { phd: 13000, masters: 16000, gradDip: 13000, gradCert: 8500, bachelor: 15000, diploma: 11000, default: 15000 };
const portsmouthPrograms = [
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cybersecurity', 'Undergraduate', 3],
  ['BSc Data Science', 'Undergraduate', 3],
  ['BSc Artificial Intelligence', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Software Engineering', 'Masters', 1],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Electrical Engineering', 'Undergraduate', 3],
  ['BEng Aerospace Engineering', 'Undergraduate', 3],
  ['MSc Civil Engineering', 'Masters', 1],
  ['MSc Mechanical Engineering', 'Masters', 1],
  ['MSc Structural Engineering', 'Masters', 1],
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['BSc Economics', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 19000],
  ['MSc International Business Management', 'Masters', 1],
  ['MSc Finance and Accounting', 'Masters', 1],
  ['MSc Marketing Management', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Midwifery', 'Undergraduate', 3],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['MSc Healthcare Management', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['LLM International Law', 'Masters', 1],
  ['BA Criminology', 'Undergraduate', 3],
  ['BSc Sport and Exercise Science', 'Undergraduate', 3],
  ['BA Journalism', 'Undergraduate', 3],
  ['BSc Environmental Science', 'Undergraduate', 3],
  ['MSc Environmental Management', 'Masters', 1],
  ['PhD Computing', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

// ── De Montfort University ──────────────────────────────────────────────────
const dmuFees = { phd: 12500, masters: 15000, gradDip: 12000, gradCert: 8000, bachelor: 14500, diploma: 10500, default: 14000 };
const dmuPrograms = [
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cybersecurity', 'Undergraduate', 3],
  ['BSc Data Science', 'Undergraduate', 3],
  ['BSc Artificial Intelligence and Robotics', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Data Analytics', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['MSc Software Engineering', 'Masters', 1],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Electrical and Electronic Engineering', 'Undergraduate', 3],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Aerospace Technology', 'Undergraduate', 3],
  ['MSc Engineering Management', 'Masters', 1],
  ['MSc Mechanical Engineering', 'Masters', 1],
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 18000],
  ['MSc International Business', 'Masters', 1],
  ['MSc Finance and Investment', 'Masters', 1],
  ['MSc Marketing', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['LLM International Law', 'Masters', 1],
  ['BA Criminology', 'Undergraduate', 3],
  ['BA Fashion Design', 'Undergraduate', 3],
  ['BA Graphic Design', 'Undergraduate', 3],
  ['MA Fashion Design', 'Masters', 1],
  ['BSc Architecture', 'Undergraduate', 3],
  ['MSc Architecture (ARB/RIBA Part 2)', 'Masters', 2],
  ['PhD Computing', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

// ── Nottingham Trent University ─────────────────────────────────────────────
const ntuFees = { phd: 13000, masters: 16000, gradDip: 13000, gradCert: 8500, bachelor: 15500, diploma: 11000, default: 15000 };
const ntuPrograms = [
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cybersecurity', 'Undergraduate', 3],
  ['BSc Data Science', 'Undergraduate', 3],
  ['BSc Games Technology', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['BEng Mechanical Engineering', 'Undergraduate', 3],
  ['BEng Civil Engineering', 'Undergraduate', 3],
  ['BEng Electrical and Electronic Engineering', 'Undergraduate', 3],
  ['BEng Architecture Engineering', 'Undergraduate', 3],
  ['MSc Construction Management', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['BSc Fashion Management', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 19500],
  ['MSc International Business Management', 'Masters', 1],
  ['MSc Finance and Investment', 'Masters', 1],
  ['MSc Marketing Management', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Paramedic Science', 'Undergraduate', 3],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['LLM International Law', 'Masters', 1],
  ['BA Criminology', 'Undergraduate', 3],
  ['BA Fashion Design', 'Undergraduate', 3],
  ['BA Graphic Design', 'Undergraduate', 3],
  ['BA Fine Art', 'Undergraduate', 3],
  ['MA Fashion Design', 'Masters', 1],
  ['MA Architecture', 'Masters', 2],
  ['PhD Computer Science', 'PhD', 3],
  ['PhD Engineering', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

// ── University of West London ───────────────────────────────────────────────
const uwlFees = { phd: 12000, masters: 14000, gradDip: 11000, gradCert: 7500, bachelor: 13500, diploma: 10000, default: 13000 };
const uwlPrograms = [
  ['BSc Computer Science', 'Undergraduate', 3],
  ['BSc Software Engineering', 'Undergraduate', 3],
  ['BSc Cybersecurity', 'Undergraduate', 3],
  ['BSc Data Science and Analytics', 'Undergraduate', 3],
  ['MSc Computer Science', 'Masters', 1],
  ['MSc Cybersecurity', 'Masters', 1],
  ['MSc Data Science', 'Masters', 1],
  ['MSc Artificial Intelligence', 'Masters', 1],
  ['BEng Electrical Engineering', 'Undergraduate', 3],
  ['BSc Business Administration', 'Undergraduate', 3],
  ['BSc Accounting and Finance', 'Undergraduate', 3],
  ['BSc International Business', 'Undergraduate', 3],
  ['BSc Marketing', 'Undergraduate', 3],
  ['BSc Hospitality Management', 'Undergraduate', 3],
  ['BSc Aviation Management', 'Undergraduate', 3],
  ['MBA Master of Business Administration', 'Masters', 1, 17000],
  ['MSc International Business Management', 'Masters', 1],
  ['MSc Finance and Accounting', 'Masters', 1],
  ['MSc Marketing Management', 'Masters', 1],
  ['MSc Project Management', 'Masters', 1],
  ['MSc Human Resource Management', 'Masters', 1],
  ['BSc Nursing', 'Undergraduate', 3],
  ['BSc Midwifery', 'Undergraduate', 3],
  ['BSc Biomedical Sciences', 'Undergraduate', 3],
  ['BSc Psychology', 'Undergraduate', 3],
  ['MSc Public Health', 'Masters', 1],
  ['MSc Healthcare Management', 'Masters', 1],
  ['LLB Law', 'Undergraduate', 3],
  ['BA Criminology', 'Undergraduate', 3],
  ['BA Music Production', 'Undergraduate', 3],
  ['BA Film Production', 'Undergraduate', 3],
  ['BSc Sport and Exercise Science', 'Undergraduate', 3],
  ['MSc Sports Management', 'Masters', 1],
  ['BA Performing Arts', 'Undergraduate', 3],
  ['PhD Computing', 'PhD', 3],
  ['PhD Business', 'PhD', 3],
];

build('manchester', 'University of Manchester', 'https://www.manchester.ac.uk', 'Oxford Road Campus', 6.5, ['September'], manchesterFees, manchesterPrograms);
build('brunel', 'Brunel University London', 'https://www.brunel.ac.uk', 'Uxbridge Campus', 6.0, ['September'], brunelFees, brunelPrograms);
build('hertfordshire', 'University of Hertfordshire', 'https://www.herts.ac.uk', 'de Havilland Campus', 6.0, ['September', 'January'], hertsFees, hertsPrograms);
build('birmingham', 'University of Birmingham', 'https://www.birmingham.ac.uk', 'Edgbaston Campus', 6.5, ['September', 'January'], birminghamFees, birminghamPrograms);
build('leeds', 'University of Leeds', 'https://www.leeds.ac.uk', 'University of Leeds Campus', 6.5, ['September'], leedsFees, leedsPrograms);
build('coventry', 'Coventry University', 'https://www.coventry.ac.uk', 'City of Coventry Campus', 6.0, ['September', 'January'], coventryFees, coventryPrograms);
build('portsmouth', 'University of Portsmouth', 'https://www.port.ac.uk', 'Guildhall Campus', 6.0, ['September', 'January'], portsmouthFees, portsmouthPrograms);
build('demontfort', 'De Montfort University', 'https://www.dmu.ac.uk', 'Leicester Campus', 6.0, ['September', 'January'], dmuFees, dmuPrograms);
build('nottinghamtrent', 'Nottingham Trent University', 'https://www.ntu.ac.uk', 'City Campus', 6.0, ['September', 'January'], ntuFees, ntuPrograms);
build('westlondon', 'University of West London', 'https://www.uwl.ac.uk', 'Ealing Campus', 6.0, ['September', 'January'], uwlFees, uwlPrograms);

console.log('\n✅ All curated UK universities built.');
