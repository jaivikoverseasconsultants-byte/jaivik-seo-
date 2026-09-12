const { execFileSync } = require('child_process'); const fs = require('fs');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
function get(u){try{return execFileSync('curl',['-sL','-A',UA,'-m','35','--compressed','-w','\n@@%{http_code}@@',u],{maxBuffer:8e7,encoding:'utf8'});}catch{return '';}}
function plain(h){return h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&[a-z#0-9]+;/gi,' ').replace(/\s+/g,' ');}
function links(html, origin){
  const out=[]; const re=/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi; let m;
  while((m=re.exec(html))){
    let h=m[1].split('#')[0].trim(); if(!h) continue;
    if(h.startsWith('//')) h='https:'+h; else if(h.startsWith('/')) h=origin+h; else if(!/^https?:/i.test(h)) continue;
    out.push({href:h, text:plain(m[2]).trim()});
  }
  return out;
}
const HUBS = {
 'Kwantlen (KPU)':        ['https://www.kpu.ca/admissions','https://www.kpu.ca/international'],
 "Queen's University":    ['https://www.queensu.ca/admission/','https://www.queensu.ca/admission/requirements'],
 'University of Ottawa':  ['https://www.uottawa.ca/study/undergraduate-studies/admission','https://www.uottawa.ca/study/'],
 'Dalhousie University':  ['https://www.dal.ca/study/admissions.html','https://www.dal.ca/admissions.html'],
 'York University':       ['https://futurestudents.yorku.ca/requirements','https://futurestudents.yorku.ca/'],
 'Toronto Metropolitan':  ['https://www.torontomu.ca/admissions/undergraduate/','https://www.torontomu.ca/admissions/'],
 'Univ of New Brunswick': ['https://www.unb.ca/admissions/','https://www.unb.ca/admissions/undergraduate/'],
};
const RX=/english|language.?(requirement|proficiency)|proficiency|ielts/i;
const store=JSON.parse(fs.readFileSync('data/wave-canada/institution-english.json','utf8'));
for(const [uni,hubs] of Object.entries(HUBS)){
  const cands=new Map();
  for(const hub of hubs){
    const raw=get(hub); if(!/@@200@@/.test(raw)) continue;
    const origin=new URL(hub).origin;
    for(const l of links(raw.replace(/@@\d{3}@@\s*$/,''),origin)){
      if(RX.test(l.text)||RX.test(l.href)) cands.set(l.href,l.text.slice(0,60));
    }
  }
  let best=null;
  for(const [u,label] of [...cands].slice(0,10)){
    const raw=get(u); if(!/@@200@@/.test(raw)) continue;
    const txt=plain(raw.replace(/@@\d{3}@@\s*$/,''));
    const ielts=[...new Set([...txt.matchAll(/IELTS[^.]{0,120}?\b([5-9](?:\.\d)?)\b/gi)].map(m=>m[1]))].slice(0,6);
    const toefl=[...new Set([...txt.matchAll(/TOEFL[^.]{0,140}?\b(\d{2,3})\b/gi)].map(m=>m[1]).filter(n=>+n>=50&&+n<=120))].slice(0,6);
    const pte  =[...new Set([...txt.matchAll(/PTE[^.]{0,120}?\b(\d{2})\b/gi)].map(m=>m[1]).filter(n=>+n>=40&&+n<=90))].slice(0,6);
    if(ielts.length && (!best||ielts.length>best.ielts.length)) best={url:u,label,http:'200',chars:txt.length,ielts,toefl,pte};
    if(best&&best.ielts.length&&best.toefl.length) break;
  }
  if(best){ store[uni]=best; console.log(`${uni.padEnd(24)} OK  ielts=[${best.ielts}] toefl=[${best.toefl}] pte=[${best.pte}]\n    ${best.url}`); }
  else console.log(`${uni.padEnd(24)} NOT FOUND  (${cands.size} candidate links tried)`);
}
fs.writeFileSync('data/wave-canada/institution-english.json',JSON.stringify(store,null,2));
