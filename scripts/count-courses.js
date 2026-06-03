const fs = require('fs');
const files = fs.readdirSync('data').filter(f => f.endsWith('-courses.ts'));
const stats = [];
for (const f of files) {
  const c = fs.readFileSync('data/'+f, 'utf8');
  const ids1 = (c.match(/\bid:\s*['"]/g)||[]).length;
  const ids2 = (c.match(/"id":/g)||[]).length;
  const ids = Math.max(ids1, ids2);
  stats.push({ f: f.replace('-courses.ts',''), ids });
}
// Distribution
const buckets = { '0':0, '1-5':0, '6-10':0, '11-20':0, '21-30':0, '31-50':0, '51+':0 };
for (const s of stats) {
  if (s.ids === 0) buckets['0']++;
  else if (s.ids <= 5) buckets['1-5']++;
  else if (s.ids <= 10) buckets['6-10']++;
  else if (s.ids <= 20) buckets['11-20']++;
  else if (s.ids <= 30) buckets['21-30']++;
  else if (s.ids <= 50) buckets['31-50']++;
  else buckets['51+']++;
}
console.log('Distribution:', JSON.stringify(buckets, null, 2));
const zero = stats.filter(s => s.ids === 0);
console.log('Zero course files:', zero.length);
if (zero.length > 0) console.log('Examples:', zero.slice(0,5).map(s => s.f));
const top = stats.sort((a,b) => b.ids - a.ids).slice(0,20);
console.log('Top 20:', top.map(s => s.f+':'+s.ids).join(', '));
const bottom = stats.sort((a,b) => a.ids - b.ids).slice(0,20);
console.log('Bottom 20:', bottom.map(s => s.f+':'+s.ids).join(', '));
const avg = stats.reduce((a,b) => a+b.ids, 0) / stats.length;
console.log('Average courses per uni:', avg.toFixed(1));
