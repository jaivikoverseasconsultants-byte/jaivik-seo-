// List individually-authored page titles that still exceed the truncation budget.
//
// Templates are handled by shorten-page-titles{,-2}.js; what is left is one-off pages whose
// title is a plain string literal in their own page.tsx. buildMetadata() appends
// " | Jaivik Overseas Consultants" (30 chars), so the budget for the authored half is 30.

const fs = require('fs');
const path = require('path');

const BRAND = ' | Jaivik Overseas Consultants';
const LIMIT = 60;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === 'page.tsx') acc.push(p);
  }
  return acc;
}

const rows = [];
for (const f of walk(path.join(__dirname, '..', 'app'))) {
  const src = fs.readFileSync(f, 'utf8');
  if (!src.includes('buildMetadata')) continue;          // raw Metadata objects get no suffix
  const m = /title:\s*'([^']{10,200})'/.exec(src);
  if (!m) continue;
  const authored = m[1];
  const full = authored + BRAND;
  if (full.length <= LIMIT) continue;
  const route = '/' + path.relative(path.join(__dirname, '..', 'app'), f)
    .split(path.sep).slice(0, -1).join('/');
  rows.push({ chars: full.length, route, authored });
}

rows.sort((a, b) => b.chars - a.chars);
console.log('individually-authored titles over ' + LIMIT + ' chars: ' + rows.length + '\n');
for (const r of rows) {
  console.log(String(r.chars).padStart(4) + '  ' + r.route);
  console.log('      ' + r.authored);
}
