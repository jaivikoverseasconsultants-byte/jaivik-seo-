const { execFileSync } = require('child_process');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const get=u=>{try{return execFileSync('curl',['-sL','-A',UA,'-m','45','--compressed',u],{maxBuffer:8e7,encoding:'utf8'})}catch{return''}};
const SAMPLES = {
  'Algonquin':        'https://www.algonquincollege.com/business-hospitality/program/advertising/',
  'KPU':              'https://www.kpu.ca/programs-az/business/accounting/accounting-bba/',
  'York U':           'https://futurestudents.yorku.ca/program/actuarial-science',
  'Waterloo (UG)':    'https://uwaterloo.ca/future-students/programs/computer-science',
  'Durham College':   'https://durhamcollege.ca/programs/bachelor-of-cybersecurity',
  'TMU (UG)':         'https://www.torontomu.ca/programs/undergraduate/aerospace-engineering/',
  'Guelph (UG)':      'https://calendar.uoguelph.ca/undergraduate-calendar/programs-majors-minors/accounting-acct/',
  'UNB':              'https://www.unb.ca/academics/programs/applied-management/accounting.html',
  'Dalhousie':        'https://www.dal.ca/study/programs/undergraduate/agricultural-business-bsc.html',
  'uOttawa':          'https://catalogue.uottawa.ca/en/undergrad/bachelor-fine-arts-bfa/',
  'U Manitoba':       'https://catalog.umanitoba.ca/undergraduate-studies/management-business/accounting-bcomm-honours/',
  'UBC (grad)':       'https://www.grad.ubc.ca/prospective-students/graduate-degree-programs/master-of-education-adult-learning-education',
  "Queen's":          'https://www.queensu.ca/academics/programs',
};
const PROBES = [
  ['tuition',  /\btuition\b/i],
  ['$fee',     /\$\s?\d{1,3}(,\d{3})+/],
  ['IELTS',    /\bIELTS\b/i],
  ['TOEFL',    /\bTOEFL\b/i],
  ['PTE',      /\bPTE\b/i],
  ['intake',   /\b(September|January|May) (intake|start|entry)|\bintake\b/i],
  ['duration', /\b\d+(\.\d+)?[- ]?(year|semester|month)s?\b/i],
  ['deposit',  /\bdeposit\b/i],
  ['scholar',  /\bscholarship|\bbursar|\baward\b/i],
  ['appFee',   /application fee/i],
];
for (const [name,url] of Object.entries(SAMPLES)) {
  const html = get(url);
  if (!html) { console.log(`${name.padEnd(16)} FETCH FAILED`); continue; }
  const txt = html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
                  .replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ');
  const found = PROBES.filter(([,re])=>re.test(txt)).map(([k])=>k);
  console.log(`${name.padEnd(16)} ${String(txt.length).padStart(6)}ch  ${found.join(' ')||'(nothing)'}`);
}
