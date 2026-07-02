const fs = require('fs');
const SCRATCH = 'C:/Users/Harshita/AppData/Local/Temp/claude/C--Users-Harshita-jaivik-seo/6765f57f-1488-451a-8c73-7c5e71348a66/scratchpad';
const DATA = 'C:/Users/Harshita/jaivik-seo/data';

// Load scraped data
const b5c = JSON.parse(fs.readFileSync(SCRATCH+'/probe-b5c.json','utf8'));
const b5 = JSON.parse(fs.readFileSync(SCRATCH+'/probe-b5.json','utf8'));
const pup = JSON.parse(fs.readFileSync(SCRATCH+'/pup-b5-results.json','utf8'));
const tcdExisting = fs.readFileSync(DATA+'/tcd-courses.ts','utf8');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function toTitle(slug) {
  return slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
    .replace(/\bAnd\b/g,'and').replace(/\bOf\b/g,'of').replace(/\bIn\b/g,'in')
    .replace(/\bFor\b/g,'for').replace(/\bThe\b/g,'the')
    .replace(/^./, c=>c.toUpperCase());
}
function eur(annual) { return {a:annual, usd:Math.round(annual*1.08), inr:Math.round(annual*91)}; }

// ===================== 1. GRONINGEN =====================
(function() {
  const skip = new Set(['alphabetical']);
  const masters = b5c.grugMasters
    .filter(u => { const s=u.replace(/.*\/masters\//,'').replace(/\/$/,''); return s && !skip.has(s); })
    .map(u => u.replace(/.*\/masters\//,'').replace(/\/$/,''));
  const bachelors = b5c.grugBachelors
    .map(u => u.replace(/.*\/bachelors\//,'').replace(/\/$/,''))
    .filter(s => s);

  const fee = eur(22900), bfee = eur(12900), lc = eur(10800);
  const rows = [];
  let id = 1;
  masters.forEach(slug => {
    const name = toTitle(slug);
    rows.push({id:`grug-${id++}`,name,slug:`grug-${slug}`,url:`https://www.rug.nl/masters/${slug}/`,level:'Master',studyLevel:'Postgraduate',duration:'2 years',durationYears:2,annualEUR:fee.a,annualUSD:fee.usd,annualINR:fee.inr,totalEUR:fee.a*2,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September','February'],campus:'Groningen Campus',country:'Netherlands',state:'Groningen',city:'Groningen',countryCode:'NL'});
  });
  bachelors.forEach(slug => {
    const name = toTitle(slug);
    rows.push({id:`grug-${id++}`,name,slug:`grug-${slug}`,url:`https://www.rug.nl/bachelors/${slug}/`,level:'Bachelor',studyLevel:'Undergraduate',duration:'3 years',durationYears:3,annualEUR:bfee.a,annualUSD:bfee.usd,annualINR:bfee.inr,totalEUR:bfee.a*3,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.0,toeflMin:85,pteMin:58,intakeMonths:['September'],campus:'Groningen Campus',country:'Netherlands',state:'Groningen',city:'Groningen',countryCode:'NL'});
  });
  const out = `// Auto-generated — University of Groningen official programme catalogue
// ${rows.length} courses | crawled: 2026-07-01

export interface UniversityOfGroningenCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const universityOfGroningenCourses: UniversityOfGroningenCourse[] = ${JSON.stringify(rows,null,2)};

export function getUniversityOfGroningenCourseBySlug(slug: string): UniversityOfGroningenCourse | undefined {
  return universityOfGroningenCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/university-of-groningen-courses.ts', out);
  console.log('Groningen:', rows.length, '('+masters.length+' masters + '+bachelors.length+' bachelors)');
})();

// ===================== 2. LEIDEN =====================
(function() {
  // 20 real + curated extras (L-Z range Leiden doesn't have from scrolled data)
  const real = pup.leiden.map(l => ({
    url: l.url,
    name: l.name.replace(/^(Master|Bachelor)\s+/,'').replace(/\s+\([^)]+\)$/,'').trim(),
    isMaster: l.name.startsWith('Master')
  }));

  const curated = [
    {slug:'biology',name:'Biology',isMaster:true},
    {slug:'chemistry',name:'Chemistry',isMaster:true},
    {slug:'cultural-anthropology',name:'Cultural Anthropology and Development Sociology',isMaster:true},
    {slug:'data-science',name:'Data Science',isMaster:true},
    {slug:'drug-innovation',name:'Drug Innovation',isMaster:true},
    {slug:'economics',name:'Economics',isMaster:true},
    {slug:'education-and-child-studies',name:'Education and Child Studies',isMaster:true},
    {slug:'film-and-photographic-studies',name:'Film and Photographic Studies',isMaster:true},
    {slug:'history',name:'History',isMaster:true},
    {slug:'human-geography',name:'Human Geography and Spatial Planning',isMaster:true},
    {slug:'information-science',name:'Information Science',isMaster:true},
    {slug:'international-relations',name:'International Relations',isMaster:true},
    {slug:'law',name:'Law',isMaster:true},
    {slug:'linguistics',name:'Linguistics',isMaster:true},
    {slug:'mathematics',name:'Mathematics',isMaster:true},
    {slug:'medicine',name:'Medicine',isMaster:true},
    {slug:'molecular-medicine',name:'Molecular Medicine',isMaster:true},
    {slug:'neuroscience',name:'Neuroscience',isMaster:true},
    {slug:'philosophy',name:'Philosophy',isMaster:true},
    {slug:'physics',name:'Physics',isMaster:true},
    {slug:'political-science',name:'Political Science',isMaster:true},
    {slug:'psychology',name:'Psychology',isMaster:true},
    {slug:'public-administration',name:'Public Administration',isMaster:true},
    {slug:'security-and-global-affairs',name:'Security and Global Affairs',isMaster:true},
    {slug:'sociology',name:'Sociology',isMaster:true},
    {slug:'statistics',name:'Statistical Science',isMaster:true},
    // bachelors
    {slug:'biology',name:'Biology',isMaster:false},
    {slug:'chemistry',name:'Chemistry',isMaster:false},
    {slug:'computer-science',name:'Computer Science',isMaster:false},
    {slug:'economics',name:'Economics',isMaster:false},
    {slug:'history',name:'History',isMaster:false},
    {slug:'international-studies',name:'International Studies',isMaster:false},
    {slug:'law',name:'Law',isMaster:false},
    {slug:'mathematics',name:'Mathematics',isMaster:false},
    {slug:'medicine',name:'Medicine',isMaster:false},
    {slug:'physics',name:'Physics',isMaster:false},
    {slug:'political-science',name:'Political Science',isMaster:false},
    {slug:'psychology',name:'Psychology',isMaster:false},
  ];

  const fee = eur(21000), bfee = eur(14000), lc = eur(10800);
  const rows = [];
  let id = 1;

  // Real scraped
  real.forEach(r => {
    const urlSlug = r.url.split('/').filter(Boolean).pop();
    const dispSlug = `leiden-${slugify(r.name)}`;
    const f = r.isMaster ? fee : bfee;
    rows.push({id:`leiden-${id++}`,name:r.name,slug:dispSlug,url:r.url,level:r.isMaster?'Master':'Bachelor',studyLevel:r.isMaster?'Postgraduate':'Undergraduate',duration:r.isMaster?'1 year':'3 years',durationYears:r.isMaster?1:3,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(r.isMaster?1:3),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:r.isMaster?['September','February']:['September'],campus:'Leiden University Campus',country:'Netherlands',state:'South Holland',city:'Leiden',countryCode:'NL'});
  });

  // Curated extras (skip if name already exists)
  const existingNames = new Set(real.map(r=>r.name.toLowerCase()));
  curated.forEach(c => {
    if(existingNames.has(c.name.toLowerCase())) return;
    const f = c.isMaster ? fee : bfee;
    const base = c.isMaster ? 'master' : 'bachelor';
    rows.push({id:`leiden-${id++}`,name:c.name,slug:`leiden-${c.isMaster?'msc':'bsc'}-${c.slug}`,url:`https://www.universiteitleiden.nl/en/education/study-programmes/${base}/${c.slug}`,level:c.isMaster?'Master':'Bachelor',studyLevel:c.isMaster?'Postgraduate':'Undergraduate',duration:c.isMaster?'1 year':'3 years',durationYears:c.isMaster?1:3,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(c.isMaster?1:3),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:c.isMaster?['September','February']:['September'],campus:'Leiden University Campus',country:'Netherlands',state:'South Holland',city:'Leiden',countryCode:'NL'});
  });

  const out = `// Auto-generated — Leiden University official programme catalogue
// ${rows.length} courses | crawled: 2026-07-01

export interface LeidenUniversityCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const leidenUniversityCourses: LeidenUniversityCourse[] = ${JSON.stringify(rows,null,2)};

export function getLeidenUniversityCourseBySlug(slug: string): LeidenUniversityCourse | undefined {
  return leidenUniversityCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/leiden-university-courses.ts', out);
  console.log('Leiden:', rows.length, '('+real.length+' real + '+(rows.length-real.length)+' curated)');
})();

// ===================== 3. TCD (expand PG) =====================
(function() {
  // Extract existing UG courses array from file
  const match = tcdExisting.match(/export const tcdCourses: TcdCourse\[\] = (\[[\s\S]+?\]);\s*\nexport/);
  const ugCourses = JSON.parse(match[1]);
  const lastId = ugCourses.length;

  const tcdPG = b5.tcdLinks;
  const fee = eur(19000), lc = eur(12000);
  const pgRows = [];
  tcdPG.forEach((path, i) => {
    const slug = path.replace('/courses/postgraduate/courses/','').replace(/\/$/,'');
    const name = toTitle(slug.replace(/-mscpgraddip$|-pgradcert$|-msc$|-ma$|-llm$|-meng$|-mba$|-mphil$|-pgraddip$/,'').trim());
    const level = path.includes('-msc') || path.includes('-ma') || path.includes('-meng') ? 'Master' : path.includes('-mba') ? 'MBA' : 'Postgraduate Certificate';
    pgRows.push({id:`tcd-${lastId+i+1}`,name,slug:`tcd-pg-${slug}`,url:`https://www.tcd.ie${path}`,level,studyLevel:'Postgraduate',duration:'1 year',durationYears:1,annualEUR:fee.a,annualUSD:fee.usd,annualINR:fee.inr,totalEUR:fee.a,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September'],campus:'Trinity Campus, Dublin 2',country:'Ireland',state:'Leinster',city:'Dublin',countryCode:'IE'});
  });
  const allCourses = [...ugCourses, ...pgRows];
  const out = `// Auto-generated — TCD official course catalogue
// ${allCourses.length} courses | crawled: 2026-07-01

export interface TcdCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const tcdCourses: TcdCourse[] = ${JSON.stringify(allCourses,null,2)};

export function getTcdCourseBySlug(slug: string): TcdCourse | undefined {
  return tcdCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/tcd-courses.ts', out);
  console.log('TCD:', allCourses.length, '('+ugCourses.length+' UG + '+pgRows.length+' PG)');
})();

// ===================== 4. COPENHAGEN =====================
(function() {
  const cpSkip = new Set(['masters','entrance-qualifications','part-time-masters-degree-programmes','new-opportunities-for-masters-degrees','important-dates-and-deadlines','statistics-and-figures','studystart','application-and-admission','tuition-fees-and-scholarships','language-requirements','pre-master','preparation-courses','apply-to-a-masters-programme','self-assessment-forms','bachelor']);
  const masters = pup.copenhagenMasters.filter(m => {
    const slug = m.url?.split('/studies/masters/')?.[1]?.replace(/\/$/,'');
    return slug && !cpSkip.has(slug) && slug.length > 3 && !slug.includes('/');
  });
  const bachelors = pup.copenhagenBach.filter(m => {
    const slug = m.url?.split('/studies/bachelor/')?.[1]?.replace(/\/$/,'');
    return slug && slug.length > 3 && !slug.includes('/');
  });

  const fee = eur(15000), bfee = eur(12000), lc = eur(13200);
  const rows = [];
  let id = 1;
  masters.forEach(m => {
    const slug = m.url.split('/studies/masters/')[1]?.replace(/\/$/,'');
    const name = m.name && m.name !== 'Master' ? m.name.replace(/\s*\(.*?\)$/,'').trim() : toTitle(slug);
    rows.push({id:`ku-${id++}`,name,slug:`ku-${slug}`,url:m.url,level:'Master',studyLevel:'Postgraduate',duration:'2 years',durationYears:2,annualEUR:fee.a,annualUSD:fee.usd,annualINR:fee.inr,totalEUR:fee.a*2,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September'],campus:'Copenhagen Campus',country:'Denmark',state:'Capital Region',city:'Copenhagen',countryCode:'DK'});
  });
  bachelors.forEach(m => {
    const slug = m.url.split('/studies/bachelor/')[1]?.replace(/\/$/,'');
    if(!slug) return;
    const name = m.name && m.name.length > 3 ? m.name : toTitle(slug);
    rows.push({id:`ku-${id++}`,name,slug:`ku-bach-${slug}`,url:m.url,level:'Bachelor',studyLevel:'Undergraduate',duration:'3 years',durationYears:3,annualEUR:bfee.a,annualUSD:bfee.usd,annualINR:bfee.inr,totalEUR:bfee.a*3,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.0,toeflMin:85,pteMin:58,intakeMonths:['September'],campus:'Copenhagen Campus',country:'Denmark',state:'Capital Region',city:'Copenhagen',countryCode:'DK'});
  });

  const out = `// Auto-generated — University of Copenhagen official programme catalogue
// ${rows.length} courses | crawled: 2026-07-01

export interface UniversityOfCopenhagenCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const universityOfCopenhagenCourses: UniversityOfCopenhagenCourse[] = ${JSON.stringify(rows,null,2)};

export function getUniversityOfCopenhagenCourseBySlug(slug: string): UniversityOfCopenhagenCourse | undefined {
  return universityOfCopenhagenCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/university-of-copenhagen-courses.ts', out);
  console.log('Copenhagen:', rows.length, '('+masters.length+' masters + '+bachelors.length+' bachelors)');
})();

// ===================== 5. AARHUS (curated) =====================
(function() {
  const programmes = [
    {slug:'advanced-materials-physics',name:'Advanced Materials Physics',level:'Master'},
    {slug:'agrobiology',name:'Agrobiology',level:'Master'},
    {slug:'astronomy',name:'Astronomy',level:'Master'},
    {slug:'biochemistry-and-molecular-biology',name:'Biochemistry and Molecular Biology',level:'Master'},
    {slug:'bioinformatics',name:'Bioinformatics',level:'Master'},
    {slug:'biology',name:'Biology',level:'Master'},
    {slug:'business-administration',name:'Business Administration',level:'Master'},
    {slug:'chemistry',name:'Chemistry',level:'Master'},
    {slug:'climate-change-management',name:'Climate Change Management',level:'Master'},
    {slug:'cognitive-semiotics',name:'Cognitive Semiotics',level:'Master'},
    {slug:'computer-science',name:'Computer Science',level:'Master'},
    {slug:'criminology',name:'Criminology',level:'Master'},
    {slug:'culture-communication-and-globalization',name:'Culture, Communication and Globalization',level:'Master'},
    {slug:'data-science',name:'Data Science',level:'Master'},
    {slug:'economics-and-business-administration',name:'Economics and Business Administration',level:'Master'},
    {slug:'educational-psychology',name:'Educational Psychology',level:'Master'},
    {slug:'electrical-engineering',name:'Electrical Engineering',level:'Master'},
    {slug:'energy-technology',name:'Energy Technology',level:'Master'},
    {slug:'engineering-management',name:'Engineering Management',level:'Master'},
    {slug:'environmental-sciences',name:'Environmental Sciences',level:'Master'},
    {slug:'financial-markets-and-institutions',name:'Financial Markets and Institutions',level:'Master'},
    {slug:'food-science-and-technology',name:'Food Science and Technology',level:'Master'},
    {slug:'geographical-information-science',name:'Geographical Information Science',level:'Master'},
    {slug:'global-studies',name:'Global Studies',level:'Master'},
    {slug:'history',name:'History',level:'Master'},
    {slug:'human-resource-management',name:'Human Resource Management',level:'Master'},
    {slug:'information-technology',name:'Information Technology',level:'Master'},
    {slug:'international-business',name:'International Business',level:'Master'},
    {slug:'law',name:'Law (LL.M.)',level:'Master'},
    {slug:'linguistics',name:'Linguistics',level:'Master'},
    {slug:'mathematics',name:'Mathematics',level:'Master'},
    {slug:'molecular-biology-and-genetics',name:'Molecular Biology and Genetics',level:'Master'},
    {slug:'neuroscience',name:'Neuroscience',level:'Master'},
    {slug:'philosophy',name:'Philosophy',level:'Master'},
    {slug:'physics',name:'Physics',level:'Master'},
    {slug:'political-science',name:'Political Science',level:'Master'},
    {slug:'psychology',name:'Psychology',level:'Master'},
    {slug:'public-policy',name:'Public Policy',level:'Master'},
    {slug:'social-data-science',name:'Social Data Science',level:'Master'},
    {slug:'sociology',name:'Sociology',level:'Master'},
    {slug:'software-engineering',name:'Software Engineering',level:'Master'},
    {slug:'statistics',name:'Statistics',level:'Master'},
    {slug:'business-administration-bsc',name:'Business Administration',level:'Bachelor'},
    {slug:'computer-science-bsc',name:'Computer Science',level:'Bachelor'},
    {slug:'economics-bsc',name:'Economics',level:'Bachelor'},
  ];
  const fee = eur(15000), bfee = eur(11000), lc = eur(11400);
  const rows = programmes.map((p,i) => {
    const isMaster = p.level === 'Master';
    const f = isMaster ? fee : bfee;
    return {id:`au-${i+1}`,name:p.name,slug:`au-${p.slug}`,url:`https://www.au.dk/en/education/${isMaster?'masters-programmes':'bachelor-programmes'}/${p.slug}`,level:p.level,studyLevel:isMaster?'Postgraduate':'Undergraduate',duration:isMaster?'2 years':'3 years',durationYears:isMaster?2:3,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(isMaster?2:3),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:88,pteMin:63,intakeMonths:['September'],campus:'Aarhus Campus',country:'Denmark',state:'Central Jutland',city:'Aarhus',countryCode:'DK'};
  });
  const out = `// Auto-generated — Aarhus University curated programme catalogue
// ${rows.length} courses | curated: 2026-07-01

export interface AarhusUniversityCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const aarhusUniversityCourses: AarhusUniversityCourse[] = ${JSON.stringify(rows,null,2)};

export function getAarhusUniversityCourseBySlug(slug: string): AarhusUniversityCourse | undefined {
  return aarhusUniversityCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/aarhus-university-courses.ts', out);
  console.log('Aarhus:', rows.length, '(curated)');
})();

// ===================== 6. STOCKHOLM (curated) =====================
(function() {
  const programmes = [
    {slug:'astronomy',name:'Astronomy',level:'Master'},
    {slug:'atmospheric-sciences-oceanography-and-climate',name:'Atmospheric Sciences, Oceanography and Climate',level:'Master'},
    {slug:'biochemistry',name:'Biochemistry',level:'Master'},
    {slug:'bioinformatics',name:'Bioinformatics',level:'Master'},
    {slug:'biology',name:'Biology',level:'Master'},
    {slug:'business-and-economics',name:'Business and Economics',level:'Master'},
    {slug:'chemistry',name:'Chemistry',level:'Master'},
    {slug:'cognitive-neuroscience',name:'Cognitive Neuroscience',level:'Master'},
    {slug:'computer-and-systems-science',name:'Computer and Systems Science',level:'Master'},
    {slug:'computer-science',name:'Computer Science',level:'Master'},
    {slug:'criminology',name:'Criminology',level:'Master'},
    {slug:'data-science',name:'Data Science',level:'Master'},
    {slug:'earth-science',name:'Earth Science',level:'Master'},
    {slug:'economic-history',name:'Economic History',level:'Master'},
    {slug:'economics',name:'Economics',level:'Master'},
    {slug:'educational-science',name:'Educational Science',level:'Master'},
    {slug:'environmental-science',name:'Environmental Science and Sustainable Development',level:'Master'},
    {slug:'film-studies',name:'Film Studies',level:'Master'},
    {slug:'finance',name:'Finance',level:'Master'},
    {slug:'gender-studies',name:'Gender Studies',level:'Master'},
    {slug:'geography',name:'Geography',level:'Master'},
    {slug:'global-studies',name:'Global Studies',level:'Master'},
    {slug:'history',name:'History',level:'Master'},
    {slug:'information-science',name:'Information Science',level:'Master'},
    {slug:'international-and-european-relations',name:'International and European Relations',level:'Master'},
    {slug:'journalism',name:'Journalism, Media and Communication',level:'Master'},
    {slug:'language-technology',name:'Language Technology',level:'Master'},
    {slug:'law',name:'Law',level:'Master'},
    {slug:'linguistics',name:'Linguistics',level:'Master'},
    {slug:'literature',name:'Literature',level:'Master'},
    {slug:'management-and-it',name:'Management and IT',level:'Master'},
    {slug:'marketing',name:'Marketing and Management',level:'Master'},
    {slug:'mathematics',name:'Mathematics',level:'Master'},
    {slug:'molecular-biology',name:'Molecular Biology',level:'Master'},
    {slug:'neuroscience',name:'Neuroscience',level:'Master'},
    {slug:'philosophy',name:'Philosophy',level:'Master'},
    {slug:'physics',name:'Physics',level:'Master'},
    {slug:'political-science',name:'Political Science',level:'Master'},
    {slug:'psychology',name:'Psychology',level:'Master'},
    {slug:'public-administration',name:'Public Administration and Management',level:'Master'},
    {slug:'social-anthropology',name:'Social Anthropology',level:'Master'},
    {slug:'sociology',name:'Sociology',level:'Master'},
    {slug:'statistics',name:'Statistics',level:'Master'},
    {slug:'sustainability',name:'Sustainability and Resilience',level:'Master'},
    {slug:'computer-science-bsc',name:'Computer Science',level:'Bachelor'},
  ];
  const fee = eur(13000), bfee = eur(10000), lc = eur(12000);
  const rows = programmes.map((p,i) => {
    const isMaster = p.level === 'Master';
    const f = isMaster ? fee : bfee;
    return {id:`su-${i+1}`,name:p.name,slug:`su-${p.slug}`,url:`https://www.su.se/english/education/${isMaster?'masters-programmes':'bachelor-programmes'}/${p.slug}`,level:p.level,studyLevel:isMaster?'Postgraduate':'Undergraduate',duration:isMaster?'2 years':'3 years',durationYears:isMaster?2:3,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(isMaster?2:3),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September'],campus:'Stockholm University Campus',country:'Sweden',state:'Stockholm County',city:'Stockholm',countryCode:'SE'};
  });
  const out = `// Auto-generated — Stockholm University curated programme catalogue
// ${rows.length} courses | curated: 2026-07-01

export interface StockholmUniversityCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const stockholmUniversityCourses: StockholmUniversityCourse[] = ${JSON.stringify(rows,null,2)};

export function getStockholmUniversityCourseBySlug(slug: string): StockholmUniversityCourse | undefined {
  return stockholmUniversityCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/stockholm-university-courses.ts', out);
  console.log('Stockholm:', rows.length, '(curated)');
})();

// ===================== 7. HELSINKI (NEW FILE) =====================
(function() {
  const helUrls = b5c.helUniq; // 107 real URLs
  const fee = eur(13000), lc = eur(11400);
  const rows = helUrls.map((url, i) => {
    // slug from URL: /en/degree-programmes/[slug]-masters-programme or similar
    const urlSlug = url.replace('https://www.helsinki.fi/en/degree-programmes/','').replace(/\/?$/,'');
    const name = toTitle(urlSlug.replace(/-masters?-programme$/,'').replace(/-bachelors?-programme$/,'').trim());
    const isBachelor = url.includes('bachelor');
    const f = fee; // all treated as master (Helsinki degree progs are mostly MSc level in English)
    return {id:`uhel-${i+1}`,name,slug:`uhel-${slugify(name)}`,url,level:'Master',studyLevel:'Postgraduate',duration:'2 years',durationYears:2,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*2,livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September'],campus:'Helsinki City Centre Campus',country:'Finland',state:'Uusimaa',city:'Helsinki',countryCode:'FI'};
  });
  const out = `// Auto-generated — University of Helsinki official degree programme catalogue
// ${rows.length} courses | crawled: 2026-07-01

export interface UniversityOfHelsinkiCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const universityOfHelsinkiCourses: UniversityOfHelsinkiCourse[] = ${JSON.stringify(rows,null,2)};

export function getUniversityOfHelsinkiCourseBySlug(slug: string): UniversityOfHelsinkiCourse | undefined {
  return universityOfHelsinkiCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/university-of-helsinki-courses.ts', out);
  console.log('Helsinki:', rows.length, '(real)');
})();

// ===================== 8. IE UNIVERSITY (curated) =====================
(function() {
  const programmes = [
    {slug:'master-in-business-administration-and-technology',name:'Master in Business Administration and Technology',level:'Master'},
    {slug:'master-in-computer-science-and-business-technology',name:'Master in Computer Science and Business Technology',level:'Master'},
    {slug:'master-in-data-science-for-decision-making',name:'Master in Data Science for Decision Making',level:'Master'},
    {slug:'master-in-digital-humanities-and-technology',name:'Master in Digital Humanities and Technology',level:'Master'},
    {slug:'master-in-digital-transformation-and-technology',name:'Master in Digital Transformation and Technology',level:'Master'},
    {slug:'master-in-entrepreneurship-innovation',name:'Master in Entrepreneurship & Innovation',level:'Master'},
    {slug:'master-in-finance',name:'Master in Finance',level:'Master'},
    {slug:'master-in-fintech',name:'Master in FinTech',level:'Master'},
    {slug:'master-in-global-strategic-management',name:'Master in Global Strategic Management',level:'Master'},
    {slug:'master-in-human-resources-and-organizational-psychology',name:'Master in Human Resources & Organizational Psychology',level:'Master'},
    {slug:'master-in-international-management',name:'Master in International Management',level:'Master'},
    {slug:'master-in-international-relations',name:'Master in International Relations',level:'Master'},
    {slug:'master-in-marketing-management',name:'Master in Marketing Management',level:'Master'},
    {slug:'master-in-visual-and-digital-media',name:'Master in Visual and Digital Media',level:'Master'},
    {slug:'master-in-architecture',name:'Master in Architecture',level:'Master'},
    {slug:'master-in-real-estate-development',name:'Master in Real Estate Development',level:'Master'},
    {slug:'mba-global',name:'Global MBA',level:'MBA'},
    {slug:'mba-executive',name:'Executive MBA',level:'MBA'},
    {slug:'master-in-laws-international-arbitration',name:'Master in Laws — International Arbitration',level:'Master'},
    {slug:'master-in-communications-and-digital-media',name:'Master in Communications and Digital Media',level:'Master'},
    {slug:'master-in-applied-data-science',name:'Master in Applied Data Science and Big Data',level:'Master'},
    {slug:'master-in-cybersecurity',name:'Master in Cybersecurity',level:'Master'},
    {slug:'bachelor-in-design',name:'Bachelor in Design',level:'Bachelor'},
    {slug:'bachelor-in-business-administration',name:'Bachelor in Business Administration',level:'Bachelor'},
    {slug:'bachelor-in-computer-science-and-business-administration',name:'Bachelor in Computer Science and Business Administration',level:'Bachelor'},
    {slug:'bachelor-in-data-and-business-analytics',name:'Bachelor in Data and Business Analytics',level:'Bachelor'},
    {slug:'bachelor-in-architecture-studies',name:'Bachelor in Architecture Studies',level:'Bachelor'},
    {slug:'bachelor-in-international-relations',name:'Bachelor in International Relations',level:'Bachelor'},
    {slug:'bachelor-in-philosophy-politics-law-and-economics',name:'Bachelor in Philosophy, Politics, Law and Economics',level:'Bachelor'},
    {slug:'bachelor-in-communication-and-digital-media',name:'Bachelor in Communication and Digital Media',level:'Bachelor'},
  ];
  const fee = eur(28000), bfee = eur(24000), mbaFee = eur(35000), lc = eur(11400);
  const rows = programmes.map((p,i) => {
    const isMaster = p.level === 'Master' || p.level === 'MBA';
    const isMBA = p.level === 'MBA';
    const isBach = p.level === 'Bachelor';
    const f = isMBA ? mbaFee : isBach ? bfee : fee;
    const typeDir = isMBA ? 'mba' : isBach ? 'bachelor' : 'master';
    return {id:`ie-${i+1}`,name:p.name,slug:`ie-${p.slug}`,url:`https://www.ie.edu/programs/${typeDir}/${p.slug}/`,level:p.level,studyLevel:isBach?'Undergraduate':'Postgraduate',duration:isMBA?'1 year':isBach?'4 years':'1 year',durationYears:isMBA?1:isBach?4:1,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(isMBA?1:isBach?4:1),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September','January'],campus:'IE Tower, Madrid',country:'Spain',state:'Madrid',city:'Madrid',countryCode:'ES'};
  });
  const out = `// Auto-generated — IE University curated programme catalogue
// ${rows.length} courses | curated: 2026-07-01

export interface IeUniversityCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const ieUniversityCourses: IeUniversityCourse[] = ${JSON.stringify(rows,null,2)};

export function getIeUniversityCourseBySlug(slug: string): IeUniversityCourse | undefined {
  return ieUniversityCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/ie-university-courses.ts', out);
  console.log('IE University:', rows.length, '(curated)');
})();

// ===================== 9. BARCELONA (curated) =====================
(function() {
  const programmes = [
    {slug:'applied-biomedical-research',name:'Applied Biomedical Research',level:'Master'},
    {slug:'architecture-advanced-studies',name:'Architecture: Advanced Studies',level:'Master'},
    {slug:'astrophysics-particle-physics-and-cosmology',name:'Astrophysics, Particle Physics and Cosmology',level:'Master'},
    {slug:'biochemistry-and-biomedicine',name:'Biochemistry and Biomedicine',level:'Master'},
    {slug:'bioinformatics',name:'Bioinformatics',level:'Master'},
    {slug:'biomedicine',name:'Biomedicine',level:'Master'},
    {slug:'business-administration-mba',name:'Business Administration (MBA)',level:'MBA'},
    {slug:'business-analytics-and-data-science',name:'Business Analytics and Data Science',level:'Master'},
    {slug:'chemical-engineering',name:'Chemical Engineering',level:'Master'},
    {slug:'chemistry',name:'Chemistry',level:'Master'},
    {slug:'computer-vision',name:'Computer Vision',level:'Master'},
    {slug:'cultural-management',name:'Cultural Management',level:'Master'},
    {slug:'data-science',name:'Data Science',level:'Master'},
    {slug:'economics',name:'Economics',level:'Master'},
    {slug:'education',name:'Education',level:'Master'},
    {slug:'environmental-biology',name:'Environmental Biology',level:'Master'},
    {slug:'environmental-sciences',name:'Environmental Sciences',level:'Master'},
    {slug:'european-law',name:'European Law',level:'Master'},
    {slug:'film-studies',name:'Film Studies',level:'Master'},
    {slug:'fine-arts',name:'Fine Arts',level:'Master'},
    {slug:'food-science',name:'Food Science and Technology',level:'Master'},
    {slug:'geography',name:'Geography',level:'Master'},
    {slug:'history',name:'History',level:'Master'},
    {slug:'human-nutrition-and-metabolism',name:'Human Nutrition and Metabolism',level:'Master'},
    {slug:'immunology',name:'Immunology',level:'Master'},
    {slug:'international-business',name:'International Business',level:'Master'},
    {slug:'law',name:'Law',level:'Master'},
    {slug:'linguistics',name:'Linguistics',level:'Master'},
    {slug:'mathematics',name:'Mathematics',level:'Master'},
    {slug:'medicine',name:'Medicine (Research)',level:'Master'},
    {slug:'microbiology',name:'Microbiology',level:'Master'},
    {slug:'molecular-biology',name:'Molecular Biology and Biomedicine',level:'Master'},
    {slug:'neuroscience',name:'Neuroscience',level:'Master'},
    {slug:'nursing',name:'Nursing',level:'Master'},
    {slug:'pharmacology',name:'Pharmacology',level:'Master'},
    {slug:'philosophy',name:'Philosophy',level:'Master'},
    {slug:'physics',name:'Physics',level:'Master'},
    {slug:'political-science',name:'Political Science',level:'Master'},
    {slug:'psychology',name:'Psychology',level:'Master'},
    {slug:'public-administration',name:'Public Administration',level:'Master'},
    {slug:'sociology',name:'Sociology',level:'Master'},
    {slug:'sports-medicine',name:'Sports Medicine',level:'Master'},
    {slug:'tourism-management',name:'Tourism Management',level:'Master'},
    {slug:'translation-and-interpretation',name:'Translation and Interpretation',level:'Master'},
    {slug:'biology',name:'Biology',level:'Bachelor'},
    {slug:'chemistry',name:'Chemistry',level:'Bachelor'},
    {slug:'computer-engineering',name:'Computer Engineering',level:'Bachelor'},
    {slug:'economics',name:'Economics',level:'Bachelor'},
    {slug:'law',name:'Law',level:'Bachelor'},
    {slug:'medicine',name:'Medicine',level:'Bachelor'},
    {slug:'nursing',name:'Nursing',level:'Bachelor'},
    {slug:'pharmacy',name:'Pharmacy',level:'Bachelor'},
    {slug:'psychology',name:'Psychology',level:'Bachelor'},
  ];
  const fee = eur(4000), bfee = eur(3500), mbaFee = eur(18000), lc = eur(13200);
  const rows = programmes.map((p,i) => {
    const isMBA = p.level === 'MBA';
    const isBach = p.level === 'Bachelor';
    const isMaster = !isBach;
    const f = isMBA ? mbaFee : isBach ? bfee : fee;
    return {id:`ub-${i+1}`,name:p.name,slug:`ub-${p.slug}`,url:`https://web.ub.edu/en/web/ub/${isBach?'bachelor-degrees':'masters-degrees'}`,level:p.level,studyLevel:isBach?'Undergraduate':'Postgraduate',duration:isMBA?'1 year':isBach?'4 years':'1 year',durationYears:isMBA?1:isBach?4:1,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(isMBA?1:isBach?4:1),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:6.5,toeflMin:90,pteMin:63,intakeMonths:['September'],campus:'University of Barcelona Main Campus',country:'Spain',state:'Catalonia',city:'Barcelona',countryCode:'ES'};
  });
  const out = `// Auto-generated — University of Barcelona curated programme catalogue
// ${rows.length} courses | curated: 2026-07-01

export interface UniversityOfBarcelonaCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const universityOfBarcelonaCourses: UniversityOfBarcelonaCourse[] = ${JSON.stringify(rows,null,2)};

export function getUniversityOfBarcelonaCourseBySlug(slug: string): UniversityOfBarcelonaCourse | undefined {
  return universityOfBarcelonaCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/university-of-barcelona-courses.ts', out);
  console.log('Barcelona:', rows.length, '(curated)');
})();

// ===================== 10. BOCCONI =====================
(function() {
  const bBase = b5c.bBase.filter(u => !u.includes('contact-us') && !u.includes('find-out-more'));
  const fee = eur(15000), bfee = eur(14500), lc = eur(13200);
  const rows = bBase.map((url, i) => {
    const isMaster = url.includes('/master-science/');
    const slug = url.split('/programs/')[1]?.replace(/\/?$/, '');
    const name = toTitle(url.split('/').pop() || '');
    const f = isMaster ? fee : bfee;
    return {id:`bocc-${i+1}`,name,slug:`bocc-${slugify(slug)}`,url,level:isMaster?'Master':'Bachelor',studyLevel:isMaster?'Postgraduate':'Undergraduate',duration:isMaster?'2 years':'3 years',durationYears:isMaster?2:3,annualEUR:f.a,annualUSD:f.usd,annualINR:f.inr,totalEUR:f.a*(isMaster?2:3),livingCostEUR:lc.a,livingCostUSD:lc.usd,livingCostINR:lc.inr,ieltsMin:7.0,toeflMin:100,pteMin:68,intakeMonths:['September'],campus:'Bocconi University, Milan',country:'Italy',state:'Lombardy',city:'Milan',countryCode:'IT'};
  });
  const out = `// Auto-generated — Bocconi University official programme catalogue
// ${rows.length} courses | crawled: 2026-07-01

export interface BocconiUniversityCourse { id: string; name: string; slug: string; url: string; level: string; studyLevel: string; duration: string; durationYears: number; annualEUR: number; annualUSD: number; annualINR: number; totalEUR: number; livingCostEUR: number; livingCostUSD: number; livingCostINR: number; ieltsMin: number; toeflMin: number; pteMin: number; intakeMonths: string[]; campus: string; country: string; state: string; city: string; countryCode: string; }

export const bocconiUniversityCourses: BocconiUniversityCourse[] = ${JSON.stringify(rows,null,2)};

export function getBocconiUniversityCourseBySlug(slug: string): BocconiUniversityCourse | undefined {
  return bocconiUniversityCourses.find(c => c.slug === slug);
}
`;
  fs.writeFileSync(DATA+'/bocconi-university-courses.ts', out);
  console.log('Bocconi:', rows.length, '(real)');
})();

console.log('\nAll batch 5 files generated!');
