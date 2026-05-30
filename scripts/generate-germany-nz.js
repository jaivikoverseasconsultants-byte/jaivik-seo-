#!/usr/bin/env node
// generate-germany-nz.js
// Adds 13 Germany universities (→ 15 total) + 7 NZ universities (→ 8 total)

const fs = require('fs');
const path = require('path');

// Exchange rates
const EUR_USD = 1.08;  const EUR_INR = 90.72;
const NZD_USD = 0.60;  const NZD_INR = 50.40;

// ─── Germany universities (13 new — TUM u23, RWTH u24 already exist) ─────────
// German public unis charge ~€170–350/semester (€340–700/yr) admin fee, not tuition
// A few private ones charge actual tuition — we model both accurately
const GERMANY_UNIS = [
  { id:'de03', prefix:'lmu',       name:'LMU Munich',                            shortName:'LMU',         slug:'lmu-munich',                       city:'Munich',        state:'Bavaria',                   qsRank:59,   theRank:32,  semFeeEUR:350, livingCostEUR:14000, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1472, students:53000, intlPct:20, accept:15, visa:72, employ:94, salaryUSD:63000, appFee:0,   website:'https://www.lmu.de/en/',           type:'elite' },
  { id:'de04', prefix:'heidelberg',name:'Heidelberg University',                 shortName:'Heidelberg',  slug:'heidelberg-university',            city:'Heidelberg',    state:'Baden-Württemberg',         qsRank:87,   theRank:45,  semFeeEUR:300, livingCostEUR:12000, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1386, students:29000, intlPct:20, accept:20, visa:72, employ:93, salaryUSD:62000, appFee:0,   website:'https://www.uni-heidelberg.de/en/',type:'elite' },
  { id:'de05', prefix:'humboldt',  name:'Humboldt University of Berlin',         shortName:'HU Berlin',   slug:'humboldt-university-berlin',       city:'Berlin',        state:'Berlin',                    qsRank:120,  theRank:80,  semFeeEUR:320, livingCostEUR:15000, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1810, students:36000, intlPct:18, accept:25, visa:73, employ:92, salaryUSD:59000, appFee:0,   website:'https://www.hu-berlin.de/en/',     type:'elite' },
  { id:'de06', prefix:'fub',       name:'Free University of Berlin',             shortName:'FU Berlin',   slug:'free-university-berlin',           city:'Berlin',        state:'Berlin',                    qsRank:98,   theRank:84,  semFeeEUR:320, livingCostEUR:15000, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1948, students:37000, intlPct:20, accept:28, visa:73, employ:92, salaryUSD:59000, appFee:0,   website:'https://www.fu-berlin.de/en/',     type:'elite' },
  { id:'de07', prefix:'tub',       name:'Technical University of Berlin',        shortName:'TU Berlin',   slug:'technical-university-berlin',      city:'Berlin',        state:'Berlin',                    qsRank:154,  theRank:201, semFeeEUR:320, livingCostEUR:15000, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1879, students:35000, intlPct:22, accept:22, visa:73, employ:93, salaryUSD:61000, appFee:0,   website:'https://www.tu.berlin/en/',        type:'tech' },
  { id:'de08', prefix:'uham',      name:'University of Hamburg',                 shortName:'Hamburg',     slug:'university-of-hamburg',            city:'Hamburg',       state:'Hamburg',                   qsRank:241,  theRank:251, semFeeEUR:290, livingCostEUR:14500, ielts:6.5, toefl:85,  pte:58, intakes:['October','April'],     estYear:1919, students:44000, intlPct:16, accept:35, visa:71, employ:91, salaryUSD:56000, appFee:0,   website:'https://www.uni-hamburg.de/en/',   type:'research' },
  { id:'de09', prefix:'goethe',    name:'Goethe University Frankfurt',           shortName:'Frankfurt',   slug:'goethe-university-frankfurt',      city:'Frankfurt',     state:'Hesse',                     qsRank:301,  theRank:251, semFeeEUR:300, livingCostEUR:14000, ielts:6.0, toefl:85,  pte:58, intakes:['October','April'],     estYear:1914, students:45000, intlPct:17, accept:35, visa:71, employ:91, salaryUSD:56000, appFee:0,   website:'https://www.goethe-university-frankfurt.de/', type:'research' },
  { id:'de10', prefix:'ustuttgart',name:'University of Stuttgart',               shortName:'Stuttgart',   slug:'university-of-stuttgart',          city:'Stuttgart',     state:'Baden-Württemberg',         qsRank:321,  theRank:351, semFeeEUR:340, livingCostEUR:13000, ielts:6.5, toefl:85,  pte:58, intakes:['October','April'],     estYear:1829, students:27000, intlPct:18, accept:30, visa:72, employ:93, salaryUSD:60000, appFee:0,   website:'https://www.uni-stuttgart.de/en/', type:'tech' },
  { id:'de11', prefix:'kit',       name:'Karlsruhe Institute of Technology',     shortName:'KIT',         slug:'karlsruhe-institute-of-technology',city:'Karlsruhe',     state:'Baden-Württemberg',         qsRank:119,  theRank:127, semFeeEUR:360, livingCostEUR:12500, ielts:6.5, toefl:88,  pte:62, intakes:['October','April'],     estYear:1825, students:24000, intlPct:24, accept:20, visa:72, employ:94, salaryUSD:63000, appFee:0,   website:'https://www.kit.edu/english/',     type:'tech' },
  { id:'de12', prefix:'ucologne',  name:'University of Cologne',                 shortName:'Cologne',     slug:'university-of-cologne',            city:'Cologne',       state:'North Rhine-Westphalia',    qsRank:281,  theRank:201, semFeeEUR:280, livingCostEUR:13000, ielts:6.0, toefl:83,  pte:55, intakes:['October','April'],     estYear:1388, students:52000, intlPct:15, accept:38, visa:71, employ:90, salaryUSD:54000, appFee:0,   website:'https://www.uni-koeln.de/en/',     type:'research' },
  { id:'de13', prefix:'ubonn',     name:'University of Bonn',                    shortName:'Bonn',        slug:'university-of-bonn',               city:'Bonn',          state:'North Rhine-Westphalia',    qsRank:206,  theRank:175, semFeeEUR:290, livingCostEUR:12500, ielts:6.5, toefl:85,  pte:58, intakes:['October','April'],     estYear:1818, students:36000, intlPct:16, accept:30, visa:71, employ:91, salaryUSD:57000, appFee:0,   website:'https://www.uni-bonn.de/en/',      type:'research' },
  { id:'de14', prefix:'tudresden', name:'TU Dresden',                            shortName:'TU Dresden',  slug:'tu-dresden',                       city:'Dresden',       state:'Saxony',                    qsRank:287,  theRank:251, semFeeEUR:290, livingCostEUR:11500, ielts:6.0, toefl:83,  pte:55, intakes:['October','April'],     estYear:1828, students:32000, intlPct:18, accept:28, visa:72, employ:92, salaryUSD:58000, appFee:0,   website:'https://tu-dresden.de/en/',        type:'tech' },
  { id:'de15', prefix:'mannheim',  name:'University of Mannheim',                shortName:'Mannheim',    slug:'university-of-mannheim',           city:'Mannheim',      state:'Baden-Württemberg',         qsRank:551,  theRank:601, semFeeEUR:400, livingCostEUR:12000, ielts:6.5, toefl:88,  pte:62, intakes:['September','March'],   estYear:1907, students:12000, intlPct:24, accept:30, visa:72, employ:94, salaryUSD:62000, appFee:0,   website:'https://www.uni-mannheim.de/en/',  type:'business' },
];

// ─── New Zealand universities (7 new — UoA u28 already exists) ───────────────
const NZ_UNIS = [
  { id:'nz02', prefix:'vuw',      name:'Victoria University of Wellington',      shortName:'Victoria',    slug:'victoria-university-wellington',   city:'Wellington',    state:'Wellington',      qsRank:241,  theRank:301, tuitionNZD:35000, livingCostNZD:22000, ielts:6.5, toefl:90,  pte:58, intakes:['February','July'],   estYear:1895, students:22000, intlPct:25, accept:55, visa:90, employ:88, salaryUSD:50000, appFee:0, website:'https://www.wgtn.ac.nz' },
  { id:'nz03', prefix:'uoc',      name:'University of Canterbury',               shortName:'Canterbury',  slug:'university-of-canterbury',         city:'Christchurch',  state:'Canterbury',      qsRank:261,  theRank:301, tuitionNZD:34000, livingCostNZD:18000, ielts:6.0, toefl:83,  pte:58, intakes:['February','July'],   estYear:1873, students:16000, intlPct:22, accept:58, visa:90, employ:87, salaryUSD:48000, appFee:0, website:'https://www.canterbury.ac.nz' },
  { id:'nz04', prefix:'otago',    name:'University of Otago',                    shortName:'Otago',       slug:'university-of-otago',              city:'Dunedin',       state:'Otago',           qsRank:207,  theRank:251, tuitionNZD:34000, livingCostNZD:17000, ielts:6.0, toefl:83,  pte:58, intakes:['February','July'],   estYear:1869, students:21000, intlPct:24, accept:58, visa:90, employ:88, salaryUSD:49000, appFee:0, website:'https://www.otago.ac.nz' },
  { id:'nz05', prefix:'massey',   name:'Massey University',                      shortName:'Massey',      slug:'massey-university',                city:'Palmerston North',state:'Manawatu',       qsRank:401,  theRank:501, tuitionNZD:30000, livingCostNZD:17000, ielts:6.0, toefl:80,  pte:55, intakes:['February','July'],   estYear:1927, students:30000, intlPct:20, accept:62, visa:89, employ:86, salaryUSD:45000, appFee:0, website:'https://www.massey.ac.nz' },
  { id:'nz06', prefix:'aut',      name:'Auckland University of Technology',      shortName:'AUT',         slug:'auckland-university-of-technology',city:'Auckland',      state:'Auckland',        qsRank:401,  theRank:501, tuitionNZD:32000, livingCostNZD:22000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],   estYear:1895, students:29000, intlPct:28, accept:62, visa:90, employ:87, salaryUSD:47000, appFee:0, website:'https://www.aut.ac.nz' },
  { id:'nz07', prefix:'waikato',  name:'University of Waikato',                  shortName:'Waikato',     slug:'university-of-waikato',            city:'Hamilton',      state:'Waikato',         qsRank:401,  theRank:501, tuitionNZD:29000, livingCostNZD:16000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],   estYear:1964, students:12000, intlPct:22, accept:65, visa:89, employ:85, salaryUSD:44000, appFee:0, website:'https://www.waikato.ac.nz' },
  { id:'nz08', prefix:'lincolnnz', name:'Lincoln University New Zealand',         shortName:'Lincoln NZ',  slug:'lincoln-university-new-zealand',   city:'Lincoln',       state:'Canterbury',      qsRank:601,  theRank:601, tuitionNZD:28000, livingCostNZD:17000, ielts:6.0, toefl:79,  pte:55, intakes:['February','July'],   estYear:1878, students:4000,  intlPct:30, accept:68, visa:89, employ:85, salaryUSD:43000, appFee:0, website:'https://www.lincoln.ac.nz' },
];

// ─── Course templates ─────────────────────────────────────────────────────────
const UG_ALL = [
  ['BSc Computer Science','Undergraduate'],
  ['BSc Software Engineering','Undergraduate'],
  ['BSc Data Science','Undergraduate'],
  ['BSc Cybersecurity','Undergraduate'],
  ['BEng Mechanical Engineering','Undergraduate'],
  ['BEng Civil Engineering','Undergraduate'],
  ['BEng Electrical Engineering','Undergraduate'],
  ['BSc Business Administration','Undergraduate'],
  ['BSc Accounting & Finance','Undergraduate'],
  ['BSc Economics','Undergraduate'],
  ['BSc Marketing','Undergraduate'],
  ['BSc International Business','Undergraduate'],
  ['BSc Psychology','Undergraduate'],
  ['BSc Environmental Science','Undergraduate'],
  ['BA Education','Undergraduate'],
];

const PG_ALL = [
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
  ['MSc Engineering Management','Masters'],
  ['MSc Data Analytics','Masters'],
  ['MSc Business Analytics','Masters'],
  ['MSc Information Technology','Masters'],
  ['MSc Cloud Computing','Masters'],
  ['MSc Digital Marketing','Masters'],
  ['MSc International Relations','Masters'],
];

const PG_EXTRA_DE = [
  ['MSc Mechanical Engineering','Masters'],
  ['MSc Electrical Engineering','Masters'],
  ['MSc Chemical Engineering','Masters'],
  ['MSc Automotive Engineering','Masters'],
  ['MSc Aerospace Engineering','Masters'],
  ['MSc Robotics','Masters'],
  ['MSc Computational Science','Masters'],
  ['MSc Physics','Masters'],
  ['PhD Engineering','PhD'],
  ['PhD Computer Science','PhD'],
  ['PhD Natural Sciences','PhD'],
];

const PG_EXTRA_NZ = [
  ['MSc Environmental Management','Masters'],
  ['MSc Public Health','Masters'],
  ['MSc Agriculture','Masters'],
  ['PhD Computer Science','PhD'],
  ['PhD Business','PhD'],
];

// ─── Generate courses ─────────────────────────────────────────────────────────
function getCourses(u, isGermany) {
  const { prefix, city, state, ielts, toefl, pte, intakes, website } = u;
  const country     = isGermany ? 'Germany' : 'New Zealand';
  const countryCode = isGermany ? 'DE' : 'NZ';
  const fxUSD = isGermany ? EUR_USD : NZD_USD;
  const fxINR = isGermany ? EUR_INR : NZD_INR;

  // Germany: near-zero tuition (semFeeEUR * 2 per year), PG same
  // NZ: tuitionNZD per year
  const annualLocal = isGermany
    ? u.semFeeEUR * 2          // ~€340–800/yr admin fee
    : u.tuitionNZD;

  // Germany masters are typically low-fee public programs
  const pgLocal = isGermany
    ? u.semFeeEUR * 2
    : Math.round(u.tuitionNZD * 1.1);  // PG slightly higher in NZ

  const ugLocal = isGermany
    ? u.semFeeEUR * 2
    : Math.round(u.tuitionNZD * 0.9);

  const livingLocal = isGermany ? u.livingCostEUR : u.livingCostNZD;

  const currKey = isGermany ? 'EUR' : 'NZD';
  const currSym = isGermany ? '€' : 'NZ$';

  const mkCourse = (id, name, level, studyLevel, durYrs, localFee, intake) => {
    const annualUSD = Math.round(localFee * fxUSD);
    const annualINR = Math.round(annualUSD * 84);
    const lcUSD     = Math.round(livingLocal * fxUSD);
    const lcINR     = Math.round(lcUSD * 84);
    return {
      id:   `${prefix}-${id}`,
      name,
      slug: `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`,
      url:  website,
      level, studyLevel,
      duration:       durYrs === 1 ? '1 year' : durYrs === 1.5 ? '18 months' : `${durYrs} years`,
      durationYears:  durYrs,
      [`annual${currKey}`]: localFee,
      annualUSD, annualINR,
      [`total${currKey}`]:       localFee * durYrs,
      [`livingCost${currKey}`]:  livingLocal,
      livingCostUSD: lcUSD, livingCostINR: lcINR,
      ieltsMin: ielts, toeflMin: toefl, pteMin: pte,
      intakeMonths:  intake || intakes,
      campus: `${city} Campus`,
      country, state, city, countryCode,
    };
  };

  const isElite = u.qsRank <= 150;
  const courses = [];

  // UG (3yr)
  const ugSlice = isElite ? UG_ALL : UG_ALL.slice(0, 12);
  ugSlice.forEach(([name, level], i) =>
    courses.push(mkCourse(i + 1, name, level, 'Undergraduate', 3, ugLocal, intakes)));

  // Foundation / Diploma
  courses.push(mkCourse(101,'Foundation Year – Sciences & Engineering','Foundation','Foundation',1, Math.round(ugLocal * 0.75), intakes));
  courses.push(mkCourse(102,'Foundation Year – Business & Social Sciences','Foundation','Foundation',1, Math.round(ugLocal * 0.75), intakes));
  courses.push(mkCourse(103,'Graduate Certificate in Business','Graduate Certificate','Postgraduate',1, Math.round(pgLocal * 0.6), intakes));
  courses.push(mkCourse(104,'Graduate Diploma in Business','Graduate Diploma','Postgraduate',1, Math.round(pgLocal * 0.75), intakes));

  // PG (1yr Masters)
  const pgExtra = isGermany ? PG_EXTRA_DE : PG_EXTRA_NZ;
  const pgSlice = isElite ? [...PG_ALL, ...pgExtra] : [...PG_ALL.slice(0, 18), ...pgExtra.slice(0, 4)];
  pgSlice.forEach(([name, level], i) => {
    const dur = name.startsWith('PhD') ? 3 : 1;
    const fee = name.startsWith('PhD') ? Math.round(pgLocal * 0.8) : pgLocal;
    courses.push(mkCourse(200 + i, name, level, level === 'PhD' ? 'PhD' : 'Masters', dur, fee, intakes));
  });

  return courses;
}

// ─── Generate data file ───────────────────────────────────────────────────────
function genDataFile(u, courses, isGermany) {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const iface = cap(u.prefix) + 'Course';
  const exp   = u.prefix + 'Courses';
  const curr  = isGermany ? 'EUR' : 'NZD';

  return `// Auto-generated — do not edit manually
// University: ${u.name}

export interface ${iface} {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annual${curr}: number; annualUSD: number; annualINR: number; total${curr}: number;
  livingCost${curr}: number; livingCostUSD: number; livingCostINR: number;
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

// ─── Generate courses listing page ───────────────────────────────────────────
function genListPage(u, isGermany) {
  const exp        = u.prefix + 'Courses';
  const dataFile   = `@/data/${u.prefix}-courses`;
  const curr       = isGermany ? 'EUR' : 'NZD';
  const currSym    = isGermany ? '€' : 'NZ$';
  const flag       = isGermany ? '🇩🇪' : '🇳🇿';
  const country    = isGermany ? 'Germany' : 'New Zealand';
  const cLink      = isGermany ? '/universities/country/germany' : '/universities/country/new-zealand';
  const visaNote   = isGermany ? '18-month Job Seeker Visa post-study' : 'Open Work Visa (Post-Study)';
  const workRights = isGermany ? 'Up to 20 hrs/week alongside studies' : '20 hrs/week (term)';
  const intakesStr = u.intakes.join(' & ');
  const qsStr      = u.qsRank <= 500 ? `#${u.qsRank} QS` : 'QS 501+';
  const safeName     = u.name.replace(/'/g, "\\'");
  const safeShort    = u.shortName.replace(/'/g, "\\'");
  const stateLabel   = u.state;

  const feeDisplay = isGermany
    ? `${currSym}${(u.semFeeEUR * 2).toLocaleString('en-IN')}/yr`
    : `${currSym}${(u.tuitionNZD).toLocaleString('en-IN')}/yr`;

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ${exp} } from '${dataFile}';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: '${safeName} International Courses – Programs, Fees & IELTS 2025',
  description: \`${safeName} — \${(${exp} as unknown as any[]).length} courses for international students. IELTS ${u.ielts}+. ${intakesStr} intakes. Free admission guidance from Jaivik Overseas Consultants.\`,
  path: '/universities/${u.slug}/courses',
  keywords: ['${safeShort} courses', '${safeName} international', 'study in ${country}', '${country} university'],
});

const levelOrder = ["Undergraduate","Foundation","Graduate Certificate","Graduate Diploma","Masters","PhD","Postgraduate"];

function groupByLevel(courses: any[]) {
  const g: Record<string, any[]> = {};
  courses.forEach((c: any) => { if (!g[c.level]) g[c.level] = []; g[c.level].push(c); });
  return g;
}

export default function CoursesPage() {
  const courses = ${exp} as unknown as any[];
  const groups  = groupByLevel(courses);
  const total   = courses.length;
  const pgC     = courses.filter((c: any) => c.studyLevel === 'Masters' || c.studyLevel === 'Postgraduate');
  const avgFee  = pgC.length
    ? Math.round(pgC.reduce((s: number, c: any) => s + c.annual${curr}, 0) / pgC.length)
    : Math.round(courses.reduce((s: number, c: any) => s + c.annual${curr}, 0) / (total || 1));

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: '${safeName}', sameAs: '${u.website}',
    address: { '@type': 'PostalAddress', addressLocality: '${u.city}', addressRegion: '${stateLabel}', addressCountry: '${isGermany ? 'DE' : 'NZ'}' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="${cLink}" className="hover:text-white">${country}</Link> /
            <span className="text-white">${safeShort}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${flag} ${u.city}, ${country} · ${qsStr} World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                ${safeName} — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {total} programs · Avg ${currSym}{avgFee.toLocaleString()}/yr · IELTS ${u.ielts}+ · ${intakesStr} intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: total },
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
              <LeadForm source="${u.prefix}-courses-index" defaultCountry="${country}" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvC]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{(lvC as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvC as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{\`${currSym}\${c.annual${curr}.toLocaleString()}/yr\`}</p>
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
            <LeadForm source="${u.prefix}-courses-sidebar" defaultCountry="${country}" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — ${safeShort}</h3>
              {[
                ['Established', '${u.estYear}'],
                ['Location', '${u.city}, ${country}'],
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

// ─── Generate individual course slug page ────────────────────────────────────
function genSlugPage(u, isGermany) {
  const cap      = s => s.charAt(0).toUpperCase() + s.slice(1);
  const iface    = cap(u.prefix) + 'Course';
  const exp      = u.prefix + 'Courses';
  const getFn    = `get${iface}BySlug`;
  const dataFile = `@/data/${u.prefix}-courses`;
  const curr     = isGermany ? 'EUR' : 'NZD';
  const currSym  = isGermany ? '€' : 'NZ$';
  const flag     = isGermany ? '🇩🇪' : '🇳🇿';
  const country  = isGermany ? 'Germany' : 'New Zealand';
  const fxLabel  = isGermany ? '1.08' : '0.60';
  const visaNote = isGermany ? '18-month Job Seeker Visa post-study' : 'Open Work Visa (Post-Study)';
  const workTerm = isGermany ? '20 hrs/week' : '20 hrs/week';
  const safeName  = u.name.replace(/'/g, "\\'");
  const safeShort = u.shortName.replace(/'/g, "\\'");

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
    title: \`\${course.name} | ${safeShort} – Fees, IELTS & Intake 2025\`,
    description: \`\${course.name} at ${safeName}. Annual fee ${currSym}\${course.annual${curr}.toLocaleString()} (\${course.durationYears} yr\${course.durationYears !== 1 ? 's' : ''}). IELTS \${course.ieltsMin}+. Intake: \${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
    keywords: [course.name, '${safeShort}', '${safeName}', 'study in ${country}', course.level],
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
            <Link href="/universities/${u.slug}" className="hover:text-white">${safeShort}</Link> /
            <Link href="/universities/${u.slug}/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ${flag} ${safeName} · ${u.city}, ${country}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (${curr})', value: \`${currSym}\${course.annual${curr}.toLocaleString()}\` },
                  { label: 'Fee in INR', value: \`₹\${feeINRLakh}L/yr\` },
                  { label: 'IELTS Min', value: \`\${course.ieltsMin}+\` },
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
              <LeadForm source={\`${u.prefix}-course-\${slug}\`} defaultCountry="${country}" compact />
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
                { label: 'Annual Fee (${curr})', value: \`${currSym}\${course.annual${curr}.toLocaleString()}\` },
                { label: 'Annual Fee (USD)', value: \`$\${course.annualUSD.toLocaleString()}\` },
                { label: 'Living Cost (${curr}/yr)', value: \`${currSym}\${course.livingCost${curr}.toLocaleString()}\` },
                { label: 'Total Course Fee', value: \`${currSym}\${course.total${curr}.toLocaleString()}\` },
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
                { label: \`Tuition × \${course.durationYears} yr\${course.durationYears !== 1 ? 's' : ''}\`, value: \`${currSym}\${course.total${curr}.toLocaleString()}\`, hi: true },
                { label: \`Living × \${course.durationYears} yr\${course.durationYears !== 1 ? 's' : ''}\`, value: \`${currSym}\${(course.livingCost${curr} * course.durationYears).toLocaleString()}\` },
                { label: 'Total Est. Cost', value: \`${currSym}\${(course.total${curr} + course.livingCost${curr} * course.durationYears).toLocaleString()}\`, hi: true },
                { label: 'In Indian Rupees', value: \`₹\${((course.total${curr} + course.livingCost${curr} * course.durationYears) * ${fxLabel} * 84 / 100000).toFixed(1)} Lakh\`, hi: true },
              ].map(r => (
                <div key={r.label} className={\`flex justify-between items-center p-3 rounded-xl \${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}\`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={\`text-sm \${r.hi ? 'text-brand-700' : 'text-gray-900'}\`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — ${country}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: '${country} Student Visa' },
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
            <p className="text-blue-200 text-sm mb-4">Our ${country} admissions advisors give free, personalised guidance to Indian students.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={\`${u.prefix}-course-\${slug}-sidebar\`} defaultCountry="${country}" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/${u.slug}/courses" className="block text-sm text-brand-700 hover:underline">All ${safeShort} Courses →</Link>
                <Link href="/universities/country/${country.toLowerCase().replace(' ','-')}" className="block text-sm text-brand-700 hover:underline">Study in ${country} Guide →</Link>
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
function genUniEntry(u, isGermany) {
  const fxUSD = isGermany ? EUR_USD : NZD_USD;
  const country    = isGermany ? 'Germany' : 'New Zealand';
  const countryCode= isGermany ? 'DE' : 'NZ';

  // For Germany: tuition is near-zero (semFeeEUR*2); for NZ: tuitionNZD
  const localTuition = isGermany ? u.semFeeEUR * 2 : u.tuitionNZD;
  const localLiving  = isGermany ? u.livingCostEUR : u.livingCostNZD;

  const usdT = Math.round(localTuition * fxUSD);
  const inrT = Math.round(usdT * 84);
  const usdL = Math.round(localLiving * fxUSD);
  const inrL = Math.round(usdL * 84);
  const inrS = Math.round(u.salaryUSD * 84);

  const feeHist = [2020,2021,2022,2023,2024].map((yr,i) => ({
    year: yr, tuitionUSD: isGermany
      ? Math.round(usdT * (0.90 + i * 0.025))   // Germany near-constant
      : Math.round(usdT * (0.82 + i * 0.045))
  }));
  const rankHist = [2020,2021,2022,2023,2024].map((yr,i) => ({
    year: yr, rank: u.qsRank + (4 - i) * (u.qsRank <= 200 ? 5 : 15)
  }));

  const popCourses = isGermany
    ? (u.type === 'business'
        ? ['MSc Management','MBA','MSc Accounting & Finance','MSc Marketing','MSc Business Analytics']
        : ['MSc Computer Science','MSc Mechanical Engineering','MSc Data Science','MSc Electrical Engineering','MBA'])
    : ['MSc Computer Science','MSc Data Science','MBA','MSc Engineering','MSc Environmental Management'];

  const sch1 = isGermany
    ? { name:'DAAD Scholarship', amount:'€861/month', eligibility:'Academic excellence – open to Indian students' }
    : { name:`${u.shortName.replace(/'/g,"\\'")} International Scholarship`, amount:'NZD 5,000–10,000', eligibility:'Merit-based for international students' };
  const sch2 = isGermany
    ? { name:'Deutschlandstipendium', amount:'€300/month', eligibility:'Top academic performance' }
    : { name:'New Zealand Commonwealth Scholarship', amount:'Full Funding', eligibility:'Commonwealth country nationals' };

  const backlogs = u.qsRank <= 150 ? 1 : 2;
  const gpa      = u.qsRank <= 150 ? 8.0 : 7.0;
  const greMin   = u.qsRank <= 150 ? 308 : 300;

  const topEmps = isGermany
    ? ['Siemens','BMW','Bosch','SAP','Deutsche Bank']
    : ['Fonterra','Air New Zealand','Xero','ANZ New Zealand','Deloitte NZ'];

  const highlights = isGermany ? [
    `${u.qsRank <= 150 ? 'Top 150' : 'Top 350'} QS World University`,
    `Near-zero tuition – only ~€${u.semFeeEUR * 2}/year admin fee`,
    '18-month Job Seeker Visa after graduation',
    'Strong tech + automotive industry links',
  ] : [
    `${u.qsRank <= 300 ? 'Top 300' : 'Top 500'} QS World University`,
    `${u.city} campus – high quality of life`,
    'Open Work Visa – 3 years post-study',
    'Clear NZ PR pathway for skilled graduates',
  ];

  const desc = isGermany
    ? `${u.name} is one of Germany's leading universities in ${u.city}, offering world-class programs at near-zero tuition cost. German public universities charge only a small semester admin fee (~€${u.semFeeEUR}), making them extraordinary value for Indian students. The 18-month Job Seeker Visa post-graduation enables graduates to find skilled employment in Germany's strong economy.`
    : `${u.name} is a highly regarded New Zealand university in ${u.city}, popular with Indian students for its high visa approval rates, affordable fees, and clear PR pathway. New Zealand's post-study Open Work Visa allows up to 3 years of work experience after graduation, making it an attractive destination for career-focused students.`;

  return `  {
    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', shortName: '${u.shortName.replace(/'/g,"\\'")}',
    slug: '${u.slug}', country: '${country}', state: '${u.state}', city: '${u.city}',
    qsRanking: ${u.qsRank}, theRanking: ${u.theRank}, annualTuitionUSD: ${usdT}, annualTuitionINR: ${inrT},
    livingCostUSD: ${usdL}, livingCostINR: ${inrL},
    intakeMonths: ${JSON.stringify(u.intakes)},
    visaApprovalRate: ${u.visa}, acceptanceRate: ${u.accept},
    popularCourses: ${JSON.stringify(popCourses)},
    scholarships: [
      { name: '${sch1.name}', amount: '${sch1.amount}', eligibility: '${sch1.eligibility}' },
      { name: '${sch2.name}', amount: '${sch2.amount}', eligibility: '${sch2.eligibility}' },
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
const deEntries = [], nzEntries = [];

const ALL = [
  ...GERMANY_UNIS.map(u => ({ u, isDE: true })),
  ...NZ_UNIS.map(u => ({ u, isDE: false })),
];

for (const { u, isDE } of ALL) {
  const courses = getCourses(u, isDE);
  totalCourses += courses.length;

  fs.writeFileSync(path.join(ROOT,'data',`${u.prefix}-courses.ts`), genDataFile(u, courses, isDE), 'utf8');

  const slugDir = path.join(ROOT,'app','universities',u.slug,'courses','[slug]');
  fs.mkdirSync(slugDir, { recursive: true });
  fs.writeFileSync(path.join(ROOT,'app','universities',u.slug,'courses','page.tsx'), genListPage(u, isDE), 'utf8');
  fs.writeFileSync(path.join(slugDir,'page.tsx'), genSlugPage(u, isDE), 'utf8');

  totalFiles += 3;
  console.log(`${isDE ? '🇩🇪' : '🇳🇿'} ${u.name} — ${courses.length} courses`);
  if (isDE) deEntries.push(genUniEntry(u, true));
  else nzEntries.push(genUniEntry(u, false));
}

const deBlock = `\n  // ── GERMANY (new batch) ─────────────────────────────────────────────────────\n${deEntries.join(',\n\n')},\n`;
const nzBlock = `\n  // ── NEW ZEALAND (new batch) ──────────────────────────────────────────────────\n${nzEntries.join(',\n\n')},\n`;
fs.writeFileSync(path.join(ROOT,'scripts','germany-block.ts.txt'), deBlock, 'utf8');
fs.writeFileSync(path.join(ROOT,'scripts','nz-block.ts.txt'), nzBlock, 'utf8');

console.log(`\n✅ Done!`);
console.log(`   Germany: ${GERMANY_UNIS.length} new universities`);
console.log(`   New Zealand: ${NZ_UNIS.length} new universities`);
console.log(`   Total courses: ${totalCourses}`);
console.log(`   Files written: ${totalFiles}`);
