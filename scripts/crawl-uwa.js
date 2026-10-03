// Reads The University of Western Australia's own course facts and international fees.
//
//   node scripts/crawl-uwa.js [--fresh]
//
// Every figure here is UWA's; no partner-platform list is used. UWA course pages state no
// international fee — their "International Student Fees" card explains the rule and links to UWA's
// fee calculator — so the two halves come from two UWA sources, joined on UWA's course code:
//   - Fees and discovery: the calculator at fees.uwa.edu.au/Calculator. POST GetCourses
//     {feeCategory: INTUG|INTPG, feeYear} lists every course UWA prices for international students;
//     POST GetCourseFee {feeCategory, feeYear, courseCode, year: "Starting <year>"} returns
//     {fee (annual), total_fee, fee_per_credit_point, annual_credit_point, course_credit_point}.
//   - Facts: each course page (www.uwa.edu.au/study/courses/<slug>, listed in the study sitemap under
//     /sitecore/content/uwafs/home/courses/<slug>) has "Quick details" cards: Status, Locations,
//     Delivery, Starting dates, Course Code, CRICOS code, Full time/part time duration.
// YEAR is the intake an applicant today joins.
// Output: data/wave-australia/uwa.json, reviewed before scripts/gen-uwa.js uses it.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'data/wave-australia/uwa.json');
const CALC = 'https://www.fees.uwa.edu.au/Calculator/';
const YEAR = 2027;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function curl(args) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync('curl', ['-s', '-L', '--max-time', '40', '-A', UA, '-w', '\n%{http_code}', ...args], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
      const i = out.lastIndexOf('\n');
      const status = Number(out.slice(i + 1));
      if (status === 200 || status === 404) return { status, body: out.slice(0, i) };
    } catch (e) { /* retry */ }
  }
  return { status: 0, body: '' };
}
const post = (endpoint, fields) => {
  const args = ['-X', 'POST'];
  for (const [k, v] of Object.entries(fields)) args.push('--data-urlencode', `${k}=${v}`);
  const res = curl([...args, CALC + endpoint]);
  return JSON.parse(res.body);
};

// "Quick details" card values, by label. The page repeats the panel; the first copy is used.
function cards(html) {
  const out = {};
  const re = /card-details-label">([^<]+)<\/div>([\s\S]*?)(?=card-details-label">|<\/section>|$)/g;
  let m;
  while ((m = re.exec(html))) {
    const label = m[1].trim();
    if (out[label] !== undefined) continue;
    out[label] = m[2].replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
  }
  return out;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);

  // 1. UWA's own list of courses priced for international students.
  const priced = [];
  for (const feeCategory of ['INTUG', 'INTPG']) {
    const [courses] = post('GetCourses', { feeCategory, feeYear: YEAR });
    for (const [code, label] of Object.entries(courses)) priced.push({ code, label, feeCategory });
  }

  // 2. Course pages from the study sitemap, keyed by the course code each page states.
  const sm = curl(['https://www.uwa.edu.au/study/sitemap.xml']).body;
  const slugs = [...new Set(sm.split('<loc>').slice(1).map((l) => l.split('</loc>')[0])
    .filter((u) => u.includes('/home/courses/')).map((u) => u.split('/home/courses/')[1]).filter((s) => s && !s.includes('/')))].sort();

  const prev = !process.argv.includes('--fresh') && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
  const cachedPages = new Map((prev?._crawledOn === today ? prev.pages : []).map((p) => [p.slug, p]));
  const pages = [];
  for (const slug of slugs) {
    if (cachedPages.has(slug)) { pages.push(cachedPages.get(slug)); continue; }
    const url = `https://www.uwa.edu.au/study/courses/${slug}`;
    const res = curl([url]);
    const c = res.status === 200 ? cards(res.body) : {};
    const title = (res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
    pages.push({ slug, url, status: res.status, title: title ? title.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : null, cards: c });
  }
  const byCode = new Map();
  for (const p of pages) { const code = p.cards['Course Code']; if (code && !byCode.has(code)) byCode.set(code, p); }

  // 3. Fee for each priced course, starting YEAR.
  const cachedFees = new Map((prev?._crawledOn === today ? prev.results : []).map((r) => [r.code, r.fee]));
  const results = priced.map((p) => {
    const fee = cachedFees.get(p.code) ?? (post('GetCourseFee', { feeCategory: p.feeCategory, feeYear: YEAR, courseCode: p.code, year: `Starting ${YEAR}` })[0] || null);
    const page = byCode.get(p.code) || null;
    console.log(`${page ? 'page' : '----'} ${fee?.fee ? fee.fee.padStart(8) : '   none'} ${p.label}`);
    return { ...p, fee, page };
  });

  fs.writeFileSync(OUT, JSON.stringify({
    _sources: [
      'https://www.fees.uwa.edu.au/Calculator (GetCourses, GetCourseFee: international fees, discovery)',
      'https://www.uwa.edu.au/study/sitemap.xml -> https://www.uwa.edu.au/study/courses/<slug> (quick details)',
      'https://www.uwa.edu.au/students/your-studies/important-dates (Semester 1 starts late February, Semester 2 late July)',
    ],
    _year: YEAR,
    _crawledOn: today,
    results,
    pages,
  }, null, 1));
  console.log(`\n${results.length} priced courses, ${results.filter((r) => r.page).length} matched to a course page, ${results.filter((r) => r.fee?.fee).length} with a fee -> ${path.relative(ROOT, OUT)}`);
}

main();
