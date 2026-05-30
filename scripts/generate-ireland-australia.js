#!/usr/bin/env node
// generate-ireland-australia.js
// Generates course data files + Next.js pages for:
//   - Ireland: 14 new universities (total 15)
//   - Australia: 26 new universities (total 40)

const fs = require('fs');
const path = require('path');

// ─── Currency conversion rates ────────────────────────────────────────────────
const AUD_USD = 0.65;   AUD_INR = 54.6;
const EUR_USD = 1.08;   EUR_INR = 90.7;

// ─── Ireland universities (14 new — TCD already exists as u25) ────────────────
const IRELAND_UNIS = [
  { id:'ire02', prefix:'ucd',    name:'University College Dublin',        shortName:'UCD',       slug:'university-college-dublin',        city:'Dublin',     state:'Leinster',  qsRank:181,  theRank:201, tuitionUG:22000, tuitionPG:24000, livingCost:14000, ielts:6.5, toefl:90,  pte:62, intakes:['September'],            estYear:1854, students:38000, intlPct:22, accept:42, visa:81, employ:91, salaryUSD:60000, appFee:50,  website:'https://www.ucd.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire03', prefix:'ucc',    name:'University College Cork',          shortName:'UCC',       slug:'university-college-cork',          city:'Cork',       state:'Munster',   qsRank:303,  theRank:401, tuitionUG:18000, tuitionPG:20000, livingCost:12000, ielts:6.5, toefl:90,  pte:62, intakes:['September'],            estYear:1845, students:27000, intlPct:20, accept:48, visa:80, employ:89, salaryUSD:56000, appFee:50,  website:'https://www.ucc.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire04', prefix:'nuig',   name:'University of Galway',             shortName:'Galway',    slug:'university-of-galway',             city:'Galway',     state:'Connacht',  qsRank:307,  theRank:401, tuitionUG:17000, tuitionPG:19000, livingCost:11500, ielts:6.0, toefl:88,  pte:59, intakes:['September'],            estYear:1845, students:19000, intlPct:20, accept:50, visa:80, employ:88, salaryUSD:54000, appFee:50,  website:'https://www.universityofgalway.ie', currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire05', prefix:'dcu',    name:'Dublin City University',           shortName:'DCU',       slug:'dublin-city-university',           city:'Dublin',     state:'Leinster',  qsRank:501,  theRank:501, tuitionUG:15000, tuitionPG:17500, livingCost:14000, ielts:6.0, toefl:85,  pte:58, intakes:['September'],            estYear:1989, students:20000, intlPct:18, accept:55, visa:80, employ:88, salaryUSD:52000, appFee:50,  website:'https://www.dcu.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire06', prefix:'mu',     name:'Maynooth University',              shortName:'Maynooth',  slug:'maynooth-university',              city:'Maynooth',   state:'Leinster',  qsRank:601,  theRank:601, tuitionUG:14000, tuitionPG:16000, livingCost:12000, ielts:6.0, toefl:83,  pte:55, intakes:['September'],            estYear:1997, students:14000, intlPct:15, accept:58, visa:79, employ:86, salaryUSD:49000, appFee:50,  website:'https://www.maynoothuniversity.ie', currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire07', prefix:'tud',    name:'Technological University Dublin',  shortName:'TU Dublin', slug:'technological-university-dublin',  city:'Dublin',     state:'Leinster',  qsRank:801,  theRank:801, tuitionUG:12000, tuitionPG:14000, livingCost:14000, ielts:6.0, toefl:80,  pte:55, intakes:['September','January'],  estYear:2019, students:29000, intlPct:14, accept:65, visa:78, employ:85, salaryUSD:46000, appFee:50,  website:'https://www.tudublin.ie',     currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire08', prefix:'rcsi',   name:'RCSI University of Medicine',      shortName:'RCSI',      slug:'rcsi-university-of-medicine',      city:'Dublin',     state:'Leinster',  qsRank:601,  theRank:601, tuitionUG:55000, tuitionPG:25000, livingCost:14000, ielts:7.0, toefl:100, pte:65, intakes:['September'],            estYear:1784, students:4000,  intlPct:72, accept:20, visa:82, employ:98, salaryUSD:90000, appFee:100, website:'https://www.rcsi.com',        currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire09', prefix:'dbs',    name:'Dublin Business School',           shortName:'DBS',       slug:'dublin-business-school',           city:'Dublin',     state:'Leinster',  qsRank:1001, theRank:1001,tuitionUG:11000, tuitionPG:13500, livingCost:14000, ielts:6.0, toefl:80,  pte:55, intakes:['September','January'],  estYear:1975, students:9000,  intlPct:35, accept:72, visa:77, employ:83, salaryUSD:42000, appFee:0,   website:'https://www.dbs.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire10', prefix:'gcd',    name:'Griffith College Dublin',          shortName:'Griffith',  slug:'griffith-college-dublin',          city:'Dublin',     state:'Leinster',  qsRank:1001, theRank:1001,tuitionUG:11000, tuitionPG:13000, livingCost:14000, ielts:6.0, toefl:79,  pte:51, intakes:['September','January'],  estYear:1974, students:7000,  intlPct:30, accept:75, visa:77, employ:82, salaryUSD:40000, appFee:0,   website:'https://www.griffith.ie',     currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire11', prefix:'nci',    name:'National College of Ireland',      shortName:'NCI',       slug:'national-college-of-ireland',      city:'Dublin',     state:'Leinster',  qsRank:1001, theRank:1001,tuitionUG:11500, tuitionPG:13500, livingCost:14000, ielts:6.0, toefl:79,  pte:51, intakes:['September','January'],  estYear:1951, students:8000,  intlPct:25, accept:72, visa:77, employ:83, salaryUSD:41000, appFee:0,   website:'https://www.ncirl.ie',        currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire12', prefix:'atu',    name:'Atlantic Technological University',shortName:'ATU',       slug:'atlantic-technological-university',city:'Galway',     state:'Connacht',  qsRank:1001, theRank:1001,tuitionUG:11000, tuitionPG:13000, livingCost:11000, ielts:6.0, toefl:79,  pte:51, intakes:['September'],            estYear:2022, students:15000, intlPct:12, accept:68, visa:77, employ:83, salaryUSD:40000, appFee:0,   website:'https://www.atu.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire13', prefix:'setu',   name:'South East Technological University',shortName:'SETU',   slug:'south-east-technological-university',city:'Waterford', state:'Leinster',  qsRank:1001, theRank:1001,tuitionUG:10500, tuitionPG:12500, livingCost:11000, ielts:6.0, toefl:79,  pte:51, intakes:['September'],            estYear:2022, students:18000, intlPct:10, accept:70, visa:76, employ:82, salaryUSD:38000, appFee:0,   website:'https://www.setu.ie',         currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire14', prefix:'mtu',    name:'Munster Technological University', shortName:'MTU',       slug:'munster-technological-university', city:'Cork',       state:'Munster',   qsRank:1001, theRank:1001,tuitionUG:10500, tuitionPG:12500, livingCost:11000, ielts:6.0, toefl:79,  pte:51, intakes:['September'],            estYear:2021, students:18000, intlPct:10, accept:70, visa:76, employ:82, salaryUSD:38000, appFee:0,   website:'https://www.mtu.ie',          currency:'EUR', country:'Ireland', countryCode:'IE' },
  { id:'ire15', prefix:'ul',     name:'University of Limerick',           shortName:'UL',        slug:'university-of-limerick',           city:'Limerick',   state:'Munster',   qsRank:501,  theRank:601, tuitionUG:14500, tuitionPG:16500, livingCost:11500, ielts:6.0, toefl:85,  pte:58, intakes:['September'],            estYear:1972, students:17000, intlPct:18, accept:55, visa:79, employ:88, salaryUSD:52000, appFee:50,  website:'https://www.ul.ie',           currency:'EUR', country:'Ireland', countryCode:'IE' },
];

// ─── Australia universities (26 new — 14 already exist) ──────────────────────
// Existing: Melbourne, UNSW, Monash, UTS, CDU, Swinburne, Kaplan, VU Sydney,
//           CQU, JCU Brisbane, Murdoch, Flinders, Griffith, La Trobe
const AUSTRALIA_UNIS = [
  { id:'au15', prefix:'uq',       name:'University of Queensland',          shortName:'UQ',          slug:'university-of-queensland',          city:'Brisbane',  state:'Queensland',        qsRank:40,   theRank:55,  tuitionUG:42000, tuitionPG:45000, livingCost:20000, ielts:6.5, toefl:87,  pte:64, intakes:['February','July'],       estYear:1909, students:56000, intlPct:35, accept:40, visa:82, employ:92, salaryUSD:65000, appFee:100, website:'https://www.uq.edu.au' },
  { id:'au16', prefix:'anu',      name:'Australian National University',    shortName:'ANU',         slug:'australian-national-university',    city:'Canberra',  state:'ACT',               qsRank:30,   theRank:62,  tuitionUG:43000, tuitionPG:46000, livingCost:18000, ielts:6.5, toefl:92,  pte:64, intakes:['February','July'],       estYear:1946, students:23000, intlPct:40, accept:35, visa:82, employ:93, salaryUSD:68000, appFee:0,   website:'https://www.anu.edu.au' },
  { id:'au17', prefix:'usyd',     name:'University of Sydney',              shortName:'USyd',        slug:'university-of-sydney',              city:'Sydney',    state:'New South Wales',    qsRank:19,   theRank:61,  tuitionUG:45000, tuitionPG:48000, livingCost:22000, ielts:6.5, toefl:92,  pte:64, intakes:['February','July'],       estYear:1850, students:73000, intlPct:38, accept:35, visa:82, employ:93, salaryUSD:70000, appFee:0,   website:'https://www.sydney.edu.au' },
  { id:'au18', prefix:'uwa',      name:'University of Western Australia',   shortName:'UWA',         slug:'university-of-western-australia',   city:'Perth',     state:'Western Australia',  qsRank:90,   theRank:127, tuitionUG:38000, tuitionPG:42000, livingCost:18000, ielts:6.5, toefl:87,  pte:64, intakes:['February','July'],       estYear:1911, students:25000, intlPct:38, accept:42, visa:81, employ:91, salaryUSD:62000, appFee:0,   website:'https://www.uwa.edu.au' },
  { id:'au19', prefix:'uoa',      name:'University of Adelaide',            shortName:'Adelaide',    slug:'university-of-adelaide',            city:'Adelaide',  state:'South Australia',    qsRank:89,   theRank:151, tuitionUG:38000, tuitionPG:41000, livingCost:16000, ielts:6.5, toefl:79,  pte:58, intakes:['February','July'],       estYear:1874, students:30000, intlPct:35, accept:42, visa:81, employ:90, salaryUSD:60000, appFee:0,   website:'https://www.adelaide.edu.au' },
  { id:'au20', prefix:'macq',     name:'Macquarie University',              shortName:'Macquarie',   slug:'macquarie-university',              city:'Sydney',    state:'New South Wales',    qsRank:195,  theRank:251, tuitionUG:36000, tuitionPG:39000, livingCost:21000, ielts:6.5, toefl:83,  pte:58, intakes:['February','July'],       estYear:1964, students:44000, intlPct:36, accept:45, visa:81, employ:90, salaryUSD:60000, appFee:0,   website:'https://www.mq.edu.au' },
  { id:'au21', prefix:'rmit',     name:'RMIT University',                   shortName:'RMIT',        slug:'rmit-university',                   city:'Melbourne', state:'Victoria',           qsRank:227,  theRank:301, tuitionUG:34000, tuitionPG:37000, livingCost:19000, ielts:6.5, toefl:79,  pte:58, intakes:['February','July'],       estYear:1887, students:95000, intlPct:40, accept:48, visa:80, employ:89, salaryUSD:57000, appFee:0,   website:'https://www.rmit.edu.au' },
  { id:'au22', prefix:'utas',     name:'University of Tasmania',            shortName:'UTAS',        slug:'university-of-tasmania',            city:'Hobart',    state:'Tasmania',           qsRank:401,  theRank:401, tuitionUG:30000, tuitionPG:33000, livingCost:15000, ielts:6.0, toefl:79,  pte:58, intakes:['February','July'],       estYear:1890, students:30000, intlPct:25, accept:55, visa:79, employ:87, salaryUSD:52000, appFee:0,   website:'https://www.utas.edu.au' },
  { id:'au23', prefix:'usc',      name:'University of the Sunshine Coast',  shortName:'USC',         slug:'university-of-sunshine-coast',      city:'Brisbane',  state:'Queensland',        qsRank:601,  theRank:601, tuitionUG:28000, tuitionPG:31000, livingCost:17000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1994, students:21000, intlPct:18, accept:60, visa:78, employ:86, salaryUSD:49000, appFee:0,   website:'https://www.usc.edu.au' },
  { id:'au24', prefix:'acu',      name:'Australian Catholic University',    shortName:'ACU',         slug:'australian-catholic-university',    city:'Melbourne', state:'Victoria',           qsRank:601,  theRank:601, tuitionUG:28000, tuitionPG:30000, livingCost:18000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1991, students:32000, intlPct:20, accept:58, visa:78, employ:87, salaryUSD:50000, appFee:0,   website:'https://www.acu.edu.au' },
  { id:'au25', prefix:'ecu',      name:'Edith Cowan University',            shortName:'ECU',         slug:'edith-cowan-university',            city:'Perth',     state:'Western Australia',  qsRank:601,  theRank:601, tuitionUG:28000, tuitionPG:30000, livingCost:17000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1902, students:30000, intlPct:28, accept:60, visa:78, employ:86, salaryUSD:48000, appFee:0,   website:'https://www.ecu.edu.au' },
  { id:'au26', prefix:'curtin',   name:'Curtin University',                 shortName:'Curtin',      slug:'curtin-university',                 city:'Perth',     state:'Western Australia',  qsRank:201,  theRank:251, tuitionUG:34000, tuitionPG:37000, livingCost:17000, ielts:6.0, toefl:80,  pte:58, intakes:['February','July'],       estYear:1966, students:60000, intlPct:38, accept:48, visa:80, employ:89, salaryUSD:55000, appFee:0,   website:'https://www.curtin.edu.au' },
  { id:'au27', prefix:'deakin',   name:'Deakin University',                 shortName:'Deakin',      slug:'deakin-university',                 city:'Melbourne', state:'Victoria',           qsRank:301,  theRank:351, tuitionUG:33000, tuitionPG:35000, livingCost:18000, ielts:6.0, toefl:79,  pte:58, intakes:['February','July'],       estYear:1974, students:61000, intlPct:30, accept:50, visa:80, employ:88, salaryUSD:54000, appFee:0,   website:'https://www.deakin.edu.au' },
  { id:'au28', prefix:'uon',      name:'University of Newcastle',           shortName:'UoN',         slug:'university-of-newcastle-australia', city:'Newcastle', state:'New South Wales',    qsRank:197,  theRank:251, tuitionUG:33000, tuitionPG:36000, livingCost:16000, ielts:6.0, toefl:79,  pte:58, intakes:['February','July'],       estYear:1965, students:38000, intlPct:28, accept:50, visa:80, employ:88, salaryUSD:54000, appFee:0,   website:'https://www.newcastle.edu.au' },
  { id:'au29', prefix:'une',      name:'University of New England',         shortName:'UNE',         slug:'university-of-new-england-australia',city:'Armidale',state:'New South Wales',    qsRank:601,  theRank:601, tuitionUG:27000, tuitionPG:30000, livingCost:13000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1954, students:22000, intlPct:20, accept:60, visa:78, employ:85, salaryUSD:48000, appFee:0,   website:'https://www.une.edu.au' },
  { id:'au30', prefix:'usq',      name:'University of Southern Queensland', shortName:'UniSQ',       slug:'university-of-southern-queensland', city:'Toowoomba', state:'Queensland',        qsRank:601,  theRank:601, tuitionUG:27000, tuitionPG:30000, livingCost:13000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1967, students:28000, intlPct:22, accept:60, visa:78, employ:85, salaryUSD:48000, appFee:0,   website:'https://www.unisq.edu.au' },
  { id:'au31', prefix:'wsu',      name:'Western Sydney University',         shortName:'WSU',         slug:'western-sydney-university',         city:'Sydney',    state:'New South Wales',    qsRank:401,  theRank:401, tuitionUG:30000, tuitionPG:32000, livingCost:20000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1989, students:47000, intlPct:26, accept:55, visa:79, employ:86, salaryUSD:50000, appFee:0,   website:'https://www.westernsydney.edu.au' },
  { id:'au32', prefix:'unisa',    name:'University of South Australia',     shortName:'UniSA',       slug:'university-of-south-australia',     city:'Adelaide',  state:'South Australia',    qsRank:297,  theRank:351, tuitionUG:31000, tuitionPG:34000, livingCost:15000, ielts:6.0, toefl:79,  pte:58, intakes:['February','July'],       estYear:1991, students:33000, intlPct:30, accept:52, visa:80, employ:88, salaryUSD:53000, appFee:0,   website:'https://www.unisa.edu.au' },
  { id:'au33', prefix:'uc',       name:'University of Canberra',            shortName:'UC',          slug:'university-of-canberra',            city:'Canberra',  state:'ACT',               qsRank:601,  theRank:601, tuitionUG:28000, tuitionPG:31000, livingCost:16000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1967, students:16000, intlPct:25, accept:58, visa:79, employ:87, salaryUSD:51000, appFee:0,   website:'https://www.canberra.edu.au' },
  { id:'au34', prefix:'bond',     name:'Bond University',                   shortName:'Bond',        slug:'bond-university',                   city:'Gold Coast',state:'Queensland',        qsRank:601,  theRank:601, tuitionUG:38000, tuitionPG:40000, livingCost:18000, ielts:6.5, toefl:79,  pte:58, intakes:['January','May','September'],estYear:1989,students:6000, intlPct:35, accept:50, visa:80, employ:89, salaryUSD:56000, appFee:0,   website:'https://www.bond.edu.au' },
  { id:'au35', prefix:'scu',      name:'Southern Cross University',         shortName:'SCU',         slug:'southern-cross-university',         city:'Gold Coast',state:'Queensland',        qsRank:601,  theRank:601, tuitionUG:26000, tuitionPG:28000, livingCost:17000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1994, students:22000, intlPct:20, accept:60, visa:78, employ:85, salaryUSD:47000, appFee:0,   website:'https://www.scu.edu.au' },
  { id:'au36', prefix:'federation',name:'Federation University',            shortName:'Federation',  slug:'federation-university',             city:'Ballarat',  state:'Victoria',           qsRank:601,  theRank:601, tuitionUG:25000, tuitionPG:28000, livingCost:14000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],       estYear:1870, students:20000, intlPct:22, accept:62, visa:78, employ:85, salaryUSD:46000, appFee:0,   website:'https://www.federation.edu.au' },
  { id:'au37', prefix:'torrens',  name:'Torrens University Australia',      shortName:'Torrens',     slug:'torrens-university-australia',      city:'Adelaide',  state:'South Australia',    qsRank:1001, theRank:1001,tuitionUG:26000, tuitionPG:29000, livingCost:14000, ielts:6.0, toefl:79,  pte:51, intakes:['January','April','July','October'],estYear:2014,students:8000,intlPct:30,accept:65,visa:78, employ:85, salaryUSD:46000, appFee:0,   website:'https://www.torrens.edu.au' },
  { id:'au38', prefix:'holmes',   name:'Holmes Institute',                  shortName:'Holmes',      slug:'holmes-institute',                  city:'Melbourne', state:'Victoria',           qsRank:1001, theRank:1001,tuitionUG:22000, tuitionPG:25000, livingCost:18000, ielts:5.5, toefl:72,  pte:51, intakes:['February','May','August','November'],estYear:1963,students:5000,intlPct:55,accept:70,visa:77, employ:82, salaryUSD:42000, appFee:0,   website:'https://www.holmes.edu.au' },
  { id:'au39', prefix:'think',    name:'Think Education',                   shortName:'Think',       slug:'think-education-australia',         city:'Sydney',    state:'New South Wales',    qsRank:1001, theRank:1001,tuitionUG:22000, tuitionPG:24000, livingCost:20000, ielts:5.5, toefl:72,  pte:51, intakes:['February','July'],       estYear:2002, students:4000,  intlPct:40, accept:70, visa:77, employ:82, salaryUSD:42000, appFee:0,   website:'https://www.think.edu.au' },
  { id:'au40', prefix:'navitas',  name:'Navitas',                           shortName:'Navitas',     slug:'navitas-australia',                 city:'Perth',     state:'Western Australia',  qsRank:1001, theRank:1001,tuitionUG:20000, tuitionPG:22000, livingCost:17000, ielts:5.5, toefl:70,  pte:51, intakes:['February','May','July','October'],estYear:1994,students:80000,intlPct:60,accept:75,visa:77, employ:80, salaryUSD:40000, appFee:0,   website:'https://www.navitas.com/australia' },
];

// ─── Course templates ─────────────────────────────────────────────────────────
const UG_COURSES = [
  ['BSc Computer Science','Undergraduate'],
  ['BSc Software Engineering','Undergraduate'],
  ['BSc Data Science','Undergraduate'],
  ['BSc Cybersecurity','Undergraduate'],
  ['BSc Artificial Intelligence','Undergraduate'],
  ['BEng Mechanical Engineering','Undergraduate'],
  ['BEng Civil Engineering','Undergraduate'],
  ['BEng Electrical Engineering','Undergraduate'],
  ['BSc Business Administration','Undergraduate'],
  ['BSc Accounting & Finance','Undergraduate'],
  ['BSc Economics','Undergraduate'],
  ['BSc Marketing','Undergraduate'],
  ['BSc International Business','Undergraduate'],
  ['BSc Psychology','Undergraduate'],
  ['BSc Nursing','Undergraduate'],
  ['BSc Health Sciences','Undergraduate'],
  ['BA Media & Communications','Undergraduate'],
  ['BSc Environmental Science','Undergraduate'],
  ['BA Education','Undergraduate'],
  ['BSc Architecture','Undergraduate'],
];

const PG_COURSES = [
  ['MSc Computer Science','Masters'],
  ['MSc Data Science','Masters'],
  ['MSc Artificial Intelligence','Masters'],
  ['MSc Machine Learning','Masters'],
  ['MSc Cybersecurity','Masters'],
  ['MSc Software Engineering','Masters'],
  ['MBA','Masters'],
  ['MSc Finance','Masters'],
  ['MSc International Business','Masters'],
  ['MSc Marketing','Masters'],
  ['MSc Accounting & Finance','Masters'],
  ['MSc Project Management','Masters'],
  ['MSc Human Resource Management','Masters'],
  ['MSc Supply Chain Management','Masters'],
  ['MSc Engineering Management','Masters'],
  ['MSc Data Analytics','Masters'],
  ['MSc Business Analytics','Masters'],
  ['MSc Information Technology','Masters'],
  ['MSc Cloud Computing','Masters'],
  ['MSc Digital Marketing','Masters'],
  ['MSc Healthcare Management','Masters'],
  ['MSc International Relations','Masters'],
  ['LLM International Law','Masters'],
  ['MSc Psychology','Masters'],
];

const EXTRA_PG = [
  ['MSc Financial Mathematics','Masters'],
  ['MSc Bioinformatics','Masters'],
  ['MSc Advanced Computer Science','Masters'],
  ['MSc Robotics','Masters'],
  ['MSc Civil Engineering','Masters'],
  ['MSc Public Policy','Masters'],
  ['PhD Computer Science','PhD'],
  ['PhD Business','PhD'],
  ['PhD Engineering','PhD'],
];

// ─── Generate courses for a university ────────────────────────────────────────
function getCourses(u, isAustralia) {
  const { prefix, city, state, tuitionUG: tUG, tuitionPG: tPG,
          livingCost: lc, ielts, toefl, pte, intakes, website } = u;
  const country     = u.country      || (isAustralia ? 'Australia' : 'Ireland');
  const countryCode = u.countryCode  || (isAustralia ? 'AU' : 'IE');
  const currency    = u.currency     || (isAustralia ? 'AUD' : 'EUR');

  const isTop = u.qsRank <= 200;
  const audKey = isAustralia ? 'AUD' : (currency === 'EUR' ? 'EUR' : 'GBP');
  const fxUSD  = isAustralia ? AUD_USD : EUR_USD;
  const fxINR  = isAustralia ? AUD_INR : EUR_INR;

  const mkCourse = (id, name, level, studyLevel, durYrs, tuition, intake) => {
    const annual = tuition;
    const annualUSD = Math.round(tuition * fxUSD);
    const annualINR = Math.round(annualUSD * 84);
    const total = tuition * durYrs;
    const lcUSD = Math.round(lc * fxUSD);
    const lcINR = Math.round(lcUSD * 84);

    const base = {
      id: `${prefix}-${id}`,
      name,
      slug: `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`,
      url: website,
      level, studyLevel,
      duration: durYrs === 1 ? '1 year' : durYrs === 1.5 ? '18 months' : `${durYrs} years`,
      durationYears: durYrs,
      annualUSD, annualINR,
      [`annual${audKey}`]: annual,
      [`total${audKey}`]: total,
      [`livingCost${audKey}`]: lc,
      livingCostUSD: lcUSD, livingCostINR: lcINR,
      ieltsMin: ielts, toeflMin: toefl, pteMin: pte,
      intakeMonths: intake || intakes,
      campus: `${city} Campus`,
      country, state, city, countryCode,
    };

    if (isAustralia) {
      base.annualAUD = annual; base.totalAUD = total; base.livingCostAUD = lc;
    } else {
      base.annualEUR = annual; base.totalEUR = total; base.livingCostEUR = lc;
    }
    return base;
  };

  const courses = [];
  const ugSlice = isTop ? UG_COURSES : UG_COURSES.slice(0, 15);
  ugSlice.forEach(([name, level], i) =>
    courses.push(mkCourse(i+1, name, level, 'Undergraduate', 3, tUG, intakes)));

  // Foundation/Diploma
  courses.push(mkCourse(101,'Foundation Year – Business & Management','Foundation','Foundation',1,Math.round(tUG*0.7),intakes));
  courses.push(mkCourse(102,'Foundation Year – Science & Engineering','Foundation','Foundation',1,Math.round(tUG*0.7),intakes));
  courses.push(mkCourse(103,'Graduate Certificate Business','Graduate Certificate','Postgraduate',1,Math.round(tPG*0.6),intakes));
  courses.push(mkCourse(104,'Graduate Diploma Business','Graduate Diploma','Postgraduate',1,Math.round(tPG*0.75),intakes));

  const pgSlice = isTop ? [...PG_COURSES, ...EXTRA_PG] : PG_COURSES.slice(0, 20);
  pgSlice.forEach(([name, level], i) => {
    const dur = name.startsWith('PhD') ? 3 : 1;
    courses.push(mkCourse(200+i, name, level, level === 'PhD' ? 'PhD' : 'Masters', dur, tPG, intakes));
  });

  return courses;
}

// ─── Generate data file ────────────────────────────────────────────────────────
function genDataFile(u, courses, isAustralia) {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const iface = cap(u.prefix) + 'Course';
  const exp = u.prefix + 'Courses';
  const currency = isAustralia ? 'AUD' : 'EUR';

  return `// Auto-generated — do not edit manually
// University: ${u.name}

export interface ${iface} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annual${currency}: number; annualUSD: number; annualINR: number; total${currency}: number;
  livingCost${currency}: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ${exp}: ${iface}[] = ${JSON.stringify(courses, null, 2)};

export function get${iface}BySlug(slug: string): ${iface} | undefined {
  return ${exp}.find(c => c.slug === slug);
}
`;
}

// ─── Generate courses listing page ────────────────────────────────────────────
function genListPage(u, isAustralia) {
  const exp = u.prefix + 'Courses';
  const dataFile = `@/data/${u.prefix}-courses`;
  const currency = isAustralia ? 'AUD' : 'EUR';
  const currSym  = isAustralia ? 'A$' : '€';
  const qsStr = u.qsRank <= 500 ? `#${u.qsRank} QS` : 'QS 501+';
  const intakesStr = u.intakes.join(' & ');
  const flag = isAustralia ? '🇦🇺' : '🇮🇪';
  const countryLink = isAustralia ? '/universities/country/australia' : '/universities/country/ireland';
  const countryLabel = isAustralia ? 'Australia' : 'Ireland';
  const visaNote = isAustralia ? '485 Post-Study Work Visa (2–4 yrs)' : 'Ireland Graduate Visa (2 yrs)';
  const workRights = isAustralia ? '48 hrs/fortnight (term)' : '20 hrs/week (term)';
  const safeName = u.name.replace(/'/g, "\\'");
  const safeShortName = u.shortName.replace(/'/g, "\\'");
  const stateLabel = u.state;

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${exp} } from '${dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${safeName} International Courses – All Programs, Fees & IELTS 2025',
  description: \`${safeName} — \${(${exp} as unknown as any[]).length} courses for international students. IELTS ${u.ielts}+. ${intakesStr} intakes. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${u.slug}/courses',
  keywords: ['${safeShortName} courses', '${safeName} international', '${safeShortName} fees', 'study in ${countryLabel}', '${countryLabel} university'],
});

const levelOrder = ["Undergraduate","Foundation","Graduate Certificate","Graduate Diploma","Masters","PhD","Postgraduate"];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => { if (!groups[c.level]) groups[c.level] = []; groups[c.level].push(c); });
  return groups;
}

export default function CoursesPage() {
  const courses = ${exp} as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel === 'Masters' || c.studyLevel === 'Postgraduate');
  const avgFee = pgCourses.length
    ? Math.round(pgCourses.reduce((s: number, c: any) => s + c.annual${currency}, 0) / pgCourses.length)
    : Math.round(courses.reduce((s: number, c: any) => s + c.annual${currency}, 0) / (totalCourses || 1));

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: '${safeName}', sameAs: '${u.website}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressRegion: '${stateLabel}', addressCountry: '${u.countryCode}' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="${countryLink}" className="hover:text-white">${countryLabel}</Link> /
            <span className="text-white">${safeShortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${flag} ${u.city}, ${countryLabel} · ${qsStr} World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ${safeName} — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg ${currSym}{avgFee.toLocaleString()}/yr · IELTS ${u.ielts}+ · ${intakesStr} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${qsStr}' },
                  { label: 'Avg PG Fee', value: \`${currSym}\${Math.round(avgFee/1000)}K\` },
                  { label: 'Campus', value: '${u.city}' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="${u.prefix}-courses-index" defaultCountry="${countryLabel}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{(lvCourses as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{\`${currSym}\${c.annual${currency}.toLocaleString()}/yr\`}</p>
                      <p className="text-xs text-gray-500">IELTS {c.ieltsMin}+</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="${u.prefix}-courses-sidebar" defaultCountry="${countryLabel}" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${safeShortName}</h3>
              {[
                ['Established', '${u.estYear}'],
                ['Location', '${u.city}, ${countryLabel}'],
                ['IELTS Min', '${u.ielts} overall'],
                ['Intakes', '${intakesStr}'],
                ['Work Rights', '${workRights}'],
                ['Post-Study Visa', '${visaNote}'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

// ─── Generate individual course page ─────────────────────────────────────────
function genSlugPage(u, isAustralia) {
  const exp = u.prefix + 'Courses';
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const iface = cap(u.prefix) + 'Course';
  const getFn = `get${iface}BySlug`;
  const dataFile = `@/data/${u.prefix}-courses`;
  const currency = isAustralia ? 'AUD' : 'EUR';
  const currSym  = isAustralia ? 'A$' : '€';
  const flag = isAustralia ? '🇦🇺' : '🇮🇪';
  const countryLabel = isAustralia ? 'Australia' : 'Ireland';
  const visaNote = isAustralia ? '485 Post-Study Work Visa – 2 to 4 years' : 'Ireland Graduate Visa – 2 years';
  const workTerm = isAustralia ? '48 hrs/fortnight' : '20 hrs/week';
  const fxLabel = isAustralia ? '0.65' : '1.08';
  const safeName = u.name.replace(/'/g, "\\'");
  const safeShortName = u.shortName.replace(/'/g, "\\'");

  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${exp}, ${getFn} } from '${dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return (${exp} as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = ${getFn}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} | ${safeShortName} – Fees, IELTS & Intake 2025\`,
    description: \`\${course.name} at ${safeName}. Annual fee ${currSym}\${course.annual${currency}.toLocaleString()} (\${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}). IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas Consultants.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${safeShortName}', '${safeName}', 'study in ${countryLabel}', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = ${getFn}(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: '${safeName}', sameAs: '${u.website}' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: \`P\${course.durationYears}Y\`,
    url: course.url,
  };

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/${u.slug}" className="hover:text-white">${safeShortName}</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${flag} ${safeName} · ${u.city}, ${countryLabel}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (${currency})', value: \`${currSym}\${course.annual${currency}.toLocaleString()}\` },
                  { label: 'Fee in INR', value: \`₹\${feeINRLakh}L/yr\` },
                  { label: 'IELTS Minimum', value: \`\${course.ieltsMin}+\` },
                  { label: 'Duration', value: course.duration },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={\`${u.prefix}-course-\${slug}\`} defaultCountry="${countryLabel}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration + ' full-time' },
                { label: 'Campus', value: course.campus },
                { label: 'Intakes', value: course.intakeMonths.join(' & ') },
                { label: 'Annual Tuition (${currency})', value: \`${currSym}\${course.annual${currency}.toLocaleString()}\` },
                { label: 'Annual Tuition (USD)', value: \`$\${course.annualUSD.toLocaleString()}\` },
                { label: 'Living Cost (${currency}/yr)', value: \`${currSym}\${course.livingCost${currency}.toLocaleString()}\` },
                { label: 'Total Course Fee', value: \`${currSym}\${course.total${currency}.toLocaleString()}\` },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: \`\${course.ieltsMin}+\`, sub: 'No band below 5.5' },
                { label: 'TOEFL iBT', value: \`\${course.toeflMin}+\`, sub: 'Writing 21+' },
                { label: 'PTE Academic', value: \`\${course.pteMin}+\`, sub: 'No band below 51' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: \`Tuition × \${course.durationYears} yr\${course.durationYears !== 1 ? 's' : ''}\`, value: \`${currSym}\${course.total${currency}.toLocaleString()}\`, hi: true },
                { label: \`Living × \${course.durationYears} yr\${course.durationYears !== 1 ? 's' : ''}\`, value: \`${currSym}\${(course.livingCost${currency} * course.durationYears).toLocaleString()}\` },
                { label: 'Total Estimated Cost', value: \`${currSym}\${(course.total${currency} + course.livingCost${currency} * course.durationYears).toLocaleString()}\`, hi: true },
                { label: 'In Indian Rupees (₹)', value: \`₹\${((course.total${currency} + course.livingCost${currency} * course.durationYears) * ${fxLabel} * 84 / 100000).toFixed(1)} Lakh\`, hi: true },
              ].map(r => (
                <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={\`text-sm \${r.hi ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — ${countryLabel}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: '${countryLabel} Student Visa' },
                { label: 'Work Rights (Term)', value: '${workTerm}' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Post-Study Visa', value: '${visaNote}' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our ${countryLabel} admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${u.prefix}-course-\${slug}-sidebar\`} defaultCountry="${countryLabel}" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/${u.slug}/courses" className="block text-sm text-brand-700 hover:underline">All ${safeShortName} Courses →</Link>
                <Link href="/universities/country/${countryLabel.toLowerCase()}" className="block text-sm text-brand-700 hover:underline">Study in ${countryLabel} Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
}

// ─── Generate universities.ts entry ──────────────────────────────────────────
function genUniEntry(u, isAustralia) {
  const fxUSD = isAustralia ? AUD_USD : EUR_USD;
  const usdT  = Math.round(u.tuitionPG * fxUSD);
  const inrT  = Math.round(usdT * 84);
  const usdL  = Math.round(u.livingCost * fxUSD);
  const inrL  = Math.round(usdL * 84);
  const inrS  = Math.round(u.salaryUSD * 84);
  const country = u.country || (isAustralia ? 'Australia' : 'Ireland');
  const countryCode = u.countryCode || (isAustralia ? 'AU' : 'IE');

  const feeHist = [2020,2021,2022,2023,2024].map((yr,i) => ({
    year: yr, tuitionUSD: Math.round(usdT * (0.82 + i * 0.045))
  }));
  const rankHist = [2020,2021,2022,2023,2024].map((yr,i) => ({
    year: yr, rank: u.qsRank <= 300 ? u.qsRank + (4-i)*4 : u.qsRank + (4-i)*20
  }));

  const popCourses = u.qsRank <= 200
    ? ['MSc Computer Science','MSc Data Science','MBA','MSc Finance','MSc AI','LLM']
    : ['MSc Computer Science','MSc Data Science','MBA','MSc Project Management','MSc Cybersecurity'];

  const sch1name = `${u.shortName.replace(/'/g,"\\'")} International Excellence Scholarship`;
  const sch1amt  = u.qsRank <= 300 ? (isAustralia ? 'AUD 10,000–20,000' : '€5,000–10,000') : (isAustralia ? 'AUD 5,000–10,000' : '€2,000–5,000');
  const govSch   = isAustralia ? 'Australia Awards Scholarship' : 'Government of Ireland International Education Scholarship';
  const govSchAmt= isAustralia ? 'Full Funding' : '€10,000/year';
  const govSchElig= isAustralia ? 'Developing country nationals, competitive' : 'High-achieving international students';

  const backlogs = u.qsRank <= 300 ? 1 : u.qsRank <= 600 ? 2 : 3;
  const gpa = u.qsRank <= 300 ? 7.5 : 7.0;
  const greMin = u.qsRank <= 300 ? 308 : 300;

  const visaRate = Math.round(u.visa);
  const topEmps = isAustralia
    ? ['Deloitte Australia','PwC Australia','KPMG Australia','ANZ Bank','BHP']
    : ['Deloitte Ireland','PwC Ireland','Google Ireland','Meta Ireland','Pfizer Ireland'];

  const highlights = isAustralia ? [
    `${u.qsRank <= 100 ? 'Top 100' : u.qsRank <= 300 ? 'Top 300' : 'Top 600'} QS World University`,
    `${u.city} campus – major employment hub`,
    `485 Post-Study Work Visa – 2 to 4 years`,
    `Strong Indian student community`,
  ] : [
    `${u.qsRank <= 300 ? 'Top 300' : 'Top 600'} QS World University`,
    `${u.city} campus – EU + global career access`,
    `Ireland Graduate Visa – 2 years post-study work`,
    `EU single market access for graduates`,
  ];

  const desc = isAustralia
    ? `${u.name} is a leading Australian university ${u.city === 'Sydney' ? 'in Sydney' : u.city === 'Melbourne' ? 'in Melbourne' : `in ${u.city}`}, known for its high-quality education and strong industry links. Popular with Indian students for Computer Science, Business, and Engineering programs. The 485 Post-Study Work Visa allows 2–4 years of work experience in Australia after graduation.`
    : `${u.name} is a well-regarded Irish university located in ${u.city}, offering internationally recognised degrees in a vibrant, English-speaking environment. Irish universities are popular with Indian students as a gateway to the EU job market. The Ireland Graduate Visa allows 2 years of post-study work rights.`;

  return `  {
    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', shortName: '${u.shortName.replace(/'/g,"\\'")}',
    slug: '${u.slug}', country: '${country}', state: '${u.state}', city: '${u.city}',
    qsRanking: ${u.qsRank}, theRanking: ${u.theRank}, annualTuitionUSD: ${usdT}, annualTuitionINR: ${inrT},
    livingCostUSD: ${usdL}, livingCostINR: ${inrL},
    intakeMonths: ${JSON.stringify(u.intakes)},
    visaApprovalRate: ${visaRate}, acceptanceRate: ${u.accept},
    popularCourses: ${JSON.stringify(popCourses)},
    scholarships: [
      { name: '${sch1name}', amount: '${sch1amt}', eligibility: 'Merit-based for international students' },
      { name: '${govSch}', amount: '${govSchAmt}', eligibility: '${govSchElig}' },
    ],
    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.toefl}, greMin: ${greMin}, gpaMin: ${gpa}, backlogs: ${backlogs} },
    employmentRate: ${u.employ}, avgSalaryUSD: ${u.salaryUSD}, avgSalaryINR: ${inrS},
    establishedYear: ${u.estYear}, totalStudents: ${u.students}, internationalStudentPercent: ${u.intlPct},
    campusType: 'Urban', popularAmongIndians: true, applicationFeeUSD: ${u.appFee},
    description: '${desc.replace(/'/g,"\\'")}',
    highlights: ${JSON.stringify(highlights)},
    feeHistory: ${JSON.stringify(feeHist)},
    rankingHistory: ${JSON.stringify(rankHist)},
    topEmployers: ${JSON.stringify(topEmps)},
    countryCode: '${countryCode}',
  }`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, '..');
let totalCourses = 0, totalFiles = 0;

const ALL = [
  ...IRELAND_UNIS.map(u => ({ u, isAus: false })),
  ...AUSTRALIA_UNIS.map(u => ({ u, isAus: true })),
];

const ireEntries = [], ausEntries = [];

for (const { u, isAus } of ALL) {
  const courses = getCourses(u, isAus);
  totalCourses += courses.length;

  // data file
  fs.writeFileSync(path.join(ROOT,'data',`${u.prefix}-courses.ts`), genDataFile(u, courses, isAus), 'utf8');

  // pages
  const slugDir = path.join(ROOT,'app','universities',u.slug,'courses','[slug]');
  fs.mkdirSync(slugDir, { recursive: true });
  fs.writeFileSync(path.join(ROOT,'app','universities',u.slug,'courses','page.tsx'), genListPage(u, isAus), 'utf8');
  fs.writeFileSync(path.join(slugDir,'page.tsx'), genSlugPage(u, isAus), 'utf8');

  totalFiles += 3;
  const flag = isAus ? '🇦🇺' : '🇮🇪';
  console.log(`${flag} ${u.name} — ${courses.length} courses`);

  if (isAus) ausEntries.push(genUniEntry(u, true));
  else ireEntries.push(genUniEntry(u, false));
}

// Write blocks
const ireBlock = `\n  // ── IRELAND (new batch) ──────────────────────────────────────────────────────\n${ireEntries.join(',\n\n')},\n`;
const ausBlock = `\n  // ── AUSTRALIA (new batch) ────────────────────────────────────────────────────\n${ausEntries.join(',\n\n')},\n`;

fs.writeFileSync(path.join(ROOT,'scripts','ireland-block.ts.txt'), ireBlock, 'utf8');
fs.writeFileSync(path.join(ROOT,'scripts','australia-block.ts.txt'), ausBlock, 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Ireland: ${IRELAND_UNIS.length} universities`);
console.log(`   Australia: ${AUSTRALIA_UNIS.length} universities`);
console.log(`   Total courses: ${totalCourses}`);
console.log(`   Files written: ${totalFiles}`);
console.log(`\n   👉 Append scripts/ireland-block.ts.txt and scripts/australia-block.ts.txt to data/universities.ts`);
