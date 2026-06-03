/**
 * Fix all TypeScript errors from the last batch of changes
 */
const fs = require('fs');

function fix(file, pairs) {
  if (!fs.existsSync(file)) { console.log(`⚠️  Not found: ${file}`); return; }
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, to] of pairs) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
    }
  }
  if (changed) { fs.writeFileSync(file, content); console.log(`✅ Fixed ${file}`); }
  else console.log(`ℹ️  No changes in ${file}`);
}

// ─── 1. KTH page: annualSEK → annualEUR ────────────────────────────────────
fix('app/universities/kth-royal-institute-of-technology/courses/[slug]/page.tsx', [
  ['course.annualSEK', 'course.annualEUR'],
  ['SEK ${course.annualEUR', '€${course.annualEUR'],
  ['SEK ${course.annualSEK', '€${course.annualEUR'],
  ['Annual Fee (SEK)', 'Annual Fee (EUR)'],
  ['SEK/yr. IELTS', 'EUR/yr. IELTS'],
  ['`SEK ${course.annualEUR.toLocaleString()}`', '`€${course.annualEUR.toLocaleString()}`'],
  ["value: `SEK ${course.annualEUR.toLocaleString()}`", "value: `€${course.annualEUR.toLocaleString()}`"],
  ["value: `AED ${course.annualEUR.toLocaleString()}`", "value: `€${course.annualEUR.toLocaleString()}`"],
]);

// Also fix the description in metadata (different pattern)
let kthFile = 'app/universities/kth-royal-institute-of-technology/courses/[slug]/page.tsx';
let kthContent = fs.readFileSync(kthFile, 'utf8');
// Fix the description line with annualSEK reference that might still exist
kthContent = kthContent.replace(/SEK \$\{course\.annualSEK\.toLocaleString\(\)\}\/SEK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
kthContent = kthContent.replace(/SEK \$\{course\.annualEUR\.toLocaleString\(\)\}\/SEK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
kthContent = kthContent.replace(/`SEK \$\{course\.annualEUR\.toLocaleString\(\)\}`/g, '`€${course.annualEUR.toLocaleString()}`');
kthContent = kthContent.replace(/\`SEK \$\{course\.annualSEK\.toLocaleString\(\)\}\`/g, '`€${course.annualEUR.toLocaleString()}`');
fs.writeFileSync(kthFile, kthContent);

// ─── 2. Lund page: annualSEK → annualEUR ───────────────────────────────────
fix('app/universities/lund-university/courses/[slug]/page.tsx', [
  ['course.annualSEK', 'course.annualEUR'],
  ['Annual Fee (SEK)', 'Annual Fee (EUR)'],
]);
let lundFile = 'app/universities/lund-university/courses/[slug]/page.tsx';
let lundContent = fs.readFileSync(lundFile, 'utf8');
lundContent = lundContent.replace(/SEK \$\{course\.annualSEK\.toLocaleString\(\)\}\/SEK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
lundContent = lundContent.replace(/SEK \$\{course\.annualEUR\.toLocaleString\(\)\}\/SEK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
lundContent = lundContent.replace(/`SEK \$\{course\.annualSEK\.toLocaleString\(\)\}`/g, '`€${course.annualEUR.toLocaleString()}`');
lundContent = lundContent.replace(/`SEK \$\{course\.annualEUR\.toLocaleString\(\)\}`/g, '`€${course.annualEUR.toLocaleString()}`');
fs.writeFileSync(lundFile, lundContent);
console.log('✅ Fixed lund page (regex)');

// ─── 3. DTU page: annualDKK → annualEUR ────────────────────────────────────
fix('app/universities/technical-university-of-denmark/courses/[slug]/page.tsx', [
  ['course.annualDKK', 'course.annualEUR'],
  ['Annual Fee (DKK)', 'Annual Fee (EUR)'],
]);
let dtuFile = 'app/universities/technical-university-of-denmark/courses/[slug]/page.tsx';
let dtuContent = fs.readFileSync(dtuFile, 'utf8');
dtuContent = dtuContent.replace(/DKK \$\{course\.annualDKK\.toLocaleString\(\)\}\/DKK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
dtuContent = dtuContent.replace(/DKK \$\{course\.annualEUR\.toLocaleString\(\)\}\/DKK\/yr/g, '€${course.annualEUR.toLocaleString()}/EUR/yr');
dtuContent = dtuContent.replace(/`DKK \$\{course\.annualDKK\.toLocaleString\(\)\}`/g, '`€${course.annualEUR.toLocaleString()}`');
dtuContent = dtuContent.replace(/`DKK \$\{course\.annualEUR\.toLocaleString\(\)\}`/g, '`€${course.annualEUR.toLocaleString()}`');
fs.writeFileSync(dtuFile, dtuContent);
console.log('✅ Fixed DTU page (regex)');

// ─── 4. Khalifa page: annualAED → annualUSD ────────────────────────────────
fix('app/universities/khalifa-university/courses/[slug]/page.tsx', [
  ['course.annualAED', 'course.annualUSD'],
  ['Annual Fee (AED)', 'Annual Fee (USD)'],
]);
let khalifaFile = 'app/universities/khalifa-university/courses/[slug]/page.tsx';
let khalifaContent = fs.readFileSync(khalifaFile, 'utf8');
khalifaContent = khalifaContent.replace(/AED \$\{course\.annualAED\.toLocaleString\(\)\}\/AED\/yr/g, '$${course.annualUSD.toLocaleString()}/USD/yr');
khalifaContent = khalifaContent.replace(/AED \$\{course\.annualUSD\.toLocaleString\(\)\}\/AED\/yr/g, '$${course.annualUSD.toLocaleString()}/USD/yr');
khalifaContent = khalifaContent.replace(/`AED \$\{course\.annualAED\.toLocaleString\(\)\}`/g, '`$${course.annualUSD.toLocaleString()}`');
khalifaContent = khalifaContent.replace(/`AED \$\{course\.annualUSD\.toLocaleString\(\)\}`/g, '`$${course.annualUSD.toLocaleString()}`');
fs.writeFileSync(khalifaFile, khalifaContent);
console.log('✅ Fixed Khalifa page (regex)');

// ─── 5. UAE University data: add alias for uaeUniversityCourses ───────────
let uaeDataFile = 'data/uae-university-courses.ts';
let uaeData = fs.readFileSync(uaeDataFile, 'utf8');
if (!uaeData.includes('uaeUniversityCourses')) {
  uaeData += '\n// Backward-compat alias\nexport const uaeUniversityCourses = uaeuniversityCourses;\n';
  fs.writeFileSync(uaeDataFile, uaeData);
  console.log('✅ Added uaeUniversityCourses alias to uae-university-courses.ts');
}

// ─── 6. Paris-Saclay data: fix double-s export name ───────────────────────
let psFile = 'data/university-of-paris-saclay-courses.ts';
let psContent = fs.readFileSync(psFile, 'utf8');
psContent = psContent
  .replace(/universityOfParisSaclayCoursess/g, 'universityOfParisSaclayCourses')
  .replace(/getUniversityOfParisSaclayCoursessBySlug/g, 'getUniversityOfParisSaclayCourseBySlug');
fs.writeFileSync(psFile, psContent);
console.log('✅ Fixed Paris-Saclay double-s export name');

// ─── 7. New listing pages: fix {u.currSymbol} → actual value ──────────────
const listingFixes = [
  {
    file: 'app/universities/delft-university-of-technology/courses/page.tsx',
    sym: '€',
    intakes: 'September',
    feeField: 'annualEUR',
  },
  {
    file: 'app/universities/eindhoven-university-of-technology/courses/page.tsx',
    sym: '€',
    intakes: 'September',
    feeField: 'annualEUR',
  },
  {
    file: 'app/universities/university-of-auckland/courses/page.tsx',
    sym: 'NZ$',
    intakes: 'February &amp; July',
    feeField: 'annualNZD',
  },
  {
    file: 'app/universities/victoria-university-of-wellington/courses/page.tsx',
    sym: 'NZ$',
    intakes: 'February &amp; July',
    feeField: 'annualNZD',
  },
  {
    file: 'app/universities/united-arab-emirates-university/courses/page.tsx',
    sym: '$',
    intakes: 'September',
    feeField: 'annualUSD',
  },
];

for (const lf of listingFixes) {
  if (!fs.existsSync(lf.file)) { console.log(`⚠️  Not found: ${lf.file}`); continue; }
  let content = fs.readFileSync(lf.file, 'utf8');
  // Replace {u.currSymbol} with actual symbol in JSX text nodes
  content = content.replace(/\{u\.currSymbol\}/g, lf.sym);
  // Fix the p tag average fee line - replace {u.intakes} if present
  content = content.replace(/\{u\.intakes\}/g, lf.intakes === 'February &amp; July' ? 'February & July' : lf.intakes);
  fs.writeFileSync(lf.file, content);
  console.log(`✅ Fixed listing page: ${lf.file}`);
}

// ─── 8. Auckland data: fix interface to include totalUSD ──────────────────
let aklFile = 'data/auckland-courses.ts';
let aklContent = fs.readFileSync(aklFile, 'utf8');
// Add totalUSD to the interface
aklContent = aklContent.replace(
  'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number;',
  'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number; totalUSD?: number;'
);
fs.writeFileSync(aklFile, aklContent);
console.log('✅ Fixed Auckland interface (added totalUSD optional field)');

// ─── 9. Victoria data: same fix for totalUSD ──────────────────────────────
let vicFile = 'data/victoria-courses.ts';
let vicContent = fs.readFileSync(vicFile, 'utf8');
if (vicContent.includes('totalUSD') && !vicContent.includes('totalUSD?')) {
  // Check if interface has totalNZD
  vicContent = vicContent.replace(
    'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number;',
    'annualNZD: number; annualUSD: number; annualINR: number; totalNZD: number; totalUSD?: number;'
  );
  fs.writeFileSync(vicFile, vicContent);
  console.log('✅ Fixed Victoria interface (added totalUSD optional field)');
}

console.log('\nAll fixes applied!');
