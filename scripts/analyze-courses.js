const fs = require('fs');
const files = fs.readdirSync('data').filter(f => f.endsWith('-courses.ts'));
let total = 0;
const countries = {USA:0, Canada:0, UK:0, Australia:0, Germany:0, Ireland:0, Singapore:0, NZ:0, France:0, Netherlands:0, UAE:0, Sweden:0, Denmark:0, Italy:0, Spain:0, other:0};
const lowCount = [];

for (const f of files) {
  const c = fs.readFileSync('data/'+f, 'utf8');
  // Count IDs using multiple patterns
  const ids1 = (c.match(/\bid:\s*['"`]/g)||[]).length;  // id: 'xxx' or id: "xxx" or id: `xxx`
  const ids2 = (c.match(/"id":/g)||[]).length;           // "id": xxx (JSON style)
  const ids = Math.max(ids1, ids2);
  total += ids;
  if (ids < 5 && ids > 0) lowCount.push(f + ':' + ids);

  if (c.includes("'USA'") || c.includes('"USA"')) countries.USA += ids;
  else if (c.includes("'Canada'") || c.includes('"Canada"')) countries.Canada += ids;
  else if (c.includes("'United Kingdom'") || c.includes('"United Kingdom"')) countries.UK += ids;
  else if (c.includes("'Australia'") || c.includes('"Australia"')) countries.Australia += ids;
  else if (c.includes("'Germany'") || c.includes('"Germany"')) countries.Germany += ids;
  else if (c.includes("'Ireland'") || c.includes('"Ireland"')) countries.Ireland += ids;
  else if (c.includes("'Singapore'") || c.includes('"Singapore"')) countries.Singapore += ids;
  else if (c.includes('New Zealand')) countries.NZ += ids;
  else if (c.includes("'France'") || c.includes('"France"')) countries.France += ids;
  else if (c.includes("'Netherlands'") || c.includes('"Netherlands"')) countries.Netherlands += ids;
  else if (c.includes("United Arab Emirates") || c.includes('"UAE"')) countries.UAE += ids;
  else if (c.includes("'Sweden'") || c.includes('"Sweden"')) countries.Sweden += ids;
  else if (c.includes("'Denmark'") || c.includes('"Denmark"')) countries.Denmark += ids;
  else if (c.includes("'Italy'") || c.includes('"Italy"')) countries.Italy += ids;
  else if (c.includes("'Spain'") || c.includes('"Spain"')) countries.Spain += ids;
  else countries.other += ids;
}

console.log('TOTAL courses across all data files:', total);
console.log('\nBy country:');
Object.entries(countries).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  if (v > 0) console.log('  ' + k + ':', v);
});
console.log('\nLow-count files (<5 courses):', lowCount.length);
lowCount.slice(0,10).forEach(f => console.log(' ', f));
