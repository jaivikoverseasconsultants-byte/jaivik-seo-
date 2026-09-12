const { execFileSync } = require('child_process'); const fs = require('fs');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
function get(u){try{return execFileSync('curl',['-sL','-A',UA,'-m','40','--compressed','-w','\n@@%{http_code}@@',u],{maxBuffer:8e7,encoding:'utf8'});}catch{return '';}}
function plain(h){return h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ');}

const CAND = {
 'Kwantlen (KPU)': ['https://www.kpu.ca/admissions/english-proficiency-requirement','https://www.kpu.ca/calendar/2025-26/admissions/englishproficiency.html','https://www.kpu.ca/international/apply/english-language-requirements'],
 "Queen's University": ['https://www.queensu.ca/admission/apply/english-language-proficiency','https://www.queensu.ca/admission/requirements/english-proficiency','https://www.queensu.ca/registrar/admissions/english-language-proficiency'],
 'University of Ottawa': ['https://www.uottawa.ca/study/undergraduate-studies/admission/language-requirements','https://www.uottawa.ca/en/study/undergraduate-studies/admission-requirements','https://www.uottawa.ca/study/international-students/admission-requirements'],
 'Dalhousie University': ['https://www.dal.ca/admissions/undergraduate/requirements/english-language-requirements.html','https://www.dal.ca/study/admissions/undergraduate/english-language-requirements.html','https://www.dal.ca/admissions/international/english-requirements.html'],
 'York University': ['https://futurestudents.yorku.ca/requirements/english-language','https://futurestudents.yorku.ca/requirements/language-proficiency','https://futurestudents.yorku.ca/international/requirements'],
 'Toronto Metropolitan': ['https://www.torontomu.ca/undergraduate/admission/requirements/english/','https://www.torontomu.ca/admissions/undergraduate/requirements/english-language-proficiency/','https://www.torontomu.ca/admissions/english-language-requirements/'],
 'Univ of New Brunswick': ['https://www.unb.ca/admissions/undergraduate/requirements/english.html','https://www.unb.ca/admissions/undergrad/international/english-language-proficiency.html','https://www.unb.ca/admissions/undergraduate/international/index.html'],
};
const found = fs.existsSync('data/wave-canada/institution-english.json') ? JSON.parse(fs.readFileSync('data/wave-canada/institution-english.json','utf8')) : {};
for (const [uni,urls] of Object.entries(CAND)) {
  let best=null;
  for (const u of urls) {
    const raw=get(u); const code=(raw.match(/@@(\d{3})@@\s*$/)||[])[1]||'000';
    if(code!=='200') { if(!best) best={url:u,http:code,ielts:[],toefl:[],pte:[]}; continue; }
    const txt=plain(raw.replace(/@@\d{3}@@\s*$/,''));
    const ielts=[...new Set([...txt.matchAll(/IELTS[^.]{0,120}?\b([5-9](?:\.\d)?)\b/gi)].map(m=>m[1]))].slice(0,6);
    const toefl=[...new Set([...txt.matchAll(/TOEFL[^.]{0,140}?\b(\d{2,3})\b/gi)].map(m=>m[1]).filter(n=>+n>=50&&+n<=120))].slice(0,6);
    const pte  =[...new Set([...txt.matchAll(/PTE[^.]{0,120}?\b(\d{2})\b/gi)].map(m=>m[1]).filter(n=>+n>=40&&+n<=90))].slice(0,6);
    const rec={url:u,http:code,chars:txt.length,ielts,toefl,pte};
    if(!best||ielts.length>best.ielts.length) best=rec;
    if(ielts.length) break;
  }
  found[uni]=best;
  console.log(`${uni.padEnd(24)} ${best.http} ielts=[${best.ielts}] toefl=[${best.toefl}] pte=[${best.pte}]`);
}
fs.writeFileSync('data/wave-canada/institution-english.json',JSON.stringify(found,null,2));
