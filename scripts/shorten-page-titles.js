// Shorten over-long <title> text across the page templates.
//
// Why: buildMetadata() appends " | Jaivik Overseas Consultants" (30 chars) to every title,
// and the descriptive halves were long enough that 21,776 of 21,789 built pages exceeded
// Google's ~561px / ~60-char truncation point. The brand suffix stays; what goes is the
// repeated boilerplate in front of it.
//
// Ordering principle: the most valuable keyword goes first so truncation eats the generic
// tail, never the course or university name. On a course page that means the course name
// leads and the "IELTS & Requirements for Indian Students" filler — 55 identical characters
// on 20,847 pages — is dropped entirely.
//
// Usage: node scripts/shorten-page-titles.js [--apply]   (default is a dry run)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPLY = process.argv.includes('--apply');

/** Each rule: files to touch, the exact text to find, and its replacement. */
const RULES = [
  {
    name: 'course detail — drop the shared "IELTS & Requirements" filler',
    glob: 'app/universities/*/courses/[slug]/page.tsx',
    edits: [
      { from: ' — ${titleFeeFragment(course as any, course.annualINR)}IELTS & Requirements for Indian Students', to: '' },
      { from: ' — ${titleFeeFragment(c as any, c.annualINR)}IELTS & Requirements for Indian Students', to: '' },
    ],
  },
  {
    name: 'course listing — "International Courses – All Programs, Fees & IELTS" → "Courses — Fees & IELTS"',
    glob: 'app/universities/*/courses/page.tsx',
    edits: [
      { from: ' International Courses – All Programs, Fees & IELTS 2026', to: ' Courses — Fees & IELTS 2026' },
      { from: ' International Courses — Programs, Fees & IELTS 2026', to: ' Courses — Fees & IELTS 2026' },
      { from: ' International Courses – Programs, Fees & IELTS 2026', to: ' Courses — Fees & IELTS 2026' },
      { from: ' Courses 2026 – Programs, Fees & IELTS for Indian Students', to: ' Courses — Fees & IELTS 2026' },
    ],
  },
  {
    name: 'university profile — trim the descriptor',
    glob: 'app/universities/[slug]/page.tsx',
    edits: [
      { from: '${u.name} | Fees, Rankings, Courses & Admissions 2026', to: '${u.name} — Fees, Courses & Admission 2026' },
    ],
  },
  {
    name: 'course category — trim the descriptor',
    glob: 'app/courses/[slug]/page.tsx',
    edits: [
      { from: '${cat.name} Abroad for Indian Students 2026 – Fees, IELTS & Universities', to: '${cat.name} Abroad — Fees, IELTS & Universities' },
      { from: '${c.name} Abroad – Fees, Salary, Eligibility & Top Universities 2026', to: '${c.name} Abroad — Fees, Salary & Universities' },
    ],
  },
];

/** Minimal glob: supports a single '*' path segment, and literal [slug] segments. */
function expand(pattern) {
  const parts = pattern.split('/');
  let dirs = [ROOT];
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    const last = i === parts.length - 1;
    const next = [];
    for (const d of dirs) {
      if (seg === '*') {
        if (!fs.existsSync(d)) continue;
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          if (e.isDirectory()) next.push(path.join(d, e.name));
        }
      } else {
        const p = path.join(d, seg);
        if (!fs.existsSync(p)) continue;
        if (last ? fs.statSync(p).isFile() : fs.statSync(p).isDirectory()) next.push(p);
      }
    }
    dirs = next;
  }
  return dirs;
}

let totalFiles = 0, totalEdits = 0;
for (const rule of RULES) {
  const files = expand(rule.glob);
  let touched = 0, edits = 0;
  for (const f of files) {
    let src = fs.readFileSync(f, 'utf8');
    const before = src;
    for (const e of rule.edits) {
      while (src.includes(e.from)) {
        src = src.replace(e.from, e.to);
        edits++;
      }
    }
    if (src !== before) {
      touched++;
      if (APPLY) fs.writeFileSync(f, src);
    }
  }
  totalFiles += touched;
  totalEdits += edits;
  console.log((APPLY ? 'applied' : 'would apply').padEnd(12) + rule.name);
  console.log('             ' + touched + ' of ' + files.length + ' matched files, ' + edits + ' replacements');
}

console.log('\n' + (APPLY ? 'CHANGED ' : 'WOULD CHANGE ') + totalFiles + ' files, ' + totalEdits + ' replacements');
if (!APPLY) console.log('run with --apply to write');
