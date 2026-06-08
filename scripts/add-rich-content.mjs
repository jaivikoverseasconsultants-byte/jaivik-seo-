/**
 * Injects CourseRichContent into every university course detail page.
 * Run once: node scripts/add-rich-content.mjs
 */
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const APP_UNI_DIR = join(ROOT, 'app', 'universities');

const IMPORT_LINE = `import CourseRichContent from '@/components/CourseRichContent';`;

// ── Slug → readable university name ─────────────────────────────────────────
const KNOWN_NAMES = {
  'mit-massachusetts': 'Massachusetts Institute of Technology',
  'uts-sydney': 'University of Technology Sydney',
  'rmit-university': 'RMIT University',
  'ucl': 'University College London',
  'lse': 'London School of Economics',
  'kth-royal-institute-of-technology': 'KTH Royal Institute of Technology',
  'tu-munich': 'Technical University of Munich',
  'tu-dresden': 'TU Dresden',
  'tu-eindhoven': 'Eindhoven University of Technology',
  'rwth-aachen-university': 'RWTH Aachen University',
  'jcu-brisbane': 'James Cook University Brisbane',
  'cquniversity': 'CQUniversity',
  'sait': 'SAIT Polytechnic',
  'nbcc': 'NBCC',
  'nscc': 'NSCC',
  'upei': 'University of Prince Edward Island',
  'uowd-dubai': 'University of Wollongong Dubai',
  'sp-jain-singapore': 'SP Jain School of Global Management',
  'sp-jain-dubai': 'SP Jain Dubai',
  'psb-academy': 'PSB Academy Singapore',
  'mdis-singapore': 'MDIS Singapore',
  'sim-singapore': 'SIM Singapore',
  'sutd': 'SUTD Singapore',
  'rit-dubai': 'RIT Dubai',
  'wpi': 'Worcester Polytechnic Institute',
  'georgia-tech': 'Georgia Institute of Technology',
  'georgia-institute-of-technology': 'Georgia Institute of Technology',
  'ut-austin': 'University of Texas at Austin',
  'uc-davis': 'UC Davis',
};

const LOWERCASE = new Set(['of', 'the', 'and', 'in', 'at', 'for', 'by', 'to', 'a', 'an']);

function slugToName(slug) {
  if (KNOWN_NAMES[slug]) return KNOWN_NAMES[slug];
  return slug
    .split('-')
    .map((w, i) => {
      if (i > 0 && LOWERCASE.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

// ── Extract university name from schema in the file if possible ──────────────
function extractUniName(content, fallback) {
  const m = content.match(/['"]@type['"]\s*:\s*['"]CollegeOrUniversity['"][\s\S]{0,120}?name\s*:\s*['"]([^'"]{3,80})['"]/);
  if (m) return m[1];
  return fallback;
}

// ── Detect course variable name ──────────────────────────────────────────────
function detectVarName(content) {
  // Most files: const course = getXxxBySlug(slug)
  if (/\n\s+const course\s*=/.test(content)) return 'course';
  // Some files (CMU-style): const c = xxxCourses.find(...)
  if (/\n\s+const c\s*=\s*\w+Courses/.test(content)) return 'c';
  // Fallback
  return 'course';
}

// ── Insertion markers in priority order ──────────────────────────────────────
const MARKERS = [
  // Most templates: CTA banner before sidebar
  '          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">',
  // Some templates: lighter CTA block
  '          <div className="bg-brand-700 text-white rounded-2xl p-6">',
  // Aalborg/minimal style
  '          <div className="bg-brand-50 rounded-2xl p-6">',
  // FU Berlin style CTA section
  '      <section className="bg-brand-50',
  // Generic: any brand-700 CTA before sidebar
  '        <div className="bg-brand-700 rounded-2xl',
];

function findInsertionIndex(content) {
  for (const marker of MARKERS) {
    const idx = content.indexOf(marker);
    if (idx !== -1) return idx;
  }
  return -1;
}

// ── Add import after the last import line ────────────────────────────────────
function addImport(content) {
  // Find the last line that starts with "import "
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i;
  }
  if (lastImportIdx === -1) {
    // No imports found, prepend
    return IMPORT_LINE + '\n' + content;
  }
  lines.splice(lastImportIdx + 1, 0, IMPORT_LINE);
  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────────
const uniEntries = readdirSync(APP_UNI_DIR, { withFileTypes: true }).filter(
  d => d.isDirectory() && !d.name.startsWith('[') && d.name !== 'country' && d.name !== 'city'
);

let updated = 0;
let skipped = 0;
let noMarker = 0;

for (const entry of uniEntries) {
  const uniSlug = entry.name;
  const filePath = join(APP_UNI_DIR, uniSlug, 'courses', '[slug]', 'page.tsx');
  if (!existsSync(filePath)) continue;

  let content = readFileSync(filePath, 'utf8');

  // Skip if already injected
  if (content.includes('CourseRichContent')) {
    skipped++;
    continue;
  }

  const fallbackName = slugToName(uniSlug);
  const uniName = extractUniName(content, fallbackName);
  const varName = detectVarName(content);

  // Find where to insert
  const insertIdx = findInsertionIndex(content);
  if (insertIdx === -1) {
    noMarker++;
    console.warn(`  [SKIP - no marker] ${uniSlug}`);
    continue;
  }

  // Build the JSX to insert (indented to match surrounding context)
  const component = `\n          <CourseRichContent course={${varName} as any} universityName="${uniName}" universitySlug="${uniSlug}" />\n`;

  // Insert component
  content = content.slice(0, insertIdx) + component + content.slice(insertIdx);

  // Add import
  content = addImport(content);

  writeFileSync(filePath, content, 'utf8');
  updated++;
  if (updated % 50 === 0) console.log(`  ${updated} files updated...`);
}

console.log(`\nDone.`);
console.log(`  Updated : ${updated}`);
console.log(`  Skipped (already done): ${skipped}`);
console.log(`  Skipped (no marker found): ${noMarker}`);
