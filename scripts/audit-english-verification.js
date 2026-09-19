// Guards the English-verification switch the way scripts/audit-fee-verification.js guards fees.
//
// It fails when a page prints a raw English score (course.ieltsMin / toeflMin / pteMin, or a
// university's requirements.*) without going through lib/english-verification — that is how a
// house-default score ends up published as a requirement.
//
// Run: npm run audit:english
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 5e7 }).toString().trim().split('\n').filter(Boolean);

// A "print" is a template placeholder or a JSX expression — an actual claim on a page.
// Comparisons, filters, sorting and prop passing are not claims, so they are not flagged.
const PRINTS = [
  /\$\{[^}]*\b(course|c|prog|alt|rn|rc)\.(ieltsMin|toeflMin|pteMin)\b/,
  /\{\s*(course|c|prog|alt|rn|rc)\.(ieltsMin|toeflMin|pteMin)\s*\}/,
  /\$\{[^}]*requirements\.(ieltsMin|toeflMin)\b/,
  // a prop assignment (ieltsMin={…}) hands the value to a component that gates it — not a claim
  /(?<!=)\{\s*u\.requirements\.(ieltsMin|toeflMin)\s*\}/,
];
// Hand-curated datasets with no university slug to gate on — the same backlog the fee audit
// carries for components/CourseMatcherClient.tsx. Reported, not failed.
const BACKLOG = [/CourseMatcherClient.tsx/, /CompareClient.tsx/];
const ALLOW = /publishedEnglishTests|isTestPublished|publishedScore|hasPublishedIelts|englishOnRequestNote|publishedIelts|publishedToefl|publishedPte/;

const files = git('ls-files', 'app', 'components', 'lib').filter((f) => /\.(tsx|ts)$/.test(f));
const problems = [];
const backlog = [];
for (const rel of files) {
  const lines = fs.readFileSync(path.join(ROOT, rel), 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    if (!PRINTS.some((re) => re.test(line))) return;
    if (ALLOW.test(line)) return;
    (BACKLOG.some((re) => re.test(rel)) ? backlog : problems).push(`${rel}:${i + 1}: ${t.slice(0, 140)}`);
  });
}

// Coverage: how many registry universities have a publication record yet.
const registry = fs.readFileSync(path.join(ROOT, 'data/university-course-registry.ts'), 'utf8');
const registrySlugs = [...registry.matchAll(/^\s*'([a-z0-9-]+)':\s*m_/gm)].map((m) => m[1]);
const publishedFile = fs.readFileSync(path.join(ROOT, 'data/english-published.ts'), 'utf8');
const known = new Set([...publishedFile.matchAll(/^\s*'([a-z0-9-]+)':\s*\{/gm)].map((m) => m[1]));
const covered = registrySlugs.filter((s) => known.has(s));

console.log(`English publication records: ${known.size} universities`);
console.log(`Registry coverage: ${covered.length} of ${registrySlugs.length} universities with course pages`);
console.log(`Unchecked (default: keep showing what the row carries): ${registrySlugs.length - covered.length}`);

if (backlog.length) {
  console.log(`
Notes (hand-curated data, no slug to gate on — not failures):`);
  for (const b of backlog) console.log('  [backlog] ' + b);
}

if (problems.length) {
  console.log(`\nFAIL — ${problems.length} unguarded English score(s):`);
  for (const p of problems) console.log('  ' + p);
  process.exit(1);
}
console.log('\nPASS — no unguarded English score found.');
