const { execFileSync } = require('child_process');
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0 Safari/537.36';
const get=u=>{try{return execFileSync('curl',['-sL','-A',UA,'-m','50','--compressed',u],{maxBuffer:3e8,encoding:'utf8'});}catch{return '';}};
const locs=x=>[...x.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m=>m[1]);
const RX=/(admission|apply|requirement|futurestudent|international).*(english|language.?(proficiency|requirement)|proficiency)|english.?(language.?)?(proficiency|requirement)/i;
for(const [name,idx] of [['uOttawa','https://www.uottawa.ca/sitemap.xml'],['uOttawa-study','https://www.uottawa.ca/study/sitemap.xml'],['UNB','https://www.unb.ca/sitemap.xml']]){
  const root=get(idx); if(!root){console.log(name,'FETCH FAIL');continue;}
  let subs=locs(root).filter(u=>/\.xml/i.test(u)); if(!subs.length) subs=[idx];
  let all=[]; for(const s of subs.slice(0,25)) all.push(...locs(get(s)));
  const hits=[...new Set(all.filter(u=>RX.test(u)))];
  console.log(`═══ ${name}: ${all.length} urls, ${hits.length} english-ish`);
  hits.slice(0,8).forEach(h=>console.log('   ',h));
}
