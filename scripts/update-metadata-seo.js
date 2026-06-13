// Updates generateMetadata title + description in all 463 course page templates
// to match the proven McMaster ranking pattern for Indian student search intent.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const UNIVERSITIES_DIR = path.join(ROOT, 'app', 'universities');

// Find all course page.tsx files
const pageFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === 'page.tsx' && full.includes('[slug]')) {
      pageFiles.push(full);
    }
  }
}
walk(UNIVERSITIES_DIR);

console.log(`Found ${pageFiles.length} course page files\n`);

let updated = 0;
let skipped = 0;
const errors = [];

for (const file of pageFiles) {
  try {
    let src = fs.readFileSync(file, 'utf8');

    // Extract university name from universityName="..." prop
    const uniNameMatch = src.match(/universityName="([^"]+)"/);
    if (!uniNameMatch) {
      skipped++;
      continue;
    }
    const universityName = uniNameMatch[1];

    // Find the buildMetadata({ ... }) block
    const buildMetaStart = src.indexOf('buildMetadata({');
    if (buildMetaStart === -1) {
      skipped++;
      continue;
    }

    // Extract the generateMetadata function body to find the course variable name
    const genMetaIdx = src.indexOf('generateMetadata');
    const genMetaBody = genMetaIdx !== -1 ? src.slice(genMetaIdx, buildMetaStart) : '';

    // Detect variable name: `const X = getXxx(slug)` or `const X = courses.find(...)`
    const varMatch = genMetaBody.match(/const\s+(\w+)\s*=\s*(?:get\w+\(slug\)|\w+(?:Courses?)?\s*\.\s*find\b|getCoursesBySlug\b)/);
    const varName = varMatch ? varMatch[1] : 'course';

    // Extract the buildMetadata block
    let depth = 0;
    let end = buildMetaStart;
    for (let i = buildMetaStart; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    const metaBlock = src.slice(buildMetaStart, end);

    // Build new title and description using detected variable name
    const v = varName;
    const newTitle = `\${${v}.name} at ${universityName} — Fees, IELTS & Intake for Indian Students 2026`;
    const newDesc = `\${${v}.name} at ${universityName}, \${(${v} as any).city || ${v}.country} costs ₹\${(${v}.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS \${${v}.ieltsMin}+, intakes \${${v}.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`;

    // Replace title and description (backtick template literals)
    const titlePattern = /title:\s*`[^`]*`/;
    const descPattern = /description:\s*`[^`]*`/;

    if (!titlePattern.test(metaBlock) && !descPattern.test(metaBlock)) {
      skipped++;
      continue;
    }

    const newMetaBlock = metaBlock
      .replace(titlePattern, `title: \`${newTitle}\``)
      .replace(descPattern, `description: \`${newDesc}\``);

    if (newMetaBlock === metaBlock) {
      skipped++;
      continue;
    }

    src = src.slice(0, buildMetaStart) + newMetaBlock + src.slice(end);
    fs.writeFileSync(file, src, 'utf8');
    updated++;

    if (updated <= 5 || updated % 50 === 0) {
      console.log(`[${updated}] Updated (var=${v}): ${path.relative(ROOT, file)}`);
    }
  } catch (e) {
    errors.push({ file: path.relative(ROOT, file), error: e.message });
  }
}

console.log(`\n=== DONE ===`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
if (errors.length) {
  console.log(`Errors:  ${errors.length}`);
  errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
}
