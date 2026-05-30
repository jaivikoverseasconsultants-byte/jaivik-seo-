#!/usr/bin/env node
// generate-uk-universities.js
// Generates course data files and Next.js page components for 63 new UK universities

const fs = require('fs');
const path = require('path');

// GBP -> USD ~1.27, GBP -> INR ~107
const GBP_USD = 1.27;
const GBP_INR = 107;

// ─── University definitions ────────────────────────────────────────────────
const UNIVERSITIES = [
  { id:'uk13', prefix:'kcl',     name:"King's College London",           shortName:'KCL',          slug:'kings-college-london',           city:'London',         state:'England', qsRank:40,   theRank:35,  tuitionUG:27000, tuitionPG:30000, livingCost:18000, ielts:6.5, toefl:92, pte:65, intakes:['September'],            estYear:1829, students:33000, intlPct:42, accept:30, visa:80, employ:93, salaryUSD:68000, appFee:0, type:'russell',   website:'https://www.kcl.ac.uk' },
  { id:'uk14', prefix:'lse',     name:'London School of Economics',      shortName:'LSE',           slug:'london-school-of-economics',     city:'London',         state:'England', qsRank:45,   theRank:27,  tuitionUG:22000, tuitionPG:28000, livingCost:19000, ielts:7.0, toefl:100,pte:70, intakes:['September'],            estYear:1895, students:12000, intlPct:70, accept:16, visa:79, employ:95, salaryUSD:72000, appFee:0, type:'russell',   website:'https://www.lse.ac.uk' },
  { id:'uk15', prefix:'bristol', name:'University of Bristol',           shortName:'Bristol',       slug:'university-of-bristol',          city:'Bristol',        state:'England', qsRank:51,   theRank:58,  tuitionUG:24000, tuitionPG:26000, livingCost:14000, ielts:6.5, toefl:90, pte:62, intakes:['September'],            estYear:1909, students:28000, intlPct:38, accept:32, visa:80, employ:92, salaryUSD:62000, appFee:0, type:'russell',   website:'https://www.bristol.ac.uk' },
  { id:'uk16', prefix:'warwick', name:'University of Warwick',           shortName:'Warwick',       slug:'university-of-warwick',          city:'Coventry',       state:'England', qsRank:67,   theRank:73,  tuitionUG:27000, tuitionPG:28000, livingCost:13000, ielts:6.5, toefl:92, pte:62, intakes:['October'],              estYear:1965, students:27000, intlPct:46, accept:35, visa:81, employ:93, salaryUSD:65000, appFee:0, type:'russell',   website:'https://www.warwick.ac.uk' },
  { id:'uk17', prefix:'durhamuni',name:'Durham University',               shortName:'Durham',        slug:'durham-university',              city:'Durham',         state:'England', qsRank:78,   theRank:92,  tuitionUG:24500, tuitionPG:25500, livingCost:12000, ielts:6.5, toefl:90, pte:62, intakes:['October'],              estYear:1832, students:20000, intlPct:35, accept:37, visa:81, employ:90, salaryUSD:60000, appFee:0, type:'russell',   website:'https://www.durham.ac.uk' },
  { id:'uk18', prefix:'glasgow', name:'University of Glasgow',           shortName:'Glasgow',       slug:'university-of-glasgow',          city:'Glasgow',        state:'Scotland',qsRank:81,   theRank:92,  tuitionUG:22000, tuitionPG:24000, livingCost:12000, ielts:6.5, toefl:90, pte:59, intakes:['September'],            estYear:1451, students:38000, intlPct:33, accept:38, visa:80, employ:90, salaryUSD:58000, appFee:0, type:'russell',   website:'https://www.gla.ac.uk' },
  { id:'uk19', prefix:'sheffield',name:'University of Sheffield',        shortName:'Sheffield',     slug:'university-of-sheffield',        city:'Sheffield',      state:'England', qsRank:104,  theRank:107, tuitionUG:22500, tuitionPG:24000, livingCost:12000, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1905, students:29000, intlPct:36, accept:40, visa:80, employ:90, salaryUSD:57000, appFee:0, type:'russell',   website:'https://www.sheffield.ac.uk' },
  { id:'uk20', prefix:'soton',   name:'University of Southampton',       shortName:'Southampton',   slug:'university-of-southampton',      city:'Southampton',    state:'England', qsRank:81,   theRank:127, tuitionUG:23000, tuitionPG:25000, livingCost:13000, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1952, students:26000, intlPct:41, accept:36, visa:81, employ:91, salaryUSD:59000, appFee:0, type:'russell',   website:'https://www.southampton.ac.uk' },
  { id:'uk21', prefix:'exeter',  name:'University of Exeter',            shortName:'Exeter',        slug:'university-of-exeter',           city:'Exeter',         state:'England', qsRank:149,  theRank:201, tuitionUG:22500, tuitionPG:24000, livingCost:12500, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1955, students:25000, intlPct:35, accept:40, visa:80, employ:89, salaryUSD:56000, appFee:0, type:'russell',   website:'https://www.exeter.ac.uk' },
  { id:'uk22', prefix:'bath',    name:'University of Bath',              shortName:'Bath',          slug:'university-of-bath',             city:'Bath',           state:'England', qsRank:179,  theRank:201, tuitionUG:24000, tuitionPG:25000, livingCost:13500, ielts:6.5, toefl:90, pte:62, intakes:['September'],            estYear:1966, students:18000, intlPct:36, accept:38, visa:81, employ:92, salaryUSD:61000, appFee:0, type:'russell',   website:'https://www.bath.ac.uk' },
  { id:'uk23', prefix:'nottm',   name:'University of Nottingham',        shortName:'Nottingham',    slug:'university-of-nottingham',       city:'Nottingham',     state:'England', qsRank:103,  theRank:127, tuitionUG:22000, tuitionPG:24000, livingCost:12000, ielts:6.5, toefl:87, pte:59, intakes:['September'],            estYear:1881, students:36000, intlPct:38, accept:42, visa:81, employ:91, salaryUSD:58000, appFee:0, type:'russell',   website:'https://www.nottingham.ac.uk' },
  { id:'uk24', prefix:'leicester',name:'University of Leicester',        shortName:'Leicester',     slug:'university-of-leicester',        city:'Leicester',      state:'England', qsRank:300,  theRank:301, tuitionUG:20000, tuitionPG:22000, livingCost:12000, ielts:6.0, toefl:85, pte:58, intakes:['September'],            estYear:1921, students:18000, intlPct:36, accept:50, visa:79, employ:88, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.le.ac.uk' },
  { id:'uk25', prefix:'ncl',     name:'Newcastle University',            shortName:'Newcastle',     slug:'newcastle-university',           city:'Newcastle',      state:'England', qsRank:110,  theRank:175, tuitionUG:23500, tuitionPG:25000, livingCost:12000, ielts:6.5, toefl:90, pte:62, intakes:['September'],            estYear:1834, students:28000, intlPct:32, accept:38, visa:80, employ:90, salaryUSD:59000, appFee:0, type:'russell',   website:'https://www.ncl.ac.uk' },
  { id:'uk26', prefix:'qmul',    name:'Queen Mary University of London', shortName:'QMUL',          slug:'queen-mary-university-london',   city:'London',         state:'England', qsRank:127,  theRank:127, tuitionUG:23000, tuitionPG:25000, livingCost:18000, ielts:6.5, toefl:90, pte:62, intakes:['September'],            estYear:1885, students:27000, intlPct:48, accept:44, visa:80, employ:90, salaryUSD:60000, appFee:0, type:'russell',   website:'https://www.qmul.ac.uk' },
  { id:'uk27', prefix:'lancs',   name:'Lancaster University',            shortName:'Lancaster',     slug:'lancaster-university',           city:'Lancaster',      state:'England', qsRank:140,  theRank:175, tuitionUG:21500, tuitionPG:23000, livingCost:11000, ielts:6.0, toefl:87, pte:59, intakes:['October'],              estYear:1964, students:16000, intlPct:40, accept:44, visa:80, employ:89, salaryUSD:56000, appFee:0, type:'russell',   website:'https://www.lancaster.ac.uk' },
  { id:'uk28', prefix:'yorkuni', name:'University of York',              shortName:'York',          slug:'university-of-york',             city:'York',           state:'England', qsRank:171,  theRank:175, tuitionUG:22000, tuitionPG:23500, livingCost:11500, ielts:6.0, toefl:87, pte:59, intakes:['October'],              estYear:1963, students:22000, intlPct:36, accept:44, visa:80, employ:90, salaryUSD:57000, appFee:0, type:'russell',   website:'https://www.york.ac.uk' },
  { id:'uk29', prefix:'cardiff', name:'Cardiff University',              shortName:'Cardiff',       slug:'cardiff-university',             city:'Cardiff',        state:'Wales',   qsRank:163,  theRank:175, tuitionUG:22000, tuitionPG:24000, livingCost:12000, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1883, students:31000, intlPct:32, accept:45, visa:79, employ:89, salaryUSD:56000, appFee:0, type:'russell',   website:'https://www.cardiff.ac.uk' },
  { id:'uk30', prefix:'abdn',    name:'University of Aberdeen',          shortName:'Aberdeen',      slug:'university-of-aberdeen',         city:'Aberdeen',       state:'Scotland',qsRank:301,  theRank:301, tuitionUG:18000, tuitionPG:20000, livingCost:11000, ielts:6.0, toefl:83, pte:55, intakes:['September'],            estYear:1495, students:17000, intlPct:36, accept:55, visa:79, employ:87, salaryUSD:51000, appFee:0, type:'mid',       website:'https://www.abdn.ac.uk' },
  { id:'uk31', prefix:'surrey',  name:'University of Surrey',            shortName:'Surrey',        slug:'university-of-surrey',           city:'Guildford',      state:'England', qsRank:301,  theRank:401, tuitionUG:20000, tuitionPG:21500, livingCost:14000, ielts:6.0, toefl:85, pte:59, intakes:['September'],            estYear:1966, students:16000, intlPct:44, accept:50, visa:80, employ:90, salaryUSD:55000, appFee:0, type:'mid',       website:'https://www.surrey.ac.uk' },
  { id:'uk32', prefix:'lboro',   name:'Loughborough University',         shortName:'Loughborough',  slug:'loughborough-university',        city:'Loughborough',   state:'England', qsRank:226,  theRank:251, tuitionUG:22000, tuitionPG:24000, livingCost:12000, ielts:6.0, toefl:88, pte:59, intakes:['October'],              estYear:1909, students:18000, intlPct:35, accept:44, visa:80, employ:93, salaryUSD:58000, appFee:0, type:'mid',       website:'https://www.lboro.ac.uk' },
  { id:'uk33', prefix:'rdg',     name:'University of Reading',           shortName:'Reading',       slug:'university-of-reading',          city:'Reading',        state:'England', qsRank:251,  theRank:251, tuitionUG:21000, tuitionPG:23000, livingCost:14000, ielts:6.0, toefl:85, pte:59, intakes:['September'],            estYear:1892, students:20000, intlPct:38, accept:50, visa:79, employ:87, salaryUSD:54000, appFee:0, type:'mid',       website:'https://www.reading.ac.uk' },
  { id:'uk34', prefix:'kent',    name:'University of Kent',              shortName:'Kent',          slug:'university-of-kent',             city:'Canterbury',     state:'England', qsRank:601,  theRank:601, tuitionUG:17000, tuitionPG:19500, livingCost:13000, ielts:6.0, toefl:80, pte:55, intakes:['September'],            estYear:1965, students:21000, intlPct:35, accept:55, visa:78, employ:85, salaryUSD:49000, appFee:0, type:'mid',       website:'https://www.kent.ac.uk' },
  { id:'uk35', prefix:'essex',   name:'University of Essex',             shortName:'Essex',         slug:'university-of-essex',            city:'Colchester',     state:'England', qsRank:401,  theRank:401, tuitionUG:18000, tuitionPG:20000, livingCost:13000, ielts:6.0, toefl:80, pte:55, intakes:['October'],              estYear:1964, students:18000, intlPct:45, accept:58, visa:78, employ:85, salaryUSD:48000, appFee:0, type:'mid',       website:'https://www.essex.ac.uk' },
  { id:'uk36', prefix:'city',    name:'City, University of London',      shortName:'City London',   slug:'city-university-london',         city:'London',         state:'England', qsRank:401,  theRank:501, tuitionUG:19000, tuitionPG:22000, livingCost:19000, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1894, students:19000, intlPct:44, accept:50, visa:79, employ:88, salaryUSD:54000, appFee:0, type:'mid',       website:'https://www.city.ac.uk' },
  { id:'uk37', prefix:'hw',      name:'Heriot-Watt University',          shortName:'Heriot-Watt',   slug:'heriot-watt-university',         city:'Edinburgh',      state:'Scotland',qsRank:399,  theRank:401, tuitionUG:18000, tuitionPG:20000, livingCost:12000, ielts:6.0, toefl:83, pte:55, intakes:['September'],            estYear:1821, students:12000, intlPct:50, accept:55, visa:79, employ:88, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.hw.ac.uk' },
  { id:'uk38', prefix:'strath',  name:'University of Strathclyde',       shortName:'Strathclyde',   slug:'university-of-strathclyde',      city:'Glasgow',        state:'Scotland',qsRank:351,  theRank:351, tuitionUG:19000, tuitionPG:21000, livingCost:12000, ielts:6.0, toefl:85, pte:58, intakes:['September'],            estYear:1796, students:25000, intlPct:34, accept:50, visa:79, employ:88, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.strath.ac.uk' },
  { id:'uk39', prefix:'dundee',  name:'University of Dundee',            shortName:'Dundee',        slug:'university-of-dundee',           city:'Dundee',         state:'Scotland',qsRank:401,  theRank:401, tuitionUG:17500, tuitionPG:19500, livingCost:11000, ielts:6.0, toefl:80, pte:55, intakes:['September'],            estYear:1881, students:19000, intlPct:32, accept:55, visa:78, employ:86, salaryUSD:49000, appFee:0, type:'mid',       website:'https://www.dundee.ac.uk' },
  { id:'uk40', prefix:'swansea', name:'Swansea University',              shortName:'Swansea',       slug:'swansea-university',             city:'Swansea',        state:'Wales',   qsRank:401,  theRank:301, tuitionUG:18500, tuitionPG:20500, livingCost:11500, ielts:6.0, toefl:83, pte:58, intakes:['September'],            estYear:1920, students:21000, intlPct:34, accept:55, visa:78, employ:86, salaryUSD:50000, appFee:0, type:'mid',       website:'https://www.swansea.ac.uk' },
  { id:'uk41', prefix:'aston',   name:'Aston University',                shortName:'Aston',         slug:'aston-university',               city:'Birmingham',     state:'England', qsRank:401,  theRank:601, tuitionUG:18500, tuitionPG:21000, livingCost:12000, ielts:6.0, toefl:83, pte:58, intakes:['September'],            estYear:1895, students:16000, intlPct:35, accept:52, visa:79, employ:90, salaryUSD:53000, appFee:0, type:'mid',       website:'https://www.aston.ac.uk' },
  { id:'uk42', prefix:'gold',    name:'Goldsmiths, University of London',shortName:'Goldsmiths',    slug:'goldsmiths-university-london',   city:'London',         state:'England', qsRank:601,  theRank:601, tuitionUG:18000, tuitionPG:20000, livingCost:18000, ielts:6.0, toefl:83, pte:55, intakes:['September'],            estYear:1891, students:10000, intlPct:44, accept:58, visa:79, employ:84, salaryUSD:47000, appFee:0, type:'mid',       website:'https://www.gold.ac.uk' },
  { id:'uk43', prefix:'rhul',    name:'Royal Holloway, University of London',shortName:'Royal Holloway',slug:'royal-holloway-university-london',city:'London',   state:'England', qsRank:501,  theRank:501, tuitionUG:20000, tuitionPG:22000, livingCost:16000, ielts:6.5, toefl:88, pte:59, intakes:['September'],            estYear:1849, students:12000, intlPct:42, accept:52, visa:79, employ:86, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.royalholloway.ac.uk' },
  { id:'uk44', prefix:'sussex',  name:'University of Sussex',            shortName:'Sussex',        slug:'university-of-sussex',           city:'Brighton',       state:'England', qsRank:401,  theRank:201, tuitionUG:19000, tuitionPG:21500, livingCost:14000, ielts:6.5, toefl:88, pte:62, intakes:['September'],            estYear:1961, students:20000, intlPct:47, accept:50, visa:79, employ:87, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.sussex.ac.uk' },
  { id:'uk45', prefix:'bcu',     name:'Birmingham City University',      shortName:'BCU',           slug:'birmingham-city-university',     city:'Birmingham',     state:'England', qsRank:801,  theRank:801, tuitionUG:14500, tuitionPG:16500, livingCost:12000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1992, students:27000, intlPct:30, accept:65, visa:77, employ:85, salaryUSD:42000, appFee:0, type:'post92',    website:'https://www.bcu.ac.uk' },
  { id:'uk46', prefix:'mmu',     name:'Manchester Metropolitan University',shortName:'MMU',         slug:'manchester-metropolitan-university',city:'Manchester',  state:'England', qsRank:801,  theRank:801, tuitionUG:15000, tuitionPG:17000, livingCost:13000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1970, students:40000, intlPct:25, accept:65, visa:78, employ:86, salaryUSD:42000, appFee:0, type:'post92',    website:'https://www.mmu.ac.uk' },
  { id:'uk47', prefix:'uwe',     name:'University of the West of England',shortName:'UWE Bristol',  slug:'university-of-west-of-england',  city:'Bristol',        state:'England', qsRank:801,  theRank:801, tuitionUG:14500, tuitionPG:16500, livingCost:13000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1992, students:28000, intlPct:24, accept:65, visa:78, employ:85, salaryUSD:41000, appFee:0, type:'post92',    website:'https://www.uwe.ac.uk' },
  { id:'uk48', prefix:'brookes', name:'Oxford Brookes University',       shortName:'Oxford Brookes',slug:'oxford-brookes-university',      city:'Oxford',         state:'England', qsRank:701,  theRank:801, tuitionUG:15000, tuitionPG:17000, livingCost:14500, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1865, students:18000, intlPct:35, accept:62, visa:78, employ:86, salaryUSD:43000, appFee:0, type:'post92',    website:'https://www.brookes.ac.uk' },
  { id:'uk49', prefix:'kingston',name:'Kingston University London',      shortName:'Kingston',      slug:'kingston-university-london',     city:'London',         state:'England', qsRank:801,  theRank:801, tuitionUG:14000, tuitionPG:16000, livingCost:18000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1899, students:19000, intlPct:40, accept:70, visa:77, employ:84, salaryUSD:42000, appFee:0, type:'post92',    website:'https://www.kingston.ac.uk' },
  { id:'uk50', prefix:'uel',     name:'University of East London',       shortName:'UEL',           slug:'university-of-east-london',      city:'London',         state:'England', qsRank:1001, theRank:1001,tuitionUG:13500, tuitionPG:15500, livingCost:18000, ielts:5.5, toefl:75, pte:51, intakes:['September','January'],  estYear:1898, students:18000, intlPct:42, accept:75, visa:76, employ:82, salaryUSD:39000, appFee:0, type:'post92',    website:'https://www.uel.ac.uk' },
  { id:'uk51', prefix:'greenwich',name:'University of Greenwich',        shortName:'Greenwich',     slug:'university-of-greenwich',        city:'London',         state:'England', qsRank:801,  theRank:801, tuitionUG:14000, tuitionPG:16000, livingCost:18000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1890, students:22000, intlPct:38, accept:70, visa:77, employ:83, salaryUSD:40000, appFee:0, type:'post92',    website:'https://www.gre.ac.uk' },
  { id:'uk52', prefix:'londonmet',name:'London Metropolitan University', shortName:'London Met',    slug:'london-metropolitan-university', city:'London',         state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:15000, livingCost:18000, ielts:5.5, toefl:72, pte:51, intakes:['September','January'],  estYear:1848, students:16000, intlPct:40, accept:78, visa:75, employ:80, salaryUSD:37000, appFee:0, type:'post92',    website:'https://www.londonmet.ac.uk' },
  { id:'uk53', prefix:'salford', name:'University of Salford',           shortName:'Salford',       slug:'university-of-salford',          city:'Salford',        state:'England', qsRank:801,  theRank:801, tuitionUG:14500, tuitionPG:16500, livingCost:13000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1896, students:21000, intlPct:32, accept:68, visa:77, employ:84, salaryUSD:41000, appFee:0, type:'post92',    website:'https://www.salford.ac.uk' },
  { id:'uk54', prefix:'plymouth',name:'University of Plymouth',          shortName:'Plymouth',      slug:'university-of-plymouth',         city:'Plymouth',       state:'England', qsRank:601,  theRank:601, tuitionUG:15000, tuitionPG:17000, livingCost:12000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1992, students:18000, intlPct:28, accept:65, visa:78, employ:85, salaryUSD:42000, appFee:0, type:'post92',    website:'https://www.plymouth.ac.uk' },
  { id:'uk55', prefix:'brighton',name:'University of Brighton',          shortName:'Brighton',      slug:'university-of-brighton',         city:'Brighton',       state:'England', qsRank:801,  theRank:801, tuitionUG:14000, tuitionPG:16000, livingCost:14000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1859, students:21000, intlPct:28, accept:68, visa:77, employ:84, salaryUSD:41000, appFee:0, type:'post92',    website:'https://www.brighton.ac.uk' },
  { id:'uk56', prefix:'bmouth',  name:'Bournemouth University',          shortName:'Bournemouth',   slug:'bournemouth-university',         city:'Bournemouth',    state:'England', qsRank:801,  theRank:601, tuitionUG:15000, tuitionPG:17000, livingCost:12500, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1992, students:19000, intlPct:28, accept:65, visa:78, employ:87, salaryUSD:42000, appFee:0, type:'post92',    website:'https://www.bournemouth.ac.uk' },
  { id:'uk57', prefix:'uclan',   name:'University of Central Lancashire',shortName:'UCLan',         slug:'university-of-central-lancashire',city:'Preston',       state:'England', qsRank:801,  theRank:801, tuitionUG:14000, tuitionPG:15500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1828, students:35000, intlPct:24, accept:68, visa:77, employ:84, salaryUSD:40000, appFee:0, type:'post92',    website:'https://www.uclan.ac.uk' },
  { id:'uk58', prefix:'hudds',   name:'University of Huddersfield',      shortName:'Huddersfield',  slug:'university-of-huddersfield',     city:'Huddersfield',   state:'England', qsRank:801,  theRank:801, tuitionUG:13500, tuitionPG:15500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1841, students:19000, intlPct:25, accept:70, visa:77, employ:85, salaryUSD:40000, appFee:0, type:'post92',    website:'https://www.hud.ac.uk' },
  { id:'uk59', prefix:'bradford',name:'University of Bradford',          shortName:'Bradford',      slug:'university-of-bradford',         city:'Bradford',       state:'England', qsRank:601,  theRank:601, tuitionUG:14000, tuitionPG:16000, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1882, students:14000, intlPct:30, accept:65, visa:77, employ:85, salaryUSD:41000, appFee:0, type:'post92',    website:'https://www.bradford.ac.uk' },
  { id:'uk60', prefix:'sunderland',name:'University of Sunderland',      shortName:'Sunderland',    slug:'university-of-sunderland',       city:'Sunderland',     state:'England', qsRank:801,  theRank:801, tuitionUG:13000, tuitionPG:15000, livingCost:11000, ielts:5.5, toefl:75, pte:51, intakes:['September','January'],  estYear:1901, students:17000, intlPct:27, accept:72, visa:76, employ:83, salaryUSD:38000, appFee:0, type:'post92',    website:'https://www.sunderland.ac.uk' },
  { id:'uk61', prefix:'tees',    name:'Teesside University',             shortName:'Teesside',      slug:'teesside-university',            city:'Middlesbrough',  state:'England', qsRank:801,  theRank:801, tuitionUG:13500, tuitionPG:15000, livingCost:11000, ielts:5.5, toefl:75, pte:51, intakes:['September','January'],  estYear:1930, students:19000, intlPct:22, accept:72, visa:76, employ:83, salaryUSD:38000, appFee:0, type:'post92',    website:'https://www.tees.ac.uk' },
  { id:'uk62', prefix:'derby',   name:'University of Derby',             shortName:'Derby',         slug:'university-of-derby',            city:'Derby',          state:'England', qsRank:801,  theRank:801, tuitionUG:13500, tuitionPG:15500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1851, students:19000, intlPct:22, accept:68, visa:77, employ:84, salaryUSD:40000, appFee:0, type:'post92',    website:'https://www.derby.ac.uk' },
  { id:'uk63', prefix:'lincoln', name:'University of Lincoln',           shortName:'Lincoln',       slug:'university-of-lincoln',          city:'Lincoln',        state:'England', qsRank:601,  theRank:601, tuitionUG:14500, tuitionPG:16500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1996, students:17000, intlPct:22, accept:65, visa:78, employ:86, salaryUSD:41000, appFee:0, type:'post92',    website:'https://www.lincoln.ac.uk' },
  { id:'uk64', prefix:'wolves',  name:'University of Wolverhampton',     shortName:'Wolverhampton', slug:'university-of-wolverhampton',    city:'Wolverhampton',  state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:15000, livingCost:11000, ielts:5.5, toefl:75, pte:51, intakes:['September','January'],  estYear:1992, students:18000, intlPct:26, accept:75, visa:76, employ:81, salaryUSD:37000, appFee:0, type:'post92',    website:'https://www.wlv.ac.uk' },
  { id:'uk65', prefix:'staffs',  name:'Staffordshire University',        shortName:'Staffordshire', slug:'staffordshire-university',       city:'Stoke-on-Trent', state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:15000, livingCost:11000, ielts:5.5, toefl:75, pte:51, intakes:['September','January'],  estYear:1914, students:16000, intlPct:20, accept:75, visa:76, employ:81, salaryUSD:36000, appFee:0, type:'post92',    website:'https://www.staffs.ac.uk' },
  { id:'uk66', prefix:'beds',    name:'University of Bedfordshire',      shortName:'Bedfordshire',  slug:'university-of-bedfordshire',     city:'Luton',          state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:14500, livingCost:12500, ielts:5.5, toefl:72, pte:51, intakes:['September','January'],  estYear:1882, students:21000, intlPct:34, accept:78, visa:75, employ:80, salaryUSD:36000, appFee:0, type:'post92',    website:'https://www.beds.ac.uk' },
  { id:'uk67', prefix:'uea',     name:'University of East Anglia',       shortName:'UEA',           slug:'university-of-east-anglia',      city:'Norwich',        state:'England', qsRank:301,  theRank:251, tuitionUG:20000, tuitionPG:22000, livingCost:12500, ielts:6.5, toefl:88, pte:62, intakes:['September'],            estYear:1963, students:17000, intlPct:35, accept:52, visa:79, employ:88, salaryUSD:52000, appFee:0, type:'mid',       website:'https://www.uea.ac.uk' },
  { id:'uk68', prefix:'stirling',name:'University of Stirling',          shortName:'Stirling',      slug:'university-of-stirling',         city:'Stirling',       state:'Scotland',qsRank:401,  theRank:401, tuitionUG:16500, tuitionPG:18500, livingCost:11000, ielts:6.0, toefl:80, pte:55, intakes:['September'],            estYear:1967, students:14000, intlPct:32, accept:58, visa:78, employ:86, salaryUSD:48000, appFee:0, type:'mid',       website:'https://www.stir.ac.uk' },
  { id:'uk69', prefix:'rgu',     name:'Robert Gordon University',        shortName:'RGU',           slug:'robert-gordon-university',       city:'Aberdeen',       state:'Scotland',qsRank:601,  theRank:601, tuitionUG:15000, tuitionPG:17500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1750, students:12000, intlPct:26, accept:60, visa:78, employ:91, salaryUSD:50000, appFee:0, type:'post92',    website:'https://www.rgu.ac.uk' },
  { id:'uk70', prefix:'usw',     name:'University of South Wales',       shortName:'USW',           slug:'university-of-south-wales',      city:'Pontypridd',     state:'Wales',   qsRank:801,  theRank:801, tuitionUG:13500, tuitionPG:15500, livingCost:11000, ielts:6.0, toefl:79, pte:51, intakes:['September','January'],  estYear:1992, students:23000, intlPct:22, accept:70, visa:76, employ:83, salaryUSD:39000, appFee:0, type:'post92',    website:'https://www.southwales.ac.uk' },
  { id:'uk71', prefix:'ual',     name:'University of the Arts London',   shortName:'UAL',           slug:'university-of-the-arts-london',  city:'London',         state:'England', qsRank:51,   theRank:301, tuitionUG:20000, tuitionPG:22000, livingCost:19000, ielts:6.0, toefl:83, pte:58, intakes:['September'],            estYear:1989, students:20000, intlPct:55, accept:62, visa:78, employ:85, salaryUSD:48000, appFee:0, type:'specialist', website:'https://www.arts.ac.uk' },
  { id:'uk72', prefix:'roeham',  name:'University of Roehampton',        shortName:'Roehampton',    slug:'university-of-roehampton',       city:'London',         state:'England', qsRank:801,  theRank:801, tuitionUG:13500, tuitionPG:15500, livingCost:18000, ielts:6.0, toefl:79, pte:51, intakes:['September'],            estYear:1841, students:10000, intlPct:38, accept:70, visa:76, employ:82, salaryUSD:40000, appFee:0, type:'post92',    website:'https://www.roehampton.ac.uk' },
  { id:'uk73', prefix:'worcs',   name:'University of Worcester',         shortName:'Worcester',     slug:'university-of-worcester',        city:'Worcester',      state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:14500, livingCost:11000, ielts:5.5, toefl:75, pte:51, intakes:['September'],            estYear:1946, students:11000, intlPct:15, accept:75, visa:76, employ:82, salaryUSD:36000, appFee:0, type:'post92',    website:'https://www.worcester.ac.uk' },
  { id:'uk74', prefix:'glos',    name:'University of Gloucestershire',   shortName:'Gloucestershire',slug:'university-of-gloucestershire', city:'Cheltenham',     state:'England', qsRank:1001, theRank:1001,tuitionUG:13000, tuitionPG:14500, livingCost:11500, ielts:5.5, toefl:75, pte:51, intakes:['September'],            estYear:1847, students:10000, intlPct:14, accept:75, visa:76, employ:82, salaryUSD:36000, appFee:0, type:'post92',    website:'https://www.glos.ac.uk' },
  { id:'uk75', prefix:'suffolk', name:'University of Suffolk',           shortName:'Suffolk',       slug:'university-of-suffolk',          city:'Ipswich',        state:'England', qsRank:1001, theRank:1001,tuitionUG:12500, tuitionPG:14000, livingCost:11500, ielts:5.5, toefl:72, pte:51, intakes:['September'],            estYear:2007, students:7000,  intlPct:18, accept:78, visa:75, employ:80, salaryUSD:35000, appFee:0, type:'post92',    website:'https://www.uos.ac.uk' },
];

// ─── Course templates per university type ────────────────────────────────────
function getCourses(u) {
  const { prefix, city, state, type, tuitionUG, tuitionPG, livingCost, ielts, toefl, pte, intakes, website } = u;
  const ug = tuitionUG;
  const pg = tuitionPG;
  const lc = livingCost;

  const mkCourse = (id, name, level, studyLevel, durYrs, tuition, intake) => {
    const annualGBP = tuition;
    const annualUSD = Math.round(tuition * GBP_USD);
    const annualINR = Math.round(tuition * GBP_INR);
    const totalGBP = tuition * durYrs;
    return {
      id: `${prefix}-${id}`,
      name,
      slug: `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`,
      url: website,
      level,
      studyLevel,
      duration: durYrs === 1 ? '1 year' : durYrs === 1.5 ? '18 months' : `${durYrs} years`,
      durationYears: durYrs,
      annualGBP,
      annualUSD,
      annualINR,
      totalGBP,
      livingCostGBP: lc,
      livingCostUSD: Math.round(lc * GBP_USD),
      livingCostINR: Math.round(lc * GBP_INR),
      ieltsMin: ielts,
      toeflMin: toefl,
      pteMin: pte,
      intakeMonths: intake || intakes,
      campus: `${city} Campus`,
      country: 'United Kingdom',
      state,
      city,
      countryCode: 'GB',
    };
  };

  // Build courses based on type
  const courses = [];

  // ── Undergraduate (3 yrs) ──────────────────────────────────────
  const ugCourses3yr = [
    ['BSc Computer Science', 'Undergraduate'],
    ['BSc Software Engineering', 'Undergraduate'],
    ['BSc Data Science', 'Undergraduate'],
    ['BSc Cybersecurity', 'Undergraduate'],
    ['BSc Artificial Intelligence', 'Undergraduate'],
    ['BSc Business Administration', 'Undergraduate'],
    ['BSc Accounting & Finance', 'Undergraduate'],
    ['BSc Marketing', 'Undergraduate'],
    ['BEng Mechanical Engineering', 'Undergraduate'],
    ['BEng Civil Engineering', 'Undergraduate'],
    ['BEng Electrical Engineering', 'Undergraduate'],
    ['BSc Psychology', 'Undergraduate'],
    ['BSc Economics', 'Undergraduate'],
    ['BSc International Business', 'Undergraduate'],
    ['BA Media & Communications', 'Undergraduate'],
    ['BSc Nursing (Adult)', 'Undergraduate'],
    ['BSc Health Sciences', 'Undergraduate'],
    ['BA English Literature', 'Undergraduate'],
    ['BSc Environmental Science', 'Undergraduate'],
    ['BA Business & Management', 'Undergraduate'],
  ];

  // ── Masters (1 yr) ──────────────────────────────────────
  const pgCourses1yr = [
    ['MSc Computer Science', 'Masters'],
    ['MSc Data Science', 'Masters'],
    ['MSc Artificial Intelligence', 'Masters'],
    ['MSc Machine Learning', 'Masters'],
    ['MSc Cybersecurity', 'Masters'],
    ['MSc Software Engineering', 'Masters'],
    ['MBA', 'Masters'],
    ['MSc Finance', 'Masters'],
    ['MSc International Business', 'Masters'],
    ['MSc Marketing', 'Masters'],
    ['MSc Accounting & Finance', 'Masters'],
    ['MSc Project Management', 'Masters'],
    ['MSc Human Resource Management', 'Masters'],
    ['MSc Supply Chain Management', 'Masters'],
    ['MSc Engineering Management', 'Masters'],
    ['MSc Data Analytics', 'Masters'],
    ['MSc Business Analytics', 'Masters'],
    ['MSc Information Technology', 'Masters'],
    ['MSc Cloud Computing', 'Masters'],
    ['MSc Digital Marketing', 'Masters'],
    ['MSc Healthcare Management', 'Masters'],
    ['MSc International Relations', 'Masters'],
    ['LLM International Law', 'Masters'],
    ['MSc Psychology', 'Masters'],
    ['MSc Architecture', 'Masters'],
  ];

  // Additional for russell group
  const russellPG = [
    ['MSc Financial Mathematics', 'Masters'],
    ['MSc Bioinformatics', 'Masters'],
    ['MSc Advanced Computer Science', 'Masters'],
    ['MSc Robotics', 'Masters'],
    ['MSc Civil Engineering', 'Masters'],
    ['MSc Chemical Engineering', 'Masters'],
    ['MSc Public Policy', 'Masters'],
    ['MA Education', 'Masters'],
    ['MSc Environmental Science', 'Masters'],
    ['PhD Computer Science', 'PhD'],
    ['PhD Business', 'PhD'],
    ['PhD Engineering', 'PhD'],
  ];

  // Pick UG courses (subset based on type)
  const ugSlice = type === 'russell' ? ugCourses3yr : ugCourses3yr.slice(0, 15);
  ugSlice.forEach(([name, level], i) => {
    courses.push(mkCourse(i + 1, name, level, 'Undergraduate', 3, ug, intakes));
  });

  // Diploma / Foundation
  courses.push(mkCourse(101, 'Foundation Year – Business & Management', 'Foundation', 'Foundation', 1, Math.round(ug * 0.7), intakes));
  courses.push(mkCourse(102, 'Foundation Year – Science & Engineering', 'Foundation', 'Foundation', 1, Math.round(ug * 0.7), intakes));
  courses.push(mkCourse(103, 'Graduate Certificate Business', 'Graduate Certificate', 'Postgraduate', 1, Math.round(pg * 0.6), intakes));
  courses.push(mkCourse(104, 'Graduate Diploma Business', 'Graduate Diploma', 'Postgraduate', 1, Math.round(pg * 0.7), intakes));

  // PG courses
  const pgSlice = type === 'russell' ? [...pgCourses1yr, ...russellPG] : pgCourses1yr.slice(0, 20);
  pgSlice.forEach(([name, level], i) => {
    const durYrs = name.startsWith('PhD') ? 3 : 1;
    const tuition = name.startsWith('PhD') ? Math.round(pg * 0.9) : pg;
    courses.push(mkCourse(200 + i, name, level, level === 'PhD' ? 'PhD' : 'Masters', durYrs, tuition, intakes));
  });

  return courses;
}

// ─── Generate TypeScript course data file ────────────────────────────────────
function genCoursesFile(u, courses) {
  const interfaceName = u.prefix.charAt(0).toUpperCase() + u.prefix.slice(1) + 'Course';
  const exportName = u.prefix + 'Courses';
  return `// Auto-generated — do not edit manually
// University: ${u.name}

export interface ${interfaceName} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ${exportName}: ${interfaceName}[] = ${JSON.stringify(courses, null, 2)};

export function get${interfaceName}BySlug(slug: string): ${interfaceName} | undefined {
  return ${exportName}.find(c => c.slug === slug);
}
`;
}

// ─── Generate courses listing page ────────────────────────────────────────────
function genCoursesPageTsx(u) {
  const exportName = u.prefix + 'Courses';
  const getFnName = `get${u.prefix.charAt(0).toUpperCase() + u.prefix.slice(1)}CourseBySlug`;
  const dataFile = `@/data/${u.prefix}-courses`;
  const interfaceName = u.prefix.charAt(0).toUpperCase() + u.prefix.slice(1) + 'Course';
  const qsStr = u.qsRank <= 500 ? `#${u.qsRank} QS` : `QS 501+`;
  const stateLabel = u.state === 'Scotland' ? 'Scotland' : u.state === 'Wales' ? 'Wales' : 'England';
  const intakesStr = u.intakes.join(' & ');
  // Escape apostrophes for use inside single-quoted JS strings
  const safeName = u.name.replace(/'/g, "\\'");
  const safeShortName = u.shortName.replace(/'/g, "\\'");

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${exportName} } from '${dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${safeName} International Courses – All Programs, Fees & IELTS 2025',
  description: \`${safeName} — \${(${exportName} as unknown as any[]).length} courses for international students. IELTS ${u.ielts}+. ${intakesStr} intakes. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${u.slug}/courses',
  keywords: ['${safeShortName} courses', '${safeName} international', '${safeShortName} fees', 'study in UK', 'UK university'],
});

const levelOrder = ["Undergraduate","Foundation","Graduate Certificate","Graduate Diploma","Masters","PhD","Postgraduate"];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lv = c.level;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function CoursesPage() {
  const courses = ${exportName} as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel === 'Masters' || c.studyLevel === 'Postgraduate');
  const avgFee = pgCourses.length
    ? Math.round(pgCourses.reduce((s: number, c: any) => s + c.annualGBP, 0) / pgCourses.length)
    : Math.round(courses.reduce((s: number, c: any) => s + c.annualGBP, 0) / (totalCourses || 1));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: '${safeName}',
    sameAs: '${u.website}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressRegion: '${stateLabel}', addressCountry: 'GB' },
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/uk" className="hover:text-white">UK</Link> /
            <span className="text-white">${u.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇬🇧 ${u.city}, United Kingdom · ${qsStr} World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ${safeName} — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg £{avgFee.toLocaleString()}/yr · IELTS ${u.ielts}+ · ${intakesStr} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '${qsStr}' },
                  { label: 'Avg PG Fee', value: \`£\${Math.round(avgFee/1000)}K\` },
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
              <LeadForm source="${u.prefix}-courses-index" defaultCountry="UK" compact />
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
                      <p className="text-sm font-bold text-brand-700">{\`£\${c.annualGBP.toLocaleString()}/yr\`}</p>
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
            <LeadForm source="${u.prefix}-courses-sidebar" defaultCountry="UK" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${u.shortName}</h3>
              {[
                ['Established', '${u.estYear}'],
                ['Location', '${u.city}, ${stateLabel}'],
                ['IELTS Min', '${u.ielts} overall'],
                ['Intakes', '${intakesStr}'],
                ['Work Rights', '20 hrs/week (term)'],
                ['Graduate Visa', '2 years post-study'],
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
function genCourseSlugPageTsx(u) {
  const exportName = u.prefix + 'Courses';
  const interfaceName = u.prefix.charAt(0).toUpperCase() + u.prefix.slice(1) + 'Course';
  const getFnName = `get${interfaceName}BySlug`;
  const dataFile = `@/data/${u.prefix}-courses`;
  // Escape apostrophes for single-quoted JS strings in generated output
  const safeName = u.name.replace(/'/g, "\\'");
  const safeShortName = u.shortName.replace(/'/g, "\\'");

  return `import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ${exportName}, ${getFnName} } from '${dataFile}';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return (${exportName} as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = ${getFnName}(slug);
  if (!course) return {};
  return buildMetadata({
    title: \`\${course.name} | ${safeShortName} – Fees, IELTS & Intake 2025\`,
    description: \`\${course.name} at ${safeName}. Annual fee £\${course.annualGBP.toLocaleString()} (\${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}). IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas Consultants.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${safeShortName}', '${safeName}', 'study in UK', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = ${getFnName}(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: '${safeName}',
      sameAs: '${u.website}',
    },
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
            <Link href="/universities/${u.slug}" className="hover:text-white">${u.shortName}</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇬🇧 ${u.name} · ${u.city}, UK
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">
                {course.studyLevel} · {course.duration} · {course.campus}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (GBP)', value: \`£\${course.annualGBP.toLocaleString()}\` },
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
              <LeadForm source={\`${u.prefix}-course-\${slug}\`} defaultCountry="UK" compact />
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
                { label: 'Annual Tuition (GBP)', value: \`£\${course.annualGBP.toLocaleString()}\` },
                { label: 'Annual Tuition (USD)', value: \`$\${course.annualUSD.toLocaleString()}\` },
                { label: 'Living Cost (GBP)', value: \`£\${course.livingCostGBP.toLocaleString()}/yr\` },
                { label: 'Total Course Fee', value: \`£\${course.totalGBP.toLocaleString()}\` },
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
                { label: \`Tuition Fee × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`£\${course.totalGBP.toLocaleString()}\`, highlight: true },
                { label: \`Living Cost × \${course.durationYears} year\${course.durationYears !== 1 ? 's' : ''}\`, value: \`£\${(course.livingCostGBP * course.durationYears).toLocaleString()}\` },
                { label: 'Total Estimated Cost', value: \`£\${(course.totalGBP + course.livingCostGBP * course.durationYears).toLocaleString()}\`, highlight: true },
                { label: 'In Indian Rupees (₹)', value: \`₹\${((course.totalGBP + course.livingCostGBP * course.durationYears) * 107 / 100000).toFixed(1)} Lakh\`, highlight: true },
              ].map(r => (
                <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={\`text-sm \${r.highlight ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">UK Student Visa & Work Rights</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Visa Type', value: 'UK Student Visa' },
                { label: 'Work Rights (Term)', value: '20 hrs/week' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Graduate Route Visa', value: '2 years (3 for PhD)' },
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
              Book a free counselling session. Our UK admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">
              Get Free Guidance →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${u.prefix}-course-\${slug}-sidebar\`} defaultCountry="UK" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-700 hover:underline">
                  Official Course Page ↗
                </a>
                <Link href="/universities/${u.slug}/courses" className="block text-sm text-brand-700 hover:underline">
                  All ${u.shortName} Courses →
                </Link>
                <Link href="/universities/country/uk" className="block text-sm text-brand-700 hover:underline">
                  Study in UK Guide →
                </Link>
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

// ─── universities.ts entries ──────────────────────────────────────────────────
function genUniversityEntry(u, idx) {
  const usdTuition = Math.round(u.tuitionPG * GBP_USD);
  const inrTuition = Math.round(usdTuition * 84);
  const usdLiving = Math.round(u.livingCost * GBP_USD);
  const inrLiving = Math.round(usdLiving * 84);
  const inrSalary = Math.round(u.salaryUSD * 84);

  const popularCourses = {
    russell:   ['MSc Computer Science', 'MSc Data Science', 'MBA', 'MSc Finance', 'MSc Artificial Intelligence', 'LLM'],
    mid:       ['MSc Computer Science', 'MSc Data Science', 'MBA', 'MSc Project Management', 'MSc Cybersecurity'],
    post92:    ['MSc Computer Science', 'MSc Data Science', 'MBA', 'MSc Project Management', 'BSc Business Administration'],
    specialist:['MA Fine Art', 'MA Graphic Design', 'MA Fashion Design', 'MA Photography', 'MA Film & Television'],
  }[u.type] || ['MSc Computer Science', 'MBA', 'MSc Data Science'];

  const scholarship1 = {
    russell: { name: `${u.shortName} Excellence Scholarship`, amount: '£5,000–10,000', eligibility: 'Outstanding academic merit' },
    mid:     { name: `${u.shortName} International Scholarship`, amount: '£3,000–5,000', eligibility: 'Merit-based for international students' },
    post92:  { name: `${u.shortName} International Bursary`, amount: '£2,000–3,000', eligibility: 'International students' },
    specialist:{ name: `${u.shortName} Arts Scholarship`, amount: '£3,000–5,000', eligibility: 'Portfolio-based' },
  }[u.type];

  const highlights = {
    russell: [
      `${u.qsRank <= 100 ? 'Top 100' : 'Top 200'} QS World University`,
      `${u.city} campus – excellent career network`,
      `UK Graduate Route Visa: 2 years post-study work`,
      `Strong Indian alumni community`,
    ],
    mid: [
      `${u.qsRank <= 400 ? 'Top 400' : 'Top 600'} QS World University`,
      `${u.city} – affordable UK living costs`,
      `UK Graduate Route Visa: 2 years post-study work`,
      `Practical, career-focused programs`,
    ],
    post92: [
      `Career-focused programs with industry links`,
      `${u.city} campus – affordable living`,
      `UK Graduate Route Visa: 2 years post-study work`,
      `Welcoming international student community`,
    ],
    specialist: [
      `World-renowned arts & design faculty`,
      `London location – global creative hub`,
      `UK Graduate Route Visa: 2 years post-study work`,
      `Industry connections in creative sector`,
    ],
  }[u.type];

  const desc = {
    russell: `${u.name} is a leading research university ${u.city === 'London' ? 'in the heart of London' : `in ${u.city}`}, highly regarded for its academic excellence. Popular with Indian students for its strong postgraduate programs in Computer Science, Data Science, Business, and Engineering. The UK's Graduate Route Visa allows 2 years of post-study work.`,
    mid: `${u.name} is a well-established UK university known for quality teaching and strong graduate employability. Located in ${u.city}, it offers a range of undergraduate and postgraduate programs popular with Indian students. Affordable living costs compared to London make it an attractive destination.`,
    post92: `${u.name} is a dynamic modern university offering practical, career-focused programs. Located in ${u.city}, it welcomes a large international student community and offers competitive tuition fees. The UK Graduate Route Visa allows 2 years of post-study work rights after graduation.`,
    specialist: `${u.name} is a specialist institution renowned in its field, attracting students from around the world. ${u.city === 'London' ? 'Located in London,' : `Based in ${u.city},`} it offers exceptional industry connections and creative programs popular with international students.`,
  }[u.type];

  const backlogs = { russell: 1, mid: 2, post92: 3, specialist: 2 }[u.type];
  const gpa = { russell: 7.5, mid: 7.0, post92: 6.5, specialist: 7.0 }[u.type];
  const greMin = { russell: 310, mid: 300, post92: 290, specialist: 295 }[u.type];

  const feeHistory = [2020, 2021, 2022, 2023, 2024].map((yr, i) => ({
    year: yr,
    tuitionUSD: Math.round(usdTuition * (0.82 + i * 0.045)),
  }));
  const rankHistory = [2020, 2021, 2022, 2023, 2024].map((yr, i) => ({
    year: yr,
    rank: u.qsRank <= 200 ? u.qsRank + (4 - i) * 3 : u.qsRank + (4 - i) * 15,
  }));

  const topEmployers = u.type === 'russell'
    ? ['PwC', 'Deloitte', 'KPMG', 'Goldman Sachs', 'McKinsey']
    : ['NHS', 'Deloitte', 'PwC', 'KPMG', 'EY'];

  return `  {
    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', shortName: '${u.shortName.replace(/'/g,"\\'")}',
    slug: '${u.slug}', country: 'UK', state: '${u.state}', city: '${u.city}',
    qsRanking: ${u.qsRank}, theRanking: ${u.theRank}, annualTuitionUSD: ${usdTuition}, annualTuitionINR: ${inrTuition},
    livingCostUSD: ${usdLiving}, livingCostINR: ${inrLiving},
    intakeMonths: ${JSON.stringify(u.intakes)},
    visaApprovalRate: ${u.visa}, acceptanceRate: ${u.accept},
    popularCourses: ${JSON.stringify(popularCourses)},
    scholarships: [
      { name: '${scholarship1.name.replace(/'/g,"\\'")}', amount: '${scholarship1.amount}', eligibility: '${scholarship1.eligibility}' },
      { name: 'Chevening Scholarship', amount: 'Full Funding', eligibility: 'Outstanding leadership potential' },
    ],
    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.toefl}, greMin: ${greMin}, gpaMin: ${gpa}, backlogs: ${backlogs} },
    employmentRate: ${u.employ}, avgSalaryUSD: ${u.salaryUSD}, avgSalaryINR: ${inrSalary},
    establishedYear: ${u.estYear}, totalStudents: ${u.students}, internationalStudentPercent: ${u.intlPct},
    campusType: 'Urban', popularAmongIndians: true, applicationFeeUSD: ${u.appFee},
    description: '${desc.replace(/'/g,"\\'")}',
    highlights: ${JSON.stringify(highlights)},
    feeHistory: ${JSON.stringify(feeHistory)},
    rankingHistory: ${JSON.stringify(rankHistory)},
    topEmployers: ${JSON.stringify(topEmployers)},
    countryCode: 'GB',
  }`;
}

// ─── Main ──────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, '..');

let totalCourses = 0;
let totalFiles = 0;

for (const u of UNIVERSITIES) {
  // 1. Generate courses
  const courses = getCourses(u);
  totalCourses += courses.length;

  // 2. Write data file
  const dataPath = path.join(ROOT, 'data', `${u.prefix}-courses.ts`);
  fs.writeFileSync(dataPath, genCoursesFile(u, courses), 'utf8');

  // 3. Create course page directories
  const coursesDir = path.join(ROOT, 'app', 'universities', u.slug, 'courses');
  const slugDir = path.join(coursesDir, '[slug]');
  fs.mkdirSync(slugDir, { recursive: true });

  // 4. Write courses listing page
  fs.writeFileSync(path.join(coursesDir, 'page.tsx'), genCoursesPageTsx(u), 'utf8');

  // 5. Write individual course page
  fs.writeFileSync(path.join(slugDir, 'page.tsx'), genCourseSlugPageTsx(u), 'utf8');

  totalFiles += 3;
  console.log(`✓ ${u.name} — ${courses.length} courses`);
}

// 6. Generate universities.ts block to append
const entries = UNIVERSITIES.map((u, i) => genUniversityEntry(u, i)).join(',\n\n');
const tsBlock = `\n  // ── UK (new batch ${new Date().toISOString().split('T')[0]}) ──────────────────────────────────────────────────\n${entries},\n`;
fs.writeFileSync(path.join(ROOT, 'scripts', 'uk-universities-block.ts.txt'), tsBlock, 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Universities: ${UNIVERSITIES.length}`);
console.log(`   Total courses: ${totalCourses}`);
console.log(`   Files written: ${totalFiles}`);
console.log(`\n   👉 Now append scripts/uk-universities-block.ts.txt to data/universities.ts`);
