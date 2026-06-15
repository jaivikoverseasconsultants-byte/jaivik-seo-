const fs = require('fs');
const path = require('path');

const UNIVERSITIES = [
  { name: 'Manchester',  file: 'manchester-courses.ts', currency: 'GBP', feeField: 'annualGBP', feeMin: 14000, feeMax: 42000 },
  { name: 'UCL',         file: 'ucl-courses.ts',        currency: 'GBP', feeField: 'annualGBP', feeMin: 18000, feeMax: 42000 },
  { name: 'Edinburgh',   file: 'edinburgh-courses.ts',  currency: 'GBP', feeField: 'annualGBP', feeMin: 18000, feeMax: 42000 },
  { name: 'U Toronto',   file: 'uoft-courses.ts',       currency: 'CAD', feeField: 'annualCAD', feeMin: 15000, feeMax: 65000 },
  { name: 'McMaster',    file: 'mcmaster-courses.ts',   currency: 'CAD', feeField: 'annualCAD', feeMin: 12000, feeMax: 45000 },
  { name: 'Warwick',     file: 'warwick-courses.ts',    currency: 'GBP', feeField: 'annualGBP', feeMin: 15000, feeMax: 36000 },
  { name: 'UBC',         file: 'ubc-courses.ts',        currency: 'CAD', feeField: 'annualCAD', feeMin: 15000, feeMax: 55000 },
  { name: 'Glasgow',     file: 'glasgow-courses.ts',    currency: 'GBP', feeField: 'annualGBP', feeMin: 15000, feeMax: 36000 },
  { name: 'Waterloo',    file: 'waterloo-courses.ts',   currency: 'CAD', feeField: 'annualCAD', feeMin: 12000, feeMax: 40000 },
  { name: 'Bath',        file: 'bath-courses.ts',       currency: 'GBP', feeField: 'annualGBP', feeMin: 18000, feeMax: 34000 },
  { name: 'Southampton', file: 'soton-courses.ts',      currency: 'GBP', feeField: 'annualGBP', feeMin: 18000, feeMax: 34000 },
];

const DATA_DIR = path.join(__dirname, '../data');

function extractCourses(content) {
  // Match JSON objects in the array — extract "key":value pairs
  const nameMatches   = [...content.matchAll(/"name":"([^"]+)"/g)].map(m => m[1]);
  const urlMatches    = [...content.matchAll(/"url":"([^"]+)"/g)].map(m => m[1]);
  const ieltsMatches  = [...content.matchAll(/"ieltsMin":([\d.]+)/g)].map(m => parseFloat(m[1]));
  const gbpMatches    = [...content.matchAll(/"annualGBP":(\d+)/g)].map(m => parseInt(m[1]));
  const cadMatches    = [...content.matchAll(/"annualCAD":(\d+)/g)].map(m => parseInt(m[1]));
  const audMatches    = [...content.matchAll(/"annualAUD":(\d+)/g)].map(m => parseInt(m[1]));

  return { count: nameMatches.length, names: nameMatches, urls: urlMatches,
           ielts: ieltsMatches, annualGBP: gbpMatches, annualCAD: cadMatches, annualAUD: audMatches };
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  DATA QUALITY AUDIT — 11 Real-Data Universities');
console.log('═══════════════════════════════════════════════════════════════\n');

let totalIssues = 0;

for (const uni of UNIVERSITIES) {
  const filePath = path.join(DATA_DIR, uni.file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${uni.name}: FILE NOT FOUND (${uni.file})\n`);
    totalIssues++;
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const data = extractCourses(content);
  const issues = [];

  if (data.count === 0) { issues.push('NO COURSES FOUND'); }

  // URL quality
  const homepageUrls = data.urls.filter(u => /^https?:\/\/[^\/]+\/?$/.test(u));
  if (homepageUrls.length > 0) issues.push(`${homepageUrls.length} homepage-only URLs (stubs)`);

  // Duplicate names
  const uniqueNames = new Set(data.names);
  const dupCount = data.names.length - uniqueNames.size;
  if (dupCount > 0) issues.push(`${dupCount} duplicate names`);

  // Fee range
  const fees = uni.feeField === 'annualGBP' ? data.annualGBP
             : uni.feeField === 'annualCAD' ? data.annualCAD : data.annualAUD;
  const feeOutOfRange = fees.filter(f => f < uni.feeMin || f > uni.feeMax);
  if (feeOutOfRange.length > 0) {
    issues.push(`${feeOutOfRange.length} fees out of range [${uni.currency} ${uni.feeMin.toLocaleString()}–${uni.feeMax.toLocaleString()}]: e.g. ${feeOutOfRange.slice(0,3).join(', ')}`);
  }
  const uniqueFees = new Set(fees);
  if (uniqueFees.size === 1 && fees.length > 5) {
    issues.push(`All fees identical (${uni.currency} ${[...uniqueFees][0].toLocaleString()}) — flat/templated fees`);
  }

  // IELTS range
  const badIelts = data.ielts.filter(i => i < 5.5 || i > 8.0);
  if (badIelts.length > 0) issues.push(`${badIelts.length} IELTS out of range [5.5–8.0]`);
  const uniqueIelts = [...new Set(data.ielts)].sort();

  const feeRange = fees.length > 0
    ? `${uni.currency} ${Math.min(...fees).toLocaleString()}–${Math.max(...fees).toLocaleString()}`
    : 'N/A';

  const status = issues.length === 0 ? '✅' : issues.some(i => i.includes('stub') || i.includes('NO COURSES')) ? '❌' : '⚠️ ';
  console.log(`${status} ${uni.name.padEnd(12)} | ${String(data.count).padStart(4)} courses | Fees: ${feeRange.padEnd(22)} | IELTS: ${uniqueIelts.join('/')} | Unique names: ${uniqueNames.size}`);
  issues.forEach(i => console.log(`         ⚡ ${i}`));
  console.log(`         Sample: ${data.names.slice(0,4).join(' | ')}`);
  if (data.names.length > 4) console.log(`                 ... ${data.names.slice(-2).join(' | ')}`);
  console.log();
  totalIssues += issues.length;
}

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Total issues flagged: ${totalIssues}`);
console.log('═══════════════════════════════════════════════════════════════\n');
