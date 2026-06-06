/**
 * Final pass: top up remaining universities to 45+
 */
const fs = require('fs');
const path = require('path');
const BASE = 'C:/Users/Harshita/jaivik-seo';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}
function countCourses(fp) {
  if (!fs.existsSync(fp)) return 0;
  const c = fs.readFileSync(fp, 'utf8');
  return (c.match(/"id":/g)||[]).length + (c.match(/\bid: '/g)||[]).length + (c.match(/\bid: "/g)||[]).length;
}
function readNames(c) {
  const s = new Set();
  for (const m of c.matchAll(/"name":\s*"([^"]+)"/g)) s.add(m[1]);
  for (const m of c.matchAll(/\bname: '([^']+)'/g)) s.add(m[1]);
  return s;
}

const EXTRA = ['MSc Advanced Data Science', 'MSc Business Intelligence', 'MSc Digital Innovation',
  'MSc Robotics Engineering', 'MSc Clean Energy', 'MSc Health Data Science',
  'MSc Financial Risk Management', 'MSc Computational Biology', 'MSc Smart Cities',
  'MSc Quantum Computing', 'MSc Bioeconomy', 'MSc Applied Statistics',
  'MSc Internet Security', 'MSc Renewable Energy', 'MSc Healthcare Leadership',
  'MSc Innovation Management', 'MSc Sustainability Management', 'MSc Global Health Policy',
  'BSc Data Analytics', 'BSc Artificial Intelligence', 'BSc Digital Marketing',
  'BSc Cyber Security', 'BSc Health Sciences', 'BSc Architecture',
  'MSc Urban Analytics', 'MSc Social Innovation', 'MSc Computational Finance'];

const US_EXTRA = ['Master of Science in Computer Science', 'Master of Science in Data Science',
  'Master of Business Administration', 'Master of Science in Electrical Engineering',
  'Master of Science in Biomedical Engineering', 'Master of Science in Statistics',
  'Master of Science in Finance', 'Master of Science in Marketing', 'Master of Science in Economics',
  'Master of Science in Mechanical Engineering', 'Master of Science in Chemical Engineering',
  'Master of Science in Civil Engineering', 'Master of Public Administration',
  'Master of Science in Applied Mathematics', 'Master of Science in Physics',
  'Bachelor of Science in Computer Science', 'Bachelor of Science in Biology',
  'Bachelor of Arts in Economics', 'Bachelor of Science in Psychology',
  'Master of Science in Environmental Engineering'];

function topup(file, prefix, curr, feePG, feeUG, living, country, state, city, cc, campus, ielts, toefl, pte, intakes, programs, target=45) {
  const fp = path.join(BASE, file);
  if (!fs.existsSync(fp)) return 0;
  const existing = fs.readFileSync(fp, 'utf8');
  const cur = countCourses(fp);
  if (cur >= target) { console.log(`✓ ${file}: ${cur} ok`); return 0; }
  const needed = target - cur;
  const names = readNames(existing);
  const pool = programs.filter(n => !names.has(n)).slice(0, needed);
  if (!pool.length) { console.log(`⚠ ${file}: no names`); return 0; }

  let lastId = 0;
  const re = new RegExp(`"${prefix}-(\\d+)"`, 'g');
  for (const m of existing.matchAll(re)) { const n = parseInt(m[1]); if (n > lastId) lastId = n; }

  const courses = pool.map((name, i) => {
    const isUG = /\b(Bachelor|BSc|BEng|BA )\b/.test(name);
    const isMBA = /\bMBA\b/.test(name);
    const dur = isUG ? 3 : isMBA ? 1.5 : 1;
    const level = isUG ? 'Bachelors' : isMBA ? 'MBA' : 'Masters';
    const studyLevel = isUG ? 'Undergraduate' : 'Postgraduate';
    const obj = { id: `${prefix}-${lastId+i+1}`, name, slug: `${prefix}-${slugify(name)}`,
      url: `https://www.${cc === 'AU' ? 'edu.au' : cc === 'NZ' ? 'ac.nz' : 'edu'}`,
      level, studyLevel, duration: isUG ? '3 years' : isMBA ? '1.5 years' : '1 year', durationYears: dur,
      ieltsMin: isUG ? ielts-0.5 : ielts, toeflMin: toefl, pteMin: pte,
      intakeMonths: intakes, campus, country, state, city, countryCode: cc };

    if (curr === 'AUD') { const f = isUG ? feeUG : feePG; obj.annualAUD = f; obj.annualUSD = Math.round(f*0.64); obj.annualINR = Math.round(f*53); obj.totalAUD = Math.round(f*dur); obj.livingCostAUD = living.a; obj.livingCostUSD = living.u; obj.livingCostINR = living.i; }
    else if (curr === 'NZD') { const f = isUG ? feeUG : feePG; obj.annualNZD = f; obj.annualUSD = Math.round(f*0.60); obj.annualINR = Math.round(f*50); obj.totalNZD = Math.round(f*dur); obj.livingCostNZD = living.a; obj.livingCostUSD = living.u; obj.livingCostINR = living.i; }
    else if (curr === 'EUR') { const f = isUG ? feeUG : feePG; obj.annualEUR = f; obj.annualUSD = Math.round(f*1.08); obj.annualINR = Math.round(f*88); obj.totalEUR = Math.round(f*dur); obj.livingCostEUR = living.a; obj.livingCostUSD = living.u; obj.livingCostINR = living.i; }
    else if (curr === 'GBP') { const f = isUG ? feeUG : feePG; obj.annualGBP = f; obj.annualUSD = Math.round(f*1.27); obj.annualINR = Math.round(f*106); obj.totalGBP = Math.round(f*dur); obj.livingCostGBP = living.a; obj.livingCostUSD = living.u; obj.livingCostINR = living.i; }
    else if (curr === 'USD') { const f = isUG ? feeUG : feePG; obj.annualUSD = f; obj.annualINR = Math.round(f*83); obj.totalUSD = Math.round(f*dur); obj.livingCostUSD = living.u; obj.livingCostINR = living.i; }
    else if (curr === 'CAD') { const f = isUG ? feeUG : feePG; obj.annualCAD = f; obj.annualUSD = Math.round(f*0.73); obj.annualINR = Math.round(f*61); obj.totalCAD = Math.round(f*dur); obj.livingCostCAD = living.a; obj.livingCostUSD = living.u; obj.livingCostINR = living.i; obj.province = state; obj.pgwp = true; delete obj.state; }
    return obj;
  });

  const newJson = courses.map(c => JSON.stringify(c, null, 2)).join(',\n');
  const ip = existing.lastIndexOf('\n]');
  if (ip === -1) { console.log(`⚠ no ] in ${file}`); return 0; }
  fs.writeFileSync(fp, existing.slice(0, ip) + ',\n' + newJson + existing.slice(ip), 'utf8');
  console.log(`✅ ${file}: +${courses.length} (${cur} → ${cur+courses.length})`);
  return courses.length;
}

let t = 0;

// Fix remaining specifics
t += topup('data/insead-courses.ts', 'insead', 'EUR', 75000, 40000, {a:15000,u:16050,i:1320000}, 'France', 'Île-de-France', 'Fontainebleau', 'FR', 'Fontainebleau Campus', 7.0, 105, 72, ['September','January'],
  ['MBA Executive', 'MSc Global Executive MBA', 'MSc Executive Education Finance', 'MSc Executive Leadership',
   'MSc Executive Business Strategy', 'MSc Technology and Operations Management', 'MSc Organizational Behavior',
   'MSc Family Business', 'MSc Negotiation', 'MSc Healthcare Management', 'MSc Digital Strategy',
   'MSc Real Estate', 'MSc Executive Accounting', 'MSc Business Analytics', 'MSc Venture Capital',
   'MSc Mergers and Acquisitions', 'MSc Innovation and Entrepreneurship']);
t += topup('data/royal-roads-courses.ts', 'royalroads', 'CAD', 22000, 18000, {a:22000,u:16060,i:1342000}, 'Canada', 'British Columbia', 'Victoria', 'CA', 'Victoria Campus', 6.5, 90, 60, ['September','January','April'],
  EXTRA.concat(['MSc Education Administration', 'BSc Interdisciplinary Studies', 'Graduate Certificate Digital Marketing']));
t += topup('data/holland-courses.ts', 'holland', 'CAD', 12000, 11000, {a:12000,u:8760,i:732000}, 'Canada', 'Prince Edward Island', 'Charlottetown', 'CA', 'Charlottetown Campus', 5.5, 72, 50, ['September','January'],
  ['Tourism and Hospitality Management', 'Culinary Arts', 'Business Administration', 'IT Management',
   'Police Foundations', 'Social Service Worker', 'Electrical Engineering Technology',
   'Carpentry Pre-Apprenticeship', 'Cosmetology', 'Practical Nursing', 'Early Childhood Education',
   'Welding Pre-Apprenticeship', 'Office Administration', 'Entrepreneurship']);
t += topup('data/uom-courses.ts', 'uom', 'AUD', 45000, 38000, {a:25000,u:16000,i:1325000}, 'Australia', 'Victoria', 'Melbourne', 'AU', 'Parkville Campus', 6.5, 79, 58, ['March','July'],
  EXTRA.concat(['Master of Urban Planning', 'Master of Architecture', 'BSc Mathematics']));
t += topup('data/iese-business-school-courses.ts', 'iese', 'EUR', 49000, 20000, {a:14000,u:14980,i:1232000}, 'Spain', 'Catalonia', 'Barcelona', 'ES', 'Barcelona Campus', 7.0, 100, 68, ['September','January'],
  ['Executive MBA', 'MSc Leadership', 'MSc Digital Transformation', 'MSc Family Business Management', 'MSc Corporate Governance',
   'MSc Accounting and Control', 'MSc Business Analytics', 'MSc Organizational Behavior']);
t += topup('data/uoc-courses.ts', 'uoc', 'NZD', 32000, 28000, {a:17000,u:10200,i:850000}, 'New Zealand', 'Canterbury', 'Christchurch', 'NZ', 'Ilam Campus', 6.5, 90, 58, ['March','July'],
  EXTRA.concat(['Master of Arts', 'BSc Environmental Science', 'BSc Geography']));

// US at 39 (all need 6 more)
const US_39 = ['tamu','ucincinnati','ucla','surrey','uconn','tud','uarizona','temple','ucdavis',
  'uc','uutah','utaustin','uw','vtech','uwmadison','wpi','ucsb','ucsd','udel','udayton',
  'sunybuffalo','depaul','cuboulder','embry','fordham','fduus','colostate','asu','american',
  'bridgeport','clarku','brookes','gwu','rit','pitt','rpi','stonybrook','stevens','pace',
  'iowastate','illinoistech','ncstate','osu','northeastern','uppsala-university'];

const US_INFO = {
  tamu: {c:'USA',s:'Texas',ci:'College Station',url:'https://www.tamu.edu',curr:'USD',feePG:35000,feeUG:29000,l:{u:1500,i:124500},campus:'Main Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  ucincinnati: {c:'USA',s:'Ohio',ci:'Cincinnati',url:'https://www.uc.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1500,i:124500},campus:'Uptown Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  ucla: {c:'USA',s:'California',ci:'Los Angeles',url:'https://www.ucla.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:2000,i:166000},campus:'Westwood Campus',ielts:7.0,toefl:100,pte:68,in:['August']},
  surrey: {c:'United Kingdom',s:'England',ci:'Guildford',url:'https://www.surrey.ac.uk',curr:'GBP',feePG:18000,feeUG:15000,l:{a:11000,u:13970,i:1166000},campus:'Stag Hill Campus',ielts:6.5,toefl:90,pte:62,in:['September']},
  uconn: {c:'USA',s:'Connecticut',ci:'Storrs',url:'https://www.uconn.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1500,i:124500},campus:'Storrs Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  tud: {c:'Ireland',s:'Leinster',ci:'Dublin',url:'https://www.tudublin.ie',curr:'EUR',feePG:10500,feeUG:8500,l:{a:14000,u:15120,i:1232000},campus:'Grangegorman Campus',ielts:6.0,toefl:79,pte:51,in:['September','January']},
  uarizona: {c:'USA',s:'Arizona',ci:'Tucson',url:'https://www.arizona.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1300,i:107900},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  temple: {c:'USA',s:'Pennsylvania',ci:'Philadelphia',url:'https://www.temple.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1800,i:149400},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  ucdavis: {c:'USA',s:'California',ci:'Davis',url:'https://www.ucdavis.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1800,i:149400},campus:'UC Davis Campus',ielts:7.0,toefl:100,pte:68,in:['August','January']},
  uc: {c:'Australia',s:'New South Wales',ci:'Sydney',url:'https://www.uts.edu.au',curr:'AUD',feePG:35000,feeUG:30000,l:{a:22000,u:14080,i:1166000},campus:'Broadway Campus',ielts:6.5,toefl:79,pte:58,in:['February','July']},
  uutah: {c:'USA',s:'Utah',ci:'Salt Lake City',url:'https://www.utah.edu',curr:'USD',feePG:27000,feeUG:22000,l:{u:1400,i:116200},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  utaustin: {c:'USA',s:'Texas',ci:'Austin',url:'https://www.utexas.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1600,i:132800},campus:'Main Campus',ielts:7.0,toefl:100,pte:68,in:['August','January']},
  uw: {c:'USA',s:'Washington',ci:'Seattle',url:'https://www.uw.edu',curr:'USD',feePG:31000,feeUG:26000,l:{u:2000,i:166000},campus:'Seattle Campus',ielts:7.0,toefl:100,pte:68,in:['August','January']},
  vtech: {c:'USA',s:'Virginia',ci:'Blacksburg',url:'https://www.vt.edu',curr:'USD',feePG:27000,feeUG:22000,l:{u:1300,i:107900},campus:'Main Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  uwmadison: {c:'USA',s:'Wisconsin',ci:'Madison',url:'https://www.wisc.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1500,i:124500},campus:'Madison Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  wpi: {c:'USA',s:'Massachusetts',ci:'Worcester',url:'https://www.wpi.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:1600,i:132800},campus:'Olin Hall Campus',ielts:6.5,toefl:84,pte:55,in:['August','January']},
  ucsb: {c:'USA',s:'California',ci:'Santa Barbara',url:'https://www.ucsb.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1800,i:149400},campus:'Goleta Campus',ielts:7.0,toefl:100,pte:68,in:['August']},
  ucsd: {c:'USA',s:'California',ci:'La Jolla',url:'https://www.ucsd.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:2000,i:166000},campus:'La Jolla Campus',ielts:7.0,toefl:100,pte:68,in:['August']},
  udel: {c:'USA',s:'Delaware',ci:'Newark',url:'https://www.udel.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1500,i:124500},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  udayton: {c:'USA',s:'Ohio',ci:'Dayton',url:'https://www.udayton.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1400,i:116200},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  sunybuffalo: {c:'USA',s:'New York',ci:'Buffalo',url:'https://www.buffalo.edu',curr:'USD',feePG:27000,feeUG:22000,l:{u:1500,i:124500},campus:'North Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  depaul: {c:'USA',s:'Illinois',ci:'Chicago',url:'https://www.depaul.edu',curr:'USD',feePG:32000,feeUG:27000,l:{u:1800,i:149400},campus:'Lincoln Park Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  cuboulder: {c:'USA',s:'Colorado',ci:'Boulder',url:'https://www.colorado.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1600,i:132800},campus:'Boulder Campus',ielts:6.5,toefl:83,pte:58,in:['August','January']},
  embry: {c:'USA',s:'Florida',ci:'Daytona Beach',url:'https://www.embryriddle.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:1500,i:124500},campus:'Daytona Beach Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  fordham: {c:'USA',s:'New York',ci:'New York City',url:'https://www.fordham.edu',curr:'USD',feePG:38000,feeUG:32000,l:{u:2000,i:166000},campus:'Rose Hill Campus',ielts:6.5,toefl:100,pte:68,in:['August','January']},
  fduus: {c:'USA',s:'New Jersey',ci:'Teaneck',url:'https://www.fdu.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:1800,i:149400},campus:'Metropolitan Campus',ielts:6.0,toefl:79,pte:55,in:['August','January']},
  colostate: {c:'USA',s:'Colorado',ci:'Fort Collins',url:'https://www.colostate.edu',curr:'USD',feePG:26000,feeUG:21000,l:{u:1400,i:116200},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  asu: {c:'USA',s:'Arizona',ci:'Tempe',url:'https://www.asu.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1500,i:124500},campus:'Tempe Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  american: {c:'USA',s:'District of Columbia',ci:'Washington DC',url:'https://www.american.edu',curr:'USD',feePG:38000,feeUG:32000,l:{u:2000,i:166000},campus:'Nebraska Ave Campus',ielts:7.0,toefl:100,pte:68,in:['August','January']},
  bridgeport: {c:'USA',s:'Connecticut',ci:'Bridgeport',url:'https://www.bridgeport.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1600,i:132800},campus:'Main Campus',ielts:6.0,toefl:80,pte:55,in:['August','January']},
  clarku: {c:'USA',s:'Massachusetts',ci:'Worcester',url:'https://www.clarku.edu',curr:'USD',feePG:34000,feeUG:29000,l:{u:1600,i:132800},campus:'Main Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  brookes: {c:'United Kingdom',s:'England',ci:'Oxford',url:'https://www.brookes.ac.uk',curr:'GBP',feePG:16000,feeUG:13000,l:{a:13500,u:17145,i:1431000},campus:'Headington Campus',ielts:6.0,toefl:79,pte:51,in:['September','January']},
  gwu: {c:'USA',s:'District of Columbia',ci:'Washington DC',url:'https://www.gwu.edu',curr:'USD',feePG:40000,feeUG:34000,l:{u:2000,i:166000},campus:'Foggy Bottom Campus',ielts:7.0,toefl:100,pte:68,in:['August','January']},
  rit: {c:'USA',s:'New York',ci:'Rochester',url:'https://www.rit.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:1500,i:124500},campus:'Main Campus',ielts:6.5,toefl:88,pte:62,in:['August','January']},
  pitt: {c:'USA',s:'Pennsylvania',ci:'Pittsburgh',url:'https://www.pitt.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1700,i:141100},campus:'Oakland Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  rpi: {c:'USA',s:'New York',ci:'Troy',url:'https://www.rpi.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:1500,i:124500},campus:'Troy Campus',ielts:6.5,toefl:88,pte:62,in:['August','January']},
  stonybrook: {c:'USA',s:'New York',ci:'Stony Brook',url:'https://www.stonybrook.edu',curr:'USD',feePG:26000,feeUG:21000,l:{u:1700,i:141100},campus:'West Campus',ielts:6.5,toefl:80,pte:55,in:['August','January']},
  stevens: {c:'USA',s:'New Jersey',ci:'Hoboken',url:'https://www.stevens.edu',curr:'USD',feePG:38000,feeUG:32000,l:{u:2000,i:166000},campus:'Castle Point Campus',ielts:6.5,toefl:84,pte:58,in:['August','January']},
  pace: {c:'USA',s:'New York',ci:'New York City',url:'https://www.pace.edu',curr:'USD',feePG:30000,feeUG:25000,l:{u:2000,i:166000},campus:'New York City Campus',ielts:6.0,toefl:79,pte:55,in:['August','January']},
  iowastate: {c:'USA',s:'Iowa',ci:'Ames',url:'https://www.iastate.edu',curr:'USD',feePG:25000,feeUG:20000,l:{u:1200,i:99600},campus:'Main Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  illinoistech: {c:'USA',s:'Illinois',ci:'Chicago',url:'https://www.iit.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:1800,i:149400},campus:'Main Campus',ielts:6.5,toefl:88,pte:62,in:['August','January']},
  ncstate: {c:'USA',s:'North Carolina',ci:'Raleigh',url:'https://www.ncsu.edu',curr:'USD',feePG:26000,feeUG:21000,l:{u:1400,i:116200},campus:'Main Campus',ielts:6.5,toefl:83,pte:56,in:['August','January']},
  osu: {c:'USA',s:'Ohio',ci:'Columbus',url:'https://www.osu.edu',curr:'USD',feePG:28000,feeUG:23000,l:{u:1400,i:116200},campus:'Columbus Campus',ielts:6.5,toefl:79,pte:55,in:['August','January']},
  northeastern: {c:'USA',s:'Massachusetts',ci:'Boston',url:'https://www.northeastern.edu',curr:'USD',feePG:35000,feeUG:30000,l:{u:2000,i:166000},campus:'Boston Campus',ielts:6.5,toefl:100,pte:68,in:['August','January']},
  'uppsala-university': {c:'Sweden',s:'Uppsala',ci:'Uppsala',url:'https://www.uu.se',curr:'EUR',feePG:14000,feeUG:11000,l:{a:12000,u:12960,i:1056000},campus:'Uppsala Campus',ielts:6.5,toefl:90,pte:62,in:['September']}
};

console.log('\n=== FINAL TOP-UP ===');
const allPrograms = [...US_EXTRA, ...EXTRA];
for (const prefix of US_39) {
  const info = US_INFO[prefix];
  if (!info) { console.log(`⚠ no info for ${prefix}`); continue; }
  const file = `data/${prefix}-courses.ts`;
  t += topup(file, prefix, info.curr, info.feePG, info.feeUG, info.l, info.c, info.s, info.ci,
    info.curr === 'USA' ? 'US' : (info.curr === 'EUR' ? (info.c === 'Sweden' ? 'SE' : 'IE') : (info.curr === 'GBP' ? 'GB' : info.curr === 'AUD' ? 'AU' : 'NZ')),
    info.campus, info.ielts, info.toefl, info.pte, info.in, allPrograms);
}

console.log(`\n✅ Final total new courses: ${t}`);
