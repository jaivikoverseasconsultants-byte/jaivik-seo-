const { execFileSync } = require('child_process'); const fs = require('fs');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const get=u=>{try{return execFileSync('curl',['-sL','-A',UA,'-m','40','--compressed','-w','\n@@%{http_code}@@',u],{maxBuffer:8e7,encoding:'utf8'})}catch{return''}};
const CAND = {
 'Red River College':      ['https://www.rrc.ca/international/future-students/admission-requirements/','https://www.rrc.ca/international/'],
 'Algonquin College':      ['https://www.algonquincollege.com/international/admission-requirements/','https://www.algonquincollege.com/ro/apply/english-language-requirements/'],
 'Durham College':         ['https://durhamcollege.ca/international/admission-requirements','https://durhamcollege.ca/international/english-language-proficiency'],
 'Kwantlen (KPU)':         ['https://www.kpu.ca/admission/english-proficiency','https://www.kpu.ca/international/admissions'],
 'UBC Okanagan':           ['https://you.ubc.ca/applying-ubc/requirements/english-language-competency/','https://students.ok.ubc.ca/tuition-fees/'],
 'University of Alberta':  ['https://www.ualberta.ca/en/admissions/undergraduate/admission/admission-requirements/english-language-requirement/index.html'],
 'University of Waterloo': ['https://uwaterloo.ca/future-students/admissions/english-language-requirements'],
 "Queen's University":     ['https://www.queensu.ca/admission/english-language-requirements'],
 'University of Ottawa':   ['https://www.uottawa.ca/study/undergraduate-studies/admission-requirements/language-requirements'],
 'Dalhousie University':   ['https://www.dal.ca/study/admissions/international/english-language-requirements.html'],
 'York University':        ['https://futurestudents.yorku.ca/requirements/language'],
 'University of Victoria': ['https://www.uvic.ca/undergraduate/admissions/admission-requirements/english-language-requirements/index.php'],
 'University of Windsor':  ['https://www.uwindsor.ca/registrar/english-language-requirements'],
 'University of Guelph':   ['https://admission.uoguelph.ca/englishproficiency'],
 'University of Manitoba': ['https://umanitoba.ca/admissions/undergraduate/requirements/english-language-proficiency'],
 'Toronto Metropolitan':   ['https://www.torontomu.ca/admissions/undergraduate/english-language-requirements/'],
 'Univ of New Brunswick':  ['https://www.unb.ca/admissions/undergraduate/international/english-requirements.html'],
};
const out={};
for (const [uni,urls] of Object.entries(CAND)) {
  let best=null;
  for (const u of urls) {
    const raw=get(u); const code=(raw.match(/@@(\d{3})@@\s*$/)||[])[1]||'000';
    const html=raw.replace(/@@\d{3}@@\s*$/,'');
    const txt=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
                  .replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ');
    const ielts=[...txt.matchAll(/IELTS[^.]{0,120}?\b([5-9](?:\.\d)?)\b/gi)].map(m=>m[1]);
    const toefl=[...txt.matchAll(/TOEFL[^.]{0,140}?\b(\d{2,3})\b/gi)].map(m=>m[1]).filter(n=>+n>=50&&+n<=120);
    const pte  =[...txt.matchAll(/PTE[^.]{0,120}?\b(\d{2})\b/gi)].map(m=>m[1]).filter(n=>+n>=40&&+n<=90);
    const rec={url:u,http:code,chars:txt.length,ielts:[...new Set(ielts)].slice(0,5),toefl:[...new Set(toefl)].slice(0,5),pte:[...new Set(pte)].slice(0,5)};
    if(!best||(code==='200'&&rec.ielts.length>best.ielts.length)) best=rec;
    if(code==='200'&&rec.ielts.length) break;
  }
  out[uni]=best;
  console.log(`${uni.padEnd(24)} ${best.http} ielts=[${best.ielts}] toefl=[${best.toefl}] pte=[${best.pte}]`);
}
fs.writeFileSync('data/wave-canada/institution-english.json',JSON.stringify(out,null,2));
