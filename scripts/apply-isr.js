const fs = require('fs');
const path = require('path');

const UNI_DIR = path.join(__dirname, '../app/universities');

let modified = 0;
let skipped = 0;
let errors = [];

const dirs = fs.readdirSync(UNI_DIR);

for (const uni of dirs) {
  const filePath = path.join(UNI_DIR, uni, 'courses', '[slug]', 'page.tsx');
  if (!fs.existsSync(filePath)) continue;

  let src = fs.readFileSync(filePath, 'utf8');

  // Only touch stub files (noIndex: true in generateMetadata)
  if (!src.includes('noIndex: true')) {
    skipped++;
    continue;
  }

  // Skip if already patched
  if (src.includes('export const dynamicParams')) {
    skipped++;
    continue;
  }

  // 1. Replace generateStaticParams body with return []
  //    Handles both `export function` and `export async function`
  const gspRegex = /export (async )?function generateStaticParams\(\)[^{]*\{[\s\S]*?\n\}/;
  if (!gspRegex.test(src)) {
    errors.push(`${uni}: no generateStaticParams found`);
    continue;
  }
  src = src.replace(gspRegex, 'export function generateStaticParams() {\n  return [];\n}');

  // 2. Insert the two export consts immediately before generateStaticParams
  src = src.replace(
    'export function generateStaticParams() {',
    'export const dynamicParams = true;\nexport const revalidate = 86400;\n\nexport function generateStaticParams() {'
  );

  fs.writeFileSync(filePath, src, 'utf8');
  modified++;
}

console.log(`\nDone.`);
console.log(`  Modified : ${modified}`);
console.log(`  Skipped  : ${skipped} (real-data or already patched)`);
if (errors.length) {
  console.log(`  Errors   : ${errors.length}`);
  errors.forEach(e => console.log('    ' + e));
}
