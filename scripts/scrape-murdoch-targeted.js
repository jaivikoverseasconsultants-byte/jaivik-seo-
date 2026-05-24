/**
 * Murdoch University targeted scraper.
 * All course URLs collected manually from study-area pages (sitemaps return 403).
 * Usage: node scripts/scrape-murdoch-targeted.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../data/scraped/australia/murdoch.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ax = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
    'Accept-Language': 'en-AU,en;q=0.9',
  },
});

// All course URLs collected from Murdoch study-area pages
const COURSE_URLS = [
  // Business & Management
  'https://www.murdoch.edu.au/course/undergraduate/b1367',   // Bachelor of Business
  'https://www.murdoch.edu.au/course/postgraduate/m1267',    // Master of Health Administration, Policy and Leadership
  'https://www.murdoch.edu.au/course/postgraduate/c1136',    // Grad Cert Health Administration
  // IT
  'https://www.murdoch.edu.au/course/undergraduate/b1420',   // Bachelor of Data Analytics
  'https://www.murdoch.edu.au/course/undergraduate/b1390',   // Bachelor of Information Technology
  'https://www.murdoch.edu.au/course/postgraduate/m1294',    // Master of Science in IT
  // Engineering & Energy
  'https://www.murdoch.edu.au/course/honours/h1287',         // Bachelor of Engineering Honours
  'https://www.murdoch.edu.au/course/postgraduate/m1330',    // Master of Engineering Practice
  'https://www.murdoch.edu.au/course/postgraduate/m1268',    // Master of Renewable & Sustainable Energy
  // Law
  'https://www.murdoch.edu.au/course/undergraduate/b1395',   // Bachelor of Laws
  'https://www.murdoch.edu.au/course/undergraduate/b1340',   // Bachelor of Laws Graduate Entry
  'https://www.murdoch.edu.au/course/undergraduate/b1346',   // Bachelor of Laws / Criminology
  // Psychology
  'https://www.murdoch.edu.au/course/undergraduate/b1413',   // Bachelor of Psychology
  'https://www.murdoch.edu.au/course/postgraduate/g1096',    // Grad Dip Psychology (Advanced)
  'https://www.murdoch.edu.au/course/postgraduate/m1238',    // Master of Applied Psychology
  // Nursing & Health
  'https://www.murdoch.edu.au/course/undergraduate/b1417',   // Bachelor of Nursing
  'https://www.murdoch.edu.au/course/postgraduate/m1358',    // Master of Health Care Management
  // Education
  'https://www.murdoch.edu.au/course/undergraduate/b1404',   // Bachelor of Education (Primary)
  'https://www.murdoch.edu.au/course/postgraduate/m1391',    // Master of Teaching (Secondary)
  'https://www.murdoch.edu.au/course/postgraduate/m1390',    // Master of Teaching (Primary)
  // Criminology
  'https://www.murdoch.edu.au/course/undergraduate/b1345',   // Bachelor of Criminology
  'https://www.murdoch.edu.au/course/undergraduate/b1416',   // Bachelor of Psychology / Criminology
  'https://www.murdoch.edu.au/course/postgraduate/m1314',    // Master of Criminology
  // Allied Health
  'https://www.murdoch.edu.au/course/undergraduate/b1348',   // Bachelor of Sport and Exercise Science
  'https://www.murdoch.edu.au/course/undergraduate/b1422',   // Bachelor of Health Science / Master of Clinical Chiropractic
  'https://www.murdoch.edu.au/course/postgraduate/m1325',    // Master of Clinical Exercise Physiology
  'https://www.murdoch.edu.au/course/postgraduate/m1143',    // Master of Counselling
  'https://www.murdoch.edu.au/course/postgraduate/m1300',    // Master of Creative Arts Therapies
  // Medical & Science
  'https://www.murdoch.edu.au/course/undergraduate/b1419',   // Bachelor of Biomedical Science
  'https://www.murdoch.edu.au/course/undergraduate/b1418',   // Bachelor of Forensic Science
  'https://www.murdoch.edu.au/course/postgraduate/m1371',    // Master of Food Science
  // Media & Communication
  'https://www.murdoch.edu.au/course/undergraduate/b1342',   // Bachelor of Communication
  'https://www.murdoch.edu.au/course/undergraduate/b1343',   // Bachelor of Creative Media
  'https://www.murdoch.edu.au/course/postgraduate/m1277',    // Master of Communication
  // Humanities, Arts & Social Sciences
  'https://www.murdoch.edu.au/course/undergraduate/b1363',   // Bachelor of Global Security
  'https://www.murdoch.edu.au/course/undergraduate/b1356',   // Bachelor of Arts
  'https://www.murdoch.edu.au/course/postgraduate/m1214',    // Master of Sustainable Development
  // Environmental Science
  'https://www.murdoch.edu.au/course/undergraduate/b1399',   // Bachelor of Environmental Science
  'https://www.murdoch.edu.au/course/postgraduate/c1118',    // Grad Cert Environmental Assessment
  'https://www.murdoch.edu.au/course/postgraduate/m1210',    // Master of Environmental Science
  // Agricultural Science
  'https://www.murdoch.edu.au/course/undergraduate/b1391',   // Bachelor of Agricultural Science
  'https://www.murdoch.edu.au/course/postgraduate/m1248',    // Master of Biosecurity
  'https://www.murdoch.edu.au/course/m1311',                 // Master of Food Security
  // Physical Sciences
  'https://www.murdoch.edu.au/course/undergraduate/b1410',   // Bachelor of Science (Mathematical)
  'https://www.murdoch.edu.au/course/undergraduate/b1411',   // Bachelor of Science (Physical)
  'https://www.murdoch.edu.au/course/postgraduate/g1034',    // Grad Dip Extractive Metallurgy
  // Veterinary Science
  'https://www.murdoch.edu.au/course/undergraduate/b1402',   // Bachelor of Science / Doctor of Vet Medicine
  'https://www.murdoch.edu.au/course/postgraduate/c1145',    // Grad Cert One Health
  'https://www.murdoch.edu.au/course/research/d1061',        // Doctor of Veterinary Medical Science
];

function inferLevel(name, url) {
  const n = name.toLowerCase();
  if (/url.*research|doctor of vet/i.test(url + ' ' + n)) return 'PhD';
  if (/doctor of philosophy|phd/i.test(n)) return 'PhD';
  if (/juris doctor/i.test(n)) return 'Masters';
  if (/master of|masters/i.test(n)) return 'Masters';
  if (/graduate diploma/i.test(n)) return 'Graduate Diploma';
  if (/graduate certificate/i.test(n)) return 'Graduate Certificate';
  if (/honours/i.test(n)) return 'Undergraduate (Honours)';
  if (/bachelor of/i.test(n)) return 'Undergraduate';
  if (/diploma/i.test(n)) return 'Diploma';
  return 'Postgraduate';
}

function parseAnnualFee(text) {
  // "AUD $36,000 (first year)" or "$36,730" or "AUD $36,000 per year"
  const m = text.match(/AUD\s*\$\s*([\d,]+)/i)
    || text.match(/\$\s*([\d,]+)\s*(?:per\s*year|\/yr|first\s*year)/i)
    || text.match(/\$\s*([\d,]+)\s*\(first\s*year\)/i);
  if (m) {
    const v = parseInt(m[1].replace(/,/g, ''), 10);
    if (v > 5000 && v < 100000) return v;
  }
  // Fallback: any $XX,XXX in fee range
  const amounts = [...text.matchAll(/\$\s*([\d,]+)/g)]
    .map(m => parseInt(m[1].replace(/,/g, ''), 10))
    .filter(n => n > 10000 && n < 80000);
  return amounts[0] || null;
}

function parseDuration(text) {
  const m = text.match(/([\d.]+)\s*year[s]?\s*(?:full.?time)/i)
    || text.match(/([\d.]+)\s*year/i);
  return m ? parseFloat(m[1]) : null;
}

function parseIntakes(text) {
  const months = [];
  if (/\bfebruary\b|\bsemester\s*1\b|\bautumn\b/i.test(text)) months.push('February');
  if (/\bjuly\b|\bsemester\s*2\b|\bspring\b/i.test(text)) months.push('July');
  if (/\bjanuary\b|\btrimester\s*1\b/i.test(text)) months.push('January');
  return months.length ? months : ['February', 'July'];
}

async function scrapeCourse(url, i, total) {
  process.stdout.write(`[${String(i).padStart(2)}/${total}] `);
  try {
    const r = await ax.get(url);
    const $ = cheerio.load(r.data);
    const text = r.data;

    const h1 = $('h1').first();
    const name = (h1.clone().children().remove().end().text() || h1.text())
      .replace(/\s+/g, ' ').trim();

    if (!name || name.length < 5) {
      process.stdout.write('SKIP (no name)\n');
      return null;
    }

    const durationYears = parseDuration(text) || (
      /graduate certificate/i.test(name) ? 0.5 :
      /graduate diploma/i.test(name) ? 1 :
      /master/i.test(name) ? 2 :
      /honours/i.test(name) ? 1 :
      /bachelor/i.test(name) ? 3 :
      /phd|doctor/i.test(name) ? 3 : 2
    );

    let annualAUD = parseAnnualFee(text);
    // If total fee was extracted (>60k), divide by duration
    if (annualAUD && annualAUD > 60000 && durationYears > 1) {
      annualAUD = Math.round(annualAUD / durationYears);
    }
    if (!annualAUD) annualAUD = /master|phd/i.test(name) ? 34000 : 33000;

    const level = inferLevel(name, url);
    const intakes = parseIntakes(text.slice(0, 8000));
    const urlSlug = url.split('/').pop();

    process.stdout.write(`${name.slice(0, 55)}\n`);
    return {
      name,
      slug: 'murdoch-' + urlSlug,
      url,
      level,
      duration: `${durationYears} year${durationYears !== 1 ? 's' : ''}`,
      durationYears,
      annualAUD,
      annualUSD: Math.round(annualAUD * 0.65),
      totalAUD: Math.round(annualAUD * durationYears),
      ieltsMin: 6.0,
      intakeMonths: intakes,
      campus: 'Murdoch Campus',
    };
  } catch (e) {
    process.stdout.write(`ERROR: ${(e.response?.status || e.message).toString().slice(0, 40)}\n`);
    return null;
  }
}

async function main() {
  console.log('\n🔍 Murdoch University Targeted Scraper');
  console.log(`  ${COURSE_URLS.length} course URLs to scrape\n`);

  const results = [];
  for (let i = 0; i < COURSE_URLS.length; i++) {
    const c = await scrapeCourse(COURSE_URLS[i], i + 1, COURSE_URLS.length);
    if (c) results.push(c);
    if (i < COURSE_URLS.length - 1) await sleep(700);
  }

  const byName = new Map();
  results.forEach(c => { if (!byName.has(c.name)) byName.set(c.name, c); });
  const final = [...byName.values()];

  fs.writeFileSync(OUT, JSON.stringify(final, null, 2), 'utf8');
  console.log(`\n✅ Murdoch: ${final.length} courses saved → ${OUT}`);
  const byLevel = {};
  final.forEach(c => { byLevel[c.level] = (byLevel[c.level] || 0) + 1; });
  console.log('By level:', byLevel);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
